import {Injectable} from '@angular/core';
import {Mutation} from 'apollo-angular';
import gql from 'graphql-tag';
import {ImportImdbMovieResponse} from '../_models';

@Injectable({
  providedIn: 'root',
})
export class ImportImdbMovieGQL extends Mutation<ImportImdbMovieResponse> {
  document = gql`
    mutation importImdbMovie(
      $imdbNumber: Int!
    ){
      importImdbMovie(imdbNumber: $imdbNumber){
        tapeId
        originalTitle
        object{
          imdbNumber{
            imdbNumber
          }
        }
        tvShow{
          tape{
            tapeId
          }
        }
        tvShowChapter{
          tape{
            tapeId
          }
          tvShow{
            tape{
              tapeId
            }
          }
        }
      }
    }
  `;
}
