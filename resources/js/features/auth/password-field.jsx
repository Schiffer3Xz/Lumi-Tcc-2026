import { Eye, EyeOff, Lock } from 'lucide-react';
import { useState } from 'react';
import AuthField from './auth-field';

/** @param {import('react').ComponentProps<typeof AuthField>} props */
export default function PasswordField({ id, label, ...props }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <AuthField
            {...props}
            id={id}
            label={label}
            icon={Lock}
            type={showPassword ? 'text' : 'password'}
            endAdornment={
                <button
                    type="button"
                    onClick={() => setShowPassword((visible) => !visible)}
                    aria-label={`${showPassword ? 'Ocultar' : 'Mostrar'} ${label.toLowerCase()}`}
                    aria-pressed={showPassword}
                    aria-controls={id}
                    className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-slate-500 hover:text-slate-700"
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            }
        />
    );
}
