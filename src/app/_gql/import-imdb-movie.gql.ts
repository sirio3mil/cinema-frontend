import { Injectable } from '@angular/core';
import { gql, Mutation } from 'apollo-angular';
import { ImportImdbMovieResponse } from '../_models';

@Injectable({
  providedIn: 'root'
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
          hasCover
          isTvShow
          isTvShowChapter
          isAdult
          createdAt
          updatedAt
        }
        default{
          title{
            searchParam
          }
          cast{
            fullName
          }
          director{
            fullName
          }
          country{
            officialName
          }
        }
        object{
          objectId
          imdbNumber{
            imdbNumber
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
