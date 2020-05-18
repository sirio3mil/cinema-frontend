import {GlobalUniqueObject} from './globalUniqueObject';

export interface People {
  createdAt: Date;
  fullName: string;
  object: GlobalUniqueObject;
  peopleId: number;
}
