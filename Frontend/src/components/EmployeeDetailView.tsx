import React, { useState } from 'react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { 
  ArrowLeft, 
  Briefcase, 
  Calendar, 
  DollarSign, 
  Camera, 
  Trash2, 
  Loader2,
  Building2 
} from 'lucide-react';
import { EmployeeDetail } from '../types.js';
import { api } from '../services/api';

interface EmployeeDetailViewProps {
  employee: EmployeeDetail | null;
  onBack: () => void;
  onUpdate: () => void;
}

export const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = ({ employee, onBack, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = 'http://localhost:3000';

  if (!employee || !employee.personal) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500 dark:text-slate-400">
        <Loader2 className="animate-spin mb-4 text-indigo-600 dark:text-indigo-400" />
        <p className="font-medium">Cargando información del perfil...</p>
      </div>
    );
  }

  const { personal } = employee;
  const safeSalaries = Array.isArray(employee.salaries) ? employee.salaries : [];
  const safePuestos = Array.isArray(employee.puestos) ? employee.puestos : [];

  const avatarUrl = personal.photo_url 
    ? `${BACKEND_URL}${personal.photo_url}` 
    : `https://api.dicebear.com/7.x/initials/svg?seed=${personal.first_name}%20${personal.last_name}&backgroundColor=4f46e5,6366f1,818cf8&fontFamily=Arial,sans-serif&bold=true`;

  const salaryData = [...safeSalaries].reverse().map(s => ({
    fecha: new Date(s.from_date).toLocaleDateString('es-MX', { year: 'numeric', month: 'short' }),
    salario: s.salary
  }));

  const currentTitle = safePuestos[0]?.title || 'Sin puesto asignado';

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setLoading(true);
      await api.uploadEmployeePhoto(personal.emp_no, file);
      onUpdate();
    } catch (err) {
      console.error(err);
      alert("Error al subir la foto");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Estás seguro de que deseas eliminar la foto de perfil?")) return;
    try {
      setLoading(true);
      await api.deleteEmployeePhoto(personal.emp_no);
      onUpdate();
    } catch (err) {
      console.error(err);
      alert("Error al eliminar la foto");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors font-medium group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        Volver al listado
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLUMNA IZQUIERDA: Card de Perfil */}
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 flex flex-col items-center">
          
          <div className="relative">
            <div className="w-32 h-32 bg-slate-100 dark:bg-slate-900 rounded-[2.5rem] overflow-hidden border-4 border-white dark:border-slate-800 shadow-2xl ring-1 ring-slate-200 dark:ring-slate-700 flex items-center justify-center">
              {loading ? (
                <Loader2 className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-spin" />
              ) : (
                <img 
                  src={avatarUrl} 
                  alt="Perfil" 
                  className="w-full h-full object-cover" 
                />
              )}
            </div>

            <div className="absolute -bottom-2 -right-2 flex gap-2">
              <label className="bg-indigo-600 text-white p-2.5 rounded-2xl cursor-pointer hover:bg-indigo-700 shadow-lg transition-transform hover:scale-110 active:scale-95">
                <Camera size={18} />
                <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={loading} />
              </label>

              {personal.photo_url && (
                <button 
                  onClick={handleDelete}
                  disabled={loading}
                  className="bg-red-500 text-white p-2.5 rounded-2xl hover:bg-red-600 shadow-lg transition-transform hover:scale-110 active:scale-95"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </div>
          </div>

          <div className="text-center space-y-3 w-full">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white truncate">
                {personal.first_name} {personal.last_name}
            </h2>
            
            <div className="flex flex-col items-center gap-2">
              <span className="text-indigo-600 dark:text-indigo-400 font-semibold bg-indigo-50 dark:bg-indigo-900/30 px-4 py-1 rounded-full text-xs uppercase tracking-wider border border-indigo-100 dark:border-indigo-800">
                {currentTitle}
              </span>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-600">
                <Building2 size={12} className="text-slate-400 dark:text-slate-500" />
                {personal.department || 'Sin oficina'}
              </div>
            </div>
          </div>

          <div className="w-full space-y-4 pt-6 border-t border-slate-100 dark:border-slate-700">
            <InfoRow icon={Briefcase} label="ID Empleado" value={`#${personal.emp_no}`} />
            <InfoRow icon={Calendar} label="Contratado el" value={personal.hire_date ? new Date(personal.hire_date).toLocaleDateString() : 'N/A'} />
            <InfoRow 
              icon={DollarSign} 
              label="Salario Actual" 
              value={safeSalaries[0] ? `$${Number(safeSalaries[0].salary).toLocaleString()}` : '---'} 
            />
          </div>
        </div>

        {/* COLUMNA DERECHA: Gráfica de Historial */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col min-h-[450px]">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">Historial Salarial</h3>
            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">Evolución de ingresos en la compañía</p>
          </div>
          
          <div className="flex-1 w-full h-full">
            {salaryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salaryData}>
                      <defs>
                        <linearGradient id="colorSalario" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.15}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#94a3b8" strokeOpacity={0.2} />
                      <XAxis 
                        dataKey="fecha" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        dy={10} 
                      />
                      <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: '#94a3b8', fontSize: 12 }} 
                        tickFormatter={(v) => `$${v/1000}k`} 
                      />
                      <Tooltip 
                          contentStyle={{ 
                            borderRadius: '16px', 
                            border: 'none', 
                            backgroundColor: 'rgba(30, 41, 59, 0.9)', 
                            color: '#fff',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', 
                            padding: '12px' 
                          }}
                          itemStyle={{ color: '#818cf8' }}
                          formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Salario']}
                      />
                      <Area 
                        type="monotone" 
                        dataKey="salario" 
                        stroke="#4f46e5" 
                        strokeWidth={3} 
                        fillOpacity={1} 
                        fill="url(#colorSalario)" 
                        animationDuration={1500} 
                      />
                  </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-500 italic bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border-2 border-dashed border-slate-100 dark:border-slate-700">
                    <DollarSign size={40} className="mb-2 opacity-20" />
                    No hay datos salariales registrados
                </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

function InfoRow({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 group-hover:text-slate-500 dark:group-hover:text-slate-300 transition-colors">
        <Icon size={16} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{value}</span>
    </div>
  );
}