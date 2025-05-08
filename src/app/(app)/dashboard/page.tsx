'use client'

import { Message } from "@/app/model/User"
import MessageCard from "@/components/MessageCard"
import { Button } from "@/components/ui/button"
import { CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { AcceptMessageSchema } from "@/schemas/acceptMessageSchema"
import { ApiResponse } from "@/types/ApiResponse"
import { zodResolver } from "@hookform/resolvers/zod"
import { Separator } from "@radix-ui/react-separator"
import axios, { AxiosError } from "axios"
import { Loader2, RefreshCcw } from "lucide-react"
import { User } from "next-auth"
import { useSession } from "next-auth/react"
import { useCallback, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"

const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setIsLoading] = useState(false)
  const [isSwitchLoading, setIsSwitchLoading] = useState(false)

  const { data: session } = useSession()
  const form = useForm({
    resolver: zodResolver(AcceptMessageSchema),
  })
  const { register, watch, setValue } = form
  const acceptMessages = watch('acceptMessages')

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId))
  }

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true)
    try {
      const response = await axios.get('/api/acceptMessages')
      setValue('acceptMessages', response.data.isAcceptingMessage)
    } catch (error) {
      toast('Error: Failed to fetch message settings')
    } finally {
      setIsSwitchLoading(false)
    }
  }, [setValue])

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true)
    try {
      const response = await axios.get('/api/get-messages')
      setMessages(response.data.messages || [])
      if (refresh) {
        toast('Showing latest messages')
      }
    } catch (error) {
      toast('Error: Failed to fetch messages')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!session || !session.user) return
    fetchAcceptMessage()
    fetchMessages()
  }, [session, fetchAcceptMessage, fetchMessages])

  const handleSwitchChange = async () => {
    try {
      await axios.post('/api/accept-messages', {
        acceptMessages: !acceptMessages,
      })
      setValue('acceptMessages', !acceptMessages)
    } catch (error) {
      toast('Error: Failed to update message settings')
    }
  }

  if (!session || !session.user) {
    return <div>Please login</div>
  }

  const { username } = session.user as User

  // ✅ Avoid hydration error: use only on client
  const getProfileUrl = () => {
    if (typeof window === 'undefined') return ''
    return `${window.location.protocol}//${window.location.host}/u/${username}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(getProfileUrl())
    toast('URL copied')
  }

  return (
    <div className="my-8 mx-4 md:mx-8 lg:mx-auto p-6 bg-white rounded w-full max-w-6xl">
      <h1 className="text-4xl font-bold mb-4">User Dashboard</h1>

      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Copy your unique link</h2>
        <div className="flex items-center">
          <input
            type="text"
            value={getProfileUrl()}
            disabled
            className="input input-bordered w-full p-2 mr-2"
          />
          <Button onClick={copyToClipboard}>Copy</Button>
        </div>
      </div>

      <div className="mb-4">
        <Switch
          {...register('acceptMessages')}
          checked={acceptMessages}
          onCheckedChange={handleSwitchChange}
          disabled={isSwitchLoading}
        />
        <span className="ml-2">
          Accept Messages: {acceptMessages ? 'On' : 'Off'}
        </span>
      </div>

      <Separator />

      <Button
        className="mt-4 h-4 w-4"
        variant="outline"
        onClick={(e) => {
          e.preventDefault()
          fetchMessages(true)
        }}
      >
        {loading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <RefreshCcw className="h-4 w-4" />
        )}
      </Button>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <MessageCard
            
            key={message?.id}
              message={message}
              onMessageDelete={handleDeleteMessage}
              
            />
          ))
        ) : (
          <p>No messages to display...</p>
        )}
      </div>
    </div>
  )
}

export default DashboardPage
