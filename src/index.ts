export type RootOperation<T> = {
  _and: Where<T>;
  _not: Where<T>;
  _or: Where<T>;
};

export type FieldOperation<T> = {
  [key in keyof T]: T[key] extends Array<infer U>
    ? Partial<Operations<U>> | Where<U>
    : Partial<Operations<T[key]>> | Where<T[key]>;
};
export type Operations<T> = {
  _eq: T;
  _gt: T;
  _gte: T;
  _in: Array<T>;
  _is_null: boolean;
  _lt: T;
  _lte: T;
  _neq: T;
  _nin: Array<T>;
};

export type Where<T> = Partial<RootOperation<T>> | Partial<FieldOperation<T>>;

/**
 * test whether an item matches the specified where expression.
 * @param {Object} item
 * @param {Where} where
 * @returns {boolean}
 */
export function matchesFilter<T extends object>(
  item: T,
  where: Where<T>
): boolean {
  if (item instanceof Array) {
    for (const i in item) {
      if (!matchesFilter(item[i], where)) {
        return false;
      }
    }
    return true;
  }
  whereLoop: for (const whereKey in where) {
    const e = where[whereKey as keyof Where<T>];
    const exp = Object(e);
    if (e !== exp) {
      return false;
    }
    switch (whereKey) {
      case '_and':
        if (!matchesFilter(item, exp)) {
          return false;
        }
        continue;
      case '_not':
        if (matchesFilter(item, exp)) {
          return false;
        }
        continue;
      case '_or':
        for (const expKey in exp) {
          if (matchesFilter(item, { [expKey]: exp[expKey] })) {
            continue whereLoop;
          }
        }
        return false;
    }
    if (!(whereKey in item)) {
      if ('_is_null' in exp && exp['_is_null'] === true) {
        // see test '_is_null is true on unknown field'
        continue;
      }
      // see test 'unknown key'
      return false;
    }
    const itemValue = item[whereKey as keyof T];
    if (itemValue === null || itemValue === undefined) {
      if ('_is_null' in exp) {
        if (exp['_is_null'] === true) {
          // see test '_is_null is true on null field'
          continue;
        }
      }
      return false;
    } else {
      if ('_is_null' in exp) {
        if (exp['_is_null'] === true) {
          // see test '_is_null is true on non null field'
          return false;
        }
      }
    }
    if ('_eq' in exp) {
      if (!(itemValue === exp['_eq'])) {
        return false;
      }
    }
    if ('_gt' in exp) {
      if (!(itemValue > exp['_gt'])) {
        return false;
      }
    }
    if ('_gte' in exp) {
      if (!(itemValue >= exp['_gte'])) {
        return false;
      }
    }
    if ('_in' in exp) {
      if (!(exp['_in'] instanceof Array)) {
        return false;
      }
      if (!exp['_in'].includes(itemValue)) {
        return false;
      }
    }
    if ('_lt' in exp) {
      if (!(itemValue < exp['_lt'])) {
        return false;
      }
    }
    if ('_lte' in exp) {
      if (!(itemValue <= exp['_lte'])) {
        return false;
      }
    }
    if ('_neq' in exp) {
      if (!(itemValue !== exp['_neq'])) {
        return false;
      }
    }
    if ('_nin' in exp) {
      if (!(exp['_nin'] instanceof Array)) {
        return false;
      }
      if (exp['_nin'].includes(itemValue)) {
        return false;
      }
    }
    if (
      typeof itemValue === 'object' &&
      itemValue !== null &&
      !matchesFilter(itemValue, exp)
    ) {
      return false;
    }
  }
  return true;
}

/**
 * filter an array of items with the where clause.
 * @param {Array} items
 * @param {Where} where
 * @returns {Array}
 */
export function filter<T extends object>(
  items: Array<T>,
  where: Where<T>
): Array<T> {
  const filtered = [];
  for (const itemsKey in items) {
    if (matchesFilter(items[itemsKey], where)) {
      filtered.push(items[itemsKey]);
    }
  }
  return filtered;
}
