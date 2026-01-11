import { useState } from 'react';
import { Download, Plus, Edit2, Trash2, BarChart, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { BarChart as RechartsBar, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { toast } from 'sonner@2.0.3';

export default function StatistikLaporan() {
  const [jenisFilter, setJenisFilter] = useState('all');
  const [periodeFilter, setPeriodeFilter] = useState('monthly');

  const monthlyData = [
    { bulan: 'Jan', kasus: 42 },
    { bulan: 'Feb', kasus: 38 },
    { bulan: 'Mar', kasus: 45 },
    { bulan: 'Apr', kasus: 51 },
    { bulan: 'Mei', kasus: 48 },
    { bulan: 'Jun', kasus: 55 },
    { bulan: 'Jul', kasus: 52 },
    { bulan: 'Agu', kasus: 48 },
    { bulan: 'Sep', kasus: 61 },
    { bulan: 'Okt', kasus: 55 },
    { bulan: 'Nov', kasus: 24 },
  ];

  const jenisKasusData = [
    { name: 'Pidana Korupsi', value: 145, color: '#E53935' },
    { name: 'Pidana Umum', value: 98, color: '#007BFF' },
    { name: 'Pidana Narkotika', value: 76, color: '#FFA726' },
    { name: 'Perdata', value: 52, color: '#1DB954' },
  ];

  const kinerjaData = [
    { bulan: 'Jun', selesai: 38, target: 45 },
    { bulan: 'Jul', selesai: 42, target: 45 },
    { bulan: 'Agu', selesai: 35, target: 45 },
    { bulan: 'Sep', selesai: 48, target: 45 },
    { bulan: 'Okt', selesai: 52, target: 45 },
    { bulan: 'Nov', selesai: 28, target: 45 },
  ];

  const handleExportReport = () => {
    toast.success('Laporan berhasil diekspor', {
      description: 'File PDF telah diunduh ke perangkat Anda.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0A2342] mb-2">Statistik & Laporan</h1>
          <p className="text-gray-600">Analisis data kasus dan kinerja tim</p>
        </div>
        <div className="flex gap-2">
          <Button className="bg-[#1DB954] hover:bg-[#17a043]">
            <Plus className="w-4 h-4 mr-2" />
            Buat Laporan Baru
          </Button>
          <Button variant="outline" onClick={handleExportReport}>
            <Download className="w-4 h-4 mr-2" />
            Ekspor Laporan
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Select value={jenisFilter} onValueChange={setJenisFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Jenis Kasus" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Jenis</SelectItem>
                <SelectItem value="korupsi">Pidana Korupsi</SelectItem>
                <SelectItem value="umum">Pidana Umum</SelectItem>
                <SelectItem value="narkotika">Pidana Narkotika</SelectItem>
              </SelectContent>
            </Select>
            <Select value={periodeFilter} onValueChange={setPeriodeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Periode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
                <SelectItem value="yearly">Tahunan</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Penanggung Jawab" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Petugas</SelectItem>
                <SelectItem value="budi">Budi Santoso</SelectItem>
                <SelectItem value="ahmad">Ahmad Fauzi</SelectItem>
                <SelectItem value="sri">Sri Wahyuni</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Wilayah" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Wilayah</SelectItem>
                <SelectItem value="jkt">DKI Jakarta</SelectItem>
                <SelectItem value="bdg">Jawa Barat</SelectItem>
                <SelectItem value="sby">Jawa Timur</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#0A2342]">Kasus per Bulan</CardTitle>
              <Button size="sm" variant="outline">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <RechartsBar data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="kasus" fill="#007BFF" radius={[8, 8, 0, 0]} />
              </RechartsBar>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#0A2342]">Distribusi Jenis Kasus</CardTitle>
              <Button size="sm" variant="outline">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={jenisKasusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {jenisKasusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="shadow-lg lg:col-span-2">
          <CardHeader className="border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#0A2342]">Kinerja Petugas (Target vs Realisasi)</CardTitle>
              <Button size="sm" variant="outline">
                <Download className="w-3 h-3 mr-1" />
                Export
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={kinerjaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="bulan" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="target" stroke="#FFA726" strokeWidth={3} dot={{ fill: '#FFA726', r: 5 }} name="Target" />
                <Line type="monotone" dataKey="selesai" stroke="#1DB954" strokeWidth={3} dot={{ fill: '#1DB954', r: 5 }} name="Selesai" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Saved Reports */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-[#0A2342]">Laporan Tersimpan</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {[
              { title: 'Laporan Kasus Bulanan - Oktober 2025', date: '2025-11-01', author: 'Budi Santoso' },
              { title: 'Analisis Kinerja Tim Q3 2025', date: '2025-10-15', author: 'Sri Wahyuni' },
              { title: 'Statistik Kasus Korupsi Tahun 2025', date: '2025-10-01', author: 'Ahmad Fauzi' },
            ].map((report, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex items-center gap-3">
                  <BarChart className="w-8 h-8 text-[#007BFF]" />
                  <div>
                    <p>{report.title}</p>
                    <p className="text-sm text-gray-600">Dibuat oleh {report.author} • {report.date}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Download className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8">
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
