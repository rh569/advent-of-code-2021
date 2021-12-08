/**
 * Parses multiline input of the form
 *
 * up 3
 * down 4
 * forward 1
 *
 * and returns a list of tuples with tuples' second element
 * parsed as an integer
 *
 * @param rawInput multiline string input
 * @returns an array of instructions: <{string} direction, {number} value>
 */
export function parseInput(rawInput: string): Array<[string, number]> {
  return rawInput.split("\n")
    .map((line) => line.split(" "))
    .map(([dir, value]) => [dir, parseInt(value)]);
}

/**
 * Moves a submarine according to the given instructions
 * where each instruction corresponds directly to movement
 * in the given direction by the given amount
 *
 * @param instructions movement instructions
 * @returns {number} product of the horizontal position and depth
 */
export function part1(instructions: [string, number][]): number {
  const pos = {
    h: 0,
    d: 0,
  };

  instructions.forEach((ins) => {
    switch (ins[0]) {
      case "forward":
        pos.h += ins[1];
        break;
      case "up":
        pos.d -= ins[1];
        break;
      case "down":
        pos.d += ins[1];
        break;
    }
  });

  return pos.h * pos.d;
}

/**
 * Moves a submarine according to the given instructions
 * where the vertical instructions accumulate an aim value to
 * be moved by only on a subsequent horizontal movement
 *
 * @param instructions movement instructions
 * @returns {number} product of the horizontal position and depth
 */
export function part2(instructions: [string, number][]): number {
  const state = {
    h: 0,
    d: 0,
    a: 0,
  };

  instructions.forEach((ins) => {
    switch (ins[0]) {
      case "forward":
        state.h += ins[1];
        state.d += state.a * ins[1];
        break;
      case "up":
        state.a -= ins[1];
        break;
      case "down":
        state.a += ins[1];
        break;
    }
  });

  return state.h * state.d;
}
