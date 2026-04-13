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
  User, 
  Camera, 
  Trash2, 
  Loader2 
} from 'lucide-react';
import { EmployeeDetail } from '../types.js';
import { api } from '../services/api';

interface EmployeeDetailViewProps {
  employee: EmployeeDetail;
  onBack: () => void;
  onUpdate: () => void;
}

export const EmployeeDetailView: React.FC<EmployeeDetailViewProps> = ({ employee, onBack, onUpdate }) => {
  const [loading, setLoading] = useState(false);
  const BACKEND_URL = 'http://localhost:3000';

  // --- PROTECCIÓN DE DATOS ---
  // Nos aseguramos de que salaries y puestos sean arrays, si no, usamos vacíos
  const safeSalaries = Array.isArray(employee.salaries) ? employee.salaries : [];
  const safePuestos = Array.isArray(employee.puestos) ? employee.puestos : [];

  // Invertimos el array para la gráfica (de más antiguo a más reciente)
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
      await api.uploadEmployeePhoto(employee.personal.emp_no, file);
      onUpdate(); // Refresca los datos en App.tsx
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
      await api.deleteEmployeePhoto(employee.personal.emp_no);
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
        className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver al listado
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Card de Perfil */}
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6 flex flex-col items-center">
          
          <div className="relative">
            <div className="w-32 h-32 bg-slate-100 rounded-[2.5rem] overflow-hidden border-4 border-white shadow-2xl ring-1 ring-slate-200 flex items-center justify-center">
              {loading ? (
                <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              ) : employee.personal.photo_url ? (
                <img 
                  src={`${BACKEND_URL}${employee.personal.photo_url}`} 
                  alt="Perfil" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <User className="w-16 h-16 text-slate-300" />
              )}
            </div>

            {/* Botones Flotantes */}
            <div className="absolute -bottom-2 -right-2 flex gap-2">
              <label className="bg-indigo-600 text-white p-2.5 rounded-2xl cursor-pointer hover:bg-indigo-700 shadow-lg transition-transform hover:scale-110 active:scale-95">
                <Camera size={18} />
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleUpload} 
                  disabled={loading}
                />
              </label>

              {employee.personal.photo_url && (
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

          <div className="text-center">
            <h2 className="text-2xl font-bold text-slate-900">
                {employee.personal.first_name} {employee.personal.last_name}
            </h2>
            <p className="text-indigo-600 font-semibold bg-indigo-50 px-4 py-1 rounded-full inline-block mt-2 text-sm uppercase tracking-wider">
              {currentTitle}
            </p>
          </div>

          <div className="w-full space-y-4 pt-6 border-t border-slate-100">
            <InfoRow icon={Briefcase} label="ID Empleado" value={`#${employee.personal.emp_no}`} />
            <InfoRow icon={Calendar} label="Contratado el" value={new Date(employee.personal.hire_date).toLocaleDateString()} />
            <InfoRow icon={DollarSign} label="Salario Actual" value={safeSalaries[0] ? `$${safeSalaries[0].salary.toLocaleString()}` : '---'} />
          </div>
        </div>

        {/* Gráfica de Historial Salarial */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900">Historial Salarial</h3>
            <p className="text-sm text-slate-400">Evolución de ingresos en la compañía</p>
          </div>
          
          <div className="flex-1 min-h-[300px]">
            {salaryData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={salaryData}>
                        <defs>
                        <linearGradient id="colorSalario" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="fecha" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
                        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${v/1000}k`} />
                        <Tooltip 
                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                            formatter={(value: any) => [`$${Number(value).toLocaleString()}`, 'Salario']}
                        />
                        <Area type="monotone" dataKey="salario" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorSalario)" animationDuration={1500} />
                    </AreaChart>
                </ResponsiveContainer>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 italic">
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
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-slate-400">
        <Icon size={16} />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold text-slate-700">{value}</span>
    </div>
  );
}