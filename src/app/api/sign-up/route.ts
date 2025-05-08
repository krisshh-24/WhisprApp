import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";
import bcrypt from "bcryptjs";

import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request) {
    await dbConnect();
    try {
      const { username, email, password } = await request.json();
  
      const existingUserVerifiedByUsername = await UserModel.findOne({
        username,
        isVerified: true,
      });
  
      if (existingUserVerifiedByUsername) {
        return Response.json({
          success: false,
          message: "Username already taken",
        }, { status: 400 });
      }
  
      const existingUserByEmail = await UserModel.findOne({ email });
      const verifyCode = "123456"
  
      if (existingUserByEmail) {
        if (existingUserByEmail.isVerified) {
          return Response.json({
            success: false,
            message: "User exists with this email",
          }, { status: 400 });
        } else {
          const hashedPassword = await bcrypt.hash(password, 10);
          existingUserByEmail.password = hashedPassword;
          existingUserByEmail.verifyCode = verifyCode;
          existingUserByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
          await existingUserByEmail.save();
        }
      } else {
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date(Date.now() + 3600000);
  
        const newUser = new UserModel({
          username,
          email,
          password: hashedPassword,
          verifyCode,
          verifyCodeExpiry: expiryDate,
          isVerified: false,
          isAcceptingMessage: true,
          messages: [],
        });
  
        await newUser.save();
      }
  
      const emailResponse = await sendVerificationEmail(email, username, verifyCode);
  
      if (!emailResponse.success) {
        return Response.json({
          success: false,
          message: emailResponse.message,
        }, { status: 500 });
      }
  
      return Response.json({
        success: true,
        message: "User registered successfully, please verify your email",
      }, { status: 200 });
  
    } catch (err) {
      console.error("Error registering user", err);
      return Response.json({
        success: false,
        message: "Error registering user",
      }, { status: 500 });
    }
  }
  