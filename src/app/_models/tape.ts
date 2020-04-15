import {TapeDetail} from './tapeDetail';
import {TapeUser} from './tapeUser';
import {GlobalUniqueObject} from './globalUniqueObject';
import {TvShow} from './tvShow';
import {TvShowChapter} from './tvShowChapter';

export interface Tape {
  tapeId: number;
  originalTitle: string;
  detail: TapeDetail;
  tapeUser: TapeUser;
  object: GlobalUniqueObject;
  tvShow: TvShow;
  tvShowChapter: TvShowChapter;
}
