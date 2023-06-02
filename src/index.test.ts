import { filter } from './index';
import { describe } from 'node:test';

const items = [
  {
    id: 1,
    name: 'Joe',
    lastname: 'Doe',
    address: {
      country: 'us',
    },
    teams: [
      {
        id: 1,
        name: 'Admins',
      },
      {
        id: 2,
        name: 'Developers',
      },
    ],
  },
  {
    id: 2,
    name: 'Alice',
    lastname: null,
    address: {
      country: 'uk',
    },
    teams: [
      {
        id: 2,
        name: 'Developers',
      },
    ],
  },
  {
    id: 3,
    name: 'Bob',
    lastname: 'Sinclair',
    address: {
      country: 'de',
    },
    teams: [
      {
        id: 3,
        name: 'Users',
      },
    ],
  },
];

describe('simple operation', () => {
  it('should have result', () => {
    const result = filter(items, {
      name: {
        _eq: 'Alice',
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(items[1]);
  });
  it('should not have result', () => {
    const result = filter(items, {
      name: {
        _eq: 'Unknown',
      },
    });
    expect(result).toHaveLength(0);
  });
});

describe('multiple operations', () => {
  it('should have result', () => {
    const result = filter(items, {
      id: {
        _eq: 2,
        _in: [1, 2, 3],
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(items[1]);
  });
  it('should not have result', () => {
    const result = filter(items, {
      id: {
        _eq: 2,
        _in: [1, 3],
      },
    });
    expect(result).toHaveLength(0);
  });
});

describe('multiple fields', () => {
  it('should have result', () => {
    const result = filter(items, {
      id: {
        _eq: 2,
      },
      name: {
        _eq: 'Alice',
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(items[1]);
  });
  it('should not have result', () => {
    const result = filter(items, {
      id: {
        _eq: 2,
      },
      name: {
        _eq: 'Unknown',
      },
    });
    expect(result).toHaveLength(0);
  });
});

describe('deep operation', () => {
  it('should have result', () => {
    const result = filter(items, {
      address: {
        country: {
          _eq: 'uk',
        },
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(items[1]);
  });
  it('should not have result', () => {
    const result = filter(items, {
      address: {
        country: {
          _eq: 'au',
        },
      },
    });
    expect(result).toHaveLength(0);
  });
});

describe('deeper equal with array', () => {
  it('should have result', () => {
    const result = filter(items, {
      teams: {
        name: {
          _eq: 'Users',
        },
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(items[2]);
  });
  it('should not have result', () => {
    const result = filter(items, {
      teams: {
        name: {
          _eq: 'Guests',
        },
      },
    });
    expect(result).toHaveLength(0);
  });
});

describe('and expression', () => {
  const result = filter(items, {
    _and: {
      id: {
        _eq: 2,
      },
      name: {
        _eq: 'Alice',
      },
    },
  });
  expect(result).toHaveLength(1);
  expect(result[0]).toBe(items[1]);
});

describe('or expression', () => {
  const result = filter(items, {
    _or: {
      id: {
        _eq: 1,
      },
      name: {
        _eq: 'Alice',
      },
    },
  });
  expect(result).toHaveLength(2);
  expect(result[0]).toBe(items[0]);
  expect(result[1]).toBe(items[1]);
});

describe('not expression', () => {
  const result = filter(items, {
    _not: {
      id: {
        _eq: 2,
      },
    },
  });
  expect(result).toHaveLength(2);
  expect(result[0]).toBe(items[0]);
  expect(result[1]).toBe(items[2]);
});

describe('unknown key', () => {
  const result = filter(items, {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    unknown: {
      _eq: 2,
    },
  });
  expect(result).toHaveLength(0);
});

describe('operations', () => {
  it('_eq', () => {
    const result = filter(items, {
      id: {
        _eq: 2,
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(items[1]);
  });
  it('_gt', () => {
    const result = filter(items, {
      id: {
        _gt: 1,
      },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(items[1]);
    expect(result[1]).toBe(items[2]);
  });
  it('_gte', () => {
    const result = filter(items, {
      id: {
        _gte: 2,
      },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(items[1]);
    expect(result[1]).toBe(items[2]);
  });
  it('_in', () => {
    const result = filter(items, {
      id: {
        _in: [2, 3],
      },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(items[1]);
    expect(result[1]).toBe(items[2]);
  });
  it('_is_null is true on unknown field', () => {
    const result = filter(items, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      unknown: {
        _is_null: true,
      },
    });
    expect(result).toHaveLength(3);
    expect(result[0]).toBe(items[0]);
    expect(result[1]).toBe(items[1]);
    expect(result[2]).toBe(items[2]);
  });
  it('_is_null is true on null field', () => {
    const result = filter(items, {
      lastname: {
        _is_null: true,
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(items[1]);
  });
  it('_is_null is true on non null field', () => {
    const result = filter(items, {
      id: {
        _is_null: true,
      },
    });
    expect(result).toHaveLength(0);
  });
  it('_is_null is false on non null field', () => {
    const result = filter(items, {
      lastname: {
        _is_null: false,
      },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(items[0]);
    expect(result[1]).toBe(items[2]);
  });
  it('_is_null is false on unknown field', () => {
    const result = filter(items, {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      unknown: {
        _is_null: false,
      },
    });
    expect(result).toHaveLength(0);
  });
  it('_lt', () => {
    const result = filter(items, {
      id: {
        _lt: 3,
      },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(items[0]);
    expect(result[1]).toBe(items[1]);
  });
  it('_lte', () => {
    const result = filter(items, {
      id: {
        _lte: 2,
      },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(items[0]);
    expect(result[1]).toBe(items[1]);
  });
  it('_neq', () => {
    const result = filter(items, {
      id: {
        _neq: 2,
      },
    });
    expect(result).toHaveLength(2);
    expect(result[0]).toBe(items[0]);
    expect(result[1]).toBe(items[2]);
  });
  it('_nin', () => {
    const result = filter(items, {
      id: {
        _nin: [2, 3],
      },
    });
    expect(result).toHaveLength(1);
    expect(result[0]).toBe(items[0]);
  });
});

describe('in operation is not array', () => {
  const result = filter(items, {
    id: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      _in: 2,
    },
  });
  expect(result).toHaveLength(0);
});

describe('nin operation is not array', () => {
  const result = filter(items, {
    id: {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      _nin: 2,
    },
  });
  expect(result).toHaveLength(0);
});

describe('field has primitive', () => {
  const result = filter(items, {
    id: 2,
  });
  expect(result).toHaveLength(0);
});
//
// describe('test', () => {
//   const data = {
//     id: 1,
//     name: 'Alice',
//     company: {
//       id: 2,
//       name: 'Google',
//     },
//     teams: [
//       {
//         id: 3,
//         name: 'Developer',
//       },
//     ],
//   };
//   const valid1: Where<typeof data> = {
//     id: {
//       _eq: 1,
//     },
//   };
//   const valid2: Where<typeof data> = {
//     id: {
//       _eq: 1,
//       _in: [1, 2, 3],
//     },
//   };
//   const valid3: Where<typeof data> = {
//     id: {
//       _eq: 1,
//     },
//     name: {
//       _eq: 'Alice',
//     },
//   };
//   const valid4: Where<typeof data> = {
//     company: {
//       name: {
//         _eq: 'Google',
//       },
//     },
//   };
//   const valid5: Where<typeof data> = {
//     company: {
//       name: {
//         _eq: 'Google',
//       },
//     },
//   };
//   const valid6: Where<typeof data> = {
//     teams: {
//       name: {
//         _eq: 'Developer',
//       },
//     },
//   };
//   const valid7: Where<typeof data> = {
//     _and: {
//       name: {
//         _eq: 'Alice',
//       },
//       teams: {
//         name: {
//           _eq: 'Developer',
//         },
//       },
//     },
//   };
//   const valid8: Where<typeof data> = {
//     teams: {
//       _and: {
//         id: {
//           _gte: 1,
//         },
//         name: {
//           _eq: 'Developer',
//         },
//       },
//     },
//   };
//
//   const invalid1: Where<typeof data> = {
//     id: 1,
//   };
//   const invalid2: Where<typeof data> = {
//     unknown: 1,
//   };
//   const invalid3: Where<typeof data> = {
//     unknown: {
//       _eq: 1,
//     },
//   };
//   const invalid4: Where<typeof data> = {
//     id: {
//       _eq: 'test',
//     },
//   };
//   const invalid5: Where<typeof data> = {
//     teams: [
//       {
//         id: {
//           _eq: 3,
//         },
//       },
//     ],
//   };
//
//   const result = filter(items, {
//     id: 1,
//     address: {
//       country: {
//         _eq: 'us',
//       },
//     },
//   });
//   expect(result).toHaveLength(1);
//   expect(result[0]).toBe(items[1]);
// });
