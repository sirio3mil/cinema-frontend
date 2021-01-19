import { HttpHeaders } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ApolloLink, InMemoryCache } from '@apollo/client/core';
import { APOLLO_OPTIONS } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { environment } from '../environments/environment';
import { AuthenticationService } from './_services';

const uri = environment.apiEndpoint;

@NgModule({
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory(httpLink: HttpLink, authenticationService: AuthenticationService) {
        const currentUser = authenticationService.currentUserValue;
        const authMiddleware = new ApolloLink((operation, forward) => {
          if (currentUser && currentUser.token) {
            operation.setContext({
              headers: new HttpHeaders().set('Authorization', `Bearer ${currentUser.token}`)
            });
          }

          return forward(operation);
        });
        return {
          link: authMiddleware.concat(httpLink.create({ uri })),
          cache: new InMemoryCache()
        };
      },
      deps: [HttpLink, AuthenticationService]
    }
  ]
})
export class GraphQLModule {}
