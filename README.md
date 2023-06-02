# hasura-where
[![Actions Status](https://github.com/Eun/hasura-where/workflows/push/badge.svg)](https://github.com/Eun/hasura-where/actions)
[![Coverage Status](https://coveralls.io/repos/github/Eun/hasura-where/badge.svg?branch=master)](https://coveralls.io/github/Eun/hasura-where?branch=master)
---
Run hasura where queries on the client side:

```typescript
const items = [
  {
    name: 'Joe',
    address: {
      country: 'us',
    },
  },
  {
    name: 'Alice',
    address: {
      country: 'uk',
    },
  },
  {
    name: 'Bob',
    address: {
      country: 'de',
    },
  },
];
console.log(
  filter(items, {
    address: {
      country: {
        _in: ['us', 'de'],
      },
    },
  })
);
// [
//   {
//     name: 'Joe',
//     address: {
//       country: 'us',
//     },
//   },
//   {
//     name: 'Bob',
//     address: {
//       country: 'de',
//     },
//   },
// ];
```

## Build History
[![Build history](https://buildstats.info/github/chart/Eun/hasura-where?branch=master)](https://github.com/Eun/hasura-where/actions)
