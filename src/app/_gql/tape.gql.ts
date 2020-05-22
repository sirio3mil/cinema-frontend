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
          hasCover
          isTvShow
          isTvShowChapter
          isAdult
          createdAt
          updatedAt
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
        object{
          objectId
          cover{
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
              tapeUserHistoryDetailId,
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
            season
            chapter
            tape {
              tapeId
            }
          }
          summaryByUser(
            user: $userId
          ){
            importedChapter{
              chapter
              season
              tape{
                originalTitle
              }
            }
            viewedChapter{
              chapter
              season
              tape{
                originalTitle
              }
            }
          }
        }
      }
    }
  `;
}
