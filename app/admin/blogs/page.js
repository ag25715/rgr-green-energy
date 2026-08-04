'use client';
import { ContentManager } from '@/components/admin/ContentManager';
export default function AdminBlogs() {
  return <ContentManager title="Blogs" description="Publish articles, guides and news." endpoint="blogs" itemLabel="Blog Post"
    fields={[
      { key: 'title', label: 'Title', primary: true },
      { key: 'slug', label: 'Slug (URL)' },
      { key: 'category', label: 'Category' },
      { key: 'excerpt', label: 'Excerpt', type: 'textarea', rows: 2 },
      { key: 'featuredImage', label: 'Featured Image URL' },
      { key: 'author', label: 'Author' },
      { key: 'tags', label: 'Tags (comma separated)', type: 'tags' },
      { key: 'content', label: 'Content (HTML)', type: 'html' },
      { key: 'seoTitle', label: 'SEO Title' },
      { key: 'seoDescription', label: 'SEO Description', type: 'textarea', rows: 2 },
    ]}/>;
}
