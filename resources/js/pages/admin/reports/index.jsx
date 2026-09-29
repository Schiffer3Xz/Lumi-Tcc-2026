import AdminPageHeader from '@/features/admin/AdminPageHeader';
import AdminPagination from '@/features/admin/AdminPagination';
import ReportFilters from '@/features/admin/reports/ReportFilters';
import ReportReviewDialog from '@/features/admin/reports/ReportReviewDialog';
import ReportTable from '@/features/admin/reports/ReportTable';
import AdminLayout from '@/layouts/admin-layout';
import { useState } from 'react';

export default function Reports({ reports, filters, counts }) {
    const [selectedId, setSelectedId] = useState(null);
    const selectedReport = reports.data.find((report) => report.id === selectedId);
    return (
        <AdminLayout title="Denúncias" section="reports">
            <AdminPageHeader title="Denúncias" description="Acompanhe os relatos da comunidade e registre a análise da equipe." />
            <ReportFilters key={`${filters.status}-${filters.q}`} filters={filters} counts={counts} />
            <ReportTable reports={reports.data} onReview={setSelectedId} />
            <AdminPagination pagination={reports} />
            <ReportReviewDialog key={selectedReport?.id ?? 'closed'} report={selectedReport} onClose={() => setSelectedId(null)} />
        </AdminLayout>
    );
}
