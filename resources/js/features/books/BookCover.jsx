import { coverUrl } from '@/features/admin/book-utils';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export default function BookCover({ book, className, eager = false }) {
    const [failedUrl, setFailedUrl] = useState(null);
    const src = coverUrl(book.cover_url);

    if (src && src !== failedUrl) {
        return (
            <img
                src={src}
                alt=""
                loading={eager ? 'eager' : 'lazy'}
                decoding="async"
                className={cn('block h-full w-full object-cover', className)}
                onError={() => setFailedUrl(src)}
            />
        );
    }

    return (
        <span aria-label="Sem capa cadastrada" role="img" className={cn('flex h-full w-full items-center justify-center bg-slate-100 text-slate-400', className)}>
            <i className="fa-solid fa-book" aria-hidden="true" />
        </span>
    );
}
