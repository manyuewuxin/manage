import React, { Component } from "react";
import { Menu, Icon } from "antd";
//import { Link } from 'react-router-dom';
import PropTypes from "prop-types";

const SubMenu = Menu.SubMenu;

export default class Index extends Component{
    static propTypes = {
        history: PropTypes.object,
        location: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.link = this.link.bind(this);
    }
    link({ item, key, keyPath }){
        this.props.history.push(key);
    }
    render(){
        //注意：f5或重新加载时是跳到生产模式的打包文件去了，是没有定义的，不要有以为是BUG
    	return(
            <div className="sider">
                <Menu
                    defaultSelectedKeys={[this.props.location.pathname]}
                    selectedKeys={[this.props.location.pathname]}
                    mode="inline"
                    theme="dark"
                    style={{ height: "100%", padding: "10px 0"}}
                    inlineIndent={18}
                    onClick={this.link}
                >
                    <Menu.Item key="/">
                        <Icon type="home" />
                        <span>首页</span>
                    </Menu.Item>
                    <SubMenu key="sub1" title={<span><Icon type="file" /><span>数据管理</span></span>}>
                        <Menu.Item key="/table/user">用户列表</Menu.Item>
                        <Menu.Item key="/table/posts">文章列表</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="tag" /><span>标签管理</span></span>}>
                        <Menu.Item key="/label">所有标签</Menu.Item>
                        <Menu.Item key="/label/create">创建标签</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub3" title={<span><Icon type="star" /><span>图表</span></span>}>
                        <Menu.Item key="/chart">图表</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub5" title={<span><Icon type= "edit" /><span>编辑</span></span>}>
                        <Menu.Item key="/editor">编辑</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub6" title={<span><Icon type="user" /><span>设置</span></span>}>
                        <Menu.Item key="/setter">设置</Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub7" title={<span><Icon type= "exclamation-circle" /><span>说明</span></span>}>
                        <Menu.Item key="/description">说明</Menu.Item>
                    </SubMenu>
                </Menu>
            </div>
    	  );
    }
}
/*
                <Menu mode="inline" style={{ width:"100%", height: '100%', borderRight: 0, backgroundColor: "rgb(50, 64, 87)", color: "#bfcbd9"}}>
                    <Menu.Item key="1">
                        <Link to="/">首页</Link>
                    </Menu.Item>                    
                    <SubMenu key="sub1" title={<span><Icon type="data" /><span>数据管理</span></span>}>
                        <Menu.Item key="2">
                            <Link to="/table/user">用户中心</Link>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Link to="/table/posts">文章列表</Link>
                        </Menu.Item>
                    </SubMenu>
                    <SubMenu key="sub2" title={<span><Icon type="label" /><span>标签管理</span></span>}>
                        <Menu.Item key="4">
                            <Link to="/label/all">所有标签</Link>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Link to="/label/create">创建标签</Link>
                        </Menu.Item>
                    </SubMenu>
                </Menu>             

*/