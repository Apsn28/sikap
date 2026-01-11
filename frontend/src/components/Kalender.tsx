import { useState } from 'react';
import { Plus, Edit2, Trash2, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';

export default function Kalender() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [events, setEvents] = useState([
    { id: 1, title: 'Rapat Tim Hukum', type: 'Rapat Internal', date: '2025-11-12', time: '10:00', location: 'Ruang Rapat A', color: 'bg-blue-500' },
    { id: 2, title: 'Sidang Kasus #KS-2025-012', type: 'Sidang', date: '2025-11-13', time: '14:00', location: 'Pengadilan Negeri Jakarta', color: 'bg-purple-500' },
    { id: 3, title: 'Tenggat Kasus #KS-2025-001', type: 'Tenggat Kasus', date: '2025-11-15', time: '23:59', location: '-', color: 'bg-red-500' },
    { id: 4, title: 'Review Dokumentasi', type: 'Rapat Internal', date: '2025-11-15', time: '09:00', location: 'Ruang Rapat B', color: 'bg-blue-500' },
    { id: 5, title: 'Pendampingan Klien', type: 'Pendampingan', date: '2025-11-16', time: '11:00', location: 'Kantor Klien', color: 'bg-green-500' },
  ]);

  const handleDelete = (id: number) => {
    setEvents(events.filter(event => event.id !== id));
    toast.success('Jadwal dihapus');
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'Rapat Internal': return 'bg-blue-100 text-blue-700';
      case 'Sidang': return 'bg-purple-100 text-purple-700';
      case 'Pendampingan': return 'bg-green-100 text-green-700';
      case 'Tenggat Kasus': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0A2342] mb-2">Kalender & Jadwal</h1>
          <p className="text-gray-600">Kelola jadwal rapat, sidang, dan kegiatan lainnya</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#007BFF] hover:bg-[#0056b3]">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Jadwal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Jadwal Baru</DialogTitle>
              <DialogDescription>Buat jadwal kegiatan baru</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Judul Kegiatan</Label>
                <Input placeholder="Masukkan judul kegiatan" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jenis Kegiatan</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rapat Internal">Rapat Internal</SelectItem>
                      <SelectItem value="Sidang">Sidang / Pendampingan</SelectItem>
                      <SelectItem value="Tenggat Kasus">Tenggat Kasus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Lokasi</Label>
                  <Input placeholder="Lokasi kegiatan" />
                </div>
                <div className="space-y-2">
                  <Label>Tanggal</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Waktu</Label>
                  <Input type="time" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Catatan</Label>
                <Textarea placeholder="Catatan tambahan" rows={3} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={() => {
                  toast.success('Jadwal berhasil ditambahkan');
                  setIsAddDialogOpen(false);
                }}>Simpan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-[#0A2342]">Jadwal Mendatang</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {events.map((event) => (
                <div key={event.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex gap-4 flex-1">
                      <div className={`w-2 h-full ${event.color} rounded`} />
                      <div className="flex-1">
                        <h4 className="mb-2">{event.title}</h4>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge className={getTypeColor(event.type)}>{event.type}</Badge>
                          <Badge variant="outline" className="gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {event.date}
                          </Badge>
                          <Badge variant="outline" className="gap-1">
                            <Clock className="w-3 h-3" />
                            {event.time}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">Lokasi: {event.location}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDelete(event.id)}
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

        <div className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Filter</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label>Jenis Kegiatan</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="rapat">Rapat Internal</SelectItem>
                    <SelectItem value="sidang">Sidang</SelectItem>
                    <SelectItem value="tenggat">Tenggat Kasus</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Periode</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Minggu Ini" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="today">Hari Ini</SelectItem>
                    <SelectItem value="week">Minggu Ini</SelectItem>
                    <SelectItem value="month">Bulan Ini</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader className="border-b bg-gray-50">
              <CardTitle className="text-[#0A2342]">Ringkasan</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Total Jadwal</span>
                <span className="text-2xl text-[#0A2342]">{events.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Minggu Ini</span>
                <span className="text-2xl text-[#007BFF]">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Bulan Ini</span>
                <span className="text-2xl text-[#1DB954]">8</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
