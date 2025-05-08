import dbConnect from "@/lib/dbConnect";
// import UserModel from "@/app/model/User";
// import bcrypt from "bcryptjs";

// import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function GET(request: Request) {
    await dbConnect();
    try {
        return Response.json({"message": "madarchod"})
    } catch (err) {
      console.error("Error registering user", err);
      return Response.json({
        success: false,
        message: "Error registering user",
      }, { status: 500 });
    }
  }
  