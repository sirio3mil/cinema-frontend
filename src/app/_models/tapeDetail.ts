import {Tape} from './tape';

export interface TapeDetail {
  year: number;
  duration: number;
  adult: boolean;
  budget: number;
  color: string;
  createdAt: Date;
  currency: number;
  haveCover: boolean;
  isTvShow: boolean;
  isTvShowChapter: boolean;
  tape: Tape;
  updatedAt: Date;
}
