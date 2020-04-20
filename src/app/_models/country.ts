import {Language} from './language';

export interface Country {
  countryId: number;
  createdAt: Date;
  isoCode: string;
  language: Language;
  officialName: string;
}
