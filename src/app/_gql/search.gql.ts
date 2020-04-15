import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';
import {SearchResponse} from '../_models';

@Injectable({
  providedIn: 'root',
})
export class SearchGQL extends Query<SearchResponse> {
  document = gql`
    query search(
      $pattern: String!,
      $rowType: Int!,
      $userId: UserID!
    ){
      search(
        pattern: $pattern,
        rowType: $rowType
      ){
        searchParam
        object{
          tape{
            tapeId
            originalTitle
            detail{
              year
              duration
            }
            tapeUser(
              user: $userId
            ){
              tapeUserId
              history{
                tapeUserHistoryId
                details{
                  visible
                  exported
                  place{
                    placeId
                    description
                  }
                }
                tapeUserStatus{
                  tapeUserStatusId
                  description
                }
              }
            }
          }
          imdbNumber{
            imdbNumber
          }
        }
      }
    }
  `;
}
