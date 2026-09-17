import { usePage } from '@inertiajs/react';
import { createContext, useContext } from 'react';

export const BookDetailsContext = createContext(null);

export default function BookDetailsLink({ bookId, children, onClick, ...props }) {
    const openBook = useContext(BookDetailsContext);
    const { auth } = usePage().props;
    return (
        <a
            {...props}
            href={route('book.show', bookId)}
            onClick={(event) => {
                onClick?.(event);
                if (
                    !openBook ||
                    !auth?.user ||
                    event.defaultPrevented ||
                    event.button !== 0 ||
                    event.ctrlKey ||
                    event.metaKey ||
                    event.shiftKey ||
                    event.altKey ||
                    props.target === '_blank'
                )
                    return;
                event.preventDefault();
                openBook(bookId, event.currentTarget);
            }}
        >
            {children}
        </a>
    );
}
