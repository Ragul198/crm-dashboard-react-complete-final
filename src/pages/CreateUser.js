import React, { useState } from 'react';
import { useCRM } from '../context/CRMContext';
import { UserPlus, Mail, Shield, Upload } from 'lucide-react';

const CreateUser = () => {
  const { addUser } = useCRM();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Engineer',
    avatarUrl: ''
  });
  const [previewUrl, setPreviewUrl] = useState('');
  const [errors, setErrors] = useState({});

  const roles = [ 'Admin', 'Coordinator', 'Engineer'];

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim()) errs.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) errs.email = 'Email is invalid';
    if (!formData.password) errs.password = 'Password is required';
    if (!formData.role) errs.role = 'Role is required';
    if (!formData.avatarUrl) errs.avatarUrl = 'Avatar is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPreviewUrl(reader.result);
      setFormData({ ...formData, avatarUrl: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!validate()) return;
    addUser({
      name: formData.name.trim(),
      email: formData.email.trim(),
      password: formData.password,
      role: formData.role,
      avatar: formData.avatarUrl
    });
    setFormData({ name: '', email: '', password: '', role: 'Engineer', avatarUrl: '' });
    setPreviewUrl('');
    setErrors({});
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl">
      <div className="flex items-center mb-6">
        <UserPlus className="w-8 h-8 text-blue-600 mr-2" />
        <h2 className="text-2xl font-bold text-gray-800">Create New User</h2>
      </div>
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Full Name *</label>
          <input
            type="text"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
            className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Jane Doe"
          />
          {errors.name && <p className="mt-1 text-red-500 text-xs">{errors.name}</p>}
        </div>
        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Email *</label>
          <div className="relative mt-1">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="jane.doe@example.com"
            />
          </div>
          {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email}</p>}
        </div>
        {/* Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Password *</label>
          <input
            type="password"
            value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })}
            className={`mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
              errors.password ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-red-500 text-xs">{errors.password}</p>}
        </div>
        {/* Role */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Role *</label>
          <div className="relative mt-1">
            <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <select
              value={formData.role}
              onChange={e => setFormData({ ...formData, role: e.target.value })}
              className={`pl-10 pr-4 py-2 w-full border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              {roles.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          {errors.role && <p className="mt-1 text-red-500 text-xs">{errors.role}</p>}
        </div>
        {/* Avatar */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Avatar *</label>
          <div className="flex items-center space-x-4 mt-1">
            <label
              htmlFor="avatar-upload"
              className="flex items-center px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-200"
            >
              <Upload className="w-5 h-5 text-gray-600 mr-2" />
              Choose Image
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="w-20 h-20 rounded-full object-cover border"
              />
            )}
          </div>
          {errors.avatarUrl && <p className="mt-1 text-red-500 text-xs">{errors.avatarUrl}</p>}
        </div>
        {/* Submit */}
        <div className="pt-4">
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Create User
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateUser;
