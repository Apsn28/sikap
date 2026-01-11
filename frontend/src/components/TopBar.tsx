import { Bell, Search } from 'lucide-react';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Button } from './ui/button';

interface TopBarProps {
  userName: string;
  userRole: string;
}

export default function TopBar({ userName, userRole }: TopBarProps) {
  const currentDate = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

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
              className="pl-10 bg-gray-50"
            />
          </div>

          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-5 h-5" />
            <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-[#E53935] text-white text-xs">
              5
            </Badge>
          </Button>
        </div>
      </div>
    </div>
  );
}
