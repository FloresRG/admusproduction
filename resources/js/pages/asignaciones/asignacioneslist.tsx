// resources/js/pages/Asignaciones/AsignacionesList.tsx
import AppLayout from '@/layouts/app-layout';
import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';


type Asignacion = {
  id: string;
  estado: string;
  detalle: string;
  fecha: string;
  user: { name: string; email: string };
  tarea: { titulo: string };
};

export default function AsignacionesList() {
  // Extrae la prop que envió el controlador
  const { asignaciones } = usePage<{ asignaciones: Asignacion[] }>().props;

  return (
    <AppLayout>
      <Head title="Asignaciones de Tarea" />

      <div className="mx-auto max-w-7xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">
            Asignaciones de Tarea
          </h1>
          <Link
            href="/asignaciones/create"
            className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Nueva Asignación
          </Link>
        </div>

        {asignaciones.length === 0 ? (
          <p className="text-center text-gray-500">No hay asignaciones.</p>
        ) : (
          <div className="overflow-x-auto bg-white shadow rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {['ID','Usuario','Tarea','Estado','Detalle','Fecha'].map(header => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {asignaciones.map(a => (
                  <tr key={a.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {a.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {a.user.name} ({a.user.email})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {a.tarea.titulo}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {a.estado}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {a.detalle}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(a.fecha).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
