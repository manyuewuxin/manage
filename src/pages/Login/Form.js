import React, { Component } from "react";
import { Form, Icon, Input, Button } from "antd";
import axios from "axios";
import PropTypes from "prop-types";

class Login extends Component {
    static propTypes = {
        history: PropTypes.object,
        form: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.state = {
            u_error: null,
            p_error: null
        };
        this.submit = this.submit.bind(this);
    }
    submit(e) {
        e.stopPropagation();
        e.preventDefault();
        this.props.form.validateFields((err, data) => {
            if (!err) {
                axios
                    .post("/admin/user/signin", data)
                    .then(() => {
                        this.props.history.push("/");
                    })
                    .catch((error) => {
                        console.log(error.response.data.err);
                        this.setState({
                            p_error: error.response.data
                                ? error.response.data.err
                                : "登录异常"
                        });
                    });
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        const { u_error, p_error } = this.state;
        return (
            <Form onSubmit={this.submit} className="login-form">
                <Form.Item>
                    {getFieldDecorator("name", {
                        rules: [{ required: true, message: "请输入呢称" }]
                    })(
                        <Input
                            prefix={
                                <Icon type="user" style={{ color: "rgba(0,0,0,.25)" }} />
                            }
                            autoComplete="off"
                            placeholder="呢陈"
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    {getFieldDecorator("password", {
                        rules: [{ required: true, message: "请输入密码" }]
                    })(
                        <Input
                            prefix={
                                <Icon type="lock" style={{ color: "rgba(0,0,0,.25)" }} />
                            }
                            type="password"
                            placeholder="密码"
                        />
                    )}
                </Form.Item>
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        className="login-form-button">
                        登录
                    </Button>
                    <p className="login_warning">
                        注：未登录过的用户将自动注册
                    </p>
                </Form.Item>
            </Form>
        );
    }
}

const WrappedNormalLoginForm = Form.create()(Login);

export default WrappedNormalLoginForm;
