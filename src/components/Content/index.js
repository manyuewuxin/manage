import React, { Component } from "react";
import { Route, Switch } from "react-router-dom";

import Chart from "./Chart";
import Table from "./Table";
import Article from "./Article";
import Label from "./Label/index";
import Create from "./Label/Create";

export default class Index extends Component{
    render(){
    	return(
            <Switch>
                <Route exact path="/" component={Chart}/> 
                <Route path="/label/create" component={Create}/>
                <Route path="/label" component={Label}/>
                <Route path="/p/:id" component={Article}/>
                <Route path="/table/:type" component={Table}/>
                <Route render={()=><div>{`找不到${window.location.href}资源或该功能待实现`}</div>}/>
            </Switch>
        );
    }
}