import { useState } from 'react';
import { Filter, Search, Trash2, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { toast } from 'sonner@2.0.3';

export default function AuditKeamanan() {
  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');

  const [auditLogs, setAuditLogs] = useState([
    { id: 1, time: '2025-11-12 14:30:15', user: 'AKBP Budi Santoso', action: 'Login', data: 'Berhasil login dari IP 192.168.1.100', result: 'success' },
    { id: 2, time: '2025-11-12 14:25:10', user: 'Brigadir Ahmad Fauzi', action: 'Tambah Kasus', data: 'Kasus #KS-2025-045', result: 'success' },
    { id: 3, time: '2025-11-12 13:15:30', user: 'KOMPOL Sri Wahyuni', action: 'Update Dokumen', data: 'Dokumen kasus #KS-2025-001', result: 'success' },
    { id: 4, time: '2025-11-12 12:45:00', user: 'Brigadir Dewi Lestari', action: 'Hapus Klien', data: 'Klien ID: 125', result: 'success' },
    { id: 5, time: '2025-11-12 11:30:20', user: 'Unknown User', action: 'Login', data: 'Gagal login dari IP 203.0.113.45', result: 'failed' },
    { id: 6, time: '2025-11-12 10:15:45', user: 'AKBP Budi Santoso', action: 'Export Data', data: 'Laporan bulanan Oktober 2025', result: 'success' },
    { id: 7, time: '2025-11-12 09:30:10', user: 'Brigadir Ahmad Fauzi', action: 'Update Kasus', data: 'Status kasus #KS-2025-012', result: 'success' },
    { id: 8, time: '2025-11-11 17:45:30', user: 'KOMPOL Sri Wahyuni', action: 'Tambah Tim', data: 'Anggota tim baru: IPDA Eko Prasetyo', result: 'success' },
  ]);

  const handleDeleteOldLogs = () => {
    toast.success('Log lama berhasil dihapus', {
      description: 'Log aktivitas lebih dari 90 hari telah dihapus.',
    });
  };

  const getResultBadge = (result: string) => {
    if (result === 'success') {
      return <Badge className="bg-green-100 text-green-700">Berhasil</Badge>;
    }
    return <Badge className="bg-red-100 text-red-700">Gagal</Badge>;
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'Login': return 'text-blue-600';
      case 'Tambah Kasus':
      case 'Tambah Tim': return 'text-green-600';
      case 'Update Kasus':
      case 'Update Dokumen': return 'text-orange-600';
      case 'Hapus Klien': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.data.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = userFilter === 'all' || log.user === userFilter;
    return matchesSearch && matchesUser;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0A2342] mb-2">Audit & Keamanan Data</h1>
          <p className="text-gray-600">Monitor log aktivitas dan keamanan sistem</p>
        </div>
        <Button variant="outline" className="text-red-600" onClick={handleDeleteOldLogs}>
          <Trash2 className="w-4 h-4 mr-2" />
          Hapus Log Lama
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="shadow-lg border-l-4 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Total Aktivitas</p>
                <p className="text-2xl text-[#0A2342]">{auditLogs.length}</p>
              </div>
              <Shield className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-l-4 border-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Berhasil</p>
                <p className="text-2xl text-[#0A2342]">{auditLogs.filter(l => l.result === 'success').length}</p>
              </div>
              <Shield className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-l-4 border-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Gagal</p>
                <p className="text-2xl text-[#0A2342]">{auditLogs.filter(l => l.result === 'failed').length}</p>
              </div>
              <Shield className="w-12 h-12 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-l-4 border-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Hari Ini</p>
                <p className="text-2xl text-[#0A2342]">8</p>
              </div>
              <Shield className="w-12 h-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Cari log aktivitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={userFilter} onValueChange={setUserFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter Pengguna" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Pengguna</SelectItem>
                <SelectItem value="AKBP Budi Santoso">AKBP Budi Santoso</SelectItem>
                <SelectItem value="Brigadir Ahmad Fauzi">Brigadir Ahmad Fauzi</SelectItem>
                <SelectItem value="KOMPOL Sri Wahyuni">KOMPOL Sri Wahyuni</SelectItem>
                <SelectItem value="Brigadir Dewi Lestari">Brigadir Dewi Lestari</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Filter Tanggal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Hari Ini</SelectItem>
                <SelectItem value="week">Minggu Ini</SelectItem>
                <SelectItem value="month">Bulan Ini</SelectItem>
                <SelectItem value="all">Semua Waktu</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Audit Table */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-[#0A2342]">Log Aktivitas ({filteredLogs.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Waktu</TableHead>
                  <TableHead>Pengguna</TableHead>
                  <TableHead>Aksi</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Hasil</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm">{log.time}</TableCell>
                    <TableCell>{log.user}</TableCell>
                    <TableCell>
                      <span className={getActionColor(log.action)}>{log.action}</span>
                    </TableCell>
                    <TableCell className="max-w-md truncate">{log.data}</TableCell>
                    <TableCell>{getResultBadge(log.result)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
