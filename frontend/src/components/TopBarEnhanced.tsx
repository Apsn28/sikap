import { useState, useRef, useEffect } from 'react';
import { Bell, Search, Clock, FileText, User, CheckCircle } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface TopBarProps {
  userName: string;
  userRole: string;
}

interface Notification {
  id: number;
  title: string;
  description: string;
  time: string;
  type: 'case' | 'document' | 'user' | 'status';
  read: boolean;
}

export default function TopBarEnhanced({ userName, userRole }: TopBarProps) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
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
    {
      id: 4,
      title: 'Anggota Tim Baru',
      description: 'Brigadir Dewi Lestari ditambahkan ke tim investigasi',
      time: '2 jam yang lalu',
      type: 'user',
      read: true,
    },
    {
      id: 5,
      title: 'Kasus Selesai',
      description: 'Kasus 2024/002/PID telah selesai dan ditutup',
      time: '3 jam yang lalu',
      type: 'status',
      read: true,
    },
    {
      id: 6,
      title: 'Klien Baru Terdaftar',
      description: 'CV Maju Jaya telah ditambahkan ke sistem',
      time: '4 jam yang lalu',
      type: 'user',
      read: true,
    },
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
  };

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

  return (
    <div className="bg-white border-b border-gray-200 px-8 py-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{currentDate}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari kasus, klien, atau dokumen..."
              className="pl-10 bg-gray-50 border-gray-300"
            />
          </div>

          <div className="relative" ref={notificationRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={handleNotificationClick}
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#E53935] text-white text-xs border-0">
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
                      className="text-[#007BFF] hover:text-[#0066DD] text-sm"
                    >
                      Tandai semua telah dibaca
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
                    className="w-full text-[#007BFF] hover:text-[#0066DD] hover:bg-blue-50"
                  >
                    Lihat Semua Notifikasi
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
