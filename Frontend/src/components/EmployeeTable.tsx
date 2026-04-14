import React, { useState } from 'react';
import { Search, User, ChevronRight, Briefcase, DollarSign, Calendar, Building2 } from 'lucide-react';
import { Employee } from '../types.js';
import { cn } from '../lib/utils';

interface EmployeeTableProps {
  employees: Employee[];
  onSelectEmployee: (id: number) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onSelectEmployee }) => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const BACKEND_URL = 'http://localhost:3000';

  const filteredEmployees = employees.filter(emp => 
    `${emp.first_name} ${emp.last_name}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.emp_no.toString().includes(searchTerm)
  );

  const formatDate = (dateStr: string | undefined) => {
    if (!dateStr) return "N/A";
    try {
      const cleanDate = dateStr.split('T')[0];
      const [year, month, day] = cleanDate.split('-');
      if (!year || !month || !day) return dateStr;
      return `${day}/${month}/${year}`;
    } catch (error) {
      return "Fecha Inválida";
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Buscar por nombre o ID de empleado..."
          className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Nombre Completo</th>
                {/* COLUMNA NUEVA */}
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Departamento</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Contratación</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Puesto</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Salario</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map((emp) => (
                <tr 
                  key={emp.emp_no} 
                  className="hover:bg-slate-50/50 transition-colors cursor-pointer group"
                  onClick={() => onSelectEmployee(emp.emp_no)}
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono font-medium text-slate-600">#{emp.emp_no}</span>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 overflow-hidden flex items-center justify-center border border-slate-200 shadow-sm group-hover:border-indigo-200 transition-all">
                        {emp.photo_url ? (
                          <img 
                            src={`${BACKEND_URL}${emp.photo_url}`} 
                            alt={`${emp.first_name}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = ''; 
                                (e.target as HTMLImageElement).className = 'hidden';
                            }}
                          />
                        ) : (
                          <User className="w-5 h-5 text-slate-400" />
                        )}
                      </div>
                      <span className="text-sm font-bold text-slate-800">
                        {emp.first_name} {emp.last_name}
                      </span>
                    </div>
                  </td>

                  {/* CELDA DE DEPARTAMENTO */}
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-bold uppercase tracking-wider">
                        {emp.department || 'Sin Depto'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-sm text-slate-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {formatDate(emp.hire_date)}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-sm text-slate-700 font-medium capitalize">
                        {emp.puesto || 'sin título'} 
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1 text-emerald-600 font-bold text-sm">
                      <DollarSign className="w-3.5 h-3.5" />
                      <span>
                        {emp.salary 
                          ? Number(emp.salary).toLocaleString('es-MX') 
                          : '---'}
                      </span>
                    </div>
                  </td>

                  <td className="px-6 py-4 text-right">
                    <div className="inline-flex p-2 text-slate-300 group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-xl transition-all">
                      <ChevronRight className="w-5 h-5" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="p-12 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-400 mb-4">
              <Search className="w-6 h-6" />
            </div>
            <p className="text-slate-500 font-medium">No se encontraron empleados con ese criterio.</p>
          </div>
        )}
      </div>
    </div>
  );
};