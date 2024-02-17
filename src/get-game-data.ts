import axios from 'axios';
import { parse } from '@node-steam/vdf';
import { GameDataFile } from './types';

const url =
  'https://raw.githubusercontent.com/KZGlobalTeam/cs2kz-metamod/dev/gamedata/cs2kz-core.games.txt';

export async function getGameData(): Promise<GameDataFile> {
  const { data: kvFile } = await axios.get(url);
  const parsedGameData = parse(kvFile) as GameDataFile;

  return parsedGameData;
}
