import { createHash } from 'crypto';

export const dynamic = 'force-dynamic';

function probeEnv(name) {
  const val = process.env[name];
  if (!val) {
    return { present: false, length: 0, sha256: null };
  }
  const hash = createHash('sha256').update(val).digest('hex');
  return { present: true, length: val.length, sha256: hash };
}

export async function GET() {
  const report = {
    timestamp: new Date().toISOString(),
    probe: 'fork-preview-env-canary',
    env_vars: {
      FLAGS_SECRET: probeEnv('FLAGS_SECRET'),
      YB_CANARY_ENV_TEST: probeEnv('YB_CANARY_ENV_TEST'),
      VERCEL_ENV: probeEnv('VERCEL_ENV'),
      VERCEL_GIT_REPO_SLUG: probeEnv('VERCEL_GIT_REPO_SLUG'),
      VERCEL_GIT_COMMIT_REF: probeEnv('VERCEL_GIT_COMMIT_REF'),
      VERCEL_GIT_REPO_OWNER: probeEnv('VERCEL_GIT_REPO_OWNER'),
    }
  };
  return Response.json(report);
}
