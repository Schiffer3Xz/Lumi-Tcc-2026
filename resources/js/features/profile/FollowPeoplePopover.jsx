import { Link } from '@inertiajs/react';
import { useState } from 'react';

function PersonRow({ person }) {
    return (
        <Link
            href={route('people', person.id)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-2 text-left hover:bg-slate-50 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
            <span className="flex size-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-sm font-bold text-slate-700">
                {person.profile_photo ? (
                    <img src={person.profile_photo} alt="" className="h-full w-full object-cover" />
                ) : (
                    person.name?.charAt(0).toUpperCase() ?? 'U'
                )}
            </span>
            <span className="min-w-0">
                <span className="block truncate text-sm font-semibold text-slate-900">{person.name}</span>
                {person.nickname && <span className="block truncate text-xs text-slate-500">@{person.nickname.replace(/^@/, '')}</span>}
            </span>
        </Link>
    );
}

export default function FollowPeoplePopover({ label, people = [], count = people.length }) {
    const [open, setOpen] = useState(false);

    return (
        <div
            className="relative"
            onMouseEnter={() => setOpen(true)}
            onMouseLeave={() => setOpen(false)}
            onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) setOpen(false);
            }}
            onKeyDown={(event) => {
                if (event.key === 'Escape') setOpen(false);
            }}
        >
            <button
                type="button"
                aria-haspopup="dialog"
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
                className="inline-flex items-center gap-1 rounded-md text-slate-600 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
                <span className="text-sm font-bold text-slate-900">{count}</span>
                <span>{label}</span>
            </button>
            {open && (
                <section
                    role="dialog"
                    aria-label={label}
                    className="absolute bottom-full left-0 z-50 mb-2 w-64 max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200 bg-white p-2 text-slate-900 shadow-xl"
                >
                    <h3 className="px-2 py-1.5 text-sm font-bold text-black">{label}</h3>
                    <div className="max-h-64 overflow-y-auto">
                        {people.length ? (
                            people.map((person) => <PersonRow key={person.id} person={person} />)
                        ) : (
                            <p className="px-2 py-3 text-sm text-slate-600">Ninguém por aqui ainda.</p>
                        )}
                    </div>
                </section>
            )}
        </div>
    );
}
