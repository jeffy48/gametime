import { useParams } from 'react-router-dom';

function CreateEvent() {
  const { groupId } = useParams();
  const [ name, setName ] = useState("");
  const [ type, setType ] = useState("");
  const [ eventPrivate, setEventPrivate ] = useState("");
  const [ price, setPrice ] = useState("");
  const [ startDate, setStartDate ] = useState("");
  const [ endDate, setEndDate ] = useState("");
  const [ url, setUrl ] = useState("");
  const [ desc, setDesc ] = useState("");

  return (
    <main>
      <h1>Create an event for </h1>
      <label>What is the name of your event?</label>
      <input
        type="text"
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <label>Is this an in person or online event?</label>
      <select
        onChange={() => setType(e.target.value)}
        value={type}>
        <option value="In person">In person</option>
        <option value="Online">Online</option>
      </select>
      <label>Is this event private or public?</label>
      <select
        onChange={() => setEventPrivate(e.target.value)}
        value={eventPrivate}>
        <option value="true">Private</option>
        <option value="false">Public</option>
      </select>
      <label>What is the price for your event?</label>
      <input
        type="number"
        placeholder='0'
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <label>When does your event start?</label>
      <input
        type="text"
        placeholder="MM/DD/YYYY, HH/mm AM"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <label>When does your event end?</label>
      <input
        type="text"
        placeholder="MM/DD/YYYY, HH/mm AM"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <label>Please add in image url for your event below:</label>
      <input
        type="text"
        placeholder="Image URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />
      <label>Please describe your next event:</label>
      <textarea name="desc" rows="5" cols="33">Please include at least 30 characters.</textarea>
      <button>Create Event</button>
    </main>
  );
}

export default CreateEvent;
