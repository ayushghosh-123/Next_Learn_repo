import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";

export async function POST(request: Request) {
    await dbConnect();

    try {
        const { username, email, password } = await request.json();

        // Check if username is already taken
        const existingUserVerifiedUsername = await UserModel.findOne({
            username,
            isVerified: true, // ✅ fixed typo
        });

        if (existingUserVerifiedUsername) {
            return Response.json(
                { success: false, message: "Username is already taken" },
                { status: 400 }
            );
        }

        // Check if email already exists
        const existingUserByEmail = await UserModel.findOne({ email });

        // Generate a 5-digit verification code
        const verifyCode = Math.floor(10000 + Math.random() * 90000).toString();

        if (existingUserByEmail) {
            if (existingUserByEmail.isVerfied) {
                return Response.json(
                    { success: false, message: "User already exists with this email" },
                    { status: 400 }
                );
            } else {
                const hashPassword = await bcrypt.hash(password, 10);
                existingUserByEmail.password = hashPassword;
                existingUserByEmail.verifyCode = verifyCode;
                existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000); // 1 hour expiry

                await existingUserByEmail.save();
            }
        } else {
            // Register new user
            const hashPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1);

            const newUser = new UserModel({
                username,
                email,
                password: hashPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false, // ✅ fixed typo
                isAcceptingMessage: true,
                message: [],
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse = await sendVerificationEmail(email, username, verifyCode);
        if (!emailResponse.success) {
            return Response.json(
                {
                    success: false,
                    message: "Failed to send verification email",
                },
                { status: 500 }
            );
        }

        return Response.json(
            {
                success: true,
                message: "User registered successfully. Please verify your email.",
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error registering user", error);
        return Response.json(
            {
                success: false,
                message: "Error registering user",
            },
            { status: 500 } // ✅ added missing status
        );
    }
}


