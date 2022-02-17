export class ID {
  constructor(public ID: Uint8Array) {}

  public Less(other: ID): boolean {
    return this.ID < other.ID;
  }

  public Equal(other: ID): boolean {
    // there is no good array equals operator in JS
    return this.ID >= other.ID && this.ID <= other.ID;
  }

  public LessOrEqual(other: ID): boolean {
    return this.ID <= other.ID;
  }

  public Size(): IDSize {
    return this.ID.length;
  }

  public String(): string {
    return this.ID.toString(); // encoding?
  }
}

export type IDSize = number;

export type PrefixedData = Uint8Array;
