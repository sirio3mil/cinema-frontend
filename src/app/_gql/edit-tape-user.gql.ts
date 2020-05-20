import {Injectable} from '@angular/core';
import {Mutation} from 'apollo-angular';
import gql from 'graphql-tag';
import {EditTapeUserResponse} from '../_models';

@Injectable({
  providedIn: 'root',
})
export class EditTapeUserGql extends Mutation<EditTapeUserResponse> {
  document = gql`
    mutation editTapeUser(
      $userId: UserID!,
      $tapeId: TapeID!,
      $tapeUserStatusId: TapeUserStatusID!,
      $placeId: PlaceID
    ){
      editTapeUser(
        userId: $userId,
        tapeId: $tapeId,
        tapeUserStatusId: $tapeUserStatusId,
        placeId: $placeId
      ){
        tapeUserId
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
            isTvShow
          }
        }
        score{
          score
          createdAt
        }
        history{
          tapeUserHistoryId
          details{
            visible
            exported
            place{
              placeId
              description
            }
            createdAt
          }
          tapeUserStatus{
            tapeUserStatusId
            description
          }
          createdAt
        }
      }
    }
  `;
}
