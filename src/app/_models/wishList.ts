import {Tape} from './tape';
import {TapeUser} from './tapeUser';
import {TapeUserHistory} from './tapeUserHistory';
import {TapeUserStatus} from './tapeUserStatus';
import {User} from './user';

export interface WishList {
  tape: Tape;
  tapeUser: TapeUser;
  tapeUserHistory: TapeUserHistory;
  tapeUserStatus: TapeUserStatus;
  user: User;
}
