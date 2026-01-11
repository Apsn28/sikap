import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Plus, Search, Filter, Download, Eye, Edit, Trash2, FileText, Clock } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import api from '../../lib/api';

interface DaftarKasusProps {
  onNavigate: (page: string, caseId?: string) => void;
  initialFilter?: string;
}

interface Case {
  id: string;
  clientId?: number;
  nomorKasus: string;
  namaKlien: string;
  jenisKasus: string;
  status: string;
  statusProgres: string;
  progressPercentage: number;
  penanggungJawab: string;
  tanggalUpdate: string;
}

export default function DaftarKasus({ onNavigate, initialFilter }: DaftarKasusProps) {
  const [cases, setCases] = useState<Case[]>([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [progresFilter, setProgresFilter] = useState(initialFilter || 'all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState<string | null>(null);
  const [editingCase, setEditingCase] = useState<Case | null>(null);

  const fetchCases = async () => {
    try {
      const response = await api.get('/cases');
      const data = response.data.map((item: any) => ({
        id: item.id.toString(),
        clientId: item.client_id,
        nomorKasus: item.case_number,
        namaKlien: item.client?.name || 'Unknown',
        jenisKasus: item.category,
        status: item.status,
        statusProgres: item.progress_status || 'Baru Masuk',
        progressPercentage: item.progress_percentage || 0,
        penanggungJawab: item.responsible_person || '-',
        tanggalUpdate: new Date(item.updated_at).toISOString().split('T')[0],
      }));
      setCases(data);
    } catch (error) {
      console.error('Failed to fetch cases:', error);
      toast.error('Gagal mengambil data kasus.');
    }
  };

  useEffect(() => {
    fetchCases();
  }, []);

  const getStatusProgresConfig = (statusProgres: string) => {
    const configs = {
      'Baru Masuk': { color: 'bg-gray-500', textColor: 'text-gray-700', bgLight: 'bg-gray-100' },
      'Verifikasi': { color: 'bg-blue-500', textColor: 'text-blue-700', bgLight: 'bg-blue-100' },
      'Penyelidikan': { color: 'bg-yellow-500', textColor: 'text-yellow-700', bgLight: 'bg-yellow-100' },
      'Pendampingan': { color: 'bg-orange-500', textColor: 'text-orange-700', bgLight: 'bg-orange-100' },
      'Persidangan': { color: 'bg-purple-500', textColor: 'text-purple-700', bgLight: 'bg-purple-100' },
      'Putusan': { color: 'bg-indigo-500', textColor: 'text-indigo-700', bgLight: 'bg-indigo-100' },
      'Selesai': { color: 'bg-green-500', textColor: 'text-green-700', bgLight: 'bg-green-100' },
    };
    return configs[statusProgres as keyof typeof configs] || configs['Baru Masuk'];
  };

  const filteredCases = cases.filter((caseItem) => {
    const matchesSearch =
      caseItem.nomorKasus.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.namaKlien.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caseItem.jenisKasus.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || caseItem.status === statusFilter;
    const matchesProgres = progresFilter === 'all' || caseItem.statusProgres === progresFilter;
    return matchesSearch && matchesStatus && matchesProgres;
  });

  const handleDelete = (id: string) => {
    setCaseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleEdit = (caseItem: Case) => {
    setEditingCase({ ...caseItem });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingCase) {
      try {
        const payload = {
            case_number: editingCase.nomorKasus,
            client_id: editingCase.clientId,
            category: editingCase.jenisKasus,
            status: editingCase.status,
            progress_status: editingCase.statusProgres,
            progress_percentage: editingCase.progressPercentage,
            responsible_person: editingCase.penanggungJawab,
        };

        await api.put(`/cases/${editingCase.id}`, payload);

        setCases(cases.map(c => c.id === editingCase.id ? editingCase : c));
        toast.success('Data kasus berhasil diperbarui.');
        setEditDialogOpen(false);
        setEditingCase(null);
      } catch (error) {
        console.error('Update error:', error);
        toast.error('Gagal memperbarui kasus.');
      }
    }
  };

  const confirmDelete = async () => {
    if (caseToDelete) {
      try {
        await api.delete(`/cases/${caseToDelete}`);
        setCases(cases.filter((c) => c.id !== caseToDelete));
        toast.success('Kasus berhasil dihapus.');
      } catch (error) {
        console.error('Delete error:', error);
        toast.error('Gagal menghapus kasus.');
      }
      setDeleteDialogOpen(false);
      setCaseToDelete(null);
    }
  };

  const handleExport = () => {
    toast.success('Data kasus berhasil diekspor.');
  };

  const statusQuickFilters = [
    { label: 'Semua', value: 'all', count: cases.length },
    { label: 'Baru Masuk', value: 'Baru Masuk', count: cases.filter(c => c.statusProgres === 'Baru Masuk').length },
    { label: 'Verifikasi', value: 'Verifikasi', count: cases.filter(c => c.statusProgres === 'Verifikasi').length },
    { label: 'Penyelidikan', value: 'Penyelidikan', count: cases.filter(c => c.statusProgres === 'Penyelidikan').length },
    { label: 'Pendampingan', value: 'Pendampingan', count: cases.filter(c => c.statusProgres === 'Pendampingan').length },
    { label: 'Persidangan', value: 'Persidangan', count: cases.filter(c => c.statusProgres === 'Persidangan').length },
    { label: 'Selesai', value: 'Selesai', count: cases.filter(c => c.statusProgres === 'Selesai').length },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0A2342] mb-2">Manajemen Kasus</h1>
          <p className="text-gray-500">Kelola dan pantau progres semua kasus yang terdaftar</p>
        </div>
        <Button
          className="bg-[#007BFF] hover:bg-[#0066DD] shadow-md"
          onClick={() => onNavigate('tambah-kasus')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kasus Baru
        </Button>
      </div>

      {/* Quick Filters */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2">
        {statusQuickFilters.map((filter) => (
          <Button
            key={filter.value}
            variant={progresFilter === filter.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setProgresFilter(filter.value)}
            className={progresFilter === filter.value ? 'bg-[#007BFF] hover:bg-[#0066DD]' : ''}
          >
            {filter.label}
            <Badge variant="secondary" className="ml-2">
              {filter.count}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Filters & Search */}
      <Card className="shadow-sm border-gray-200">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari nomor kasus, klien, atau jenis..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300"
                />
              </div>
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="border-gray-300">
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Aktif">Aktif</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Ditolak">Ditolak</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="flex-1 border-gray-300">
                <Filter className="w-4 h-4 mr-2" />
                Filter Lanjutan
              </Button>
              <Button variant="outline" size="sm" onClick={handleExport} className="flex-1 border-gray-300">
                <Download className="w-4 h-4 mr-2" />
                Ekspor Data
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cases Table */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="border-b bg-[#FAFBFC]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#0A2342]">
              Daftar Kasus ({filteredCases.length} kasus)
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>Update terakhir: {new Date().toLocaleDateString('id-ID')}</span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50">
                <TableHead className="w-[140px]">Nomor Kasus</TableHead>
                <TableHead>Nama Klien</TableHead>
                <TableHead>Jenis Kasus</TableHead>
                <TableHead className="w-[200px]">Status Progres</TableHead>
                <TableHead>Penanggung Jawab</TableHead>
                <TableHead>Tanggal Update</TableHead>
                <TableHead className="text-right w-[140px]">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCases.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-16">
                    <div className="flex flex-col items-center gap-3 text-gray-400">
                      <FileText className="w-12 h-12" />
                      <p>Belum ada data kasus yang sesuai dengan filter.</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredCases.map((caseItem) => {
                  const progresConfig = getStatusProgresConfig(caseItem.statusProgres);
                  return (
                    <TableRow key={caseItem.id} className="hover:bg-gray-50 transition-colors">
                      <TableCell>
                        <span className="font-mono text-sm">{caseItem.nomorKasus}</span>
                      </TableCell>
                      <TableCell>{caseItem.namaKlien}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-gray-300">
                          {caseItem.jenisKasus}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between gap-2">
                            <Badge className={`${progresConfig.color} text-white border-0`}>
                              {caseItem.statusProgres}
                            </Badge>
                            <span className="text-xs text-gray-500">{caseItem.progressPercentage}%</span>
                          </div>
                          <Progress value={caseItem.progressPercentage} className="h-1.5" />
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{caseItem.penanggungJawab}</TableCell>
                      <TableCell className="text-sm text-gray-600">{caseItem.tanggalUpdate}</TableCell>
                      <TableCell>
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => onNavigate('detail-kasus', caseItem.id)}
                            className="text-[#007BFF] hover:text-[#0056b3] hover:bg-blue-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(caseItem)}
                            className="text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleDelete(caseItem.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kasus ini? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan dihapus.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-[#E53935] hover:bg-[#C62828]"
            >
              Hapus Kasus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Edit Case Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Kasus</DialogTitle>
            <DialogDescription>
              Perbarui informasi kasus yang diperlukan.
            </DialogDescription>
          </DialogHeader>
          {editingCase && (
            <div className="space-y-4 max-h-[500px] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nomor Kasus</Label>
                  <Input
                    value={editingCase.nomorKasus}
                    onChange={(e) => setEditingCase({ ...editingCase, nomorKasus: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Nama Klien</Label>
                  <Input
                    value={editingCase.namaKlien}
                    onChange={(e) => setEditingCase({ ...editingCase, namaKlien: e.target.value })}
                    className="border-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Jenis Kasus</Label>
                  <Select
                    value={editingCase.jenisKasus}
                    onValueChange={(value) => setEditingCase({ ...editingCase, jenisKasus: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Korupsi">Korupsi</SelectItem>
                      <SelectItem value="Narkotika">Narkotika</SelectItem>
                      <SelectItem value="Penggelapan">Penggelapan</SelectItem>
                      <SelectItem value="Pencurian">Pencurian</SelectItem>
                      <SelectItem value="Penipuan">Penipuan</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status Kasus</Label>
                  <Select
                    value={editingCase.status}
                    onValueChange={(value) => setEditingCase({ ...editingCase, status: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Aktif">Aktif</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Ditolak">Ditolak</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status Progres</Label>
                  <Select
                    value={editingCase.statusProgres}
                    onValueChange={(value) => {
                      const progressMap: { [key: string]: number } = {
                        'Baru Masuk': 10,
                        'Verifikasi': 25,
                        'Penyelidikan': 40,
                        'Pendampingan': 60,
                        'Persidangan': 75,
                        'Putusan': 90,
                        'Selesai': 100,
                      };
                      setEditingCase({ 
                        ...editingCase, 
                        statusProgres: value,
                        progressPercentage: progressMap[value] || 10
                      });
                    }}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Baru Masuk">Baru Masuk</SelectItem>
                      <SelectItem value="Verifikasi">Verifikasi</SelectItem>
                      <SelectItem value="Penyelidikan">Penyelidikan</SelectItem>
                      <SelectItem value="Pendampingan">Pendampingan</SelectItem>
                      <SelectItem value="Persidangan">Persidangan</SelectItem>
                      <SelectItem value="Putusan">Putusan</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Penanggung Jawab</Label>
                  <Select
                    value={editingCase.penanggungJawab}
                    onValueChange={(value) => setEditingCase({ ...editingCase, penanggungJawab: value })}
                  >
                    <SelectTrigger className="border-gray-300">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Kompol Ahmad Yani">Kompol Ahmad Yani</SelectItem>
                      <SelectItem value="Brigadir Siti Aminah">Brigadir Siti Aminah</SelectItem>
                      <SelectItem value="Kompol Budi Hartono">Kompol Budi Hartono</SelectItem>
                      <SelectItem value="Brigadir Dewi Lestari">Brigadir Dewi Lestari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Progres (%)</Label>
                <div className="flex items-center gap-3">
                  <Progress value={editingCase.progressPercentage} className="flex-1" />
                  <span className="text-sm font-medium w-12 text-right">{editingCase.progressPercentage}%</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Batal
            </Button>
            <Button className="bg-[#007BFF] hover:bg-[#0066DD]" onClick={handleSaveEdit}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}