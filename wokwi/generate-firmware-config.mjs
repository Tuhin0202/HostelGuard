import { readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const workspaceRoot = resolve(import.meta.dirname, '..')
const envPath = resolve(workspaceRoot, 'dashboard', '.env')
const configPath = resolve(import.meta.dirname, 'hostelguard_firmware', 'supabase_config.h')

const env = Object.fromEntries(
  (await readFile(envPath, 'utf8'))
    .split(/\r?\n/)
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => {
      const separator = line.indexOf('=')
      return [line.slice(0, separator).trim(), line.slice(separator + 1).trim()]
    }),
)

const url = env.VITE_SUPABASE_URL
const anonKey = env.VITE_SUPABASE_ANON_KEY

if (!url || !anonKey) {
  throw new Error('dashboard/.env must define VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY')
}

const escapeCString = (value) => value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')

await writeFile(
  configPath,
  `#pragma once\n\n#define SUPABASE_URL "${escapeCString(url)}"\n#define SUPABASE_ANON_KEY "${escapeCString(anonKey)}"\n`,
)

console.log('Generated firmware Supabase config from dashboard/.env')