'use client'
import React, { useDebugValue, useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm ,SubmitHandler} from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
import { useSession } from 'next-auth/react'
import { useDebounceCallback } from 'usehooks-ts'
import { toast } from "sonner"
import { signUpSchema } from '@/schemas/signUpSchema'
import axios,{AxiosError} from 'axios'
import { ApiResponse } from '@/types/ApiResponse'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from "@/components/ui/button"

import {Loader2} from 'lucide-react'
import { useRouter } from 'next/navigation';



const page = () => {
  const [username,setUsername]=useState('')
  const [usernameMessage,setUsernameMessage]=useState('')
  const [isCheckingUsername,setisCheckingUsername]=useState(false)
  const [isSubmitting,setisSubmitting]=useState(false)

 const debounced= useDebounceCallback(setUsername,300)
 const router=useRouter()

 //zod implementation
 const form=useForm({
  resolver:zodResolver(signUpSchema),
  defaultValues:{
    username:'',
    email:'',
    password:''
  }
 })

 useEffect(()=>{
  const checkUsernameUnique=async ()=>{
    if(username){
      setisCheckingUsername(true)
      setUsernameMessage('')
      try{
      const response=  await axios.get(`/api/check-username-unique?username=${username}`)
       let message = response.data.message
        setUsernameMessage(message)
      }catch(error){
        const axioserror=error as AxiosError<ApiResponse>
        setUsernameMessage(axioserror.response?.data.message ?? "Error checking username")
      }finally{
        setisCheckingUsername(false)
      }
    }
  }
  checkUsernameUnique()
 },[username])

const onSubmit=async (data:z.infer<typeof signUpSchema>)=>{
setisSubmitting(true)
try{
 const response= await axios.post<ApiResponse>('/api/sign-up',data)
 toast('Success!!')
 router.replace(`/verify/${data.username}`)
 setisSubmitting(false)
}catch(err){
  console.log('Error in sign-up of user',err)
  toast('Sign up failed!!')
  setisSubmitting(false)
}
}
  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white-rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Join Whispr
          </h1>
          <p className='mb-4'>Sign up to start your anonymous adventure</p>
        </div>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)}
           className='space-y-6'>
             <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="username" {...field}
                onChange={(e)=>{
                  field.onChange(e)
                  debounced(e.target.value)
                }} />
              </FormControl>
              {isCheckingUsername && <Loader2 className='<Loader2 className="h-4 w-4 animate-spin text-gray-500" />
'></Loader2>}
<p className={`text-sm ${usernameMessage === "Username is unique" ? 'text-green-500' : 'text-red-500'}`}>
  {usernameMessage}
</p>

              <FormMessage />
            </FormItem>
          )}    
        />
          <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="password" {...field} type='password' />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>
        {isSubmitting ? (
    <>
      <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please Wait
    </>
  ) : (
    'Signup'
  )}
        </Button>
           </form>
         </Form>
         <div className='text-center mt-4'>
          <p>
            Already a member?{' '}
            <Link href='/sign-in' className='text-blue-600 hover:text-blue-800'
            >Sign In</Link>
          </p>
         </div>
      </div>
    </div>
  )
}

export default page