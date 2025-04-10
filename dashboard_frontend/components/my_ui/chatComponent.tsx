"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { MessageSquare, Paperclip } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MessageInterface } from "@/typesNdefs/JackTTypes"


interface ChatSectionProps {
    messages: MessageInterface[] | null
    onSubmitComment: (comment: string, isInternal: boolean) => void
    chatTitle: string
}

export function ChatSection({ messages, onSubmitComment, chatTitle }: ChatSectionProps) {
    const [newComment, setNewComment] = useState("")
    const [isInternalNote, setIsInternalNote] = useState(false)

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date)
    }

    const handleSubmitComment = () => {
        if (newComment.trim()) {
            onSubmitComment(newComment, isInternalNote)
            setNewComment("")
            setIsInternalNote(false)
        }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium">{chatTitle}</h3>
                <Badge variant="outline" className="font-normal">
                    {messages?.length || 0} entries
                </Badge>
            </div>

            <div className="space-y-4">
                {messages && messages.length > 0 ? (
                    messages.map((message) => (
                        <div
                            key={message.message_uuid}
                            className={`p-4 rounded-lg border ${message.is_internal ? "bg-muted/50" : ""}`}
                        >
                            <div className="flex items-start gap-3">
                                <Avatar className="h-8 w-8">
                                    <AvatarImage src={message.author_name === "JackT" ? "" : "/placeholder-user.jpg"} />
                                    <AvatarFallback>
                                        {message.author_name === "JackT"
                                            ? "JTG"
                                            : message.author_name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                                        <div>
                                            <span className="font-medium">{message.author_name}</span>
                                            <span className="text-xs text-muted-foreground ml-2">{message.author_role}</span>
                                        </div>
                                        <span className="text-xs text-muted-foreground">{formatDate(message.created_at)}</span>
                                    </div>
                                    <p className="text-sm">{message.message}</p>
                                    {message.is_internal && (
                                        <Badge variant="outline" className="mt-2 text-xs">
                                            Internal Note
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-4 text-muted-foreground">No comments yet</div>
                )}
            </div>

            <div className="mt-6 space-y-3">
                <h4 className="font-medium">Add Comment</h4>
                <Textarea
                    placeholder="Type your comment here..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[100px]"
                />
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                            <Paperclip className="h-4 w-4 mr-1" /> Attach
                        </Button>
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="internal-note"
                                checked={isInternalNote}
                                onChange={(e) => setIsInternalNote(e.target.checked)}
                                className="mr-2"
                            />
                            <label htmlFor="internal-note" className="text-sm">
                                Internal note
                            </label>
                        </div>
                    </div>
                    <Button onClick={handleSubmitComment} disabled={!newComment.trim()}>
                        <MessageSquare className="h-4 w-4 mr-2" /> Submit
                    </Button>
                </div>
            </div>
        </div>
    )
}