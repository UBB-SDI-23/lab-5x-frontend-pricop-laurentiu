import Cookies from "js-cookie";

interface CookiesMap {
  token: string;
  paginationSize: number;
}

type Transformers = {
  [K in keyof CookiesMap]:
    | {
        serialize: (from: CookiesMap[K]) => string;
        deserialize: (from: string | undefined) => CookiesMap[K] | undefined;
      }
    | undefined;
};

const identityTransform = {
  serialize: (s: string) => s,
  deserialize: (s?: string) => s!,
};

const transformers: Transformers = {
  token: identityTransform,
  paginationSize: {
    serialize: from => from.toString(),
    deserialize: from => (from ? parseInt(from) : undefined),
  },
};

/**
 * Type safe cookie manager
 */
export default class CookieManager {
  static set<K extends keyof CookiesMap>(key: K, val: CookiesMap[K]) {
    const transformed = transformers[key]?.serialize(val) ?? val;
    Cookies.set(key, transformed as string);
  }

  static get<K extends keyof CookiesMap>(key: K): CookiesMap[K] | undefined {
    const val = Cookies.get(key);
    return (transformers[key]?.deserialize(val) ?? val) as CookiesMap[K] | undefined;
  }

  static unset<K extends keyof CookiesMap>(key: K) {
    Cookies.remove(key);
  }
}
