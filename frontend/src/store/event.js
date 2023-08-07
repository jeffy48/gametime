import { csrfFetch } from "./csrf";

const LOAD_EVENTS_BY_GROUP = 'gametime/event/LOAD_EVENTS_BY_GROUP';
const LOAD_EVENTS = 'gametime/event/LOAD_EVENTS';
const LOAD_DETAILS = 'gametime/event/LOAD_DETAILS';

const loadEventsByGroup = events => ({
  type: LOAD_EVENTS_BY_GROUP,
  events: events
});

const loadEvents = events => ({
  type: LOAD_EVENTS,
  list: events
});

const loadDetails = details => ({
  type: LOAD_DETAILS,
  details: details
});

export const getGroupEvents = (groupId) => async dispatch => {
  const res = await csrfFetch(`/api/events/groups/${groupId}`);

  if (res.ok) {
    const events = await res.json();
    dispatch(loadEventsByGroup(events.Events));
  };
};

export const getEvents = () => async dispatch => {
  const res = await csrfFetch('/api/events');

  if (res.ok) {
    const events = await res.json();
    dispatch(loadEvents(events.Events));
  }
};

export const getDetails = (eventId) => async dispatch => {
  const res = await csrfFetch(`/api/events/${eventId}`);

  if (res.ok) {
    const details = await res.json();
    console.log(res);
    dispatch(loadDetails(details));
  };
};

const initialState = { events: [], list: [], details: {} };

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EVENTS_BY_GROUP:
      return { ...state, events: action.events }
    case LOAD_EVENTS:
      return { ...state, list: action.list }
    case LOAD_DETAILS:
      return { ...state, details: action.details }
    default:
      return state;
  }
}

export default eventReducer;
