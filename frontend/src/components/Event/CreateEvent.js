import { useParams, useHistory } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { csrfFetch } from '../../store/csrf';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupVenues } from '../../store/venue';
import { getDetails } from '../../store/group';
import './CreateEvent.css';

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
  const [ venueId, setVenueId ] = useState(null);
  const dispatch = useDispatch();
  const groupVenues = useSelector(state => state.venue ? state.venue?.groupVenues : []);
  const details = useSelector(state => state.group ? state.group?.details : {});

  useEffect(() => {
    dispatch(getGroupVenues(groupId));
    dispatch(getDetails(groupId));
  }, [dispatch]);

  const createEvent = async (eventBody) => {
    const { groupId, venueId, name, type, price, startDate, endDate, description } = eventBody;
    const startDateObj = new Date(startDate); // turn into date obj
    const endDateObj = new Date(endDate);

    // convert to utc from local, then store this in backend
    const backendStartDate = startDateObj.toUTCString();
    const backendEndDate = endDateObj.toUTCString();

    // convert back to user's local time, display this in frontend

    const res = await csrfFetch(`/api/events/groups/${groupId}`, {
      method: "POST",
      body: JSON.stringify({
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate: backendStartDate,
        endDate: backendEndDate
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
      groupId: Number(groupId),
      venueId,
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
        history.push(`/events/${eventId}`);
      })
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      })
  };

  const handleVenueClick = () => {
    history.push(`/venues/groups/${groupId}`)
  };

  const hasVenueInPerson = () => {
    if (type === 'In person' && groupVenues.length > 0) {
      return true; //disply dropdown
    } else {
      return false;
    }
  };

  const noVenueInPerson = () => {
    if (type === 'In person' && groupVenues.length === 0) {
      return true; //display create venue modal button
    } else {
      return false;
    }
  };

  return (
    <form className="create-event" onSubmit={handleSubmit}>
      <h1>Create an event for {details?.name}</h1>
      <label>What is the name of your event?</label>
      <input
        type="text"
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      {errors.name && <p>{errors.name}</p>}
      <label className="create-event__label-1">Is this an in person or online event?</label>
      <select
        onChange={(e) => setType(e.target.value)}
        value={type}>
        <option value="" disabled selected hidden>Choose a type</option>
        <option value="In person">In person</option>
        <option value="Online">Online</option>
      </select>
      {errors.type && <p>{errors.type}</p>}
      {hasVenueInPerson() && (
      <div>
        <label>Which venue will the event be held?</label>
        <select
          onChange={(e) => setVenueId(e.target.value)}
          value={venueId}
          required>
          <option value="" disabled selected hidden>Choose a venue</option>
          {groupVenues?.map(venue => {
            return (
              <option value={venue.id}>{venue.id}</option>
            )
          })}
        </select>
      </div>
      )}
      {noVenueInPerson() && (
        <div>
          <p>A venue is required for an In person event</p>
          <button onClick={handleVenueClick}>Create a Venue</button>
        </div>
      )}
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
        placeholder={0}
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      {errors.price && <p>{errors.price}</p>}
      <label className="create-event__label-capacity">What is the capacity of your event?</label>
      <input
        type="number"
        value={capacity}
        onChange={(e) => setCapacity(e.target.value)}
      />
      {errors.capacity && <p>{errors.capacity}</p>}
      <label className="create-event__label-start">When does your event start?</label>
      <input
        type="text"
        placeholder="MM-DD-YYYY, HH:mm AM"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      {errors.startDate && <p>{errors.startDate}</p>}
      <label className="create-event__label-end">When does your event end?</label>
      <input
        type="text"
        placeholder="MM-DD-YYYY, HH:mm PM"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className="create-event__input-end"
      />
      {errors.endDate && <p>{errors.endDate}</p>}
      <label className="create-event__label-imageurl">Please add in image url for your event below:</label>
      <input
        type="text"
        placeholder="Image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        className="create-event__label-image-input"
      />
      {errors.previewImage && <p>{errors.previewImage}</p>}
      <label className="create-event__label-about">Please describe your next event:</label>
      <textarea name="desc" rows="5" cols="33" onChange={(e) => setDesc(e.target.value)}>Please include at least 30 characters.</textarea>
      {errors.description && <p>{errors.description}</p>}
      <button className="create-event-button" type="submit">Create Event</button>
    </form>
  );
}

export default CreateEventPage;
