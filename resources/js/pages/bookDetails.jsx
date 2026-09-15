import BookDetailsContent from '@/features/books/BookDetailsContent';
import ReaderLayout from '@/layouts/reader-layout';

export default function BookDetails({ book, similarBooks = [], comments = [], auth }) {
    return (
        <ReaderLayout
            title="Detalhes do livro"
            user={auth.user}
            activeItem="biblioteca"
            variant="library"
            topbar={{ title: 'Detalhes do livro', subtitle: 'Informações detalhadas do catálogo da biblioteca.' }}
        >
            <BookDetailsContent key={book.id} book={book} similarBooks={similarBooks} comments={comments} />
        </ReaderLayout>
    );
}
