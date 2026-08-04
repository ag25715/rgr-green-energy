export const metadata = { title: 'Terms & Conditions' };
export default function Terms() {
  return (
    <div className="container-x max-w-3xl py-24 prose prose-navy">
      <h1 className="text-4xl font-bold text-navy-900">Terms & Conditions</h1>
      <p className="text-navy-600">Last updated: {new Date().toLocaleDateString('en-IN')}</p>
      <p>By using this website, you agree to these terms. Content is provided for informational purposes. Calculator estimates are indicative and subject to a final site survey.</p>
      <h2>Intellectual Property</h2><p>All content, branding and imagery is owned by RGR Green Energy or its licensors.</p>
      <h2>Warranties</h2><p>Product warranties are governed by the terms of each individual proposal.</p>
      <h2>Limitation of Liability</h2><p>To the extent permitted by law, RGR Green Energy is not liable for indirect or consequential damages arising from use of this website.</p>
      <p>This page is fully editable from the Admin Panel.</p>
    </div>
  );
}
