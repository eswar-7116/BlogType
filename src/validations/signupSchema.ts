import { z } from "zod";

// Validation for username:
// - Must be between 2 and 32 characters long
// - Can only contain lowercase/uppercase letters, numbers, underscores, and periods
const usernameValidation = z
  .string()
  .min(2, "Username must be atleast 2 characters")
  .max(32, "Username must have less than 32 characters")
  .regex(
    /^[a-z0-9_.]+$/i,
    "Username must not contain special characters other than _ and ."
  )
  .trim();

// Validation for password:
// - Must be at least 8 characters long
// - Must contain at least one lowercase letter, one uppercase letter, one number, and one special character
const passwordValidation = z
  .string()
  .min(8, "Password must be atleast 8 characters long")
  .refine((val) => /[a-z]/.test(val), {
    message: "Password must contain at least one lowercase letter",
  })
  .refine((val) => /[A-Z]/.test(val), {
    message: "Password must contain at least one uppercase letter",
  })
  .refine((val) => /\d/.test(val), {
    message: "Password must contain at least one number",
  })
  .refine((val) => /[\W_]/.test(val), {
    message: "Password must contain at least one special character",
  });

// Schema for user signup validation
const signupSchema = z
  .object({
    // Full name validation: between 2 and 100 characters long
    fullName: z
      .string()
      .min(2, "Full name is too short")
      .max(100, "Full name is too long")
      .trim(),

    // Username validation
    username: usernameValidation,

    // Email validation: optional, but required for traditional signups
    email: z.string().email("Invalid E-mail address").trim().optional(),

    // Password validation: optional, but required for traditional signups
    password: passwordValidation.optional(),

    // Password confirmation validation: optional, but required for traditional signups
    confirmPassword: passwordValidation.optional(),

    // OAuth ID and provider: optional, required for OAuth signups
    oauthId: z.string().optional(),
    oauthProvider: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Check if the user is signing up using OAuth or traditional method
    const isOAuth = data.oauthId && data.oauthProvider;
    const isTraditional = data.email && data.password && data.confirmPassword;

    // Ensure that either OAuth or traditional signup is provided, not both
    if (!((isOAuth && !isTraditional) || (!isOAuth && isTraditional))) {
      ctx.addIssue({
        path: ["email"],
        message: "Either OAuth credentials or email/password must be provided.",
        code: z.ZodIssueCode.custom,
      });
    }

    // If OAuth is used, passwords should not be provided
    if (isOAuth && (data.password || data.confirmPassword)) {
      ctx.addIssue({
        path: ["password"],
        message: "Password should not be provided with OAuth login.",
        code: z.ZodIssueCode.custom,
      });
    }

    // If traditional signup is chosen, email is required
    if (isTraditional && !data.email) {
      ctx.addIssue({
        path: ["email"],
        message: "Email is required for traditional signup.",
        code: z.ZodIssueCode.custom,
      });
    }

    // Passwords must match for traditional signup
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        path: ["confirmPassword"],
        message: "Passwords do not match.",
        code: z.ZodIssueCode.custom,
      });
    }
  });

export default signupSchema;
