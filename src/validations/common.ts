import { z } from "zod";

// Validation for username:
// - Must be between 2 and 32 characters long
// - Can only contain lowercase/uppercase letters, numbers, underscores, and periods
export const usernameValidation = z
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
export const passwordValidation = z
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
