import { ReactNode, useState, useRef, useEffect } from 'react';
import {
  LayoutDashboard,
  Briefcase,
  Users,
  FolderOpen,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings,
  Shield,
  HelpCircle,
  LogOut,
  Bell,
  Search,
  ChevronRight,
  Clock,
  FileText,
  User,
  CheckCircle,
} from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { ScrollArea } from './ui/scroll-area';
import Footer from './Footer';

interface LayoutProps {
  children: ReactNode;
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName: string;
}

interface MenuItem {
  id: string;
  label: string;
  icon: any;
  submenu?: { id: string; label: string }[];
}

const menuItems: MenuItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  {
    id: 'manajemen-kasus',
    label: 'Manajemen Kasus',
    icon: Briefcase,
    submenu: [
      { id: 'daftar-kasus', label: 'Daftar Kasus' },
      { id: 'tambah-kasus', label: 'Tambah Kasus Baru' },
    ],
  },
  {
    id: 'klien-tim',
    label: 'Klien & Tim',
    icon: Users,
    submenu: [
      { id: 'data-klien', label: 'Data Klien' },
      { id: 'tim-internal', label: 'Tim Internal' },
    ],
  },
  { id: 'dokumen-arsip', label: 'Dokumen & Arsip', icon: FolderOpen },
  { id: 'tugas-aktivitas', label: 'Tugas & Aktivitas', icon: CheckSquare },
  { id: 'kalender-jadwal', label: 'Kalender & Jadwal', icon: Calendar },
  { id: 'statistik-laporan', label: 'Statistik & Laporan', icon: BarChart3 },
  { id: 'pengaturan-sistem', label: 'Pengaturan Sistem', icon: Settings },
  { id: 'audit-keamanan', label: 'Audit & Keamanan Data', icon: Shield },
  { id: 'bantuan-info', label: 'Bantuan & Pusat Informasi', icon: HelpCircle },
];

export default function Layout({
  children,
  currentPage,
  onNavigate,
  onLogout,
  userName,
}: LayoutProps) {
  const [expandedMenus, setExpandedMenus] = useState<string[]>(['manajemen-kasus', 'klien-tim']);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Kasus Baru Ditambahkan',
      description: 'Kasus 2024/007/PID telah ditambahkan oleh Kompol Ahmad Yani',
      time: '5 menit yang lalu',
      type: 'case',
      read: false,
    },
    {
      id: 2,
      title: 'Progress Kasus Diperbarui',
      description: 'Kasus 2024/001/PID berpindah ke tahap Persidangan',
      time: '15 menit yang lalu',
      type: 'status',
      read: false,
    },
    {
      id: 3,
      title: 'Dokumen Diunggah',
      description: 'BAP Tersangka.pdf berhasil diunggah ke Kasus 2024/002/PID',
      time: '1 jam yang lalu',
      type: 'document',
      read: false,
    },
  ]);
  const notificationRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = (id: number) => {
    setNotifications(notifications.map(n =>
      n.id === id ? { ...n, read: true } : n
    ));
  };

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'case':
        return <FileText className="w-5 h-5 text-blue-500" />;
      case 'document':
        return <FileText className="w-5 h-5 text-green-500" />;
      case 'user':
        return <User className="w-5 h-5 text-purple-500" />;
      case 'status':
        return <CheckCircle className="w-5 h-5 text-orange-500" />;
      default:
        return <Bell className="w-5 h-5 text-gray-500" />;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleMenu = (menuId: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menuId)
        ? prev.filter((id) => id !== menuId)
        : [...prev, menuId]
    );
  };

  const handleMenuClick = (item: MenuItem) => {
    if (item.submenu) {
      toggleMenu(item.id);
    } else {
      onNavigate(item.id);
    }
  };

  const isActive = (itemId: string) => {
    if (itemId === currentPage) return true;
    const item = menuItems.find((m) => m.id === itemId);
    if (item?.submenu) {
      return item.submenu.some((sub) => sub.id === currentPage);
    }
    return false;
  };

  return (
    <div className="flex h-screen bg-[#FAFBFC]">
      {/* Sidebar */}
      <aside className="w-72 bg-[#0B1E3A] text-white flex flex-col shadow-xl">
        {/* Logo & Brand */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="bg-[#C8A74E] p-2.5 rounded-xl">
              <Shield className="w-7 h-7 text-[#0B1E3A]" />
            </div>
            <div>
              <h1 className="text-lg">SIKAP PP POLRI</h1>
              <p className="text-xs text-white/70">Sistem Informasi Kasus</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12 bg-[#C8A74E] border-2 border-white/20">
              <AvatarFallback className="bg-[#C8A74E] text-[#0B1E3A]">{getInitials(userName)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm">{userName}</p>
              <p className="text-xs text-white/70">Administrator</p>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                    isActive(item.id)
                      ? 'bg-[#C8A74E] text-[#0B1E3A] shadow-lg'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="flex-1 text-left text-sm">{item.label}</span>
                  {item.submenu && (
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${expandedMenus.includes(item.id) ? 'rotate-90' : ''}`}
                    />
                  )}
                </button>
                {item.submenu && expandedMenus.includes(item.id) && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subItem) => (
                      <button
                        key={subItem.id}
                        onClick={() => onNavigate(subItem.id)}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-all ${
                          currentPage === subItem.id
                            ? 'bg-[#C8A74E]/60 text-white'
                            : 'text-white/70 hover:bg-white/5 hover:text-white/90'
                        }`}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-current" />
                        {subItem.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-white/80 hover:bg-red-500/20 hover:text-red-300 transition-all"
          >
            <LogOut className="w-5 h-5" />
            <span className="text-sm">Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation Bar */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Cari kasus, klien, atau dokumen..."
                  className="pl-10 h-11 bg-gray-50 border-gray-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative" ref={notificationRef}>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative hover:bg-gray-100"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 bg-red-500 text-white px-1.5 py-0 text-xs rounded-full min-w-5 h-5 border-0">
                      {unreadCount}
                    </Badge>
                  )}
                </Button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 z-50 notification-dropdown">
                    <div className="flex items-center justify-between p-4 border-b">
                      <div>
                        <h3 className="text-[#0B1E3A]">Notifikasi</h3>
                        <p className="text-sm text-gray-500">{unreadCount} notifikasi baru</p>
                      </div>
                      {unreadCount > 0 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={markAllAsRead}
                          className="text-[#007BFF] hover:text-[#0066DD] text-sm h-auto p-1"
                        >
                          Tandai telah dibaca
                        </Button>
                      )}
                    </div>

                    <ScrollArea className="h-[400px]">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                            !notification.read ? 'bg-blue-50/50' : ''
                          }`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex items-start gap-3">
                            <div className="mt-1">
                              {getNotificationIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <h4 className={`text-sm ${!notification.read ? 'font-medium text-[#0B1E3A]' : 'text-gray-700'}`}>
                                  {notification.title}
                                </h4>
                                {!notification.read && (
                                  <div className="w-2 h-2 bg-[#007BFF] rounded-full mt-1 flex-shrink-0"></div>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                {notification.description}
                              </p>
                              <div className="flex items-center gap-1 mt-2 text-xs text-gray-500">
                                <Clock className="w-3 h-3" />
                                <span>{notification.time}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </ScrollArea>

                    <div className="p-3 border-t bg-gray-50">
                      <Button
                        variant="ghost"
                        className="w-full text-[#007BFF] hover:text-[#0066DD] hover:bg-blue-50 h-auto py-2"
                      >
                        Lihat Semua Notifikasi
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-3 border-l pl-4">
                <Avatar className="h-10 w-10 bg-[#C8A74E]">
                  <AvatarFallback className="bg-[#C8A74E] text-[#0B1E3A]">{getInitials(userName)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm">{userName}</p>
                  <p className="text-xs text-gray-500">Online</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-[#FAFBFC]">
          <div className="p-8">{children}</div>
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}