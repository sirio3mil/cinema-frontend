import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { ListTapeUserStatusResponse } from '../_models';

@Injectable({
  providedIn: 'root'
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
