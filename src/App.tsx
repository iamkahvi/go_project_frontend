import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import Layout from "./components/Layout/Layout";

import "./styles/App.scss";

const App = () => (
  <Switch>
    <Layout>
      <Route exact={true} path="/" component={Home} />
    </Layout>
  </Switch>
);

export default App;
