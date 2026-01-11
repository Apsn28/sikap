import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Plus, Search, Edit, Trash2, Key, UserX, UserCheck } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

interface TeamMember {
  id: number;
  name: string;
  jabatan: string;
  divisi: string;
  status: 'Aktif' | 'Nonaktif';
  email: string;
  role: string;
  phone?: string;
  specialization?: string;
  photo_url?: string;
}

export default function TimInternal() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<number | null>(null);
  const [memberToReset, setMemberToReset] = useState<TeamMember | null>(null);
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);

  const [newMember, setNewMember] = useState({
    name: '',
    jabatan: '',
    divisi: '',
    email: '',
    role: '',
  });

  const fetchMembers = async () => {
    try {
      const response = await api.get('/team-members');
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
      toast.error('Gagal memuat data anggota tim.');
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.jabatan.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.divisi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddMember = async () => {
    if (!newMember.name || !newMember.jabatan || !newMember.divisi || !newMember.role) {
      toast.error('Mohon lengkapi semua data anggota tim.');
      return;
    }

    try {
      const response = await api.post('/team-members', {
        ...newMember,
        status: 'Aktif',
      });
      setTeamMembers([...teamMembers, response.data]);
      setAddDialogOpen(false);
      setNewMember({ name: '', jabatan: '', divisi: '', email: '', role: '' });
      toast.success('Anggota tim berhasil ditambahkan.');
    } catch (error) {
      console.error('Error adding team member:', error);
      toast.error('Gagal menambahkan anggota tim.');
    }
  };

  const handleEditMember = (member: TeamMember) => {
    setEditingMember({ ...member });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingMember || !editingMember.name || !editingMember.jabatan || !editingMember.divisi || !editingMember.role) {
      toast.error('Mohon lengkapi semua data anggota tim.');
      return;
    }

    try {
      const response = await api.put(`/team-members/${editingMember.id}`, editingMember);
      setTeamMembers(teamMembers.map(m => m.id === editingMember.id ? response.data : m));
      setEditDialogOpen(false);
      setEditingMember(null);
      toast.success('Data anggota tim berhasil diperbarui.');
    } catch (error) {
      console.error('Error updating team member:', error);
      toast.error('Gagal memperbarui data anggota tim.');
    }
  };

  const handleToggleStatus = async (id: number) => {
    const member = teamMembers.find(m => m.id === id);
    if (!member) return;

    const newStatus = member.status === 'Aktif' ? 'Nonaktif' : 'Aktif';

    try {
      const response = await api.put(`/team-members/${id}`, {
        status: newStatus
      });
      setTeamMembers(teamMembers.map((m) =>
        m.id === id ? { ...m, status: newStatus } : m
      ));
      toast.success('Status anggota berhasil diubah.');
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Gagal mengubah status anggota.');
    }
  };

  const handleOpenResetPassword = (member: TeamMember) => {
    setMemberToReset(member);
    setResetPasswordDialogOpen(true);
  };

  const handleConfirmResetPassword = () => {
    if (memberToReset) {
      // Simulation for now as backend doesn't support this yet
      toast.success(`Password untuk ${memberToReset.name} berhasil direset. Password baru telah dikirim ke ${memberToReset.email}`);
      setResetPasswordDialogOpen(false);
      setMemberToReset(null);
    }
  };

  const handleDelete = (id: number) => {
    setMemberToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (memberToDelete) {
      try {
        await api.delete(`/team-members/${memberToDelete}`);
        setTeamMembers(teamMembers.filter((m) => m.id !== memberToDelete));
        toast.success('Anggota tim berhasil dihapus.');
      } catch (error) {
        console.error('Error deleting team member:', error);
        toast.error('Gagal menghapus anggota tim.');
      } finally {
        setDeleteDialogOpen(false);
        setMemberToDelete(null);
      }
    }
  };

  const getStatusBadge = (status: string) => {
    return status === 'Aktif' ? 'bg-green-500' : 'bg-gray-500';
  };

  const getRoleBadge = (role: string) => {
    const colors: { [key: string]: string } = {
      Admin: 'bg-purple-500',
      Supervisor: 'bg-blue-500',
      Verifikator: 'bg-orange-500',
      Staf: 'bg-teal-500',
    };
    return colors[role] || 'bg-gray-500';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#0A2342] mb-2">Tim Internal</h1>
          <p className="text-gray-600">Kelola anggota tim dan hak akses sistem</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
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
                Lengkapi informasi anggota tim di bawah ini
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nama">Nama Lengkap *</Label>
                  <Input
                    id="nama"
                    placeholder="Masukkan nama lengkap"
                    value={newMember.name}
                    onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jabatan">Jabatan *</Label>
                  <Input
                    id="jabatan"
                    placeholder="Masukkan jabatan"
                    value={newMember.jabatan}
                    onChange={(e) => setNewMember({ ...newMember, jabatan: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="divisi">Divisi *</Label>
                  <Select
                    value={newMember.divisi}
                    onValueChange={(value) => setNewMember({ ...newMember, divisi: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih divisi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Investigasi">Investigasi</SelectItem>
                      <SelectItem value="Forensik">Forensik</SelectItem>
                      <SelectItem value="Administrasi">Administrasi</SelectItem>
                      <SelectItem value="Pengawasan">Pengawasan</SelectItem>
                      <SelectItem value="IT">IT</SelectItem>
                      <SelectItem value="Hukum">Hukum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Masukkan email"
                    value={newMember.email}
                    onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="role">Role / Hak Akses *</Label>
                  <Select
                    value={newMember.role}
                    onValueChange={(value) => setNewMember({ ...newMember, role: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Admin">Admin - Akses penuh sistem</SelectItem>
                      <SelectItem value="Supervisor">Supervisor - Monitoring dan approval</SelectItem>
                      <SelectItem value="Verifikator">Verifikator - Verifikasi dokumen</SelectItem>
                      <SelectItem value="Staf">Staf - Akses terbatas</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleAddMember}>
                  Simpan Anggota
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari anggota tim berdasarkan nama, jabatan, atau divisi..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Team Members Table */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-[#0A2342]">
            Total: {filteredMembers.length} Anggota Tim
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nama</TableHead>
                <TableHead>Jabatan</TableHead>
                <TableHead>Divisi</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMembers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    Belum ada data anggota tim.
                  </TableCell>
                </TableRow>
              ) : (
                filteredMembers.map((member) => (
                  <TableRow key={member.id} className="hover:bg-gray-50">
                    <TableCell>
                      <div>
                        <p>{member.name}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{member.jabatan}</TableCell>
                    <TableCell>{member.divisi}</TableCell>
                    <TableCell>
                      <Badge className={`${getRoleBadge(member.role)} text-white`}>
                        {member.role}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusBadge(member.status)} text-white`}>
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditMember(member)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleOpenResetPassword(member)}
                        >
                          <Key className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className={member.status === 'Aktif' ? 'text-orange-500' : 'text-green-500'}
                          onClick={() => handleToggleStatus(member.id)}
                        >
                          {member.status === 'Aktif' ? (
                            <UserX className="w-4 h-4" />
                          ) : (
                            <UserCheck className="w-4 h-4" />
                          )}
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(member.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Edit Member Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Anggota Tim</DialogTitle>
            <DialogDescription>
              Lengkapi informasi anggota tim di bawah ini
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap *</Label>
                <Input
                  id="nama"
                  placeholder="Masukkan nama lengkap"
                  value={editingMember?.name || ''}
                  onChange={(e) => setEditingMember({ ...editingMember!, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="jabatan">Jabatan *</Label>
                <Input
                  id="jabatan"
                  placeholder="Masukkan jabatan"
                  value={editingMember?.jabatan || ''}
                  onChange={(e) => setEditingMember({ ...editingMember!, jabatan: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="divisi">Divisi *</Label>
                <Select
                  value={editingMember?.divisi || ''}
                  onValueChange={(value) => setEditingMember({ ...editingMember!, divisi: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih divisi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Investigasi">Investigasi</SelectItem>
                    <SelectItem value="Forensik">Forensik</SelectItem>
                    <SelectItem value="Administrasi">Administrasi</SelectItem>
                    <SelectItem value="Pengawasan">Pengawasan</SelectItem>
                    <SelectItem value="IT">IT</SelectItem>
                    <SelectItem value="Hukum">Hukum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Masukkan email"
                  value={editingMember?.email || ''}
                  onChange={(e) => setEditingMember({ ...editingMember!, email: e.target.value })}
                />
              </div>
              <div className="space-y-2 col-span-2">
                <Label htmlFor="role">Role / Hak Akses *</Label>
                <Select
                  value={editingMember?.role || ''}
                  onValueChange={(value) => setEditingMember({ ...editingMember!, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Admin">Admin - Akses penuh sistem</SelectItem>
                    <SelectItem value="Supervisor">Supervisor - Monitoring dan approval</SelectItem>
                    <SelectItem value="Verifikator">Verifikator - Verifikasi dokumen</SelectItem>
                    <SelectItem value="Staf">Staf - Akses terbatas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                Batal
              </Button>
              <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleSaveEdit}>
                Simpan Perubahan
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reset Password Confirmation Dialog */}
      <AlertDialog open={resetPasswordDialogOpen} onOpenChange={setResetPasswordDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Reset Password</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin mereset password untuk anggota tim ini? Password baru akan dikirim ke email anggota tim.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmResetPassword}
              className="bg-red-500 hover:bg-red-600"
            >
              Reset Password
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus anggota tim ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
