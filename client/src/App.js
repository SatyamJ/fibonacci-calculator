import React from 'react';
import {BrowserRouter, Route, Link, Switch} from 'react-router-dom'

import './App.css';
import Fib from './containers/Fib/Fib'
import OtherPage from './components/OtherPage/OtherPage'

function App() {
    return (
        <BrowserRouter>
            <div className="App">
                <header>
                    <h2>version 2</h2>
                    <ul>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/other-page">Other Page</Link>
                        </li>
                    </ul>
                </header>

                <Switch>
                    <Route exact path="/other-page" component={OtherPage}/>
                    <Route exact path="/" component={Fib}/>
                </Switch>
            </div>
        </BrowserRouter>

    );
}

export default App;
