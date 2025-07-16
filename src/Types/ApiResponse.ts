import { Message } from "@/model/User";

export interface ApiResponse{
    success: boolean;
    message: string;
    isAcesptingMessages?: boolean
    messages?: Array<Message>
}

