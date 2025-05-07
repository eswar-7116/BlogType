import { z } from "zod";
import { passwordValidation, usernameValidation } from "./common";

const loginSchema = z
  .object({
    // Username login (optional, part of traditional login)
    username: usernameValidation.optional(),

    // Email login (optional, part of traditional login)
    email: z.string().email("Invalid email address").trim().optional(),

    // Password (required for traditional login)
    password: passwordValidation.optional(),

    // OAuth login
    oauthId: z.string().optional(),
    oauthProvider: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isOAuth = data.oauthId && data.oauthProvider;
    const hasPassword = !!data.password;
    const hasEmailOrUsername = !!data.email || !!data.username;
    const isTraditional = hasPassword && hasEmailOrUsername;

    // Must choose exactly one method: either OAuth or traditional (username/email + password)
    if (!((isOAuth && !isTraditional) || (!isOAuth && isTraditional))) {
      ctx.addIssue({
        path: ["email"],
        message: "Use either OAuth or username/email with password, not both.",
        code: z.ZodIssueCode.custom,
      });
    }

    // Traditional login must have password and one of email or username
    if (!isOAuth) {
      if (!hasPassword) {
        ctx.addIssue({
          path: ["password"],
          message: "Password is required for traditional login.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (!data.email && !data.username) {
        ctx.addIssue({
          path: ["username"],
          message: "Username or email is required for traditional login.",
          code: z.ZodIssueCode.custom,
        });
      }
    }

    // OAuth login must not include password, email, or username
    if (isOAuth && (data.password || data.email || data.username)) {
      if (data.password) {
        ctx.addIssue({
          path: ["password"],
          message: "Password should not be provided with OAuth login.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (data.email) {
        ctx.addIssue({
          path: ["email"],
          message: "Email should not be provided with OAuth login.",
          code: z.ZodIssueCode.custom,
        });
      }
      if (data.username) {
        ctx.addIssue({
          path: ["username"],
          message: "Username should not be provided with OAuth login.",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

export default loginSchema;
