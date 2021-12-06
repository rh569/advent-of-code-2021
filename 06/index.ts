import { parseInput, part1, part2 } from "./lib.ts";

const rawInput = await Deno.readTextFile("./input.txt");

const fish = parseInput(rawInput);

console.log(part1(fish));
console.log(part2(fish));
