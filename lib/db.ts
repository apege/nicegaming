import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set in environment variables. Please configure it in Cloudflare Dashboard -> Settings -> Variables and Secrets."
    );
  }
  return url;
}

let cachedSql: NeonQueryFunction<false, false> | null = null;

function getSql(): NeonQueryFunction<false, false> {
  if (!cachedSql) {
    const url = getDatabaseUrl();
    cachedSql = neon(url);
  }
  return cachedSql;
}

export const sql: NeonQueryFunction<false, false> = ((
  strings: TemplateStringsArray,
  ...params: any[]
) => {
  const queryFn = getSql();
  return queryFn(strings, ...params);
}) as unknown as NeonQueryFunction<false, false>;
