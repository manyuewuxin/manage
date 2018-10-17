import React, { Component } from "react";
import PropTypes from "prop-types";
import Form from "./Form";

export default class Index extends Component {
    static propTypes = {
        history: PropTypes.object
    };
    render() {
        return (
            <div className="login">
                <div className="login_title">mengya后台管理系统</div>
                <div className="login_width">
                    <Form history={this.props.history} />
                </div>
            </div>
        );
    }
}
