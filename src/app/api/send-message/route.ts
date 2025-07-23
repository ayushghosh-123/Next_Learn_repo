import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { Message } from "@/model/User";
import { success } from "zod";

export async function POST(request:Request){
    await dbConnect()

    const {username, content} = await request.json()
    try {
        const user = await UserModel.findOne({username})
        if(!user){
            return Response.json({
                success: false,
                message: "user not found"
            },
            {
                status: 404
            })
        }
        if (!user.isAcceptingMessage) {
            return Response.json(
                {
                    success: false,
                    message: "User is not acceepting messages"
                },{
                    status: 403
                }
            )
        }

        const newMessage= {content, createdAt: new Date()} 
        user.message.push(newMessage as Message)
        await user.save()
        
         return Response.json(
                {
                    success: false,
                    message: "message sent succesfully"
                },{
                    status: 201
                }
            )
    } catch (error) {
         console.error("Error adding messages:", error); // More specific error message
        return Response.json(
            {
                success: false,
                message: "Internal Server Error",
            },
            { status: 500 }
        );
    }
}