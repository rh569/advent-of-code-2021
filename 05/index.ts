import { parseInput, part1, part2 } from "./lib.ts";

const rawInput = await Deno.readTextFile("./input.txt");

const lineSegments = parseInput(rawInput);

console.log(part1(lineSegments));
console.log(part2(lineSegments));
