import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { contentAPI } from '@/lib/api';
import { toast } from 'react-hot-toast';

// Query keys
export const contentKeys = {
  all: ['content'] as const,
  lists: () => [...contentKeys.all, 'list'] as const,
  details: () => [...contentKeys.all, 'detail'] as const,
  detail: (pageName: string) => [...contentKeys.details(), pageName] as const,
};

// Fetch all content
export function useAllContent() {
  return useQuery({
    queryKey: contentKeys.lists(),
    queryFn: async () => {
      const response = await contentAPI.getAll();
      return response.data.data || [];
    },
    staleTime: 300000, // 5 minutes
  });
}

// Fetch content by page
export function useContent(pageName: string) {
  return useQuery({
    queryKey: contentKeys.detail(pageName),
    queryFn: async () => {
      const response = await contentAPI.getByPage(pageName);
      return response.data.data;
    },
    enabled: !!pageName,
    staleTime: 300000,
  });
}

// Update content
export function useUpdateContent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ pageName, data }: { pageName: string; data: any }) =>
      contentAPI.update(pageName, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contentKeys.all });
      toast.success('Content updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update content');
    },
  });
}
