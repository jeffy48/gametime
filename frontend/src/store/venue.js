import { csrfFetch } from "./csrf";

const LOAD_GROUP_VENUES = 'gametime/venue/LOAD_GROUP_VENUES';
const LOAD_CREATED_VENUE = 'gametime/venue/LOAD_CREATED_VENUE';

const loadGroupVenues = groupVenues => ({
  type: LOAD_GROUP_VENUES,
  groupVenues: groupVenues
});

const loadCreatedVenue = (createdVenue) => ({
  type: LOAD_CREATED_VENUE,
  createdVenue: createdVenue
});

export const getGroupVenues = (groupId) => async dispatch => {
  const res = await csrfFetch(`/api/venues/groups/${groupId}`);

  if (res.ok) {
    const groupVenues = await res.json();
    dispatch(loadGroupVenues(groupVenues.Venues));
  };
};

export const createVenue = (groupId, address, city, state, lat, lng) => async dispatch => {
  console.log('hi')
  const res = await csrfFetch(`/api/venues/groups/${groupId}`, {
    method: "POST",
    body: JSON.stringify({
      address,
      city,
      state,
      lat,
      lng
    })
  });

  if (res.ok) {
    const createdVenue = await res.json();
    dispatch(loadCreatedVenue(createdVenue));
  };
};

const initialState = { groupVenues: [], createdVenue:{} };

const venueReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_GROUP_VENUES:
      return { ...state, groupVenues: action.groupVenues }
    case LOAD_CREATED_VENUE:
      return { ...state, createdVenue: action.createdVenue }
    default:
      return state;
  }
}

export default venueReducer;
