import type {
  Lesson,
  Student,
  StudentCourse,
  StudentNotification,
} from "../type/student";

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

export const initialLessonsData: Lesson[] = [
  {
    id: 1,
    title: "مدخل إلى علم الفقه",
    icon: "⚖",
    description:
      "تعريف علم الفقه وبيان أهميته ومكانته في دراسة العلوم الشرعية.",
    duration: "45 دقيقة",
  },
  {
    id: 2,
    title: "أحكام الطهارة",
    icon: "💧",
    description:
      "دراسة أحكام الطهارة والوضوء والغُسل وما يتعلق بها من مسائل.",
    duration: "50 دقيقة",
  },
  {
    id: 3,
    title: "أحكام الصلاة",
    icon: "☾",
    description:
      "بيان أحكام الصلاة وشروطها وأوقاتها وما يتعلق بها من مسائل.",
    duration: "55 دقيقة",
  },
  {
    id: 4,
    title: "شروط الصلاة",
    icon: "✦",
    description:
      "التعرف على شروط الصلاة التي لا تصح الصلاة إلا باستكمالها.",
    duration: "40 دقيقة",
  },
  {
    id: 5,
    title: "أركان الصلاة",
    icon: "◈",
    description:
      "شرح أركان الصلاة وبيان كيفية أدائها على الوجه الصحيح.",
    duration: "48 دقيقة",
  },
  {
    id: 6,
    title: "واجبات الصلاة",
    icon: "📖",
    description:
      "دراسة واجبات الصلاة والفرق بينها وبين الأركان والسنن.",
    duration: "42 دقيقة",
  },
  {
    id: 7,
    title: "سنن الصلاة",
    icon: "✧",
    description:
      "التعرف على سنن الصلاة وآدابها وما يستحب للمصلي فعله.",
    duration: "45 دقيقة",
  },
  {
    id: 8,
    title: "مبطلات الصلاة",
    icon: "⚠",
    description:
      "بيان الأمور التي تؤدي إلى بطلان الصلاة والأحكام المتعلقة بها.",
    duration: "50 دقيقة",
  },
  {
    id: 9,
    title: "مقدمة في العقيدة",
    icon: "☀",
    description:
      "مقدمة في أصول العقيدة وأهم المسائل التي يحتاج إليها طالب العلم.",
    duration: "55 دقيقة",
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