"use client"
import React, { useEffect, useState } from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import Link from 'next/link'
import { useDebounceValue } from 'usehooks-ts'
import { toast } from "sonner"
import { useRouter } from 'next/router'
import { signUpSchema } from '@/Schemas/signUpSchema'
import axios, {AxiosError} from 'axios'
import { ApiResponse } from '@/Types/ApiResponse'




const page = () => {
  const [username , setUsername] = useState('')
  const [usernameMessage, setUsernameMessage] = useState('')
  const [isCheckingUsername, setisCheckingUsername] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const debouncedUsername = useDebounceValue(username, 300)

  const router = useRouter()

  // zod impementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: '',
      email: '',
      password: ''
    }
  })
  
 useEffect(() => {
  const checkUsernameUnique = async () => {
    if (debouncedUsername) {
      setisCheckingUsername(true)
      setUsernameMessage('')
      try {
        const response = await axios.get(`/api/check-username-unique?username=${debouncedUsername}`)
        setUsernameMessage(response.data.message)
      } catch (error) {
        const axiosError = error as AxiosError<ApiResponse>
        setUsernameMessage(
          axiosError.response?.data.message ?? "Error checking username"
        )
      } finally {
        setisCheckingUsername(false)
      }
    }
  } 

  checkUsernameUnique()
}, [debouncedUsername])
  

  return (
    <div>Page</div>
  )
}

export default page