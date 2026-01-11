import { useState } from 'react';
import { Plus, Edit2, Trash2, Clock, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Progress } from './ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { toast } from 'sonner@2.0.3';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';

interface Task {
  id: number;
  title: string;
  assignee: string;
  status: string;
  priority: string;
  deadline: string;
  progress: number;
}

export default function TugasAktivitas() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: 'Review Kasus #KS-2025-001', assignee: 'Budi Santoso', status: 'Dalam Proses', priority: 'Tinggi', deadline: '2025-11-15', progress: 65 },
    { id: 2, title: 'Verifikasi Dokumen Klien', assignee: 'Ahmad Fauzi', status: 'Menunggu', priority: 'Sedang', deadline: '2025-11-18', progress: 30 },
    { id: 3, title: 'Persiapan Sidang Kasus Korupsi', assignee: 'Sri Wahyuni', status: 'Selesai', priority: 'Tinggi', deadline: '2025-11-10', progress: 100 },
    { id: 4, title: 'Update Laporan Bulanan', assignee: 'Dewi Lestari', status: 'Dalam Proses', priority: 'Rendah', deadline: '2025-11-20', progress: 45 },
    { id: 5, title: 'Koordinasi dengan Jaksa', assignee: 'Budi Santoso', status: 'Menunggu', priority: 'Tinggi', deadline: '2025-11-13', progress: 20 },
  ]);

  const handleDelete = (id: number) => {
    setTasks(tasks.filter(task => task.id !== id));
    toast.success('Tugas berhasil dihapus');
  };

  const handleEdit = (task: Task) => {
    setEditingTask({ ...task });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (editingTask) {
      setTasks(tasks.map(t => t.id === editingTask.id ? editingTask : t));
      toast.success('Tugas berhasil diperbarui');
      setIsEditDialogOpen(false);
      setEditingTask(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Tinggi': return 'bg-red-100 text-red-700';
      case 'Sedang': return 'bg-orange-100 text-orange-700';
      case 'Rendah': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai': return 'bg-green-100 text-green-700';
      case 'Dalam Proses': return 'bg-blue-100 text-blue-700';
      case 'Menunggu': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-[#0A2342] mb-2">Tugas & Aktivitas</h1>
          <p className="text-gray-600">Kelola semua tugas dan pantau progres pekerjaan</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#007BFF] hover:bg-[#0056b3]">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tugas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Tugas Baru</DialogTitle>
              <DialogDescription>Buat tugas baru untuk tim</DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Judul Tugas</Label>
                <Input placeholder="Masukkan judul tugas" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Penanggung Jawab</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih penanggung jawab" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Budi Santoso">Budi Santoso</SelectItem>
                      <SelectItem value="Ahmad Fauzi">Ahmad Fauzi</SelectItem>
                      <SelectItem value="Sri Wahyuni">Sri Wahyuni</SelectItem>
                      <SelectItem value="Dewi Lestari">Dewi Lestari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prioritas</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih prioritas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rendah">Rendah</SelectItem>
                      <SelectItem value="Sedang">Sedang</SelectItem>
                      <SelectItem value="Tinggi">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tenggat Waktu</Label>
                  <Input type="date" />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Menunggu">Menunggu</SelectItem>
                      <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Deskripsi</Label>
                <Textarea placeholder="Deskripsi tugas" rows={3} />
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>Batal</Button>
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={() => {
                  toast.success('Tugas berhasil ditambahkan');
                  setIsAddDialogOpen(false);
                }}>Simpan</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-[#0A2342]">Daftar Tugas ({tasks.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50">
                  <TableHead>Judul</TableHead>
                  <TableHead>Penanggung Jawab</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Prioritas</TableHead>
                  <TableHead>Tenggat</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-gray-50">
                    <TableCell>{task.title}</TableCell>
                    <TableCell>{task.assignee}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(task.status)}>{task.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getPriorityColor(task.priority)}>{task.priority}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {task.deadline}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={task.progress} className="w-20 h-2" />
                        <span className="text-sm text-gray-600">{task.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button 
                          size="icon" 
                          variant="ghost" 
                          className="h-8 w-8 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          onClick={() => handleEdit(task)}
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tugas</DialogTitle>
            <DialogDescription>Perbarui detail tugas</DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Judul Tugas</Label>
                <Input 
                  value={editingTask.title}
                  onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  placeholder="Masukkan judul tugas" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Penanggung Jawab</Label>
                  <Select 
                    value={editingTask.assignee}
                    onValueChange={(value) => setEditingTask({ ...editingTask, assignee: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Budi Santoso">Budi Santoso</SelectItem>
                      <SelectItem value="Ahmad Fauzi">Ahmad Fauzi</SelectItem>
                      <SelectItem value="Sri Wahyuni">Sri Wahyuni</SelectItem>
                      <SelectItem value="Dewi Lestari">Dewi Lestari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Prioritas</Label>
                  <Select 
                    value={editingTask.priority}
                    onValueChange={(value) => setEditingTask({ ...editingTask, priority: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Rendah">Rendah</SelectItem>
                      <SelectItem value="Sedang">Sedang</SelectItem>
                      <SelectItem value="Tinggi">Tinggi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Tenggat Waktu</Label>
                  <Input 
                    type="date" 
                    value={editingTask.deadline}
                    onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select 
                    value={editingTask.status}
                    onValueChange={(value) => {
                      const progressMap: { [key: string]: number } = {
                        'Menunggu': 0,
                        'Dalam Proses': 50,
                        'Selesai': 100,
                      };
                      setEditingTask({ 
                        ...editingTask, 
                        status: value,
                        progress: progressMap[value] || 0
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Menunggu">Menunggu</SelectItem>
                      <SelectItem value="Dalam Proses">Dalam Proses</SelectItem>
                      <SelectItem value="Selesai">Selesai</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Progress (%)</Label>
                <div className="flex items-center gap-3">
                  <Progress value={editingTask.progress} className="flex-1" />
                  <span className="text-sm font-medium w-12 text-right">{editingTask.progress}%</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>Batal</Button>
            <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleSaveEdit}>
              Simpan Perubahan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-lg border-l-4 border-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Prioritas Tinggi</p>
                <p className="text-2xl text-[#0A2342]">3</p>
              </div>
              <AlertCircle className="w-12 h-12 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-l-4 border-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Dalam Proses</p>
                <p className="text-2xl text-[#0A2342]">2</p>
              </div>
              <Clock className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        <Card className="shadow-lg border-l-4 border-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 mb-1">Selesai</p>
                <p className="text-2xl text-[#0A2342]">1</p>
              </div>
              <AlertCircle className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}