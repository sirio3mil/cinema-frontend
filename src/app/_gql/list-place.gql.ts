import { Injectable } from '@angular/core';
import { gql, Query } from 'apollo-angular';
import { ListPlaceResponse } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class ListPlaceGQL extends Query<ListPlaceResponse> {
  document = gql`
    query listPlace(
      $page: Int!,
      $pageSize: Int!
    ){
      listPlace(
        page: $page,
        pageSize: $pageSize
      ){
        total,
        pages,
        elements{
          placeId,
          description
        }
      }
    }
  `;
}
