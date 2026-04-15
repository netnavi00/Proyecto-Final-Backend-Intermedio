
/**
 * Punto de entrada principal de la aplicación React.
 * * - 'createRoot': Inicializa el árbol de componentes en el elemento DOM con id 'root'.
 * - 'StrictMode': Herramienta de desarrollo que ayuda a identificar problemas potenciales,
 * activando comprobaciones adicionales y advertencias para sus descendientes.
 * - 'App': Componente raíz que contiene toda la estructura y lógica de DataWork.
 */

import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Importación de estilos globales (Tailwind)



// Seleccionamos el contenedor del HTML y renderizamos la aplicación
// El signo '!' al final le indica a TypeScript que estamos seguros de que el elemento existe.

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
