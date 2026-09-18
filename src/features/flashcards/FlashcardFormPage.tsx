import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ImagePlus, X } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { subjects, findSubjectBySlug } from './subjects';
import { createFlashcard, getFlashcard, updateFlashcard, uploadFlashcardImage } from './flashcardsApi';
import { ApiError } from '../../lib/httpClient';

const inputClassName =
  'w-full px-4 py-3 bg-brand-sidebar border border-white/10 rounded-input text-content-primary placeholder:text-content-disabled focus:border-brand-orange focus:outline-none transition-all';

type ImageField = 'question' | 'answer';

export const FlashcardFormPage = () => {
  const { id } = useParams();
  const isEditing = Boolean(id);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [subjectValue, setSubjectValue] = useState(
    findSubjectBySlug(searchParams.get('materia') ?? undefined)?.value ?? subjects[0].value,
  );
  const [topic, setTopic] = useState('');
  const [question, setQuestion] = useState('');
  const [questionImage, setQuestionImage] = useState<string | null>(null);
  const [answer, setAnswer] = useState('');
  const [answerImage, setAnswerImage] = useState<string | null>(null);
  const [uploadingField, setUploadingField] = useState<ImageField | null>(null);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    getFlashcard(id)
      .then((card) => {
        setSubjectValue(card.subject);
        setTopic(card.topic ?? '');
        setQuestion(card.question);
        setQuestionImage(card.questionImage);
        setAnswer(card.answer);
        setAnswerImage(card.answerImage);
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Não foi possível carregar o flashcard.');
        setIsLoading(false);
      });
  }, [id]);

  const handleImageChange = async (field: ImageField, event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setUploadingField(field);
    setError(null);
    try {
      const url = await uploadFlashcardImage(file);
      if (field === 'question') setQuestionImage(url);
      else setAnswerImage(url);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível enviar a imagem.');
    } finally {
      setUploadingField(null);
    }
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!question.trim() && !questionImage) {
      setError('A pergunta precisa ter texto ou imagem.');
      return;
    }
    if (!answer.trim() && !answerImage) {
      setError('A resposta precisa ter texto ou imagem.');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = {
        question,
        questionImage,
        answer,
        answerImage,
        subject: subjectValue,
        topic: topic || undefined,
      };
      if (id) {
        await updateFlashcard(id, data);
      } else {
        await createFlashcard(data);
      }
      navigate(-1);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Não foi possível salvar o flashcard.');
    } finally {
      setIsSubmitting(false);
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

      <header>
        <h1>{isEditing ? 'Editar flashcard' : 'Novo flashcard'}</h1>
      </header>

      {isLoading ? (
        <p className="text-content-secondary">Carregando...</p>
      ) : (
        <Card>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label htmlFor="subject" className="text-sm text-content-secondary">
                Disciplina
              </label>
              <select
                id="subject"
                value={subjectValue}
                onChange={(event) => setSubjectValue(event.target.value)}
                className={inputClassName}
              >
                {subjects.map((subject) => (
                  <option key={subject.value} value={subject.value}>
                    {subject.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="topic" className="text-sm text-content-secondary">
                Tema (opcional)
              </label>
              <input
                id="topic"
                type="text"
                value={topic}
                onChange={(event) => setTopic(event.target.value)}
                placeholder="ex.: Genética, Revolução Francesa..."
                className={inputClassName}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="question" className="text-sm text-content-secondary">
                Pergunta (texto e/ou imagem)
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(event) => setQuestion(event.target.value)}
                rows={3}
                placeholder="Opcional se houver imagem"
                className={inputClassName}
              />
              <ImagePicker
                field="question"
                imageUrl={questionImage}
                isUploading={uploadingField === 'question'}
                onChange={handleImageChange}
                onRemove={() => setQuestionImage(null)}
              />
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="answer" className="text-sm text-content-secondary">
                Resposta (texto e/ou imagem)
              </label>
              <textarea
                id="answer"
                value={answer}
                onChange={(event) => setAnswer(event.target.value)}
                rows={4}
                placeholder="Opcional se houver imagem"
                className={inputClassName}
              />
              <ImagePicker
                field="answer"
                imageUrl={answerImage}
                isUploading={uploadingField === 'answer'}
                onChange={handleImageChange}
                onRemove={() => setAnswerImage(null)}
              />
            </div>

            {error && <p className="text-status-error">{error}</p>}

            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting || uploadingField !== null}
              className="w-fit"
            >
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </form>
        </Card>
      )}
    </div>
  );
};

interface ImagePickerProps {
  field: ImageField;
  imageUrl: string | null;
  isUploading: boolean;
  onChange: (field: ImageField, event: ChangeEvent<HTMLInputElement>) => void;
  onRemove: () => void;
}

const ImagePicker = ({ field, imageUrl, isUploading, onChange, onRemove }: ImagePickerProps) => {
  const inputId = `${field}-image`;

  if (imageUrl) {
    return (
      <div className="flex items-center gap-3">
        <img src={imageUrl} alt="" className="h-16 w-16 rounded-input object-cover" />
        <Button type="button" variant="outline" onClick={onRemove}>
          <X size={16} />
          Remover imagem
        </Button>
      </div>
    );
  }

  return (
    <div>
      <label
        htmlFor={inputId}
        className="flex w-fit cursor-pointer items-center gap-2 rounded-input border border-dashed border-white/20 px-4 py-2 text-sm text-content-secondary transition-colors hover:border-brand-orange hover:text-content-primary"
      >
        <ImagePlus size={16} />
        {isUploading ? 'Enviando...' : 'Adicionar imagem (opcional)'}
      </label>
      <input
        id={inputId}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        disabled={isUploading}
        onChange={(event) => onChange(field, event)}
        className="hidden"
      />
    </div>
  );
};
