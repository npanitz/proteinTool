import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Switch,
    Link,
    Redirect
} from "react-router-dom";
import FrontPage from './FrontPage';
import Protein from './Protein';
import PageNotFound from './404';


class ProteinApp extends React.Component {
    render() {
        return (
            <Router>
                <Switch>
                    <Route exact path="/" component={FrontPage} />
                    <Route path="/protein/:id" component={Protein} />
                    <Route path="/404" component={PageNotFound} />
                    <Redirect to="/404" />
                </Switch>
            </Router>
        )
    }
}

window.onload = () => {
    const domElement = document.getElementById("root");
    ReactDOM.render(<ProteinApp />, domElement)
}


export default ProteinApp;