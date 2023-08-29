import { useParams, useHistory } from 'react-router-dom';
import { useState } from 'react';
import { csrfFetch } from '../../store/csrf';

function CreateEventPage() {
  const history = useHistory();
  const { groupId } = useParams();
  const [ name, setName ] = useState("");
  const [ type, setType ] = useState("");
  const [ eventPrivate, setEventPrivate ] = useState("");
  const [ price, setPrice ] = useState("");
  const [ startDate, setStartDate ] = useState("");
  const [ endDate, setEndDate ] = useState("");
  const [ url, setUrl ] = useState("");
  const [ desc, setDesc ] = useState("");
  const [ errors, setErrors ] = useState({});
  const [ capacity, setCapacity ] = useState(10);

  const createEvent = async (eventBody) => {
    const { name, type, price, startDate, endDate, desc } = eventBody;

    const res = await csrfFetch(`/events/groups/${groupId}`, {
      method: "POST",
      body: JSON.stringify({
        groupId,
        venueId: 1,
        name,
        type,
        capacity: 100,
        price,
        description: desc,
        startDate,
        endDate
      }),
    });

    if (res.ok) {
      console.log('res is okay')
      const data = await res.json();
      return data;
    }
  };

  const createEventImage = async (url, eventId) => {
    const res = await csrfFetch(`/api/events/${eventId}/images`, {
      method: "POST",
      body: JSON.stringify({
        imageableId: eventId,
        imageableType: "Event",
        url,
        preview: true
      }),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const body = {
      groupId,
      venueId: 1,
      name,
      type,
      capacity,
      price,
      description: desc,
      startDate,
      endDate
    };

    return createEvent(body)
      .then((data) => {
        const eventId = data.id;
        return eventId;
      })
      .then((eventId) => {
        createEventImage(url, eventId)
        history.push(`/event/${eventId}`);
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      })
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>Create an event for </h1>
      <label>What is the name of your event?</label>
      <input
        type="text"
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      {errors.name && <p>{errors.name}</p>}
      <label>Is this an in person or online event?</label>
      <select
        onChange={(e) => setType(e.target.value)}
        value={type}>
        <option value="In person">In person</option>
        <option value="Online">Online</option>
      </select>
      {errors.type && <p>{errors.type}</p>}
      <label>Is this event private or public?</label>
      <select
        onChange={(e) => setEventPrivate(e.target.value)}
        value={eventPrivate}>
        <option value="true">Private</option>
        <option value="false">Public</option>
      </select>
      {errors.private && <p>{errors.private}</p>}
      <label>What is the price for your event?</label>
      <input
        type="number"
        placeholder='0'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      {errors.price && <p>{errors.price}</p>}
      <label>What is the capacity of your event?</label>
      <input
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      {errors.capacity && <p>{errors.capacity}</p>}
      <label>When does your event start?</label>
      <input
        type="text"
        placeholder="MM/DD/YYYY, HH/mm AM"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      {errors.startDate && <p>{errors.startDate}</p>}
      <label>When does your event end?</label>
      <input
        type="text"
        placeholder="MM/DD/YYYY, HH/mm AM"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      {errors.endDate && <p>{errors.endDate}</p>}
      <label>Please add in image url for your event below:</label>
      <input
        type="text"
        placeholder="Image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      {errors.previewImage && <p>{errors.previewImage}</p>}
      <label>Please describe your next event:</label>
      <textarea name="desc" rows="5" cols="33">Please include at least 30 characters.</textarea>
      {errors.description && <p>{errors.description}</p>}
      <button type="submit">Create Event</button>
    </form>
  );
}

export default CreateEventPage;
