import './LandingPage.css'

function LandingPage() {
  return (
    <div className="container">
      <div className="about">
        <h1>
          The people platform -<br></br>Where interest <br></br>become friendships
        </h1>
        <p>
          Use Meetup to meet new people, learn new things,<br></br>find support, get out of your comfort zones,<br></br>and pursue your passions, together.
        </p>
        <img src="https://img.freepik.com/free-vector/people-waving-hand-illustration-concept_52683-29825.jpg?w=1480&t=st=1690859367~exp=1690859967~hmac=77c8fe80de7a008ba1217402449dffa0bafcf1510ca64a4114fa262a2a7a839e"/>
      </div>
      <div className="info">
        <h1>How Meetup works</h1>
        <div>See who's hosting local events for all the things you love<br></br>or<br></br>Create your own Meetup group, and draw from a community of millions</div>
      </div>
      <div className="links">
        Links go here!
      </div>
      <div className="join">
        <button type="button">Join Meetup</button>
      </div>
    </div>
  );
};

export default LandingPage;
