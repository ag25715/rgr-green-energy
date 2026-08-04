'use client';
import { ContentManager } from '@/components/admin/ContentManager';
export default function AdminProjects() {
  return <ContentManager title="Projects" description="Add, edit and delete showcase projects." endpoint="projects" itemLabel="Project"
    fields={[
      { key: 'title', label: 'Title', primary: true },
      { key: 'slug', label: 'Slug (URL)' },
      { key: 'location', label: 'Location' },
      { key: 'category', label: 'Category', type: 'select', options: ['RESIDENTIAL','COMMERCIAL','INDUSTRIAL','AGRICULTURE'] },
      { key: 'capacityKWp', label: 'Capacity (kWp)', type: 'number' },
      { key: 'technology', label: 'Technology', type: 'select', options: ['On-Grid','Off-Grid','Hybrid','Ground-Mount','Carport'] },
      { key: 'completionYear', label: 'Completion Year', type: 'number' },
      { key: 'estimatedAnnualGenerationKWh', label: 'Est. Annual Generation (kWh)', type: 'number' },
      { key: 'image', label: 'Featured Image URL' },
      { key: 'challenge', label: 'The Challenge', type: 'textarea' },
      { key: 'solution', label: 'The Solution', type: 'textarea' },
      { key: 'featured', label: 'Featured on Home (true/false)' },
    ]}/>;
}
