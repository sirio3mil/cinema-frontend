import {Injectable} from '@angular/core';
import {Query} from 'apollo-angular';
import gql from 'graphql-tag';
import {ListTapeUserStatusResponse} from '../_models';

@Injectable({
  providedIn: 'root',
})
export class ListTapeUserStatusGQL extends Query<ListTapeUserStatusResponse> {
  document = gql`
    query listTapeUserStatus(
      $page: Int!,
      $pageSize: Int!
    ){
      listTapeUserStatus(
        page: $page,
        pageSize: $pageSize
      ){
        total,
        pages,
        elements{
          tapeUserStatusId,
          description
        }
      }
    }
  `;
}
