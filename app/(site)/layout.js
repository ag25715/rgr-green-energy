import { SiteHeader } from '@/components/site/Header';
import { SiteFooter } from '@/components/site/Footer';
import { fetchSettings } from '@/lib/fetchSettings';

export default async function PublicLayout({ children }) {
  const settings = await fetchSettings();
  return (
    <>
      <SiteHeader settings={settings} />
      <main>{children}</main>
      <SiteFooter settings={settings} />
    </>
  );
}
