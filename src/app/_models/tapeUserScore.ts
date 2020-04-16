import {TapeUser} from './tapeUser';

export interface TapeUserScore {
  createdAt: Date;
  exported: boolean;
  score: number;
  tapeUser: TapeUser;
}
