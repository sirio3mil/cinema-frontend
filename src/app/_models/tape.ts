import {TapeDetail} from './tapeDetail';
import {TapeUser} from './tapeUser';

export interface Tape {
  tapeId: number;
  originalTitle: string;
  detail: TapeDetail;
  tapeUser: TapeUser;
}
