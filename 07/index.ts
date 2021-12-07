import { parseInput, part1, part2 } from "./lib.ts";

const rawInput = await Deno.readTextFile("./input.txt");

const crabPositions = parseInput(rawInput);

console.log(part1(crabPositions));
console.log(part2(crabPositions));
