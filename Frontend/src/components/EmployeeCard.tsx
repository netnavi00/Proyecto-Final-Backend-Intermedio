import React from 'react';
import { Briefcase, Building2, Calendar } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  onClick: (emp: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  // Lógica de Imagen
  const imageUrl = employee.photo_url 
    ? `http://localhost:3000${employee.photo_url}` 
    : `https://api.dicebear.com/7.x/initials/svg?seed=${employee.first_name}%20${employee.last_name}&backgroundColor=4f46e5,6366f1,818cf8&fontFamily=Arial,sans-serif&bold=true`;

  return (
    <div 
      onClick={() => onClick(employee)}
      className="bg-white dark:bg-slate-800 rounded-2xl p-5 border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-indigo-300 dark:hover:border-indigo-500/50 transition-all cursor-pointer group animate-in fade-in zoom-in duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Contenedor de la Foto */}
        <div className="relative">
          <img 
            src={imageUrl} 
            alt={employee.first_name}
            className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 dark:ring-slate-700 group-hover:ring-indigo-100 dark:group-hover:ring-indigo-500/30 transition-all shadow-inner"
          />
        </div>

        {/* Información Principal */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {employee.first_name} {employee.last_name}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Briefcase size={12} className="text-slate-400 dark:text-slate-500" />
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium truncate italic">
              {employee.puesto || 'Puesto no asignado'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {/* DEPARTAMENTO */}
        <div className="flex items-center gap-2 text-sm">
          <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg group-hover:bg-indigo-50 dark:group-hover:bg-indigo-900/50 transition-colors">
            <Building2 size={14} className="text-slate-400 dark:text-slate-500 group-hover:text-indigo-500 dark:group-hover:text-indigo-400" />
          </div>
          <span className="px-2.5 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-md text-xs font-black uppercase tracking-wider border border-transparent dark:border-indigo-800/50">
            {employee.department || 'Sin oficina'}
          </span>
        </div>

        {/* FECHA DE INGRESO */}
        <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
          <div className="p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <Calendar size={14} className="text-slate-400 dark:text-slate-500" />
          </div>
          <span className="text-xs font-medium">
            Ingreso: {employee.hire_date ? new Date(employee.hire_date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            }) : '---'}
          </span>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
        <span className="text-[10px] font-mono font-bold text-slate-300 dark:text-slate-600 uppercase">Ref: #{employee.emp_no}</span>
        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
          <span>VER PERFIL</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
};