import { getServerSession } from "next-auth";
import { AuthOptions } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import { authOption } from "../auth/[...nextauth]/option";
import mongoose from "mongoose";

export async function GET(request: Request) {
    await dbConnect();

    const session = await getServerSession(authOption);
    const user: User = session?.user as User;

    if (!session || !session.user) {
        return Response.json(
            {
                success: false,
                message: "Not Authenticated",
            },
            { status: 401 } // Changed to 401 for unauthorized
        );
    }

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const userData = await UserModel.aggregate([
            {
                $match: { _id: userId },
            },
            {
                $unwind: { path: '$messages' } // Corrected syntax for $unwind
            },
            {
                $sort: { 'messages.createdAt': -1 }
            },
            {
                $group: {
                    _id: '$_id', messages: {
                        $push: '$messages'
                    }
                }
            }
        ]);

        // This condition likely intends to check if userData is empty
        // If userData is empty, it means no messages were found for the user.
        if (!userData || userData.length === 0) {
            return Response.json(
                {
                    success: true, // Still success if user exists but has no messages
                    message: "No messages found for this user.",
                    data: []
                },
                { status: 200 }
            );
        }

        return Response.json(
            {
                success: true,
                data: userData,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error fetching user messages:", error); // More specific error message
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}
