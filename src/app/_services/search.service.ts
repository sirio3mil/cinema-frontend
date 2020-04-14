import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';

export interface SearchResult {
  searchParam: string;
  object: {
    tape: {
      tapeId: number;
      originalTitle: string;
      detail: {
        year: number;
        duration: number;
      };
      tapeUser: {
        tapeUserId: number;
        history: {
          tapeUserHistoryId: number;
          details: [{
            visible: boolean;
            exported: boolean;
            place: {
              placeId: number;
              description: string;
            }
          }];
          tapeUserStatus: {
            tapeUserStatusId: number;
            description: string;
          };
        };
      };
    };
    imdbNumber: {
      imdbNumber: bigint
    };
  };
}
export interface Response {
  results: SearchResult[];
}

@Injectable({
  providedIn: 'root',
})
export class SearchService extends Query<Response> {
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
