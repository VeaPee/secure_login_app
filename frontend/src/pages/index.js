import { useState } from 'react';
import api from '../utils/api'; // Assuming you have this api utility
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import {
  Mail, KeyRound, Eye, EyeOff, LogIn,
  LoaderCircle, AlertTriangle, User
} from 'lucide-react';

// Input component remains the same as it's a good reusable component
const Input = ({ id, name, type, placeholder, value, onChange, icon: Icon, children }) => (
  <div className="relative flex items-center">
    <Icon className="absolute left-4 h-5 w-5 text-gray-400" />
    <input
      id={id}
      name={name}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-gray-300 bg-white/70 py-3 pl-12 pr-4 text-gray-800 backdrop-blur-md transition-all duration-200 placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />
    {children}
  </div>
);

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [apiError, setApiError] = useState('');
  const [validationErrors, setValidationErrors] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear validation error for the field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors({ ...validationErrors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = { email: '', password: '' };
    let isValid = true;

    // Email validation
    if (!form.email) {
      newErrors.email = 'Email is required.';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      newErrors.email = 'Please provide a valid email.';
      isValid = false;
    }

    // Password validation
    if (!form.password) {
      newErrors.password = 'Password is required.';
      isValid = false;
    }

    setValidationErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Clear previous API error
    setApiError('');

    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const res = await api.post('/auth/login', form);
      Cookies.set('token', res.data.token, { expires: 7 });
      router.push('/dashboard');
    } catch (err) {
      setApiError(
        err.response?.data?.message ||
          'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-gradient-to-tr from-gray-100 to-white px-4">
      {/* Background decorative elements */}
      <div className="pointer-events-none absolute inset-0 z-0">
        <div className="absolute top-0 left-0 h-72 w-72 rounded-full bg-purple-300/40 blur-3xl animate-pulse"></div>
        <div className="absolute top-20 right-0 h-72 w-72 rounded-full bg-blue-300/40 blur-3xl animate-pulse animation-delay-1000"></div>
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink-300/30 blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="rounded-3xl border border-white/30 bg-white/80 p-8 shadow-xl backdrop-blur-md transition-all duration-300 hover:shadow-2xl">
          <div className="mb-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-purple-600 shadow-md">
              <User size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Welcome Back</h1>
            <p className="mt-1 text-sm text-gray-600">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                icon={Mail}
              />
              {validationErrors.email && <p className="mt-1.5 text-xs text-red-600">{validationErrors.email}</p>}
            </div>

            <div>
              <Input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                icon={KeyRound}
              >
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 text-gray-500 transition hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </Input>
              {validationErrors.password && <p className="mt-1.5 text-xs text-red-600">{validationErrors.password}</p>}
            </div>

            {apiError && (
              <div className="flex items-center gap-2 rounded-lg border-l-4 border-red-400 bg-red-50 p-3">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                <p className="text-sm text-red-700">{apiError}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="group relative flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 py-3 px-6 font-semibold text-white shadow-md transition-all duration-200 hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? (
                <LoaderCircle size={20} className="animate-spin" />
              ) : (
                <LogIn size={20} className="transition-transform group-hover:scale-105" />
              )}
              <span>{loading ? 'Processing...' : 'Sign In'}</span>
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <a
              href="/register"
              className="font-semibold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text hover:underline"
            >
              Sign up here
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}