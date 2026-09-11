import { cn } from '@/lib/utils';
import BookCard from './BookCard';

const GRID_COLUMNS = {
    featured: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4',
    catalog: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6',
};

export default function BookGrid({ books, variant = 'catalog', className, emptyState, cardProps }) {
    if (books.length === 0) return emptyState;

    return (
        <div className={cn('mb-8 grid gap-4', GRID_COLUMNS[variant], className)}>
            {books.map((book) => (
                <BookCard key={book.id} book={book} variant={variant} {...cardProps} />
            ))}
        </div>
    );
}
