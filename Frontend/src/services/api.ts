const BASE = 'http://localhost:3000/api';

export const api = {
  // --- EMPLEADOS ---
  getEmployees: () => fetch(`${BASE}/employees`).then(r => r.json()),
  getDepartments: () => fetch(`${BASE}/departments`).then(r => r.json()),
  
  // --- INCIDENCIAS (Esta es la que te está dando el error) ---
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