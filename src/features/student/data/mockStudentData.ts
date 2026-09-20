import type { Student, StudentCourse, StudentNotification } from "../type/student";

export const initialStudentData: Student = {
  name: "أحمد محمد عبدالله",
  age: 22,
  country: "مصر",
  level: "المستوى الثالث",
  image: "",
  progress: 75,
};

export const initialCoursesData: StudentCourse[] = [
  {
    id: 1,
    name: "الفقه وأصوله",
    icon: "⚖",
    description: "دراسة الأحكام الشرعية العملية وأصول الاستنباط.",
    progress: 80,
  },
  {
    id: 2,
    name: "العقيدة",
    icon: "✦",
    description: "دراسة أصول الإيمان والمسائل العقدية.",
    progress: 65,
  },
  {
    id: 3,
    name: "التفسير",
    icon: "📖",
    description: "فهم معاني القرآن الكريم وتدبر آياته.",
    progress: 90,
  },
  {
    id: 4,
    name: "اللغة العربية",
    icon: "ع",
    description: "دراسة اللغة العربية لفهم النصوص الشرعية.",
    progress: 55,
  },
  {
    id: 5,
    name: "المقرأة",
    icon: "☾",
    description: "مراجعة وحفظ القرآن الكريم مع الشيخ.",
    progress: 70,
  },
];

export const initialNotificationsData: StudentNotification[] = [
  {
    id: 1,
    message: "لديك واجب جديد في الفقه",
    time: "منذ 10 دقائق",
    unread: true,
  },
  {
    id: 2,
    message: "تم إضافة درس جديد في التفسير",
    time: "منذ ساعة",
    unread: true,
  },
  {
    id: 3,
    message: "لديك رسالة جديدة",
    time: "منذ ساعتين",
    unread: true,
  },
];