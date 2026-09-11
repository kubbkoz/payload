import * as migration_20260911_212537_zaklad from './20260911_212537_zaklad';

export const migrations = [
  {
    up: migration_20260911_212537_zaklad.up,
    down: migration_20260911_212537_zaklad.down,
    name: '20260911_212537_zaklad'
  },
];
