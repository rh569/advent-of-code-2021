import { part1, part2 } from "./lib.ts";

const rawInput = await Deno.readTextFile("./01/input.txt");

const depths = rawInput.split("\n").map((s) => parseInt(s));

console.log(part1(depths));
console.log(part2(depths));
