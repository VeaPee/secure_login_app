// src/pages/register.js
import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({
    email: '',
    password: '',
  });
  const [strength, setStrength] = useState(0);

  const strengthColors = ['gray-400', 'red-500', 'yellow-500', 'green-500'];

  const getStrength = (pwd) => {
    let s = 0;
    if (pwd.length > 7) s++;
    if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) s++;
    if (/[0-9]/.test(pwd) && /[^A-Za-z0-9]/.test(pwd)) s++;
    return s;
  };

  const validateField = (name, value) => {
    let message = '';
    if (name === 'email') {
      if (value.length < 5 || value.length > 255) {
        message = 'Email must be between 5 and 255 characters.';
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        message = 'Please enter a valid email address.';
      }
    }
    if (name === 'password') {
      const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      if (!passwordRegex.test(value)) {
        message = 'Password must be 8+ characters, with an uppercase, lowercase, number, and special character.';
      }
    }
    return message;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    const validationMessage = validateField(name, value);
    setValidationErrors((prev) => ({ ...prev, [name]: validationMessage }));

    if (name === 'password') {
      setStrength(getStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const emailValidationError = validateField('email', formData.email);
    const passwordValidationError = validateField('password', formData.password);

    if (emailValidationError || passwordValidationError) {
      setValidationErrors({
        email: emailValidationError,
        password: passwordValidationError,
      });
      return;
    }

    setError('');
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/auth/register', formData);
      router.push('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = !validationErrors.email && !validationErrors.password && formData.email && formData.password;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800 px-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold tracking-tight text-gray-800 dark:text-white mb-4">Create a New Account</h1>

        {error && <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              required
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500"
              value={formData.email}
              onChange={handleChange}
            />
            {validationErrors.email && <p className="mt-1 text-xs text-red-500">{validationErrors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              required
              className="mt-1 w-full rounded-md border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 px-3 py-2 text-gray-900 dark:text-white shadow-sm focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500"
              value={formData.password}
              onChange={handleChange}
            />
            {validationErrors.password && <p className="mt-1 text-xs text-red-500">{validationErrors.password}</p>}
            {formData.password && !validationErrors.password && (
              <p className={`text-xs font-medium text-${strengthColors[strength]}`}>Strength: {['Weak', 'Fair', 'Good', 'Strong'][strength]}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading || !isFormValid}
            className="w-full rounded-xl bg-gradient-to-r from-emerald-500 to-indigo-500 py-3 px-6 font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105 hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <p className="mt-4 text-sm text-gray-700 dark:text-gray-300">
          Already have an account?{' '}
          <a
            href="/"
            className="font-semibold bg-gradient-to-r from-emerald-600 to-indigo-600 bg-clip-text text-transparent hover:underline"
          >
            Sign in here
          </a>
        </p>
      </div>
    </div>
  );
}