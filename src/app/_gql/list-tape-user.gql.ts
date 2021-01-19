import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { ListTapeUserResponse } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class ListTapeUserGql extends Query<ListTapeUserResponse> {
  document = gql`
    query listTapeUser(
      $userId: UserID!,
      $tapeUserStatusId: TapeUserStatusID!
      $isTvShow: Boolean,
      $visible: Boolean,
      $finished: Boolean,
      $page: Int!,
      $pageSize: Int!
    ){
      listTapeUser(
        userId: $userId,
        tapeUserStatusId: $tapeUserStatusId,
        isTvShow: $isTvShow,
        visible: $visible,
        finished: $finished,
        page: $page,
        pageSize: $pageSize
      ){
        total,
        pages,
        elements{
          tape{
            tapeId,
            originalTitle,
            tvShow{
              lastChapter{
                season,
                chapter,
                createdAt,
                tape{
                  tapeId
                }
              },
              summaryByUser(
                user: $userId
              ){
                viewedChapter{
                  tape{
                    tapeId
                  }
                }
              }
            },
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
            }
          }
        }
      }
    }
  `;
}
