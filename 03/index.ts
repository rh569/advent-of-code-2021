import { parseInput, part1, part2 } from "./lib.ts";

const rawInput = await Deno.readTextFile("./input.txt");
const binArrs = parseInput(rawInput);

console.log(part1(binArrs));
console.log(part2(binArrs));
