import * as path from 'node:path';
import { GameDataFile, OS, SignatureWithBytes } from './types';
import * as fs from 'node:fs/promises';

const dataFolder = path.join(__dirname, '..', 'data');

export function getServerFilePath(os: OS) {
  if (os === OS.Windows) {
    return path.join(dataFolder, 'server.dll');
  }

  if (os === OS.Linux) {
    return path.join(dataFolder, 'libserver.so');
  }

  throw new Error('Unsupported OS');
}

export function indexesOf(value: number[], pattern: number[]): number[] {
  const indexes: number[] = [];

  for (let i = 0; i <= value.length - pattern.length; i++) {
    let j: number;

    for (j = 0; j < pattern.length; j++) {
      if (pattern[j] !== 0x2a && value[i + j] !== pattern[j]) {
        break;
      }
    }

    if (j === pattern.length) {
      indexes.push(i);
    }
  }

  return indexes;
}

export function getSignaturesWithBytes(
  gameData: GameDataFile,
): SignatureWithBytes[] {
  const signatures = gameData.Games.csgo.Signatures;

  const signatureNames = Object.keys(signatures);

  const signatureWithBytes: SignatureWithBytes[] = signatureNames.map(
    (name) => {
      const signature = signatures[name];

      return {
        ...signature,
        name,
        windowsBytes: signature['windows']
          .split('\\x')
          .slice(1)
          .map((byte) => parseInt(byte, 16)),
        linuxBytes: signature['linux']
          .split('\\x')
          .slice(1)
          .map((byte) => parseInt(byte, 16)),
      };
    },
  );

  return signatureWithBytes;
}

export async function getServerFileAsBytesByOs(os: OS): Promise<number[]> {
  const serverPath = getServerFilePath(os);
  const serverFile = await fs.readFile(serverPath);
  const serverBytes = Array.from(serverFile);

  return serverBytes;
}
