
export function isError(error: unknown): error is Error {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if ('message' in (error as any)) {
    return true;
  }

  return false;
}
