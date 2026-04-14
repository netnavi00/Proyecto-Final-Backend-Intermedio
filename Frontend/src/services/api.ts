const BASE = 'http://localhost:3000/api';

export const api = {

  getEmployeeById: (id: number) => 
    fetch(`${BASE}/employees/${id}`).then(r => r.json()),

  // --- DEPARTAMENTOS ---
  getDepartments: () => fetch(`${BASE}/departments`).then(r => r.json()),
  
  // Esta es la que usaremos para ver los empleados de un departamento
  getEmployeesByDept: (deptNo: string) => 
    fetch(`${BASE}/departments/${deptNo}/employees`).then(r => r.json()),

  // --- EMPLEADOS ---
  getEmployees: () => fetch(`${BASE}/employees`).then(r => r.json()),
  
  uploadEmployeePhoto: (emp_no: number, file: File) => {
    const formData = new FormData();
    formData.append('photo', file);
    return fetch(`${BASE}/employees/${emp_no}/photo`, {
      method: 'POST',
      body: formData,
    }).then(r => r.json());
  },

  deleteEmployeePhoto: (emp_no: number) => 
    fetch(`${BASE}/employees/${emp_no}/photo`, {
      method: 'DELETE'
    }).then(r => r.json()),

  // --- INCIDENCIAS ---
  // Corregido: Ahora usa la constante BASE definida arriba
  getIncidenciasCount: async () => {
    try {
      const response = await fetch(`${BASE}/incidencias/count`);
      if (!response.ok) return { total: 0 };
      return await response.json();
    } catch (error) {
      console.error("Error al obtener conteo de incidencias:", error);
      return { total: 0 };
    }
  },
  
  getIncidencias: () => fetch(`${BASE}/incidencias`).then(r => r.json()),

  createIncidencia: (data: any) => fetch(`${BASE}/incidencias`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json()),

  updateIncidencia: (id_incidencia: number, data: any) => 
    fetch(`${BASE}/incidencias/${id_incidencia}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(r => r.json()),

  deleteIncidencia: (id_incidencia: number) => 
    fetch(`${BASE}/incidencias/${id_incidencia}`, {
      method: 'DELETE'
    }).then(r => r.json()),
};