import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { ArrowLeft, Save, FileText, Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

interface TambahKasusProps {
  onNavigate: (page: string) => void;
}

interface Client {
  id: number;
  name: string;
  phone: string;
  email: string;
  address: string;
  nik_npwp?: string;
}

export default function TambahKasus({ onNavigate }: TambahKasusProps) {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    // Data Klien
    clientId: '',
    namaKlien: '',
    nikNpwp: '',
    telepon: '',
    email: '',
    alamat: '',
    
    // Detail Kasus
    jenisKasus: '',
    deskripsi: '',
    lokasiKejadian: '',
    tanggalKejadian: '',
    
    // Penugasan
    penanggungJawab: '',
    timPendukung: '',
    prioritas: '',
    tenggat: '',
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await api.get('/clients');
        setClients(response.data);
      } catch (error) {
        console.error("Failed to fetch clients", error);
        toast.error("Gagal memuat data klien");
      }
    };
    fetchClients();
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleClientChange = (clientId: string) => {
    const selectedClient = clients.find(c => c.id.toString() === clientId);
    if (selectedClient) {
      setFormData({
        ...formData,
        clientId: clientId,
        namaKlien: selectedClient.name,
        nikNpwp: selectedClient.nik_npwp || '',
        telepon: selectedClient.phone,
        email: selectedClient.email,
        alamat: selectedClient.address,
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 10 * 1024 * 1024) {
        toast.error('Ukuran file maksimal 10MB');
        return;
      }
      setSelectedFile(file);
    }
  };

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.clientId) {
        toast.error('Mohon pilih klien terlebih dahulu.');
        return;
      }
    } else if (step === 2) {
      if (!formData.jenisKasus || !formData.deskripsi) {
        toast.error('Mohon lengkapi detail kasus terlebih dahulu.');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleSaveDraft = () => {
    toast.success('Draft kasus berhasil disimpan (Simulasi).');
    setTimeout(() => onNavigate('daftar-kasus'), 1000);
  };

  const handleSubmit = async () => {
    if (!formData.penanggungJawab || !formData.prioritas) {
      toast.error('Mohon lengkapi penugasan kasus terlebih dahulu.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Create Case using existing Client ID
      const caseResponse = await api.post('/cases', {
        client_id: formData.clientId,
        title: `Kasus ${formData.jenisKasus} - ${formData.namaKlien}`,
        case_number: `${new Date().getFullYear()}/${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}/PID`, // Auto-generate
        category: formData.jenisKasus,
        description: formData.deskripsi,
        status: 'Aktif',
        progress_status: 'Baru Masuk',
        priority: formData.prioritas,
        responsible_person: formData.penanggungJawab,
        start_date: formData.tanggalKejadian || new Date().toISOString().split('T')[0],
        end_date: formData.tenggat,
      });

      const newCaseId = caseResponse.data.id;

      // 2. Upload Document if exists
      if (selectedFile) {
        const docFormData = new FormData();
        docFormData.append('file', selectedFile);
        docFormData.append('title', `Dokumen Awal - ${selectedFile.name}`);
        docFormData.append('case_id', newCaseId);
        docFormData.append('category', 'Dokumen Awal');

        await api.post('/documents', docFormData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
      }

      toast.success('Kasus berhasil dibuat dan dikirim untuk verifikasi.');
      setTimeout(() => onNavigate('daftar-kasus'), 1000);
    } catch (error: any) {
      console.error(error);
      toast.error('Gagal membuat kasus. ' + (error.response?.data?.message || ''));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => onNavigate('daftar-kasus')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl text-[#0A2342] mb-1">Tambah Kasus Baru</h1>
            <p className="text-gray-600">Lengkapi formulir untuk menambah kasus baru</p>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-3 ${step >= 1 ? 'text-[#007BFF]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-[#007BFF] text-white' : 'bg-gray-200'}`}>
                1
              </div>
              <div>
                <p className="text-sm">Langkah 1</p>
                <p>Data Klien</p>
              </div>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-[#007BFF]' : 'bg-gray-200'}`} />
            <div className={`flex items-center gap-3 ${step >= 2 ? 'text-[#007BFF]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-[#007BFF] text-white' : 'bg-gray-200'}`}>
                2
              </div>
              <div>
                <p className="text-sm">Langkah 2</p>
                <p>Detail Kasus</p>
              </div>
            </div>
            <div className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-[#007BFF]' : 'bg-gray-200'}`} />
            <div className={`flex items-center gap-3 ${step >= 3 ? 'text-[#007BFF]' : 'text-gray-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-[#007BFF] text-white' : 'bg-gray-200'}`}>
                3
              </div>
              <div>
                <p className="text-sm">Langkah 3</p>
                <p>Penugasan & Dokumen</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Form Content */}
      {step === 1 && (
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-[#0A2342]">Pilih Data Klien</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Pilih Klien dari Database *</Label>
                <Select value={formData.clientId} onValueChange={handleClientChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Cari dan pilih klien..." />
                  </SelectTrigger>
                  <SelectContent>
                    {clients.length === 0 ? (
                       <SelectItem value="empty" disabled>Tidak ada data klien</SelectItem>
                    ) : (
                      clients.map((client) => (
                        <SelectItem key={client.id} value={client.id.toString()}>
                          {client.name} - {client.phone}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
                <p className="text-sm text-gray-500">
                  Klien belum terdaftar? <Button variant="link" className="p-0 h-auto" onClick={() => onNavigate('data-klien')}>Tambah Klien Baru</Button>
                </p>
              </div>

              {formData.clientId && (
                <div className="bg-gray-50 p-4 rounded-lg border space-y-4">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="namaKlien">Nama Lengkap</Label>
                      <Input id="namaKlien" value={formData.namaKlien} disabled className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="nikNpwp">NIK / NPWP</Label>
                      <Input id="nikNpwp" value={formData.nikNpwp} disabled className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="telepon">Nomor Telepon</Label>
                      <Input id="telepon" value={formData.telepon} disabled className="bg-white" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" value={formData.email} disabled className="bg-white" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alamat">Alamat Lengkap</Label>
                    <Textarea id="alamat" value={formData.alamat} disabled rows={3} className="bg-white" />
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-[#0A2342]">Detail Kasus</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="jenisKasus">Jenis Kasus *</Label>
                  <Select value={formData.jenisKasus} onValueChange={(value) => handleInputChange('jenisKasus', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kasus" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Korupsi">Korupsi</SelectItem>
                      <SelectItem value="Narkotika">Narkotika</SelectItem>
                      <SelectItem value="Penggelapan">Penggelapan</SelectItem>
                      <SelectItem value="Pencurian">Pencurian</SelectItem>
                      <SelectItem value="Penipuan">Penipuan</SelectItem>
                      <SelectItem value="Kekerasan">Kekerasan</SelectItem>
                      <SelectItem value="Lainnya">Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tanggalKejadian">Tanggal Kejadian</Label>
                  <Input
                    id="tanggalKejadian"
                    type="date"
                    value={formData.tanggalKejadian}
                    onChange={(e) => handleInputChange('tanggalKejadian', e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="lokasiKejadian">Lokasi Kejadian</Label>
                <Input
                  id="lokasiKejadian"
                  placeholder="Masukkan lokasi kejadian"
                  value={formData.lokasiKejadian}
                  onChange={(e) => handleInputChange('lokasiKejadian', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi Kasus *</Label>
                <Textarea
                  id="deskripsi"
                  placeholder="Jelaskan kronologi dan detail kasus secara lengkap..."
                  value={formData.deskripsi}
                  onChange={(e) => handleInputChange('deskripsi', e.target.value)}
                  rows={6}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-[#0A2342]">Penugasan & Dokumen Pendukung</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="penanggungJawab">Penanggung Jawab Kasus *</Label>
                  <Select value={formData.penanggungJawab} onValueChange={(value) => handleInputChange('penanggungJawab', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih penanggung jawab" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.length === 0 ? (
                        <SelectItem value="empty" disabled>Tidak ada anggota tim</SelectItem>
                      ) : (
                        teamMembers.map((member) => (
                          <SelectItem key={member.id} value={member.name}>
                            {member.name} - {member.jabatan}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timPendukung">Tim Pendukung</Label>
                  <Select value={formData.timPendukung} onValueChange={(value) => handleInputChange('timPendukung', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih tim pendukung" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tim Forensik">Tim Forensik</SelectItem>
                      <SelectItem value="Tim IT">Tim IT</SelectItem>
                      <SelectItem value="Tim Investigasi">Tim Investigasi</SelectItem>
                      <SelectItem value="Tim Hukum">Tim Hukum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioritas">Prioritas Kasus *</Label>
                  <Select value={formData.prioritas} onValueChange={(value) => handleInputChange('prioritas', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih prioritas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Tinggi">Tinggi</SelectItem>
                      <SelectItem value="Sedang">Sedang</SelectItem>
                      <SelectItem value="Rendah">Rendah</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tenggat">Tenggat Waktu</Label>
                  <Input
                    id="tenggat"
                    type="date"
                    value={formData.tenggat}
                    onChange={(e) => handleInputChange('tenggat', e.target.value)}
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <Label className="mb-3 block">Dokumen Pendukung</Label>
                <div 
                  className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#007BFF] transition-colors cursor-pointer relative"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    onChange={handleFileChange}
                    accept=".pdf,.jpg,.jpeg,.png,.docx,.doc"
                  />
                  
                  {selectedFile ? (
                    <div className="flex flex-col items-center">
                      <FileText className="w-12 h-12 text-[#007BFF] mb-3" />
                      <p className="font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-sm text-gray-500 mb-2">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={removeFile}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Hapus File
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="mb-2">Klik untuk mengunggah dokumen</p>
                      <p className="text-sm text-gray-500">atau seret dan lepas file di sini</p>
                      <p className="text-xs text-gray-400 mt-2">Format: PDF, JPG, PNG, DOCX (Maks. 10MB)</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              {step > 1 && (
                <Button variant="outline" onClick={handlePrevious} disabled={isLoading}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Sebelumnya
                </Button>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
                <Save className="w-4 h-4 mr-2" />
                Simpan Draft
              </Button>
              {step < 3 ? (
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleNext}>
                  Selanjutnya
                  <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
                </Button>
              ) : (
                <Button className="bg-[#1DB954] hover:bg-[#17a348]" onClick={handleSubmit} disabled={isLoading}>
                  <FileText className="w-4 h-4 mr-2" />
                  {isLoading ? 'Mengirim...' : 'Kirim untuk Verifikasi'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}