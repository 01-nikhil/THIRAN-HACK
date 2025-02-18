export interface FoodRequest {
  id: string;
  quantity: number;
  status: 'pending' | 'completed' | 'cancelled';
  otp?: string;
  createdAt: Date;
  donor?: {
    name: string;
    location: string;
  };
}

export interface DashboardStats {
  totalRequests: number;
  pendingRequests: number;
  completedRequests: number;
  peakRequestTime: string;
}