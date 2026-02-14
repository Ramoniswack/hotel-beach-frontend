'use client';

import React, { useEffect, useState } from 'react';
import RouteGuard from '@/components/RouteGuard';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import ImageUpload from '@/components/ImageUpload';
import api from '@/lib/api';
import {
  DollarSign,
  Plus,
  RefreshCw,
  Edit,
  Trash2,
  X,
  Save,
  Loader2,
  Calendar,
  Filter,
  TrendingUp,
  CheckCircle,
  XCircle,
  Clock,
  Receipt,
  Building2,
} from 'lucide-react';

interface Expense {
  _id: string;
  category: string;
  subcategory?: string;
  amount: number;
  description: string;
  date: string;
  paymentMethod: string;
  vendor?: string;
  receiptUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedBy?: { name: string; email: string };
  notes?: string;
  createdBy: { name: string; email: string };
  createdAt: string;
  updatedAt: string;
}

const CATEGORIES = [
  { value: 'utilities', label: 'Utilities' },
  { value: 'maintenance', label: 'Maintenance' },
  { value: 'supplies', label: 'Supplies' },
  { value: 'food-beverage', label: 'Food & Beverage' },
  { value: 'staff-salary', label: 'Staff Salary' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'cleaning', label: 'Cleaning' },
  { value: 'laundry', label: 'Laundry' },
  { value: 'technology', label: 'Technology' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'taxes', label: 'Taxes' },
  { value: 'other', label: 'Other' },
];

const PAYMENT_METHODS = [
  { value: 'cash', label: 'Cash' },
  { value: 'card', label: 'Card' },
  { value: 'bank-transfer', label: 'Bank Transfer' },
  { value: 'check', label: 'Check' },
  { value: 'other', label: 'Other' },
];

export default function ExpenseManagement() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Expense>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchExpenses();
    fetchStats();
  }, [filterCategory, filterStatus]);

  const fetchExpenses = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filterCategory) params.append('category', filterCategory);
      if (filterStatus) params.append('status', filterStatus);
      
      const response = await api.get(`/expenses?${params.toString()}`);
      setExpenses(response.data.data || []);
    } catch (err) {
      console.error('Error fetching expenses:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/expenses/stats/summary');
      setStats(response.data.data);
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };

  const handleCreate = () => {
    setShowForm(true);
    setEditingId(null);
    setFormData({
      category: 'utilities',
      amount: 0,
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      status: 'pending',
    });
  };

  const handleEdit = (expense: Expense) => {
    setShowForm(true);
    setEditingId(expense._id);
    setFormData({
      ...expense,
      date: new Date(expense.date).toISOString().split('T')[0],
    });
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({});
  };

  const handleSave = async () => {
    if (!formData.category || !formData.amount || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Saving expense:', formData);
      
      if (editingId) {
        const response = await api.put(`/expenses/${editingId}`, formData);
        console.log('Update response:', response.data);
      } else {
        const response = await api.post('/expenses', formData);
        console.log('Create response:', response.data);
      }
      
      setShowForm(false);
      setEditingId(null);
      setFormData({});
      await fetchExpenses();
      await fetchStats();
      
      alert(`Expense ${editingId ? 'updated' : 'created'} successfully!`);
    } catch (err: any) {
      console.error('Save error:', err);
      console.error('Error response:', err.response);
      
      const errorMsg = err.response?.data?.message || 
                      err.response?.data?.error || 
                      err.message || 
                      'Unknown error';
      
      const errorDetails = err.response?.data?.details ? 
                          `\n\nDetails: ${err.response.data.details}` : '';
      
      alert('Failed to save expense: ' + errorMsg + errorDetails);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this expense?')) return;

    try {
      await api.delete(`/expenses/${id}`);
      await fetchExpenses();
      await fetchStats();
    } catch (err: any) {
      alert('Failed to delete expense: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.put(`/expenses/${id}`, { status });
      await fetchExpenses();
      await fetchStats();
    } catch (err: any) {
      alert('Failed to update status: ' + (err.response?.data?.message || 'Unknown error'));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getCategoryLabel = (value: string) => {
    return CATEGORIES.find(c => c.value === value)?.label || value;
  };

  const getPaymentMethodLabel = (value: string) => {
    return PAYMENT_METHODS.find(p => p.value === value)?.label || value;
  };

  return (
    <RouteGuard allowedRoles={['admin']}>
      <DashboardLayout>
        <div className="max-w-7xl mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <DollarSign className="text-[#59a4b5]" size={32} />
                Expense Management
              </h2>
              <p className="text-gray-600 mt-1">Track and manage hotel expenses</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCreate}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2 font-medium"
              >
                <Plus size={20} />
                Add Expense
              </button>
              <button
                onClick={() => {
                  fetchExpenses();
                  fetchStats();
                }}
                className="px-4 py-2 bg-[#59a4b5] text-white rounded-lg hover:bg-[#4a8a99] transition-colors flex items-center gap-2"
              >
                <RefreshCw size={20} />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats Cards */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Expenses</p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {formatCurrency(stats.total)}
                    </p>
                  </div>
                  <TrendingUp className="text-[#59a4b5]" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600 mt-1">
                      {stats.byStatus?.pending || 0}
                    </p>
                  </div>
                  <Clock className="text-yellow-600" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-2xl font-bold text-green-600 mt-1">
                      {stats.byStatus?.approved || 0}
                    </p>
                  </div>
                  <CheckCircle className="text-green-600" size={32} />
                </div>
              </div>
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-2xl font-bold text-red-600 mt-1">
                      {stats.byStatus?.rejected || 0}
                    </p>
                  </div>
                  <XCircle className="text-red-600" size={32} />
                </div>
              </div>
            </div>
          )}

          {/* Filters */}
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-4">
              <Filter className="text-gray-400" size={20} />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
              >
                <option value="">All Categories</option>
                {CATEGORIES.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#59a4b5] focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              {(filterCategory || filterStatus) && (
                <button
                  onClick={() => {
                    setFilterCategory('');
                    setFilterStatus('');
                  }}
                  className="text-sm text-gray-600 hover:text-gray-900"
                >
                  Clear Filters
                </button>
              )}
            </div>
          </div>

          {/* Form */}
          {showForm && (
            <div className="bg-white rounded-lg border-2 border-green-500 overflow-hidden shadow-lg">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <DollarSign className="text-green-600" size={24} />
                    {editingId ? 'Edit Expense' : 'Add New Expense'}
                  </h3>
                  <button onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
                    <X size={24} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                      </label>
                      <select
                        value={formData.category || ''}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      >
                        {CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>{cat.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subcategory
                      </label>
                      <input
                        type="text"
                        value={formData.subcategory || ''}
                        onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="e.g., Electricity, Water"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Amount ($) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.amount || ''}
                        onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={formData.date || ''}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Payment Method *
                      </label>
                      <select
                        value={formData.paymentMethod || ''}
                        onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        required
                      >
                        {PAYMENT_METHODS.map(pm => (
                          <option key={pm.value} value={pm.value}>{pm.label}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Vendor
                      </label>
                      <input
                        type="text"
                        value={formData.vendor || ''}
                        onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                        placeholder="Vendor name"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      value={formData.description || ''}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Describe the expense..."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Notes
                    </label>
                    <textarea
                      value={formData.notes || ''}
                      onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      placeholder="Additional notes..."
                    />
                  </div>

                  <div>
                    <ImageUpload
                      label="Receipt Image"
                      value={formData.receiptUrl || ''}
                      onChange={(url) => setFormData({ ...formData, receiptUrl: url })}
                    />
                  </div>

                  <div className="flex space-x-3 pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center justify-center space-x-2 disabled:opacity-50"
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="animate-spin" size={20} />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={20} />
                          <span>{editingId ? 'Update' : 'Create'} Expense</span>
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleCancel}
                      disabled={isSaving}
                      className="flex-1 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Expenses List */}
          {isLoading ? (
            <div className="text-center py-12">
              <Loader2 className="animate-spin h-12 w-12 text-[#59a4b5] mx-auto" />
              <p className="mt-4 text-gray-600">Loading expenses...</p>
            </div>
          ) : expenses.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <DollarSign className="mx-auto text-gray-400 mb-4" size={48} />
              <p className="text-gray-600 mb-4">No expenses found</p>
              <button
                onClick={handleCreate}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add Your First Expense
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Payment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.map((expense) => (
                      <tr key={expense._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(expense.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {getCategoryLabel(expense.category)}
                            </p>
                            {expense.subcategory && (
                              <p className="text-xs text-gray-500">{expense.subcategory}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-xs">
                            <p className="text-sm text-gray-900 line-clamp-2">
                              {expense.description}
                            </p>
                            {expense.vendor && (
                              <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                <Building2 size={12} />
                                {expense.vendor}
                              </p>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                          {formatCurrency(expense.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          {getPaymentMethodLabel(expense.paymentMethod)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={expense.status}
                            onChange={(e) => handleStatusChange(expense._id, e.target.value)}
                            className={`text-xs font-semibold px-2 py-1 rounded-full border-0 ${
                              expense.status === 'approved'
                                ? 'bg-green-100 text-green-700'
                                : expense.status === 'rejected'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-yellow-100 text-yellow-700'
                            }`}
                          >
                            <option value="pending">Pending</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex items-center gap-2">
                            {expense.receiptUrl && (
                              <a
                                href={expense.receiptUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[#59a4b5] hover:text-[#4a8a99]"
                                title="View Receipt"
                              >
                                <Receipt size={18} />
                              </a>
                            )}
                            <button
                              onClick={() => handleEdit(expense)}
                              className="text-blue-600 hover:text-blue-800"
                              title="Edit"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDelete(expense._id)}
                              className="text-red-600 hover:text-red-800"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </DashboardLayout>
    </RouteGuard>
  );
}
