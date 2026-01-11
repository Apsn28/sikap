import { useState } from 'react';
import { Edit2, Trash2, Plus, Search, UserPlus, Lock, UserX, UserCheck } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';

export default function TimInternal() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [teamList, setTeamList] = useState([
    {
      id: 1,
      nama: 'AKBP Budi Santoso',
      jabatan: 'Kepala Divisi',
      divisi: 'Pidana Khusus',
      status: 'Aktif',
      role: 'Admin',
      email: 'budi.santoso@polri.go.id',
      nip: '198501152010011001',
    },
    {
      id: 2,
      nama: 'Brigadir Ahmad Fauzi',
      jabatan: 'Staf Investigasi',
      divisi: 'Pidana Umum',
      status: 'Aktif',
      role: 'Petugas',
      email: 'ahmad.fauzi@polri.go.id',
      nip: '199203182015021002',
    },
    {
      id: 3,
      nama: 'KOMPOL Sri Wahyuni',
      jabatan: 'Supervisor',
      divisi: 'Pidana Korupsi',
      status: 'Aktif',
      role: 'Verifikator',
      email: 'sri.wahyuni@polri.go.id',
      nip: '198709252012012001',
    },
    {
      id: 4,
      nama: 'Brigadir Dewi Lestari',
      jabatan: 'Staf Administrasi',
      divisi: 'Administrasi',
      status: 'Aktif',
      role: 'Petugas',
      email: 'dewi.lestari@polri.go.id',
      nip: '199505102017032003',
    },
    {
      id: 5,
      nama: 'IPTU Eko Prasetyo',
      jabatan: 'Koordinator Lapangan',
      divisi: 'Narkotika',
      status: 'Cuti',
      role: 'Petugas',
      email: 'eko.prasetyo@polri.go.id',
      nip: '199001152014011004',
    },
  ]);

  const handleDelete = (id: number) => {
    setTeamList(teamList.filter(member => member.id !== id));
    toast.success('Anggota tim berhasil dihapus');
  };

  const handleToggleStatus = (id: number) => {
    setTeamList(teamList.map(member => {
      if (member.id === id) {
        const newStatus = member.status === 'Aktif' ? 'Nonaktif' : 'Aktif';
        toast.success(`Status diubah menjadi ${newStatus}`);
        return { ...member, status: newStatus };
      }
      return member;
    }));
  };

  const handleResetPassword = (nama: string) => {
    toast.success('Password direset', {
      description: `Password untuk ${nama} telah direset.`,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif':
        return 'bg-green-100 text-green-700';
      case 'Nonaktif':
        return 'bg-red-100 text-red-700';
      case 'Cuti':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Admin':
        return 'bg-purple-100 text-purple-700';
      case 'Verifikator':
        return 'bg-blue-100 text-blue-700';
      case 'Petugas':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const filteredTeam = teamList.filter(member =>
    member.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.divisi.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.jabatan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0A2342] mb-2">Tim Internal</h1>
          <p className="text-gray-600">Kelola anggota tim dan hak akses sistem</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#007BFF] hover:bg-[#0056b3]">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Anggota Tim
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Anggota Tim Baru</DialogTitle>
              <DialogDescription>
                Lengkapi informasi anggota tim yang akan ditambahkan
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap</Label>
                  <Input id="nama" placeholder="Nama anggota" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="nip">NIP</Label>
                  <Input id="nip" placeholder="Nomor Induk Pegawai" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jabatan">Jabatan</Label>
                  <Input id="jabatan" placeholder="Jabatan" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="divisi">Divisi</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih divisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pidana Khusus">Pidana Khusus</SelectItem>
                      <SelectItem value="Pidana Umum">Pidana Umum</SelectItem>
                      <SelectItem value="Pidana Korupsi">Pidana Korupsi</SelectItem>
                      <SelectItem value="Narkotika">Narkotika</SelectItem>
                      <SelectItem value="Administrasi">Administrasi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin</SelectItem>
                      <SelectItem value="Verifikator">Verifikator</SelectItem>
                      <SelectItem value="Petugas">Petugas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="email@polri.go.id" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button
                  className="bg-[#007BFF] hover:bg-[#0056b3]"
                  onClick={() => {
                    toast.success('Anggota tim berhasil ditambahkan');
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
              placeholder="Cari anggota tim berdasarkan nama, divisi, atau jabatan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Table */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-[#0A2342]">
            Daftar Tim Internal ({filteredTeam.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Nama</TableHead>
                  <TableHead>Jabatan</TableHead>
                  <TableHead>Divisi</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTeam.map((member) => (
                  <TableRow key={member.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p>{member.nama}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{member.jabatan}</TableCell>
                    <TableCell>{member.divisi}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(member.status)}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleColor(member.role)}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => toast.info('Edit anggota')}
                          title="Edit Data"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          onClick={() => handleResetPassword(member.nama)}
                          title="Reset Password"
                        >
                          <Lock className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className={`h-8 w-8 ${
                            member.status === 'Aktif'
                              ? 'text-orange-600 hover:bg-orange-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                          onClick={() => handleToggleStatus(member.id)}
                          title={member.status === 'Aktif' ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          {member.status === 'Aktif' ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                              title="Hapus Anggota"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Hapus Anggota Tim?</AlertDialogTitle>
                              <AlertDialogDescription>
                                Apakah Anda yakin ingin menghapus {member.nama} dari tim?
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Batal</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(member.id)}
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
