// Fix all s3-files.storedFile documents that have the wrong Amazon URL
// Run: node scripts/fix-r2-urls.mjs

const PROJECT_ID = '6m6rw2f8';
const DATASET = 'production';
const R2_BASE = 'https://pub-53dfba8fed9d48d3b927c25e22eb9cb1.r2.dev';

// Get token from env or pass as argument
const TOKEN = process.env.SANITY_TOKEN || process.argv[2];

if (!TOKEN) {
  console.error('Usage: SANITY_TOKEN=<token> node scripts/fix-r2-urls.mjs');
  console.error('Get a token from: https://www.sanity.io/manage/personal/project/6m6rw2f8/api#tokens');
  process.exit(1);
}

const API = `https://${PROJECT_ID}.api.sanity.io/v2023-01-01/data`;

async function query(groq) {
  const url = `${API}/query/${DATASET}?query=${encodeURIComponent(groq)}`;
  const res = await fetch(url, { headers: { Authorization: `Bearer ${TOKEN}` } });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json.result;
}

async function patch(id, fileURL) {
  const mutations = [{
    patch: {
      id,
      set: { fileURL }
    }
  }];
  const res = await fetch(`${API}/mutate/${DATASET}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ mutations }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(JSON.stringify(json));
  return json;
}

async function main() {
  console.log('Fetching all s3-files.storedFile documents...');
  const docs = await query('*[_type == "s3-files.storedFile"] { _id, fileURL, s3 }');
  console.log(`Found ${docs.length} documents`);

  const broken = docs.filter(d => d.fileURL && d.fileURL.includes('amazonaws.com'));
  console.log(`Found ${broken.length} with broken Amazon URL`);

  for (const doc of broken) {
    const key = doc.s3?.key || doc.fileURL.split('/').pop();
    const newURL = `${R2_BASE}/${key}`;
    console.log(`Fixing ${doc._id}: ${doc.fileURL} → ${newURL}`);
    await patch(doc._id, newURL);
  }

  // Also publish all patched drafts
  const drafts = broken
    .filter(d => d._id.startsWith('drafts.'))
    .map(d => d._id.replace('drafts.', ''));

  if (drafts.length > 0) {
    console.log(`Publishing ${drafts.length} drafts...`);
    const mutations = drafts.map(id => ({ publish: { id } }));
    await fetch(`${API}/mutate/${DATASET}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ mutations }),
    });
  }

  console.log('Done! ✅');
}

main().catch(console.error);
