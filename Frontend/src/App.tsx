import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { WeatherWidget } from './components/WeatherWidget';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeDetailView } from './components/EmployeeDetailView';
import { IncidentsModule } from './components/IncidentsModule';
import { DepartmentsModule } from './components/DepartmentsModule'; 
import { api } from './services/api';
import { Employee, EmployeeDetail, Department } from './types.js';
import { Users, Building2, AlertCircle, TrendingUp, Loader2, DollarSign, Gift, ChevronRight, ChevronLeft, PersonStanding, Sun, Moon } from 'lucide-react';
import { NewsWidget } from './components/NewsWidget'; 
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, AreaChart, Area } from 'recharts';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [incidentsCount, setIncidentsCount] = useState(0); 
  const [dashboardView, setDashboardView] = useState('distribucion');
  const [growthCardView, setGrowthCardView] = useState<'antiguedad' | 'genero'>('antiguedad');
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [darkMode, setDarkMode] = useState(() => {
  const savedMode = localStorage.getItem('theme');
    return savedMode === 'dark' || (!savedMode && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  // Efecto para aplicar el tema oscuro o claro según la preferencia del usuario
  useEffect(() => {
  if (darkMode) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
  }, [darkMode]);

  // Función para cargar datos de empleados, departamentos e incidencias
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [empRes, deptRes, incidentsRes] = await Promise.all([
        api.getEmployees(),
        api.getDepartments(),
        api.getIncidencias().catch(() => []) 
      ]);
      
      setEmployees(empRes || []); 
      setDepartments(deptRes || []);
      setIncidentsCount(incidentsRes?.length || 0);
      setError(null);
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);
// Efecto para cargar los datos al montar el componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const calcularAntiguedadPromedio = () => {
    if (employees.length === 0) return "0 años";
    const hoy = new Date();
    const totalMeses = employees.reduce((acc, emp) => {
      const inicio = new Date(emp.hire_date);
      return acc + (hoy.getFullYear() - inicio.getFullYear()) * 12 + (hoy.getMonth() - inicio.getMonth());
    }, 0);
    return `${(totalMeses / employees.length / 12).toFixed(1)} años`;
  };

  const hombres = employees.filter(e => e.gender?.toLowerCase() === 'male' || e.gender?.toLowerCase() === 'm').length;
  const mujeres = employees.length - hombres;
  const porcentajeHombres = employees.length > 0 ? ((hombres / employees.length) * 100).toFixed(0) : 0;
  const porcentajeMujeres = employees.length > 0 ? (100 - Number(porcentajeHombres)).toFixed(0) : 0;

  const dataDepto = departments.map(dept => ({
    name: dept.dept_name,
    cantidad: employees.filter(emp => emp.department === dept.dept_name).length,
  })).filter(d => d.cantidad > 0);

  const dataNomina = departments.map(dept => ({
    name: dept.dept_name,
    gasto: employees
      .filter(emp => emp.department === dept.dept_name)
      .reduce((acc, emp) => acc + Number(emp.salary || 0), 0),
  })).filter(d => d.gasto > 0);

  const proximosAniversarios = employees
    .filter(emp => emp.hire_date && new Date(emp.hire_date).getMonth() === new Date().getMonth())
    .slice(0, 5);

  const mxnFormatter = new Intl.NumberFormat('es-MX', {
    style: 'currency', currency: 'MXN', maximumFractionDigits: 0
  });

  const handleSelectEmployee = async (id: number) => {
    try {
      setLoading(true);
      const data = await api.getEmployeeById(id);
      if (data) { setSelectedEmployee(data); setActiveTab('employee-detail'); }
    } catch (error) { alert("Error al cargar perfil"); } 
    finally { setLoading(false); }
  };

  const renderContent = () => {
    if (loading && !employees.length) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-600 dark:text-slate-400 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="font-bold">Sincronizando panel corporativo...</p>
        </div>
      );
    }


    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-8 animate-in fade-in duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Empleados" value={employees.length} icon={Users} color="bg-blue-500" />
              <StatCard title="Departamentos" value={departments.length} icon={Building2} color="bg-purple-500" />
              <StatCard title="Nuevas Incidencias" value={incidentsCount} icon={AlertCircle} color="bg-amber-500" />
              
              <div className="relative group bg-gray-100  dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all hover:-translate-y-1 hover:shadow-md h-[102px]">
                <div className="absolute top-3 right-3 flex gap-1 bg-white/70 dark:bg-slate-900/70 backdrop-blur-sm p-1 rounded-lg border border-slate-200 dark:border-slate-700 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => setGrowthCardView(growthCardView === 'antiguedad' ? 'genero' : 'antiguedad')}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-emerald-600"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <button 
                    onClick={() => setGrowthCardView(growthCardView === 'antiguedad' ? 'genero' : 'antiguedad')}
                    className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded text-slate-400 hover:text-emerald-600"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>

                {growthCardView === 'antiguedad' ? (
                  <div className="p-6 flex items-center gap-4 h-full">
                    <div className="bg-emerald-500 w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shrink-0">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-0.5">Estabilidad (Promedio)</p>
                      <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{calcularAntiguedadPromedio()}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex h-full w-full">
                    <div className="flex-1 bg-blue-100 dark:bg-blue-900/90 p-4 flex flex-col justify-center border-r border-slate-100 dark:border-slate-700">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 bg-white dark:bg-slate-700 rounded-md text-blue-600 border border-blue-100 dark:border-blue-900/50">
                          <PersonStanding size={12} />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Hombres</p>
                      </div>
                      <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{porcentajeHombres}%</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">{hombres} Pers.</p>
                    </div>

                    <div className="flex-1 bg-pink-100/100 dark:bg-pink-900/80 p-4 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="p-1 bg-white dark:bg-slate-700 rounded-md text-pink-600 border border-pink-100 dark:border-pink-900/50">
                          <PersonStanding size={12} className="rotate-180" />
                        </div>
                        <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tight">Mujeres</p>
                      </div>
                      <p className="text-xl font-black text-slate-900 dark:text-white leading-none">{porcentajeMujeres}%</p>
                      <p className="text-[9px] text-slate-400 font-bold mt-1 uppercase">{mujeres} Pers.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 bg-gray-100 dark:bg-slate-800 p-8 rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col h-[500px]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">Resumen Operativo</h3>
                    <p className="text-sm text-slate-500 font-medium italic">Análisis de capital humano</p>
                  </div>

                  <div className="flex bg-slate-100 dark:bg-slate-900 p-1 rounded-2xl gap-1">
                    {[
                      { id: 'distribucion', label: 'Personal', icon: Users },
                      { id: 'nomina', label: 'Nómina', icon: DollarSign },
                      { id: 'aniversarios', label: 'Eventos', icon: Gift }
                    ].map((tab) => (
                      <button
                        key={tab.id}
                        onClick={() => setDashboardView(tab.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                          dashboardView === tab.id 
                            ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                      >
                        <tab.icon size={14} />
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex-1 min-h-[300px] w-full">
                  {dashboardView === 'distribucion' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dataDepto}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#334155" : "#e2e8f0"} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: darkMode ? '#94a3b8' : '#475569', fontSize: 12}} />
                        <YAxis hide />
                        <Tooltip cursor={{fill: darkMode ? '#1e293b' : '#f1f5f9'}} contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000' }} />
                        <Bar dataKey="cantidad" fill="#4f46e5" radius={[10, 10, 0, 0]} barSize={40} />
                      </BarChart>
                    </ResponsiveContainer>
                  )}

                  {dashboardView === 'nomina' && (
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dataNomina}>
                        <defs>
                          <linearGradient id="colorGasto" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={darkMode ? "#334155" : "#e2e8f0"} />
                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: darkMode ? '#94a3b8' : '#475569', fontSize: 12}} />
                        <YAxis axisLine={false} tickLine={false} tick={{fill: darkMode ? '#94a3b8' : '#475569', fontSize: 11}} tickFormatter={(v) => mxnFormatter.format(v)} />
                        <Tooltip 
                          formatter={(val: any) => [mxnFormatter.format(Number(val)), "Costo Nómina"]}
                          contentStyle={{ borderRadius: '12px', border: 'none', backgroundColor: darkMode ? '#1e293b' : '#fff', color: darkMode ? '#fff' : '#000' }}
                        />
                        <Area type="monotone" dataKey="gasto" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorGasto)" strokeWidth={3} />
                      </AreaChart>
                    </ResponsiveContainer>
                  )}

                  {dashboardView === 'aniversarios' && (
                    <div className="space-y-4 overflow-y-auto h-full pr-2 custom-scrollbar">
                      {proximosAniversarios.map((emp, i) => (
                        <div key={i} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200 dark:border-slate-700">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 font-bold text-indigo-600 dark:text-indigo-400">
                              {emp.first_name[0]}{emp.last_name[0]}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{emp.first_name} {emp.last_name}</p>
                              <p className="text-[10px] text-slate-500 font-medium italic">Aniversario Laboral</p>
                            </div>
                          </div>
                          <div className="text-xs font-black text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-lg">
                             {new Date(emp.hire_date).toLocaleDateString('es-MX', { day: '2-digit', month: 'short' })}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="lg:col-span-1 h-[500px]">
                <NewsWidget />
              </div>
            </div>
          </div>
        );
      case 'employees': return <EmployeeTable employees={employees} onSelectEmployee={handleSelectEmployee} />;
      case 'employee-detail': return <EmployeeDetailView employee={selectedEmployee} onBack={() => setActiveTab('employees')} onUpdate={fetchData} />;
      case 'departments': return <DepartmentsModule onSelectEmployee={handleSelectEmployee} />;
      case 'incidents': return <IncidentsModule onUpdate={fetchData} />;
      default: return null;
    }
  };

  return (
    <div className={`${darkMode ? 'dark' : ''}`}>
      <div className="flex min-h-screen bg-slate-50 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 flex flex-col">
          <header className="h-20 px-8 flex items-center justify-between sticky top-0 bg-slate-100/80 dark:bg-slate-900/80 backdrop-blur-md z-10 border-b border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-4">
              <div>
                <h2 className="text-xs font-black text-slate-500 uppercase tracking-widest">Management System</h2>
                <p className="text-xl font-bold text-slate-800 dark:text-white capitalize">{activeTab}</p>
              </div>
              {/* Botón de Dark Mode */}
              <button 
                onClick={() => setDarkMode(!darkMode)}
                className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-yellow-400 hover:scale-110 transition-all"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
            <WeatherWidget />
          </header>
          <div className="p-8 max-w-[1600px] mx-auto w-full">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}

// Componente reutilizable para mostrar estadísticas en el dashboard
function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-gray-100 dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-center gap-4 hover:shadow-md transition-all hover:-translate-y-1 h-[102px]">
      <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-600 dark:text-slate-400 mb-0.5">{title}</p>
        <p className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{value}</p>
      </div>
    </div>
  );
}