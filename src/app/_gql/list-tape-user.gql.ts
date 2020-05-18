import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';
import {ListTapeUserResponse} from '../_models';

@Injectable({
  providedIn: 'root',
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
                createdAt
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
          }
        }
      }
    }
  `;
}
