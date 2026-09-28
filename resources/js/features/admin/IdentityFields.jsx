import AdminField from './AdminField';

export default function IdentityFields({ form }) {
    return (
        <div className="grid gap-5 sm:grid-cols-2">
            <AdminField form={form} name="name" label="Nome completo" required maxLength={255} autoComplete="name" />
            <AdminField form={form} name="nickname" label="Nome de usuário" required maxLength={255} autoComplete="username" />
        </div>
    );
}
