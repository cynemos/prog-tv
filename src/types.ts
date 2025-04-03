export interface Program {
  id: string
  time: string
  title: string
  description?: string
  vignette?: string;
  summary?: string;
}

export interface Channel {
  id: string
  name: string
  programs: Program[]
  logo?: string; // Ajout du champ logo
}
