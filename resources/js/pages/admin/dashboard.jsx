import AdminPageHeader from '@/features/admin/AdminPageHeader';
import AdminStatCard from '@/features/admin/AdminStatCard';
import GenreChart from '@/features/admin/GenreChart';
import AdminLayout from '@/layouts/admin-layout';

export default function Dashboard(props) {
    const stats = [
        ['Livros', props.totalBooks, 'fa-book'],
        ['Autores', props.totalAuthors, 'fa-user'],
        ['Gêneros', props.totalGenres, 'fa-tags'],
        ['Disponíveis', props.totalBooksAvailable, 'fa-check'],
        ['Indisponíveis', props.totalBooksUnavailable, 'fa-xmark'],
        ['Emprestados', props.totalBooksBorrowed, 'fa-book-open'],
        ['Cadastrados no mês', props.totalBooksPerMonth, 'fa-calendar'],
    ];
    return (
        <AdminLayout title="Painel administrativo">
            <AdminPageHeader title="Seu acervo em um só lugar." description="Acompanhe os livros, autores e atividades da Sala de Leitura." />
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 xl:grid-cols-7">
                {stats.map(([label, value, icon]) => (
                    <AdminStatCard key={label} label={label} value={value} icon={icon} />
                ))}
            </div>
            <GenreChart genres={props.totalBooksByGenre} />
        </AdminLayout>
    );
}
