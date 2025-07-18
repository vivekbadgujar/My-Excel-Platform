import { useState } from 'react';
import axios from 'axios';
import { AxiosError } from 'axios'; // Import AxiosError type

interface SignupFormProps {
  onSuccess: () => void;
}

export default function SignupForm({ onSuccess }: SignupFormProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, role: 'user' });
      onSuccess();
    } catch (err) {
      let errorMessage = 'Signup failed';
      if (err instanceof AxiosError) {
        errorMessage = err.response?.data?.error || err.message || errorMessage;
      } else if (err instanceof Error) {
        errorMessage = err.message || errorMessage;
      }
      setError(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground">Name</label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-foreground">Email</label>
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2"
          required
        />
      </div>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        className="w-full bg-primary text-white p-2 rounded-md hover:bg-primary/90"
      >
        Sign Up
      </button>
    </form>
  );
}