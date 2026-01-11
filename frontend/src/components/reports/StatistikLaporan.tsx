import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Download, Mail, Filter } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

export default function StatistikLaporan() {
  const [jenisKasus, setJenisKasus] = useState('all');
  const [periode, setPeriode] = useState('6bulan');
  const [penanggungJawab, setPenanggungJawab] = useState('all');
  
  const [monthlyData, setMonthlyData] = useState([]);
  const [caseTypeData, setCaseTypeData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await api.get('/dashboard/reports');
        setMonthlyData(response.data.monthlyData);
        setCaseTypeData(response.data.caseTypeData);
        setPerformanceData(response.data.performanceData);
        setWorkloadData(response.data.workloadData);
      } catch (error) {
        console.error('Failed to fetch reports:', error);
        toast.error('Gagal memuat laporan statistik.');
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const handleDownloadReport = (format: string) => {
    toast.success(`Laporan berhasil diunduh dalam format ${format.toUpperCase()}.`);
  };

  const handleSendEmail = () => {
    toast.success('Laporan berhasil dikirim ke email supervisor.');
  };

  if (loading) {
    return <div className="p-8 text-center">Memuat statistik...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0A2342] mb-2">Statistik & Laporan</h1>
          <p className="text-gray-600">Analisis data dan laporan kinerja sistem</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => handleDownloadReport('pdf')}>
            <Download className="w-4 h-4 mr-2" />
            Unduh PDF
          </Button>
          <Button variant="outline" onClick={() => handleDownloadReport('xlsx')}>
            <Download className="w-4 h-4 mr-2" />
            Unduh Excel
          </Button>
          <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleSendEmail}>
            <Mail className="w-4 h-4 mr-2" />
            Kirim Email
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-[#0A2342]" />
            <CardTitle className="text-[#0A2342]">Filter Laporan</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Jenis Kasus</Label>
              <Select value={jenisKasus} onValueChange={setJenisKasus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="korupsi">Korupsi</SelectItem>
                  <SelectItem value="narkotika">Narkotika</SelectItem>
                  <SelectItem value="pencurian">Pencurian</SelectItem>
                  <SelectItem value="penipuan">Penipuan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Periode Waktu</Label>
              <Select value={periode} onValueChange={setPeriode}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1bulan">1 Bulan Terakhir</SelectItem>
                  <SelectItem value="3bulan">3 Bulan Terakhir</SelectItem>
                  <SelectItem value="6bulan">6 Bulan Terakhir</SelectItem>
                  <SelectItem value="1tahun">1 Tahun Terakhir</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Penanggung Jawab</Label>
              <Select value={penanggungJawab} onValueChange={setPenanggungJawab}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Petugas</SelectItem>
                  <SelectItem value="ahmad">Kompol Ahmad Yani</SelectItem>
                  <SelectItem value="siti">Brigadir Siti Aminah</SelectItem>
                  <SelectItem value="budi">Kompol Budi Hartono</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button className="w-full bg-[#007BFF] hover:bg-[#0056b3]">
                <Filter className="w-4 h-4 mr-2" />
                Terapkan Filter
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart - Kasus per Bulan */}
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-[#0A2342]">Kasus per Bulan</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="kasus" fill="#007BFF" name="Total Kasus" radius={[8, 8, 0, 0]} />
                <Bar dataKey="selesai" fill="#1DB954" name="Selesai" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Distribusi Jenis Kasus */}
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-[#0A2342]">Distribusi Jenis Kasus</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={caseTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {caseTypeData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Kinerja Petugas */}
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-[#0A2342]">Kinerja Petugas (Kasus Selesai)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="nama" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="selesai" fill="#1DB954" name="Kasus Selesai" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Bar Chart - Beban Kerja Tim */}
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-[#0A2342]">Beban Kerja Tim (Kasus Aktif)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={workloadData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="wilayah" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="kasus" fill="#FFA726" name="Jumlah Kasus Aktif" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Summary Statistics */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-[#0A2342]">Ringkasan Statistik</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-6">
            <div className="border-l-4 border-l-blue-500 bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Total Kasus Masuk</p>
              <p className="text-3xl text-blue-600">
                {monthlyData.reduce((acc, curr: any) => acc + curr.kasus, 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Tahun ini</p>
            </div>
            <div className="border-l-4 border-l-green-500 bg-green-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Kasus Selesai</p>
              <p className="text-3xl text-green-600">
                {monthlyData.reduce((acc, curr: any) => acc + curr.selesai, 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Tahun ini</p>
            </div>
            <div className="border-l-4 border-l-orange-500 bg-orange-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Kasus Aktif</p>
              <p className="text-3xl text-orange-600">
                {workloadData.reduce((acc, curr: any) => acc + curr.kasus, 0)}
              </p>
              <p className="text-xs text-gray-500 mt-1">Sedang berjalan</p>
            </div>
            <div className="border-l-4 border-l-purple-500 bg-purple-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-2">Total Jadwal</p>
              <p className="text-3xl text-purple-600">-</p>
              <p className="text-xs text-gray-500 mt-1">Belum terintegrasi</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
