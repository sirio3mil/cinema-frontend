import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { TapeResponse } from '../_models';

@Injectable({
  providedIn: 'root'
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
          ranking{
            calculatedScore
            score
            votes
          }
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
          score{
            score
          }
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
