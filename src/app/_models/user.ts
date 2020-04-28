import {OauthUser} from './oauthUser';
import {WishList} from './wishList';

export interface User {
  userId: number;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  oauthUser: OauthUser;
  username: string;
  wishList: WishList[];
}
