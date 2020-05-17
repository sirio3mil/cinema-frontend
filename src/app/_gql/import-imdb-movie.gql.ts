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
        detail{
          year
          duration
          color
          haveCover
          adult
          createdAt
          updatedAt
        }
        object{
          objectId
          files{
            url
          }
          imdbNumber{
            imdbNumber
            url
          }
          thumbnail{
            url
          }
        }
        countries{
          countryId
          officialName
          isoCode
          language{
            languageId
            name
          }
        }
        genres{
          genreId
          name
        }
        languages{
          languageId
          name
        }
        tvShow{
          chapters{
            season
            chapter
            tape {
              tapeId
            }
          }
        }
      }
    }
  `;
}
