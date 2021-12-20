import { parseInput, simulate, toEnergyMap } from "./lib.ts";

const octos = parseInput(await Deno.readTextFile("./input.txt"));

const states: number[][][] = [];
let synchronised = false;

states.push(toEnergyMap(octos));

while (!synchronised) {
  const { flashes, state } = simulate(octos, true);
  states.push(state ?? []);

  if (flashes === 100) synchronised = true;
}

const data = states.map((state) =>
  state.map((energies) => energies.join(" ")).join("\n")
).join("\n\n");

await Deno.writeTextFile("out.txt", data);
