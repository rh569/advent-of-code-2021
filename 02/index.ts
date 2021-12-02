import { parseInput, part1, part2 } from "./lib.ts";

const rawInput = await Deno.readTextFile("./input.txt");
const instructions = parseInput(rawInput);

console.log(part1(instructions));
console.log(part2(instructions));
