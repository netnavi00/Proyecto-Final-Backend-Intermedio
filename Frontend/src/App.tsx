import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar } from './components/Sidebar';
import { WeatherWidget } from './components/WeatherWidget';
import { EmployeeTable } from './components/EmployeeTable';
import { EmployeeDetailView } from './components/EmployeeDetailView';
import { IncidentsModule } from './components/IncidentsModule';
// --- IMPORTACIÓN CRUCIAL ---
import { DepartmentsModule } from './components/DepartmentsModule'; 
import { api } from './services/api';
import { Employee, EmployeeDetail, Department } from './types.js';
import { Users, Building2, AlertCircle, TrendingUp, Loader2 } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [empRes, deptRes] = await Promise.all([
        api.getEmployees(),
        api.getDepartments()
      ]);
      setEmployees(empRes); 
      setDepartments(deptRes);
      setError(null);
    } catch (err) {
      setError('No se pudo conectar con el servidor.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleSelectEmployee = async (id: number) => {
    try {
    setLoading(true); // Un estado de carga global ayuda mucho
    const data = await api.getEmployeeById(id);
    
    if (data) {
      setSelectedEmployee(data);
      setActiveTab('employee-detail'); // Cambiamos a la vista de la gráfica
      window.scrollTo(0, 0); // Opcional: sube al inicio de la página
    }
  } catch (error) {
    console.error("Error al cargar el detalle:", error);
    alert("No se pudo cargar el perfil del empleado");
  } finally {
    setLoading(false);
  }
};

  const handleBackToList = () => {
    setSelectedEmployee(null);
    setActiveTab('employees');
    fetchData(); 
  };

  const renderContent = () => {
    if (loading && !employees.length) {
      return (
        <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-600" />
          <p className="font-medium">Cargando datos del sistema...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="bg-red-50 border border-red-200 p-8 rounded-3xl text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h3 className="text-xl font-bold text-red-900">Error de Conexión</h3>
          <p className="text-red-700 max-w-md mx-auto">{error}</p>
          <button onClick={fetchData} className="bg-red-600 text-white px-6 py-2 rounded-xl font-semibold hover:bg-red-700">
            Reintentar
          </button>
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
              <StatCard title="Nuevas Incidencias" value={12} icon={AlertCircle} color="bg-amber-500" />
              <StatCard title="Crecimiento" value="+4.2%" icon={TrendingUp} color="bg-emerald-500" />
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-slate-900">Listado de Personal Reciente</h2>
              <EmployeeTable employees={employees} onSelectEmployee={handleSelectEmployee} />
            </div>
          </div>
        );
      case 'employees':
        return (
          <div className="space-y-6 animate-in fade-in duration-500">
            <h2 className="text-2xl font-bold text-slate-900">Gestión de Empleados</h2>
            <EmployeeTable employees={employees} onSelectEmployee={handleSelectEmployee} />
          </div>
        );
      
      // --- VISTA DETALLE MODIFICADA ---
      case 'employee-detail':
        return (
          <EmployeeDetailView 
            employee={selectedEmployee} 
            onBack={handleBackToList} 
            // Al actualizar (por ejemplo, al subir foto), recargamos los datos específicos del ID actual
            onUpdate={() => selectedEmployee && handleSelectEmployee(selectedEmployee.personal.emp_no)} 
          />
        );

      // --- CAMBIO AQUÍ: Llamamos al componente externo con toda su lógica ---
      case 'departments':
        return <DepartmentsModule onSelectEmployee={handleSelectEmployee} />;

      case 'incidents':
        return <IncidentsModule />;
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <main className="flex-1 flex flex-col">
        <header className="h-20 px-8 flex items-center justify-between sticky top-0 bg-slate-50/80 backdrop-blur-md z-10">
          <div>
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest">Panel de Control</h2>
            <p className="text-lg font-bold text-slate-800 capitalize">
              {activeTab === 'employee-detail' ? 'Detalle de Empleado' : activeTab}
            </p>
          </div>
          <WeatherWidget />
        </header>
        <div className="p-8 max-w-7xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: any) {
  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
      <div className={`${color} w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-current/20`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}