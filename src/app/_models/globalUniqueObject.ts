import {Tape} from './tape';
import {ImdbNumber} from './imdbNumber';
import {File} from './file';

export interface GlobalUniqueObject {
  tape: Tape;
  imdbNumber: ImdbNumber;
  files: File[];
  thumbnail: File;
  cover: File;
  objectId: string;
}
