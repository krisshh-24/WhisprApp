import dbConnect from "@/lib/dbConnect";
import UserModel from "@/app/model/User";
import {z} from 'zod'
import { usernameValidation } from "@/schemas/signUpSchema";

const UsernameQuerySchema=z.object({
    username:usernameValidation
})

 export async function GET(request:Request){
if(request.method!=='GET'){
    return Response.json({
        success:false,
        message:'Method not allowed'
    },{
        status:405
    })
}

    await dbConnect();
    try{
        const {searchParams}=new URL(request.url)
        const queryParam={
            username:searchParams.get('username')
        }
        //validate with zod
        const result=UsernameQuerySchema.safeParse(queryParam)
        if(!result.success){
            const usernameError=result.error.format().username?._errors || []
            return Response.json({
                success:false,
                message:'Invalid query parameter'
            },{
                status:400
            })
        }

        const {username} =result.data
       const existingVerifiedUser=await  UserModel.findOne({username,isVerified:true})
       if(existingVerifiedUser){
        return Response.json({
            success:false,
            message:'Username is already taken'
        },{
            status:400
        })
       }else{ return Response.json({
        success:true,
        message:'Username is unique'
    },{
        status:200
    })}
        

    }catch(err){
        console.log('Error checking username',err)
        return Response.json({
            success:false,
            message:'Error checking username'
        },{
            status:500
        })
    }
}