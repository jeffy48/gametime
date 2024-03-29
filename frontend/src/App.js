import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Switch } from "react-router-dom";
import * as sessionActions from "./store/session";
import Navigation from "./components/Navigation";
import LandingPage from "./components/LandingPage";
import GroupPage from "./components/Group/GroupPage.js";
import GroupDetailPage from "./components/Group/GroupDetailPage";
import EventPage from "./components/Event/EventPage";
import EventDetailPage from "./components/Event/EventDetailPage";
import CreateGroupPage from "./components/Group/CreateGroupPage";
import CreateEventPage from "./components/Event/CreateEvent";
import UpdateGroupPage from "./components/Group/UpdateGroupPage";
import CreateVenuePage from "./components/Venue/CreateVenuePage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && (
        <Switch>
          <Route exact path="/groups/new">
            <CreateGroupPage />
          </Route>
          <Route exact path="/groups">
            <GroupPage />
          </Route>
          <Route exact path="/events">
            <EventPage />
          </Route>
          <Route exact path="/">
            <LandingPage />
          </Route>
          <Route path="/venues/groups/:groupId">
            <CreateVenuePage />
          </Route>
          <Route path="/groups/:groupId/events/new">
            <CreateEventPage />
          </Route>
          <Route path="/groups/:groupId/edit">
            <UpdateGroupPage />
          </Route>
          <Route path="/groups/:groupId">
            <GroupDetailPage />
          </Route>
          <Route path="/events/:eventId">
            <EventDetailPage />
          </Route>
        </Switch>
      )}
    </>
  );
}

export default App;
