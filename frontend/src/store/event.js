import { csrfFetch } from "./csrf";

const LOAD_EVENTS_BY_GROUP = 'gametime/event/LOAD_EVENTS_BY_GROUP';
const LOAD_EVENTS = 'gametime/event/LOAD_EVENTS';
const LOAD_DETAILS = 'gametime/event/LOAD_DETAILS';
const DELETE = 'gametime/event/DELETE';
const LOAD_EVENT_ATTENDEES = 'gametime/event/LOAD_EVENT_ATTENDEES';

const loadEventsByGroup = groupEvents => ({
  type: LOAD_EVENTS_BY_GROUP,
  groupEvents: groupEvents
});

const loadEvents = events => ({
  type: LOAD_EVENTS,
  list: events
});

const loadDetails = details => ({
  type: LOAD_DETAILS,
  details: details
});

const deleteAction = () => ({
  type: DELETE
})

const loadEventAttendees = attendees => ({
  type: LOAD_EVENT_ATTENDEES,
  attendees: attendees
})

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

export const deleteEvent = (eventId) => async dispatch => {
  const res = await csrfFetch(`/api/events/${eventId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(deleteAction())
  }
}

export const getEventAttendees = (eventId) => async dispatch => {
  const res = await csrfFetch(`/api/events/${eventId}/attendees`);

  if (res.ok) {
    const attendees = await res.json();
    dispatch(loadEventAttendees(attendees));
  }
}

const initialState = { groupEvents: [], list: [], details: {}, attendees: {} };

const eventReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD_EVENTS_BY_GROUP:
      return { ...state, groupEvents: action.groupEvents }
    case LOAD_EVENTS:
      return { ...state, list: action.list }
    case LOAD_DETAILS:
      return { ...state, details: action.details }
    case DELETE:
      return { ...state }
    case LOAD_EVENT_ATTENDEES:
      return { ...state, attendees: action.attendees }
    default:
      return state;
  }
}

export default eventReducer;
