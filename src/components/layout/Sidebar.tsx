import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FileBarChart,
  LogOut,
  Warehouse
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Warehouse, label: 'Armazéns', path: '/warehouses' },
  { icon: Package, label: 'Produtos', path: '/products' },
  { icon: ShoppingCart, label: 'Pedidos', path: '/orders' },
  { icon: FileBarChart, label: 'Relatórios', path: '/reports' },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const { logout } = useAuth();

  return (
    <aside className="hidden lg:flex w-64 flex-col bg-zinc-900 text-white h-screen left-0 top-0 border-r border-zinc-800">
      
      {/* Branding (Igual ao Login) */}
      <div className="h-16 flex items-center gap-2 px-6 border-b border-zinc-800 bg-zinc-900/50 backdrop-blur-sm">
        <div className="bg-primary p-1.5 rounded-md">
          <Warehouse className="h-5 w-5 text-primary-foreground" />
        </div>
        <span className="font-bold text-lg tracking-tight">EasyRoute WMS</span>
      </div>

      {/* Menu Principal */}
      <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-3">
          Menu Principal
        </div>
        
        {menuItems.map((item) => {
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group",
                isActive 
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                  : "text-zinc-400 hover:bg-zinc-800 hover:text-white"
              )}
            >
              <item.icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-zinc-500 group-hover:text-white")} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Footer do Sidebar */}
      <div className="p-4 border-t border-zinc-800">
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-400 hover:bg-red-950/30 hover:text-red-300 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sair do Sistema
        </button>
      </div>
    </aside>
  );
}