import { useEffect, useState } from 'react';

// A API responde de uma vez, então as etapas são estimadas pelo tempo de
// espera: servem para o usuário entender que algo está acontecendo.
const STAGES = [
  { fromSeconds: 0, text: 'Lendo o conteúdo...' },
  { fromSeconds: 3, text: 'Identificando os tópicos principais...' },
  { fromSeconds: 8, text: 'Elaborando as questões e alternativas...' },
  { fromSeconds: 18, text: 'Revisando as respostas...' },
  { fromSeconds: 30, text: 'Está demorando mais que o normal, só mais um instante...' },
];

export const GeneratingStatus = () => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const stage = [...STAGES].reverse().find((item) => seconds >= item.fromSeconds) ?? STAGES[0];

  return (
    <div
      role="status"
      className="flex items-center gap-3 rounded-card rounded-tl-sm bg-brand-sidebar px-4 py-3 text-sm text-content-secondary"
    >
      <span className="flex items-center gap-1.5" aria-hidden="true">
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-content-disabled [animation-delay:-0.3s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-content-disabled [animation-delay:-0.15s]" />
        <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-content-disabled" />
      </span>
      {stage.text}
    </div>
  );
};
