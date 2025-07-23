import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z from "zod";
import { usernamevalidation } from "@/Schemas/signUpSchema";

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { username, code } = await request.json();

    const decodeUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodeUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: "User not found",
        },
        { status: 400 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    // Update user as verified
    if(isCodeValid && isCodeNotExpired){
      user.isVerfied = true
      await user.save();
      return Response.json(
        {
          success: true,
          message: "Account verified successfully",
        },
        { status: 200 }
      );
    }else if(!isCodeNotExpired){
      return Response.json(
        {
          success: false,
          message: "Verification code has expired, please signup again to get a new code",
        },
        { status: 200 }
      );
    }else{
      return Response.json(
        {
          success: false,
          message: "Your code is Incorrrect Verification code",
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Error verifying user:", error);
    return Response.json(
      {
        success: false,
        message: "Error verifying user",
      },
      { status: 500 }
    );
  }
}

