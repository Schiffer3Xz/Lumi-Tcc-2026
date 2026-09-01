import { Head, Link, router } from '@inertiajs/react';
import { useRef, useState } from 'react';

export default function CreatePost({ auth }) {
    const user = auth?.user ?? { name: 'Estudante', email: '' };

    const fileInputRef = useRef(null);
    const cameraInputRef = useRef(null);

    const [mobileOpen, setMobileOpen] = useState(false);
    const [content, setContent] = useState('');
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) return;

        setImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    const removeImage = () => {
        setImage(null);
        setImagePreview(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }

        if (cameraInputRef.current) {
            cameraInputRef.current.value = '';
        }
    };

    const handleSubmit = (event) => {
        event.preventDefault();

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
            <Head title="Criar Publicação" />

            <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" />

            <div className="flex min-h-screen bg-[#F8FAFC] font-sans text-slate-700">
                {/* OVERLAY MOBILE */}
                {mobileOpen && <div className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden" onClick={() => setMobileOpen(false)} />}

                {/* SIDEBAR */}
                <aside
                    className={`fixed top-0 left-0 z-50 flex h-screen w-20 flex-shrink-0 flex-col items-center gap-8 bg-[#1A2332] py-6 transition-transform duration-300 ease-in-out lg:sticky ${
                        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
                    }`}
                >
                    {/* LOGO */}
                    <div className="text-yellow-300">
                        <i className="fa-solid fa-feather-pointed text-2xl" />
                    </div>

                    {/* MENU */}
                    <nav className="flex flex-1 flex-col gap-3">
                        {/* HOME */}
                        <Link
                            href={route('dashboard')}
                            onClick={() => setMobileOpen(false)}
                            className="relative flex flex-col items-center gap-1 rounded-xl p-3 text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
                            title="Home"
                        >
                            <i className="fa-solid fa-house text-lg" />

                            <span className="text-[10px] font-medium">Home</span>
                        </Link>

                        {/* CATÁLOGO */}
                        <Link
                            href={route('catalogo')}
                            onClick={() => setMobileOpen(false)}
                            className="relative flex flex-col items-center gap-1 rounded-xl p-3 text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
                            title="Catálogo"
                        >
                            <i className="fa-solid fa-book-open text-lg" />

                            <span className="text-[10px] font-medium">Catálogo</span>
                        </Link>

                        {/* SOCIAL */}
                        <Link
                            href={route('list')}
                            onClick={() => setMobileOpen(false)}
                            className="relative flex flex-col items-center gap-1 rounded-xl bg-yellow-300/10 p-3 text-yellow-300 transition-all duration-200"
                            title="Social"
                        >
                            <span className="absolute top-1/2 left-0 h-8 w-1 -translate-y-1/2 rounded-r-full bg-amber-400" />

                            <i className="fa-solid fa-users text-lg" />

                            <span className="text-[10px] font-medium">Social</span>
                        </Link>

                        {/* CONFIG */}
                        <Link
                            href={route('profile')}
                            onClick={() => setMobileOpen(false)}
                            className="relative flex flex-col items-center gap-1 rounded-xl p-3 text-slate-400 transition-all duration-200 hover:bg-white/5 hover:text-white"
                            title="Config"
                        >
                            <i className="fa-solid fa-gear text-lg" />

                            <span className="text-[10px] font-medium">Config</span>
                        </Link>
                    </nav>

                    <button className="rounded-xl p-3 text-slate-400 transition-all hover:bg-white/5 hover:text-white">
                        <i className="fa-solid fa-gear text-lg" />
                    </button>
                </aside>

                {/* CONTEÚDO */}
                <div className="flex h-screen min-w-0 flex-1 flex-col overflow-hidden">
                    {/* TOPBAR */}
                    <header className="sticky top-0 z-30 flex h-16 flex-shrink-0 items-center justify-between border-b border-slate-200/80 bg-white/90 px-4 backdrop-blur-md sm:px-6">
                        {/* ESQUERDA */}
                        <div className="flex items-center gap-3">
                            {/* MENU MOBILE */}
                            <button onClick={() => setMobileOpen(true)} className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden">
                                <i className="fa-solid fa-bars text-xl" />
                            </button>

                            {/* LOGO */}
                            <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-base font-bold text-white shadow-xs">
                                    <i className="fa-solid fa-book-open" />
                                </div>

                                <div>
                                    <h1 className="text-sm leading-tight font-bold text-slate-800">Sala de Leitura</h1>

                                    <p className="hidden text-[11px] font-medium text-slate-400 sm:block">Plataforma Escolar Web</p>
                                </div>
                            </div>
                        </div>

                        {/* DIREITA */}
                        <div className="flex items-center gap-2 sm:gap-4">
                            {/* NOTIFICAÇÕES */}
                            <button className="relative rounded-full p-2 text-slate-600 transition-colors hover:bg-slate-100 sm:p-2.5">
                                <i className="fa-regular fa-bell text-base sm:text-lg" />

                                <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-white sm:top-2 sm:right-2" />
                            </button>

                            {/* PERFIL */}
                            <div className="flex items-center gap-2 rounded-full border border-slate-200/60 p-1 pr-2 sm:gap-2.5 sm:pr-3">
                                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white">
                                    {user.name.charAt(0).toUpperCase()}
                                </div>

                                <span className="hidden max-w-[120px] truncate text-xs font-semibold text-slate-700 sm:block">{user.name}</span>

                                <i className="fa-solid fa-chevron-down text-[9px] text-slate-400" />
                            </div>
                        </div>
                    </header>

                    {/* CONTEÚDO */}
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
                            <form
                                onSubmit={handleSubmit}
                                className="flex flex-col gap-4 rounded-2xl border border-slate-200/70 bg-white p-4 shadow-xs sm:gap-5 sm:p-5"
                            >
                                {/* AUTOR */}
                                <div className="flex items-center gap-3">
                                    <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-slate-800 text-xs font-bold text-white sm:h-10 sm:w-10">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>

                                    <div className="min-w-0">
                                        <p className="truncate text-xs font-bold text-slate-800">{user.name}</p>

                                        <p className="text-[10px] text-slate-400">Nova publicação</p>
                                    </div>
                                </div>

                                {/* TEXTO */}
                                <textarea
                                    value={content}
                                    onChange={(event) => setContent(event.target.value)}
                                    placeholder="O que você está pensando?"
                                    rows={7}
                                    className="min-h-[160px] w-full resize-none rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-3 text-xs leading-relaxed text-slate-700 transition-all outline-none placeholder:text-slate-400 focus:border-blue-400 focus:bg-white sm:min-h-[180px] sm:px-4"
                                />

                                {/* PREVIEW DA IMAGEM */}
                                {imagePreview && (
                                    <div className="relative overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                                        <img
                                            src={imagePreview}
                                            alt="Pré-visualização da publicação"
                                            className="max-h-[400px] min-h-[180px] w-full object-cover sm:max-h-[450px]"
                                        />

                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="absolute top-2 right-2 flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/70 text-white backdrop-blur-sm transition-colors hover:bg-rose-500 sm:top-3 sm:right-3"
                                        >
                                            <i className="fa-solid fa-xmark text-sm" />
                                        </button>
                                    </div>
                                )}

                                {/* INPUT FOTO */}
                                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />

                                {/* INPUT CÂMERA */}
                                <input
                                    ref={cameraInputRef}
                                    type="file"
                                    accept="image/*"
                                    capture="environment"
                                    onChange={handleImageChange}
                                    className="hidden"
                                />

                                {/* AÇÕES */}
                                <div className="flex flex-col gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:justify-between">
                                    {/* ESQUERDA */}
                                    <div className="flex w-full items-center gap-2 sm:w-auto">
                                        {/* FOTO */}
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:flex-none"
                                        >
                                            <i className="fa-regular fa-image text-sm" />

                                            <span>Foto</span>
                                        </button>

                                        {/* CÂMERA */}
                                        <button
                                            type="button"
                                            onClick={() => cameraInputRef.current?.click()}
                                            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-medium text-slate-600 transition-all hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600 sm:flex-none"
                                        >
                                            <i className="fa-solid fa-camera text-sm" />

                                            <span>Câmera</span>
                                        </button>
                                    </div>

                                    {/* PUBLICAR */}
                                    <button
                                        type="submit"
                                        disabled={!content.trim() && !image}
                                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40 sm:w-auto"
                                    >
                                        <i className="fa-solid fa-paper-plane" />
                                        Publicar
                                    </button>
                                </div>
                            </form>

                            {/* DICA */}
                            <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-100 bg-amber-50/60 p-3 sm:p-4">
                                <i className="fa-solid fa-lightbulb mt-0.5 text-sm text-amber-500" />

                                <p className="text-[10px] leading-relaxed text-amber-800 sm:text-[11px]">
                                    Você pode publicar apenas um texto ou adicionar uma imagem à sua publicação.
                                </p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </>
    );
}
