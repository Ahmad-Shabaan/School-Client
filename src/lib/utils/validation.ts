import type { FieldValues } from "react-hook-form";
import * as z from "zod";
const info = z.object({
  firstName: z
    .string()
    .min(2, "First name is required")
    .max(50, "First name is too long")
    .regex(
      /^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/,
      "First name contains invalid characters",
    ),

  lastName: z
    .string()
    .min(2, "Last name is required")
    .max(50, "Last name is too long")
    .regex(/^[A-Za-zÀ-ÖØ-öø-ÿ\s'-]+$/, "Last name contains invalid characters"),
});
const email = z.email("Please enter a valid email address");
const address = z.object({
  country: z
    .string()
    .min(2, "Country is required")
    .max(100, "Country name is too long"),

  city: z.string().min(2, "City is required").max(100, "City name is too long"),

  state: z
    .string()
    .min(2, "State / Governorate is required")
    .max(100, "State name is too long"),

  street: z
    .string()
    .min(3, "Street address is required")
    .max(200, "Street address is too long"),

  postalCode: z
    .string()
    .min(3, "Postal code is required")
    .max(20, "Postal code is wrong")
    .regex(/^[A-Za-z0-9\s-]+$/, "Postal code contains invalid characters"),
});

const password = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/[0-9]/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );
const confirmPassword = z
  .string()
  .min(8, "Confirm Password must be at least 8 characters");

const credentials = z.object({
  password,
  email,
});

export const addressSchema = z.object({
  ...info.shape,
  ...address.shape,
  deliveryMethodId: z.string().nonempty("Delivery method is required"),
});

export const signupSchema = z
  .object({
    ...info.shape,
    ...credentials.shape,
    ...address.shape,
    displayName: z
      .string()
      .min(2, "Display name is required")
      .max(50, "Display name must be at most 50 characters"),
    phoneNumber: z
      .string()
      .min(7, "Phone number is wrong")
      .max(20, "Phone number is wrong")
      .regex(/^[+]?[0-9\s\-().]+$/, "Phone number contains invalid characters"),
    confirmPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const infoFormSchema = z.object({
  ...info.shape,
});
export const userSchema = z.object({
  ...info.shape,
  email,
  role: z.string().nonempty("Please select a role."),
});

export const updateUserSchema = z.object({
  ...info.shape,
});

export const courseSchema = z.object({
  name: z
    .string()
    .min(2, "Course name is required")
    .max(120, "Course name is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long"),
  file: z
    .file({ message: "Course image is required" })
    .max(5_000_000, "Image must be 5MB or smaller"),
});

export const updateCourseSchema = z.object({
  name: z
    .string()
    .min(2, "Course name is required")
    .max(120, "Course name is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(1000, "Description is too long"),
  file: z
    .file({ message: "Please choose a valid file" })
    .max(5_000_000, "Image must be 5MB or smaller")
    .optional(),
});

export const enrollStudentsSchema = z.object({
  emails: z
    .array(z.string())
    .min(1, "Select at least one student to enroll."),
});

export const lessonSchema = z.object({
  title: z
    .string()
    .min(2, "Lesson title is required")
    .max(500, "Lesson title is too long"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters")
    .max(2000, "Description is too long"),
  youtubeUrl: z
    .union([z.url("Enter a valid YouTube URL"), z.literal("")])
    .optional(),
  meetingUrl: z
    .union([z.url("Enter a valid meeting URL"), z.literal("")])
    .optional(),
  meetingDateTime: z.string().optional(),
  goals: z.array(
    z.object({
      text: z
        .string()
        .min(1, "Goal is required")
        .max(1000, "Goal is too long"),
    }),
  ),
  resources: z.array(
    z.object({
      title: z
        .string()
        .min(1, "Resource title is required")
        .max(500, "Resource title is too long"),
      fileUrl: z
        .string()
        .min(1, "Resource URL is required")
        .max(2000, "Resource URL is too long")
        .url("Enter a valid URL"),
      fileType: z.string().max(100).optional(),
    }),
  ),
});

export const quizSchema = z
  .object({
    title: z
      .string()
      .min(1, "Quiz title is required")
      .max(500, "Quiz title is too long"),
    passingScorePercent: z
      .number({ message: "Passing score is required" })
      .min(0, "Passing score cannot be negative")
      .max(100, "Passing score cannot exceed 100"),
    questions: z
      .array(
        z.object({
          text: z
            .string()
            .min(1, "Question text is required")
            .max(2000, "Question text is too long"),
          correctIndex: z
            .number({ message: "Select the correct answer" })
            .min(0, "Select the correct answer"),
          options: z
            .array(
              z.object({
                text: z
                  .string()
                  .min(1, "Option text is required")
                  .max(1000, "Option text is too long"),
              }),
            )
            .min(2, "Each question needs at least two options")
            .max(20, "A question cannot have more than 20 options"),
        }),
      )
      .min(1, "Add at least one question"),
  })
  .superRefine((data, ctx) => {
    data.questions.forEach((question, questionIndex) => {
      if (question.correctIndex >= question.options.length) {
        ctx.addIssue({
          code: "custom",
          message: "Select the correct answer",
          path: ["questions", questionIndex, "correctIndex"],
        });
      }
    });
  });

export const loginSchema = z.object({
  ...credentials.shape,
});

export const forgetPasswordSchema = z.object({
  email,
});
export const resetPasswordSchema = z
  .object({
    password,
    confirmPassword,
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type AddressSchema = z.infer<typeof addressSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
export type CreateUserFormValues = z.infer<typeof userSchema>;
type InfoFormValues = z.infer<typeof infoFormSchema>;
export interface InfoForm extends InfoFormValues, FieldValues {}

export type UpdateUserFormValues = z.infer<typeof updateUserSchema>;

export type CreateCourseFormValues = z.infer<typeof courseSchema>;

export type UpdateCourseFormValues = z.infer<typeof updateCourseSchema>;

export type EnrollStudentsFormValues = z.infer<typeof enrollStudentsSchema>;

export type LessonFormValues = z.infer<typeof lessonSchema>;

export type QuizFormValues = z.infer<typeof quizSchema>;

export type LoginSchema = z.infer<typeof loginSchema>;
export type ForgetPasswordSchema = z.infer<typeof forgetPasswordSchema>;
export type ResetPasswordSchema = z.infer<typeof resetPasswordSchema>;
