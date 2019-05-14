import React from 'react';
import { Mutation, ApolloConsumer } from 'react-apollo';
import gql from 'graphql-tag';

import { LoginForm, Loading } from '../components';

const LOGIN_USEr = gql`
  mutation login($email: String!) {
    login(email: $email)
  }
`;

export default function login() {
  return (
    <ApolloConsumer>
      {client => (
        <Mutation
          mutation={LOGIN_USER}
          onCompleted={({login}) => {
            localStorage.setItem('token', login);
            client.writeData({data: { isLoggedIn: true}});
          }}
        >
          {(login, {loading, error }) => {
            if (loading) return <Loading />;
            if (error) return <p> An error occured </p>;
            
            return <LoginForm login={login} />
          }}
        </Mutation>
      )}
    </ApolloConsumer>
  );
}
