import { useEffect, useState, type FormEvent } from 'react';
import { BrainCircuit, Check, Loader2, MessageSquareText, Pencil, Plus, Send, User, X } from 'lucide-react';
import { generateQuestions, renameChatbotSession, type GeneratedQuestion } from './chatbotApi';
import { ChatQuestionCard } from './ChatQuestionCard';
import { ApiError } from '../../lib/httpClient';

interface ChatMessage {
  id: number;
  sender: 'Você' | 'Spark';
  kind: 'text' | 'loading' | 'questions';
  text?: string;
  questions?: GeneratedQuestion[];
}

interface ChatSession {
  id: string;
  title: string;
  updatedAt: number;
  messages: ChatMessage[];
}

const STORAGE_KEY = 'sparkia-chatbot-history-v1';
let nextId = 1;

const createSessionId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `chat-${Date.now()}-${Math.random().toString(16).slice(2)}`;
};

const readStoredSessions = (): ChatSession[] => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as ChatSession[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const createEmptySession = (title = 'Nova conversa'): ChatSession => ({
  id: createSessionId(),
  title,
  updatedAt: Date.now(),
  messages: [],
});

// Um texto colado inteiro (artigo grande) não precisa aparecer por completo
// na bolha da conversa -- só serve pra lembrar o que foi pedido.
const MESSAGE_PREVIEW_CHARS = 280;

function previewText(text: string): string {
  return text.length > MESSAGE_PREVIEW_CHARS ? `${text.slice(0, MESSAGE_PREVIEW_CHARS)}…` : text;
}

export const ChatbotPage = () => {
  const [sessions, setSessions] = useState<ChatSession[]>(() => readStoredSessions());
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [editingSessionId, setEditingSessionId] = useState<string | null>(null);
  const [draftSessionTitle, setDraftSessionTitle] = useState('');
  const [content, setContent] = useState('');
  const [quantity, setQuantity] = useState(5);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (sessions.length === 0) {
      const initial = createEmptySession();
      setSessions([initial]);
      setActiveSessionId(initial.id);
      return;
    }

    if (!activeSessionId) {
      setActiveSessionId(sessions[0].id);
      return;
    }

    const exists = sessions.some((session) => session.id === activeSessionId);
    if (!exists) {
      setActiveSessionId(sessions[0].id);
    }
  }, [sessions, activeSessionId]);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const activeSession = sessions.find((session) => session.id === activeSessionId) ?? sessions[0];
  const conversation = activeSession?.messages ?? [];

  const updateActiveSession = (updater: (session: ChatSession) => ChatSession) => {
    setSessions((current) => {
      if (current.length === 0) {
        const fresh = createEmptySession();
        const next = updater(fresh);
        return [next];
      }

      return current.map((session) => (session.id === activeSessionId ? updater(session) : session));
    });
  };

  const createNewConversation = () => {
    const session = createEmptySession('Nova conversa');
    setSessions((current) => [session, ...current]);
    setActiveSessionId(session.id);
    setEditingSessionId(null);
    setContent('');
  };

  const saveSessionTitle = async (sessionId: string) => {
    const trimmed = draftSessionTitle.trim();
    if (!trimmed) {
      setEditingSessionId(null);
      return;
    }

    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId ? { ...session, title: trimmed, updatedAt: Date.now() } : session,
      ),
    );

    try {
      await renameChatbotSession(sessionId, trimmed);
    } catch {
      // Mantém o nome local mesmo se a sincronização do backend falhar.
    }

    setEditingSessionId(null);
    setDraftSessionTitle('');
  };

  const handleSend = async (event: FormEvent) => {
    event.preventDefault();
    const trimmed = content.trim();
    if (!trimmed || isGenerating) return;

    const sessionId = activeSessionId ?? createSessionId();
    const userMessageId = nextId++;
    const loadingId = nextId++;

    const currentSession =
      sessions.find((session) => session.id === sessionId) ?? createEmptySession(trimmed.slice(0, 40) || 'Nova conversa');

    const nextMessages: ChatMessage[] = [
      ...currentSession.messages,
      { id: userMessageId, sender: 'Você', kind: 'text', text: trimmed },
      { id: loadingId, sender: 'Spark', kind: 'loading' },
    ];

    setSessions((current) => {
      const normalized = current.some((session) => session.id === sessionId)
        ? current
        : [{ ...currentSession, id: sessionId, messages: [] }, ...current];

      return normalized.map((session) =>
        session.id === sessionId
          ? {
              ...session,
              id: sessionId,
              title:
                session.title === 'Nova conversa' ? previewText(trimmed) : session.title,
              updatedAt: Date.now(),
              messages: nextMessages,
            }
          : session,
      );
    });

    setActiveSessionId(sessionId);
    setContent('');
    setIsGenerating(true);

    try {
      const result = await generateQuestions(trimmed, quantity);
      const resolvedTitle = result.session.requestedTopic || previewText(trimmed);

      setSessions((current) =>
        current.map((session) =>
          session.id === sessionId
            ? {
                ...session,
                id: result.session.id_chatbot_session || session.id,
                title: resolvedTitle,
                updatedAt: Date.now(),
                messages: session.messages.map((message) =>
                  message.id === loadingId
                    ? {
                        id: loadingId,
                        sender: 'Spark',
                        kind: 'questions',
                        text:
                          result.questions.length === 1
                            ? 'Gerei 1 questão sobre isso:'
                            : `Gerei ${result.questions.length} questões sobre isso:`,
                        questions: result.questions,
                      }
                    : message,
                ),
              }
            : session,
        ),
      );

      setActiveSessionId(result.session.id_chatbot_session || sessionId);
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Não foi possível gerar as questões agora.';
      updateActiveSession((session) => ({
        ...session,
        updatedAt: Date.now(),
        messages: session.messages.map((item) =>
          item.id === loadingId ? { id: loadingId, sender: 'Spark', kind: 'text', text: message } : item,
        ),
      }));
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-[calc(100vh-9rem)] min-h-0 w-full gap-4 overflow-hidden">
      <aside className="hidden w-72 min-h-0 flex-col gap-2 overflow-hidden rounded-card bg-brand-sidebar p-4 md:flex">
        <button
          onClick={createNewConversation}
          className="flex items-center gap-2 rounded-button px-3 py-2 text-sm text-content-secondary transition-colors hover:bg-white/5 hover:text-white"
        >
          <Plus size={18} />
          Nova conversa
        </button>

        <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
          {sessions
            .sort((a, b) => b.updatedAt - a.updatedAt)
            .map((session) => {
              const isActive = session.id === activeSessionId;
              const isEditing = session.id === editingSessionId;

              return (
                <div
                  key={session.id}
                  className={`flex w-full items-start gap-2 rounded-button border px-2 py-2 transition-colors ${
                    isActive
                      ? 'border-brand-cyan/30 bg-brand-cyan/10 text-white'
                      : 'border-transparent bg-transparent text-content-secondary hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveSessionId(session.id)}
                    className="flex min-w-0 flex-1 items-start gap-2 text-left"
                  >
                    <MessageSquareText size={16} className="mt-0.5 shrink-0" />
                    <span className="min-w-0 flex-1">
                      {isEditing ? (
                        <input
                          autoFocus
                          value={draftSessionTitle}
                          onChange={(event) => setDraftSessionTitle(event.target.value)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') saveSessionTitle(session.id);
                            if (event.key === 'Escape') {
                              setEditingSessionId(null);
                              setDraftSessionTitle('');
                            }
                          }}
                          className="w-full rounded-md border border-white/10 bg-brand-background/60 px-2 py-1 text-sm text-content-primary focus:border-brand-cyan focus:outline-none"
                        />
                      ) : (
                        <>
                          <span className="block truncate text-sm font-medium">{session.title || 'Nova conversa'}</span>
                          <span className="mt-1 block text-[11px] text-content-disabled">
                            {session.messages.length > 0 ? `${session.messages.length} mensagens` : 'Iniciando'}
                          </span>
                        </>
                      )}
                    </span>
                  </button>

                  {isEditing ? (
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => saveSessionTitle(session.id)}
                        aria-label="Salvar nome do chat"
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-brand-cyan/15 text-brand-cyan"
                      >
                        <Check size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSessionId(null);
                          setDraftSessionTitle('');
                        }}
                        aria-label="Cancelar edição do nome do chat"
                        className="flex h-7 w-7 items-center justify-center rounded-md bg-white/5 text-content-secondary"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation();
                        setEditingSessionId(session.id);
                        setDraftSessionTitle(session.title || 'Nova conversa');
                      }}
                      aria-label="Editar nome do chat"
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white/5 text-content-secondary hover:text-white"
                    >
                      <Pencil size={14} />
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </aside>

      <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-card bg-brand-card">
        <div className="flex-1 min-h-0 overflow-y-auto p-6">
          {conversation.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 text-center text-content-secondary">
              <BrainCircuit size={48} className="text-brand-cyan" />
              <p className="text-xl font-semibold text-content-primary">Como posso te ajudar hoje?</p>
              <p className="max-w-sm text-sm">
                Cole um texto, um link de conteúdo educacional, ou só descreva um tema — eu identifico a
                disciplina e gero questões estilo ENEM para você estudar.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {conversation.map((message) => {
                const isUser = message.sender === 'Você';
                return (
                  <div key={message.id} className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
                    <div
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                        isUser ? 'bg-brand-orange/15 text-brand-orange' : 'bg-brand-cyan/15 text-brand-cyan'
                      }`}
                    >
                      {isUser ? <User size={16} /> : <BrainCircuit size={16} />}
                    </div>

                    <div
                      className={`flex min-w-0 flex-col gap-1 ${isUser ? 'items-end' : 'items-start'} ${
                        message.kind === 'questions' ? 'w-full' : 'max-w-[75%]'
                      }`}
                    >
                      {message.kind === 'loading' && (
                        <div className="flex items-center gap-1.5 rounded-card rounded-tl-sm bg-brand-sidebar px-4 py-3.5">
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-content-disabled [animation-delay:-0.3s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-content-disabled [animation-delay:-0.15s]" />
                          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-content-disabled" />
                        </div>
                      )}

                      {message.kind === 'text' && (
                        <p
                          className={`whitespace-pre-wrap break-words rounded-card px-4 py-2.5 text-left text-sm leading-relaxed ${
                            isUser
                              ? 'rounded-tr-sm bg-brand-orange text-white'
                              : 'rounded-tl-sm bg-brand-sidebar text-content-primary'
                          }`}
                        >
                          {isUser ? previewText(message.text ?? '') : message.text}
                        </p>
                      )}

                      {message.kind === 'questions' && (
                        <div className="flex w-full min-w-0 flex-col gap-3">
                          <p className="text-sm text-content-secondary">{message.text}</p>
                          {message.questions?.map((question) => (
                            <ChatQuestionCard key={question.id_question} question={question} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form onSubmit={handleSend} className="flex flex-col gap-2 border-t border-white/5 p-4">
          <textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Cole um texto, um link, ou descreva um tema..."
            rows={2}
            maxLength={20000}
            className="w-full resize-none rounded-input border border-white/10 bg-brand-background/60 px-4 py-3 text-sm text-content-primary placeholder:text-content-disabled focus:border-brand-cyan focus:outline-none"
          />
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={quantity}
              onChange={(event) => setQuantity(Number(event.target.value))}
              className="rounded-input border border-white/10 bg-brand-background/60 px-3 py-2 text-sm text-content-primary focus:border-brand-cyan focus:outline-none"
            >
              {[1, 3, 5, 8, 10].map((n) => (
                <option key={n} value={n}>
                  {n} {n > 1 ? 'questões' : 'questão'}
                </option>
              ))}
            </select>
            <button
              type="submit"
              disabled={!content.trim() || isGenerating}
              className="ml-auto flex h-11 w-11 items-center justify-center rounded-input bg-brand-orange text-white transition-colors hover:bg-brand-orange-hover disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Enviar mensagem"
            >
              {isGenerating ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
