import AdminField from './AdminField';

export default function PasswordFields({ form, current = true, confirm = true }) {
    return (
        <div className="space-y-5">
            {current && (
                <AdminField form={form} name="current_password" label="Senha atual" type="password" required autoComplete="current-password" />
            )}
            <AdminField
                form={form}
                name="password"
                label={current ? 'Nova senha' : 'Senha temporária'}
                type="password"
                required
                minLength={8}
                autoComplete="new-password"
                hint="Use pelo menos 8 caracteres."
            />
            {confirm && (
                <AdminField
                    form={form}
                    name="password_confirmation"
                    label="Confirmar nova senha"
                    type="password"
                    required
                    minLength={8}
                    autoComplete="new-password"
                />
            )}
        </div>
    );
}
