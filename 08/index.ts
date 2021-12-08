import { parseInput, part1, part2 } from "./lib.ts";

const rawInput = await Deno.readTextFile("./input.txt");

const displays = parseInput(rawInput);

console.log(part1(displays));
console.log(part2(displays));
