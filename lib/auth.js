import crypto from 'crypto';

const SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

function b64url(input) {
  return Buffer.from(input).toString('base64').replace(/=+$/,'').replace(/\+/g,'-').replace(/\//g,'_');
}
function b64urlDecode(input) {
  input = input.replace(/-/g,'+').replace(/_/g,'/');
  while (input.length % 4) input += '=';
  return Buffer.from(input, 'base64').toString();
}

export function signToken(payload, expiresInSec = 60*60*24*7) {
  const header = { alg:'HS256', typ:'JWT' };
  const body = { ...payload, iat: Math.floor(Date.now()/1000), exp: Math.floor(Date.now()/1000)+expiresInSec };
  const h = b64url(JSON.stringify(header));
  const p = b64url(JSON.stringify(body));
  const sig = crypto.createHmac('sha256', SECRET).update(`${h}.${p}`).digest('base64').replace(/=+$/,'').replace(/\+/g,'-').replace(/\//g,'_');
  return `${h}.${p}.${sig}`;
}

export function verifyToken(token) {
  try {
    if (!token) return null;
    const [h,p,s] = token.split('.');
    const expected = crypto.createHmac('sha256', SECRET).update(`${h}.${p}`).digest('base64').replace(/=+$/,'').replace(/\+/g,'-').replace(/\//g,'_');
    if (expected !== s) return null;
    const body = JSON.parse(b64urlDecode(p));
    if (body.exp && body.exp < Math.floor(Date.now()/1000)) return null;
    return body;
  } catch { return null; }
}

export function hashPassword(pwd, salt) {
  const s = salt || crypto.randomBytes(16).toString('hex');
  const h = crypto.pbkdf2Sync(pwd, s, 100000, 32, 'sha256').toString('hex');
  return `${s}$${h}`;
}

export function verifyPassword(pwd, stored) {
  if (!stored) return false;
  const [s, h] = stored.split('$');
  const check = crypto.pbkdf2Sync(pwd, s, 100000, 32, 'sha256').toString('hex');
  return check === h;
}

export function getBearer(request) {
  const auth = request.headers.get('authorization') || '';
  if (auth.startsWith('Bearer ')) return auth.substring(7);
  return null;
}

export function requireAdmin(request) {
  const token = getBearer(request);
  const claims = verifyToken(token);
  if (!claims || !['admin','manager','marketing','sales'].includes(claims.role)) return null;
  return claims;
}
