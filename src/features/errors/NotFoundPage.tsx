import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import img404 from '../../assets/imgs/svg/imgs/404.svg';

export const NotFoundPage = () => (
  <div className="flex min-h-screen w-full flex-col items-center justify-center gap-4 bg-brand-background px-6 py-16 text-center text-content-primary">
    <h1 className="text-3xl font-bold">Algo de errado não está certo!</h1>
    <p className="text-content-secondary">
      Parece que não conseguimos encontrar a página que você estava procurando.
    </p>
    <Link to="/">
      <Button variant="primary">Voltar para o início</Button>
    </Link>
    <img src={img404} alt="Página não encontrada" className="mt-4 w-full max-w-sm" />
  </div>
);
