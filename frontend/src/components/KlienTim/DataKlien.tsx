import { useState } from 'react';
import { Eye, Edit2, Trash2, Plus, Search, User } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { toast } from 'sonner@2.0.3';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

export default function DataKlien() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedKlien, setSelectedKlien] = useState<any>(null);

  const [klienList, setKlienList] = useState([
    {
      id: 1,
      nama: 'PT. Maju Bersama',
      nik: '3201234567890123',
      alamat: 'Jl. Sudirman No. 123, Jakarta',
      kasusAktif: 3,
      kontak: '+62 812-3456-7890',
      email: 'contact@majubersama.co.id',
    },
    {
      id: 2,
      nama: 'Ahmad Hidayat',
      nik: '3301234567890124',
      alamat: 'Jl. Gatot Subroto No. 45, Bandung',
      kasusAktif: 1,
      kontak: '+62 813-4567-8901',
      email: 'ahmad.hidayat@email.com',
    },
    {
      id: 3,
      nama: 'CV. Karya Mandiri',
      nik: '3401234567890125',
      alamat: 'Jl. Ahmad Yani No. 67, Surabaya',
      kasusAktif: 2,
      kontak: '+62 814-5678-9012',
      email: 'info@karyamandiri.co.id',
    },
    {
      id: 4,
      nama: 'Siti Nurhaliza',
      nik: '3501234567890126',
      alamat: 'Jl. Diponegoro No. 89, Semarang',
      kasusAktif: 1,
      kontak: '+62 815-6789-0123',
      email: 'siti.nurhaliza@email.com',
    },
    {
      id: 5,
      nama: 'Yayasan Pendidikan Harapan',
      nik: '3601234567890127',
      alamat: 'Jl. Pahlawan No. 12, Yogyakarta',
      kasusAktif: 2,
      kontak: '+62 816-7890-1234',
      email: 'harapan@yayasan.org',
    },
  ]);

  const handleDelete = (id: number) => {
    setKlienList(klienList.filter(klien => klien.id !== id));
    toast.success('Klien dihapus dari sistem');
  };

  const handleViewDetail = (klien: any) => {
    setSelectedKlien(klien);
  };

  const filteredKlien = klienList.filter(klien =>
    klien.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    klien.nik.includes(searchTerm) ||
    klien.kontak.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0A2342] mb-2">Data Klien</h1>
          <p className="text-gray-600">Kelola informasi klien dan riwayat kasus</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#007BFF] hover:bg-[#0056b3]">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Klien
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Klien Baru</DialogTitle>
              <DialogDescription>
                Lengkapi informasi klien baru yang akan ditambahkan ke sistem
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input id="nama" placeholder="Nama klien" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nik">NIK</Label>
                  <Input id="nik" placeholder="Nomor Induk Kependudukan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kontak">Nomor Kontak</Label>
                  <Input id="kontak" placeholder="+62 xxx-xxxx-xxxx" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@example.com" />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="alamat">Alamat Lengkap</Label>
                  <Input id="alamat" placeholder="Alamat lengkap klien" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button
                  className="bg-[#007BFF] hover:bg-[#0056b3]"
                  onClick={() => {
                    toast.success('Klien berhasil ditambahkan');
                    setIsAddDialogOpen(false);
                  }}
                >
                  Simpan
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari klien berdasarkan nama, NIK, atau kontak..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-[#0A2342]">
            Daftar Klien ({filteredKlien.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Nama</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead>Alamat</TableHead>
                  <TableHead>Kasus Aktif</TableHead>
                  <TableHead>Kontak</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredKlien.map((klien) => (
                  <TableRow key={klien.id} className="hover:bg-gray-50">
                    <TableCell>{klien.nama}</TableCell>
                    <TableCell>{klien.nik}</TableCell>
                    <TableCell className="max-w-xs truncate">{klien.alamat}</TableCell>
                    <TableCell>
                      <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-[#007BFF] rounded-full">
                        {klien.kasusAktif}
                      </span>
                    </TableCell>
                    <TableCell>{klien.kontak}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8"
                              onClick={() => handleViewDetail(klien)}
                            >
                              <Eye className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Detail Klien</DialogTitle>
                              <DialogDescription>
                                Informasi lengkap klien dan riwayat kasus
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                              <div className="flex items-center gap-4">
                                <div className="w-20 h-20 bg-[#007BFF] rounded-full flex items-center justify-center text-white text-2xl">
                                  {klien.nama.charAt(0)}
                                </div>
                                <div>
                                  <h3 className="text-[#0A2342] mb-1">{klien.nama}</h3>
                                  <p className="text-gray-600">{klien.email}</p>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                <div>
                                  <Label className="text-gray-600">NIK</Label>
                                  <p className="mt-1">{klien.nik}</p>
                                </div>
                                <div>
                                  <Label className="text-gray-600">Kontak</Label>
                                  <p className="mt-1">{klien.kontak}</p>
                                </div>
                                <div className="col-span-2">
                                  <Label className="text-gray-600">Alamat</Label>
                                  <p className="mt-1">{klien.alamat}</p>
                                </div>
                                <div>
                                  <Label className="text-gray-600">Kasus Aktif</Label>
                                  <p className="mt-1">{klien.kasusAktif} kasus</p>
                                </div>
                              </div>
                              <div className="pt-4 border-t">
                                <h4 className="text-[#0A2342] mb-3">Riwayat Kasus</h4>
                                <div className="space-y-2">
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm">KS-2025-001 - Pidana Korupsi</p>
                                    <p className="text-xs text-gray-600 mt-1">Status: Dalam Proses</p>
                                  </div>
                                  <div className="p-3 bg-gray-50 rounded-lg">
                                    <p className="text-sm">KS-2024-089 - Perdata</p>
                                    <p className="text-xs text-gray-600 mt-1">Status: Selesai</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => toast.info('Edit klien')}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Klien?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus {klien.nama} dari sistem?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(klien.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Hapus
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}