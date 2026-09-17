import imgGuilherme from '../../assets/illustrations/imgGuilherme.svg';
import imgIcaro from '../../assets/illustrations/imgIcaro.svg';
import imgJeovane from '../../assets/illustrations/imgJeovane.svg';
import imgWesley from '../../assets/images/wesley_foto.jpeg';

interface Member {
  id: string;
  name: string;
  image: string;
  position: string;
  linkedin?: string;
  instagram?: string;
}

export const members: Member[] = [
  {
    id: '3',
    name: 'Guilherme Rocha',
    image: imgGuilherme,
    position: 'Desenvolvedor Fullstack',
    instagram: 'https://www.instagram.com/_guilherme.rocha_/',
    linkedin: 'https://www.linkedin.com/in/guilherme-rocha-de-almeida-166b16252/',
  },
  {
    id: '4',
    name: 'Ícaro Paiva',
    image: imgIcaro,
    position: 'Desenvolvedor Fullstack',
    instagram: 'https://www.instagram.com/icaropvx_/',
    linkedin: 'https://www.linkedin.com/in/icaro-paiva-579085212/',
  },
  {
    id: '5',
    name: 'Jeovane Lima',
    image: imgJeovane,
    position: 'Desenvolvedor Fullstack',
    instagram: 'https://www.instagram.com/jeovanee.lima/',
    linkedin: 'https://www.linkedin.com/in/jeovanelima/',
  },
  {
    id: '6',
    name: 'Wesley Barros',
    image: imgWesley,
    position: 'Desenvolvedor Mobile',
    instagram: 'https://www.instagram.com/wesley.santos_16/',
    linkedin: 'https://www.linkedin.com/in/wesley-santos-0a2b20334/',
  },
];
