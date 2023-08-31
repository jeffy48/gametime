import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useHistory } from 'react-router-dom';
import { getDetails } from "../../store/group";
import { csrfFetch } from "../../store/csrf";

function UpdateGroupPage() {
  // const GROUPS_BASE_PATH = ""
  const { groupId } = useParams();
  const dispatch = useDispatch();
  const details = useSelector(state => state.group ? state.group.details : {});
  const [ location, setLocation ] = useState(`${details?.city}, ${details?.state}`);
  const [ name, setName ] = useState(details?.name);
  const [ about, setAbout ] = useState(details?.about);
  const [ type, setType ] = useState(details?.type);
  const [ groupPrivate, setGroupPrivate ] = useState(details?.private);
  const [ errors, setErrors ] = useState({});
  const history = useHistory();
  const sessionUser = useSelector(state => state.session.user);

  const isOrganizer = () => {
    if (sessionUser?.id === details?.organizerId) return true;
    return false;
  };

  if (!sessionUser || !isOrganizer()) {
    history.push('/');
  };

  useEffect(() => {
    dispatch(getDetails(groupId))
  }, [dispatch]);

  const updateGroup = async (groupBody) => {
    const { name, about, type, groupPrivate, city, state } = groupBody;
    let newPrivate;
    if (groupPrivate === 'true') {
      newPrivate = true;
    } else {
      newPrivate = false;
    };

    // updateGroup(path)

    const res = await csrfFetch(`/api/groups/${groupId}`, {
      method: "PUT",
      body: JSON.stringify({
        name,
        about,
        type,
        private: newPrivate,
        city,
        state
      })
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    const [ city, state ] = location.split(', ');

    const body = {
      name,
      about,
      type,
      groupPrivate,
      city,
      state
    };

    return updateGroup(body)
      .then((data) => {
        const groupId = data.id;
        history.push(`/groups/${groupId}`);
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        };
      });
  };

  return (
    <main className="update-group">
      <div className="update-group__title">Update your group</div>
      <form onSubmit={handleSubmit}>
        <div className="update-group__location">
          <h1>Set your group's location</h1>
          <div>
            Meetup groups meet locally, in person and online. We'll connect you with people
            <br></br>in your area, and more can join you online.
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />
          {errors.city && <p>{errors.city}</p>}
          {errors.state && <p>{errors.state}</p>}
        </div>
        <div className="create-group__name">
          <h1>What will your group's name be?</h1>
          <div>
          Choose a name that will give people a clear idea of what the group is about.
          <br></br>Feel free to get creative! You can edit this later if you change your mind.
          </div>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          {errors.name && <p>{errors.name}</p>}
        </div>
        <div className="create-group__about">
          <h1>Describe the purpose of your group</h1>
          <div>
            People will see this when we promote your group, but you'll be able to add to it later, too.
            <br></br>
            <br></br>1. What's the purpose of the group?
            <br></br>2. Who should join?
            <br></br>3. What will you do at your events?
          </div>
          <input
            type="text"
            className='create-group__about__input'
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
          />
          {errors.about && <p>{errors.about}</p>}
        </div>
        <div className="create-group__final">
          <label style={{marginTop: "10px"}} for="group-type-select">Is this an in-person or online group?</label>
          <select
            id="group-type-select"
            onChange={(e) => setType(e.target.value)}
            value={type}>
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          {errors.type && <p>{errors.type}</p>}
          {/* {<p>hello</p>} */}
          <label for="group-private-select">Is this group private or public?</label>
          <select
            id="group-private-select"
            onChange={(e) => setGroupPrivate(e.target.value)}
            value={groupPrivate}>
            <option value="true">Private</option>
            <option value="false">Public</option>
          </select>
          {errors.private && <p>{errors.private}</p>}
        </div>
        <button
          type="submit"
          className="create-group__submit"
          >Update Group
        </button>
      </form>
    </main>
  );
}

export default UpdateGroupPage;
