import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";

export async function POST(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOption);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticate",
            },
            { status: 500 }
        );
    }

    const userId = user._id;
    const { acceptmessage } = await request.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptmessage },
            { new: true }
        );
        if (!updatedUser) {
            return Response.json(
                {
                    success: false,
                    message: "failed to update user status to accept message",
                },
                {
                    status: 401,
                }
            );
        }
        return Response.json(
            {
                success: true,
                message: "Message acceptance update succesully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log("failed to update user status to accept messages");
        return Response.json(
            {
                success: false,
                message: "failed to update user status to accept message",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOption);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticate",
            },
            { status: 500 }
        );
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);
        if (!foundUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }

        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage,
            },
            {
                status: 404,
            }
        );
    } catch (error) { 
        console.log("failed to update user status to accept messages");
        return Response.json(
            {
                success: false,
                message: "Error is getting message accceptance status",
            },
            {
                status: 500,
            }
        );
    }
}
