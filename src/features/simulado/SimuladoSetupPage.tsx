import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Maximize } from 'lucide-react';
import { enterFullscreen, isFullscreenSupported } from '../../hooks/useFullscreenLock';
import { EnemExamForm } from './EnemExamForm';
import { SimuladoCustomForm } from './SimuladoCustomForm';
import { MAX_FULLSCREEN_EXITS, configToSearch, type SimuladoConfig } from './simuladoConfig';
import { clearSimulado } from './simuladoStorage';

type Mode = 'custom' | 'enem';

const TABS: { mode: Mode; label: string }[] = [
  { mode: 'custom', label: 'Personalizado' },
  { mode: 'enem', label: 'Simular ENEM' },
];

export const SimuladoSetupPage = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>('custom');

  // O clique em "Começar" é o gesto que o navegador exige para a tela cheia;
  // só depois disso abrimos a prova (a tela cheia continua entre rotas).
  const handleStart = async (config: SimuladoConfig) => {
    clearSimulado(); // começar de novo descarta qualquer prova antiga salva
    await enterFullscreen();
    navigate(`/simulado/prova?${configToSearch(config)}`);
  };

  return (
    <div className="flex flex-col gap-6 pb-16">
      <header>
        <h1>Simulado ENEM</h1>
        <p className="text-content-secondary">
          Questões oficiais com cronômetro. O gabarito só aparece quando você finalizar.
        </p>
      </header>

      <div className="flex gap-3 rounded-card border border-brand-orange/30 bg-brand-orange/5 p-4 text-sm">
        <Maximize size={18} className="mt-0.5 shrink-0 text-brand-orange" />
        <p className="text-content-secondary">
          <span className="font-semibold text-content-primary">A prova abre em tela cheia.</span> Sair da tela cheia ou
          trocar de aba é registrado, e na {MAX_FULLSCREEN_EXITS}ª saída a prova é enviada automaticamente.
          {!isFullscreenSupported() &&
            ' Este aparelho não permite tela cheia: nele só a troca de aba é registrada.'}
        </p>
      </div>

      <div role="tablist" aria-label="Tipo de simulado" className="flex gap-2">
        {TABS.map((tab) => (
          <button
            key={tab.mode}
            type="button"
            role="tab"
            aria-selected={mode === tab.mode}
            onClick={() => setMode(tab.mode)}
            className={`rounded-full border px-5 py-2 text-sm font-semibold transition-colors ${
              mode === tab.mode
                ? 'border-brand-orange bg-brand-orange text-white'
                : 'border-white/10 text-content-secondary hover:border-white/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {mode === 'custom' ? <SimuladoCustomForm onStart={handleStart} /> : <EnemExamForm onStart={handleStart} />}
    </div>
  );
};
