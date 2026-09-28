import ReadingAuthLayout from '@/layouts/reading-auth-layout';

export default function AuthLayout({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
    return (
        <ReadingAuthLayout title={title} heading={title} subtitle={description}>
            {children}
        </ReadingAuthLayout>
    );
}
