import React, { Fragment } from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import { LaunchTile, Header, Button, Loading } from '../components';

export const LAUNCH_TILE_DATA = gql`
  fragment LaunchTile on Launch {
    id
    isBooked
    rocket {
      id
      name
    }
    mission {
      name
      missionPatch
    }
  }
`;

const GET_LAUNCHES = gql`
  query launchList($after: String) {
    launches(after: $after) {
      cursor
      hasMore
      launches {
        ...LaunchTile
      }
    }
  }
  ${LAUNCH_TILE_DATA}
`;

export default function Launches() {
  return (
    <Query query={GET_LAUNCHES}>
      {({data, loading, error, fetchMore }) => {
        if(loading) return <Loading />;
        if(error) return <p>Error</p>;

        return (
          <Fragment>
            <Header />
            {
              data.launches &&
              data.launches.launches &&
              data.launches.launches.map(launch => (
                <LaunchTile
                  key={launch.id}
                  launch={launch}
                />
              ))}
          {
            data.launches &&
            data.launches.hasMore && (
              <Button
                onClick={() => 
                  fetchMore({
                    variables: {
                      after: data.launches.cursor,
                    },
                    updateQuery: (prev, { fetchMoreResult, ...rest}) => {
                      if (!fetchMoreResult) return prev;
                      return {
                        ...fetchMoreResult,
                        launches: {
                          ...fetchMoreResult.launches,
                          launches: [
                            ...prev.launches.launches,
                            ...fetchMoreResult.launches.launches,
                          ],
                        },
                      };
                    },
                  })
                }
              >
                Load More
              </Button>
            )
          }
          </Fragment>
        );
      }}
    </Query>
  );
}
