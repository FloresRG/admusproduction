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
    const [searchTerm, setSearchTerm] = useState('');

    // Estados para edición en línea de comentarios
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editingCommentText, setEditingCommentText] = useState('');

    const handleChange = (planId: number | null, field: keyof PlanEmpresa, value: string) => {
        const updated = formPlanes.map((plan) => (plan.id === planId ? { ...plan, [field]: value } : plan));
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
                    setFormPlanes((prev) =>
                        prev.map((plan) =>
                            plan.id === currentPlanId
                                ? {
                                      ...plan,
                                      comentarios: [
                                          ...(plan.comentarios || []),
                                          {
                                              id: Date.now(),
                                              contenido: commentText,
                                              user: { name: 'Tú' },
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

    const saveCommentEdit = (comentarioId: number, contenido: string, planId: number | null) => {
        if (!contenido.trim() || !planId) {
            setEditingCommentId(null);
            return;
        }

        router.post(
            '/comentarios-planes/update',
            {
                id: comentarioId,
                contenido,
            },
            {
                preserveScroll: true,
                onSuccess: () => {
                    setFormPlanes((prev) =>
                        prev.map((plan) => {
                            if (plan.id === planId) {
                                return {
                                    ...plan,
                                    comentarios: plan.comentarios?.map((comentario) =>
                                        comentario.id === comentarioId ? { ...comentario, contenido } : comentario,
                                    ),
                                };
                            }
                            return plan;
                        }),
                    );
                    setEditingCommentId(null);
                },
            },
        );
    };
    const filteredPlanes = formPlanes.filter((plan) => plan.empresa.name.toLowerCase().includes(searchTerm.toLowerCase()));

    return (
        <AppLayout>
            <Head title="Planes de Empresas" />

            <div className="relative container mx-auto p-6">
                <h1 className="mb-6 text-2xl font-bold">Planes de Empresas</h1>
                <button
                    onClick={() => window.open('/planes-empresas/pdf', '_blank')}
                    className="mb-4 rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
                >
                    Generar PDF
                </button>
                <div className="mb-4 flex items-center justify-between">
                    <input
                        type="text"
                        placeholder="Buscar por empresa..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full max-w-sm rounded border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                </div>

                <table className="min-w-full border border-gray-200 bg-white shadow-sm">
                    <thead>
                        <tr className="bg-gray-100 text-left text-sm font-semibold">
                            <th className="px-4 py-2">Empresa</th>
                            {/* <th className="px-4 py-2">Categoria</th>
                            <th className="px-4 py-2">Plan</th>
                            <th className="px-4 py-2">Influencer</th> */}
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
                        {filteredPlanes.map((plan, index) => (
                            <tr key={plan.empresa_id} className="border-t text-sm">
                                <td className="px-4 py-2 text-xs">
                                    <div>
                                        <a
                                            href={`/empresas/${plan.empresa_id}/seguimiento-videos`}
                                            className="text-blue-600 underline hover:text-blue-800"
                                        >
                                            {plan.empresa.name}
                                        </a>
                                    </div>
                                    <div className="text-gray-700">Cat: {plan.empresa.category_name}</div>
                                    <div className="text-gray-700">Plan: {plan.empresa.paquete_nombre}</div>
                                    <div className="text-gray-700 italic">Infl: {plan.empresa.influencer}</div>
                                </td>

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
                                            onChange={(e) => handleChange(plan.id, field as keyof PlanEmpresa, e.target.value)}
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

                                    {/* Lista de comentarios editable */}
                                    <div className="mt-2 max-h-32 overflow-y-auto rounded border border-gray-200 bg-gray-50 p-2 text-xs text-gray-700">
                                        {plan.comentarios && plan.comentarios.length > 0 ? (
                                            plan.comentarios.map((comentario) => (
                                                <div key={comentario.id} className="mb-1 border-b border-gray-200 pb-1 last:border-none">
                                                    <div className="font-semibold">{comentario.user?.name || 'Anónimo'}</div>

                                                    {editingCommentId === comentario.id ? (
                                                        <input
                                                            type="text"
                                                            className="w-full rounded border px-1 py-0.5 text-xs"
                                                            value={editingCommentText}
                                                            autoFocus
                                                            onChange={(e) => setEditingCommentText(e.target.value)}
                                                            onBlur={() => saveCommentEdit(comentario.id, editingCommentText, plan.id)}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Enter') {
                                                                    e.preventDefault();
                                                                    saveCommentEdit(comentario.id, editingCommentText, plan.id);
                                                                } else if (e.key === 'Escape') {
                                                                    setEditingCommentId(null);
                                                                }
                                                            }}
                                                        />
                                                    ) : (
                                                        <div
                                                            onClick={() => {
                                                                setEditingCommentId(comentario.id);
                                                                setEditingCommentText(comentario.contenido);
                                                            }}
                                                            className="cursor-pointer"
                                                            title="Click para editar"
                                                        >
                                                            {comentario.contenido}
                                                        </div>
                                                    )}
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

                {/* Modal para agregar comentario */}
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
