export interface LeaveRequest {
  id: number;
  user_id: string;
  type: string;
  start_date: string;
  end_date: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}