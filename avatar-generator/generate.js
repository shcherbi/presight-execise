import { Avatar, Style } from '@dicebear/core';
import lorelei from '@dicebear/styles/lorelei.json' with { type: 'json' };
import { mkdir, writeFile } from 'node:fs/promises';
import { parseArgs } from 'node:util';

const style = new Style(lorelei);

/** Seed is the user id, so `users.avatar` is just `/avatars/<id>.svg`. */
export const render = (seed) => new Avatar(style, { seed: String(seed) }).toString();

if (import.meta.main) {
  const { values } = parseArgs({
    options: {
      count: { type: 'string', default: '1000' },
      out: { type: 'string', default: '../server/db/avatars' },
    },
  });

  const count = Number(values.count);
  if (!Number.isInteger(count) || count < 1) {
    throw new Error(`--count must be a positive integer, got ${values.count}`);
  }

  await mkdir(values.out, { recursive: true });

  // ponytail: sequential, ~seconds for 1000 locally rendered SVGs. Batch it
  // only if the count grows enough to matter; 1000 parallel writes risk EMFILE.
  for (let id = 1; id <= count; id++) {
    await writeFile(`${values.out}/${id}.svg`, render(id));
  }

  console.log(`Wrote ${count} avatars to ${values.out}`);
}
