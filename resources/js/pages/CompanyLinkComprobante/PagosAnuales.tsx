import AppLayout from "@/layouts/app-layout"
import { Head } from "@inertiajs/react"
import { Calendar, Building2, CheckCircle2, XCircle } from "lucide-react"

const meses = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
]

export default function PagosAnuales({ empresas, pagos, anio }) {
  return (
    <AppLayout>
      <Head title={`Pagos de Empresas - Año ${anio}`} />

      {/* Header con gradiente azul */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-blue-800 text-white">
        <div className="px-6 py-8">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="h-8 w-8" />
            <h1 className="text-3xl font-bold">Pagos de Empresas</h1>
          </div>
          <p className="text-blue-100 text-lg">Año {anio}</p>
        </div>
      </div>

      <div className="p-6 bg-gray-50 min-h-screen">
        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-blue-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Building2 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Empresas</p>
                <p className="text-2xl font-bold text-gray-900">{empresas.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-green-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pagos Realizados</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(pagos).filter((pago) => pago?.length > 0).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pagos Pendientes</p>
                <p className="text-2xl font-bold text-gray-900">
                  {empresas.length * 12 - Object.values(pagos).filter((pago) => pago?.length > 0).length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabla mejorada */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200">
            <h2 className="text-lg font-semibold text-blue-900">Estado de Pagos por Mes</h2>
            <p className="text-sm text-blue-700 mt-1">Seguimiento detallado de pagos por empresa</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <th className="px-6 py-4 text-left font-semibold">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Empresa
                    </div>
                  </th>
                  {meses.map((mes) => (
                    <th key={mes} className="px-4 py-4 text-center font-semibold min-w-[100px]">
                      {mes}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {empresas.map((empresa, index) => (
                  <tr
                    key={empresa.id}
                    className={`hover:bg-blue-50 transition-colors duration-200 ${
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                          {empresa.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{empresa.name}</p>
                          <p className="text-sm text-gray-500">ID: {empresa.id}</p>
                        </div>
                      </div>
                    </td>
                    {meses.map((mes) => {
                      const key = `${empresa.id}-${mes}`
                      const pagoExiste = pagos[key]?.length > 0

                      return (
                        <td key={mes} className="px-4 py-4 text-center">
                          <div
                            className={`inline-flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                              pagoExiste
                                ? "bg-green-100 text-green-700 hover:bg-green-200"
                                : "bg-red-100 text-red-700 hover:bg-red-200"
                            }`}
                          >
                            {pagoExiste ? <CheckCircle2 className="h-5 w-5" /> : <XCircle className="h-5 w-5" />}
                          </div>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leyenda */}
        <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Leyenda</h3>
          <div className="flex flex-wrap gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle2 className="h-4 w-4 text-green-700" />
              </div>
              <span className="text-sm text-gray-700">Pago realizado</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <XCircle className="h-4 w-4 text-red-700" />
              </div>
              <span className="text-sm text-gray-700">Pago pendiente</span>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
