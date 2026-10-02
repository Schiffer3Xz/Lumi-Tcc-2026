import { Link, usePage } from '@inertiajs/react';
import * as Dropdown from '@radix-ui/react-dropdown-menu';

export default function AdminTopbar({ isMenuOpen, onMenuToggle }) {
    const { auth } = usePage().props;
    return (
        <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between gap-3 border-b border-slate-200/80 bg-white/95 px-4 backdrop-blur-md sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                <button
                    type="button"
                    onClick={onMenuToggle}
                    aria-controls="admin-sidebar"
                    aria-expanded={isMenuOpen}
                    aria-label="Abrir navegação"
                    className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 lg:hidden"
                >
                    <i className="fa-solid fa-bars text-xl" aria-hidden="true" />
                </button>
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <i className="fa-solid fa-book-open" aria-hidden="true" />
                </div>
                <div>
                    <p className="text-sm font-bold text-slate-800">Sala de Leitura</p>
                    <p className="hidden text-caption text-slate-500 sm:block">Plataforma Escolar Web</p>
                </div>
            </div>
            <div className="flex items-center gap-3">
                <span className="hidden rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-caption-sm font-bold text-blue-600 sm:block">
                    ADMINISTRADOR
                </span>
                <Dropdown.Root>
                    <Dropdown.Trigger
                        className="flex items-center gap-2 rounded-full border border-slate-200 p-1 pr-3 text-slate-700 hover:bg-slate-50"
                        aria-label="Menu da conta"
                    >
                        <span className="bg-lumi-navy flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold text-white">
                            {auth.user.name.slice(0, 1).toLocaleUpperCase('pt-BR')}
                        </span>
                        <span className="hidden max-w-36 truncate text-xs font-semibold sm:block">{auth.user.name}</span>
                        <i className="fa-solid fa-chevron-down text-caption-sm" aria-hidden="true" />
                    </Dropdown.Trigger>
                    <Dropdown.Portal>
                        <Dropdown.Content
                            align="end"
                            sideOffset={8}
                            className="z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 text-sm text-slate-700 shadow-xl"
                        >
                            <Dropdown.Label className="truncate px-3 py-2 font-semibold">{auth.user.name}</Dropdown.Label>
                            <Dropdown.Item asChild>
                                <Link
                                    href={route('admin.settings.index')}
                                    className="block rounded-lg px-3 py-2 outline-none data-[highlighted]:bg-slate-100"
                                >
                                    Configurações
                                </Link>
                            </Dropdown.Item>
                            <Dropdown.Item asChild>
                                <Link
                                    href={route('logout')}
                                    method="post"
                                    as="button"
                                    className="w-full rounded-lg px-3 py-2 text-left text-red-600 outline-none data-[highlighted]:bg-red-50"
                                >
                                    Sair da conta
                                </Link>
                            </Dropdown.Item>
                        </Dropdown.Content>
                    </Dropdown.Portal>
                </Dropdown.Root>
            </div>
        </header>
    );
}
