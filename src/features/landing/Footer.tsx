import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';
import whiteLogo from '../../assets/imgs/png/whiteLogo.png';
import iconEmail from '../../assets/imgs/svg/icons/iconEmail.svg';
import iconInstagram from '../../assets/imgs/svg/icons/iconInstagram.svg';

export const Footer = () => (
  <footer className="flex w-full flex-col gap-4 bg-[#011F3B] p-5">
    <section className="flex flex-col gap-2 md:w-full md:flex-row md:items-center md:justify-evenly">
      <div className="flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <img src={whiteLogo} alt="logo spark.ia" className="w-10" />
          <h1 className="text-2xl font-bold text-white">Spark.ia</h1>
        </div>
        <div className="text-white">
          <div className="flex gap-2">
            <img src={iconEmail} alt="" />
            <p>spark-ia@gmail.com</p>
          </div>
          <div className="flex gap-2">
            <img src={iconInstagram} alt="" />
            <p>spark.ia</p>
          </div>
        </div>
      </div>

      <div className="h-[2px] bg-[#FA7807]" />

      <div>
        <ul className="text-white">
          <li>
            <a href="#inicio">Início</a>
          </li>
          <li>
            <a href="#funcionalidades">Funcionalidades</a>
          </li>
          <li>
            <a href="#sobreNos">Sobre nós</a>
          </li>
        </ul>
      </div>

      <div className="h-[2px] bg-[#FA7807]" />

      <div>
        <p className="mb-2 text-[22px] font-bold text-white">
          Transforme seus <br />
          estudos com Spark.ia
        </p>
        <Link to="/signup">
          <Button variant="primary" className="p-3">
            Cadastre-se agora!
          </Button>
        </Link>
      </div>
    </section>

    <div className="mb-6 h-[2px] bg-[#FA7807] text-center text-white">
      <p className="pt-3">&copy; Spark.ia - 2026</p>
    </div>
  </footer>
);
