import {Mutation} from 'apollo-angular';
import {DeleteTapeUserHistoryResponse} from '../_models';
import gql from 'graphql-tag';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DeleteTapeUserHistoryGql extends Mutation<DeleteTapeUserHistoryResponse> {
  document = gql`
    mutation deleteTapeUserHistory(
      $tapeUserHistoryId: TapeUserHistoryID!
    ){
      deleteTapeUserHistory(
        tapeUserHistoryId: $tapeUserHistoryId
      ){
        tapeUserId
        tape{
          tapeId,
          originalTitle,
          tvShow{
            lastChapter{
              season,
              chapter,
              createdAt
            }
          },
          object{
            objectId
            files{
              url
            }
            imdbNumber{
              imdbNumber
              url
            }
            thumbnail{
              url
            }
          }
        }
      }
    }
  `;
}
