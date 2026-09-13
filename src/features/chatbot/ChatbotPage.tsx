import { useState, type FormEvent } from 'react';
import { BrainCircuit, Send } from 'lucide-react';

interface ChatMessage {
  sender: 'Você' | 'Spark';
  text: string;
}

export const ChatbotPage = () => {
  const [conversation, setConversation] = useState<ChatMessage[]>([]);
  const [prompt, setPrompt] = useState('');

  const handleSend = (event: FormEvent) => {
    event.preventDefault();
    if (!prompt.trim()) return;

    setConversation((current) => [...current, { sender: 'Você', text: prompt }]);
    setPrompt('');

    setTimeout(() => {
      setConversation((current) => [
        ...current,
        {
          sender: 'Spark',
          text: 'Essa funcionalidade ainda está em desenvolvimento — em breve vou conseguir gerar questões de verdade a partir do que você enviar!',
        },
      ]);
    }, 500);
  };

  return (
    <div className="flex h-full min-h-[70vh] gap-4">
      <aside className="hidden w-64 flex-col gap-2 rounded-card bg-brand-sidebar p-4 md:flex">
        <button
          onClick={() => setConversation([])}
          className="flex items-center gap-2 rounded-button px-3 py-2 text-sm text-content-secondary transition-colors hover:bg-white/5 hover:text-white"
        >
          <BrainCircuit size={18} />
          Nova conversa
        </button>
      </aside>

      <div className="flex flex-1 flex-col rounded-card bg-brand-card">
        <div className="flex-1 overflow-y-auto p-6">
          {conversation.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-content-secondary">
              <BrainCircuit size={48} className="text-brand-cyan" />
              <p className="text-xl font-semibold text-content-primary">Como posso te ajudar hoje?</p>
              <p className="max-w-sm text-sm">
                Envie um texto ou link de um conteúdo educacional e eu gero questões para você
                estudar.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {conversation.map((message, index) => (
                <div key={index} className={message.sender === 'Você' ? 'text-right' : 'text-left'}>
                  <span className="text-xs font-semibold text-content-secondary">{message.sender}</span>
                  <p
                    className={`mt-1 inline-block rounded-card px-4 py-2 text-sm ${
                      message.sender === 'Você'
                        ? 'bg-brand-orange text-white'
                        : 'bg-brand-sidebar text-content-primary'
                    }`}
                  >
                    {message.text}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex items-center gap-2 border-t border-white/5 p-4">
          <input
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Insira um texto ou URL de um site educacional."
            className="flex-1 rounded-input border border-white/10 bg-brand-background/60 px-4 py-3 text-content-primary placeholder:text-content-disabled focus:border-brand-cyan focus:outline-none"
          />
          <button
            type="submit"
            className="flex h-11 w-11 items-center justify-center rounded-input bg-brand-orange text-white transition-colors hover:bg-brand-orange-hover"
            aria-label="Enviar mensagem"
          >
            <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};
