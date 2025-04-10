"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { UserInterface, MessageInterface, TicketInterface } from "@/typesNdefs/JackTTypes"
import { ChatSection } from "./my_ui/chatComponent"
import { io, Socket } from "socket.io-client"
import { fetchMessages, submitMessage, createTicket, updateTicketStatus, updateTicketPriority } from "@/api/ticketService"
import { TicketDetailsPanel } from "./my_ui/ticketDetailsPanel"
import { getStatusColor, getPriorityColor, formatDate } from "@/typesNdefs/utils"
import { getLLMBaseAttributes } from "@/api/llmService"

interface JackTChatProps {
    userLoggedIn: UserInterface

}


export default function JackTChat({ userLoggedIn }: JackTChatProps) {
    const [messages, setMessages] = useState<MessageInterface[]>([])
    const [ticketExists, setTicketExists] = useState<boolean>(false)
    const [selectedTicket, setSelectedTicket] = useState<TicketInterface>({
        ticket_uuid: "",
        ticket_tag: "",
        title: "",
        status: "",
        priority: "",
        category: "",
        created_at: "",
        updated_at: "",
        description: "",
        raw_text: "",
        requesting_user_uuid: userLoggedIn.user_uuid,
        it_owner_uuid: userLoggedIn.user_uuid,
        department: "",
    })
    const [socket, setSocket] = useState<Socket | null>(null)
    const [room, setRoom] = useState<string>("")


    useEffect(() => {
        const newSocket = io("http://127.0.0.1:5000/socket/messages")
        setSocket(newSocket)


        newSocket.on("new_message", (newMessage: MessageInterface) => {
            console.log("New message:", newMessage)
            setMessages(prev => prev ? [...prev, newMessage] : [newMessage])
        })

        return () => {
            newSocket.close()
        }
    }, [])

    useEffect(() => {
        if (socket && ticketExists) {
            socket.emit("join", {
                author_name: userLoggedIn.first_name + "_" + userLoggedIn.last_name,
                ticket_tag: selectedTicket.ticket_tag
            })
            setRoom(selectedTicket.ticket_tag)


        }
    }, [ticketExists])



    const handleSendMessage = (message: string, isInternal: boolean, ticket_to_use: TicketInterface) => {
        if (!message.trim()) return
        console.log("Sending message:", message, isInternal)

        try {
            if (socket) {
                socket.emit("send_message", {
                    message: message,
                    is_internal: isInternal,
                    author_uuid: userLoggedIn.user_uuid,
                    author_name: userLoggedIn.first_name + " " + userLoggedIn.last_name,
                    author_role: userLoggedIn.role,
                    ticket_uuid: ticket_to_use.ticket_uuid,
                    ticket_tag: ticket_to_use.ticket_tag
                })
            }
        } catch (error) {
            console.error("Error sending message:", error)
        }
    }
    const handleSubmitComment = async (message: string, isInternal: boolean = true) => {
        if (!message.trim()) return
        let ticket_to_use: TicketInterface;
        if (selectedTicket.ticket_uuid === "") {
            const llm_ticket_attributes_json: TicketInterface = await getLLMBaseAttributes(message)
            console.log(llm_ticket_attributes_json)
            let llmTicket: TicketInterface = {
                ticket_uuid: "",
                ticket_tag: "",
                title: llm_ticket_attributes_json.title,
                description: llm_ticket_attributes_json.description,
                status: llm_ticket_attributes_json.status,
                priority: llm_ticket_attributes_json.priority,
                category: llm_ticket_attributes_json.category,
                department: llm_ticket_attributes_json.department,
                requesting_user_uuid: userLoggedIn.user_uuid,
                it_owner_uuid: userLoggedIn.user_uuid,
                created_at: "",
                updated_at: "",
                raw_text: "",
            }

            const newTicket = await createTicket(llmTicket)
            setSelectedTicket(newTicket)
            setTicketExists(true)
            ticket_to_use = newTicket
            await new Promise(resolve => setTimeout(resolve, 200))

        } else {
            ticket_to_use = selectedTicket
        }

        try {
            handleSendMessage(message, isInternal, ticket_to_use)
        } catch (error) {
            console.error("Error submitting comment:", error)
        }

    }

    const handleStatusChange = async (newStatus: string) => {
        if (selectedTicket) {
            try {
                await updateTicketStatus(selectedTicket.ticket_uuid, newStatus)
                setSelectedTicket({ ...selectedTicket, status: newStatus })
            } catch (error) {
                console.error("Error updating ticket status:", error)
            }
        }
    }

    const handlePriorityChange = async (newPriority: string) => {
        if (selectedTicket) {
            try {
                await updateTicketPriority(selectedTicket.ticket_uuid, newPriority)
                setSelectedTicket({ ...selectedTicket, priority: newPriority })
            } catch (error) {
                console.error("Error updating ticket priority:", error)
            }
        }
    }



    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="mt-1">JackT Chat</CardTitle>

            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-6">
                        <div className="h-full">
                            <ChatSection
                                messages={messages}
                                onSubmitComment={handleSubmitComment}
                                chatTitle={""}
                            />
                        </div>
                    </div>
                    <TicketDetailsPanel
                        ticket={selectedTicket}
                        requester={userLoggedIn}
                        assignedTo={userLoggedIn}
                        onStatusChange={handleStatusChange}
                        onPriorityChange={handlePriorityChange}
                        formatDate={formatDate}
                        getStatusColor={getStatusColor}
                        getPriorityColor={getPriorityColor}
                        onDeleteTicket={() => { }}
                    />
                </div>
            </CardContent>
        </Card>
    )
}