import {TapeUserHistory} from './tapeUserHistory';
import {Tape} from './tape';
import {User} from './user';
import {TapeUserScore} from './tapeUserScore';

export interface TapeUser {
  tapeUserId: number;
  history: TapeUserHistory;
  tape: Tape;
  user: User;
  createdAt: Date;
  score: TapeUserScore;
}
