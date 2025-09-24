import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';

type Paquete = {
    nombre_paquete: string;
    tiktok_mes: string;
    tiktok_semana: string;
    facebook_mes: string;
    facebook_semana: string;
    instagram_mes: string;
    instagram_semana: string;
    artesfacebook_mes: string;
    artesfacebook_semana: string;
    artesinstagram_mes: string;
    artesinstagram_semana: string;
    extras: string;
    total_publicaciones: string;
};

type Company = {
    id: number;
    name: string;
    company_category_id: number;
    contract_duration: string;
    paquete_id: number;
    paquete: Paquete | null;
    category?: {
        name: string;
    };
};

type Props = {
    companies: Company[];
};

const Index = ({ companies }: Props) => {
    return (
        <AppLayout>
            <Head title="Lista de Compañías" />

            <div className="container mx-auto p-8">
                <h1 className="mb-8 border-b-4 border-indigo-500 pb-2 text-4xl font-extrabold text-gray-900">Listado de Compañías</h1>

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-indigo-100">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-lg font-semibold text-indigo-700">
                                    Datos de la Compañía
                                </th>
                                <th colSpan={12} scope="col" className="px-6 py-3 text-center text-lg font-semibold text-indigo-700">
                                    Detalles del Paquete
                                </th>
                            </tr>
                            <tr className="bg-indigo-50 text-sm tracking-wider text-indigo-600 uppercase">
                                <th className="px-6 py-2 text-left font-medium">Información</th>
                                <th className="px-3 py-2 text-center font-medium">Paquete</th>
                                <th className="px-3 py-2 text-center font-medium">TikTok Mes</th>
                                <th className="px-3 py-2 text-center font-medium">TikTok Semana</th>
                                <th className="px-3 py-2 text-center font-medium">FB Mes</th>
                                <th className="px-3 py-2 text-center font-medium">FB Semana</th>
                                <th className="px-3 py-2 text-center font-medium">IG Mes</th>
                                <th className="px-3 py-2 text-center font-medium">IG Semana</th>
                                <th className="px-3 py-2 text-center font-medium">Artes FB Mes</th>
                                <th className="px-3 py-2 text-center font-medium">Artes FB Semana</th>
                                <th className="px-3 py-2 text-center font-medium">Artes IG Mes</th>
                                <th className="px-3 py-2 text-center font-medium">Artes IG Semana</th>
                                <th className="px-3 py-2 text-center font-medium">Extras</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {companies.map((company) => (
                                <tr key={company.id} className="transition-colors duration-300 hover:bg-indigo-50">
                                    <td className="px-6 py-4 align-top text-base font-medium whitespace-pre-line text-gray-800">
                                        <p>
                                            <span className="font-semibold">Nombre:</span>{' '}
                                            <Link
                                                href={route('empresas.seguimiento-tareas', company.id)}
                                                className="font-semibold text-indigo-600 transition-colors hover:underline"
                                            >
                                                {company.name}
                                            </Link>
                                        </p>
                                        <p>
                                            <span className="font-semibold">Categoría:</span> {company.category?.name || '-'}
                                        </p>
                                        <p>
                                            <span className="font-semibold">Duración Contrato:</span> {company.contract_duration || '-'}
                                        </p>
                                    </td>
                                    <td className="px-3 py-4 text-center font-semibold text-indigo-700">{company.paquete?.nombre_paquete || '-'}</td>
                                    <td className="px-3 py-4 text-center text-gray-600">{company.paquete?.tiktok_mes || '-'}</td>
                                    <td className="px-3 py-4 text-center text-gray-600">{company.paquete?.tiktok_semana || '-'}</td>
                                    <td className="px-3 py-4 text-center text-gray-600">{company.paquete?.facebook_mes || '-'}</td>
                                    <td className="px-3 py-4 text-center text-gray-600">{company.paquete?.facebook_semana || '-'}</td>
                                    <td className="px-3 py-4 text-center text-gray-600">{company.paquete?.instagram_mes || '-'}</td>
                                    <td className="px-3 py-4 text-center text-gray-600">{company.paquete?.instagram_semana || '-'}</td>
                                    <td className="px-3 py-4 text-center text-gray-600">{company.paquete?.artesfacebook_mes || '-'}</td>
                                    <td className="px-3 py-4 text-center text-gray-600">{company.paquete?.artesfacebook_semana || '-'}</td>
                                    <td className="px-3 py-4 text-center text-gray-600">{company.paquete?.artesinstagram_mes || '-'}</td>
                                    <td className="px-3 py-4 text-center text-gray-600">{company.paquete?.artesinstagram_semana || '-'}</td>
                                    <td className="px-3 py-4 text-center text-gray-600">{company.paquete?.extras || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
};

export default Index;
