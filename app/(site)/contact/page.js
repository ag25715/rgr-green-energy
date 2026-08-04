import ContactClient from './ContactClient';
import { fetchSettings } from '@/lib/fetchSettings';
export const metadata = { title: 'Contact' };
export default async function ContactPage() {
  const settings = await fetchSettings();
  return <ContactClient settings={settings}/>;
}
