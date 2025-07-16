import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/VarificationEmail";
import { ApiResponse } from "@/Types/ApiResponse";


export async function sendVerificationEmail(email: string, username: string, verifyCode: string): Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'you@example.com',
            to: email,
            subject: 'Mystry message | verfication code',
            react: VerificationEmail({username, otp: verifyCode}),
        });
        return { success: true, message: 'succesfully to send verification email' }
    } catch (emailError) {
        console.error("Error sending verification email", emailError)
        return { success: false, message: 'Failed to send verification email' }
    }
}
