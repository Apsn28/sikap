import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Search, Plus, Edit, Trash2, Mail, Phone, HelpCircle, BookOpen, Video } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface Article {
  id: string;
  judul: string;
  kategori: string;
  konten: string;
}

export default function BantuanInfo() {
  const [articles, setArticles] = useState<Article[]>([
    {
      id: '1',
      judul: 'Cara Menambah Kasus Baru',
      kategori: 'Panduan',
      konten: 'Panduan lengkap untuk menambahkan kasus baru ke dalam sistem...',
    },
    {
      id: '2',
      judul: 'Mengelola Tim Internal',
      kategori: 'Panduan',
      konten: 'Langkah-langkah mengelola anggota tim dan hak akses...',
    },
    {
      id: '3',
      judul: 'Menggunakan Fitur Laporan',
      kategori: 'Panduan',
      konten: 'Cara membuat dan mengekspor laporan statistik...',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newArticle, setNewArticle] = useState({
    judul: '',
    kategori: 'Panduan',
    konten: '',
  });

  const faqs = [
    {
      question: 'Bagaimana cara reset password?',
      answer:
        'Anda dapat mereset password melalui menu Pengaturan Sistem > Keamanan > Ganti Kata Sandi. Masukkan password lama, kemudian password baru Anda.',
    },
    {
      question: 'Bagaimana cara menghapus kasus?',
      answer:
        'Untuk menghapus kasus, buka halaman Daftar Kasus, klik ikon hapus pada kasus yang ingin dihapus, kemudian konfirmasi penghapusan. Perhatikan bahwa tindakan ini tidak dapat dibatalkan.',
    },
    {
      question: 'Siapa yang bisa mengakses data kasus?',
      answer:
        'Hanya anggota tim yang memiliki hak akses sesuai dengan role mereka. Admin memiliki akses penuh, sementara Staf hanya dapat mengakses kasus yang ditugaskan kepada mereka.',
    },
    {
      question: 'Bagaimana cara mengunggah dokumen?',
      answer:
        'Buka detail kasus, pilih tab Dokumen Kasus, kemudian klik tombol Unggah Dokumen. Pilih file dari komputer Anda dan klik Simpan. Format yang didukung: PDF, JPG, PNG, DOCX.',
    },
    {
      question: 'Bagaimana cara mengubah status kasus?',
      answer:
        'Di halaman Detail Kasus, Anda akan menemukan dropdown Status di bagian atas. Pilih status baru (Aktif, Selesai, Pending, atau Ditolak) dan sistem akan menyimpan perubahan secara otomatis.',
    },
    {
      question: 'Apa itu role dan hak akses?',
      answer:
        'Role menentukan tingkat akses pengguna di sistem. Admin memiliki akses penuh, Supervisor dapat memonitor dan approve, Verifikator dapat memverifikasi dokumen, dan Staf memiliki akses terbatas sesuai tugas mereka.',
    },
  ];

  const filteredArticles = articles.filter((article) =>
    article.judul.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddArticle = () => {
    if (!newArticle.judul || !newArticle.konten) {
      toast.error('Mohon lengkapi judul dan konten artikel.');
      return;
    }

    const article: Article = {
      id: (articles.length + 1).toString(),
      ...newArticle,
    };

    setArticles([...articles, article]);
    setAddDialogOpen(false);
    setNewArticle({ judul: '', kategori: 'Panduan', konten: '' });
    toast.success('Artikel berhasil ditambahkan.');
  };

  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter((a) => a.id !== id));
    toast.success('Artikel berhasil dihapus.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl text-[#0A2342] mb-2">Bantuan & Pusat Informasi</h1>
        <p className="text-gray-600">Panduan penggunaan sistem dan kontak dukungan</p>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="faq" className="space-y-6">
        <TabsList className="bg-white border shadow-sm">
          <TabsTrigger value="faq">FAQ Umum</TabsTrigger>
          <TabsTrigger value="panduan">Panduan Sistem</TabsTrigger>
          <TabsTrigger value="kontak">Kontak Admin</TabsTrigger>
        </TabsList>

        {/* FAQ */}
        <TabsContent value="faq">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#0A2342]" />
                <CardTitle className="text-[#0A2342]">Pertanyaan yang Sering Diajukan</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-gray-700">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Panduan Sistem */}
        <TabsContent value="panduan">
          <div className="space-y-6">
            <Card className="shadow-lg">
              <CardHeader className="border-b bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#0A2342]" />
                    <CardTitle className="text-[#0A2342]">Panduan Lengkap</CardTitle>
                  </div>
                  <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
                    <DialogTrigger asChild>
                      <Button className="bg-[#007BFF] hover:bg-[#0056b3]">
                        <Plus className="w-4 h-4 mr-2" />
                        Tambah Artikel
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Tambah Artikel Bantuan</DialogTitle>
                        <DialogDescription>
                          Lengkapi informasi artikel di bawah ini
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 mt-4">
                        <div className="space-y-2">
                          <Label htmlFor="judul">Judul Artikel *</Label>
                          <Input
                            id="judul"
                            placeholder="Masukkan judul artikel"
                            value={newArticle.judul}
                            onChange={(e) =>
                              setNewArticle({ ...newArticle, judul: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="konten">Konten *</Label>
                          <Textarea
                            id="konten"
                            placeholder="Masukkan konten artikel"
                            value={newArticle.konten}
                            onChange={(e) =>
                              setNewArticle({ ...newArticle, konten: e.target.value })
                            }
                            rows={6}
                          />
                        </div>
                        <div className="flex justify-end gap-3 pt-4">
                          <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                            Batal
                          </Button>
                          <Button
                            className="bg-[#007BFF] hover:bg-[#0056b3]"
                            onClick={handleAddArticle}
                          >
                            Simpan Artikel
                          </Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Cari panduan..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredArticles.map((article) => (
                    <div
                      key={article.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <BookOpen className="w-5 h-5 text-[#007BFF]" />
                            <h4>{article.judul}</h4>
                          </div>
                          <p className="text-sm text-gray-600">{article.konten}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => toast.info('Fitur edit akan segera tersedia')}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-red-500"
                            onClick={() => handleDeleteArticle(article.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Video Tutorials */}
            <Card className="shadow-lg">
              <CardHeader className="border-b bg-gray-50">
                <div className="flex items-center gap-2">
                  <Video className="w-5 h-5 text-[#0A2342]" />
                  <CardTitle className="text-[#0A2342]">Video Tutorial</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gray-200 aspect-video flex items-center justify-center">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <h4 className="mb-2">Pengenalan Sistem SIKAP</h4>
                      <p className="text-sm text-gray-600">Durasi: 10:30</p>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gray-200 aspect-video flex items-center justify-center">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <h4 className="mb-2">Cara Menambah Kasus</h4>
                      <p className="text-sm text-gray-600">Durasi: 8:45</p>
                    </div>
                  </div>
                  <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <div className="bg-gray-200 aspect-video flex items-center justify-center">
                      <Video className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="p-4">
                      <h4 className="mb-2">Manajemen Dokumen</h4>
                      <p className="text-sm text-gray-600">Durasi: 12:20</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Kontak Admin */}
        <TabsContent value="kontak">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Kontak Admin Internal</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <Card className="border-2 border-[#007BFF]/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-[#007BFF]/10 p-3 rounded-full">
                        <Mail className="w-6 h-6 text-[#007BFF]" />
                      </div>
                      <div>
                        <h3>Email Support</h3>
                        <p className="text-sm text-gray-600">Respon dalam 1x24 jam</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Email:</strong> support.sikap@polri.go.id
                      </p>
                      <p className="text-sm">
                        <strong>Email Teknis:</strong> it.sikap@polri.go.id
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-2 border-[#1DB954]/20">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="bg-[#1DB954]/10 p-3 rounded-full">
                        <Phone className="w-6 h-6 text-[#1DB954]" />
                      </div>
                      <div>
                        <h3>Telepon / Ekstension</h3>
                        <p className="text-sm text-gray-600">Senin-Jumat, 08:00-17:00</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <strong>Hotline:</strong> (021) 1234-5678
                      </p>
                      <p className="text-sm">
                        <strong>Ext. IT:</strong> 101
                      </p>
                      <p className="text-sm">
                        <strong>Ext. Admin:</strong> 102
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="mt-6 border-2 border-[#FFA726]/20">
                <CardContent className="p-6">
                  <h3 className="mb-4">Kirim Pesan ke Admin</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subjek</Label>
                      <Input id="subject" placeholder="Masukkan subjek pesan" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Pesan</Label>
                      <Textarea
                        id="message"
                        placeholder="Tuliskan pesan atau pertanyaan Anda..."
                        rows={6}
                      />
                    </div>
                    <Button
                      className="bg-[#007BFF] hover:bg-[#0056b3]"
                      onClick={() => toast.success('Pesan berhasil dikirim ke admin.')}
                    >
                      <Mail className="w-4 h-4 mr-2" />
                      Kirim Pesan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
