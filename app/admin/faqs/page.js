'use client';
import { ContentManager } from '@/components/admin/ContentManager';
export default function AdminFaqs() {
  return <ContentManager title="FAQs" description="Frequently asked questions shown on the site." endpoint="faqs" itemLabel="FAQ"
    fields={[
      { key: 'question', label: 'Question', primary: true },
      { key: 'category', label: 'Category' },
      { key: 'answer', label: 'Answer', type: 'textarea' },
    ]}/>;
}
