import {Place} from './place';

export interface TapeUserHistoryDetail {
  tapeUserHistoryDetailId: number;
  visible: boolean;
  exported: boolean;
  place: Place;
  createdAt: Date;
}
