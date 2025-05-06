import { z } from "zod";

const usernameValidation = z.string()
    .min(2, "Username must be atleast 2 characters")
    .max(32, "Username must have less than 32 characters")
    .regex(/^[a-z0-9_.]+$/i, 'Username must not contain special characters other than _ and .')
    .trim()

const passwordValidation = z.string()
    .min(8, 'Password must be atleast 8 characters long')
    .refine((val) => /[a-z]/.test(val), {
        message: 'Password must contain at least one lowercase letter',
    })
    .refine((val) => /[A-Z]/.test(val), {
        message: 'Password must contain at least one uppercase letter',
    })
    .refine((val) => /\d/.test(val), {
        message: 'Password must contain at least one number',
    })
    .refine((val) => /[\W_]/.test(val), {
        message: 'Password must contain at least one special character',
    })

const signupSchema = z.object({
    fullName: z.string().min(2, "Full name is too short").max(100, "Full name is too long").trim(),
    username: usernameValidation,
    email: z.string().email('Invalid E-mail address').trim(),
    password: passwordValidation.optional(),
    confirmPassword: passwordValidation.optional(),
    oauthId: z.string().optional(),
    oauthProvider: z.string().optional()
}).refine((data) => {
    const isOAuth = data.oauthId && data.oauthProvider;
    const isTraditional = data.email && data.password;
    return isOAuth || isTraditional;
}, {
    message: "Either OAuth credentials or email/password must be provided.",
}).refine((data) => {
    if (data.password && data.confirmPassword)
        return data.password === data.confirmPassword;
    return true;
}, {
    message: "Passwords do not match.",
    path: ["confirmPassword"]
});

export default signupSchema;
