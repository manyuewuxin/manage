import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Breadcrumb } from "antd";
import PropTypes from "prop-types";
import Avatar from "./Avatar";

export default class Bread extends Component {
    static propTypes = {
        to: PropTypes.array
    };
    render() {
        const list = this.props.to.map((obj) => {
            var keys = Object.keys(obj);
            return (
                <Breadcrumb.Item key={keys[0]}>
                    <Link to={keys[0]}>{obj[keys[0]]}</Link>
                </Breadcrumb.Item>
            );
        });
        return (
            <div className="breadcrumb">
                <Breadcrumb style={{ width: "100%", height: "100%", lineHeight: "60px" }}>
                    {list}
                </Breadcrumb>
                <Avatar />
            </div>
        );
    }
}
