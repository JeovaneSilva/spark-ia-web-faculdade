import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Pencil, Plus, Search, Trash2, Upload } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { ListSkeleton } from '../../components/ui/Skeleton';
import { useToast } from '../../components/ui/useToast';
import { ApiError } from '../../lib/httpClient';
import { downloadTextFile } from '../../lib/download';
import { findSubjectByValue, subjects } from '../../lib/subjects';
import { createFlashcard, deleteFlashcard, isCardDue, listFlashcards, type Flashcard } from './flashcardsApi';
import { exportFlashcardsCsv, parseFlashcardsCsv } from './flashcardsCsv';

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase();

// Biblioteca completa: busca, filtro por disciplina, edição, exclusão e
// importação/exportação em CSV.
export const FlashcardsLibraryPage = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const fileInput = useRef<HTMLInputElement>(null);

  const [cards, setCards] = useState<Flashcard[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [subject, setSubject] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importErrors, setImportErrors] = useState<string[]>([]);

  const load = () =>
    listFlashcards()
      .then(setCards)
      .catch((err) => setError(err instanceof ApiError ? err.message : 'Não foi possível carregar seus flashcards.'));

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(() => {
    const term = normalize(search.trim());
    return (cards ?? []).filter(
      (card) =>
        (!subject || card.subject === subject) &&
        (!term || normalize(`${card.question} ${card.answer} ${card.topic ?? ''}`).includes(term)),
    );
  }, [cards, search, subject]);

  const handleDelete = async (card: Flashcard) => {
    if (!window.confirm('Apagar este flashcard? Essa ação não pode ser desfeita.')) return;
    try {
      await deleteFlashcard(card.id_flashcard);
      setCards((current) => current?.filter((item) => item.id_flashcard !== card.id_flashcard) ?? null);
      toast.success('Flashcard apagado.');
    } catch (err) {
      toast.error(err instanceof ApiError ? err.message : 'Não foi possível apagar o flashcard.');
    }
  };

  const handleExport = () => {
    if (!cards?.length) return;
    downloadTextFile('flashcards-spark-ia.csv', exportFlashcardsCsv(filtered.length ? filtered : cards));
    toast.success('Arquivo CSV baixado.');
  };

  const handleImport = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = ''; // permite escolher o mesmo arquivo de novo
    if (!file) return;

    const { cards: parsed, errors } = parseFlashcardsCsv(await file.text());
    setImportErrors(errors);
    if (parsed.length === 0) {
      toast.error('Nenhum cartão válido encontrado no arquivo.');
      return;
    }

    setIsImporting(true);
    let created = 0;
    try {
      // Sequencial: respeita o limite de requisições da API e preserva a ordem.
      for (const card of parsed) {
        await createFlashcard(card);
        created++;
      }
      toast.success(`${created} ${created === 1 ? 'cartão importado' : 'cartões importados'}.`);
    } catch (err) {
      toast.error(
        `${err instanceof ApiError ? err.message : 'Falha ao importar.'} (${created} de ${parsed.length} importados)`,
      );
    } finally {
      setIsImporting(false);
      void load();
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      <Link
        to="/app/flashcards"
        className="flex w-fit items-center gap-2 text-sm text-content-secondary hover:text-content-primary"
      >
        <ArrowLeft size={16} />
        Voltar para disciplinas
      </Link>

      <header className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1>Todos os cartões</h1>
          <p className="text-content-secondary">
            {cards ? `${filtered.length} de ${cards.length} cartões` : 'Busque, edite, importe ou exporte.'}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" disabled={isImporting} onClick={() => fileInput.current?.click()}>
            <Upload size={16} />
            {isImporting ? 'Importando...' : 'Importar CSV'}
          </Button>
          <Button variant="outline" disabled={!cards?.length} onClick={handleExport}>
            <Download size={16} />
            Exportar CSV
          </Button>
          <Button variant="primary" onClick={() => navigate('/app/flashcards/novo')}>
            <Plus size={16} />
            Novo
          </Button>
        </div>
        <input ref={fileInput} type="file" accept=".csv,text/csv" className="hidden" onChange={handleImport} />
      </header>

      {importErrors.length > 0 && (
        <Card variant="incorrect">
          <p className="mb-2 font-semibold">Algumas linhas foram ignoradas:</p>
          <ul className="max-h-40 list-disc overflow-y-auto pl-5 text-sm text-content-secondary">
            {importErrors.map((message) => (
              <li key={message}>{message}</li>
            ))}
          </ul>
        </Card>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <label className="relative flex-1">
          <span className="sr-only">Buscar nos cartões</span>
          <Search size={16} className="pointer-events-none absolute top-1/2 left-3 -translate-y-1/2 text-content-disabled" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Buscar por pergunta, resposta ou tema"
            className="w-full rounded-input border border-white/10 bg-brand-sidebar py-3 pr-4 pl-9 text-content-primary placeholder:text-content-disabled focus:border-brand-orange focus:outline-none"
          />
        </label>
        <select
          value={subject}
          onChange={(event) => setSubject(event.target.value)}
          aria-label="Filtrar por disciplina"
          className="rounded-input border border-white/10 bg-brand-sidebar px-4 py-3 text-content-primary focus:border-brand-orange focus:outline-none"
        >
          <option value="">Todas as disciplinas</option>
          {subjects.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </div>

      {error && <p className="text-status-error">{error}</p>}
      {!error && !cards && <ListSkeleton />}

      {cards && filtered.length === 0 && (
        <Card>
          <p className="text-content-secondary">
            {cards.length === 0
              ? 'Você ainda não tem flashcards. Crie um ou importe um arquivo CSV (colunas: pergunta; resposta; disciplina; tema).'
              : 'Nenhum cartão encontrado com esses filtros.'}
          </p>
        </Card>
      )}

      <ul className="flex flex-col gap-3">
        {filtered.map((card) => (
          <li key={card.id_flashcard} className="flex items-start gap-3 rounded-card bg-brand-card p-4">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-brand-orange/10 px-2.5 py-0.5 font-semibold text-brand-orange">
                  {findSubjectByValue(card.subject)?.label ?? card.subject}
                </span>
                {card.topic && <span className="text-content-secondary">{card.topic}</span>}
                {isCardDue(card) && <span className="text-content-secondary">· pendente</span>}
              </div>
              <p className="line-clamp-2 font-medium break-words">{card.question || 'Pergunta em imagem'}</p>
              <p className="line-clamp-2 text-sm text-content-secondary break-words">{card.answer || 'Resposta em imagem'}</p>
            </div>
            <div className="flex shrink-0 gap-1">
              <button
                onClick={() => navigate(`/app/flashcards/${card.id_flashcard}/editar`)}
                aria-label="Editar"
                className="flex h-10 w-10 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-white/5 hover:text-white"
              >
                <Pencil size={16} />
              </button>
              <button
                onClick={() => handleDelete(card)}
                aria-label="Apagar"
                className="flex h-10 w-10 items-center justify-center rounded-full text-content-secondary transition-colors hover:bg-status-error/10 hover:text-status-error"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
