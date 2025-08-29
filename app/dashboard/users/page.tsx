"use client";
import React, { useState } from "react";
import { FaTimes, FaEye, FaEyeSlash } from "react-icons/fa";
import { getUsers, addUser } from '../../../lib/api';
import { getToken } from '../../../lib/auth';

// Add New User Modal Component
function AddUserModal({ isOpen, onClose, onUserAdded }: { isOpen: boolean; onClose: () => void; onUserAdded: () => void }) {
  const [formData, setFormData] = useState({
    name: "",
    role: "staff",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string|null>(null);

  const roles = ["admin", "staff"];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!validateForm()) return;
    setLoading(true);
    try {
      const token = getToken();
      if (!token) throw new Error('No token');
      await addUser({
        username: formData.name,
        password: formData.password,
        role: formData.role
      }, token);
      setMessage('User added successfully.');
      setFormData({ name: '', role: 'staff', password: '' });
      onUserAdded();
      setTimeout(() => { setMessage(null); onClose(); }, 1000);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && err.response && typeof err.response === 'object' && 'data' in err.response && err.response.data && typeof err.response.data === 'object' && 'message' in err.response.data) {
        setMessage((err.response.data as { message?: string }).message || 'Failed to add user.');
      } else {
        setMessage('Failed to add user.');
      }
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add New User</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <FaTimes className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Personal Information */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name *
                </label>
                <div className="relative">
           
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className={`w-full pl-4 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black ${
                      errors.name ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter user name"
                  />
                </div>
                {errors.name && (
                  <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                )}
              </div>



              {/* Phone removed */}

                  setUsers([]);
            </div>
          </div>

          {/* Account Settings */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <div className="relative">
                 
                  <select
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white text-black"
                  >
                    {roles.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    className={`w-full pl-4 pr-12 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors.password ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <FaEyeSlash className="w-4 h-4" /> : <FaEye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col items-end gap-2 pt-6 border-t border-gray-200">
            {message && <div className={`mb-2 text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-60"
                disabled={loading}
              >
                {loading ? 'Adding...' : 'Add User'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}


// getToken already imported above; axios not needed

export default function UsersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  type User = {
    id?: string | number;
    username?: string;
    name?: string;
    role?: string;
    created_at?: string;
  };
  const [users, setUsers] = useState<User[]>([]);

  const fetchUsers = async () => {
    const token = getToken();
    if (!token) return;
    try {
      const data = await getUsers(token);
      setUsers(data);
    } catch {
      setUsers([]);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-50 border border-[#E5E7EB] rounded-lg text-gray-700 flex items-center gap-2 text-sm font-medium">
            Role <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7"/></svg>
          </button>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium"
        >
          + Add New User
        </button>
      </div>
      {/* Users Table Card */}
      <div className="bg-white rounded-xl shadow-sm p-0 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-[#F8FAFF] text-gray-400 text-left">
              <th className="py-3 px-4 font-medium w-8"><input type="checkbox" /></th>
              <th className="py-3 px-4 font-medium">User</th>
              <th className="py-3 px-4 font-medium">Role</th>
              <th className="py-3 px-4 font-medium">Join Date</th>
              <th className="py-3 px-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {users.map((user, idx) => (
              <tr key={user.id || idx} className="border-t border-[#E5E7EB] hover:bg-gray-50">
                <td className="py-3 px-4"><input type="checkbox" /></td>
                <td className="py-3 px-4">
                  <div className="font-medium text-black">{(user as User).username || (user as User).name}</div>
                </td>
                <td className="py-3 px-4">
                  <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-xs font-semibold">{(user as User).role}</span>
                </td>
                <td className="py-3 px-4">{(user as User).created_at ? new Date((user as User).created_at as string).toLocaleDateString() : '-'}</td>
                <td className="py-3 px-4 text-xl flex gap-2">
                  <button
                    className="text-red-500 hover:text-red-700 font-bold text-sm border border-red-100 rounded px-2 py-1"
                    onClick={async (e) => {
                      e.stopPropagation();
                      if (!user.id) return;
                      if (!window.confirm('Are you sure you want to delete this user?')) return;
                      const token = getToken();
                      if (!token) return;
                      try {
                        await import('../../../lib/api').then(mod => mod.deleteUser(String(user.id), token));
                        setUsers(users.filter(u => u.id !== user.id));
                      } catch {
                        alert('Failed to delete user.');
                      }
                    }}
                  >Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Add User Modal */}
      <AddUserModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onUserAdded={fetchUsers} />
    </div>
  );
}