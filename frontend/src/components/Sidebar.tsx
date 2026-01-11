import { 
  LayoutDashboard, 
  FolderOpen, 
  Users, 
  FileText, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  Shield as ShieldIcon, 
  HelpCircle, 
  LogOut,
  ChevronRight,
  Plus,
  List,
  FileStack
} from 'lucide-react';
import { useState } from 'react';
import { Avatar, AvatarFallback } from './ui/avatar';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onLogout: () => void;
  userName: string;
  userRole: string;
}

export default function Sidebar({ currentPage, onNavigate, onLogout, userName, userRole }: SidebarProps) {
  const [expandedMenu, setExpandedMenu] = useState<string | null>('manajemen-kasus');

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'manajemen-kasus',
      label: 'Manajemen Kasus',
      icon: FolderOpen,
      submenu: [
        { id: 'daftar-kasus', label: 'Daftar Kasus', icon: List },
        { id: 'tambah-kasus', label: 'Tambah Kasus Baru', icon: Plus },
      ],
    },
    {
      id: 'klien-tim',
      label: 'Klien & Tim',
      icon: Users,
      submenu: [
        { id: 'data-klien', label: 'Data Klien', icon: Users },
        { id: 'tim-internal', label: 'Tim Internal', icon: Users },
      ],
    },
    { id: 'dokumen-arsip', label: 'Dokumen & Arsip', icon: FileText },
    { id: 'tugas-aktivitas', label: 'Tugas & Aktivitas', icon: CheckSquare },
    { id: 'kalender-jadwal', label: 'Kalender & Jadwal', icon: Calendar },
    { id: 'statistik-laporan', label: 'Statistik & Laporan', icon: BarChart3 },
    { id: 'pengaturan-sistem', label: 'Pengaturan Sistem', icon: Settings },
    { id: 'audit-keamanan', label: 'Audit & Keamanan Data', icon: ShieldIcon },
    { id: 'bantuan-info', label: 'Bantuan & Pusat Informasi', icon: HelpCircle },
  ];

  const toggleSubmenu = (menuId: string) => {
    setExpandedMenu(expandedMenu === menuId ? null : menuId);
  };

  const handleMenuClick = (item: any) => {
    if (item.submenu) {
      toggleSubmenu(item.id);
    } else {
      onNavigate(item.id);
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  return (
    <div className="w-72 bg-[#0A2342] text-white flex flex-col h-screen shadow-xl">
      {/* Logo & User Profile */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-[#FFD700] rounded-lg flex items-center justify-center">
            <ShieldIcon className="w-7 h-7 text-[#0A2342]" />
          </div>
          <div>
            <h3 className="text-white">SIKAP PP</h3>
            <p className="text-xs text-blue-300">POLRI</p>
          </div>
        </div>

        <div className="flex items-center gap-3 bg-white/5 p-3 rounded-xl">
          <Avatar>
            <AvatarFallback className="bg-[#007BFF] text-white">
              {getInitials(userName)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm truncate">{userName}</p>
            <p className="text-xs text-blue-300">{userRole}</p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => handleMenuClick(item)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                currentPage === item.id && !item.submenu
                  ? 'bg-[#007BFF] text-white shadow-lg'
                  : 'text-blue-100 hover:bg-white/10'
              }`}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span className="flex-1 text-left text-sm">{item.label}</span>
              {item.submenu && (
                <ChevronRight
                  className={`w-4 h-4 transition-transform ${
                    expandedMenu === item.id ? 'rotate-90' : ''
                  }`}
                />
              )}
            </button>

            {item.submenu && expandedMenu === item.id && (
              <div className="ml-4 mt-1 space-y-1">
                {item.submenu.map((subItem) => (
                  <button
                    key={subItem.id}
                    onClick={() => onNavigate(subItem.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm transition-all ${
                      currentPage === subItem.id
                        ? 'bg-[#007BFF] text-white'
                        : 'text-blue-200 hover:bg-white/5'
                    }`}
                  >
                    <subItem.icon className="w-4 h-4" />
                    <span>{subItem.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-300 hover:bg-red-500/20 transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-sm">Keluar</span>
        </button>
      </div>
    </div>
  );
}