"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { CalendarDays, Search } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import type { LeaveRequest } from "@/types/leave";

export default function AdminPage() {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaveRequests();
    setupRealtimeSubscription();
  }, []);

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('leave_requests_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'leave_requests'
        },
        () => {
          fetchLeaveRequests();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

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

  const handleStatusChange = async (requestId: number, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('leave_requests')
        .update({ status })
        .eq('id', requestId);

      if (error) throw error;
      
      toast.success(`Leave request ${status} successfully`);
      fetchLeaveRequests();
    } catch (error) {
      toast.error(`Failed to ${status} leave request`);
      console.error('Error:', error);
    }
  };

  const filteredRequests = leaveRequests
    .filter(request => 
      (filter === 'all' || request.status === filter) &&
      (search === '' || 
        request.type.toLowerCase().includes(search.toLowerCase()) ||
        request.reason.toLowerCase().includes(search.toLowerCase()))
    );

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
      <h1 className="text-4xl font-bold mb-8">Leave Management</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search by type or reason..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Requests</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="approved">Approved</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6">
        {filteredRequests.length > 0 ? (
          filteredRequests.map((request) => (
            <Card key={request.id} className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
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
                <div className="flex items-center space-x-2">
                  {request.status === "pending" ? (
                    <>
                      <Button
                        variant="default"
                        onClick={() => handleStatusChange(request.id, "approved")}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={() => handleStatusChange(request.id, "rejected")}
                      >
                        Reject
                      </Button>
                    </>
                  ) : (
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        request.status === "approved"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                    </span>
                  )}
                </div>
              </div>
              <p className="mt-4 text-muted-foreground">{request.reason}</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Submitted on {new Date(request.created_at).toLocaleDateString()}
              </p>
            </Card>
          ))
        ) : (
          <Card className="p-6">
            <p className="text-center text-muted-foreground">
              No leave requests found
            </p>
          </Card>
        )}
      </div>
    </div>
  );
}