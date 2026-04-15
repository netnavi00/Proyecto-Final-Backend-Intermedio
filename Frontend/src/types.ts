
// Definición de tipos para la aplicación DataWork
// * - 'Employee': Representa la información básica de un empleado.
// * - 'EmployeeDetail': Contiene detalles adicionales como salarios e historial de puestos.
// * - 'Incidencia': Modela las incidencias reportadas por los empleados.
// * - 'Department': Representa un departamento dentro de la empresa.

export interface Employee {
  emp_no: number;
  first_name: string;
  last_name: string;
  gender: 'M' | 'F';
  hire_date: string;
  puesto?: string;
  salary?: number;
  department?: string;
  photo_url?: string | null;
}

export interface EmployeeDetail {
  personal: Employee;
  salaries: { salary: number; from_date: string }[];
  puestos: { title: string; from_date: string }[];
}

export interface Incidencia {
  id_incidencia?: number;
  emp_no: number;
  tipo: 'Falta' | 'Retraso' | 'Permiso' | 'Vacaciones' | 'Otro';
  fecha: string;
  descripcion: string;
  estatus: 'Pendiente' | 'Aprobado' | 'Rechazado';
}

export interface Department {
  dept_no: string;
  dept_name: string;
}