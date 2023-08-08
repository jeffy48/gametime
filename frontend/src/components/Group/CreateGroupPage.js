import { useState } from 'react';
import { csrfFetch } from '../../store/csrf';
import { useHistory } from 'react-router-dom';
import './CreateGroupPage.css';

function CreateGroupPage() {
  const [ location, setLocation ] = useState("");
  const [ name, setName ] = useState("");
  const [ about, setAbout ] = useState("");
  const [ groupImage, setGroupImage ] = useState("");
  const [ type, setType ] = useState("In person");
  const [ groupPrivate, setGroupPrivate ] = useState("false");
  const [ errors, setErrors ] = useState({});
  const [ imageErrors, setImageErrors ] = useState({});
  const history = useHistory();

  const createGroup = async (groupBody) => {
    const { name, about, type, groupPrivate, city, state, groupImage } = groupBody;
    let newPrivate;
    if (groupPrivate === 'true') {
      newPrivate = true;
    } else {
      newPrivate = false;
    };

    const res = await csrfFetch("/api/groups", {
      method: "POST",
      body: JSON.stringify({
        name,
        about,
        type,
        private: newPrivate,
        city,
        state
      }),
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  };

  const createGroupImage = async (url, groupId) => {
    const res = await csrfFetch(`/api/groups/${groupId}/images`, {
      method: "POST",
      body: JSON.stringify({
        imageableId: groupId,
        imageableType: "Group",
        url,
        preview: true
      }),
    });

    const data = res.json();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setImageErrors({});

    const [ city, state ] = location.split(', ');

    const body = {
      name,
      about,
      type,
      groupPrivate,
      city,
      state,
      groupImage
    };

    return createGroup(body)
      .then((data) => {
        const groupId = data.id;
        return groupId;
      })
      .then((groupId) => {
        createGroupImage(groupImage, groupId)
        history.push(`/groups/${groupId}`);
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      })
  };

  return (
    <main className="create-group">
      <div className="create-group__title">Start a New Group</div>
      <form onSubmit={handleSubmit}>
        <div className="create-group__location">
          <h1>Set your group's location</h1>
          <div>
            Meetup groups meet locally, in person and online. We'll connect you with people
            <br></br>in your area, and more can join you online.
          </div>
          <input
            type="text"
            placeholder="City, STATE"
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
            placeholder="What is your group name?"
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
            placeholder="Please write at least 50 characters."
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
          <label for="group-image-input">Please add an image url for your group below.</label>
          <input
            type="text"
            placeholder="Image Url"
            value={groupImage}
            onChange={(e) => setGroupImage(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="create-group__submit"
          disabled={!(location?.length > 0) || !(name?.length > 0) || !(about?.length > 0) || !(type?.length > 0) || !(groupPrivate?.length > 0) || !(groupImage?.length > 0)}
          >Create group
        </button>
      </form>
    </main>
  );
};

export default CreateGroupPage;
