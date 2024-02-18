import { Worker, isMainThread, parentPort } from 'worker_threads';
import { getGameData } from './get-game-data';
import { OS, SignatureWithBytes } from './types';
import {
  getSignaturesWithBytes,
  indexesOf,
  getServerFileAsBytesByOs,
} from './utils';

const THREADS = 4;

interface TaskMessage {
  task: {
    signature: SignatureWithBytes;
    linuxServerAsBytes: number[];
    windowsServerAsBytes: number[];
  };
}

async function run() {
  if (isMainThread) {
    const gameData = await getGameData();

    const signatures = getSignaturesWithBytes(gameData);
    const linuxServerAsBytes = await getServerFileAsBytesByOs(OS.Linux);
    const windowsServerAsBytes = await getServerFileAsBytesByOs(OS.Windows);

    const workerThreads: Worker[] = [];

    for (let i = 0; i < THREADS; i++) {
      workerThreads.push(new Worker(__filename));
    }

    signatures.forEach((signature, index) => {
      const workerIndex = index % THREADS;

      workerThreads[workerIndex].postMessage({
        task: {
          signature,
          linuxServerAsBytes,
          windowsServerAsBytes,
          os: index < signatures.length / 2 ? OS.Linux : OS.Windows,
        },
      } as TaskMessage);
    });

    return;
  }

  if (parentPort == null) {
    throw new Error('We should have a parent port');
  }

  parentPort.on('message', (message) => {
    console.log(`Worker ${process.pid}: Received task`);
    performTask(message.task);
  });

  function performTask(task) {
    console.log('task', task);
  }
}

run().catch((err) => console.error(err));
