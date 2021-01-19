import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { LoginResponse } from '../_models';

@Injectable({
  providedIn: 'root'
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
              objectId
              files{
                url
              }
              imdbNumber{
                url
              }
              thumbnail{
                url
              }
            }
            default{
              title{
                searchParam
              }
              cast{
                fullName
              }
              director{
                fullName
              }
              country{
                officialName
              }
            }
            detail{
              year
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
