import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import {
  FileText,
  Briefcase,
  CheckCircle2,
  Users,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar as CalendarIcon,
  TrendingUp,
  Clock,
  Gavel,
  Activity,
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, AreaChart, Area } from 'recharts';
import { toast } from 'sonner';
import api from '../lib/api';

interface DashboardProps {
  userName: string;
  onNavigate: (page: string, caseId?: string, filter?: string) => void;
}

export default function Dashboard({ userName, onNavigate }: DashboardProps) {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch dashboard stats', error);
        toast.error('Gagal memuat data dashboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleDeleteTask = async (id: number) => {
    try {
        await api.delete(`/tasks/${id}`);
        setStats({
            ...stats,
            tasks: stats.tasks.filter((task: any) => task.id !== id)
        });
        toast.success('Tugas berhasil dihapus.');
    } catch (error) {
        toast.error('Gagal menghapus tugas.');
    }
  };

  const getPriorityColor = (prioritas: string) => {
    switch (prioritas) {
      case 'Tinggi': return 'bg-red-500';
      case 'Sedang': return 'bg-orange-500';
      case 'Rendah': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    const colors: { [key: string]: string } = {
      'Persidangan': 'bg-purple-100 text-purple-700 border-purple-300',
      'Selesai': 'bg-green-100 text-green-700 border-green-300',
      'Verifikasi': 'bg-blue-100 text-blue-700 border-blue-300',
      'Penyelidikan': 'bg-yellow-100 text-yellow-700 border-yellow-300',
    };
    return colors[status] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getActivityIcon = (tipe: string) => {
    switch (tipe) {
      case 'update': return '🔄';
      case 'upload': return '📁';
      case 'note': return '📝';
      case 'complete': return '✅';
      default: return '📌';
    }
  };

  const getStatusData = () => {
    if (!stats) return [];
    return [
      { name: 'Aktif', value: stats.counts.active_cases, color: '#007BFF' },
      { name: 'Selesai', value: stats.counts.finished_cases, color: '#1DB954' },
      { name: 'Persidangan', value: stats.counts.court_cases, color: '#9C27B0' },
      { name: 'Pending', value: stats.counts.pending_cases || 0, color: '#FFA726' },
    ].filter(item => item.value > 0);
  };

  if (loading) {
      return <div className="p-8 text-center">Memuat dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-[#0A2342] mb-2">Selamat Datang, {userName}</h1>
        <p className="text-gray-500">Pantau progres kasus, tugas, dan aktivitas tim Anda hari ini - {new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-5 gap-4">
        <Card 
          className="shadow-sm border-l-4 border-l-[#FFA726] hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
          onClick={() => onNavigate('tambah-kasus')}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Kasus</p>
                <h3 className="text-[#FFA726] mb-1">{stats?.counts?.total_cases || 0}</h3>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>Total tercatat</span>
                </div>
              </div>
              <div className="bg-[#FFA726]/10 p-2.5 rounded-lg">
                <FileText className="w-5 h-5 text-[#FFA726]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="shadow-sm border-l-4 border-l-[#007BFF] hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
          onClick={() => onNavigate('daftar-kasus', undefined, 'Aktif')}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Kasus Aktif</p>
                <h3 className="text-[#007BFF] mb-1">{stats?.counts?.active_cases || 0}</h3>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>Sedang berjalan</span>
                </div>
              </div>
              <div className="bg-[#007BFF]/10 p-2.5 rounded-lg">
                <Briefcase className="w-5 h-5 text-[#007BFF]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="shadow-sm border-l-4 border-l-purple-500 hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
          onClick={() => onNavigate('daftar-kasus', undefined, 'Persidangan')}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Di Pengadilan</p>
                <h3 className="text-purple-600 mb-1">{stats?.counts?.court_cases || 0}</h3>
                <div className="flex items-center gap-1 text-xs text-gray-600">
                  <span>Persidangan aktif</span>
                </div>
              </div>
              <div className="bg-purple-100 p-2.5 rounded-lg">
                <Gavel className="w-5 h-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="shadow-sm border-l-4 border-l-[#1DB954] hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
          onClick={() => onNavigate('daftar-kasus', undefined, 'Selesai')}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Kasus Selesai</p>
                <h3 className="text-[#1DB954] mb-1">{stats?.counts?.finished_cases || 0}</h3>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>Diselesaikan</span>
                </div>
              </div>
              <div className="bg-[#1DB954]/10 p-2.5 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-[#1DB954]" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="shadow-sm border-l-4 border-l-[#FFD700] hover:shadow-md transition-all cursor-pointer transform hover:scale-105"
          onClick={() => onNavigate('data-klien')}
        >
          <CardContent className="p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-500 text-sm mb-1">Total Klien</p>
                <h3 className="text-[#FFD700] mb-1">{stats?.counts?.total_clients || 0}</h3>
                <div className="flex items-center gap-1 text-xs text-green-600">
                  <TrendingUp className="w-3 h-3" />
                  <span>Terdaftar</span>
                </div>
              </div>
              <div className="bg-[#FFD700]/10 p-2.5 rounded-lg">
                <Users className="w-5 h-5 text-[#FFD700]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-3 gap-6">
        {/* Timeline Aktivitas */}
        <Card className="col-span-2 shadow-sm border-gray-200">
          <CardHeader className="border-b bg-[#FAFBFC]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#0A2342]">Timeline Aktivitas Terkini</CardTitle>
              <Button size="sm" variant="outline" className="border-gray-300">
                <Activity className="w-4 h-4 mr-2" />
                Lihat Semua
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {stats?.activities?.length > 0 ? (
                stats.activities.map((activity: any, index: number) => (
                  <div key={index} className="flex gap-4 items-start">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm">
                        {getActivityIcon(activity.tipe)}
                      </div>
                      {index < stats.activities.length - 1 && (
                        <div className="w-0.5 h-full bg-gray-200 my-1" />
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[#007BFF]">{activity.user}</span>
                        <span className="text-gray-600">{activity.aksi}</span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{activity.detail}</p>
                      <div className="flex items-center gap-1 text-xs text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{activity.waktu}</span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Belum ada aktivitas terkini.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Kasus Terkini */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b bg-[#FAFBFC]">
            <div className="flex items-center justify-between">
              <CardTitle className="text-[#0A2342]">Kasus Terkini</CardTitle>
              <Button 
                size="sm" 
                variant="ghost" 
                className="text-[#007BFF]"
                onClick={() => onNavigate('daftar-kasus')}
              >
                Lihat Semua →
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            <div className="space-y-3">
              {stats?.recent_cases?.length > 0 ? (
                stats.recent_cases.map((caseItem: any) => (
                  <div 
                    key={caseItem.id} 
                    className="border border-gray-200 rounded-lg p-3 hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => onNavigate('detail-kasus', caseItem.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-mono text-xs text-gray-500">{caseItem.nomor}</p>
                        <p className="text-sm mt-1">{caseItem.klien}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className={`text-xs ${getStatusColor(caseItem.status)}`}>
                        {caseItem.status}
                      </Badge>
                      <span className="text-xs text-gray-500">{caseItem.waktu}</span>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">Belum ada kasus.</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daftar Tugas Internal */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="border-b bg-[#FAFBFC]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#0A2342]">Daftar Tugas Internal ({stats?.tasks?.length || 0})</CardTitle>
            <Button size="sm" className="bg-[#007BFF] hover:bg-[#0066DD]" onClick={() => onNavigate('tugas-aktivitas')}>
              <Plus className="w-4 h-4 mr-2" />
              Kelola Tugas
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            {stats?.tasks?.length > 0 ? (
              stats.tasks.map((task: any) => (
                <div key={task.id} className="border border-gray-200 rounded-xl p-4 hover:shadow-sm transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <Badge className={`${getPriorityColor(task.prioritas)} text-white border-0`}>
                      {task.prioritas}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                      onClick={() => handleDeleteTask(task.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                  <h4 className="mb-2 line-clamp-2">{task.judul}</h4>
                  <div className="space-y-2 mb-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>👤</span>
                      <span className="text-xs">{task.penanggungJawab}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>📅</span>
                      <span className="text-xs">{task.tenggat}</span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-[#007BFF]">{task.progress}%</span>
                    </div>
                    <Progress value={task.progress} className="h-1.5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="sm" variant="outline" className="flex-1 text-xs border-gray-300"
                      onClick={() => onNavigate('tugas-aktivitas')}>
                      <Eye className="w-3 h-3 mr-1" />
                      Lihat
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-3 text-center text-gray-500 py-4">
                Belum ada tugas aktif.
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-2 gap-6">
        {/* Bar Chart - Kasus per Bulan */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b bg-[#FAFBFC]">
            <CardTitle className="text-[#0A2342]">Kasus per Bulan (Tahun Ini)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats?.monthly_stats || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="kasus" fill="#007BFF" name="Masuk" radius={[4, 4, 0, 0]} />
                <Bar dataKey="selesai" fill="#1DB954" name="Selesai" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Pie Chart - Status Kasus */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b bg-[#FAFBFC]">
            <CardTitle className="text-[#0A2342]">Distribusi Status Kasus</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={getStatusData()}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {getStatusData().map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Line Chart - Penyelesaian Kasus */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b bg-[#FAFBFC]">
            <CardTitle className="text-[#0A2342]">Tren Penyelesaian Kasus</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={stats?.monthly_stats || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="bulan" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="selesai" stroke="#1DB954" strokeWidth={2} dot={{ fill: '#1DB954', r: 4 }} name="Selesai" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Area Chart - Aktivitas Petugas */}
        <Card className="shadow-sm border-gray-200">
          <CardHeader className="border-b bg-[#FAFBFC]">
            <CardTitle className="text-[#0A2342]">Aktivitas Sistem (7 Hari Terakhir)</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={stats?.daily_activity || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="hari" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="aktivitas" stroke="#FFA726" fill="#FFA726" fillOpacity={0.3} name="Aktivitas" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Jadwal Hari Ini */}
      <Card className="shadow-sm border-gray-200">
        <CardHeader className="border-b bg-[#FAFBFC]">
          <div className="flex items-center justify-between">
            <CardTitle className="text-[#0A2342]">Jadwal Hari Ini</CardTitle>
            <Button
              size="sm"
              className="bg-[#007BFF] hover:bg-[#0066DD]"
              onClick={() => onNavigate('kalender-jadwal')}
            >
              <CalendarIcon className="w-4 h-4 mr-2" />
              Lihat Kalender Lengkap
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            {stats?.todays_schedules?.length > 0 ? (
              stats.todays_schedules.map((schedule: any) => (
                <div key={schedule.id} className="flex items-center gap-4 border-l-4 border-l-blue-500 bg-blue-50 rounded-lg p-4">
                  <div className="bg-blue-500 text-white px-3 py-2 rounded-lg text-center min-w-[60px]">
                    <div className="text-xs">{new Date(schedule.start_time).toLocaleString('id-ID', { month: 'short' }).toUpperCase()}</div>
                    <div className="text-xl">{new Date(schedule.start_time).getDate()}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-1">{schedule.title}</h4>
                    <p className="text-sm text-gray-600">📍 {schedule.location || '-'}</p>
                    <p className="text-sm text-gray-600">⏰ {new Date(schedule.start_time).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-2 text-center text-gray-500 py-4">
                Tidak ada jadwal hari ini.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}