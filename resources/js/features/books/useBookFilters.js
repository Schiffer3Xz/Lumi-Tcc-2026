import { router } from '@inertiajs/react';
import { useEffect, useRef, useState } from 'react';

export default function useBookFilters(routeName, filters, only, { filterKey = 'genre', all = 'Todos' } = {}) {
    const filter = filters[filterKey];
    const [query, setQuery] = useState(filters.q);
    const [genre, setGenre] = useState(filter || all);
    const timeout = useRef(null);
    const request = useRef(null);

    useEffect(() => {
        setQuery((current) => current.trim() === filters.q ? current : filters.q);
        setGenre(filter || all);
    }, [filters.q, filter, all]);

    useEffect(() => () => {
        clearTimeout(timeout.current);
        request.current?.cancel();
    }, []);

    function visit(nextQuery, nextGenre, page, options = {}) {
        clearTimeout(timeout.current);
        request.current?.cancel();
        const params = {};
        if (nextQuery.trim()) params.q = nextQuery.trim();
        if (nextGenre !== all) params[filterKey] = nextGenre;
        if (page > 1) params.page = page;

        const navigate = () => router.get(route(routeName), params, {
            only,
            preserveState: true,
            preserveScroll: true,
            replace: options.debounce === true,
            onCancelToken: (token) => { request.current = token; },
            onSuccess: options.onSuccess,
        });

        if (options.debounce) timeout.current = setTimeout(navigate, 250);
        else navigate();
    }

    return {
        query,
        genre,
        changeQuery(value) {
            setQuery(value);
            visit(value, genre, 1, { debounce: true });
        },
        changeGenre(value) {
            setGenre(value);
            visit(query, value, 1);
        },
        changePage(page, onSuccess) {
            visit(query, genre, page, { onSuccess });
        },
        reset() {
            setQuery('');
            setGenre(all);
            visit('', all, 1);
        },
    };
}
