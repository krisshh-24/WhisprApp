'use client'
import React, { useDebugValue, useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm ,SubmitHandler} from "react-hook-form"
import * as z from "zod"
import Link from "next/link"
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
import { signInSchema } from '@/schemas/signInSchema'
import { signIn } from 'next-auth/react'



const page = () => {
  const [isSubmitting,setisSubmitting]=useState(false)
 const router=useRouter()

 //zod implementation
 const form=useForm({
  resolver:zodResolver(signInSchema),
  defaultValues:{
    identifier:'',
    password:''
  }
 })



const onSubmit=async (data:z.infer<typeof signInSchema>)=>{
const result=await signIn('credentials',{
  redirect:false,
  identifier:data.identifier,
  password:data.password
})
if(result?.error){
  toast('Login failed!')
}
if(result?.url){
  router.replace('/dashboard')
}
}

  return (
    <div className='flex justify-center items-center min-h-screen bg-gray-100'>
      <div className='w-full max-w-md p-8 space-y-8 bg-white-rounded-lg shadow-md'>
        <div className='text-center'>
          <h1 className='text-4xl font-extrabold tracking-tight lg:text-5xl mb-6'>
            Join Whispr
          </h1>
          <p className='mb-4'>Sign in to start your anonymous adventure</p>
        </div>
         <Form {...form}>
           <form onSubmit={form.handleSubmit(onSubmit)}
           className='space-y-6'>
          
          <FormField
          control={form.control}
          name="identifier"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email/Username</FormLabel>
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
      Sign In
        </Button>
           </form>
         </Form>
      
      </div>
    </div>
  )
}

export default page