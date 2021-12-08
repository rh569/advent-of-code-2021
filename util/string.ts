export function alphabetise(s: string): string {
  return s.split("").sort((a, b) => a.charCodeAt(0) - b.charCodeAt(0)).join("");
}
