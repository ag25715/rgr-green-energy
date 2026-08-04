import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { getDb, COL } from '@/lib/db';
import { signToken, verifyPassword, hashPassword, requireAdmin } from '@/lib/auth';
import { DEFAULT_SETTINGS, DEFAULT_CALC, DEFAULT_SOLUTIONS, DEFAULT_PROJECTS, DEFAULT_TESTIMONIALS, DEFAULT_FAQS, DEFAULT_BLOGS } from '@/lib/defaults';
import { computeSolar } from '@/lib/calculator';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function json(data, init = {}) {
  return NextResponse.json(data, { ...init, headers: { ...CORS_HEADERS, ...(init.headers||{}) } });
}

async function ensureSeed() {
  const db = await getDb();
  const settings = await db.collection(COL.settings).findOne({ _id: 'global' });
  if (!settings) await db.collection(COL.settings).insertOne(DEFAULT_SETTINGS);
  const calc = await db.collection(COL.calc).findOne({ _id: 'global' });
  if (!calc) await db.collection(COL.calc).insertOne(DEFAULT_CALC);
  const solCount = await db.collection(COL.solutions).countDocuments();
  if (solCount === 0) {
    await db.collection(COL.solutions).insertMany(DEFAULT_SOLUTIONS.map(s => ({ _id: uuidv4(), ...s, createdAt: new Date().toISOString() })));
  }
  const prjCount = await db.collection(COL.projects).countDocuments();
  if (prjCount === 0) {
    await db.collection(COL.projects).insertMany(DEFAULT_PROJECTS.map(p => ({ _id: uuidv4(), ...p, createdAt: new Date().toISOString() })));
  }
  const tsCount = await db.collection(COL.testimonials).countDocuments();
  if (tsCount === 0) {
    await db.collection(COL.testimonials).insertMany(DEFAULT_TESTIMONIALS.map(t => ({ _id: uuidv4(), ...t, createdAt: new Date().toISOString() })));
  }
  const faqCount = await db.collection(COL.faqs).countDocuments();
  if (faqCount === 0) {
    await db.collection(COL.faqs).insertMany(DEFAULT_FAQS.map(f => ({ _id: uuidv4(), ...f, createdAt: new Date().toISOString() })));
  }
  const blogCount = await db.collection(COL.blogs).countDocuments();
  if (blogCount === 0) {
    await db.collection(COL.blogs).insertMany(DEFAULT_BLOGS.map(b => ({ _id: uuidv4(), ...b, publishedAt: new Date().toISOString(), createdAt: new Date().toISOString() })));
  }
  const userCount = await db.collection(COL.users).countDocuments();
  if (userCount === 0) {
    const email = process.env.ADMIN_EMAIL || 'admin@rgrgreenenergy.com';
    const pwd = process.env.ADMIN_PASSWORD || 'RgrAdmin@2025';
    await db.collection(COL.users).insertOne({ _id: uuidv4(), email, name: 'Administrator', role: 'admin', passwordHash: hashPassword(pwd), createdAt: new Date().toISOString() });
  }
}

let seeded = false;
async function ensureOnce() { if (!seeded) { await ensureSeed(); seeded = true; } }

export async function OPTIONS() { return json({}, { status: 204 }); }

export async function GET(request, { params }) {
  await ensureOnce();
  const path = ((await params).path) || [];
  const [root, ...rest] = path;
  const db = await getDb();
  const url = new URL(request.url);

  try {
    if (!root) return json({ ok: true, service: 'RGR Green Energy API', version: '1.0.0' });

    if (root === 'settings') {
      const s = await db.collection(COL.settings).findOne({ _id: 'global' });
      return json(s || DEFAULT_SETTINGS);
    }
    if (root === 'calculator' && rest[0] === 'settings') {
      const c = await db.collection(COL.calc).findOne({ _id: 'global' });
      return json(c || DEFAULT_CALC);
    }
    if (root === 'solutions') {
      if (rest[0]) {
        const s = await db.collection(COL.solutions).findOne({ slug: rest[0] });
        return s ? json(s) : json({ error: 'Not found' }, { status: 404 });
      }
      const list = await db.collection(COL.solutions).find({}).sort({ createdAt: 1 }).toArray();
      return json(list);
    }
    if (root === 'projects') {
      if (rest[0]) {
        const p = await db.collection(COL.projects).findOne({ slug: rest[0] });
        return p ? json(p) : json({ error: 'Not found' }, { status: 404 });
      }
      const featured = url.searchParams.get('featured');
      const q = featured === 'true' ? { featured: true } : {};
      const list = await db.collection(COL.projects).find(q).sort({ completionYear: -1 }).toArray();
      return json(list);
    }
    if (root === 'blogs') {
      if (rest[0]) {
        const b = await db.collection(COL.blogs).findOne({ slug: rest[0] });
        return b ? json(b) : json({ error: 'Not found' }, { status: 404 });
      }
      const list = await db.collection(COL.blogs).find({ published: { $ne: false } }).sort({ publishedAt: -1 }).toArray();
      return json(list);
    }
    if (root === 'testimonials') {
      const list = await db.collection(COL.testimonials).find({}).sort({ createdAt: 1 }).toArray();
      return json(list);
    }
    if (root === 'faqs') {
      const list = await db.collection(COL.faqs).find({}).sort({ createdAt: 1 }).toArray();
      return json(list);
    }
    if (root === 'jobs') {
      const list = await db.collection(COL.jobs).find({ status: { $ne: 'closed' } }).sort({ createdAt: -1 }).toArray();
      return json(list);
    }

    // ADMIN endpoints
    if (root === 'admin') {
      const claims = requireAdmin(request);
      if (!claims) return json({ error: 'Unauthorized' }, { status: 401 });

      if (rest[0] === 'leads') {
        const list = await db.collection(COL.leads).find({}).sort({ createdAt: -1 }).toArray();
        return json(list);
      }
      if (rest[0] === 'stats') {
        const [leads, projects, blogs, testimonials] = await Promise.all([
          db.collection(COL.leads).countDocuments(),
          db.collection(COL.projects).countDocuments(),
          db.collection(COL.blogs).countDocuments(),
          db.collection(COL.testimonials).countDocuments(),
        ]);
        const today = new Date(); today.setHours(0,0,0,0);
        const todayLeads = await db.collection(COL.leads).countDocuments({ createdAt: { $gte: today.toISOString() } });
        const bySource = await db.collection(COL.leads).aggregate([{ $group: { _id: '$source', count: { $sum: 1 } } }]).toArray();
        const byStatus = await db.collection(COL.leads).aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]).toArray();
        const recentLeads = await db.collection(COL.leads).find({}).sort({ createdAt: -1 }).limit(5).toArray();
        return json({ leads, projects, blogs, testimonials, todayLeads, bySource, byStatus, recentLeads });
      }
      if (rest[0] === 'projects') {
        const list = await db.collection(COL.projects).find({}).sort({ createdAt: -1 }).toArray();
        return json(list);
      }
      if (rest[0] === 'blogs') {
        const list = await db.collection(COL.blogs).find({}).sort({ createdAt: -1 }).toArray();
        return json(list);
      }
      if (rest[0] === 'testimonials') {
        const list = await db.collection(COL.testimonials).find({}).sort({ createdAt: -1 }).toArray();
        return json(list);
      }
      if (rest[0] === 'faqs') {
        const list = await db.collection(COL.faqs).find({}).sort({ createdAt: -1 }).toArray();
        return json(list);
      }
      if (rest[0] === 'solutions') {
        const list = await db.collection(COL.solutions).find({}).sort({ createdAt: -1 }).toArray();
        return json(list);
      }
      if (rest[0] === 'jobs') {
        const list = await db.collection(COL.jobs).find({}).sort({ createdAt: -1 }).toArray();
        return json(list);
      }
      if (rest[0] === 'media') {
        const list = await db.collection(COL.media).find({}).sort({ createdAt: -1 }).toArray();
        return json(list);
      }
      if (rest[0] === 'me') {
        return json({ email: claims.email, role: claims.role, name: claims.name });
      }
    }

    return json({ error: 'Not found' }, { status: 404 });
  } catch (e) {
    console.error('GET error', e);
    return json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  await ensureOnce();
  const path = ((await params).path) || [];
  const [root, ...rest] = path;
  const db = await getDb();

  try {
    if (root === 'auth' && rest[0] === 'login') {
      const { email, password } = await request.json();
      const user = await db.collection(COL.users).findOne({ email: (email||'').toLowerCase().trim() });
      if (!user || !verifyPassword(password || '', user.passwordHash)) {
        return json({ error: 'Invalid credentials' }, { status: 401 });
      }
      const token = signToken({ sub: user._id, email: user.email, role: user.role, name: user.name });
      return json({ token, user: { email: user.email, role: user.role, name: user.name } });
    }

    if (root === 'calculator' && rest[0] === 'compute') {
      const body = await request.json();
      const settings = (await db.collection(COL.calc).findOne({ _id: 'global' })) || DEFAULT_CALC;
      const result = computeSolar(body, settings);
      // Optional: capture lead if contact info sent
      if (body.name || body.phone || body.email) {
        await db.collection(COL.leads).insertOne({
          _id: uuidv4(),
          name: body.name || '',
          phone: body.phone || '',
          email: body.email || '',
          location: body.location || '',
          customerType: body.customerType || '',
          source: 'CALCULATOR',
          status: 'NEW',
          notes: '',
          payload: { input: body, result },
          createdAt: new Date().toISOString(),
        });
      }
      return json(result);
    }

    if (root === 'leads') {
      const body = await request.json();
      const lead = {
        _id: uuidv4(),
        name: body.name || '',
        phone: body.phone || '',
        email: body.email || '',
        location: body.location || '',
        customerType: body.customerType || '',
        message: body.message || '',
        source: (body.source || 'CONTACT').toUpperCase(),
        status: 'NEW',
        notes: '',
        payload: body.payload || {},
        createdAt: new Date().toISOString(),
      };
      await db.collection(COL.leads).insertOne(lead);
      return json({ ok: true, id: lead._id });
    }

    if (root === 'jobs' && rest[0] === 'apply') {
      const body = await request.json();
      const app = { _id: uuidv4(), ...body, createdAt: new Date().toISOString() };
      await db.collection(COL.applications).insertOne(app);
      await db.collection(COL.leads).insertOne({ _id: uuidv4(), name: body.name || '', phone: body.phone || '', email: body.email || '', message: `Applied for: ${body.jobTitle||''}`, source: 'CAREER', status: 'NEW', createdAt: new Date().toISOString() });
      return json({ ok: true, id: app._id });
    }

    // ADMIN protected
    if (root === 'admin') {
      const claims = requireAdmin(request);
      if (!claims) return json({ error: 'Unauthorized' }, { status: 401 });
      const body = await request.json().catch(()=>({}));

      if (rest[0] === 'projects') {
        const doc = { _id: uuidv4(), createdAt: new Date().toISOString(), ...body };
        await db.collection(COL.projects).insertOne(doc);
        return json(doc);
      }
      if (rest[0] === 'blogs') {
        const doc = { _id: uuidv4(), createdAt: new Date().toISOString(), publishedAt: new Date().toISOString(), published: true, ...body };
        await db.collection(COL.blogs).insertOne(doc);
        return json(doc);
      }
      if (rest[0] === 'testimonials') {
        const doc = { _id: uuidv4(), createdAt: new Date().toISOString(), ...body };
        await db.collection(COL.testimonials).insertOne(doc);
        return json(doc);
      }
      if (rest[0] === 'faqs') {
        const doc = { _id: uuidv4(), createdAt: new Date().toISOString(), ...body };
        await db.collection(COL.faqs).insertOne(doc);
        return json(doc);
      }
      if (rest[0] === 'solutions') {
        const doc = { _id: uuidv4(), createdAt: new Date().toISOString(), ...body };
        await db.collection(COL.solutions).insertOne(doc);
        return json(doc);
      }
      if (rest[0] === 'jobs') {
        const doc = { _id: uuidv4(), createdAt: new Date().toISOString(), status: 'open', ...body };
        await db.collection(COL.jobs).insertOne(doc);
        return json(doc);
      }
      if (rest[0] === 'media') {
        const doc = { _id: uuidv4(), createdAt: new Date().toISOString(), ...body };
        await db.collection(COL.media).insertOne(doc);
        return json(doc);
      }
    }

    return json({ error: 'Not found' }, { status: 404 });
  } catch (e) {
    console.error('POST error', e);
    return json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  const claims = requireAdmin(request);
  if (!claims) return json({ error: 'Unauthorized' }, { status: 401 });
  const path = ((await params).path) || [];
  const [root, ...rest] = path;
  const db = await getDb();
  const body = await request.json().catch(()=>({}));

  try {
    if (root === 'admin') {
      // Update global docs
      if (rest[0] === 'settings') {
        body.updatedAt = new Date().toISOString();
        await db.collection(COL.settings).updateOne({ _id: 'global' }, { $set: body }, { upsert: true });
        const s = await db.collection(COL.settings).findOne({ _id: 'global' });
        return json(s);
      }
      if (rest[0] === 'calculator') {
        body.updatedAt = new Date().toISOString();
        await db.collection(COL.calc).updateOne({ _id: 'global' }, { $set: body }, { upsert: true });
        const c = await db.collection(COL.calc).findOne({ _id: 'global' });
        return json(c);
      }
      // Update by id
      const map = { projects: COL.projects, blogs: COL.blogs, testimonials: COL.testimonials, faqs: COL.faqs, solutions: COL.solutions, leads: COL.leads, jobs: COL.jobs };
      const col = map[rest[0]];
      if (col && rest[1]) {
        body.updatedAt = new Date().toISOString();
        delete body._id;
        await db.collection(col).updateOne({ _id: rest[1] }, { $set: body });
        const doc = await db.collection(col).findOne({ _id: rest[1] });
        return json(doc);
      }
    }
    return json({ error: 'Not found' }, { status: 404 });
  } catch (e) {
    console.error('PUT error', e);
    return json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  const claims = requireAdmin(request);
  if (!claims) return json({ error: 'Unauthorized' }, { status: 401 });
  const path = ((await params).path) || [];
  const [root, ...rest] = path;
  const db = await getDb();
  try {
    if (root === 'admin') {
      const map = { projects: COL.projects, blogs: COL.blogs, testimonials: COL.testimonials, faqs: COL.faqs, solutions: COL.solutions, leads: COL.leads, jobs: COL.jobs, media: COL.media };
      const col = map[rest[0]];
      if (col && rest[1]) {
        await db.collection(col).deleteOne({ _id: rest[1] });
        return json({ ok: true });
      }
    }
    return json({ error: 'Not found' }, { status: 404 });
  } catch (e) {
    return json({ error: e.message || 'Server error' }, { status: 500 });
  }
}

export const dynamic = 'force-dynamic';
