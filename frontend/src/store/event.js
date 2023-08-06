import { csrfFetch } from "./csrf";

const LOAD_EVENTS_BY_GROUP = 'gametime/group/LOADNUMEVENTS';

const loadEventsByGroup = events => ({
  type: LOAD_EVENTS_BY_GROUP,
  events: events
});

export const getGroupEvents = (groupId) => async dispatch => {
  const res = await csrfFetch(`/api/events/groups/${groupId}`);

  if (res.ok) {
    const events = await res.json();
    dispatch(loadEventsByGroup(events.Events));
  };
};

const initialState = { events: [] };

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EVENTS_BY_GROUP:
      return { ...state, events: action.events }
    default:
      return state;
  }
}

export default eventReducer;
