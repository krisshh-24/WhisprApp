import {z} from 'zod'
export const usernameValidation=z
.string()
.min(2,'Username should be atleast 2 characters')
.max(20,'Username must be no more than 20 characters')

export const signUpSchema=z.object({
   username: usernameValidation,
   email:z.string().email({message:'Invalid email address'}),
   password:z.string().min(6,{message:'Password must be atleast 6 characters'})
})
