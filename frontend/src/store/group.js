const LOAD = 'gametime/group/LOAD';

const load = list => ({
  type: LOAD,
  list
});

export const getGroups = () => async dispatch => {
  const res = await fetch('/api/groups');
  console.log(res);

  if (res.ok) {
    const groupList = await res.json();
    dispatch(load(groupList));
    return res;
  };
};

const initialState = { list: null };

const groupReducer = (state = initialState, action) => {
  let newState;
  switch (action.type) {
    case LOAD:
      newState = Object.assign({}, state);
      newState.list = action.list;
      return newState;
    default:
      return state;
  }
}

export default groupReducer;
