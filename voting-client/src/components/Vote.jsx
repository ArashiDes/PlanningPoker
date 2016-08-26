import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import classNames from 'classnames'

export default React.createClass({
  mixins: [PureRenderMixin],
  getVoteList: function() {
    return this.props.voteList || [];
  },
  isDisabled: function() {
    return !!this.props.hasVoted;
  },
  hasVotedFor: function(entry) {
    return this.props.hasVoted === entry;
  },
  render: function() {
    return <div className="voting">
      {this.getVoteList().map(entry =>
        <button key={entry}
                className={classNames({voted: this.hasVotedFor(entry)})}
                disabled={this.isDisabled()}
                onClick={() => this.props.vote(entry)}>
          <h1>{entry}</h1>
          {this.hasVotedFor(entry) ?
            <div className="label">Voted</div> :
            null}
        </button>
      )}
    </div>;
  }
});
