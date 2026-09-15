import EmptyState from '@/components/shared/EmptyState';
import SectionHeader from '@/components/shared/SectionHeader';
import BookGrid from '@/features/books/BookGrid';
import ShelfBookPicker from '@/features/books/ShelfBookPicker';
import ReaderLayout from '@/layouts/reader-layout';

export default function Estante({ books = [], availableBooks = [], auth }) {
    const user = auth?.user ?? { name: 'Usuário', email: '' };

    return (
        <ReaderLayout
            title="Minha Estante"
            user={user}
            activeItem="estante"
            variant="library"
            topbar={{ title: 'Minha estante', subtitle: 'Os livros que você favoritou ficam reunidos aqui.' }}
        >
            <div className="w-full">
                <div className="mb-8 rounded-3xl bg-[#1A2332] px-6 py-7 text-white shadow-sm sm:px-8">
                    <div className="flex items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-300/15 text-yellow-300">
                            <i className="fa-solid fa-book-bookmark text-xl" aria-hidden="true" />
                        </div>
                        <div>
                            <p className="text-sm text-slate-300">Olá, {user.name}!</p>
                            <h1 className="mt-1 text-2xl font-bold">Seus livros favoritos</h1>
                            <p className="mt-2 text-sm text-slate-300">
                                {books.length === 1
                                    ? 'Você tem 1 livro guardado na estante.'
                                    : `Você tem ${books.length} livros guardados na estante.`}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <SectionHeader title="Minha estante" className="mb-0 flex-wrap justify-start gap-3">
                        <span className="text-xs font-semibold text-gray-400">
                            {books.length} {books.length === 1 ? 'livro favorito' : 'livros favoritos'}
                        </span>
                    </SectionHeader>
                    <ShelfBookPicker books={availableBooks} />
                </div>

                <BookGrid
                    books={books}
                    emptyState={
                        <EmptyState
                            title="Sua estante está vazia"
                            description="Use Adicionar à estante para escolher livros ou favorite-os no catálogo."
                            icon="fa-solid fa-book-bookmark"
                            className="mb-8 p-12"
                        />
                    }
                />
            </div>
        </ReaderLayout>
    );
}
