import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z, { success } from "zod";
import { usernamevalidation } from "@/Schemas/signUpSchema";

export async function POST(params:Request) {
    await dbConnect()

    try {
        
    } catch (error) {
        
    }
}