import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";
import {Message} from "@/app/model/User"

export async function POST(request:Request){
    await dbConnect()
    const {username,content}=await request.json()
    try{
        const user=await UserModel.findOne({username})
        if (!user){
            return Response.json({
                success:false,
                message:"User not found"
            },{
                status:404
            })
        }
        //is user accepting the messages
        if(!user.isAcceptingMessage){
            return Response.json({
                success:false,
                message:"User not accepting messages"
            },{
                status:403
            })
        }
        const newMessage={content,createdAt:new Date()}
        user.messages.push(newMessage as Message);
        await user.save()
        return Response.json({
            success:true,
            message:"message sent successfully"
        },{
            status:200
        })
    }catch(err){
        return Response.json({
            success:false,
            message:"Internal server error "
        },{
            status:500
        })
    }
}