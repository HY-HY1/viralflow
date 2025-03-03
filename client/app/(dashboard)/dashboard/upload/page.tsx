"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, Loader2, X, FileText, User, Bot } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { useDropzone } from "react-dropzone"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"

interface FileWithProgress extends File {
  progress?: number
  status?: 'uploading' | 'completed' | 'error'
}

interface Conversation {
  person1: string
  person2: string
  messages: Array<{
    sender: 'person1' | 'person2'
    content: string
  }>
}

export default function UploadPage() {
  const [files, setFiles] = useState<FileWithProgress[]>([])
  const [loading, setLoading] = useState(false)
  const [description, setDescription] = useState("")
  const [person1, setPerson1] = useState("")
  const [person2, setPerson2] = useState("")
  const [conversation, setConversation] = useState<Conversation | null>(null)
  const { toast } = useToast()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.map(file => ({
      ...file,
      progress: 0,
      status: 'uploading' as const
    }))
    setFiles(prev => [...prev, ...newFiles])
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/json': ['.json']
    },
    maxFiles: 1,
  })

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!person1 || !person2) {
      toast({
        title: "Missing names",
        description: "Please enter names for both people in the conversation",
        variant: "destructive",
      })
      return
    }

    if (files.length === 0) {
      toast({
        title: "No file selected",
        description: "Please select a text file to upload",
        variant: "destructive",
      })
      return
    }

    setLoading(true)
    try {
      // Simulate file processing
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200))
        setFiles(prev => prev.map(f => ({ ...f, progress, status: progress === 100 ? 'completed' : 'uploading' })))
      }

      // Simulate conversation generation
      const mockConversation: Conversation = {
        person1,
        person2,
        messages: [
          { sender: 'person1', content: "Hey! How's it going?" },
          { sender: 'person2', content: "Pretty good! Just working on some projects." },
          { sender: 'person1', content: "That's great! What kind of projects?" },
          { sender: 'person2', content: "I'm building a text generator app. It's pretty interesting!" },
          { sender: 'person1', content: "Wow, that sounds cool! Tell me more about it." },
          { sender: 'person2', content: "It uses AI to generate realistic conversations between two people." },
        ]
      }
      
      setConversation(mockConversation)
      toast({
        title: "Success",
        description: "Conversation generated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to process the file",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Generate Conversation</CardTitle>
          <CardDescription>
            Upload a text file and generate a conversation between two people
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="person1">First Person</Label>
                <Input
                  id="person1"
                  placeholder="Enter name..."
                  value={person1}
                  onChange={(e) => setPerson1(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="person2">Second Person</Label>
                <Input
                  id="person2"
                  placeholder="Enter name..."
                  value={person2}
                  onChange={(e) => setPerson2(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Text File</Label>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
                  isDragActive
                    ? "border-primary bg-primary/5"
                    : "border-muted-foreground/25 hover:border-primary/50"
                )}
              >
                <input {...getInputProps()} />
                <div className="flex flex-col items-center gap-2">
                  <FileText className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {isDragActive
                      ? "Drop the text file here"
                      : "Drag and drop a text file here, or click to select"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Supports: TXT, JSON files
                  </p>
                </div>
              </div>

              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-4 rounded-lg border p-4"
                    >
                      <FileText className="h-4 w-4" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{file.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {(file.size / 1024).toFixed(2)} KB
                        </p>
                        {file.status === 'uploading' && (
                          <Progress value={file.progress} className="h-1 mt-2" />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeFile(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Context (Optional)</Label>
              <Textarea
                id="description"
                placeholder="Enter any additional context for the conversation..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px]"
              />
            </div>

            <Button type="submit" disabled={loading || files.length === 0}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Bot className="mr-2 h-4 w-4" />
                  Generate Conversation
                </>
              )}
            </Button>
          </form>

          {conversation && (
            <div className="mt-8 space-y-4">
              <h3 className="text-lg font-semibold">Generated Conversation</h3>
              <div className="space-y-4 rounded-lg border p-4">
                {conversation.messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "flex items-start gap-3 rounded-lg p-3",
                      message.sender === 'person1'
                        ? "bg-primary/10"
                        : "bg-muted"
                    )}
                  >
                    {message.sender === 'person1' ? (
                      <User className="h-5 w-5 text-primary" />
                    ) : (
                      <Bot className="h-5 w-5 text-muted-foreground" />
                    )}
                    <div>
                      <p className="text-sm font-medium">
                        {message.sender === 'person1' ? conversation.person1 : conversation.person2}
                      </p>
                      <p className="text-sm text-muted-foreground">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 