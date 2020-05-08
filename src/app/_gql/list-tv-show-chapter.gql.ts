import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';
import {ListTvShowChapterResponse} from '../_models';

@Injectable({
  providedIn: 'root',
})
export class ListTvShowChapterGql extends Query<ListTvShowChapterResponse> {
  document = gql`
    query listTvShowChapter(
      $userId: UserID!,
      $tvShowId: TvShowID!,
      $season: Int!
    ){
      listTvShowChapter(
        tvShowId: $tvShowId,
        season: $season
      ){
        season
        chapter
        tape{
          tapeId
          originalTitle
          createdAt
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
          }
        }
      }
    }
  `;
}
