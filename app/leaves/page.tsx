"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CalendarDays, Plus } from "lucide-react";
import { toast } from "sonner";
import { CalendarView } from "@/components/calendar-view";
import { supabase } from "@/lib/supabase";
import type { LeaveRequest } from "@/types/leave";

export default function LeavesPage() {
  const [open, setOpen] = useState(false);
  const [leaveType, setLeaveType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [reason, setReason] = useState("");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
  }, []);

  const fetchLeaveRequests = async () => {
    try {
      const { data, error } = await supabase
        .from('leave_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLeaveRequests(data || []);
    } catch (error) {
      toast.error('Failed to fetch leave requests');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!leaveType || !startDate || !endDate || !reason) {
      toast.error("Please fill in all fields");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      toast.error("End date cannot be before start date");
      return;
    }

    try {
      const { error } = await supabase
        .from('leave_requests')
        .insert([
          {
            type: leaveType,
            start_date: startDate,
            end_date: endDate,
            reason,
            status: 'pending'
          }
        ]);

      if (error) throw error;

      toast.success("Leave request submitted successfully!");
      setOpen(false);
      resetForm();
      fetchLeaveRequests();
    } catch (error) {
      toast.error('Failed to submit leave request');
      console.error('Error:', error);
    }
  };

  const resetForm = () => {
    setLeaveType("");
    setStartDate("");
    setEndDate("");
    setReason("");
  };

  const calendarEvents = leaveRequests.map(request => ({
    date: new Date(request.start_date),
    type: request.type,
    status: request.status
  }));

  if (loading) {
    return (
      <div className="container mx-auto px-4 pt-24">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 pt-24">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">My Leave Requests</h1>
        <Dialog open={open} onOpenChange={(isOpen) => {
          setOpen(isOpen);
          if (!isOpen) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" /> New Leave Request
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>New Leave Request</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="type">Leave Type</Label>
                <Select value={leaveType} onValueChange={setLeaveType}>
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="personal">Personal Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input 
                    type="date" 
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endDate">End Date</Label>
                  <Input 
                    type="date" 
                    id="endDate"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    min={startDate || new Date().toISOString().split('T')[0]}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Reason</Label>
                <Textarea 
                  id="reason"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Enter your reason for leave"
                />
              </div>
              <Button type="submit" className="w-full">
                Submit Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Recent Requests</h2>
          {leaveRequests.length > 0 ? (
            leaveRequests.map((request) => (
              <Card key={request.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <CalendarDays className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{request.type}</h3>
                      <p className="text-sm text-muted-foreground">
                        {new Date(request.start_date).toLocaleDateString()} -{" "}
                        {new Date(request.end_date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      request.status === "pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : request.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                  </span>
                </div>
                <p className="mt-4 text-muted-foreground">{request.reason}</p>
              </Card>
            ))
          ) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">No leave requests found</p>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold">Calendar View</h2>
          <CalendarView events={calendarEvents} />
        </div>
      </div>
    </div>
  );
}