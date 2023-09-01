import { NavLink } from 'react-router-dom';
import './LandingPage.css'
import { useSelector } from 'react-redux';
import SignupFormModal from '../SignupFormModal';
import OpenModalButton from '../Modal/OpenModalButton';

function LandingPage() {
  const sessionUser = useSelector(state => state.session.user);

  const handleJoinClick = () => {
    return (
      <SignupFormModal />
    );
  };

  return (
    <main>
      <div className="home__welcome">
        <h1>
          The people platform -<br></br>Where interest <br></br>become friendships
        </h1>
        <p>
          Use Meetup to meet new people, learn new things,<br></br>find support, get out of your comfort zones,<br></br>and pursue your passions, together.
        </p>
        <img src="https://img.freepik.com/free-vector/people-waving-hand-illustration-concept_52683-29825.jpg?w=1480&t=st=1690859367~exp=1690859967~hmac=77c8fe80de7a008ba1217402449dffa0bafcf1510ca64a4114fa262a2a7a839e"/>
      </div>
      <div className="home__info">
        <h1>How Meetup works</h1>
        <div>Choose what you're into<br></br>·<br></br>Meet people in the area who share your passion<br></br>·<br></br>Do more of what makes you tick</div>
      </div>
      <div className="home__links">
        <div className="home__links__groups">
          <img src="https://img.freepik.com/free-vector/portrait-young-employee-team_74855-7822.jpg?w=1480&t=st=1691223528~exp=1691224128~hmac=5bfe933f959f8b7794dc1f54ff1d41761c818a2688f9e594132981a74066a25d"/>
          <NavLink exact to="/groups">See all groups</NavLink>
          <div>See who’s hosting local events<br></br>for all the things you love.</div>
        </div>
        <div className="home__links__events">
          <img src="https://img.freepik.com/free-vector/mass-event-flat-set-people-involved-conference-dance-party-carnival-politic-protest-isolated-vector-illustration_1284-73804.jpg?w=1800&t=st=1691222622~exp=1691223222~hmac=512800e41c485acbf865fbde2a62db3fcca1a0b9ff363877be0e0f9fd1afa7f4"/>
          <NavLink exact to="/events">See all events</NavLink>
          <div>See a list of all events and<br></br>meet people who share your passion.</div>
        </div>
        <div className="home__links__join">
          <img src="https://img.freepik.com/free-vector/smiling-person-crowd_23-2148422588.jpg?w=1480&t=st=1691223498~exp=1691224098~hmac=4cd35d93422871d65bd1f661808c5986d2a6e296568c9dba1e9819fec49266df"/>
          {sessionUser ?
            <NavLink exact to="/groups/new">Start a new group</NavLink>
            : <div className="home__links__join--nonlink" style={{fontSize:'12pt'}}>Start a new group</div>
          }
          <div>Create your own Meetup group, and<br></br>draw from a community of millions.</div>
        </div>
      </div>
      {!sessionUser &&
        <div className="home__signup">
        <OpenModalButton
          buttonText="Join Meetup"
          modalComponent={<SignupFormModal />}
        />
      </div>
      }
    </main>
  );
};

export default LandingPage;
