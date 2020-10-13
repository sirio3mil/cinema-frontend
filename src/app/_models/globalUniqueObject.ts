import { File } from './file';
import { ImdbNumber } from './imdbNumber';
import { Ranking } from './ranking';
import { Tape } from './tape';

export interface GlobalUniqueObject {
  tape: Tape;
  imdbNumber: ImdbNumber;
  files: File[];
  thumbnail: File;
  cover: File;
  objectId: string;
  ranking: Ranking;
}
