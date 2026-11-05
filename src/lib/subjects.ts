import {
  Atom,
  BookMarked,
  BookOpen,
  Brain,
  Calculator,
  Dna,
  Dumbbell,
  FlaskConical,
  Globe,
  Hourglass,
  Languages,
  MessageCircle,
  PenLine,
  Palette,
  Users,
  type LucideIcon,
} from 'lucide-react';

// "value" precisa bater exatamente com o enum Subject do backend (Prisma).
export interface SubjectOption {
  slug: string;
  label: string;
  icon: LucideIcon;
  value: string;
}

export const subjects: SubjectOption[] = [
  { slug: 'portugues', label: 'Português', icon: BookOpen, value: 'PORTUGUES' },
  { slug: 'literatura', label: 'Literatura', icon: BookMarked, value: 'LITERATURA' },
  { slug: 'ingles', label: 'Inglês', icon: Languages, value: 'INGLES' },
  { slug: 'espanhol', label: 'Espanhol', icon: MessageCircle, value: 'ESPANHOL' },
  { slug: 'artes', label: 'Artes', icon: Palette, value: 'ARTES' },
  { slug: 'educacao-fisica', label: 'Educação Física', icon: Dumbbell, value: 'EDUCACAO_FISICA' },
  { slug: 'historia', label: 'História', icon: Hourglass, value: 'HISTORIA' },
  { slug: 'geografia', label: 'Geografia', icon: Globe, value: 'GEOGRAFIA' },
  { slug: 'filosofia', label: 'Filosofia', icon: Brain, value: 'FILOSOFIA' },
  { slug: 'sociologia', label: 'Sociologia', icon: Users, value: 'SOCIOLOGIA' },
  { slug: 'fisica', label: 'Física', icon: Atom, value: 'FISICA' },
  { slug: 'quimica', label: 'Química', icon: FlaskConical, value: 'QUIMICA' },
  { slug: 'biologia', label: 'Biologia', icon: Dna, value: 'BIOLOGIA' },
  { slug: 'matematica', label: 'Matemática', icon: Calculator, value: 'MATEMATICA' },
  { slug: 'redacao', label: 'Redação', icon: PenLine, value: 'REDACAO' },
];

export const findSubjectBySlug = (slug: string | undefined) => subjects.find((item) => item.slug === slug);

export const findSubjectByValue = (value: string | undefined) => subjects.find((item) => item.value === value);
