import React, { useState } from 'react';
import { Link, useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Truck,
  RotateCcw,
  CreditCard,
  Users,
  Tags,
  Globe,
  Settings,
  Shield,
  LogOut,
  ExternalLink,
  Menu,
  X,
  Bell,
  Search,
  ChevronRight,
} from 'lucide-react';
import { useAdminAuthStore } from '../../stores/useAdminAuthStore';
import { useAdminStore } from '../../stores/useAdminStore';

export const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout, switchRole } = useAdminAuthStore();
  const { orders } = useAdminStore();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Compute pending fulfillment count
  const pendingCount = orders.filter(
    (o) => o.fulfillmentStatus === 'received' || o.fulfillmentStatus === 'confirmed' || o.fulfillmentStatus === 'processing'
  ).length;

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const navGroups = [
    {
      group: 'Overview',
      items: [
        { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Catalog & Stock',
      items: [
        { label: 'Products', href: '/admin/products', icon: Package },
        { label: 'Categories', href: '/admin/categories', icon: Layers },
        { label: 'Inventory', href: '/admin/inventory', icon: Tags },
      ],
    },
    {
      group: 'Fulfillment & Logistics',
      items: [
        { label: 'Orders', href: '/admin/orders', icon: ShoppingBag, badge: pendingCount },
        { label: 'Shipments & Dispatch', href: '/admin/shipments', icon: Truck },
        { label: 'Returns & Refunds', href: '/admin/returns', icon: RotateCcw },
      ],
    },
    {
      group: 'Store & Marketing',
      items: [
        { label: 'Payments', href: '/admin/payments', icon: CreditCard },
        { label: 'Customers', href: '/admin/customers', icon: Users },
        { label: 'Storefront CMS', href: '/admin/storefront', icon: Globe },
        { label: 'Staff & Roles', href: '/admin/staff', icon: Shield },
        { label: 'Store Settings', href: '/admin/settings', icon: Settings },
      ],
    },
  ];

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-[#1A1C18] text-[#D8D6CE] select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <Link to="/admin" className="flex items-center space-x-3">
          <img src="/logo.png" alt="ÉLAN" className="h-9 w-auto filter invert brightness-200" />
          <div>
            <span className="block text-xs uppercase tracking-luxury text-amber-200/80 font-medium">Administration</span>
          </div>
        </Link>
        <button
          onClick={() => setIsMobileSidebarOpen(false)}
          className="lg:hidden text-white/60 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* View Storefront Link */}
      <div className="px-4 pt-4">
        <Link
          to="/"
          target="_blank"
          className="flex items-center justify-between px-3 py-2 text-xs text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded border border-white/10 transition-colors"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5 ml-1" />
        </Link>
      </div>

      {/* Nav groups */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-6">
        {navGroups.map((group) => (
          <div key={group.group} className="space-y-1">
            <p className="px-3 text-[10px] uppercase tracking-luxury text-white/40 font-semibold mb-2">
              {group.group}
            </p>
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href || (item.href !== '/admin' && location.pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setIsMobileSidebarOpen(false)}
                  className={`flex items-center justify-between px-3 py-2 text-xs rounded transition-colors ${
                    isActive
                      ? 'bg-[#5B6955] text-white font-medium shadow-sm'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge ? (
                    <span className="bg-amber-500 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </div>
        ))}
      </div>

      {/* Active User profile & quick role switch */}
      <div className="p-4 border-t border-white/10 bg-black/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src={currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
              alt={currentUser?.name}
              className="w-8 h-8 rounded-full object-cover border border-white/20"
            />
            <div className="overflow-hidden">
              <p className="text-xs text-white font-medium truncate">{currentUser?.name}</p>
              <p className="text-[10px] text-amber-200/70 capitalize truncate">{currentUser?.role.replace(/_/g, ' ')}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out of Admin Console"
            className="p-1.5 text-white/50 hover:text-red-400 transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Role switcher for testing */}
        <div className="mt-3 pt-2 border-t border-white/10">
          <label className="text-[9px] uppercase tracking-luxury text-white/40 block mb-1">
            Simulate Role:
          </label>
          <select
            value={currentUser?.role}
            onChange={(e) => switchRole(e.target.value as any)}
            className="w-full text-[11px] bg-white/10 border border-white/20 text-white rounded px-2 py-1 outline-none"
          >
            <option value="super_admin" className="bg-[#1A1C18]">Super Admin (Full Access)</option>
            <option value="fulfillment_staff" className="bg-[#1A1C18]">Fulfillment & Dispatch</option>
            <option value="catalog_manager" className="bg-[#1A1C18]">Catalog & Merchandising</option>
            <option value="finance_staff" className="bg-[#1A1C18]">Finance & Refunds</option>
          </select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex bg-[#F8F7F3] text-[#20221F]">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 shadow-lg">
        <div className="sticky top-0 h-screen">
          <SidebarContent />
        </div>
      </aside>

      {/* Mobile Drawer */}
      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 z-50 shadow-2xl">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-[#E5E3DD] px-4 sm:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setIsMobileSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-stone-600 hover:text-black"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden sm:flex items-center text-xs text-stone-500 space-x-2">
              <span>ÉLAN Atelier Operations</span>
              <ChevronRight className="w-3.5 h-3.5" />
              <span className="font-medium text-stone-800 capitalize">
                {location.pathname.replace('/admin', '').replace('/', '') || 'Dashboard'}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 pointer-events-none" />
              <input
                type="text"
                placeholder="Search orders, SKU, customer..."
                className="pl-9 pr-4 py-1.5 text-xs bg-stone-100 border border-stone-200 rounded-full focus:outline-none focus:border-[#5B6955] w-64"
              />
            </div>
            <div className="relative">
              <button className="p-2 text-stone-500 hover:text-stone-800 transition-colors relative">
                <Bell className="w-4 h-4" />
                {pendingCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full" />
                )}
              </button>
            </div>
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-stone-800">{currentUser?.name}</p>
              <p className="text-[10px] text-stone-500 capitalize">{currentUser?.role.replace(/_/g, ' ')}</p>
            </div>
          </div>
        </header>

        {/* Child Views */}
        <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
