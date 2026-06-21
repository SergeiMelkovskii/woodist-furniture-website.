import { redirect } from 'next/navigation';
import AdminShell from '@/components/admin/AdminShell';
import SettingsForm from './SettingsForm';
import { getSession } from '@/lib/auth';
import { getSettings } from '@/lib/content';

export default async function SettingsAdmin() {
  const session = await getSession();
  if (!session.isAdmin) redirect('/admin/login');

  const settings = await getSettings();

  return (
    <AdminShell>
      <div className="mb-10">
        <div className="text-xs font-medium uppercase tracking-widest text-ink/50">
          Site
        </div>
        <h1 className="mt-2 font-display text-4xl tracking-tight">Site Settings</h1>
        <p className="mt-2 text-ink/60">
          Edit the hero, contact details, about text, and the craftsmanship process steps shown on the home page.
        </p>
      </div>
      <SettingsForm initial={settings} />
    </AdminShell>
  );
}
