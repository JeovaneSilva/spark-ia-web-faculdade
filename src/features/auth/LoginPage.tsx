import { useEffect, useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate, type Location } from 'react-router-dom';
import { BrainCircuit, Eye, EyeOff, Lock, LogIn, Mail, Sparkles } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { Switch } from '../../components/ui/Switch';
import { useAuth } from './useAuth';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [isVisible, setIsVisible] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: Location } | null)?.from?.pathname ?? '/';

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(true), 60);
    return () => clearTimeout(timeout);
  }, []);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    login();
    navigate(from, { replace: true });
  };

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-brand-background px-4 py-4">
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-brand-cyan/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-brand-orange/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(11,42,59,0.6)_100%)]" />

      <div
        className={`relative w-full max-w-4xl rounded-card bg-gradient-to-br from-brand-cyan/40 via-white/5 to-brand-orange/30 p-px shadow-glow transition-all duration-700 ease-out ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
        }`}
      >
        <div className="flex max-h-full w-full flex-col overflow-hidden rounded-card border border-white/5 bg-brand-sidebar/80 backdrop-blur-sm md:flex-row">
          <div className="hidden w-2/5 flex-col justify-between border-r border-white/5 bg-gradient-to-br from-brand-background to-brand-sidebar p-8 md:flex">
            <div className="flex items-center gap-2 text-brand-cyan">
              <BrainCircuit size={26} />
              <span className="text-lg font-bold text-content-primary">Spark.ia</span>
            </div>

            <div className="flex flex-col items-center gap-4 py-6">
              <div className="relative flex h-32 w-32 items-center justify-center rounded-full border border-brand-cyan/40">
                <div className="absolute inset-0 rounded-full border border-brand-cyan/10" />
                <div className="absolute inset-2 rounded-full border border-brand-cyan/20 animate-pulse" />
                <Sparkles size={44} className="text-brand-cyan drop-shadow-[0_0_12px_rgba(34,211,238,0.6)]" />
              </div>
              <p className="max-w-[220px] text-center text-sm text-content-secondary">
                Sua interface inteligente de estudos, sempre pronta para te ajudar.
              </p>
            </div>

            <div className="text-xs text-content-disabled">Acesso seguro e criptografado.</div>
          </div>

          <div className="flex w-full flex-col gap-4 p-6 md:w-3/5 md:p-10">
            <div className="flex items-center gap-2 text-brand-cyan md:hidden">
              <BrainCircuit size={22} />
              <span className="text-base font-bold text-content-primary">Spark.ia</span>
            </div>

            <div className="flex flex-col items-center gap-1 text-center">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-brand-cyan/10 text-brand-cyan ring-1 ring-brand-cyan/30">
                <LogIn size={20} />
              </span>
              <h1 className="text-2xl">Entrar na Spark.ia</h1>
              <p className="text-sm text-content-secondary">Acesse sua conta para continuar estudando</p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm text-content-secondary">
                  Email de acesso
                </label>
                <div className="group relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-content-disabled transition-colors group-focus-within:text-brand-cyan"
                  />
                  <input
                    id="email"
                    type="email"
                    autoComplete="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="voce@exemplo.com"
                    className="w-full rounded-input border border-white/10 bg-brand-background/60 py-3 pl-11 pr-4 text-content-primary shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] placeholder:text-content-disabled transition-all focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/20"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="password" className="text-sm text-content-secondary">
                  Senha
                </label>
                <div className="group relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-content-disabled transition-colors group-focus-within:text-brand-cyan"
                  />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-input border border-white/10 bg-brand-background/60 py-3 pl-11 pr-11 text-content-primary shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] placeholder:text-content-disabled transition-all focus:border-brand-cyan focus:outline-none focus:ring-2 focus:ring-brand-cyan/20"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-content-disabled transition-colors hover:text-content-primary"
                    aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <Switch checked={rememberMe} onChange={setRememberMe} label="Manter-me conectado" />

              <Button type="submit" variant="primary" className="mt-1 w-full shadow-[0_8px_24px_-8px_rgba(255,122,0,0.6)]">
                <LogIn size={18} />
                Entrar
              </Button>
            </form>

            <p className="text-center text-sm text-content-secondary">
              Ainda não tem conta?{' '}
              <Link to="/signup" className="font-medium text-brand-orange hover:text-brand-orange-hover">
                Criar conta
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
