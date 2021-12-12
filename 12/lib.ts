type CaveConnections = [string, string][];

enum TerminalType {
  NONE = "NONE",
  START = "START",
  END = "END",
}

enum Size {
  N_A = "N/A",
  SMALL = "SMALL",
  LARGE = "LARGE",
}

type Cave = {
  id: string; // string id, e.g. start, end, VG, a
  connections: string[]; // List of connections from this node by id only (no reference)
  size: Size;
  terminal: TerminalType;
};

type CaveNode = {
  cave: Cave;
  children: CaveNode[];
  parent: CaveNode | null;
};

type CaveMap = Map<string, Cave>;

export function parseInput(rawInput: string): CaveConnections {
  const lines = rawInput.split("\n");

  return lines.map((line) => line.split("-") as [string, string]);
}

function mapCaves(connections: CaveConnections): CaveMap {
  const cavesById = new Map<string, Cave>();

  // One loop over to populate the map
  connections.forEach((connection) => {
    connection.forEach((caveId) => {
      if (cavesById?.has(caveId)) {
        return;
      }

      const terminal = caveId === "start"
        ? TerminalType.START
        : caveId === "end"
        ? TerminalType.END
        : TerminalType.NONE;

      const size = terminal !== TerminalType.NONE
        ? Size.N_A
        : (caveId !== caveId.toLowerCase())
        ? Size.LARGE
        : Size.SMALL;

      const cave: Cave = {
        id: caveId,
        connections: [],
        size,
        terminal,
      };

      cavesById?.set(caveId, cave);
    });
  });

  // One loop to populate all connections
  connections.forEach((connection) => {
    const a = cavesById.get(connection[0]);
    const b = cavesById.get(connection[1]);

    if (a === undefined || b === undefined) {
      throw new Error(
        `${connection[0]} or ${connection[1]} not defined in map`,
      );
    }

    a.connections.push(b.id);
    b.connections.push(a.id);
  });

  return cavesById;
}

export function part1(rawInput: string): number {
  const caves = mapCaves(parseInput(rawInput));

  const start = caves.get("start");
  if (start === undefined) throw new Error(`Start not found`);

  const tree = walkNode(caves, {
    cave: { ...start },
    children: [],
    parent: null,
  });

  return countCompletePaths(tree);
}

export function part2(rawInput: string): number {
  const caves = mapCaves(parseInput(rawInput));

  const start = caves.get("start");
  if (start === undefined) throw new Error(`Start not found`);

  const tree = walkNode(caves, {
    cave: { ...start },
    children: [],
    parent: null,
  }, true);

  return countCompletePaths(tree);
}

function walkNode(
  caves: CaveMap,
  currentNode: CaveNode,
  extraVisits = false,
): CaveNode {
  currentNode.cave.connections.forEach((connId) => {
    const connectingCave = caves.get(connId);
    if (connectingCave === undefined) {
      throw new Error(`Connection not found: ${connId}`);
    }

    // Don't ever visit the start again
    if (connectingCave.terminal === TerminalType.START) {
      return;
    }

    const connectingNode: CaveNode = {
      cave: { ...connectingCave },
      children: [],
      parent: currentNode,
    };

    // Don't recurse if connection is to the end
    if (connectingCave.terminal === TerminalType.END) {
      currentNode.children.push(connectingNode);
      return;
    }

    // Always recurse into large caves
    if (connectingCave.size === Size.LARGE) {
      currentNode.children.push(walkNode(caves, connectingNode, extraVisits));
      return;
    }

    if (connectingCave.size !== Size.SMALL) {
      throw new Error(`Unexpected cave: ${connectingCave.id}`);
    }

    if (extraVisits) {
      if (notVisited(currentNode, connectingCave.id)) {
        currentNode.children.push(walkNode(caves, connectingNode, extraVisits));
        return;
      }

      if (noSecondVisits(currentNode)) {
        currentNode.children.push(walkNode(caves, connectingNode, extraVisits));
        return;
      }
    } else {
      // If small and not visited, recurse, but close it
      if (notVisited(currentNode, connectingCave.id)) {
        currentNode.children.push(walkNode(caves, connectingNode, extraVisits));
      }
    }
  });

  return currentNode;
}

// Walk back up to the root checking for this id
function notVisited(node: CaveNode, id: string): boolean {
  let visited = false;
  let currentNode = node;

  while (currentNode.parent !== null) {
    if (currentNode.cave.id === id) {
      visited = true;
    }

    currentNode = currentNode.parent;
  }

  return !visited;
}

// Walk back up to the root checking if any small caves have been visited twice
function noSecondVisits(node: CaveNode): boolean {
  const smallCaves = new Map<string, number>();
  let currentNode = node;

  while (currentNode.parent !== null) {
    if (currentNode.cave.size === Size.SMALL) {
      smallCaves.set(
        currentNode.cave.id,
        (smallCaves.get(currentNode.cave.id) ?? 0) + 1,
      );
    }

    currentNode = currentNode.parent;
  }

  return [...smallCaves.values()].every((x) => x < 2);
}

function countCompletePaths(node: CaveNode): number {
  if (node.cave.id === "end") {
    return 1;
  }

  if (node.children.length === 0) {
    return 0;
  }

  let childSum = 0;

  node.children.forEach((child) => {
    childSum += countCompletePaths(child);
  });

  return childSum;
}
