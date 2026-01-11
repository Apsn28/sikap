import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Switch } from '../ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Avatar, AvatarFallback } from '../ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Save, Upload, Key, Bell, Shield, RefreshCw } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface PengaturanSistemProps {
  userName: string;
}

export default function PengaturanSistem({ userName }: PengaturanSistemProps) {
  const [emailNotif, setEmailNotif] = useState(true);
  const [pushNotif, setPushNotif] = useState(true);
  const [reminderNotif, setReminderNotif] = useState(true);

  const handleSaveSettings = () => {
    toast.success('Pengaturan berhasil disimpan.');
  };

  const handleChangePassword = () => {
    toast.success('Kata sandi berhasil diubah.');
  };

  const handleResetSettings = () => {
    toast.success('Pengaturan dikembalikan ke default.');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-[#0A2342] mb-2">Pengaturan Sistem</h1>
        <p className="text-gray-600">Kelola preferensi dan pengaturan akun Anda</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="umum" className="space-y-6">
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="umum">Umum</TabsTrigger>
          <TabsTrigger value="keamanan">Keamanan</TabsTrigger>
          <TabsTrigger value="profil">Profil Saya</TabsTrigger>
          <TabsTrigger value="notifikasi">Notifikasi Sistem</TabsTrigger>
          <TabsTrigger value="integrasi">Integrasi & API</TabsTrigger>
        </TabsList>

        {/* Umum */}
        <TabsContent value="umum">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Pengaturan Umum</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-2">
                <Label>Tema Tampilan</Label>
                <Select defaultValue="light">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="light">Terang</SelectItem>
                    <SelectItem value="dark">Gelap</SelectItem>
                    <SelectItem value="auto">Otomatis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Bahasa Sistem</Label>
                <Select defaultValue="id">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="id">Bahasa Indonesia</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Zona Waktu</Label>
                <Select defaultValue="wib">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wib">WIB (GMT+7)</SelectItem>
                    <SelectItem value="wita">WITA (GMT+8)</SelectItem>
                    <SelectItem value="wit">WIT (GMT+9)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tampilan Sidebar</Label>
                <Select defaultValue="expanded">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="expanded">Diperluas</SelectItem>
                    <SelectItem value="collapsed">Disembunyikan</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between pt-4">
                <Button variant="outline" onClick={handleResetSettings}>
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Reset ke Default
                </Button>
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleSaveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Pengaturan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Keamanan */}
        <TabsContent value="keamanan">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Keamanan Akun</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-4">
                <h3 className="flex items-center gap-2 text-lg">
                  <Key className="w-5 h-5" />
                  Ganti Kata Sandi
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="oldPassword">Kata Sandi Lama</Label>
                    <Input id="oldPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Kata Sandi Baru</Label>
                    <Input id="newPassword" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Konfirmasi Kata Sandi Baru</Label>
                    <Input id="confirmPassword" type="password" />
                  </div>
                  <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleChangePassword}>
                    <Key className="w-4 h-4 mr-2" />
                    Ubah Kata Sandi
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="flex items-center gap-2 text-lg">
                  <Shield className="w-5 h-5" />
                  Log Aktivitas Login
                </h3>
                <div className="space-y-3">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Login berhasil</p>
                        <p className="text-sm text-gray-600">12 November 2025, 08:30 WIB</p>
                        <p className="text-sm text-gray-600">IP: 192.168.1.1 • Jakarta, Indonesia</p>
                      </div>
                      <span className="text-green-600">✓ Sukses</span>
                    </div>
                  </div>
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Login berhasil</p>
                        <p className="text-sm text-gray-600">11 November 2025, 14:15 WIB</p>
                        <p className="text-sm text-gray-600">IP: 192.168.1.1 • Jakarta, Indonesia</p>
                      </div>
                      <span className="text-green-600">✓ Sukses</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Profil */}
        <TabsContent value="profil">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Profil Saya</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24 bg-[#007BFF]">
                  <AvatarFallback className="text-2xl">{getInitials(userName)}</AvatarFallback>
                </Avatar>
                <div>
                  <Button variant="outline">
                    <Upload className="w-4 h-4 mr-2" />
                    Ganti Foto Profil
                  </Button>
                  <p className="text-sm text-gray-500 mt-2">JPG, PNG maks. 2MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input id="nama" defaultValue={userName} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP</Label>
                  <Input id="nip" defaultValue="198501012010011001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jabatan">Jabatan</Label>
                  <Input id="jabatan" defaultValue="Kepala Unit Investigasi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="divisi">Divisi</Label>
                  <Input id="divisi" defaultValue="Investigasi" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="ahmad.yani@polri.go.id" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telepon">Nomor Telepon</Label>
                  <Input id="telepon" defaultValue="+62 812 3456 7890" />
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleSaveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifikasi */}
        <TabsContent value="notifikasi">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Notifikasi Sistem</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p>Notifikasi Email</p>
                  <p className="text-sm text-gray-600">Terima pemberitahuan melalui email</p>
                </div>
                <Switch checked={emailNotif} onCheckedChange={setEmailNotif} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p>Notifikasi Push</p>
                  <p className="text-sm text-gray-600">Terima pemberitahuan push di browser</p>
                </div>
                <Switch checked={pushNotif} onCheckedChange={setPushNotif} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p>Pengingat Tenggat</p>
                  <p className="text-sm text-gray-600">Aktifkan pengingat untuk tenggat kasus</p>
                </div>
                <Switch checked={reminderNotif} onCheckedChange={setReminderNotif} />
              </div>

              <div className="border-t pt-6 space-y-4">
                <h3 className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  Preferensi Notifikasi
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="kasus-baru" defaultChecked className="w-4 h-4" />
                    <Label htmlFor="kasus-baru">Kasus baru ditambahkan</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="status-update" defaultChecked className="w-4 h-4" />
                    <Label htmlFor="status-update">Status kasus diperbarui</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="dokumen-upload" defaultChecked className="w-4 h-4" />
                    <Label htmlFor="dokumen-upload">Dokumen baru diunggah</Label>
                  </div>
                  <div className="flex items-center gap-3">
                    <input type="checkbox" id="tugas-baru" defaultChecked className="w-4 h-4" />
                    <Label htmlFor="tugas-baru">Tugas baru ditugaskan</Label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleSaveSettings}>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Pengaturan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrasi & API */}
        <TabsContent value="integrasi">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Integrasi & API</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="mb-4">Token API Internal</h3>
                <div className="space-y-4">
                  <div className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div>
                        <p>Token API Aktif</p>
                        <p className="text-sm font-mono text-gray-600 mt-1">sk_live_xxxxxxxxxxxxxxxxxxxxx</p>
                        <p className="text-xs text-gray-500 mt-1">Dibuat: 1 November 2025</p>
                      </div>
                      <Button variant="outline" size="sm">
                        Salin
                      </Button>
                    </div>
                  </div>
                  <Button variant="outline">
                    <Key className="w-4 h-4 mr-2" />
                    Generate Token Baru
                  </Button>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="mb-4">Riwayat API Call</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm">Total Request (30 hari)</span>
                    <span>1,234 calls</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm">Success Rate</span>
                    <span className="text-green-600">99.2%</span>
                  </div>
                  <div className="flex items-center justify-between border-b pb-2">
                    <span className="text-sm">Avg Response Time</span>
                    <span>125ms</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
