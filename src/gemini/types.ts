export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  year: string;
}

export interface Exhibition {
  id: string;
  title: string;
  location: string;
  date: string;
  description: string;
}

export interface Stats {
  label: string;
  value: string;
  description: string;
}
