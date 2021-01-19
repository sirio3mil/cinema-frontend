import { Injectable } from '@angular/core';
import { gql, Mutation } from 'apollo-angular';
import { EditTvShowResponse } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class EditTvShowGql extends Mutation<EditTvShowResponse> {
  document = gql`
    mutation editTvShow(
      $tapeId: TapeID!,
      $finished: Boolean!
    ){
      editTvShow(
        input: {
          tape: $tapeId,
          finished: $finished
        }
      ){
        finished
      }
    }
  `;
}
