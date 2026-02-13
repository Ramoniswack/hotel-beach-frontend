import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookingsAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

// Query keys
export const bookingKeys = {
  all: ['bookings'] as const,
  lists: () => [...bookingKeys.all, 'list'] as const,
  list: (filters?: any) => [...bookingKeys.lists(), filters] as const,
  details: () => [...bookingKeys.all, 'detail'] as const,
  detail: (id: string) => [...bookingKeys.details(), id] as const,
  myBookings: () => [...bookingKeys.all, 'my-bookings'] as const,
};

// Fetch all bookings (admin)
export function useBookings(filters?: any) {
  return useQuery({
    queryKey: bookingKeys.list(filters),
    queryFn: async () => {
      const response = await bookingsAPI.getAll();
      return response.data.data || [];
    },
    staleTime: 30000, // 30 seconds
  });
}

// Fetch single booking
export function useBooking(id: string) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: async () => {
      const response = await bookingsAPI.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Fetch my bookings (guest)
export function useMyBookings() {
  return useQuery({
    queryKey: bookingKeys.myBookings(),
    queryFn: async () => {
      const response = await bookingsAPI.getMyBookings();
      return response.data.data || [];
    },
    staleTime: 30000,
  });
}

// Update booking status
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      bookingsAPI.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      toast.success('Booking status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
}

// Update payment status
export function useUpdatePaymentStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, paymentStatus, paymentMethod }: { 
      id: string; 
      paymentStatus: string; 
      paymentMethod?: string;
    }) => bookingsAPI.updatePaymentStatus(id, paymentStatus, paymentMethod),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      toast.success('Payment status updated');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update payment status');
    },
  });
}

// Cancel booking
export function useCancelBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => bookingsAPI.cancel(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all });
      toast.success('Booking cancelled');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to cancel booking');
    },
  });
}
