// Optimistic UI update utilities for instant feedback

export interface OptimisticUpdate<T> {
  previousState: T;
  rollback: () => void;
}

/**
 * Execute an optimistic update with automatic rollback on failure
 * @param optimisticUpdate - Function to update UI immediately
 * @param serverUpdate - Async function to update server
 * @param onSuccess - Optional callback on success
 * @param onError - Optional callback on error
 */
export async function withOptimisticUpdate<T>(
  optimisticUpdate: () => OptimisticUpdate<T>,
  serverUpdate: () => Promise<any>,
  onSuccess?: (result: any) => void,
  onError?: (error: any) => void
): Promise<boolean> {
  // 1. Apply optimistic update immediately
  const { previousState, rollback } = optimisticUpdate();
  
  try {
    // 2. Send request to server
    const result = await serverUpdate();
    
    // 3. Success - keep the optimistic update
    if (onSuccess) {
      onSuccess(result);
    }
    
    return true;
  } catch (error) {
    // 4. Failure - rollback to previous state
    rollback();
    
    if (onError) {
      onError(error);
    }
    
    console.error('Optimistic update failed, rolled back:', error);
    return false;
  }
}

/**
 * Create an optimistic array update helper
 */
export function createArrayOptimisticUpdate<T>(
  items: T[],
  setItems: (items: T[]) => void
) {
  return {
    // Remove item optimistically
    remove: (predicate: (item: T) => boolean) => {
      const previousState = [...items];
      const newItems = items.filter(item => !predicate(item));
      setItems(newItems);
      
      return {
        previousState,
        rollback: () => setItems(previousState),
      };
    },
    
    // Update item optimistically
    update: (predicate: (item: T) => boolean, updates: Partial<T>) => {
      const previousState = [...items];
      const newItems = items.map(item =>
        predicate(item) ? { ...item, ...updates } : item
      );
      setItems(newItems);
      
      return {
        previousState,
        rollback: () => setItems(previousState),
      };
    },
    
    // Add item optimistically
    add: (newItem: T) => {
      const previousState = [...items];
      setItems([...items, newItem]);
      
      return {
        previousState,
        rollback: () => setItems(previousState),
      };
    },
    
    // Replace entire array optimistically
    replace: (newItems: T[]) => {
      const previousState = [...items];
      setItems(newItems);
      
      return {
        previousState,
        rollback: () => setItems(previousState),
      };
    },
  };
}

/**
 * Create an optimistic object update helper
 */
export function createObjectOptimisticUpdate<T extends object>(
  obj: T,
  setObj: (obj: T) => void
) {
  return {
    // Update object properties optimistically
    update: (updates: Partial<T>) => {
      const previousState = { ...obj };
      setObj({ ...obj, ...updates });
      
      return {
        previousState,
        rollback: () => setObj(previousState),
      };
    },
    
    // Replace entire object optimistically
    replace: (newObj: T) => {
      const previousState = { ...obj };
      setObj(newObj);
      
      return {
        previousState,
        rollback: () => setObj(previousState),
      };
    },
  };
}

/**
 * Show toast notification for optimistic update status
 */
export function showOptimisticToast(
  message: string,
  type: 'success' | 'error' | 'loading' = 'loading'
) {
  // You can integrate with your toast library here
  // For now, using console
  const emoji = type === 'success' ? '✅' : type === 'error' ? '❌' : '⏳';
  console.log(`${emoji} ${message}`);
  
  // Example with react-hot-toast (if installed):
  // import toast from 'react-hot-toast';
  // if (type === 'loading') return toast.loading(message);
  // if (type === 'success') return toast.success(message);
  // if (type === 'error') return toast.error(message);
}

/**
 * Debounce optimistic updates to prevent rapid-fire requests
 */
export function debounceOptimistic<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}
