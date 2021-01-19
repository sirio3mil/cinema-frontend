import { Injectable } from '@angular/core';
import { gql, Mutation } from 'apollo-angular';
import { ImportFileResponse } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class ImportFileGql extends Mutation<ImportFileResponse> {
  document = gql`
    mutation importFile(
      $globalUniqueObjectId: GlobalUniqueObjectID!,
      $url: String!
    ){
      importFile(
        globalUniqueObjectId: $globalUniqueObjectId,
        url: $url
      ){
        objectId,
        imdbNumber{
          url
        }
        files{
          url
        }
        thumbnail{
          url
        }
      }
    }
  `;
}
