import {FileType} from './fileType';
import {GlobalUniqueObject} from './globalUniqueObject';
import {FileSeason} from './fileSeason';
import {Image} from './image';

export interface File {
  createdAt: Date;
  deletedAt: Date;
  extension: string;
  fileId: number;
  fileType: FileType;
  image: Image;
  isDeleted: boolean;
  mime: string;
  name: string;
  object: GlobalUniqueObject;
  path: string;
  season: FileSeason;
  size: number;
  url: string;
}
