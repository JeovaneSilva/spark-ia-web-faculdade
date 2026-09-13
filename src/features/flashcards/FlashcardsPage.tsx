import { useNavigate } from 'react-router-dom';
import { subjects } from './subjects';

export const FlashcardsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      <header>
        <h1>Escolha uma disciplina</h1>
        <p className="text-content-secondary">Revise o conteúdo com flashcards de repetição espaçada.</p>
      </header>

      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {subjects.map((subject) => {
          const Icon = subject.icon;
          return (
            <li key={subject.slug}>
              <button
                onClick={() => navigate(`/app/flashcards/${subject.slug}/1`)}
                className="flex w-full flex-col items-center gap-3 rounded-card bg-brand-card p-6 text-center transition-colors hover:bg-brand-card/70"
              >
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-orange text-white">
                  <Icon size={28} />
                </span>
                <span className="font-semibold">{subject.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
