import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit3, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Incidencia, Employee } from '../types.js';
import { api } from '../services/api';

interface IncidentsModuleProps {
  onUpdate?: () => void;
}

export const IncidentsModule: React.FC<IncidentsModuleProps> = ({ onUpdate }) => {
  const [incidents, setIncidents] = useState<Incidencia[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

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
      const dataToSend = { 
        ...formData, 
        fecha: formData.fecha.split('T')[0] 
      };

      if (editingId) {
        await api.updateIncidencia(editingId, dataToSend);
      } else {
        await api.createIncidencia(dataToSend);
      }
      
      setShowForm(false);
      setEditingId(null);
      
      setFormData({
        emp_no: 0,
        tipo: 'Falta',
        fecha: new Date().toISOString().split('T')[0],
        descripcion: '',
        estatus: 'Pendiente'
      });

      await loadData();
      if (onUpdate) onUpdate();
      
    } catch (err) {
      console.error("Error al procesar incidencia:", err);
      alert("No se pudieron guardar los cambios.");
    }
  };

  const handleEdit = (inc: Incidencia) => {
    setEditingId(inc.id_incidencia || null);
    setFormData({
      emp_no: inc.emp_no,
      tipo: inc.tipo,
      fecha: inc.fecha.split('T')[0], 
      descripcion: inc.descripcion,
      estatus: inc.estatus
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id_incidencia: number) => {
    if (!confirm('¿Estás seguro de eliminar esta incidencia?')) return;
    try {
      await api.deleteIncidencia(id_incidencia);
      await loadData();
      if (onUpdate) onUpdate();
    } catch (err) {
      console.error("Error al eliminar:", err);
    }
  };

  const handleStatusChange = async (id_incidencia: number, newStatus: Incidencia['estatus']) => {
    try {
      await api.updateIncidencia(id_incidencia, { estatus: newStatus });
      await loadData();
      if (onUpdate) onUpdate();
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

  if (loading) return <div className="p-8 text-center text-slate-500 dark:text-slate-400 font-bold">Cargando base de incidencias...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Gestión de Incidencias</h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">Registra y controla las novedades del personal</p>
        </div>
        <button 
          onClick={() => {
            setEditingId(null); 
            setShowForm(!showForm);
            if (!showForm) {
                setFormData({
                    emp_no: 0,
                    tipo: 'Falta',
                    fecha: new Date().toISOString().split('T')[0],
                    descripcion: '',
                    estatus: 'Pendiente'
                });
            }
          }}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2.5 rounded-xl font-semibold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20"
        >
          <Plus className="w-5 h-5" />
          {showForm ? 'Cerrar Formulario' : 'Nueva Incidencia'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in zoom-in duration-300">
          <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-4">
            {editingId ? 'Modificar Incidencia' : 'Registrar Nueva Incidencia'}
          </h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Empleado</label>
              <select 
                required
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-900 dark:text-white"
                value={formData.emp_no}
                onChange={e => setFormData({...formData, emp_no: parseInt(e.target.value)})}
              >
                <option value={0}>Seleccionar empleado...</option>
                {employees.map(emp => (
                  <option key={emp.emp_no} value={emp.emp_no}>
                    {emp.first_name} {emp.last_name} (#{emp.emp_no})
                  </option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Tipo de Incidencia</label>
              <select 
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-900 dark:text-white"
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
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Fecha</label>
              <input 
                type="date"
                required
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none font-medium text-slate-700 dark:text-white"
                value={formData.fecha}
                onChange={e => setFormData({...formData, fecha: e.target.value})}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300">Descripción / Motivo</label>
              <textarea 
                required
                rows={3}
                className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none resize-none font-medium text-slate-900 dark:text-white"
                value={formData.descripcion}
                onChange={e => setFormData({...formData, descripcion: e.target.value})}
              />
            </div>

            <div className="md:col-span-2 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={() => { setShowForm(false); setEditingId(null); }} 
                className="px-6 py-2.5 rounded-xl font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-indigo-900/20 transition-all"
              >
                {editingId ? 'Guardar Cambios' : 'Guardar Registro'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-colors">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
              <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Empleado</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Fecha</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Motivo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Estatus</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700 font-medium">
            {incidents.map((inc) => {
              const emp = employees.find(e => e.emp_no === inc.emp_no);
              return (
                <tr key={inc.id_incidencia} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {emp ? `${emp.first_name} ${emp.last_name}` : `ID: ${inc.emp_no}`}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300">{inc.tipo}</td>
                  <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-400">
                    {new Date(inc.fecha).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[200px]" title={inc.descripcion}>
                      {inc.descripcion || '-'}
                    </p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-900 p-1 rounded-lg border border-slate-100 dark:border-slate-700 w-fit">
                      {getStatusIcon(inc.estatus)}
                      <select 
                        className="text-xs font-bold bg-transparent border-none focus:ring-0 cursor-pointer text-slate-800 dark:text-slate-200"
                        value={inc.estatus}
                        onChange={e => handleStatusChange(inc.id_incidencia!, e.target.value as any)}
                      >
                        <option className="dark:bg-slate-800" value="Pendiente">Pendiente</option>
                        <option className="dark:bg-slate-800" value="Aprobado">Aprobado</option>
                        <option className="dark:bg-slate-800" value="Rechazado">Rechazado</option>
                      </select>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-1">
                      <button 
                        onClick={() => handleEdit(inc)}
                        className="p-2 text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        title="Editar"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(inc.id_incidencia!)}
                        className="p-2 text-slate-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {incidents.length === 0 && (
          <div className="p-12 text-center text-slate-500 dark:text-slate-400 font-bold italic bg-slate-50/50 dark:bg-slate-900/20">
            No hay incidencias registradas en el historial.
          </div>
        )}
      </div>
    </div>
  );
};