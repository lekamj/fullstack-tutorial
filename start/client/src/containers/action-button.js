import gql from 'graphql-tag';
import React from 'react';
import { Mutation } from 'react-apollo';

import { GET_LAUNCH_DETAILS } from '../pages/launch';
import Button from '../components/button';

const TOGGLE_CART = gql`
  mutation addOrRemoveFromCart($launchId: ID!) {
    addOrRemoveFromCart(id: $launchId) @client
  }
`;

const CANCEL_TRIP = gql`
  mutation cancel($launchId: ID!) {
    cancelTrip(launchId: $launchId) {
      success
      message
      launches {
        id
        isBooked
      }
    }
  }
`;

export default function ActionButton({ isBooked, id, isInCart }) {
  return (
    <Mutation
      mutation={isBooked? CANCEL_TRIP : TOGGLE_CART}
      variable={{launchId: id}}
      refetchQueries={[
        {
          query: GET_LAUNCH_DETAILS,
          variables: { launchId: id },
        }
      ]}
    >
      {(mutate, {loading, error}) => {
        if (loading) return <p> Loading...</p>;
        if (error) return <p> An error occured </p>;

        return (
          <div>
            <Button 
              onClick={mutate}
              isBooked={isBooked}
              data-testid={'action-button'}
            >
              {isBooked
                ? 'Cancel This Trip'
                : isInCart
                ? 'Remove from Cart'
                : 'Add to Cart'
              }
            </Button>
          </div>
        );
      }}
    </Mutation>
  );
}
