import { useState } from 'react';
import { csrfFetch } from '../../store/csrf';

function CreateGroupPage() {
  const [ location, setLocation ] = useState("");
  const [ name, setName ] = useState("");
  const [ about, setAbout ] = useState("");
  const [ groupImage, setGroupImage ] = useState("");
  const [ type, setType ] = useState("");
  const [ groupPrivate, setGroupPrivate ] = useState(undefined);
  const [ errors, setErrors ] = useState({});

  const createGroup = async (groupBody) => {
    const { name, about, type, groupPrivate, city, state, groupImage } = groupBody;
    let newPrivate;
    if (groupPrivate === 'true') {
      newPrivate = true;
    } else {
      newPrivate = false;
    };

    console.log('hi', newPrivate)
    console.log(JSON.stringify({
      name,
      about,
      type,
      newPrivate,
      city,
      state
    }))

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

    const data = await res.json();
};

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      .catch(async (res) => {
        const data = await res.json();
        console.log(data);
      })
  };

  return (
    <main className="create-group">
      <div className="create-group__title">Start a New Group</div>
      {/* {errors && <p>{errors}</p>} */}
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
            placeholder="Please write at least 30 characters."
            value={about}
            onChange={(e) => setAbout(e.target.value)}
            required
            />
        </div>
        <div className="create-group__final">
          <label for="group-type-select">Is this an in-person or online group?</label>
          <select
            id="group-type-select"
            onChange={(e) => setType(e.target.value)}
            value={type}>
            <option value="" selected disabled hidden>(select one)</option>
            <option value="In person">In person</option>
            <option value="Online">Online</option>
          </select>
          <label for="group-private-select">Is this group private or public?</label>
          <select
            id="group-private-select"
            onChange={(e) => setGroupPrivate(e.target.value)}
            value={groupPrivate}>
            <option value="" selected disabled hidden>(select one)</option>
            <option value="true">Private</option>
            <option value="false">Public</option>
          </select>
          <label for="group-image-input">Please add an image url for your group below.</label>
          <input
            type="text"
            placeholder="Image Url"
            value={groupImage}
            onChange={(e) => setGroupImage(e.target.value)}
            required
            />
        </div>
        <button type="submit" className="create-group__submit">Create group</button>
      </form>
    </main>
  );
};

export default CreateGroupPage;
