import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomsAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

// Query keys
export const roomKeys = {
  all: ['rooms'] as const,
  lists: () => [...roomKeys.all, 'list'] as const,
  list: (filters?: any) => [...roomKeys.lists(), filters] as const,
  details: () => [...roomKeys.all, 'detail'] as const,
  detail: (id: string) => [...roomKeys.details(), id] as const,
  available: (checkIn: string, checkOut: string) => 
    [...roomKeys.all, 'available', checkIn, checkOut] as const,
};

// Fetch all rooms
export function useRooms(filters?: any) {
  return useQuery({
    queryKey: roomKeys.list(filters),
    queryFn: async () => {
      const response = await roomsAPI.getAll();
      return response.data.data || [];
    },
    staleTime: 60000, // 1 minute
  });
}

// Fetch single room
export function useRoom(id: string) {
  return useQuery({
    queryKey: roomKeys.detail(id),
    queryFn: async () => {
      const response = await roomsAPI.getById(id);
      return response.data.data;
    },
    enabled: !!id,
  });
}

// Fetch available rooms
export function useAvailableRooms(checkIn: string, checkOut: string) {
  return useQuery({
    queryKey: roomKeys.available(checkIn, checkOut),
    queryFn: async () => {
      const response = await roomsAPI.getAvailable(checkIn, checkOut);
      return response.data.data || [];
    },
    enabled: !!checkIn && !!checkOut,
    staleTime: 30000,
  });
}

// Create room
export function useCreateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: any) => roomsAPI.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.all });
      toast.success('Room created successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create room');
    },
  });
}

// Update room
export function useUpdateRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) => 
      roomsAPI.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.all });
      toast.success('Room updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update room');
    },
  });
}

// Delete room
export function useDeleteRoom() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => roomsAPI.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: roomKeys.all });
      toast.success('Room deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete room');
    },
  });
}
