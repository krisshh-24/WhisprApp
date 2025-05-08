import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";

export async function POST(request:Request){
    await dbConnect()
    try{
        const {username,code}=await request.json() 
        const decodedUsername=decodeURI(username)
        const user =await UserModel.findOne({
            username:decodedUsername
        })
        if(!user){
            return Response.json({
                success: false,
                message: "User not found",
              }, { status: 400 });
        }
        const isCodeValid=user.verifyCode === code
        const isCodeNotExpired=new Date(user.verifyCodeExpiry)> new Date()

        if(isCodeValid && isCodeNotExpired){
            user.isVerified=true 
            await user.save()
            return Response.json({
                success: true,
                message: "Account verified successfully",
              }, { status: 200 });
        }else if(!isCodeNotExpired){
            return Response.json({
                success: false,
                message: "Verfication code has expired.Please sign-up again to get a new code.",
              }, { status: 400 });
        }else{
            return Response.json({
                success: false,
                message: "Incorrect verification code",
              }, { status: 500 });
        }
    }catch (err) {
      console.error("Error verifying user", err);
      return Response.json({
        success: false,
        message: "Error verifying user",
      }, { status: 500 });
    }
}