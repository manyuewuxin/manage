import React, { Component } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import Breadcrumbs from "./Breadcrumbs";
import { message } from "antd";

export default class Article extends Component {
    static propTypes = {
        match: PropTypes.object,
        location: PropTypes.object
    };
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            article: null
        };
    }
    render() {
        if (this.state.loading) return null;
        const { article } = this.state;
        const author = article.author ? article.author[0] : {};
        const str = `/p/${article._id}`;
        return (
            <div className="content">
                <Breadcrumbs to={[{ "/": "首页" }, { [str]: article.title }]} />
                <div className="article">
                    <div className="articles_image">
                        <img src={article.image} />
                    </div>
                    <h1 className="articles_title">
                        <Link to={`/admin/p/${article._id}`}>{article.title}</Link>
                    </h1>
                    <div className="articles_author">
                        <div>
                            <img src={author.avatar} />
                        </div>
                        <div>
                            <p>{author.name}</p>
                            <p>{author.information}</p>
                        </div>
                    </div>
                    <div
                        className="article_html"
                        dangerouslySetInnerHTML={{ __html: article.html }}
                    />
                </div>
            </div>
        );
    }
    componentDidMount() {
        axios
            .get(`/admin/p/${this.props.match.params.id}${this.props.location.search}`)
            .then(({ data }) => {
                this.setState({ article: data.article[0], loading: false });
            })
            .catch(({ response }) => {
                message.error(response.data.err);
            });
    }
}
