import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';
import {TapeResponse} from '../_models';

@Injectable({
  providedIn: 'root',
})
export class TapeGql extends Query<TapeResponse> {
  document = gql`
    query tape(
      $tapeId: TapeID!,
      $userId: UserID!
    ){
      tape(
        tapeId: $tapeId
      ){
        tapeId
        originalTitle
        detail{
          year
          duration
          color
          haveCover
          adult
          createdAt
          updatedAt
        }
        object{
          imdbNumber{
            imdbNumber
          }
        }
        countries{
          countryId
          officialName
          isoCode
          language{
            languageId
            name
          }
        }
        genres{
          genreId
          name
        }
        languages{
          languageId
          name
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
              createdAt
            }
            tapeUserStatus{
              tapeUserStatusId
              description
            }
          }
        },
        tvShow{
          chapters{
            season,
            chapter,
            tape {
              tapeId
            }
          }
        }
      }
    }
  `;
}
