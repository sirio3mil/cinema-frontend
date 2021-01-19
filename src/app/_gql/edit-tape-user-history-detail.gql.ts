import { Injectable } from '@angular/core';
import { gql, Mutation } from 'apollo-angular';
import { EditTapeUserHistoryDetailResponse } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class EditTapeUserHistoryDetailGql extends Mutation<EditTapeUserHistoryDetailResponse> {
  document = gql`
    mutation editTapeUserHistoryDetail(
      $tapeUserHistoryDetailId: TapeUserHistoryDetailID!,
      $visible: Boolean!
    ){
      editTapeUserHistoryDetail(
        tapeUserHistoryDetailId: $tapeUserHistoryDetailId,
        input: {
          visible: $visible
        }
      ){
        tapeUserHistoryDetailId,
        visible
        exported
        place{
          placeId
          description
        }
        createdAt
      }
    }
  `;
}
