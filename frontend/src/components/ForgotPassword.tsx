import { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { InputOTP, InputOTPGroup, InputOTPSlot } from './ui/input-otp';
import { Shield, ArrowLeft, Mail, Lock, CheckCircle2, KeyRound } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import Footer from './Footer';

interface ForgotPasswordProps {
  onBackToLogin: () => void;
}

export default function ForgotPassword({ onBackToLogin }: ForgotPasswordProps) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  // Mock verification code for demo
  const MOCK_CODE = '123456';

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Mohon masukkan alamat email.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Format email tidak valid.');
      return;
    }

    toast.success('Kode verifikasi telah dikirim ke email Anda.');
    toast.info(`Kode verifikasi demo: ${MOCK_CODE}`);
    setStep(2);
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();

    if (!verificationCode || verificationCode.length !== 6) {
      toast.error('Mohon masukkan kode verifikasi 6 digit.');
      return;
    }

    if (verificationCode !== MOCK_CODE) {
      toast.error('Kode verifikasi tidak valid.');
      return;
    }

    toast.success('Kode verifikasi berhasil diverifikasi.');
    setStep(3);
  };

  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();

    if (!newPassword || !confirmNewPassword) {
      toast.error('Mohon lengkapi semua field.');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      toast.error('Kata sandi dan konfirmasi kata sandi tidak cocok.');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('Kata sandi minimal 8 karakter.');
      return;
    }

    toast.success('Kata sandi berhasil diperbarui.');
    setTimeout(() => {
      onBackToLogin();
    }, 1500);
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
              Reset kata sandi Anda dengan mudah dan aman
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Reset Password Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#FAFBFC] relative">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="flex items-center justify-center mb-4 lg:hidden">
                <div className="bg-[#007BFF] p-3 rounded-xl">
                  <Shield className="w-12 h-12 text-white" />
                </div>
              </div>
              <h2 className="text-[#0A2342] mb-2">Lupa Kata Sandi</h2>
              <p className="text-gray-500">
                {step === 1 && 'Masukkan email Anda untuk menerima kode verifikasi'}
                {step === 2 && 'Masukkan kode verifikasi 6 digit'}
                {step === 3 && 'Buat kata sandi baru Anda'}
              </p>
            </div>

            {/* Progress Indicator */}
            <div className="flex items-center justify-center mb-8 gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 1 ? 'bg-[#007BFF] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : '1'}
              </div>
              <div className={`w-16 h-1 ${step >= 2 ? 'bg-[#007BFF]' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 2 ? 'bg-[#007BFF] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : '2'}
              </div>
              <div className={`w-16 h-1 ${step >= 3 ? 'bg-[#007BFF]' : 'bg-gray-200'}`}></div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                step >= 3 ? 'bg-[#007BFF] text-white' : 'bg-gray-200 text-gray-500'
              }`}>
                3
              </div>
            </div>

            {/* Step 1: Email Input */}
            {step === 1 && (
              <form onSubmit={handleSendCode} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="email">Alamat Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="contoh@polri.go.id"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12 border-gray-300"
                      autoFocus
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#007BFF] hover:bg-[#0066DD] shadow-md"
                >
                  Kirim Kode Verifikasi
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
            )}

            {/* Step 2: Verification Code Input */}
            {step === 2 && (
              <form onSubmit={handleVerifyCode} className="space-y-5">
                <div className="space-y-2">
                  <Label className="text-center block">Kode Verifikasi</Label>
                  <div className="flex justify-center otp-input">
                    <InputOTP
                      maxLength={6}
                      value={verificationCode}
                      onChange={(value) => setVerificationCode(value)}
                    >
                      <InputOTPGroup className="gap-3">
                        <InputOTPSlot index={0} className="w-12 h-14 text-lg" />
                        <InputOTPSlot index={1} className="w-12 h-14 text-lg" />
                        <InputOTPSlot index={2} className="w-12 h-14 text-lg" />
                        <InputOTPSlot index={3} className="w-12 h-14 text-lg" />
                        <InputOTPSlot index={4} className="w-12 h-14 text-lg" />
                        <InputOTPSlot index={5} className="w-12 h-14 text-lg" />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Kode telah dikirim ke {email}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#007BFF] hover:bg-[#0066DD] shadow-md"
                >
                  Verifikasi Kode
                </Button>

                <div className="text-center space-y-2">
                  <button
                    type="button"
                    className="text-[#007BFF] hover:underline text-sm"
                    onClick={handleSendCode}
                  >
                    Kirim Ulang Kode
                  </button>
                  <br />
                  <button
                    type="button"
                    className="text-gray-500 hover:underline text-sm inline-flex items-center gap-1"
                    onClick={() => setStep(1)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Ubah Email
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: New Password Input */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="newPassword"
                      type="password"
                      placeholder="Minimal 8 karakter"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="pl-10 h-12 border-gray-300"
                      autoFocus
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmNewPassword">Konfirmasi Kata Sandi Baru</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      placeholder="Ulangi kata sandi baru"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="pl-10 h-12 border-gray-300"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#007BFF] hover:bg-[#0066DD] shadow-md"
                >
                  <KeyRound className="w-5 h-5 mr-2" />
                  Reset Kata Sandi
                </Button>

                <div className="text-center">
                  <button
                    type="button"
                    className="text-gray-500 hover:underline text-sm inline-flex items-center gap-1"
                    onClick={() => setStep(2)}
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Kembali
                  </button>
                </div>
              </form>
            )}
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