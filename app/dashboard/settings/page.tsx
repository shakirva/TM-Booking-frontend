"use client";
import React, { useState } from "react";
import { updateProfile, changePassword } from '../../../lib/api';
import { getToken } from '../../../lib/auth';
import { MdOutlineEdit } from "react-icons/md";
import Image from 'next/image';

export default function SettingsPage() {

  const [name, setName] = useState('John Doe');
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/32.jpg');

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('profileName');
      const storedImage = localStorage.getItem('profileImage');
      if (storedName) setName(storedName);
      if (storedImage) setProfileImage(storedImage);
    }
  }, []);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string|null>(null);

  const handleSave = async () => {
    setMessage(null);
    setLoading(true);
    const token = getToken();
    if (!token) {
      setMessage('Not authenticated.');
      setLoading(false);
      return;
    }
    try {
      // Update profile
      await updateProfile({ name, profileImage }, token);
      // Save to localStorage for dashboard top bar
      if (typeof window !== 'undefined') {
        localStorage.setItem('profileName', name);
        localStorage.setItem('profileImage', profileImage);
      }
      // Change password if fields are filled
      if (currentPassword && newPassword && newPassword === confirmPassword) {
        await changePassword({ currentPassword, newPassword }, token);
        setMessage('Profile and password updated successfully.');
      } else if (!currentPassword && !newPassword && !confirmPassword) {
        setMessage('Profile updated successfully.');
      } else if (newPassword !== confirmPassword) {
        setMessage('New passwords do not match.');
        setLoading(false);
        return;
      } else {
        setMessage('Please fill all password fields to change password.');
        setLoading(false);
        return;
      }
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
  } catch (err: unknown) {
      if (
        typeof err === 'object' &&
        err !== null &&
        'response' in err &&
        typeof (err as { response?: { data?: { message?: string } } }).response === 'object' &&
        (err as { response?: { data?: { message?: string } } }).response !== null &&
        'data' in (err as { response?: { data?: { message?: string } } }).response!
      ) {
        setMessage(
          ((err as { response?: { data?: { message?: string } } }).response!.data?.message) || 'Update failed.'
        );
      } else {
        setMessage('Update failed.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="font-semibold text-xl mb-6 text-black">Profile Settings</div>
      <div className="bg-white rounded-xl shadow-sm p-8 flex flex-col items-center">
        {/* Profile Photo */}
        <div className="relative mb-2">
          <Image
            src={profileImage}
            alt="Profile"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full object-cover border-4 border-white shadow"
          />
          <label className="absolute bottom-0 right-0 bg-blue-600 rounded-full p-1 cursor-pointer border-2 border-white">
            <MdOutlineEdit />
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={e => {
                const file = e.target.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = ev => setProfileImage(ev.target?.result as string);
                  reader.readAsDataURL(file);
                }
              }}
            />
          </label>
        </div>
        <div className="text-blue-600 text-sm mb-6 cursor-pointer">Change Photo</div>
        {/* Name Change */}
        <div className="w-full mb-6">
          <div className="text-xs font-semibold text-[#374151] mb-1">Full Name</div>
          <input
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded px-3 py-2 text-sm text-black"
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </div>
        {/* Password Change */}
        <div className="w-full mb-6">
          <div className="text-xs font-semibold text-[#374151] mb-1">Current Password</div>
          <input
            type="password"
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded px-3 py-2 text-sm text-black mb-3"
            value={currentPassword}
            onChange={e => setCurrentPassword(e.target.value)}
          />
          <div className="text-xs font-semibold text-[#374151] mb-1">New Password</div>
          <input
            type="password"
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded px-3 py-2 text-sm text-black mb-3"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
          />
          <div className="text-xs font-semibold text-[#374151] mb-1">Confirm New Password</div>
          <input
            type="password"
            className="w-full bg-[#F8FAFC] border border-[#E5E7EB] rounded px-3 py-2 text-sm text-black"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
          />
        </div>
        {message && <div className={`mb-4 w-full text-center text-sm ${message.includes('success') ? 'text-green-600' : 'text-red-600'}`}>{message}</div>}
        <button
          className="mt-2 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg disabled:opacity-60"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
} 