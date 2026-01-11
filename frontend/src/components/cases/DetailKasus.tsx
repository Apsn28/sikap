import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
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
  ArrowLeft,
  FileText,
  Clock,
  User,
  MapPin,
  Phone,
  Mail,
  Plus,
  Download,
  Upload,
  Trash2,
  Edit,
  CheckCircle2,
  Circle,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

interface DetailKasusProps {
  caseId: string | null;
  onNavigate: (page: string) => void;
}

interface TimelineStage {
  id: number;
  name: string;
  status: 'completed' | 'active' | 'pending';
  date?: string;
  officer?: string;
  notes?: string;
}

interface Note {
  id: number;
  created_at: string;
  user: { name: string };
  content: string;
}

interface Document {
  id: number;
  title: string;
  file_path: string;
  file_type: string;
  created_at: string;
  uploader?: { name: string };
  category: string;
}

interface Client {
  id: number;
  name: string;
  nik: string;
  phone: string;
  email: string;
  address: string;
}

interface CaseData {
  id: number;
  case_number: string;
  title: string;
  category: string;
  client: Client;
  responsible_person: string;
  description: string;
  status: string;
  progress_status: string;
  progress_percentage: number;
  start_date: string;
  end_date: string;
  notes: Note[];
  documents: Document[];
  priority: string;
}

export default function DetailKasus({ caseId, onNavigate }: DetailKasusProps) {
  const [caseData, setCaseData] = useState<CaseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [newNote, setNewNote] = useState('');
  
  // Edit Form State
  const [editForm, setEditForm] = useState({
    title: '',
    case_number: '',
    category: '',
    responsible_person: '',
    description: '',
    end_date: '',
    status: '',
    priority: '',
  });

  // Upload Form State
  const [uploadForm, setUploadForm] = useState({
    title: '',
    category: '',
    file: null as File | null,
  });

  const fetchCaseData = useCallback(async () => {
    if (!caseId) return;
    try {
      setLoading(true);
      const response = await api.get(`/cases/${caseId}`);
      setCaseData(response.data);
      setEditForm({
        title: response.data.title || '',
        case_number: response.data.case_number,
        category: response.data.category,
        responsible_person: response.data.responsible_person || '',
        description: response.data.description || '',
        end_date: response.data.end_date || '',
        status: response.data.status,
        priority: response.data.priority,
      });
    } catch (error) {
      console.error('Failed to fetch case data:', error);
      toast.error('Gagal memuat detail kasus.');
    } finally {
      setLoading(false);
    }
  }, [caseId]);

  useEffect(() => {
    fetchCaseData();
  }, [fetchCaseData]);

  const handleStatusChange = async (newStatus: string) => {
    if (!caseData) return;
    try {
      await api.put(`/cases/${caseData.id}`, { status: newStatus });
      setCaseData({ ...caseData, status: newStatus });
      toast.success(`Status kasus diperbarui menjadi: ${newStatus}`);
    } catch (error) {
      toast.error('Gagal memperbarui status.');
    }
  };

  const handleSaveEdit = async () => {
    if (!caseData) return;
    try {
      await api.put(`/cases/${caseData.id}`, editForm);
      toast.success('Perubahan data kasus berhasil disimpan.');
      setEditDialogOpen(false);
      fetchCaseData();
    } catch (error) {
      toast.error('Gagal menyimpan perubahan.');
    }
  };

  const handleUploadDocument = async () => {
    if (!caseData || !uploadForm.file || !uploadForm.title) {
      toast.error('Mohon lengkapi data dokumen.');
      return;
    }

    const formData = new FormData();
    formData.append('title', uploadForm.title);
    formData.append('category', uploadForm.category);
    formData.append('file', uploadForm.file);
    formData.append('case_id', caseData.id.toString());

    try {
      await api.post('/documents', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Dokumen berhasil diunggah.');
      setUploadDialogOpen(false);
      setUploadForm({ title: '', category: '', file: null });
      fetchCaseData();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Gagal mengunggah dokumen.');
    }
  };

  const handleDeleteDocument = async (id: number) => {
    try {
      await api.delete(`/documents/${id}`);
      toast.success('Dokumen berhasil dihapus.');
      fetchCaseData();
    } catch (error) {
      toast.error('Gagal menghapus dokumen.');
    }
  };

  const handleAddNote = async () => {
    if (!caseData || !newNote.trim()) {
      toast.error('Catatan tidak boleh kosong.');
      return;
    }

    try {
      await api.post('/notes', {
        case_id: caseData.id,
        content: newNote,
      });
      setNewNote('');
      toast.success('Catatan berhasil ditambahkan.');
      fetchCaseData();
    } catch (error) {
      toast.error('Gagal menambahkan catatan.');
    }
  };

  const handleDeleteNote = async (id: number) => {
    try {
      await api.delete(`/notes/${id}`);
      toast.success('Catatan berhasil dihapus.');
      fetchCaseData();
    } catch (error) {
      toast.error('Gagal menghapus catatan.');
    }
  };

  // Timeline logic
  const stagesOrder = ['Baru Masuk', 'Verifikasi', 'Penyelidikan', 'Pendampingan', 'Persidangan', 'Putusan', 'Selesai'];
  const currentStageIndex = stagesOrder.indexOf(caseData?.progress_status || 'Baru Masuk');

  const getStageStatus = (stageName: string, index: number): 'completed' | 'active' | 'pending' => {
    if (caseData?.status === 'Selesai' && stageName === 'Selesai') return 'completed';
    if (index < currentStageIndex) return 'completed';
    if (index === currentStageIndex) return 'active';
    return 'pending';
  };

  const timelineStages: TimelineStage[] = [
    { id: 1, name: 'Kasus Diterima', status: 'completed' }, // Always completed if it exists
    { id: 2, name: 'Verifikasi', status: getStageStatus('Verifikasi', 1) },
    { id: 3, name: 'Penyelidikan', status: getStageStatus('Penyelidikan', 2) },
    { id: 4, name: 'Pendampingan', status: getStageStatus('Pendampingan', 3) },
    { id: 5, name: 'Persidangan', status: getStageStatus('Persidangan', 4) },
    { id: 6, name: 'Putusan', status: getStageStatus('Putusan', 5) },
    { id: 7, name: 'Selesai', status: getStageStatus('Selesai', 6) },
  ];

  if (loading) {
    return <div className="p-8 text-center">Memuat detail kasus...</div>;
  }

  if (!caseData) {
    return <div className="p-8 text-center">Data kasus tidak ditemukan.</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => onNavigate('daftar-kasus')} className="border-gray-300">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-[#0A2342] mb-1">Detail Kasus</h1>
            <p className="text-gray-500">Nomor: {caseData.case_number}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Select value={caseData.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-40 border-gray-300">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aktif">Aktif</SelectItem>
              <SelectItem value="Selesai">Selesai</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Ditolak">Ditolak</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="border-gray-300" onClick={() => setEditDialogOpen(true)}>
            <Edit className="w-4 h-4 mr-2" />
            Edit Kasus
          </Button>
        </div>
      </div>

      {/* Progress Overview Card */}
      <Card className="shadow-sm border-gray-200 bg-gradient-to-br from-[#007BFF] to-[#0056b3] text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-white/80 mb-1">Progres Penanganan Kasus</p>
              <h2 className="text-white">{caseData.progress_status}</h2>
            </div>
            <div className="text-right">
              <p className="mb-1 text-white/80">Persentase Selesai</p>
              <p className="text-white">{caseData.progress_percentage}%</p>
            </div>
          </div>
          <Progress value={caseData.progress_percentage} className="h-2 bg-white/20" />
          <div className="flex items-center justify-between mt-4 text-sm text-white/80">
            <span>{caseData.status}</span>
            <span className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Prioritas: {caseData.priority}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="ringkasan" className="space-y-6">
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="ringkasan">Ringkasan Kasus</TabsTrigger>
          <TabsTrigger value="timeline">Timeline Progres</TabsTrigger>
          <TabsTrigger value="catatan">Catatan Internal</TabsTrigger>
          <TabsTrigger value="dokumen">Dokumen Kasus</TabsTrigger>
          <TabsTrigger value="klien">Klien Terkait</TabsTrigger>
        </TabsList>

        {/* Ringkasan Kasus */}
        <TabsContent value="ringkasan" className="space-y-6">
          <div className="grid grid-cols-3 gap-6">
            <Card className="col-span-2 shadow-sm border-gray-200">
              <CardHeader className="border-b bg-[#FAFBFC]">
                <CardTitle className="text-[#0A2342]">Informasi Kasus</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <Label className="text-gray-500">Nomor Kasus</Label>
                    <p className="mt-1 font-mono">{caseData.case_number}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Judul Kasus</Label>
                    <p className="mt-1 font-medium">{caseData.title}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Jenis Kasus</Label>
                    <p className="mt-1">{caseData.category}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Status</Label>
                    <Badge className="bg-blue-500 text-white mt-1 border-0">{caseData.status}</Badge>
                  </div>
                  <div>
                    <Label className="text-gray-500">Tanggal Dibuka</Label>
                    <p className="mt-1">{caseData.start_date || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Penanggung Jawab</Label>
                    <p className="mt-1">{caseData.responsible_person || '-'}</p>
                  </div>
                  <div>
                    <Label className="text-gray-500">Tenggat Waktu</Label>
                    <div className="flex items-center gap-2 mt-1">
                      <AlertCircle className="w-4 h-4 text-orange-500" />
                      <p className="text-orange-600">{caseData.end_date || '-'}</p>
                    </div>
                  </div>
                </div>
                <div>
                  <Label className="text-gray-500">Deskripsi Kasus</Label>
                  <p className="mt-2 text-gray-700 leading-relaxed">
                    {caseData.description}
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card className="shadow-sm border-gray-200">
                <CardHeader className="border-b bg-[#FAFBFC]">
                  <CardTitle className="text-[#0A2342]">Statistik</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Dokumen Terlampir</span>
                    <span className="text-[#007BFF]">{caseData.documents?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Catatan Internal</span>
                    <span className="text-[#1DB954]">{caseData.notes?.length || 0}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Progres</span>
                    <span className="text-[#007BFF]">{caseData.progress_percentage}%</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-sm border-gray-200">
                <CardHeader className="border-b bg-[#FAFBFC]">
                  <CardTitle className="text-[#0A2342]">Tim Terkait</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-3">
                   {/* Placeholder for team members if backend provides them */}
                   <p className="text-gray-500 text-sm">Informasi tim belum tersedia.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Timeline Progres */}
        <TabsContent value="timeline">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="border-b bg-[#FAFBFC]">
              <CardTitle className="text-[#0A2342]">Timeline Progres Kasus</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="relative">
                {timelineStages.map((stage, index) => (
                  <div key={stage.id} className="flex gap-6 pb-8 last:pb-0">
                    <div className="flex flex-col items-center">
                      {stage.status === 'completed' ? (
                        <CheckCircle2 className="w-6 h-6 text-green-500" />
                      ) : stage.status === 'active' ? (
                        <Circle className="w-6 h-6 text-[#007BFF] fill-[#007BFF]" />
                      ) : (
                        <Circle className="w-6 h-6 text-gray-300" />
                      )}
                      {index < timelineStages.length - 1 && (
                        <div className={`w-0.5 h-full mt-2 ${stage.status === 'completed' ? 'bg-green-500' : 'bg-gray-300'}`} />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className={`rounded-xl border-2 p-5 ${stage.status === 'active' ? 'border-[#007BFF] bg-blue-50' : 'border-gray-200 bg-white'}`}>
                        <h3 className={stage.status === 'active' ? 'text-[#007BFF]' : ''}>{stage.name}</h3>
                        <Badge className={stage.status === 'completed' ? 'bg-green-500 mt-2' : 'bg-gray-400 mt-2'}>
                          {stage.status === 'completed' ? 'Selesai' : stage.status === 'active' ? 'Sedang Berjalan' : 'Menunggu'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Catatan Internal */}
        <TabsContent value="catatan">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="border-b bg-[#FAFBFC]">
              <CardTitle className="text-[#0A2342]">Catatan Internal</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <Label>Tambah Catatan Baru</Label>
                <Textarea
                  placeholder="Tulis catatan internal di sini..."
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={4}
                  className="border-gray-300"
                />
                <Button onClick={handleAddNote} className="bg-[#007BFF] hover:bg-[#0066DD]">
                  <Plus className="w-4 h-4 mr-2" />
                  Simpan Catatan
                </Button>
              </div>

              <div className="border-t pt-6 space-y-4">
                {caseData.notes?.map((note) => (
                  <div key={note.id} className="border border-gray-200 rounded-xl p-5 bg-white hover:shadow-sm transition-shadow">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm text-gray-500">{new Date(note.created_at).toLocaleString('id-ID')}</p>
                        <p className="text-sm text-[#007BFF] mt-1">Oleh: {note.user?.name || 'Unknown'}</p>
                      </div>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => handleDeleteNote(note.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    <p className="text-gray-700">{note.content}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dokumen Kasus */}
        <TabsContent value="dokumen">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="border-b bg-[#FAFBFC]">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[#0A2342]">Dokumen Kasus ({caseData.documents?.length || 0})</CardTitle>
                <Button className="bg-[#007BFF] hover:bg-[#0066DD]" onClick={() => setUploadDialogOpen(true)}>
                  <Upload className="w-4 h-4 mr-2" />
                  Unggah Dokumen
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {caseData.documents?.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between border border-gray-200 rounded-xl p-5 hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-4">
                      <div className="bg-blue-100 p-3 rounded-lg">
                        <FileText className="w-6 h-6 text-blue-600" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4>{doc.title}</h4>
                          <Badge variant="outline" className="border-gray-300 text-xs">
                            {doc.category || 'Umum'}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">
                          {new Date(doc.created_at).toLocaleDateString()} • {doc.file_type} • Oleh {doc.uploader?.name || 'Unknown'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" className="border-gray-300" asChild>
                         {/* Assuming backend serves files or provides a download link */}
                         <a href={`http://localhost:8000/storage/${doc.file_path}`} target="_blank" rel="noreferrer">
                           <Download className="w-4 h-4 mr-2" />
                           Unduh
                         </a>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500 border-red-300 hover:bg-red-50"
                        onClick={() => handleDeleteDocument(doc.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Klien Terkait */}
        <TabsContent value="klien">
          <Card className="shadow-sm border-gray-200">
            <CardHeader className="border-b bg-[#FAFBFC]">
              <CardTitle className="text-[#0A2342]">Informasi Klien</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              {caseData.client ? (
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-5">
                    <div>
                      <Label className="text-gray-500">Nama Lengkap</Label>
                      <p className="mt-1">{caseData.client.name}</p>
                    </div>
                    <div>
                      <Label className="text-gray-500">NIK / NPWP</Label>
                      <p className="mt-1 font-mono">{caseData.client.nik || '-'}</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <Label className="text-gray-500">Nomor Telepon</Label>
                        <p className="mt-1">{caseData.client.phone || '-'}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Mail className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <Label className="text-gray-500">Email</Label>
                        <p className="mt-1">{caseData.client.email || '-'}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-500 mt-1" />
                      <div>
                        <Label className="text-gray-500">Alamat Lengkap</Label>
                        <p className="mt-1">{caseData.client.address || '-'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <p>Data klien tidak tersedia.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Case Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Kasus</DialogTitle>
            <DialogDescription>
              Ubah detail kasus sesuai kebutuhan.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Judul Kasus</Label>
              <Input
                value={editForm.title}
                onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Nomor Kasus</Label>
              <Input
                value={editForm.case_number}
                onChange={(e) => setEditForm({ ...editForm, case_number: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Jenis Kasus</Label>
              <Input
                value={editForm.category}
                onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Penanggung Jawab</Label>
              <Input
                value={editForm.responsible_person}
                onChange={(e) => setEditForm({ ...editForm, responsible_person: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label>Deskripsi Kasus</Label>
              <Textarea
                value={editForm.description}
                onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
              />
            </div>
             <div className="space-y-2">
              <Label>Tenggat Waktu</Label>
              <Input
                type="date"
                value={editForm.end_date}
                onChange={(e) => setEditForm({ ...editForm, end_date: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" className="bg-[#007BFF] hover:bg-[#0066DD]" onClick={handleSaveEdit}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Document Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Unggah Dokumen</DialogTitle>
            <DialogDescription>
              Unggah dokumen terkait kasus.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Nama Dokumen</Label>
              <Input
                value={uploadForm.title}
                onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
                placeholder="Nama Dokumen"
              />
            </div>
            <div className="space-y-2">
              <Label>Kategori Dokumen</Label>
              <Select onValueChange={(val) => setUploadForm({ ...uploadForm, category: val })}>
                <SelectTrigger className="w-full border-gray-300">
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BAP">BAP</SelectItem>
                  <SelectItem value="Bukti">Bukti</SelectItem>
                  <SelectItem value="Laporan">Laporan</SelectItem>
                  <SelectItem value="Surat">Surat</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>File Dokumen</Label>
              <Input
                type="file"
                onChange={(e) => setUploadForm({ ...uploadForm, file: e.target.files ? e.target.files[0] : null })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" className="bg-[#007BFF] hover:bg-[#0066DD]" onClick={handleUploadDocument}>
              Unggah Dokumen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
