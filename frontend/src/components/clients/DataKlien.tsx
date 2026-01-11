import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Avatar, AvatarFallback } from '../ui/avatar';
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Plus, Search, Eye, Edit, Trash2, User, Phone, Mail, MapPin, FileText, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

interface Client {
  id: number;
  name: string;
  nik: string;
  address: string;
  cases_count: number;
  status: string;
  phone: string;
  email: string;
  type: string;
}

export default function DataKlien() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [clientToDelete, setClientToDelete] = useState<number | null>(null);
  const [newClient, setNewClient] = useState({
    name: '',
    nik: '',
    address: '',
    phone: '',
    email: '',
    type: 'individual', // Default type
  });
  const [editClient, setEditClient] = useState<Client | null>(null);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const response = await api.get('/clients');
      setClients(response.data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
      toast.error('Gagal memuat data klien.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const filteredClients = clients.filter((client) =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.nik && client.nik.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (client.address && client.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleViewDetail = (client: Client) => {
    setSelectedClient(client);
    setDetailDialogOpen(true);
  };

  const handleEditClient = (client: Client) => {
    setEditClient(client);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editClient || !editClient.name || !editClient.phone) {
      toast.error('Mohon lengkapi nama dan kontak klien.');
      return;
    }

    try {
      await api.put(`/clients/${editClient.id}`, {
        name: editClient.name,
        nik: editClient.nik,
        address: editClient.address,
        phone: editClient.phone,
        email: editClient.email,
        type: editClient.type,
        status: editClient.status,
      });
      
      toast.success('Data klien berhasil diperbarui.');
      setEditDialogOpen(false);
      setEditClient(null);
      fetchClients(); // Refresh data
    } catch (error) {
      console.error('Failed to update client:', error);
      toast.error('Gagal memperbarui data klien.');
    }
  };

  const handleAddClient = async () => {
    if (!newClient.name || !newClient.phone) {
      toast.error('Mohon lengkapi nama dan kontak klien.');
      return;
    }

    try {
      await api.post('/clients', newClient);
      
      toast.success('Klien berhasil ditambahkan.');
      setAddDialogOpen(false);
      setNewClient({ name: '', nik: '', address: '', phone: '', email: '', type: 'individual' });
      fetchClients(); // Refresh data
    } catch (error) {
      console.error('Failed to add client:', error);
      toast.error('Gagal menambahkan klien.');
    }
  };

  const handleDelete = (id: number) => {
    setClientToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (clientToDelete) {
      try {
        await api.delete(`/clients/${clientToDelete}`);
        toast.success('Data klien berhasil dihapus.');
        setDeleteDialogOpen(false);
        setClientToDelete(null);
        fetchClients(); // Refresh data
      } catch (error) {
        console.error('Failed to delete client:', error);
        toast.error('Gagal menghapus data klien.');
      }
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500 text-white';
      case 'inactive': return 'bg-gray-500 text-white';
      case 'new': return 'bg-blue-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="space-y-6 p-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0A2342] mb-2">Data Klien</h1>
          <p className="text-gray-500">Kelola informasi dan kontak klien yang terdaftar</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#007BFF] hover:bg-[#0066DD] shadow-md">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Klien Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Klien Baru</DialogTitle>
              <DialogDescription>
                Lengkapi formulir berikut untuk mendaftarkan klien baru
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Nama Lengkap / Nama Perusahaan</Label>
                <Input
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  className="mt-1 border-gray-300"
                />
              </div>
              <div>
                <Label>NIK / NPWP</Label>
                <Input
                  value={newClient.nik}
                  onChange={(e) => setNewClient({ ...newClient, nik: e.target.value })}
                  placeholder="Masukkan NIK atau NPWP"
                  className="mt-1 border-gray-300"
                />
              </div>
              <div>
                <Label>Alamat</Label>
                <Textarea
                  value={newClient.address}
                  onChange={(e) => setNewClient({ ...newClient, address: e.target.value })}
                  placeholder="Masukkan alamat lengkap"
                  className="mt-1 border-gray-300"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nomor Telepon</Label>
                  <Input
                    value={newClient.phone}
                    onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                    placeholder="+62 xxx xxxx xxxx"
                    className="mt-1 border-gray-300"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={newClient.email}
                    onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                    placeholder="email@example.com"
                    className="mt-1 border-gray-300"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setAddDialogOpen(false)} className="border-gray-300">
                  Batal
                </Button>
                <Button onClick={handleAddClient} className="bg-[#007BFF] hover:bg-[#0066DD]">
                  Simpan Klien
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="shadow-sm border-l-4 border-l-[#007BFF]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Klien</p>
                <h3 className="text-[#007BFF]">{clients.length}</h3>
              </div>
              <User className="w-8 h-8 text-[#007BFF] opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-[#1DB954]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Pendampingan Aktif</p>
                <h3 className="text-[#1DB954]">{clients.filter(c => c.status === 'active').length}</h3>
              </div>
              <FileText className="w-8 h-8 text-[#1DB954] opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-[#FFA726]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Kasus Aktif</p>
                <h3 className="text-[#FFA726]">{clients.reduce((sum, c) => sum + (c.cases_count || 0), 0)}</h3>
              </div>
              <AlertCircle className="w-8 h-8 text-[#FFA726] opacity-20" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-sm border-l-4 border-l-[#E53935]">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Memerlukan Tindak Lanjut</p>
                <h3 className="text-[#E53935]">{clients.filter(c => (c.cases_count || 0) > 1).length}</h3>
              </div>
              <AlertCircle className="w-8 h-8 text-[#E53935] opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search & Filter */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari klien berdasarkan nama, NIK, atau alamat..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-gray-300"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clients Table */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="border-b bg-[#FAFBFC]">
          <CardTitle className="text-[#0A2342]">Daftar Klien ({filteredClients.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead>Klien</TableHead>
                <TableHead>NIK / NPWP</TableHead>
                <TableHead>Alamat</TableHead>
                <TableHead className="text-center">Kasus Aktif</TableHead>
                <TableHead>Status Pendampingan</TableHead>
                <TableHead>Kontak</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                   <TableCell colSpan={7} className="text-center py-8">
                     Memuat data...
                   </TableCell>
                </TableRow>
              ) : filteredClients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <User className="w-12 h-12" />
                      <p>Belum ada data klien yang sesuai dengan pencarian.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredClients.map((client) => (
                  <TableRow key={client.id} className="hover:bg-gray-50 transition-colors">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-[#007BFF]">
                          <AvatarFallback className="bg-[#007BFF] text-white">
                            {getInitials(client.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p>{client.name}</p>
                          <p className="text-sm text-gray-500">{client.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-mono text-sm">{client.nik || '-'}</span>
                    </TableCell>
                    <TableCell className="text-sm">{client.address || '-'}</TableCell>
                    <TableCell className="text-center">
                      {(client.cases_count || 0) > 0 ? (
                        <Badge className="bg-[#FFA726] text-white border-0">
                          {client.cases_count} kasus
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(client.status)} border-0`}>
                        {client.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{client.phone}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewDetail(client)}
                          className="text-[#007BFF] hover:text-[#0056b3] hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditClient(client)}
                          className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                          onClick={() => handleDelete(client.id)}
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

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Klien</DialogTitle>
            <DialogDescription>Informasi lengkap klien dan riwayat kasus</DialogDescription>
          </DialogHeader>
          {selectedClient && (
            <div className="space-y-6">
              <div className="flex items-center gap-4 pb-4 border-b">
                <Avatar className="h-16 w-16 bg-[#007BFF]">
                  <AvatarFallback className="bg-[#007BFF] text-white text-xl">
                    {getInitials(selectedClient.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3>{selectedClient.name}</h3>
                  <p className="text-sm text-gray-500">{selectedClient.email}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-500">NIK / NPWP</Label>
                  <p className="mt-1 font-mono">{selectedClient.nik || '-'}</p>
                </div>
                <div>
                  <Label className="text-gray-500">Status Pendampingan</Label>
                  <Badge className={`${getStatusColor(selectedClient.status)} mt-1 border-0`}>
                    {selectedClient.status}
                  </Badge>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <Label className="text-gray-500">Nomor Telepon</Label>
                    <p className="mt-1">{selectedClient.phone || '-'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <Label className="text-gray-500">Email</Label>
                    <p className="mt-1">{selectedClient.email || '-'}</p>
                  </div>
                </div>
                <div className="col-span-2 flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-500 mt-1" />
                  <div>
                    <Label className="text-gray-500">Alamat Lengkap</Label>
                    <p className="mt-1">{selectedClient.address || '-'}</p>
                  </div>
                </div>
              </div>
              <div className="pt-4 border-t">
                <Label className="text-gray-500">Kasus Terkait</Label>
                <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                  <p className="text-center text-gray-600">
                    {(selectedClient.cases_count || 0) > 0
                      ? `${selectedClient.cases_count} kasus aktif`
                      : 'Tidak ada kasus aktif'}
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Klien</DialogTitle>
            <DialogDescription>
              Lengkapi formulir berikut untuk memperbarui data klien
            </DialogDescription>
          </DialogHeader>
          {editClient && (
            <div className="space-y-4">
              <div>
                <Label>Nama Lengkap / Nama Perusahaan</Label>
                <Input
                  value={editClient.name}
                  onChange={(e) => setEditClient({ ...editClient, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  className="mt-1 border-gray-300"
                />
              </div>
              <div>
                <Label>NIK / NPWP</Label>
                <Input
                  value={editClient.nik}
                  onChange={(e) => setEditClient({ ...editClient, nik: e.target.value })}
                  placeholder="Masukkan NIK atau NPWP"
                  className="mt-1 border-gray-300"
                />
              </div>
              <div>
                <Label>Alamat</Label>
                <Textarea
                  value={editClient.address}
                  onChange={(e) => setEditClient({ ...editClient, address: e.target.value })}
                  placeholder="Masukkan alamat lengkap"
                  className="mt-1 border-gray-300"
                  rows={3}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Nomor Telepon</Label>
                  <Input
                    value={editClient.phone}
                    onChange={(e) => setEditClient({ ...editClient, phone: e.target.value })}
                    placeholder="+62 xxx xxxx xxxx"
                    className="mt-1 border-gray-300"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={editClient.email}
                    onChange={(e) => setEditClient({ ...editClient, email: e.target.value })}
                    placeholder="email@example.com"
                    className="mt-1 border-gray-300"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setEditDialogOpen(false)} className="border-gray-300">
                  Batal
                </Button>
                <Button onClick={handleSaveEdit} className="bg-[#007BFF] hover:bg-[#0066DD]">
                  Simpan Perubahan
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus data klien ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[#E53935] hover:bg-[#C62828]"
            >
              Hapus Klien
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
