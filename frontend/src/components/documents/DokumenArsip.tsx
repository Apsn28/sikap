import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
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
import { Plus, Search, Upload, Download, Eye, Edit, Trash2, FileText, Image, File } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

interface Document {
  id: number;
  nama: string;
  kategori: string;
  ukuran: string;
  tanggal: string;
  uploader: string;
  tipe: 'pdf' | 'image' | 'doc';
  file_path?: string;
}

export default function DokumenArsip() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [docToDelete, setDocToDelete] = useState<number | null>(null);
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const [newDoc, setNewDoc] = useState({
    title: '',
    category: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchDocuments = async () => {
    try {
      const response = await api.get('/documents');
      const formattedDocs = response.data.map((doc: any) => ({
        id: doc.id,
        nama: doc.title,
        kategori: doc.category || 'Lainnya',
        ukuran: doc.file_size || 'Unknown',
        tanggal: new Date(doc.created_at).toLocaleDateString('id-ID'),
        uploader: doc.uploader?.name || 'Unknown',
        tipe: mapFileType(doc.file_type),
        file_path: doc.file_path,
      }));
      setDocuments(formattedDocs);
    } catch (error) {
      console.error('Error fetching documents:', error);
      toast.error('Gagal memuat dokumen.');
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const mapFileType = (type: string): 'pdf' | 'image' | 'doc' => {
    if (['pdf'].includes(type)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(type)) return 'image';
    if (['doc', 'docx'].includes(type)) return 'doc';
    return 'doc';
  };

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch = doc.nama.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || doc.kategori === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getDocumentsByCategory = (category: string) => {
    return documents.filter((doc) => doc.kategori === category);
  };

  const getIcon = (tipe: string) => {
    switch (tipe) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'image':
        return <Image className="w-6 h-6 text-blue-500" />;
      case 'doc':
        return <File className="w-6 h-6 text-blue-700" />;
      default:
        return <File className="w-6 h-6 text-gray-500" />;
    }
  };

  const handleDelete = (id: number) => {
    setDocToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (docToDelete) {
      try {
        await api.delete(`/documents/${docToDelete}`);
        setDocuments(documents.filter((d) => d.id !== docToDelete));
        toast.success('Dokumen berhasil dihapus.');
      } catch (error) {
        console.error('Error deleting document:', error);
        toast.error('Gagal menghapus dokumen.');
      } finally {
        setDeleteDialogOpen(false);
        setDocToDelete(null);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (!newDoc.title || !newDoc.category || !selectedFile) {
      toast.error('Mohon lengkapi data dan pilih file.');
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('title', newDoc.title);
    formData.append('category', newDoc.category);
    formData.append('file', selectedFile);

    try {
      const response = await api.post('/documents', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      const doc = response.data;
      const formattedDoc: Document = {
        id: doc.id,
        nama: doc.title,
        kategori: doc.category || 'Lainnya',
        ukuran: doc.file_size || 'Unknown',
        tanggal: new Date(doc.created_at).toLocaleDateString('id-ID'),
        uploader: 'Saya', // Assuming current user uploaded it
        tipe: mapFileType(doc.file_type),
        file_path: doc.file_path,
      };

      setDocuments([formattedDoc, ...documents]);
      setUploadDialogOpen(false);
      setNewDoc({ title: '', category: '' });
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
      toast.success('Dokumen berhasil diunggah.');
    } catch (error) {
      console.error('Error uploading document:', error);
      toast.error('Gagal mengunggah dokumen.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownload = async (id: number, nama: string) => {
    try {
      toast.info(`Mengunduh ${nama}...`);
      const response = await api.get(`/documents/${id}/download`, {
        responseType: 'blob',
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', nama);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error('Gagal mengunduh dokumen.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#0A2342] mb-2">Dokumen & Arsip</h1>
          <p className="text-gray-600">Kelola dokumen kasus, klien, dan template surat</p>
        </div>
        <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#007BFF] hover:bg-[#0056b3]">
              <Upload className="w-4 h-4 mr-2" />
              Unggah Dokumen
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Unggah Dokumen Baru</DialogTitle>
              <DialogDescription>
                Pilih file dan lengkapi informasi dokumen.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Nama Dokumen</Label>
                <Input
                  id="title"
                  value={newDoc.title}
                  onChange={(e) => setNewDoc({ ...newDoc, title: e.target.value })}
                  placeholder="Masukkan nama dokumen"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori</Label>
                <Select
                  value={newDoc.category}
                  onValueChange={(value) => setNewDoc({ ...newDoc, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dokumen Kasus">Dokumen Kasus</SelectItem>
                    <SelectItem value="Dokumen Klien">Dokumen Klien</SelectItem>
                    <SelectItem value="Template Surat">Template Surat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input
                  id="file"
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setUploadDialogOpen(false)}>
                  Batal
                </Button>
                <Button 
                  className="bg-[#007BFF] hover:bg-[#0056b3]" 
                  onClick={handleUpload}
                  disabled={isUploading}
                >
                  {isUploading ? 'Mengunggah...' : 'Unggah'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="all">Semua Dokumen</TabsTrigger>
          <TabsTrigger value="kasus">Dokumen Kasus</TabsTrigger>
          <TabsTrigger value="klien">Dokumen Klien</TabsTrigger>
          <TabsTrigger value="template">Template Surat</TabsTrigger>
        </TabsList>

        {/* All Documents */}
        <TabsContent value="all" className="space-y-6">
          <Card className="shadow-lg">
            <CardContent className="p-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Cari dokumen..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div>
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger>
                      <SelectValue placeholder="Filter Kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kategori</SelectItem>
                      <SelectItem value="Dokumen Kasus">Dokumen Kasus</SelectItem>
                      <SelectItem value="Dokumen Klien">Dokumen Klien</SelectItem>
                      <SelectItem value="Template Surat">Template Surat</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Total: {filteredDocuments.length} Dokumen</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {filteredDocuments.length === 0 ? (
                  <p className="text-center text-gray-500 py-8">Tidak ada dokumen.</p>
                ) : (
                  filteredDocuments.map((doc) => (
                    <div key={doc.id} className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        <div className="bg-gray-100 p-3 rounded-lg">
                          {getIcon(doc.tipe)}
                        </div>
                        <div>
                          <h4 className="mb-1">{doc.nama}</h4>
                          <div className="flex items-center gap-3 text-sm text-gray-600">
                            <Badge variant="outline">{doc.kategori}</Badge>
                            <span>{doc.ukuran}</span>
                            <span>📅 {doc.tanggal}</span>
                            <span>👤 {doc.uploader}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button size="sm" variant="outline" onClick={() => handleDownload(doc.id, doc.nama)}>
                          <Download className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-red-500"
                          onClick={() => handleDelete(doc.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dokumen Kasus */}
        <TabsContent value="kasus">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">
                Dokumen Kasus ({getDocumentsByCategory('Dokumen Kasus').length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {getDocumentsByCategory('Dokumen Kasus').map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {getIcon(doc.tipe)}
                      </div>
                      <div>
                        <h4 className="mb-1">{doc.nama}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{doc.ukuran}</span>
                          <span>📅 {doc.tanggal}</span>
                          <span>👤 {doc.uploader}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleDownload(doc.id, doc.nama)}>
                        <Download className="w-4 h-4 mr-2" />
                        Unduh
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Dokumen Klien */}
        <TabsContent value="klien">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">
                Dokumen Klien ({getDocumentsByCategory('Dokumen Klien').length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {getDocumentsByCategory('Dokumen Klien').map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {getIcon(doc.tipe)}
                      </div>
                      <div>
                        <h4 className="mb-1">{doc.nama}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{doc.ukuran}</span>
                          <span>📅 {doc.tanggal}</span>
                          <span>👤 {doc.uploader}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleDownload(doc.id, doc.nama)}>
                        <Download className="w-4 h-4 mr-2" />
                        Unduh
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Template Surat */}
        <TabsContent value="template">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">
                Template Surat Resmi ({getDocumentsByCategory('Template Surat').length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-3">
                {getDocumentsByCategory('Template Surat').map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between border rounded-lg p-4 hover:bg-gray-50">
                    <div className="flex items-center gap-4">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        {getIcon(doc.tipe)}
                      </div>
                      <div>
                        <h4 className="mb-1">{doc.nama}</h4>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <span>{doc.ukuran}</span>
                          <span>📅 {doc.tanggal}</span>
                          <span>👤 {doc.uploader}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => handleDownload(doc.id, doc.nama)}>
                        <Download className="w-4 h-4 mr-2" />
                        Unduh
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus dokumen ini? Tindakan ini tidak dapat dibatalkan.
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
