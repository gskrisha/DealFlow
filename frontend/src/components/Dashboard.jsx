// frontend/src/components/Dashboard.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  Bell,
  Settings,
  LogOut,
  Home,
  Search,
  ListChecks,
  Mail,
  Cpu,
  Grid,
  Menu,
  X
} from 'lucide-react';

import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

import { DiscoveryFeed } from './DiscoveryFeed';
import { DealTracker } from './DealTracker';
import { OutreachCenter } from './OutreachCenter';
import { Intelligence } from './Intelligence';
import { OverviewDashboard } from './OverviewDashboard';
import { ThesisSettings } from './ThesisSettings';
import { Dashboard as InFlowDashboard } from './in Flow/Dashboard';

const SIDEBAR_ITEMS = [
  { key: 'overview', label: 'Overview', icon: Home },
  { key: 'discovery', label: 'Discovery', icon: Search },
  { key: 'tracker', label: 'Deal Tracker', icon: ListChecks },
  { key: 'outreach', label: 'Outreach', icon: Mail },
  { key: 'inflow', label: 'In Bound', icon: Grid },
  { key: 'intelligence', label: 'Intelligence', icon: Cpu },
];

export function Dashboard({ onBack, onReconfigure, onLogout }) {
  const [activeTab, setActiveTab] = useState('overview');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Get user data from localStorage
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const initials = userData.name
    ? userData.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'JD';

  // Motion presets
  const fadeIn = { initial: { opacity: 0, y: 6 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.28 } };
  const itemHover = { scale: 1.02, transition: { duration: 0.12 } };

  // small helper to render the main content area for each tab
  const renderTab = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'discovery':
        return <DiscoveryFeed />;
      case 'tracker':
        return <DealTracker />;
      case 'outreach':
        return <OutreachCenter />;
      case 'inflow':
        return <InFlowDashboard />;
      case 'intelligence':
        return <Intelligence />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="h-screen flex bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-slate-50 to-white overflow-hidden">
      {/* Sidebar (desktop) */}
      <aside className={`hidden md:flex flex-col w-72 p-4 gap-4 border-r bg-white/60 backdrop-blur-sm h-screen overflow-y-auto scroll-smooth`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md"
              style={{ background: 'linear-gradient(90deg,#06b6d4,#7c3aed)' }}
            >
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-lg font-semibold">flowFound</div>
              <div className="text-xs text-slate-400">AI Deal Flow</div>
            </div>
          </div>

          <Button variant="ghost" size="icon" onClick={onBack} title="Back to Home">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </div>

        <nav className="flex-1">
          <ul className="flex flex-col gap-2 mt-3">
            {SIDEBAR_ITEMS.map((item) => {
              const Icon = item.icon;
              const active = activeTab === item.key;
              return (
                <motion.li
                  key={item.key}
                  whileHover={itemHover}
                  onClick={() => { setActiveTab(item.key); }}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer select-none ${
                    active
                      ? 'bg-linear-to-r from-indigo-600 to-violet-600 text-white shadow-lg'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-md flex items-center justify-center ${active ? 'bg-white/20' : 'bg-slate-100'}`}>
                    <Icon className={`w-4 h-4 ${active ? 'text-white' : 'text-slate-600'}`} />
                  </div>
                  <div className="flex-1 text-sm font-medium">{item.label}</div>
                  {item.key === 'discovery' && (
                    <Badge className={`text-xs ${active ? 'bg-white/20 text-white' : 'bg-blue-50 text-blue-700'}`}>23</Badge>
                  )}
                </motion.li>
              );
            })}
          </ul>
        </nav>

        <div>
          <div className="flex items-center gap-3 px-1">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm"
                  style={{
                    background: 'linear-gradient(90deg,#10b981,#6366f1)',
                    boxShadow: '0 6px 18px rgba(99,102,241,0.12)'
                  }}
                >
                  {initials}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">{userData.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{userData.email || 'user@example.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                  <Settings className="mr-2" />
                  Fund Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <div className="flex-1">
              <div className="text-xs text-slate-500">Signed in as</div>
              <div className="text-sm font-medium">{userData.name || 'Demo User'}</div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setSettingsOpen(true)}>Reconfigure Thesis</Button>
            <Button size="sm" variant="ghost" onClick={onLogout}>Sign out</Button>
          </div>
        </div>
      </aside>

      {/* Mobile top bar + collapsible sidebar */}
      <div className="md:hidden w-full fixed bottom-4 left-0 px-4 z-40">
        <div className="bg-white/80 backdrop-blur-md border rounded-2xl p-2 flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2">
            <button
              className="p-2 rounded-md bg-slate-50"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Open menu"
            >
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <div className="text-sm font-semibold">flowFound</div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 rounded-md bg-slate-50" onClick={() => setActiveTab('discovery')}>
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-md bg-slate-50" onClick={() => setActiveTab('outreach')}>
              <Mail className="w-5 h-5" />
            </button>
            <button className="p-2 rounded-md bg-slate-50" onClick={onBack}>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* floating mobile menu */}
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-x-4 bottom-20 bg-white/95 rounded-2xl p-3 shadow-lg border"
          >
            <ul className="flex flex-col gap-2">
              {SIDEBAR_ITEMS.map((it) => {
                const Icon = it.icon;
                return (
                  <li key={it.key}>
                    <button
                      onClick={() => { setActiveTab(it.key); setSidebarOpen(false); }}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg ${activeTab === it.key ? 'bg-indigo-600 text-white' : 'hover:bg-slate-50'}`}
                    >
                      <Icon className="w-5 h-5" />
                      <div className="flex-1 text-left">{it.label}</div>
                      {it.key === 'discovery' && <Badge className="text-xs bg-blue-50 text-blue-700">23</Badge>}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </div>

      {/* Main content area */}
      <div className="flex-1 overflow-y-auto h-screen scroll-smooth">
        <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3">
              <h2 className="text-2xl font-semibold capitalize">{SIDEBAR_ITEMS.find(s => s.key === activeTab)?.label}</h2>
              <span className="text-sm text-slate-400">· AI Deal Flow</span>
            </div>

            <div className="flex items-center gap-2 md:ml-4">
              <Button variant="ghost" size="icon" onClick={() => setActiveTab('discovery')}>
                <Search className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Bell className="w-4 h-4" />
                <span className="absolute top-2 right-8 inline-flex w-2 h-2 bg-red-500 rounded-full ring-1 ring-white" />
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => setActiveTab('overview')}>
              <Sparkles className="w-4 h-4" />
            </Button>

            <Button variant="ghost" size="icon" onClick={() => setSettingsOpen(true)}>
              <Settings className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white"
                  style={{ background: 'linear-gradient(90deg,#10b981,#6366f1)' }}
                >
                  {initials}
                </button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm">{userData.name || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{userData.email || 'user@example.com'}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setSettingsOpen(true)}>
                  <Settings className="mr-2" />
                  Fund Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={onLogout} className="text-red-600">
                  <LogOut className="mr-2" />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Animated content wrapper */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          {renderTab()}
        </motion.div>
        </div>
        <footer className="border-t py-3 px-6 flex items-center justify-between text-sm text-white bg-[#762afd]">
          <div>© {new Date().getFullYear()} flowFound — AI-Powered Deal Flow</div>
          <div className="flex gap-4">
            <button className="hover:text-slate-700">Privacy</button>
            <button className="hover:text-slate-700">Terms</button>
            <button className="hover:text-slate-700" onClick={() => setSettingsOpen(true)}>Settings</button>
          </div>
        </footer>
      </div>
        
      {/* Thesis Settings dialog */}
      <ThesisSettings
        open={settingsOpen}
        onOpenChange={setSettingsOpen}
        onReconfigure={() => {
          // bubble up
          setSettingsOpen(false);
          if (onReconfigure) onReconfigure();
        }}
      />
    </div>
  );
}

export default Dashboard;
