const DIGIT_REGEXP = /[0-9]/;

type ReduceStatus = {
  toExplode: SFN[];
  toSplit: SFN[];
};

export class SFN {
  p: SFN | null;
  l: SFN | null;
  r: SFN | null;
  k: number | null;

  constructor(parent?: SFN) {
    this.p = parent ?? null;
    this.l = null;
    this.r = null;
    this.k = null;
  }

  static fromString(str: string, parent?: SFN): SFN {
    const node: SFN = new SFN(parent);

    if (str.length === 1 && str.match(DIGIT_REGEXP)) {
      node.k = parseInt(str);

      return node;
    }

    // Still got brackets to parse
    const chars = str.split("");

    // Remove outer brackets
    chars.shift();
    chars.pop();

    // Find pivot comma
    let bracketDepth = 0;
    let pivotIndex: number | null = null;

    for (let i = 0; i < chars.length; i++) {
      if (chars[i] === "[") {
        bracketDepth++;
        continue;
      }
      if (chars[i] === "]") {
        bracketDepth--;
        continue;
      }

      if (chars[i] === "," && bracketDepth === 0) {
        pivotIndex = i;
        break;
      }
    }

    if (pivotIndex === null) throw new Error("No pivot found");

    node.l = SFN.fromString(chars.slice(0, pivotIndex).join(""), node);
    node.r = SFN.fromString(chars.slice(pivotIndex + 1).join(""), node);

    return node;
  }

  static getPreOrderNodes(node: SFN): SFN[] {
    const nodes: SFN[] = [];

    if (node.l !== null) {
      if (node.l.k !== null) {
        nodes.push(node.l);
      } else {
        SFN.getPreOrderNodes(node.l).forEach(n => nodes.push(n));
      }
    }

    if (node.r !== null) {
      if (node.r.k !== null) {
        nodes.push(node.r);
      } else {
        SFN.getPreOrderNodes(node.r).forEach(n => nodes.push(n));
      }
    }

    return nodes;
  }

  static add(num1: SFN, num2: SFN): SFN {
    if (num1.p !== null || num2.p !== null) {
      throw new Error("Addition must be of two SFN roots");
    }

    const sum = new SFN();

    sum.l = num1;
    num1.p = sum;
    sum.r = num2;
    num2.p = sum;

    sum.reduce();

    return sum;
  }

  static explode(node?: SFN): void {
    if (node === undefined) throw new Error("Cannot explode undefined");
    if (node.p === null) throw new Error("Cannot explode unnested node");
    if (node.l === null || node.r === null) throw new Error("Exploding a node requires children");
    if (node.l.k === null || node.r.k === null) throw new Error("Exploding a node requires children to have normal values");

    let root = node.p;

    while (root.p !== null) {
      root = root.p;
    }

    const nodesLeftToRight = SFN.getPreOrderNodes(root);

    const leftOfLeft = nodesLeftToRight[nodesLeftToRight.findIndex(n => n === node.l) - 1];
    
    if (leftOfLeft !== undefined && leftOfLeft.k !== null) {
      leftOfLeft.k += node.l.k;
    }
    
    const rightOfRight = nodesLeftToRight[nodesLeftToRight.findIndex(n => n === node.r) + 1];

    if (rightOfRight !== undefined && rightOfRight.k !== null) {
      rightOfRight.k += node.r.k;
    }

    node.l = null;
    node.r = null;
    node.k = 0;
  }

  static split(node?: SFN): void {
    if (node === undefined) throw new Error("Cannot split undefined");
    if (node.k === null) throw new Error("To split a node, it must contain a value");
    
    node.l = new SFN();
    node.l.p = node;
    node.l.k = Math.floor(node.k / 2);
    
    node.r = new SFN();
    node.r.p = node;
    node.r.k = Math.ceil(node.k / 2);
    
    node.k = null;
  }

  reduce = (): void => {
    if (this.p !== null) throw new Error("Can only reduce from the root");

    const reduceStatus: ReduceStatus = {
      toExplode: [],
      toSplit: [],
    };

    let done = false;

    while (!done) {
      this.reduceСheck(reduceStatus);

      if (reduceStatus.toExplode.length > 0) {
        SFN.explode(reduceStatus.toExplode.shift());
      } else if (reduceStatus.toSplit.length > 0) {
        SFN.split(reduceStatus.toSplit.shift());
      } else {
        done = true;
      }

      // Reset actions to take
      reduceStatus.toExplode = [];
      reduceStatus.toSplit = [];
    }
  };

  reduceСheck = (status: ReduceStatus): void => {
    let depth = 0;

    if (this.p !== null) {
      let current = this.p;
      depth++;

      while (current.p !== null) {
        depth++;
        current = current.p;
      }
    }

    if (this.k !== null) {
      if (this.k > 9) {
        status.toSplit.push(this);
        return;
      }
    } else {
      // Explode
      if (depth > 3) {
        status.toExplode.push(this);
        return;
      }

      this.l?.reduceСheck(status);
      this.r?.reduceСheck(status);
    }
  };

  magnitude(): number {
    if (this.k !== null) return this.k;

    let sum = 0;

    if (this.l !== null) {
      sum += 3 * this.l.magnitude();
    }

    if (this.r !== null) {
      sum += 2 * this.r.magnitude();
    }

    return sum;
  }

  toString(): string {
    let str = "[";

    if (this.l !== null && this.l.k !== null) {
      str += this.l.k;
    } else {
      str += this.l?.toString();
    }

    str += ",";

    if (this.r !== null && this.r.k !== null) {
      str += this.r.k;
    } else {
      str += this.r?.toString();
    }

    return str += "]";
  }
}
