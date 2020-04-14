import {NgModule} from '@angular/core';
import {ApolloModule, APOLLO_OPTIONS} from 'apollo-angular';
import {HttpLinkModule, HttpLink} from 'apollo-angular-link-http';
import {InMemoryCache} from 'apollo-cache-inmemory';
import { environment } from '../environments/environment';
import {ApolloLink, concat} from 'apollo-link';
import { AuthenticationService } from './_services';
import {HttpHeaders} from '@angular/common/http';

const uri = environment.APIEndpoint;

export function createApollo(httpLink: HttpLink, authenticationService: AuthenticationService) {
  const currentUser = authenticationService.currentUserValue;
  const authMiddleware = new ApolloLink((operation, forward) => {
    if (currentUser && currentUser.token) {
      // add the authorization to the headers
      operation.setContext({
        headers: new HttpHeaders().set('Authorization', `Bearer ${currentUser.token}`)
      });
    }

    return forward(operation);
  });
  return {
    link: concat(authMiddleware, httpLink.create({uri})),
    cache: new InMemoryCache(),
  };
}

@NgModule({
  exports: [ApolloModule, HttpLinkModule],
  providers: [
    {
      provide: APOLLO_OPTIONS,
      useFactory: createApollo,
      deps: [HttpLink, AuthenticationService],
    },
  ],
})
export class GraphQLModule {}
