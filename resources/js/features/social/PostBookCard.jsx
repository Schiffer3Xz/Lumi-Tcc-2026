import BookCover from '@/features/books/BookCover';
import BookDetailsLink from '@/features/books/BookDetailsLink';

export default function PostBookCard({ book, preview = false }) {
    const content = (
        <>
            <div className="flex h-16 w-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-slate-800 text-white shadow-xs">
                <BookCover book={book} />
            </div>

            <div className="min-w-0">
                <span className="text-caption-xs font-bold tracking-wider text-blue-600 uppercase">Livro mencionado</span>

                <p className="mt-1 truncate text-xs font-bold text-slate-800">{book.title}</p>

                <p className="text-caption-sm text-slate-500">{book.author || 'Autor não informado'}</p>
            </div>
        </>
    );
    const className = 'flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50/50 p-3';
    return !preview && book.id ? (
        <BookDetailsLink
            bookId={book.id}
            className={`${className} transition-colors hover:bg-blue-50 focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:outline-none`}
        >
            {content}
        </BookDetailsLink>
    ) : (
        <div className={className}>{content}</div>
    );
}
