const crypto = require('crypto');

// Build-time env var probe - log presence, length, and hash only (never raw values)
const envProbe = {};
const targets = ['FLAGS_SECRET', 'YB_CANARY_ENV_TEST', 'VERCEL_ENV', 'VERCEL_GIT_REPO_OWNER', 'VERCEL_GIT_COMMIT_REF'];

for (const name of targets) {
  const val = process.env[name];
  if (val) {
    const hash = crypto.createHash('sha256').update(val).digest('hex').slice(0, 16);
    envProbe[name] = { present: true, length: val.length, sha256_prefix: hash };
  } else {
    envProbe[name] = { present: false };
  }
}

console.log('=== BUILD-TIME ENV PROBE ===');
console.log(JSON.stringify(envProbe, null, 2));
console.log('=== END ENV PROBE ===');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Embed probe results as public env vars for runtime access too
  env: {
    BUILD_ENV_PROBE: JSON.stringify(envProbe),
  },
};
module.exports = nextConfig;
