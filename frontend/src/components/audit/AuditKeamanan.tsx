import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
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
import { Search, Download, Trash2, Shield, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface AuditLog {
  id: string;
  waktu: string;
  pengguna: string;
  aksi: string;
  data: string;
  hasil: 'Sukses' | 'Gagal' | 'Warning';
  ipAddress: string;
}

export default function AuditKeamanan() {
  const [logs, setLogs] = useState<AuditLog[]>([
    {
      id: '1',
      waktu: '2025-11-12 15:45:30',
      pengguna: 'Kompol Ahmad Yani',
      aksi: 'UPDATE',
      data: 'Status kasus 2024/001',
      hasil: 'Sukses',
      ipAddress: '192.168.1.1',
    },
    {
      id: '2',
      waktu: '2025-11-12 14:20:15',
      pengguna: 'Brigadir Siti Aminah',
      aksi: 'CREATE',
      data: 'Dokumen BAP Tersangka.pdf',
      hasil: 'Sukses',
      ipAddress: '192.168.1.5',
    },
    {
      id: '3',
      waktu: '2025-11-12 13:10:45',
      pengguna: 'Kompol Budi Hartono',
      aksi: 'DELETE',
      data: 'Catatan internal ID 245',
      hasil: 'Sukses',
      ipAddress: '192.168.1.8',
    },
    {
      id: '4',
      waktu: '2025-11-12 12:05:20',
      pengguna: 'Unknown User',
      aksi: 'LOGIN',
      data: 'Percobaan login gagal',
      hasil: 'Gagal',
      ipAddress: '103.45.67.89',
    },
    {
      id: '5',
      waktu: '2025-11-12 11:30:10',
      pengguna: 'Brigadir Dewi Lestari',
      aksi: 'UPDATE',
      data: 'Data klien Budi Santoso',
      hasil: 'Sukses',
      ipAddress: '192.168.1.12',
    },
    {
      id: '6',
      waktu: '2025-11-12 10:15:55',
      pengguna: 'Kompol Ahmad Yani',
      aksi: 'CREATE',
      data: 'Kasus baru 2024/006',
      hasil: 'Sukses',
      ipAddress: '192.168.1.1',
    },
    {
      id: '7',
      waktu: '2025-11-12 09:45:30',
      pengguna: 'System',
      aksi: 'BACKUP',
      data: 'Database backup harian',
      hasil: 'Sukses',
      ipAddress: '127.0.0.1',
    },
    {
      id: '8',
      waktu: '2025-11-12 08:30:00',
      pengguna: 'Kompol Budi Hartono',
      aksi: 'EXPORT',
      data: 'Laporan bulanan PDF',
      hasil: 'Warning',
      ipAddress: '192.168.1.8',
    },
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [resultFilter, setResultFilter] = useState('all');

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.pengguna.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.aksi.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.data.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesUser = userFilter === 'all' || log.pengguna === userFilter;
    const matchesAction = actionFilter === 'all' || log.aksi === actionFilter;
    const matchesResult = resultFilter === 'all' || log.hasil === resultFilter;
    return matchesSearch && matchesUser && matchesAction && matchesResult;
  });

  const getResultBadge = (hasil: string) => {
    switch (hasil) {
      case 'Sukses':
        return (
          <Badge className="bg-green-500 text-white">
            <CheckCircle className="w-3 h-3 mr-1" />
            Sukses
          </Badge>
        );
      case 'Gagal':
        return (
          <Badge className="bg-red-500 text-white">
            <XCircle className="w-3 h-3 mr-1" />
            Gagal
          </Badge>
        );
      case 'Warning':
        return (
          <Badge className="bg-orange-500 text-white">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Warning
          </Badge>
        );
      default:
        return <Badge variant="outline">{hasil}</Badge>;
    }
  };

  const getActionColor = (aksi: string) => {
    switch (aksi) {
      case 'CREATE':
        return 'text-green-600';
      case 'UPDATE':
        return 'text-blue-600';
      case 'DELETE':
        return 'text-red-600';
      case 'LOGIN':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  const handleDeleteOldLogs = () => {
    toast.success('Log lama (>90 hari) berhasil dihapus.');
  };

  const handleExportLogs = () => {
    toast.success('Log audit berhasil diekspor.');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#0A2342] mb-2">Audit & Keamanan Data</h1>
          <p className="text-gray-600">Monitor aktivitas sistem dan log keamanan</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={handleExportLogs}>
            <Download className="w-4 h-4 mr-2" />
            Ekspor Log
          </Button>
          <Button variant="outline" className="text-red-500" onClick={handleDeleteOldLogs}>
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus Log Lama
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-4 gap-6">
        <Card className="shadow-lg border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Total Aktivitas</p>
                <p className="text-3xl text-green-600">{logs.length}</p>
                <p className="text-xs text-gray-500 mt-1">Hari ini</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Aktivitas Sukses</p>
                <p className="text-3xl text-blue-600">
                  {logs.filter((l) => l.hasil === 'Sukses').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {((logs.filter((l) => l.hasil === 'Sukses').length / logs.length) * 100).toFixed(0)}%
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Aktivitas Gagal</p>
                <p className="text-3xl text-red-600">
                  {logs.filter((l) => l.hasil === 'Gagal').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Perlu perhatian</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-2">Warning</p>
                <p className="text-3xl text-orange-600">
                  {logs.filter((l) => l.hasil === 'Warning').length}
                </p>
                <p className="text-xs text-gray-500 mt-1">Perlu review</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <AlertTriangle className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari aktivitas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={userFilter} onValueChange={setUserFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Pengguna" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Pengguna</SelectItem>
                  <SelectItem value="Kompol Ahmad Yani">Kompol Ahmad Yani</SelectItem>
                  <SelectItem value="Brigadir Siti Aminah">Brigadir Siti Aminah</SelectItem>
                  <SelectItem value="Kompol Budi Hartono">Kompol Budi Hartono</SelectItem>
                  <SelectItem value="System">System</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Aksi" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Aksi</SelectItem>
                  <SelectItem value="CREATE">CREATE</SelectItem>
                  <SelectItem value="UPDATE">UPDATE</SelectItem>
                  <SelectItem value="DELETE">DELETE</SelectItem>
                  <SelectItem value="LOGIN">LOGIN</SelectItem>
                  <SelectItem value="EXPORT">EXPORT</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Hasil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Hasil</SelectItem>
                  <SelectItem value="Sukses">Sukses</SelectItem>
                  <SelectItem value="Gagal">Gagal</SelectItem>
                  <SelectItem value="Warning">Warning</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Log Table */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-[#0A2342]">
            Log Aktivitas ({filteredLogs.length} entri)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Waktu</TableHead>
                <TableHead>Pengguna</TableHead>
                <TableHead>Aksi</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>IP Address</TableHead>
                <TableHead>Hasil</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredLogs.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-12 text-gray-500">
                    Tidak ada log yang sesuai dengan filter.
                  </TableCell>
                </TableRow>
              ) : (
                filteredLogs.map((log) => (
                  <TableRow key={log.id} className="hover:bg-gray-50">
                    <TableCell className="text-sm">{log.waktu}</TableCell>
                    <TableCell>{log.pengguna}</TableCell>
                    <TableCell>
                      <span className={getActionColor(log.aksi)}>{log.aksi}</span>
                    </TableCell>
                    <TableCell className="text-sm">{log.data}</TableCell>
                    <TableCell className="text-sm font-mono text-gray-600">
                      {log.ipAddress}
                    </TableCell>
                    <TableCell>{getResultBadge(log.hasil)}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
