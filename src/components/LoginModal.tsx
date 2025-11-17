import { useState } from 'react';
import { X } from 'lucide-react';

interface LoginModalProps {
  title: string;
  onClose: () => void;
  onLogin: (email: string, password: string) => void;
}

export function LoginModal({ title, onClose, onLogin }: LoginModalProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(email, password);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-slate-900 rounded-3xl max-w-md w-full p-8 border border-slate-800" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-slate-400 mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="w-full bg-slate-800 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:outline-none text-center"
              required
            />
          </div>
          <div>
            <label className="block text-slate-400 mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-800 text-white rounded-lg p-3 border border-slate-700 focus:border-orange-500 focus:outline-none text-center"
              required
            />
          </div>
          
          <button
            type="submit"
            className="w-full bg-orange-500 text-white py-3 rounded-full hover:bg-orange-600 transition-colors flex items-center justify-center"
          >
            Sign In
          </button>
          
          <p className="text-slate-400 text-center text-sm">
            Don't have an account? <a href="#" className="text-orange-500 hover:text-orange-400">Sign up</a>
          </p>
        </form>
        
        <div className="mt-6 pt-6 border-t border-slate-800">
          <p className="text-slate-500 text-xs text-center">
            Demo credentials: Use any email/password to login
          </p>
        </div>
      </div>
    </div>
  );
}