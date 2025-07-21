import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import z, { success } from "zod";
import { usernamevalidation } from "@/Schemas/signUpSchema";

const UsernameQuerySchema = z.object({
  username: usernamevalidation,
});

export async function GET(request: Request) {
    // Todo use this all otheer routes

    if(request.method !== 'GET'){
    return Response.json(
        {
          success: false,
          message: "Method not allowed",
        },
        {
          status: 405,
        }
      );

    }
  await dbConnect();
  try {
    // Extract search params from URL
    const { searchParams } = new URL(request.url);
    const queryParam = {
      username: searchParams.get("username"),
    };

    // validatewith zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result); //Todo: remove
    if (!result.success) {
      const usernameErrors = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameErrors?.length > 0
              ? usernameErrors.join(", ")
              : "Invalid Query params",
        },
        {
          status: 400,
        }
      );
    }

    const { username } = result.data;

    const existingVerifiedUser = await UserModel.findOne({
      username,
      isVerified: true,
    });

    if (existingVerifiedUser) {
      return Response.json(
        {
          success: false,
          message: "userName is already taken",
        },
        {
          status: 400,
        }
      );
    }

     return Response.json(
        {
          success: true,
          message: "userName is enique",
        },
        {
          status: 200,
        }
      );
  } catch (error) {
    console.error("Error checking username", error);
    return Response.json(
      {
        success: false,
        message: "Error checking username",
      },
      { status: 500 }
    );
  }
}
