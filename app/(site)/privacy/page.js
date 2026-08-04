export const metadata = { title: 'Privacy Policy' };
export default function Privacy() {
  return (
    <div className="container-x max-w-3xl py-24 prose prose-navy">
      <h1 className="text-4xl font-bold text-navy-900">Privacy Policy</h1>
      <p className="text-navy-600">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
      <p>RGR Green Energy respects your privacy. We collect only the information you provide via forms (name, contact details, project location) to respond to your enquiry and provide services.</p>
      <h2>What we collect</h2><ul><li>Contact details you submit</li><li>Solar bill and location for calculator estimates</li><li>Standard analytics data (page views)</li></ul>
      <h2>How we use it</h2><ul><li>To respond to your enquiries</li><li>To prepare tailored solar proposals</li><li>To improve our services</li></ul>
      <h2>Your rights</h2><p>You may request access, correction or deletion of your data by writing to us at <em>the email address on our Contact page</em>. This page is fully editable from the Admin Panel.</p>
    </div>
  );
}
