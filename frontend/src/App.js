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
          <Route path="/groups/:groupId">
            <GroupDetailPage />
          </Route>
          <Route path="/events/:eventId">
            <EventDetailPage />
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
        </Switch>
      )}
    </>
  );
}

export default App;
