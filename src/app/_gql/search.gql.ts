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
      $page: Int!,
      $pageSize: Int!,
      $rowType: Int,
      $userId: UserID!
    ){
      search(
        pattern: $pattern,
        page: $page,
        pageSize: $pageSize,
        rowType: $rowType
      ){
        searchParam
        object{
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
