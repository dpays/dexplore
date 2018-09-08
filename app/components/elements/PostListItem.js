// @flow
import React, { Component } from 'react';
import { FormattedRelative } from 'react-intl';

import UserAvatar from './UserAvatar';

import catchPostImage from '../../utils/catch-post-image';
import authorReputation from '../../utils/author-reputation';
import parseDate from '../../utils/parse-date';
import postSummary from '../../utils/post-summary';
import sumTotal from '../../utils/sum-total';
import appName from '../../utils/app-name';

type Props = {
  post: {}
};

export default class PostListItem extends Component<Props> {
  props: Props;

  render() {
    const { post } = this.props;
    const img = catchPostImage(post);
    const reputation = authorReputation(post.author_reputation);
    const created = parseDate(post.created);
    const summary = postSummary(post.body, 200);
    const postTotal = sumTotal(post).toFixed(2);
    const voteCount = post.active_votes.length;
    const contentCount = post.children;

    let jsonMeta;
    try {
      jsonMeta = JSON.parse(post.json_metadata);
    } catch (e) {
      jsonMeta = {};
    }

    const app = appName(jsonMeta.app);

    return (
      <div className="post-list-item">
        <div className="item-header">
          <div className="author-avatar">
            <UserAvatar user={post.author} size="small" />
          </div>
          <span className="author">
            {post.author}{' '}
            <span className="author-reputation">{reputation}</span>
          </span>
          <span className="category">{post.parent_permlink}</span>
          <span className="date">
            <FormattedRelative value={created} />
          </span>
        </div>
        <div className="item-body">
          <div className="item-image">
            <img src={img} alt="" />
          </div>
          <div className="item-summary">
            <div className="item-title">{post.title}</div>
            <div className="item-body">{summary}</div>
          </div>
          <div className="item-controls">
            <div className="voting">
              <a className="btn-vote" role="button" tabIndex="-1">
                <i className="mi">keyboard_arrow_up</i>
              </a>
            </div>

            <a className="post-total">$ {postTotal}</a>
            <a className="voters">
              <i className="mi">people</i>
              {voteCount}
            </a>
            <a className="comments">
              <i className="mi">comment</i>
              {contentCount}
            </a>
            <div className="app">{app}</div>
          </div>
        </div>
      </div>
    );
  }
}