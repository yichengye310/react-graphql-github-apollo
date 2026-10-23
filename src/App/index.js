import React, {Component} from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';

import Navigation from './Navigation';
import Footer from './Footer';
import Profile from '../Profile';
import Organization from '../Organization';

import * as routes from '../constants/routes';

import './style.css';
import TimeLineProfile from '../TimeLineProfile';

class App extends Component {
    state = {
        organizationName: 'the-road-to-learn-react',
    };

    onOrganizationSearch = value => {
        this.setState({organizationName: value});
    };

    render() {
        const {organizationName} = this.state;

        return (
            <Router>
                <div className="App">
                    <Navigation
                        organizationName={organizationName}
                        onOrganizationSearch={this.onOrganizationSearch}
                    />

                    <div className="App-main">
                        <Routes>
                            <Route
                                exact
                                path={routes.TIMELINE}
                                element={
                                    <div className="App-content_small-header">
                                        <TimeLineProfile/>
                                    </div>
                                }
                            />
                            <Route
                                exact
                                path={routes.ORGANIZATION}
                                element={
                                    <div className="App-content_large-header">
                                        <Organization organizationName={organizationName}/>
                                    </div>
                                }
                            />
                            <Route
                                exact
                                path={routes.PROFILE}
                                element={
                                    <div className="App-content_small-header">
                                        <Profile/>
                                    </div>
                                }
                            />
                        </Routes>
                    </div>
                    <Footer/>
                </div>
            </Router>
        );
    }
}

export default App;
