import React, { Component } from "react";
import { Menu, Dropdown, Icon } from "antd";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { store } from "@store/index";

@withRouter
@store
export default class Dropdowns extends Component {
    static propTypes = {
        history: PropTypes.object,
        store: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.setter = this.setter.bind(this);
        this.menu = (
            <Menu
                onClick={this.setter}
                style={{ width: "80px", textAlign: "center" }}
                mode="vertical">
                <Menu.Item key="a">
                    <Icon type="home" />
                    <span>首页</span>
                </Menu.Item>
                <Menu.Item key="b">
                    <Icon type="poweroff" />
                    <span>退出</span>
                </Menu.Item>
            </Menu>
        );
    }
    setter({ item, key, keyPath }) {
        if (key === "a") {
            this.props.history.replace("/");
        } else if (key === "b") {
            this.props.store.signout();
        }
    }
    render() {
        return (
            <div className="user">
                <Dropdown overlay={this.menu}>
                    <img src={this.props.store.user.avatar} className="user_avatar" />
                </Dropdown>
            </div>
        );
    }
}
