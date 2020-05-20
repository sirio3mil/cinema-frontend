import {TapeDetail} from './tapeDetail';
import {TapeUser} from './tapeUser';
import {GlobalUniqueObject} from './globalUniqueObject';
import {TvShow} from './tvShow';
import {TvShowChapter} from './tvShowChapter';
import {Country} from './country';
import {Genre} from './genre';
import {Language} from './language';
import {TapeDefaultValue} from './tapeDefaultValue';

export interface Tape {
  tapeId: number;
  originalTitle: string;
  detail: TapeDetail;
  tapeUser: TapeUser;
  object: GlobalUniqueObject;
  isTvShow: boolean;
  tvShow: TvShow;
  tvShowChapter: TvShowChapter;
  countries: Country[];
  genres: Genre[];
  languages: Language[];
  default: TapeDefaultValue;
}
