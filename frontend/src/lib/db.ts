import { neon } from '@neondatabase/serverless';

const databaseUrl = process.env.DATABASE_URL;
export const isDatabaseConfigured = Boolean(databaseUrl);

/**
 * Keep builds and catalogue browsing usable before Neon is configured.
 * Product routes use their persistent local JSON store in this mode; the
 * remaining database-backed routes return an empty result instead of taking
 * down the whole application during startup or deployment.
 */
function createUnconfiguredSqlClient() {
  let hasWarned = false;

  return async function unconfiguredSql(
    _strings: TemplateStringsArray,
    ..._values: unknown[]
  ): Promise<any[]> {
    if (!hasWarned) {
      console.warn(
        'DATABASE_URL is not configured; database-backed features are running in local fallback mode.'
      );
      hasWarned = true;
    }

    return [];
  };
}

// Initialize Neon when configured; otherwise use the local development client.
export const sql = databaseUrl ? neon(databaseUrl) : createUnconfiguredSqlClient();
