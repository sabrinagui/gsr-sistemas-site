-- Read-only structural manifest, excluding data, owners, ACLs and object OIDs.
-- Run against the restored database and a fresh database built by the migration.
-- Same PostgreSQL major version and search_path must be used in both.
SET search_path = public, pg_catalog;
SELECT jsonb_build_object(
  'schemas', (
    SELECT jsonb_agg(nspname ORDER BY nspname)
    FROM pg_namespace
    WHERE nspname <> 'information_schema' AND nspname !~ '^pg_'
  ),
  'relations', (
    SELECT jsonb_agg(jsonb_build_object(
      'schema', n.nspname, 'name', c.relname, 'kind', c.relkind,
      'rls', c.relrowsecurity, 'forcedRls', c.relforcerowsecurity,
      'partitionKey', pg_get_partkeydef(c.oid)
    ) ORDER BY n.nspname, c.relname)
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname <> 'information_schema' AND n.nspname !~ '^pg_'
      AND c.relkind IN ('r', 'p', 'v', 'm', 'S')
  ),
  'columns', (
    SELECT jsonb_agg(jsonb_build_object(
      'schema', n.nspname, 'table', c.relname, 'position', a.attnum,
      'name', a.attname, 'type', format_type(a.atttypid, a.atttypmod),
      'notNull', a.attnotnull, 'identity', a.attidentity,
      'generated', a.attgenerated, 'default', pg_get_expr(d.adbin, d.adrelid),
      'collation', CASE WHEN a.attcollation = 0 THEN NULL
        ELSE cn.nspname || '.' || co.collname END
    ) ORDER BY n.nspname, c.relname, a.attnum)
    FROM pg_attribute a JOIN pg_class c ON c.oid = a.attrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    LEFT JOIN pg_attrdef d ON d.adrelid = a.attrelid AND d.adnum = a.attnum
    LEFT JOIN pg_collation co ON co.oid = a.attcollation
    LEFT JOIN pg_namespace cn ON cn.oid = co.collnamespace
    WHERE n.nspname <> 'information_schema' AND n.nspname !~ '^pg_'
      AND c.relkind IN ('r', 'p', 'v', 'm') AND a.attnum > 0 AND NOT a.attisdropped
  ),
  'constraints', (
    SELECT jsonb_agg(jsonb_build_object(
      'schema', n.nspname, 'name', c.conname, 'table', c.conrelid::regclass::text,
      'definition', pg_get_constraintdef(c.oid), 'validated', c.convalidated
    ) ORDER BY n.nspname, c.conrelid::regclass::text, c.conname)
    FROM pg_constraint c JOIN pg_namespace n ON n.oid = c.connamespace
    WHERE n.nspname <> 'information_schema' AND n.nspname !~ '^pg_'
  ),
  'indexes', (
    SELECT jsonb_agg(jsonb_build_object(
      'schema', schemaname, 'table', tablename, 'name', indexname, 'definition', indexdef
    ) ORDER BY schemaname, tablename, indexname)
    FROM pg_indexes
    WHERE schemaname <> 'information_schema' AND schemaname !~ '^pg_'
  ),
  'enums', (
    SELECT jsonb_agg(jsonb_build_object(
      'schema', n.nspname, 'name', t.typname,
      'values', (SELECT jsonb_agg(e.enumlabel ORDER BY e.enumsortorder) FROM pg_enum e WHERE e.enumtypid = t.oid)
    ) ORDER BY n.nspname, t.typname)
    FROM pg_type t JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE t.typtype = 'e' AND n.nspname <> 'information_schema' AND n.nspname !~ '^pg_'
  ),
  'sequences', (
    SELECT jsonb_agg(jsonb_build_object(
      'schema', n.nspname, 'name', c.relname, 'type', format_type(s.seqtypid, NULL),
      'start', s.seqstart, 'increment', s.seqincrement, 'minimum', s.seqmin,
      'maximum', s.seqmax, 'cache', s.seqcache, 'cycle', s.seqcycle
    ) ORDER BY n.nspname, c.relname)
    FROM pg_sequence s JOIN pg_class c ON c.oid = s.seqrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE n.nspname <> 'information_schema' AND n.nspname !~ '^pg_'
  ),
  'triggers', (
    SELECT jsonb_agg(jsonb_build_object(
      'schema', n.nspname, 'table', c.relname, 'name', t.tgname,
      'definition', pg_get_triggerdef(t.oid), 'enabled', t.tgenabled
    ) ORDER BY n.nspname, c.relname, t.tgname)
    FROM pg_trigger t JOIN pg_class c ON c.oid = t.tgrelid
    JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE NOT t.tgisinternal AND n.nspname <> 'information_schema' AND n.nspname !~ '^pg_'
  ),
  'views', (
    SELECT jsonb_agg(jsonb_build_object(
      'schema', n.nspname, 'name', c.relname, 'definition', pg_get_viewdef(c.oid)
    ) ORDER BY n.nspname, c.relname)
    FROM pg_class c JOIN pg_namespace n ON n.oid = c.relnamespace
    WHERE c.relkind IN ('v', 'm') AND n.nspname <> 'information_schema' AND n.nspname !~ '^pg_'
  ),
  'functions', (
    SELECT jsonb_agg(jsonb_build_object(
      'schema', n.nspname, 'name', p.proname,
      'arguments', pg_get_function_identity_arguments(p.oid), 'definition', pg_get_functiondef(p.oid)
    ) ORDER BY n.nspname, p.proname, pg_get_function_identity_arguments(p.oid))
    FROM pg_proc p JOIN pg_namespace n ON n.oid = p.pronamespace
    WHERE p.prokind IN ('f', 'p') AND n.nspname <> 'information_schema' AND n.nspname !~ '^pg_'
  ),
  'extensions', (
    SELECT jsonb_agg(jsonb_build_object('name', extname, 'version', extversion) ORDER BY extname)
    FROM pg_extension
  )
);
