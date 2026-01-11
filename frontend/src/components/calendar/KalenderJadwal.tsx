import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

interface Event {
  id: string;
  judul: string;
  tanggal: string;
  waktu: string;
  lokasi: string;
  jenis: string;
  deskripsi: string;
}

export default function KalenderJadwal() {
  const [currentMonth, setCurrentMonth] = useState(new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' }));
  const [view, setView] = useState('month');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const [newEvent, setNewEvent] = useState({
    judul: '',
    tanggal: '',
    waktu: '',
    lokasi: '',
    jenis: '',
    deskripsi: '',
  });

  const fetchSchedules = async () => {
    try {
      setLoading(true);
      const response = await api.get('/schedules');
      // Map backend data to frontend interface
      const mappedEvents = response.data.map((item: any) => ({
        id: item.id.toString(),
        judul: item.title,
        tanggal: item.start_time.split(' ')[0],
        waktu: item.start_time.split(' ')[1].substring(0, 5),
        lokasi: item.location || '-',
        jenis: item.type,
        deskripsi: item.description || '',
      }));
      setEvents(mappedEvents);
    } catch (error) {
      console.error('Failed to fetch schedules:', error);
      toast.error('Gagal memuat jadwal.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const getEventColor = (jenis: string) => {
    switch (jenis) {
      case 'Rapat Internal':
        return 'border-l-green-500 bg-green-50';
      case 'Sidang / Pendampingan':
        return 'border-l-blue-500 bg-blue-50';
      case 'Tenggat Kasus':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.judul || !newEvent.tanggal || !newEvent.jenis) {
      toast.error('Mohon lengkapi data jadwal terlebih dahulu.');
      return;
    }

    try {
      // Combine date and time for start_time
      const startTime = `${newEvent.tanggal} ${newEvent.waktu || '00:00'}:00`;
      
      await api.post('/schedules', {
        title: newEvent.judul,
        description: newEvent.deskripsi,
        start_time: startTime,
        location: newEvent.lokasi,
        type: newEvent.jenis,
      });

      toast.success('Jadwal berhasil ditambahkan.');
      setAddDialogOpen(false);
      setNewEvent({
        judul: '',
        tanggal: '',
        waktu: '',
        lokasi: '',
        jenis: '',
        deskripsi: '',
      });
      fetchSchedules(); // Refresh data
    } catch (error) {
      console.error('Failed to add schedule:', error);
      toast.error('Gagal menambahkan jadwal.');
    }
  };

  // Simple calendar grid
  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#0A2342] mb-2">Kalender & Jadwal</h1>
          <p className="text-gray-600">Kelola jadwal rapat, sidang, dan tenggat kasus</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#007BFF] hover:bg-[#0056b3]">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Jadwal Baru
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Jadwal Baru</DialogTitle>
              <DialogDescription>Lengkapi informasi jadwal di bawah ini</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul Acara *</Label>
                <Input
                  id="judul"
                  placeholder="Masukkan judul acara"
                  value={newEvent.judul}
                  onChange={(e) => setNewEvent({ ...newEvent, judul: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tanggal">Tanggal *</Label>
                  <Input
                    id="tanggal"
                    type="date"
                    value={newEvent.tanggal}
                    onChange={(e) => setNewEvent({ ...newEvent, tanggal: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waktu">Waktu</Label>
                  <Input
                    id="waktu"
                    type="time"
                    value={newEvent.waktu}
                    onChange={(e) => setNewEvent({ ...newEvent, waktu: e.target.value })}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jenis">Jenis Kegiatan *</Label>
                  <Select
                    value={newEvent.jenis}
                    onValueChange={(value) => setNewEvent({ ...newEvent, jenis: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rapat Internal">Rapat Internal</SelectItem>
                      <SelectItem value="Sidang / Pendampingan">Sidang / Pendampingan</SelectItem>
                      <SelectItem value="Tenggat Kasus">Tenggat Kasus</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lokasi">Lokasi</Label>
                  <Input
                    id="lokasi"
                    placeholder="Masukkan lokasi"
                    value={newEvent.lokasi}
                    onChange={(e) => setNewEvent({ ...newEvent, lokasi: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi</Label>
                <Textarea
                  id="deskripsi"
                  placeholder="Masukkan deskripsi"
                  value={newEvent.deskripsi}
                  onChange={(e) => setNewEvent({ ...newEvent, deskripsi: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleAddEvent}>
                  Simpan Jadwal
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Calendar View */}
        <Card className="col-span-2 shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#0A2342]">{currentMonth}</CardTitle>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <ChevronRight className="w-4 h-4" />
                </Button>
                <Select value={view} onValueChange={setView}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="month">Bulanan</SelectItem>
                    <SelectItem value="week">Mingguan</SelectItem>
                    <SelectItem value="day">Harian</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-7 gap-2 mb-2">
              {days.map((day) => (
                <div key={day} className="text-center text-sm text-gray-600 p-2">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {dates.map((date) => (
                <div
                  key={date}
                  className={`aspect-square border rounded-lg p-2 hover:bg-gray-50 cursor-pointer ${
                    date === 14 ? 'bg-blue-50 border-blue-300' : ''
                  }`}
                >
                  <div className="text-sm">{date}</div>
                  {date === 14 && (
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                      <div className="w-2 h-2 rounded-full bg-green-500 mt-1" />
                    </div>
                  )}
                  {date === 15 && (
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-red-500" />
                    </div>
                  )}
                  {date === 16 && (
                    <div className="mt-1">
                      <div className="w-2 h-2 rounded-full bg-blue-500" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events */}
        <Card className="shadow-lg">
          <CardHeader className="border-b bg-gray-50">
            <CardTitle className="text-[#0A2342]">Jadwal Mendatang</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {events.slice(0, 4).map((event) => (
                <div key={event.id} className={`${getEventColor(event.jenis)} border-l-4 rounded-lg p-3`}>
                  <h4 className="mb-2">{event.judul}</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{event.tanggal}</span>
                    </div>
                    {event.waktu && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        <span>{event.waktu} WIB</span>
                      </div>
                    )}
                    {event.lokasi && event.lokasi !== '-' && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.lokasi}</span>
                      </div>
                    )}
                  </div>
                  <Badge variant="outline" className="mt-2 text-xs">
                    {event.jenis}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* All Events List */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-[#0A2342]">Semua Jadwal</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            {events.map((event) => (
              <div key={event.id} className={`${getEventColor(event.jenis)} border-l-4 rounded-lg p-4`}>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="mb-2">{event.judul}</h4>
                    <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <CalendarIcon className="w-4 h-4" />
                        <span>{event.tanggal}</span>
                      </div>
                      {event.waktu && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          <span>{event.waktu} WIB</span>
                        </div>
                      )}
                      {event.lokasi && event.lokasi !== '-' && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4" />
                          <span>{event.lokasi}</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{event.deskripsi}</p>
                  </div>
                  <Badge variant="outline">{event.jenis}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
