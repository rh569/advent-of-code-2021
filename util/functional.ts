export function is<T>(t: T) {
  return (u: T) => t === u;
}

export function isnt<T>(t: T) {
  return (u: T) => t !== u;
}
