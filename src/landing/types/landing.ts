export interface LandingSlide {
  src: string;
  alt: string;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface ServiceLink {
  href: string;
  label: string;
}

export interface SheikhCard {
  initial: string;
  name: string;
  role: string;
  bio: string;
}

export interface Pillar {
  letter: string;
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
  defaultOpen?: boolean;
}

export type ContactIconName = "email" | "phone" | "clock";

export interface ContactRow {
  icon: ContactIconName;
  title: string;
  value: string;
  ltr?: boolean;
}

export interface ContactField {
  label: string;
  placeholder: string;
  type?: "text" | "email" | "tel";
  textarea?: boolean;
  rows?: number;
}