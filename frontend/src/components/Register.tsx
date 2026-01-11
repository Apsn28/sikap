import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Shield, ArrowLeft, User, Mail, Phone, Lock, UserPlus } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import Footer from './Footer';
import api from '../lib/api';

interface RegisterProps {
  onBackToLogin: () => void;
}

export default function Register({ onBackToLogin }: RegisterProps) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!fullName || !email || !phoneNumber || !password || !confirmPassword || !role) {
      toast.error('Mohon lengkapi semua field.');
      return;
    }

    if (password !== confirmPassword) {
      toast.error('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (password.length < 8) {
      toast.error('Kata sandi minimal 8 karakter.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Format email tidak valid.');
      return;
    }

    // Phone validation
    if (phoneNumber.length < 10) {
      toast.error('Nomor telepon tidak valid.');
      return;
    }

    setIsLoading(true);

    try {
      await api.post('/register', {
        name: fullName,
        email: email,
        password: password,
        password_confirmation: confirmPassword,
      });

      toast.success('Akun berhasil dibuat. Silakan masuk untuk melanjutkan.');
      setTimeout(() => {
        onBackToLogin();
      }, 1500);
    } catch (error: any) {
      console.error(error);
      const message = error.response?.data?.message || 'Gagal mendaftar. Silakan coba lagi.';
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
              Daftar akun baru untuk akses internal POLRI
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Register Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FAFBFC] relative">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <div className="bg-[#007BFF] p-3 rounded-xl">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-[#0B1E3A] mb-2">Daftar Akun Baru</h2>
              <p className="text-gray-500">Buat akun untuk akses sistem SIKAP PP POLRI</p>
            </div>

            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nama Lengkap</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="Masukkan nama lengkap"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-12 border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="contoh@polri.go.id"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Nomor Telepon</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder="08xx-xxxx-xxxx"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="pl-10 h-12 border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Kata Sandi</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="Minimal 8 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-12 border-gray-300"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="Ulangi kata sandi"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="pl-10 h-12 border-gray-300"
                  />
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
                <UserPlus className="w-5 h-5 mr-2" />
                Daftar Sekarang
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  className="text-[#007BFF] hover:underline text-sm inline-flex items-center gap-1"
                  onClick={onBackToLogin}
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Halaman Login
                </button>
              </div>
            </form>
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