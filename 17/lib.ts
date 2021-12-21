type Area = {
  x1: number;
  x2: number;
  y1: number;
  y2: number;
};

function parseInput(rawInput: string): Area {
  const desc = "target area: ";

  const [[x1, x2], [y1, y2]] = rawInput.substring(desc.length)
    .split(", ")
    .map((s) => s.substring(2).split("..").map((n) => parseInt(n)));

  // Problems are symmetrical about x = 0, so simplifies the maths
  return {
    x1: Math.abs(x1),
    x2: Math.abs(x2),
    y1,
    y2,
  };
}

// To shortcut, ignore x component completely
// The trajectory will always pass back through y = 0
// with a velocity 1 greater than the initial, but negative
// Therefore, max initial velocity is 1 less than the Abs of
// the bottom of the target area
export function part1(input: string): number {
  const area = parseInput(input);

  const targetYBound = Math.min(area.y1, area.y2);
  const maxInitialY = Math.abs(targetYBound) - 1;

  let height = 0;
  let yVel = maxInitialY;

  while (yVel > 0) {
    height += yVel;
    yVel--;
  }

  return height;
}

// A nice mess of finding appropriate velocities in each direction, then
// filtering them in comparison to the other component
// Would alsmost certainly break with less nice input...
export function part2(input: string): number {
  const area = parseInput(input);

  const displacementsForValidXVelocties = findDisplacementsForValidXVelocities(
    area.x1,
    area.x2,
  );
  const displacementsForValidYVelocties = findDisplacementsForValidYVelocities(
    area.y1,
    area.y2,
  );

  const validVelocities: number[][] = [];

  displacementsForValidXVelocties.forEach((xDispls, xVel) => {
    displacementsForValidYVelocties.forEach((yDispls, yVel) => {
      let velocitiesValidTogether = false;

      for (let i = 0; i < Math.max(xDispls.length, yDispls.length); i++) {
        // As x displacement is unchanging in later steps, persist its last value
        // While we work through the remaining ys
        const xDis = (i < xDispls.length)
          ? xDispls[i]
          : xDispls[xDispls.length - 1];

        if (
          isInRangeInclusive(xDis, area.x1, area.x2) &&
          isInRangeInclusive(yDispls[i], area.y1, area.y2)
        ) {
          velocitiesValidTogether = true;
          break;
        }
      }

      if (velocitiesValidTogether) validVelocities.push([xVel, yVel]);
    });
  });

  return validVelocities.length;
}

function findDisplacementsForValidXVelocities(
  x1: number,
  x2: number,
): Map<number, number[]> {
  const displacementsByVelocity = new Map<number, number[]>();

  let initialVelocity = 1;

  while (initialVelocity <= x2) {
    const displacements = findAllXDisplacements(initialVelocity);

    let validVelocity = false;

    for (let i = 0; i < displacements.length; i++) {
      if (isInRangeInclusive(displacements[i], x1, x2)) {
        validVelocity = true;
        break;
      }
    }

    if (validVelocity) {
      displacementsByVelocity.set(initialVelocity, displacements);
    }
    initialVelocity++;
  }

  return displacementsByVelocity;
}

function findDisplacementsForValidYVelocities(
  y1: number,
  y2: number,
): Map<number, number[]> {
  const displacementsByVelocity = new Map<number, number[]>();

  let initialVelocity = y1;
  const maxVelocity = Math.abs(y1) - 1;

  while (initialVelocity <= maxVelocity) {
    const displacements = findAllYDisplacements(initialVelocity, y1);

    let validVelocity = false;

    for (let i = 0; i < displacements.length; i++) {
      if (isInRangeInclusive(displacements[i], y1, y2)) {
        validVelocity = true;
        break;
      }
    }

    if (validVelocity) {
      displacementsByVelocity.set(initialVelocity, displacements);
    }
    initialVelocity++;
  }

  return displacementsByVelocity;
}

/**
 * For a given initial X velocity
 * returns a list of displacements available from that velocity
 * until the velocity is 0 due to drag
 * specified is reached
 * @param initialX
 */
function findAllXDisplacements(initialX: number): number[] {
  const displacements = [];

  let currentDisplacement = 0;
  let currentVelocity = initialX;

  while (currentVelocity > 0) {
    currentDisplacement += currentVelocity;
    displacements.push(currentDisplacement);
    currentVelocity--;
  }

  return displacements;
}

/**
 * For a given initial Y velocity
 * returns a list of displacements available from that velocity
 * until the displacemnt exceeds the given lowest value
 * @param initialY
 */
function findAllYDisplacements(initialY: number, lowest: number): number[] {
  const displacements = [];

  let currentDisplacement = 0;
  let currentVelocity = initialY;

  while (currentDisplacement >= lowest) {
    currentDisplacement += currentVelocity;
    displacements.push(currentDisplacement);
    currentVelocity--;
  }

  return displacements;
}

function isInRangeInclusive(test: number, r1: number, r2: number): boolean {
  const lower = Math.min(r1, r2);
  const upper = Math.max(r1, r2);

  return test >= lower && test <= upper;
}
