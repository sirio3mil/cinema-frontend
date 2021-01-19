import { Injectable } from '@angular/core';
import { gql, Mutation } from 'apollo-angular';
import { ImportImdbEpisodeResponse } from '../_models';

@Injectable({
  providedIn: 'root'
})
export class ImportImdbEpisodeGql extends Mutation<ImportImdbEpisodeResponse> {
  document = gql`
    mutation importImdbEpisodes(
      $imdbNumber: Int!,
      $seasonNumber: Int!
    ){
      importImdbEpisodes(
        imdbNumber: $imdbNumber,
        seasonNumber: $seasonNumber
      ){
        season
        chapter
        createdAt
        tvShow{
          tape{
            tapeId
            originalTitle
            object{
              imdbNumber{
                imdbNumber
              }
            }
          }
        }
        tape{
          tapeId
          originalTitle
          object{
            imdbNumber{
              imdbNumber
            }
          }
        }
      }
    }
  `;
}
