import { describe, expect, it } from 'vitest';
import { toQueryString } from './querystring';

describe('querystring', () => {
  it('should filter empty string, empty array, null and undefined', () => {
    // given
    const obj = {
      a: 1,
      b: 0,
      c: '',
      d: undefined,
      e: null,
      f: false,
      g: true,
      h: [],
    };

    // when
    const qs = toQueryString(obj);

    // then
    expect(qs).toBe('a=1&b=0&f=false&g=true');
  });

  it('should join array values with comma', () => {
    // given
    const obj = {
      a: [1, 2, 3],
      b: [0],
      c: ['foo', 'bar'],
      d: [],
    };

    // when
    const qs = toQueryString(obj);

    // then
    expect(qs).toBe('a=1,2,3&b=0&c=foo,bar');
  });

  it('should handle nested objects', () => {
    // given
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
        },
      },
    };

    // when
    const qs = toQueryString(obj);

    // then
    expect(qs).toBe('a=1&c=2&e=3');
  });
});
