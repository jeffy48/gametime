import { csrfFetch } from "./csrf";

const LOAD = 'gametime/group/LOAD';
const LOAD_DETAILS = 'gametime/group/LOAD_DETAILS';
const CREATE = 'gametime/group/CREATE';
const DELETE = 'gametime/group/DELETE';

const load = list => ({
  type: LOAD,
  list: list
});

const loadDetails = details => ({
  type: LOAD_DETAILS,
  details: details
});

const deleteAction = () => ({
  type: DELETE
});

export const getGroups = () => async dispatch => {
  const res = await csrfFetch('/api/groups');

  if (res.ok) {
    const groupList = await res.json();
    dispatch(load(groupList.Groups));
  };
};

export const getDetails = (groupId) => async dispatch => {
  const res = await csrfFetch(`/api/groups/${groupId}`);

  if (res.ok) {
    const details = await res.json();
    dispatch(loadDetails(details));
  };
};

export const deleteGroup = (groupId) => async dispatch => {
  const res = await csrfFetch(`/api/groups/${groupId}`, {
    method: 'DELETE'
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(deleteAction())
  }
}

const initialState = { list: [], details: {} };

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      return { ...state, list: action.list }
    case LOAD_DETAILS:
      return { ...state, details: action.details }
    case DELETE:
      return { ...state }
    default:
      return state;
  }
}

export default groupReducer;
