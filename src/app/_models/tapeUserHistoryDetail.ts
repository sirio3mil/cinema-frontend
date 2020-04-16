import {Place} from './place';

export interface TapeUserHistoryDetail {
  visible: boolean;
  exported: boolean;
  place: Place;
  createdAt: Date;
}
