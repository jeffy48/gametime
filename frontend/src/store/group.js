import { csrfFetch } from "./csrf";

const LOAD = 'gametime/group/LOAD';
const LOAD_DETAILS = 'gametime/group/LOAD_DETAILS';
const CREATE = 'gametime/group/CREATE';

const load = list => ({
  type: LOAD,
  list: list
});

const loadDetails = details => ({
  type: LOAD_DETAILS,
  details: details
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

// export const createGroup = (groupBody) => async (dispatch) => {
//   const { name, about, type, groupPrivate, city, state, groupImage } = groupBody;

//   if (groupPrivate === 'true') {
//     groupPrivate = true;
//   } else {
//     groupPrivate = false;
//   };

//   console.log('hi', typeof(groupPrivate))
//   const res = await csrfFetch("/api/groups", {
//     method: "POST",
//     body: JSON.stringify({
//       name,
//       about,
//       type,
//       groupPrivate,
//       city,
//       state
//     }),
//   });
//   const data = await res.json();
// };

const initialState = { list: [], details: {} };

const groupReducer = (state = initialState, action) => {
  switch (action.type) {
    case LOAD:
      return { ...state, list: action.list }
    case LOAD_DETAILS:
      return { ...state, details: action.details }
    default:
      return state;
  }
}

export default groupReducer;
