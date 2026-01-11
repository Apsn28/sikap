import { useState } from 'react';
import { Save, User, Lock, Bell, Globe } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner@2.0.3';
import { Avatar, AvatarFallback } from './ui/avatar';

interface PengaturanSistemProps {
  userName: string;
  userRole: string;
}

export default function PengaturanSistem({ userName, userRole }: PengaturanSistemProps) {
  const [settings, setSettings] = useState({
    emailNotif: true,
    pushNotif: true,
    weeklyReport: false,
    darkMode: false,
  });

  const handleSave = () => {
    toast.success('Pengaturan berhasil disimpan');
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[#0A2342] mb-2">Pengaturan Sistem</h1>
        <p className="text-gray-600">Kelola preferensi dan konfigurasi sistem</p>
      </div>

      <Tabs defaultValue="profil" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="profil">Profil Saya</TabsTrigger>
          <TabsTrigger value="keamanan">Keamanan</TabsTrigger>
          <TabsTrigger value="notifikasi">Notifikasi</TabsTrigger>
          <TabsTrigger value="umum">Umum</TabsTrigger>
        </TabsList>

        <TabsContent value="profil">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Informasi Profil</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex items-center gap-6 mb-8">
                <Avatar className="w-24 h-24">
                  <AvatarFallback className="bg-[#007BFF] text-white text-2xl">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-[#0A2342] mb-1">{userName}</h3>
                  <p className="text-gray-600 mb-3">{userRole}</p>
                  <Button variant="outline" size="sm">Ubah Foto Profil</Button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nama Lengkap</Label>
                  <Input defaultValue={userName} />
                </div>
                <div className="space-y-2">
                  <Label>NIP</Label>
                  <Input defaultValue="198501152010011001" />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input defaultValue="budi.santoso@polri.go.id" />
                </div>
                <div className="space-y-2">
                  <Label>Nomor Telepon</Label>
                  <Input defaultValue="+62 812-3456-7890" />
                </div>
                <div className="space-y-2">
                  <Label>Jabatan</Label>
                  <Input defaultValue="Kepala Divisi" />
                </div>
                <div className="space-y-2">
                  <Label>Divisi</Label>
                  <Input defaultValue="Pidana Khusus" />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Perubahan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="keamanan">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Keamanan Akun</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="text-[#0A2342]">Ubah Kata Sandi</h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Kata Sandi Lama</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Kata Sandi Baru</Label>
                      <Input type="password" />
                    </div>
                    <div className="space-y-2">
                      <Label>Konfirmasi Kata Sandi Baru</Label>
                      <Input type="password" />
                    </div>
                  </div>
                  <Button className="bg-[#007BFF] hover:bg-[#0056b3]">
                    <Lock className="w-4 h-4 mr-2" />
                    Update Kata Sandi
                  </Button>
                </div>

                <div className="pt-6 border-t">
                  <h4 className="text-[#0A2342] mb-4">Log Aktivitas Login</h4>
                  <div className="space-y-3">
                    {[
                      { device: 'Windows PC', location: 'Jakarta', time: '2025-11-12 08:30', status: 'success' },
                      { device: 'Mobile Android', location: 'Jakarta', time: '2025-11-11 18:45', status: 'success' },
                      { device: 'Windows PC', location: 'Bandung', time: '2025-11-10 09:15', status: 'failed' },
                    ].map((log, idx) => (
                      <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p>{log.device} • {log.location}</p>
                          <p className="text-sm text-gray-600">{log.time}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          log.status === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {log.status === 'success' ? 'Berhasil' : 'Gagal'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifikasi">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Preferensi Notifikasi</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p>Notifikasi Email</p>
                    <p className="text-sm text-gray-600">Terima notifikasi melalui email</p>
                  </div>
                  <Switch
                    checked={settings.emailNotif}
                    onCheckedChange={(checked) => setSettings({ ...settings, emailNotif: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p>Notifikasi Push</p>
                    <p className="text-sm text-gray-600">Terima notifikasi push di browser</p>
                  </div>
                  <Switch
                    checked={settings.pushNotif}
                    onCheckedChange={(checked) => setSettings({ ...settings, pushNotif: checked })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p>Laporan Mingguan</p>
                    <p className="text-sm text-gray-600">Terima ringkasan laporan setiap minggu</p>
                  </div>
                  <Switch
                    checked={settings.weeklyReport}
                    onCheckedChange={(checked) => setSettings({ ...settings, weeklyReport: checked })}
                  />
                </div>
              </div>
              <div className="flex justify-end mt-6">
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Simpan Pengaturan
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="umum">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Pengaturan Umum</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p>Mode Gelap</p>
                    <p className="text-sm text-gray-600">Aktifkan tema gelap untuk antarmuka</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => setSettings({ ...settings, darkMode: checked })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bahasa Sistem</Label>
                  <Input value="Bahasa Indonesia" readOnly />
                </div>
                <div className="space-y-2">
                  <Label>Zona Waktu</Label>
                  <Input value="Asia/Jakarta (WIB)" readOnly />
                </div>
                <Button variant="outline" className="w-full" onClick={() => toast.info('Pengaturan direset ke default')}>
                  Reset ke Pengaturan Default
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
