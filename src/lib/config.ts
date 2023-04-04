
const getOrThrow = <T = string>(key: string, transform?: (from: string) => T): T => {
  const value = import.meta.env[key];
  if (!value) throw new Error("Missing envvar " + key);
  if (transform)
    return transform(import.meta.env[key]);
  return import.meta.env[key];
}

export const config = {
  apiBase: getOrThrow('VITE_API_BASE'),
}