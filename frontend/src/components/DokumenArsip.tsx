import { useState } from 'react';
import { FileText, Download, Trash2, Plus, Search, Eye, Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

export default function DokumenArsip() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Surat Kuasa KS-2025-001.pdf', category: 'Dokumen Kasus', uploader: 'Ahmad Fauzi', date: '2025-11-10', size: '2.4 MB' },
    { id: 2, name: 'Bukti Transfer.xlsx', category: 'Dokumen Kasus', uploader: 'Budi Santoso', date: '2025-11-09', size: '1.2 MB' },
    { id: 3, name: 'KTP Klien - Ahmad Hidayat.jpg', category: 'Dokumen Klien', uploader: 'Sri Wahyuni', date: '2025-11-08', size: '856 KB' },
    { id: 4, name: 'Surat Resmi Template.docx', category: 'Template Surat', uploader: 'Admin', date: '2025-10-15', size: '128 KB' },
    { id: 5, name: 'Laporan Investigasi.pdf', category: 'Dokumen Kasus', uploader: 'Dewi Lestari', date: '2025-11-07', size: '3.8 MB' },
  ]);

  const handleDelete = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success('Dokumen dihapus');
  };

  const filteredDocs = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0A2342] mb-2">Dokumen & Arsip</h1>
          <p className="text-gray-600">Kelola semua dokumen dan arsip kasus</p>
        </div>
        <Button className="bg-[#007BFF] hover:bg-[#0056b3]">
          <Plus className="w-4 h-4 mr-2" />
          Unggah Dokumen
        </Button>
      </div>

      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Cari dokumen..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="semua" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="semua">Semua Dokumen</TabsTrigger>
          <TabsTrigger value="kasus">Dokumen Kasus</TabsTrigger>
          <TabsTrigger value="klien">Dokumen Klien</TabsTrigger>
          <TabsTrigger value="template">Template Surat</TabsTrigger>
        </TabsList>

        <TabsContent value="semua">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Semua Dokumen ({filteredDocs.length})</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredDocs.map((doc) => (
                  <div key={doc.id} className="p-6 hover:bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-[#007BFF]" />
                      </div>
                      <div>
                        <p>{doc.name}</p>
                        <p className="text-sm text-gray-500">
                          {doc.size} • {doc.category} • Oleh {doc.uploader} • {doc.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDelete(doc.id)}
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

        <TabsContent value="kasus">
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <Upload className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Filter: Dokumen Kasus</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="klien">
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <Upload className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Filter: Dokumen Klien</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="template">
          <Card className="shadow-lg">
            <CardContent className="p-12 text-center">
              <Upload className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Filter: Template Surat</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
