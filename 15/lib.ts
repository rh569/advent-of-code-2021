function parseInput(rawInput: string): number[][] {
  const lines = rawInput.split("\n");

  return lines.map((l) => l.split("").map((n) => parseInt(n)));
}

export function part1(input: string): number {
  const cave = parseInput(input);

  const shortestPath = dijkstra(cave);

  return shortestPath[shortestPath.length - 1].distance;
}

export function part2(input: string): number {
  const caveUnit = parseInput(input);

  const fullCave = expand(caveUnit);

  const shortestPath = dijkstra(fullCave);

  return shortestPath[shortestPath.length - 1].distance;
}

type Node = {
  i: number;
  j: number;
  key: string;
  weight: number;
  distance: number;
  visited: boolean;
};

function toKey(i: number, j: number): string {
  return `${i},${j}`;
}

function getNode(nodes: Map<string, Node>, i: number, j: number): Node {
  const node = nodes.get(toKey(i, j));
  if (node === undefined) throw new Error(`Node ${toKey(i, j)} not found`);

  return node;
}

function fromKey(i_j: string): [number, number] {
  return i_j.split(",").map((n) => parseInt(n)) as [number, number];
}

function getUnvisitedNeighbours(nodes: Map<string, Node>, node: Node): Node[] {
  const neighbours: Node[] = [];

  if (nodes.has(toKey(node.i + 1, node.j))) {
    neighbours.push(getNode(nodes, node.i + 1, node.j));
  }
  if (nodes.has(toKey(node.i - 1, node.j))) {
    neighbours.push(getNode(nodes, node.i - 1, node.j));
  }
  if (nodes.has(toKey(node.i, node.j + 1))) {
    neighbours.push(getNode(nodes, node.i, node.j + 1));
  }
  if (nodes.has(toKey(node.i, node.j - 1))) {
    neighbours.push(getNode(nodes, node.i, node.j - 1));
  }

  return neighbours.filter((n) => !n.visited);
}

// Doesn't use anything fancy like a priority queue
// but does only consider the set of nodes that are unvisited and
// have already been neighbours at some point
// Part 2 still takes ~2s to run :(
function dijkstra(grid: number[][]): Node[] {
  const nodes = new Map<string, Node>();
  const visitedNodes: Node[] = [];

  // Populate node map from 2D array
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const distance = (i === 0 && j === 0 ? 0 : Number.MAX_SAFE_INTEGER);

      nodes.set(toKey(i, j), {
        weight: grid[i][j],
        distance,
        i,
        j,
        visited: false,
        key: toKey(i, j),
      });
    }
  }

  // Start top left
  let current = getNode(nodes, 0, 0);

  const unvisitedNodes = new Map<string, Node>();

  while (visitedNodes.length < nodes.size) {
    // Check if any unvisited neighbours can be reached in a shorter distance than already found
    for (const neighbour of getUnvisitedNeighbours(nodes, current)) {
      const possibleDistance = current.distance + neighbour.weight;

      if (possibleDistance < neighbour.distance) {
        neighbour.distance = possibleDistance;
      }

      unvisitedNodes.set(neighbour.key, neighbour);
    }

    current.visited = true;
    visitedNodes.push(current);
    unvisitedNodes.delete(current.key);

    if (current.i === grid.length - 1 && current.j === grid[0].length - 1) {
      return visitedNodes;
    }

    // Decide the next node to be current based on distance
    let nextNode: Node | null = null;

    unvisitedNodes.forEach((node) => {
      if (node.visited) throw new Error("This shouldn't be here");

      if (
        nextNode === null || node.distance < nextNode.distance
      ) {
        nextNode = node;
      }
    });

    if (nextNode === null) throw new Error("No unvisited node found");

    current = nextNode;
  }

  throw new Error("Illegal state");
}

function expand(unit: number[][]): number[][] {
  const fullCave: number[][] = new Array(unit.length * 5).fill(null)
    .map((_) => new Array(unit[0].length * 5).fill(0));

  for (let i = 0; i < 5; i++) {
    for (let j = 0; j < 5; j++) {
      copyUnit(unit, fullCave, i, j);
    }
  }

  return fullCave;
}

function copyUnit(
  unit: number[][],
  full: number[][],
  iOffset: number,
  jOffset: number,
) {
  const step = iOffset + jOffset;

  for (let i = 0; i < unit.length; i++) {
    for (let j = 0; j < unit[i].length; j++) {
      let value = unit[i][j] + step;

      if (value > 9) {
        value -= 9;
      }

      full[i + (unit.length * iOffset)][j + (unit[i].length * jOffset)] = value;
    }
  }
}
