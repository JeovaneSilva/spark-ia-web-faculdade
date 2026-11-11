// Bloco cinza no lugar do conteúdo que ainda está carregando. Sem animação
// de pulso: só indica que o espaço será preenchido.
export const Skeleton = ({ className = '' }: { className?: string }) => (
  <div aria-hidden="true" className={`rounded-card bg-white/5 ${className}`} />
);

// Grade de cartões de disciplina enquanto a lista carrega.
export const SubjectGridSkeleton = ({ count = 8 }: { count?: number }) => (
  <div role="status" aria-label="Carregando" className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
    {Array.from({ length: count }, (_, index) => (
      <Skeleton key={index} className="h-40" />
    ))}
  </div>
);

// Linhas de lista (ex.: cartões, provas).
export const ListSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div role="status" aria-label="Carregando" className="flex flex-col gap-3">
    {Array.from({ length: rows }, (_, index) => (
      <Skeleton key={index} className="h-16" />
    ))}
  </div>
);
