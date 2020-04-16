import {TapeUserHistoryDetail} from './tapeUserHistoryDetail';
import {TapeUserStatus} from './tapeUserStatus';

export interface TapeUserHistory {
  tapeUserHistoryId: number;
  details: TapeUserHistoryDetail[];
  tapeUserStatus: TapeUserStatus;
  createdAt: Date;
}
