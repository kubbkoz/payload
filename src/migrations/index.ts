import * as migration_20260911_212537_zaklad from './20260911_212537_zaklad';
import * as migration_20260912_051936_nasadenie_webu from './20260912_051936_nasadenie_webu';

export const migrations = [
  {
    up: migration_20260911_212537_zaklad.up,
    down: migration_20260911_212537_zaklad.down,
    name: '20260911_212537_zaklad',
  },
  {
    up: migration_20260912_051936_nasadenie_webu.up,
    down: migration_20260912_051936_nasadenie_webu.down,
    name: '20260912_051936_nasadenie_webu'
  },
];
