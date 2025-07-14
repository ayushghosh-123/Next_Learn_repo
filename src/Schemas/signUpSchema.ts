import * as z from "zod";

export const usernamevalidation = z
    .string()
    .min(2, "Username must be atleast 2 Characters")
    .max(20, "Username must be more than 20 characters")
    .regex(/^[a-zA-Z0-9_]{3,16}$/, "Username must not contain special character")


export const signUpSchema = z.object({
    username: usernamevalidation,
    email: z.string().email({message:"Invalid email address"}),
    password: z.string().min(6, {message:"password must be atr least 6 characters" })
    
})