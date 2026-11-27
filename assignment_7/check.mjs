import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { resolve } from 'node:path';
import { findings, permissions, defaults, endpoints, trace } from './content.mjs';
import { commonErrors, details } from './details.mjs';

assert.equal(details.length,10);
assert.equal(new Set(findings.map(f=>f.id)).size,findings.length);
for(const f of findings) for(const key of ['location','title','principle','consequence','fix','severity']) assert(f[key],f.id+' missing '+key);
const permCodes=new Set(permissions.map(p=>p[0]));
assert.equal(permCodes.size,21);
for(const codes of Object.values(defaults)) {
  assert.equal(new Set(codes).size,codes.length);
  for(const code of codes) assert(permCodes.has(code),'Unknown permission '+code);
}
assert.deepEqual(new Set(defaults.super_admin),permCodes);
assert(!defaults.user_manager.includes('users.delete'));
assert(!defaults.user_manager.includes('roles.permissions.update'));
assert(!defaults.auditor.includes('users.update'));
assert.deepEqual(defaults.member,['profile.read','profile.update','password.change']);
for(const kind of ['FR','BR']) for(let n=1;n<=9;n++) assert(trace.some(r=>r[0]===`${kind}-${String(n).padStart(2,'0')}`));
assert.equal(new Set(endpoints.map(e=>e[0]+' '+e[1])).size,endpoints.length);
for(const e of endpoints) if(!e[1].startsWith('/auth/')) assert(permCodes.has(e[3]),'Endpoint missing known permission '+e[1]);
for(const [m,p] of [['POST','/auth/login'],['GET','/users'],['POST','/users'],['PUT','/users/{userId}/roles/{roleId}'],['PUT','/roles/{roleId}/permissions'],['DELETE','/roles/{roleId}']]) assert(details.some(d=>d.method===m&&d.path===p),'Missing mandatory endpoint '+p);
const parseBody=s=>{const i=s.indexOf('\n\n'); return i<0?null:JSON.parse(s.slice(i+2));};
for(const d of details) {
  const endpoint=endpoints.find(e=>e[0]===d.method&&e[1]===d.path);
  assert(endpoint,'Detailed contract not in endpoint catalog: '+d.id);
  assert(d.response.startsWith('HTTP/1.1 '+endpoint[4]));
  if(endpoint[4]==='204') assert.equal(parseBody(d.response),null);
  else assert(parseBody(d.response).data);
  const error=parseBody(d.errorExample).error;
  assert(error.code&&error.message&&error.requestId&&Array.isArray(error.details));
  const status=Number(d.errorExample.split(' ')[1]);
  assert([...commonErrors,...d.errors].some(e=>e[0]===status));
  const body=parseBody(d.request);
  if(body&&d.id==='replace-permissions') for(const code of body.permissions) assert(permCodes.has(code));
}
const html=await readFile('public/assignment_7/index.html','utf8');
const ids=[...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
assert.equal(new Set(ids).size,ids.length,'Duplicate HTML id');
assert.equal((html.match(/class="endpoint"/g)||[]).length,10);
assert.equal((html.match(/class="finding"/g)||[]).length,28);
assert.match(html,/<html lang="vi">/);
for(const match of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
  const ref=match[1];
  if(/^(https?:|data:)/.test(ref)) continue;
  if(ref.startsWith('#')) assert(ids.includes(ref.slice(1)),'Missing anchor '+ref);
  else assert((await stat(resolve('public/assignment_7',ref))).isFile(),'Missing local file '+ref);
}
console.log(`Report verified: ${findings.length} complete findings; ${permCodes.size} permissions; ${endpoints.length} unique endpoints; 10 valid request/response contracts; all 18 FR/BR requirements; local links/anchors OK.`);
