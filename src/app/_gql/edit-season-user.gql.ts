import { Injectable } from '@angular/core';
import { gql, Mutation } from 'apollo-angular';
import { EditSeasonUserResponse } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class EditSeasonUserGql extends Mutation<EditSeasonUserResponse> {
  document = gql`
    mutation editSeasonUser(
      $userId: UserID!,
      $tvShowId: TvShowID!,
      $tapeUserStatusId: TapeUserStatusID!,
      $placeId: PlaceID!,
      $season: Int!
    ){
      editSeasonUser(
        userId: $userId,
        tvShowId: $tvShowId,
        tapeUserStatusId: $tapeUserStatusId,
        placeId: $placeId,
        season: $season
      ){
        tapeUserId
        tape{
          tapeId
        }
        score{
          score
          createdAt
        }
        history{
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
