import React, { useState, useEffect } from 'react';
import { Plus, Trash2, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Incidencia, Employee } from '../types.js';
import { api } from '../services/api';

export const IncidentsModule: React.FC = () => {
  const [incidents, setIncidents] = useState<Incidencia[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState<Incidencia>({
    emp_no: 0,
    tipo: 'Falta',
    fecha: new Date().toISOString().split('T')[0],
    descripcion: '',
    estatus: 'Pendiente'
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [incRes, empRes] = await Promise.all([
        api.getIncidencias(),
        api.getEmployees()
      ]);
      setIncidents(incRes);
      setEmployees(empRes);
    } catch (err) {
      console.error("Error al cargar datos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createIncidencia(formData);
      setShowForm(false);
      loadData();
      // Resetear formulario
      setFormData({
        emp_no: 0,
        tipo: 'Falta',
        fecha: new Date().toISOString().split('T')[0],
        descripcion: '',
        estatus: 'Pendiente'
      });
    } catch (err) {
      console.error("Error al crear incidencia:", err);
    }
  };

  const handleDelete = async (id_incidencia: number) => {
    if (!confirm('¿Estás seguro de eliminar esta incidencia?')) return;
    try {
      await api.deleteIncidencia(id_incidencia);
      loadData();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  const handleStatusChange = async (id_incidencia: number, newStatus: Incidencia['estatus']) => {
    try {
      // Enviamos el objeto con el nuevo estatus al ID correcto
      await api.updateIncidencia(id_incidencia, { estatus: newStatus });
      loadData(); // Refrescar la tabla para ver el cambio
    } catch (err) {
      console.error("Error al actualizar estatus:", err);
    }
  };

  const getStatusIcon = (status: Incidencia['estatus']) => {
    switch (status) {
      case 'Aprobado': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'Rechazado': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Incidencias</h2>
          <p className="text-slate-500">Registra y controla las novedades del personal</p>
        </div>
        <button 
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
        >
          <Plus className="w-5 h-5" />
          Nueva Incidencia
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in duration-300">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Empleado</label>
              <select 
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                value={formData.emp_no}
                onChange={e => setFormData({...formData, emp_no: parseInt(e.target.value)})}
              >
                <option value="">Seleccionar empleado...</option>
                {employees.map(emp => (
                  <option key={emp.emp_no} value={emp.emp_no}>
                    {emp.first_name} {emp.last_name} (#{emp.emp_no})
                  </option>
                ))}
              </select>
            </div>
            {/* ... Otros campos del formulario (Tipo, Fecha, Descripción) ... */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Tipo de Incidencia</label>
              <select 
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                value={formData.tipo}
                onChange={e => setFormData({...formData, tipo: e.target.value as any})}
              >
                <option value="Falta">Falta</option>
                <option value="Retraso">Retraso</option>
                <option value="Permiso">Permiso</option>
                <option value="Vacaciones">Vacaciones</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Fecha</label>
              <input 
                type="date"
                required
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none"
                value={formData.fecha}
                onChange={e => setFormData({...formData, fecha: e.target.value})}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold text-slate-700">Descripción</label>
              <textarea 
                required
                rows={3}
                className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none"
                value={formData.descripcion}
                onChange={e => setFormData({...formData, descripcion: e.target.value})}
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-100">Cancelar</button>
              <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 shadow-lg shadow-indigo-200">Guardar Registro</button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Empleado</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Tipo</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Fecha</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Motivo</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Estatus</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {incidents.map((inc) => {
              const emp = employees.find(e => e.emp_no === inc.emp_no);
              return (
                <tr key={inc.id_incidencia} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-semibold text-slate-800">
                      {emp ? `${emp.first_name} ${emp.last_name}` : `ID: ${inc.emp_no}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-600">{inc.tipo}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">
                    {new Date(inc.fecha).toLocaleDateString('es-MX')}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-500 truncate max-w-[200px]" title={inc.descripcion}>
                      {inc.descripcion || 'Sin descripción'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(inc.estatus)}
                      <select 
                        className="text-xs font-semibold bg-transparent border-none focus:ring-0 cursor-pointer text-slate-700"
                        value={inc.estatus}
                        onChange={e => handleStatusChange(inc.id_incidencia!, e.target.value as any)}
                      >
                        <option value="Pendiente">Pendiente</option>
                        <option value="Aprobado">Aprobado</option>
                        <option value="Rechazado">Rechazado</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleDelete(inc.id_incidencia!)}
                      className="p-2 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};