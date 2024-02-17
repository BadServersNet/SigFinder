import { getGameData } from './get-game-data';
import { OS } from './types';
import {
  getSignaturesWithBytes,
  indexesOf,
  getServerFileAsBytesByOs,
} from './utils';

async function run() {
  const gameData = await getGameData();
  const signatures = getSignaturesWithBytes(gameData);

  const linuxServerAsBytes = await getServerFileAsBytesByOs(OS.Linux);
  const windowsServerAsBytes = await getServerFileAsBytesByOs(OS.Windows);

  signatures.forEach((signature) => {
    const linuxIndexes = indexesOf(linuxServerAsBytes, signature.linuxBytes);
    const windowsIndexes = indexesOf(
      windowsServerAsBytes,
      signature.windowsBytes,
    );

    console.log(
      `[linux] ${signature.name} found at ${linuxIndexes.length} indexes: ${linuxIndexes}`,
    );
    console.log(
      `[windows] ${signature.name} found at ${windowsIndexes.length} indexes: ${windowsIndexes}`,
    );
  });
}

run().catch(console.error);
