import {Country} from './country';
import {Tape} from './tape';
import {SearchValue} from './searchValue';
import {People} from './people';

export interface TapeDefaultValue {
  cast: People;
  country: Country;
  director: People;
  tape: Tape;
  title: SearchValue;
}
