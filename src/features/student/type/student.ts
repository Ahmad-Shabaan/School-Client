export interface Student {
  name: string;
  age: number;
  country: string;
  level: string;
  image?: string;
  progress: number;
}

export interface StudentCourse {
  id: number;
  name: string;
  icon: string;
  description: string;
  progress: number;
}

export interface StudentNotification {
  id: number;
  message: string;
  time: string;
  unread?: boolean;
}