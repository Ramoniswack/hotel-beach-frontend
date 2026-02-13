'use client';

import React, { useState } from 'react';
import { Trash2, UserCheck, UserX, Loader2, AlertTriangle } from 'lucide-react';
import { authAPI } from '@/lib/api';
import { withOptimisticUpdate, createArrayOptimisticUpdate } from '@/lib/optimisticUpdates';

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  [key: string]: any;
}

interface OptimisticUserActionsProps {
  user: User;
  users: User[];
  setUsers: (users: User[]) => void;
  currentUserId: string;
}

export default function OptimisticUserActions({
  user,
  users,
  setUsers,
  currentUserId,
}: OptimisticUserActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  const arrayHelper = createArrayOptimisticUpdate(users, setUsers);

  const showNotification = (message: string, type: 'success' | 'error') => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleDeleteUser = async () => {
    if (user._id === currentUserId) {
      showNotification('You cannot delete your own account!', 'error');
      return;
    }

    setIsDeleting(true);
    setShowDeleteConfirm(false);

    const success = await withOptimisticUpdate(
      // Optimistic update - remove user immediately from UI
      () => arrayHelper.remove((u) => u._id === user._id),
      // Server update
      () => authAPI.deleteUser(user._id),
      // On success
      () => {
        showNotification(`User "${user.name}" deleted successfully!`, 'success');
      },
      // On error - user is already rolled back
      (error) => {
        showNotification(
          `Failed to delete user: ${error.response?.data?.message || 'Unknown error'}`,
          'error'
        );
      }
    );

    setIsDeleting(false);
  };

  const handleToggleActive = async () => {
    if (user._id === currentUserId) {
      showNotification('You cannot deactivate your own account!', 'error');
      return;
    }

    setIsToggling(true);
    const newActiveStatus = !user.isActive;

    const success = await withOptimisticUpdate(
      // Optimistic update - toggle status immediately
      () => arrayHelper.update(
        (u) => u._id === user._id,
        { isActive: newActiveStatus }
      ),
      // Server update
      () => authAPI.updateUser(user._id, { isActive: newActiveStatus }),
      // On success
      () => {
        showNotification(
          `User ${newActiveStatus ? 'activated' : 'deactivated'} successfully!`,
          'success'
        );
      },
      // On error
      (error) => {
        showNotification(
          `Failed to update user: ${error.response?.data?.message || 'Unknown error'}`,
          'error'
        );
      }
    );

    setIsToggling(false);
  };

  return (
    <>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 fade-in duration-300">
          <div
            className={`px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 ${
              toastType === 'success'
                ? 'bg-green-500 text-white'
                : 'bg-red-500 text-white'
            }`}
          >
            {toastType === 'success' ? '✅' : '❌'}
            <span className="font-medium">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full animate-in zoom-in-95 fade-in duration-200">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Delete User</h3>
                <p className="text-sm text-gray-600">This action cannot be undone</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete <strong>{user.name}</strong> ({user.email})?
            </p>
            
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                disabled={isDeleting}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex items-center gap-2">
        {/* Toggle Active Status */}
        <button
          onClick={handleToggleActive}
          disabled={isToggling || user._id === currentUserId}
          className={`p-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
            user.isActive
              ? 'bg-yellow-100 hover:bg-yellow-200 text-yellow-700'
              : 'bg-green-100 hover:bg-green-200 text-green-700'
          }`}
          title={user.isActive ? 'Deactivate user' : 'Activate user'}
        >
          {isToggling ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : user.isActive ? (
            <UserX className="w-4 h-4" />
          ) : (
            <UserCheck className="w-4 h-4" />
          )}
        </button>

        {/* Delete User */}
        <button
          onClick={() => setShowDeleteConfirm(true)}
          disabled={isDeleting || user._id === currentUserId}
          className="p-2 rounded-lg bg-red-100 hover:bg-red-200 text-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          title="Delete user"
        >
          {isDeleting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Trash2 className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Status Badge */}
      <span
        className={`px-2 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
          user.isActive
            ? 'bg-green-100 text-green-800'
            : 'bg-gray-100 text-gray-800'
        }`}
      >
        {user.isActive ? 'Active' : 'Inactive'}
      </span>
    </>
  );
}
