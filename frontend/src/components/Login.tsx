import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield, Eye, EyeOff, User, Lock, Mail } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import Footer from './Footer';
import api from '../lib/api';

interface LoginProps {
  onLogin: (name: string) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
}

export default function Login({ onLogin, onNavigateToRegister, onNavigateToForgotPassword }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error('Mohon lengkapi email dan kata sandi.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.post('/login', {
        email,
        password,
      });

      const { access_token, user } = response.data;
      
      localStorage.setItem('token', access_token);
      localStorage.setItem('user', JSON.stringify(user));
      
      toast.success('Login berhasil.');
      onLogin(user.name);
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Login gagal. Periksa kembali kredensial Anda.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0B1E3A] to-[#1a3a5f] items-center justify-center p-12">
        <div className="text-center text-white">
          <div className="flex items-center justify-center mb-8">
            <Shield className="w-24 h-24" />
          </div>
          <h1 className="text-5xl mb-4">SIKAP PP POLRI</h1>
          <p className="text-xl opacity-90 mb-2">
            Sistem Informasi Kasus dan Advokasi PP POLRI
          </p>
          <div className="border-t border-white/20 pt-8 mt-8">
            <p className="text-lg opacity-75">
              Platform internal untuk manajemen kasus hukum dan dokumentasi profesional
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FAFBFC]">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <div className="bg-[#007BFF] p-3 rounded-xl">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-[#0B1E3A] mb-2">Selamat Datang</h2>
              <p className="text-gray-500">Masuk ke sistem SIKAP PP POLRI</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan Email Anda"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-300"
                    disabled={isLoading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Masukkan kata sandi"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-gray-300"
                    disabled={isLoading}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>
              </div>


              <div className="space-y-2">
                <Label htmlFor="role">Pilih Peran</Label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger className="h-12 border-gray-300">
                    <SelectValue placeholder="Pilih peran Anda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="staf">Staf</SelectItem>
                    <SelectItem value="supervisor">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-[#007BFF] hover:bg-[#0066DD] shadow-md"
              >
                Masuk
              </Button>

              <div className="flex items-center justify-between text-sm">
                <button
                  type="button"
                  className="text-[#007BFF] hover:underline"
                  onClick={onNavigateToForgotPassword}
                >
                  Lupa Kata Sandi?
                </button>
                <button
                  type="button"
                  className="text-[#007BFF] hover:underline"
                  onClick={onNavigateToRegister}
                >
                  Daftar Akun Baru
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t text-center text-sm text-gray-500">
              <p>© 2025 POLRI - Kepolisian Negara Republik Indonesia</p>
              <p className="text-xs text-gray-400 mt-1">Sistem Internal - Untuk Keperluan Resmi</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0">
          <Footer />
        </div>
      </div>
    </div>
  );
}