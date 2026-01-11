import { ChevronRight, Home } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export default function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav className="flex items-center gap-2 text-sm mb-6">
      <Home className="w-4 h-4 text-gray-400" />
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          {item.onClick ? (
            <button
              onClick={item.onClick}
              className="text-[#007BFF] hover:underline transition-all"
            >
              {item.label}
            </button>
          ) : (
            <span className={index === items.length - 1 ? 'text-gray-900' : 'text-gray-500'}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}
