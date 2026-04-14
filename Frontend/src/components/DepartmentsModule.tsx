import React, { useState, useEffect } from 'react';
import { Building2, ChevronLeft, Loader2 } from 'lucide-react';
import { api } from '../services/api';
import { EmployeeCard } from './EmployeeCard';
import { Employee } from '../types';

interface Department {
  dept_no: string;
  dept_name: string;
}

interface DepartmentsModuleProps {
  onSelectEmployee: (id: number) => void;
}

export const DepartmentsModule: React.FC<DepartmentsModuleProps> = ({ onSelectEmployee }) => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDept, setSelectedDept] = useState<Department | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDepts = async () => {
      try {
        const data = await api.getDepartments();
        setDepartments(data);
      } catch (error) {
        console.error("Error al cargar departamentos:", error);
      }
    };
    fetchDepts();
  }, []);

  const handleDeptClick = async (dept: Department) => {
    setLoading(true);
    setEmployees([]);
    setSelectedDept(dept);
    
    try {
      const data = await api.getEmployeesByDept(dept.dept_no); 
      setEmployees(data.slice(0, 50));
    } catch (error) {
      console.error("Error al cargar empleados del depto:", error);
    } finally {
      setLoading(false);
    }
  };

  if (selectedDept) {
    return (
      <div className="p-4 space-y-6 animate-in fade-in duration-500">
        <button 
          onClick={() => {
            setSelectedDept(null);
            setEmployees([]);
          }}
          className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold p-2 bg-indigo-50 dark:bg-indigo-950/30 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/50 transition-colors"
        >
          <ChevronLeft size={20} /> VOLVER ATRÁS
        </button>

        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
            <h2 className="text-3xl font-black text-slate-900 dark:text-white italic uppercase">
            {selectedDept.dept_name}
            </h2>
            <span className="bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 px-3 py-1 rounded-full text-xs font-bold border border-slate-200 dark:border-slate-700">
                MOSTRANDO PRIMEROS 50
            </span>
        </div>

        {loading ? (
          <div className="flex flex-col items-center py-20">
            <Loader2 className="animate-spin text-indigo-500 w-12 h-12" />
            <p className="mt-4 font-bold text-slate-400">FILTRANDO PERSONAL...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map(emp => (
              <EmployeeCard 
                key={emp.emp_no} 
                employee={emp} 
                onClick={() => onSelectEmployee(emp.emp_no)} 
              />
            ))}
          </div>
        )}

        {employees.length === 0 && !loading && (
            <div className="text-center py-20 text-slate-400 dark:text-slate-500 font-bold">
                No se encontraron empleados activos en este departamento.
            </div>
        )}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
      {departments.map((dept) => (
        <div
          key={dept.dept_no}
          onClick={() => handleDeptClick(dept)}
          className="relative group bg-gray-100 dark:bg-slate-800 p-10 rounded-3xl border-2 border-slate-200 dark:border-slate-700 shadow-lg cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-400 hover:scale-[1.02] transition-all active:scale-95"
        >
          <div className="w-16 h-16 bg-indigo-600 text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-indigo-200 dark:shadow-none group-hover:rotate-6 transition-transform">
            <Building2 size={32} />
          </div>
          
          <h3 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {dept.dept_name}
          </h3>
          
          <p className="text-indigo-500 dark:text-indigo-400 font-mono font-bold mt-2">ID: {dept.dept_no}</p>
          
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
             <div className="bg-indigo-50 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400 p-2 rounded-full border border-indigo-100 dark:border-indigo-800">
                <ChevronLeft className="rotate-180" size={16} />
             </div>
          </div>
        </div>
      ))}
    </div>
  );
};