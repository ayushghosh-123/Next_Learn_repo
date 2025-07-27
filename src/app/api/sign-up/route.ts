import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helper/sendVerificationEmail";
// import { success } from "zod";

export async function POST(request: Request){

     if(request.method !== 'POST'){
    return Response.json(
        {
          success: false,
          message: "Method not allowed",
        },
        {
          status: 400,
        }
      );

    }

    await dbConnect()

    try {
        
       const {username , email , password} = await request.json()
       const existingUserVerifiedUsername =  await UserModel.findOne({
        username,
        isVerfied: true
       })

       if(existingUserVerifiedUsername){
            return Response.json({success: false, message: "Username is already taken"},{ status: 400 })
       }

      const existingUserByEmail = await UserModel.findOne({email})

      const verifyCode = Math.floor(1000 + Math.random() * 90000).toString()

      if(existingUserByEmail){
        if(existingUserByEmail.isVerfied){
            return Response.json({success: false,message: "User already exist with this email"}, {status: 400})
        }
        else{
            const hashPassword = await bcrypt.hash(password, 10)
            existingUserByEmail.password = hashPassword
            existingUserByEmail.verifyCode = verifyCode
            existingUserByEmail.verifyCodeExpiry = new Date(Date.now()+3600000)

            await existingUserByEmail.save()
        }
      }else{
        const hashPassword = await  bcrypt.hash(password, 10)
        const expiryDate = new Date()
        expiryDate.setHours(expiryDate.getHours()+1)

        const newUser = new UserModel({
            username,
            email,
            password: hashPassword,
            verifyCode,
            verifyCodeExpiry: expiryDate,
            isVerfied: false,
            isAcceptingMessage: true,
            message: []
        })

        await newUser.save()
      }

    //   send verfication email
    const emailResponse =  await sendVerificationEmail(email, username, verifyCode)
    if(!emailResponse.success){
        return Response.json({
            success: false,
            message: "Username is already taken"
        }, {
            status: 500
        })
    }

     return Response.json({ success: true, message: "User registre successfully . Please verify your email "}, { status: 201 })
    } catch (error) {
        console.error("Error registring user", error)
        return Response.json({
            success: false,
            message: "Error registring user"
        },{
            status: 400
        })
    }
} 

