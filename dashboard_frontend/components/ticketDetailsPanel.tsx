"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { TicketInterface, UserInterface } from "@/types/servalTypes"
import { AlertTriangle, Clock, MessageSquare, Paperclip, Tag, User } from "lucide-react"

interface TicketDetailsPanelProps {
    ticket: TicketInterface
    requester: UserInterface | null
    assignedTo: UserInterface | null
    status: string
    priority: string
    onStatusChange: (status: string) => void
    onPriorityChange: (priority: string) => void
    formatDate: (dateString: string) => string
    getStatusColor: (status: string) => string
    getPriorityColor: (priority: string) => string
}

export function TicketDetailsPanel({
    ticket,
    requester,
    assignedTo,
    status,
    priority,
    onStatusChange,
    onPriorityChange,
    formatDate,
    getStatusColor,
    getPriorityColor,
}: TicketDetailsPanelProps) {
    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Ticket Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                            <Tag className="h-4 w-4 mr-2" /> Status
                        </h4>
                        <Select value={status} onValueChange={onStatusChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="open">Open</SelectItem>
                                <SelectItem value="in-progress">In Progress</SelectItem>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="closed">Closed</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                            <AlertTriangle className="h-4 w-4 mr-2" /> Priority
                        </h4>
                        <Select value={priority} onValueChange={onPriorityChange}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                            <User className="h-4 w-4 mr-2" /> Requester
                        </h4>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>
                                    {requester?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{requester?.name}</span>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                            <User className="h-4 w-4 mr-2" /> Assigned To
                        </h4>
                        <div className="flex items-center gap-2">
                            <Avatar className="h-6 w-6">
                                <AvatarImage src="/placeholder-user.jpg" />
                                <AvatarFallback>
                                    {assignedTo?.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                </AvatarFallback>
                            </Avatar>
                            <span className="text-sm">{assignedTo?.name}</span>
                        </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                            <Clock className="h-4 w-4 mr-2" /> Created
                        </h4>
                        <span className="text-sm">{formatDate(ticket.created_at)}</span>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                            <Clock className="h-4 w-4 mr-2" /> Updated
                        </h4>
                        <span className="text-sm">{formatDate(ticket.updated_at)}</span>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                            <Tag className="h-4 w-4 mr-2" /> Category
                        </h4>
                        <span className="text-sm">{ticket.category}</span>
                    </div>

                    <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                            <Tag className="h-4 w-4 mr-2" /> Department
                        </h4>
                        <span className="text-sm">{ticket.department}</span>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button variant="outline" className="w-full">
                        Assign to me
                    </Button>
                </CardFooter>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-base">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <Button variant="outline" className="w-full justify-start">
                        <MessageSquare className="h-4 w-4 mr-2" /> Send Email
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                        <Paperclip className="h-4 w-4 mr-2" /> Manage Attachments
                    </Button>
                    <Button variant="outline" className="w-full justify-start text-red-500 hover:text-red-600">
                        <AlertTriangle className="h-4 w-4 mr-2" /> Escalate
                    </Button>
                </CardContent>
            </Card>
        </div>
    )
}






