import { Brain, Calculator, Dna, FlaskConical, Globe, Hourglass, Lightbulb, Users, type LucideIcon } from 'lucide-react';

export interface Subject {
  slug: string;
  label: string;
  icon: LucideIcon;
}

export const subjects: Subject[] = [
  { slug: 'matematica', label: 'Matemática', icon: Calculator },
  { slug: 'historia', label: 'História', icon: Hourglass },
  { slug: 'biologia', label: 'Biologia', icon: Dna },
  { slug: 'geografia', label: 'Geografia', icon: Globe },
  { slug: 'quimica', label: 'Química', icon: FlaskConical },
  { slug: 'filosofia', label: 'Filosofia', icon: Brain },
  { slug: 'fisica', label: 'Física', icon: Lightbulb },
  { slug: 'sociologia', label: 'Sociologia', icon: Users },
];
