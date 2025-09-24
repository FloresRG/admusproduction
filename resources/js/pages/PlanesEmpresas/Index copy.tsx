import AppLayout from '@/layouts/app-layout';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';

type Empresa = {
    id: number;
    name: string;
    influencer: string | null;
    category_name: string;
    paquete_nombre: string;
};

type PlanEmpresa = {
    id: number | null;
    empresa_id: number;
    tiktok_mes: string;
    tiktok_semana: string;
    facebook_mes: string;
    facebook_semana: string;
    instagram_mes: string;
    instagram_semana: string;
    mensajes: string;
    empresa: Empresa;
};

type Props = {
    planes: PlanEmpresa[];
};

const Index = ({ planes }: Props) => {
    const [formPlanes, setFormPlanes] = useState<PlanEmpresa[]>(planes);

    const handleChange = (index: number, field: keyof PlanEmpresa, value: string) => {
        const updated = [...formPlanes];
        updated[index][field] = value;
        setFormPlanes(updated);
    };

    const handleBlur = (plan: PlanEmpresa) => {
        router.post('/planes-empresas/save', plan, {
            preserveScroll: true,
        });
    };

    return (
        <AppLayout>
            <Head title="Planes de Empresas" />

            <div className="container mx-auto p-6">
                <h1 className="mb-6 text-2xl font-bold">Planes de Empresas</h1>

                <table className="min-w-full border border-gray-200 bg-white shadow-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left text-sm font-semibold">
                            <th className="px-4 py-2">Empresa</th>
                            <th className="px-4 py-2">Categoria</th>
                            <th className="px-4 py-2">Plan</th>
                            <th className="px-4 py-2">Influencer</th>
                            <th className="px-4 py-2">TikTok (Mes)</th>
                            <th className="px-4 py-2">TikTok (Semana)</th>
                            <th className="px-4 py-2">Facebook (Mes)</th>
                            <th className="px-4 py-2">Facebook (Semana)</th>
                            <th className="px-4 py-2">Instagram (Mes)</th>
                            <th className="px-4 py-2">Instagram (Semana)</th>
                            <th className="px-4 py-2">Mensajes</th>
                            <th className="px-4 py-2">Comentarios</th>
                        </tr>
                    </thead>
                    <tbody>
                        {formPlanes.map((plan, index) => (
                            <tr key={plan.empresa_id} className="border-t text-sm">
                                <td className="px-4 py-2">{plan.empresa.name}</td>
                                <td className="px-4 py-2">{plan.empresa.category_name}</td>
                                <td className="px-4 py-2">{plan.empresa.paquete_nombre}</td>
                                <td className="px-4 py-2">{plan.empresa.influencer}</td>
                                {[
                                    'tiktok_mes',
                                    'tiktok_semana',
                                    'facebook_mes',
                                    'facebook_semana',
                                    'instagram_mes',
                                    'instagram_semana',
                                    'mensajes',
                                ].map((field) => (
                                    <td className="px-4 py-2" key={field}>
                                        <input
                                            type="text"
                                            value={plan[field as keyof PlanEmpresa] || ''}
                                            onChange={(e) => handleChange(index, field as keyof PlanEmpresa, e.target.value)}
                                            onBlur={() => handleBlur(plan)}
                                            className="w-full rounded border px-2 py-1 text-sm"
                                        />
                                    </td>
                                ))}
                                <td className="px-4 py-2">
                                    <button
                                        onClick={() => openCommentForm(plan.id)}
                                        className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                                    >
                                        Agregar comentario
                                    </button>
                                    {/* Mostrar número de comentarios */}
                                    <div className="mt-1 text-xs text-gray-600">
                                        {plan.comentarios?.length || 0} comentario{plan.comentarios?.length === 1 ? '' : 's'}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AppLayout>
    );
};

export default Index;
