import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';
import {LoginResponse} from '../_models';

@Injectable({
  providedIn: 'root',
})
export class LoginGql extends Query<LoginResponse> {
  document = gql`
    query login(
      $username: String!,
      $password: String!
    ){
      login(
        username: $username,
        password: $password
      ){
        userId
        username
        token
        oauthUser{
          firstName
          lastName
        }
        wishList{
          tape{
            tapeId
            originalTitle
            object{
              imdbNumber{
                url
              }
              thumbnail{
                url
              }
            }
          }
          tapeUserHistory{
            tapeUserHistoryId
          }
        }
      }
    }
  `;
}
