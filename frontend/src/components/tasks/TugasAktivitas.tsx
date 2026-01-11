import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { Plus, Search, Eye, Edit, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import api from '../../lib/api';

interface Task {
  id: number;
  judul: string;
  penanggungJawab: string;
  status: string;
  prioritas: string;
  tenggat: string;
  progress: number;
  deskripsi: string;
  team_member_id?: number;
}

interface TeamMember {
  id: number;
  name: string;
}

export default function TugasAktivitas() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<number | null>(null);

  const [newTask, setNewTask] = useState({
    judul: '',
    team_member_id: '',
    prioritas: '',
    tenggat: '',
    deskripsi: '',
  });

  const fetchTasks = async () => {
    try {
      const response = await api.get('/tasks');
      const formattedTasks = response.data.map((task: any) => ({
        id: task.id,
        judul: task.title,
        penanggungJawab: task.assignee?.name || 'Unassigned',
        status: task.status,
        prioritas: task.priority,
        tenggat: task.due_date || '',
        progress: task.progress || 0,
        deskripsi: task.description || '',
        team_member_id: task.team_member_id,
      }));
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error('Gagal memuat tugas.');
    }
  };

  const fetchTeamMembers = async () => {
    try {
      const response = await api.get('/team-members');
      setTeamMembers(response.data);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchTeamMembers();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.judul.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getPriorityColor = (prioritas: string) => {
    switch (prioritas) {
      case 'Tinggi':
        return 'bg-red-500';
      case 'Sedang':
        return 'bg-orange-500';
      case 'Rendah':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Selesai':
        return 'bg-green-500';
      case 'In Progress':
        return 'bg-blue-500';
      case 'Pending':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const handleAddTask = async () => {
    if (!newTask.judul || !newTask.team_member_id || !newTask.prioritas) {
      toast.error('Mohon lengkapi data tugas terlebih dahulu.');
      return;
    }

    try {
      const response = await api.post('/tasks', {
        title: newTask.judul,
        team_member_id: parseInt(newTask.team_member_id),
        priority: newTask.prioritas,
        due_date: newTask.tenggat,
        description: newTask.deskripsi,
        status: 'Pending',
        progress: 0,
      });

      const newTaskData = response.data;
      // Fetch assignee name locally or refetch
      const assignee = teamMembers.find(m => m.id === parseInt(newTask.team_member_id));
      
      const formattedTask: Task = {
        id: newTaskData.id,
        judul: newTaskData.title,
        penanggungJawab: assignee?.name || 'Unknown',
        status: newTaskData.status,
        prioritas: newTaskData.priority,
        tenggat: newTaskData.due_date || '',
        progress: newTaskData.progress || 0,
        deskripsi: newTaskData.description || '',
        team_member_id: newTaskData.team_member_id,
      };

      setTasks([formattedTask, ...tasks]);
      setAddDialogOpen(false);
      setNewTask({
        judul: '',
        team_member_id: '',
        prioritas: '',
        tenggat: '',
        deskripsi: '',
      });
      toast.success('Tugas berhasil ditambahkan.');
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error('Gagal menambahkan tugas.');
    }
  };

  const handleViewDetail = (task: Task) => {
    setSelectedTask(task);
    setDetailDialogOpen(true);
  };

  const handleEdit = (task: Task) => {
    setEditingTask({ ...task });
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (editingTask) {
      try {
        await api.put(`/tasks/${editingTask.id}`, {
          title: editingTask.judul,
          team_member_id: editingTask.team_member_id,
          priority: editingTask.prioritas,
          due_date: editingTask.tenggat,
          description: editingTask.deskripsi,
          status: editingTask.status,
          progress: editingTask.progress,
        });

        // Update local state
        const updatedTasks = tasks.map((t) => {
            if (t.id === editingTask.id) {
                const assignee = teamMembers.find(m => m.id === editingTask.team_member_id);
                return {
                    ...editingTask,
                    penanggungJawab: assignee?.name || 'Unknown'
                };
            }
            return t;
        });

        setTasks(updatedTasks);
        toast.success('Tugas berhasil diperbarui.');
        setEditDialogOpen(false);
        setEditingTask(null);
      } catch (error) {
        console.error('Update error:', error);
        toast.error('Gagal memperbarui tugas.');
      }
    }
  };

  const handleDelete = (id: number) => {
    setTaskToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (taskToDelete) {
      try {
        await api.delete(`/tasks/${taskToDelete}`);
        setTasks(tasks.filter((t) => t.id !== taskToDelete));
        toast.success('Tugas berhasil dihapus.');
      } catch (error) {
        console.error('Error deleting task:', error);
        toast.error('Gagal menghapus tugas.');
      } finally {
        setDeleteDialogOpen(false);
        setTaskToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl text-[#0A2342] mb-2">Tugas & Aktivitas</h1>
          <p className="text-gray-600">Kelola dan pantau tugas tim Anda</p>
        </div>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#007BFF] hover:bg-[#0056b3]">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Tugas
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Tambah Tugas Baru</DialogTitle>
              <DialogDescription>
                Lengkapi informasi tugas di bawah ini
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="judul">Judul Tugas *</Label>
                <Input
                  id="judul"
                  placeholder="Masukkan judul tugas"
                  value={newTask.judul}
                  onChange={(e) => setNewTask({ ...newTask, judul: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="penanggungJawab">Penanggung Jawab *</Label>
                  <Select
                    value={newTask.team_member_id}
                    onValueChange={(value) => setNewTask({ ...newTask, team_member_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih penanggung jawab" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="prioritas">Prioritas *</Label>
                  <Select
                    value={newTask.prioritas}
                    onValueChange={(value) => setNewTask({ ...newTask, prioritas: value })}
                  >
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
              </div>
              <div className="space-y-2">
                <Label htmlFor="tenggat">Tenggat Waktu</Label>
                <Input
                  id="tenggat"
                  type="date"
                  value={newTask.tenggat}
                  onChange={(e) => setNewTask({ ...newTask, tenggat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="deskripsi">Deskripsi Tugas</Label>
                <Textarea
                  id="deskripsi"
                  placeholder="Masukkan deskripsi tugas"
                  value={newTask.deskripsi}
                  onChange={(e) => setNewTask({ ...newTask, deskripsi: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleAddTask}>
                  Simpan Tugas
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="shadow-lg">
        <CardContent className="p-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-2 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Cari tugas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="Selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Table */}
      <Card className="shadow-lg">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-[#0A2342]">Total: {filteredTasks.length} Tugas</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Judul</TableHead>
                <TableHead>Penanggung Jawab</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Prioritas</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Tenggat</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTasks.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-12 text-gray-500">
                    Belum ada tugas.
                  </TableCell>
                </TableRow>
              ) : (
                filteredTasks.map((task) => (
                  <TableRow key={task.id} className="hover:bg-gray-50">
                    <TableCell>{task.judul}</TableCell>
                    <TableCell>{task.penanggungJawab}</TableCell>
                    <TableCell>
                      <Badge className={`${getStatusColor(task.status)} text-white`}>
                        {task.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${getPriorityColor(task.prioritas)} text-white`}>
                        {task.prioritas}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Progress value={task.progress} className="h-2 w-20" />
                        <span className="text-sm text-gray-600">{task.progress}%</span>
                      </div>
                    </TableCell>
                    <TableCell>{task.tenggat}</TableCell>
                    <TableCell>
                      <div className="flex items-center justify-end gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleViewDetail(task)}>
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEdit(task)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => handleDelete(task.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Tugas</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-6 mt-4">
              <div>
                <Label className="text-gray-600">Judul Tugas</Label>
                <p className="text-lg">{selectedTask.judul}</p>
              </div>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <Label className="text-gray-600">Penanggung Jawab</Label>
                  <p className="text-lg">{selectedTask.penanggungJawab}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Tenggat Waktu</Label>
                  <p className="text-lg">{selectedTask.tenggat}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Status</Label>
                  <Badge className={`${getStatusColor(selectedTask.status)} text-white mt-1`}>
                    {selectedTask.status}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-600">Prioritas</Label>
                  <Badge className={`${getPriorityColor(selectedTask.prioritas)} text-white mt-1`}>
                    {selectedTask.prioritas}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-gray-600 mb-2 block">Progress</Label>
                <Progress value={selectedTask.progress} className="h-3" />
                <p className="text-sm text-gray-600 mt-2">{selectedTask.progress}% selesai</p>
              </div>
              <div>
                <Label className="text-gray-600">Deskripsi</Label>
                <p className="text-gray-700 mt-2">{selectedTask.deskripsi}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Tugas</DialogTitle>
            <DialogDescription>
              Perbarui informasi tugas di bawah ini
            </DialogDescription>
          </DialogHeader>
          {editingTask && (
            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="edit-judul">Judul Tugas *</Label>
                <Input
                  id="edit-judul"
                  placeholder="Masukkan judul tugas"
                  value={editingTask.judul}
                  onChange={(e) => setEditingTask({ ...editingTask, judul: e.target.value })}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-penanggungJawab">Penanggung Jawab *</Label>
                  <Select
                    value={editingTask.team_member_id?.toString()}
                    onValueChange={(value) => setEditingTask({ ...editingTask, team_member_id: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih penanggung jawab" />
                    </SelectTrigger>
                    <SelectContent>
                      {teamMembers.map((member) => (
                        <SelectItem key={member.id} value={member.id.toString()}>
                          {member.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-prioritas">Prioritas *</Label>
                  <Select
                    value={editingTask.prioritas}
                    onValueChange={(value) => setEditingTask({ ...editingTask, prioritas: value })}
                  >
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
              </div>
              <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="edit-status">Status</Label>
                    <Select
                        value={editingTask.status}
                        onValueChange={(value) => setEditingTask({ ...editingTask, status: value })}
                    >
                        <SelectTrigger>
                        <SelectValue placeholder="Pilih status" />
                        </SelectTrigger>
                        <SelectContent>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="Selesai">Selesai</SelectItem>
                        </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-progress">Progress (%)</Label>
                    <div className="flex items-center gap-3">
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            value={editingTask.progress}
                            onChange={(e) => setEditingTask({ ...editingTask, progress: parseInt(e.target.value) })}
                            className="w-24"
                        />
                        <Progress value={editingTask.progress} className="flex-1 h-3" />
                    </div>
                  </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-tenggat">Tenggat Waktu</Label>
                <Input
                  id="edit-tenggat"
                  type="date"
                  value={editingTask.tenggat}
                  onChange={(e) => setEditingTask({ ...editingTask, tenggat: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-deskripsi">Deskripsi Tugas</Label>
                <Textarea
                  id="edit-deskripsi"
                  placeholder="Masukkan deskripsi tugas"
                  value={editingTask.deskripsi}
                  onChange={(e) => setEditingTask({ ...editingTask, deskripsi: e.target.value })}
                  rows={4}
                />
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Batal
                </Button>
                <Button className="bg-[#007BFF] hover:bg-[#0056b3]" onClick={handleSaveEdit}>
                  Simpan Perubahan
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Konfirmasi Penghapusan</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus tugas ini? Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
