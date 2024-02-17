export enum OS {
  Windows = 'windows',
  Linux = 'linux',
}

export interface GameDataFile {
  Games: Games;
}

interface Games {
  csgo: Game;
}

interface Game {
  Signatures: Record<string, Signature>;
  Offsets: Record<string, Offset>;
}

interface Signature {
  library: string;
  windows: string;
  linux: string;
}

interface Offset {
  windows: number;
  linux: number;
}

export interface SignatureWithBytes extends Signature {
  name: string;
  windowsBytes: number[];
  linuxBytes: number[];
}
