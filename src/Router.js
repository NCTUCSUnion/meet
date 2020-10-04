import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Navbar from './Component/Navbar'
import Group from './Page/Group';
import Home from './Page/Home';
import Main from './Page/Main';
import PollManage from './Page/PollManage';

const Router = () => (
    <React.Suspense fallback={null}>
        <BrowserRouter>
            <Navbar />
            <Switch>
                <Route exact path='/' component={Home} />
                <Route exact path='/main' component={Main} />
                <Route exact path='/group' component={Group} />
                <Route exact path='/poll' component={PollManage} />
            </Switch>
        </BrowserRouter>
    </React.Suspense>
);

export default Router;
