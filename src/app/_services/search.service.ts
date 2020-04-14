import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';

export class SearchService {
  results: any[];
  loading = true;
  error: any;

  constructor(private apollo: Apollo) {}

  getAll(pattern) {
    this.apollo
    .watchQuery({
      query: gql`
        {
          search(
            pattern: ${pattern},
            rowType: 4
          ){
            searchParam
            object{
              tape{
                tapeId
                originalTitle
                detail{
                  year
                  duration
                }
                tapeUser(
                  user: 1
                ){
                  tapeUserId
                  history{
                    tapeUserHistoryId
                    details{
                      visible
                      exported
                      place{
                        placeId
                        description
                      }
                    }
                    tapeUserStatus{
                      tapeUserStatusId
                      description
                    }
                  }
                }
              }
              imdbNumber{
                imdbNumber
              }
            }
          }
        }
      `,
    })
    .valueChanges.subscribe(result => {
      // @ts-ignore
      this.results = result.data && result.data.search;
      this.loading = result.loading;
      this.error = result.errors;
    });
  }
}
