import { csrfFetch } from "./csrf";

const LOAD = 'gametime/group/LOAD';

const load = list => ({
  type: LOAD,
  list: list
});

export const getGroups = () => async dispatch => {
  const res = await csrfFetch('/api/groups');

  if (res.ok) {
    const groupList = await res.json();
    console.log('OH MY GOD', groupList.Groups);
    dispatch(load(groupList.Groups));
  };
};

const initialState = { list: [] };

const groupReducer = (state = initialState, action) => {
  let newState = { ...state };
  switch (action.type) {
    case LOAD:
      return { ...state, list: action.list}
      // newState.list = action.list;
      // return newState;
    default:
      return state;
  }
}

export default groupReducer;
