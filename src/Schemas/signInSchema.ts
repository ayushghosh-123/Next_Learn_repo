import * as z from "zod";

export const signInSchemas = z.object({
    identifier: z.string(),
    password: z.string()
    
})