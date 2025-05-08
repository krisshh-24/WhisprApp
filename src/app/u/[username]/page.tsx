"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import axios from "axios"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"

export default function PublicProfilePage() {
  const { username } = useParams() as { username: string }

  const [message, setMessage] = useState("")
  const [selectedMessage, setSelectedMessage] = useState("")
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([
    "What's your favorite movie?",
    "Do you have any pets?",
    "What's your dream job?",
  ])
  const [loadingSuggestions, setLoadingSuggestions] = useState(false)
  const [sending, setSending] = useState(false)

  const handleSelectMessage = (msg: string) => {
    setSelectedMessage(msg)
    setMessage(msg)
  }

  const fetchSuggestedMessages = async () => {
    try {
      setLoadingSuggestions(true)
      
      const res = await axios.post("/api/suggest-messages", null, {
        responseType: "text",
      })

      const fullText = res.data

      // Validate response format
      if (!fullText || typeof fullText !== 'string' || !fullText.includes('||')) {
        throw new Error("Invalid response format from server")
      }

      const questions = fullText
        .split("||")
        .map((q: string) => q.trim())
        .filter(Boolean)
      
      // Make sure we have at least one question
      if (questions.length === 0) {
        throw new Error("No valid questions returned")
      }

      setSuggestedMessages(questions)
    } catch (error) {
      toast.error("❌ Failed to fetch suggested messages.")
      console.error(error)
      // Keep the default messages when there's an error
    } finally {
      setLoadingSuggestions(false)
    }
  }

  const handleSend = async () => {
    if (!message.trim()) {
      toast.error("⚠️ Message cannot be empty.")
      return
    }

    setSending(true)
    try {
      const res = await axios.post("/api/send-message", {
        username,
        content: message,
      })

      toast.success("✅ Message sent successfully!")
      setMessage("")
      setSelectedMessage("")
    } catch (err: any) {
      console.error(err)
      const msg = err.response?.data?.message || "Something went wrong."
      toast.error(msg)
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-12 px-4">
      <h1 className="text-3xl font-bold text-center mb-2">Public Profile Link</h1>
      <p className="text-center text-muted-foreground mb-6">
        Send Anonymous Message to <span className="font-semibold">@{username}</span>
      </p>

      <Input
        placeholder="Write your anonymous message here"
        value={message}
        onChange={(e) => {
          setMessage(e.target.value)
          setSelectedMessage("")
        }}
        className="mb-4"
      />

      <div className="flex justify-center gap-4 mb-8">
        <Button onClick={handleSend} disabled={sending}>
          {sending ? "Sending..." : "Send It"}
        </Button>
        <Button
          variant="secondary"
          onClick={fetchSuggestedMessages}
          disabled={loadingSuggestions}
        >
          {loadingSuggestions ? "Loading..." : "Suggest Messages"}
        </Button>
      </div>

      <p className="text-center text-sm mb-4">Click on a suggested message below:</p>

      <div className="space-y-2">
        {suggestedMessages.map((msg, index) => (
          <Card
            key={index}
            onClick={() => handleSelectMessage(msg)}
            className={`cursor-pointer hover:bg-accent transition ${
              selectedMessage === msg ? "border-primary" : ""
            }`}
          >
            <CardContent className="py-4 text-center font-medium">
              {msg}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
