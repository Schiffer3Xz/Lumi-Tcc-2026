import BookCover from '@/features/books/BookCover';
import LibraryDrawer from './LibraryDrawer';

export default function ReadingProgressOverview({ readingProgress, onClose }) {
    return (
        <LibraryDrawer title="Livros em progresso" eyebrow="Minhas leituras" onClose={onClose}>
            <div className="min-h-0 flex-1 overflow-y-auto">
                {readingProgress.length ? (
                    <div className="grid grid-cols-2 gap-x-5 gap-y-7 p-1">
                        {readingProgress.map(({ id, book, current_page }) => {
                            const pages = Number(book.page_count) || 0;
                            const currentPage = Number(current_page) || 0;
                            const percentage = pages > 0 ? Math.round(Math.max(0, Math.min(1, currentPage / pages)) * 100) : 0;

                            return (
                                <figure key={id} className="min-w-0">
                                    <div className="aspect-[2/3] overflow-hidden rounded-xl bg-slate-100 shadow-md">
                                        <BookCover book={book} />
                                    </div>
                                    <figcaption className="mt-3 text-center text-lg font-bold text-slate-800">
                                        <span className="sr-only">{book.title}: </span>
                                        {percentage}%<span className="sr-only"> lido</span>
                                    </figcaption>
                                </figure>
                            );
                        })}
                    </div>
                ) : (
                    <p className="py-12 text-center text-sm text-slate-500">Você ainda não adicionou livros ao progresso de leitura.</p>
                )}
            </div>
        </LibraryDrawer>
    );
}
