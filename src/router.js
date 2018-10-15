import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from "./pages/Login";
import App from "./pages/App";

export default class Routers extends Component {
	render(){
		return(
			<Router>
				<div className="root">
					<Switch>	
						<Route path="/login" component={Login} />					
						<Route component={App} />
					</Switch>
				</div>
			</Router>
		);
	}
} 