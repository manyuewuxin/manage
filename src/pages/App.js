import React, { Component } from "react";
import { hot } from "react-hot-loader";
import { message } from "antd";
import axios from "axios";
import { Redirect } from "react-router-dom";
import PropTypes from "prop-types";

import Sider from "../components/Sider";
import Content from "../components/Content";

import { Context } from "../store/index";

class App extends Component {
    static propTypes = {
        history: PropTypes.object,
        location: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.state = {
            user: "",
            loading: true
        };
        this.signout = this.signout.bind(this);
    }
    signout() {
        if (this.state.user !== null) {
            axios
                .post("/admin/user/signout")
                .then(() => {
                    this.setState({ user: null });
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }
    render() {
        if (this.state.loading) {
            return null;
        }
        if (this.state.user === null) {
            return <Redirect to="/login" />;
        } else {
            return (
                <div className="manage">
                    <Context.Provider
                        value={{ user: this.state.user, signout: this.signout }}>
                        <Sider
                            history={this.props.history}
                            location={this.props.location}
                        />
                        <Content />
                    </Context.Provider>
                </div>
            );
        }
    }
    componentDidMount() {
        axios
            .get("/admin")
            .then(({ data }) => {
                this.setState({ user: data.user, loading: false });
            })
            .catch(({ response }) => {
                message.error(response.data.err);
            });
    }
}
export default hot(module)(App);
