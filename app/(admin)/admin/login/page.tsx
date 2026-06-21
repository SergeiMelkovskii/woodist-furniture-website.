import { redirect } from 'next/navigation';
import LoginForm from './LoginForm';
import { getSession } from '@/lib/auth';
import Logo from '@/components/Logo';

export default async function LoginPage() {
  const session = await getSession();
  if (session.isAdmin) redirect('/admin');

  return (
    <div className="flex min-h-screen items-center justify-center bg-ink p-6 text-bone">
      <div className="w-full max-w-sm">
        <div className="mb-12 flex justify-center text-bone">
          <Logo />
        </div>
        <div className="bg-bone p-8 text-ink shadow-2xl">
          <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
            Admin sign-in
          </div>
          <h1 className="mt-2 font-display text-3xl tracking-tight">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Enter the admin password to manage the site.
          </p>
          <LoginForm />
        </div>
        <p className="mt-8 text-center text-xs text-bone/50">
          Forgotten the password? Reset <code className="text-bone/70">ADMIN_PASSWORD</code> in your environment.
        </p>
      </div>
    </div>
  );
}
