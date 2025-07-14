import * as z from "zod";

export const verifySchemas = z.object({
    code: z.string().length(6, "Verifcation code must be 6 digits")
    
})