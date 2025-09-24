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

type Comentario = {
    id: number;
    contenido: string;
    user?: { name: string };
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
    comentarios?: Comentario[];
};

type Props = {
    planes: PlanEmpresa[];
};

const Index = ({ planes }: Props) => {
    const [formPlanes, setFormPlanes] = useState<PlanEmpresa[]>(planes);
    const [showCommentForm, setShowCommentForm] = useState(false);
    const [currentPlanId, setCurrentPlanId] = useState<number | null>(null);
    const [commentText, setCommentText] = useState('');

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

    const openCommentForm = (planId: number | null) => {
        setCurrentPlanId(planId);
        setCommentText('');
        setShowCommentForm(true);
    };

    const closeCommentForm = () => {
        setShowCommentForm(false);
        setCurrentPlanId(null);
        setCommentText('');
    };

    const submitComment = () => {
        if (!commentText.trim() || !currentPlanId) return;

        router.post(
            '/comentarios-planes',
            {
                contenido: commentText,
                plan_empresa_id: currentPlanId,
            },
            {
                onSuccess: () => {
                    // Actualizar comentarios localmente
                    setFormPlanes((prev) =>
                        prev.map((plan) =>
                            plan.id === currentPlanId
                                ? {
                                      ...plan,
                                      comentarios: [
                                          ...(plan.comentarios || []),
                                          {
                                              id: Date.now(), // temporal, ideal si backend responde el nuevo comentario
                                              contenido: commentText,
                                              user: { name: 'Tú' }, // o info real si tienes
                                          },
                                      ],
                                  }
                                : plan,
                        ),
                    );
                    closeCommentForm();
                },
            },
        );
    };

    return (
        <AppLayout>
            <Head title="Planes de Empresas" />

            <div className="relative container mx-auto p-6">
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
                                <td className="px-4 py-2 align-top">
                                    <button
                                        onClick={() => openCommentForm(plan.id)}
                                        className="rounded bg-blue-500 px-2 py-1 text-white hover:bg-blue-600"
                                    >
                                        Agregar
                                    </button>
                                    <div className="mt-1 text-xs text-gray-600">
                                        {plan.comentarios?.length || 0} comentario{plan.comentarios?.length === 1 ? '' : 's'}
                                    </div>

                                    {/* Lista simple de comentarios */}
                                    <div className="mt-2 max-h-32 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-2 text-xs text-gray-700">
                                        {plan.comentarios && plan.comentarios.length > 0 ? (
                                            plan.comentarios.map((comentario) => (
                                                <div key={comentario.id} className="mb-1 border-b border-gray-200 pb-1 last:border-none">
                                                    <div className="font-semibold">{comentario.user?.name || 'Anónimo'}</div>
                                                    <div>{comentario.contenido}</div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-gray-400 italic">Sin comentarios</div>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal lateral derecho */}
                {showCommentForm && (
                    <div className="fixed top-0 right-0 z-50 flex h-full w-96 flex-col border-l border-gray-300 bg-white p-6 shadow-lg">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">Agregar Comentario</h2>
                            <button onClick={closeCommentForm} className="text-xl font-bold text-gray-600 hover:text-gray-900" aria-label="Cerrar">
                                ×
                            </button>
                        </div>
                        <textarea
                            rows={6}
                            className="mb-4 w-full resize-none rounded border p-2"
                            value={commentText}
                            onChange={(e) => setCommentText(e.target.value)}
                            placeholder="Escribe tu comentario aquí..."
                        />
                        <div className="mt-auto flex justify-end gap-2">
                            <button onClick={closeCommentForm} className="rounded border px-4 py-2 hover:bg-gray-100">
                                Cancelar
                            </button>
                            <button
                                onClick={submitComment}
                                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
                                disabled={!commentText.trim()}
                            >
                                Guardar
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
};

export default Index;
