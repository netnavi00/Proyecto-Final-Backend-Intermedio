import React, { useState } from 'react';
import { Users, Building2, AlertCircle, LayoutDashboard, ChevronLeft, LogOut } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'employees', label: 'Empleados', icon: Users },
    { id: 'departments', label: 'Departamentos', icon: Building2 },
    { id: 'incidents', label: 'Incidencias', icon: AlertCircle },
  ];

  return (
    <aside className={cn(
      "flex flex-col h-screen sticky top-0 transition-all duration-300 ease-in-out relative z-50 border-r",
      // Light Mode: Azul medio más marcado (slate-200) | Dark Mode: Slate profundo
      "bg-slate-300/95 dark:bg-slate-950 border-slate-300 dark:border-slate-800 shadow-xl dark:shadow-none",
      isCollapsed ? "w-24" : "w-64"
    )}>
      
      {/* Botón de Colapso (Abajo y Más Grande) */}
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="absolute -right-5 bottom-8 w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center text-white border-4 border-slate-200 dark:border-slate-950 hover:bg-indigo-700 transition-colors z-50 shadow-xl"
      >
        <ChevronLeft className={cn(
          "w-6 h-6 transition-transform duration-300", 
          isCollapsed && "rotate-180"
        )} />
      </button>

      {/* Header / Logo */}
      <div className="p-6 border-b border-slate-300/50 dark:border-slate-800/50">
        <div className={cn("flex items-center gap-3 px-2", isCollapsed && "justify-center")}>
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20 shrink-0">
            <Users className="text-white w-6 h-6" />
          </div>
          {!isCollapsed && (
            <h1 className="text-xl font-black text-slate-900 dark:text-white tracking-tighter animate-in fade-in duration-300">
              Data<span className="text-indigo-500">Work</span>
            </h1>
          )}
        </div>
      </div>

      {/* Navegación */}
      <nav className="flex-1 px-4 py-6 space-y-2">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            title={isCollapsed ? item.label : ""}
            className={cn(
              "w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-200 group",
              isCollapsed && "justify-center px-0",
              activeTab === item.id
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                : "text-slate-700 dark:text-slate-400 hover:bg-slate-300/50 dark:hover:bg-slate-900 hover:text-indigo-700 dark:hover:text-white"
            )}
          >
            <item.icon className={cn(
              "w-5 h-5 transition-colors shrink-0",
              activeTab === item.id ? "text-white" : "text-slate-500 group-hover:text-indigo-700 dark:group-hover:text-white"
            )} />
            {!isCollapsed && (
              <span className="font-bold tracking-tight animate-in fade-in slide-in-from-left-2 duration-300">
                {item.label}
              </span>
            )}
          </button>
        ))}
      </nav>

    </aside>
  );
};