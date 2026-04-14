import React from 'react';
import { User, Briefcase, Building2, Calendar } from 'lucide-react';
import { Employee } from '../types';

interface EmployeeCardProps {
  employee: Employee;
  onClick: (emp: Employee) => void;
}

export const EmployeeCard: React.FC<EmployeeCardProps> = ({ employee, onClick }) => {
  // Construimos la URL completa para la foto si existe
  const imageUrl = employee.photo_url 
    ? `http://localhost:3000${employee.photo_url}` 
    : null;

  return (
    <div 
      onClick={() => onClick(employee)}
      className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group animate-in fade-in zoom-in duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Foto de Perfil */}
        <div className="relative">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={employee.first_name}
              className="w-16 h-16 rounded-2xl object-cover ring-2 ring-slate-100 group-hover:ring-indigo-100 transition-all"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-500 transition-all">
              <User size={32} />
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>

        {/* Información Principal */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
            {employee.first_name} {employee.last_name}
          </h3>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Briefcase size={12} className="text-slate-400" />
            <p className="text-sm text-slate-500 font-medium truncate italic">
              {employee.puesto || 'Puesto no asignado'}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-5 space-y-2.5">
        {/* DEPARTAMENTO: Resaltado con estilo de etiqueta */}
        <div className="flex items-center gap-2 text-sm">
          <div className="p-1.5 bg-slate-50 rounded-lg group-hover:bg-indigo-50 transition-colors">
            <Building2 size={14} className="text-slate-400 group-hover:text-indigo-500" />
          </div>
          <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded-md text-xs font-black uppercase tracking-wider">
            {employee.department || 'Sin oficina'}
          </span>
        </div>

        {/* Fecha de Ingreso */}
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <div className="p-1.5 bg-slate-50 rounded-lg">
            <Calendar size={14} className="text-slate-400" />
          </div>
          <span className="text-xs font-medium">
            Ingreso: {new Date(employee.hire_date).toLocaleDateString('es-ES', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
        <span className="text-[10px] font-mono font-bold text-slate-300 uppercase">Ref: #{employee.emp_no}</span>
        <div className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:gap-2 transition-all">
          <span>VER PERFIL</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
};