'use client';
import { ContentManager } from '@/components/admin/ContentManager';
export default function AdminTestimonials() {
  return <ContentManager title="Testimonials" description="Manage customer reviews and star ratings." endpoint="testimonials" itemLabel="Testimonial"
    fields={[
      { key: 'name', label: 'Customer Name', primary: true },
      { key: 'location', label: 'Location' },
      { key: 'projectType', label: 'Project Type' },
      { key: 'rating', label: 'Rating (1-5)', type: 'number' },
      { key: 'review', label: 'Review', type: 'textarea' },
      { key: 'photo', label: 'Photo URL' },
    ]}/>;
}
