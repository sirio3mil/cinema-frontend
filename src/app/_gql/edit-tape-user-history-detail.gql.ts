import {Mutation} from 'apollo-angular';
import {EditTapeUserHistoryDetailResponse} from '../_models';
import gql from 'graphql-tag';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root',
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
