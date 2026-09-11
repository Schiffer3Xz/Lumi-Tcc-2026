import PostComposer from '@/features/social/PostComposer';
import ReaderLayout from '@/layouts/reader-layout';
import { Link, router } from '@inertiajs/react';

export default function CreatePost({ auth }) {
    const user = auth?.user ?? { name: 'Estudante', email: '' };

    const handleSubmit = ({ content, image }) => {
        const formData = new FormData();

        formData.append('content', content);

        if (image) {
            formData.append('image', image);
        }

        router.post(route('posts.store'), formData, {
            forceFormData: true,
        });
    };
    return (
        <>
            <ReaderLayout title="Criar Publicação" user={user} activeItem="usuarios" variant="composer">
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="mx-auto w-full max-w-[720px]">
                        {/* CABEÇALHO */}
                        <div className="mb-4 sm:mb-5">
                            <span className="mb-0.5 block text-[9px] font-bold tracking-widest text-blue-600 uppercase sm:text-[10px]">
                                COMUNIDADE LITERÁRIA
                            </span>

                            <h2 className="text-lg font-bold text-slate-800 sm:text-xl">Criar publicação</h2>

                            <p className="mt-1 text-xs text-slate-400">Compartilhe algo com a comunidade.</p>
                        </div>

                        {/* VOLTAR */}
                        <div className="mb-3">
                            <Link
                                href={route('profile')}
                                className="group inline-flex items-center gap-2 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-400 transition-all hover:bg-white hover:text-slate-700"
                            >
                                <i className="fa-solid fa-arrow-left text-[11px] transition-transform duration-200 group-hover:-translate-x-0.5" />

                                <span>Voltar</span>
                            </Link>
                        </div>

                        {/* CARD */}
                        <PostComposer user={user} onSubmit={handleSubmit} />

                        {/* DICA */}
                        <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3 sm:p-4">
                            <i className="fa-solid fa-lightbulb mt-0.5 text-sm text-amber-500" />

                            <p className="text-[10px] leading-relaxed text-amber-800 sm:text-[11px]">
                                Você pode publicar apenas um texto ou adicionar uma imagem à sua publicação.
                            </p>
                        </div>
                    </div>
                </main>
            </ReaderLayout>
        </>
    );
}
