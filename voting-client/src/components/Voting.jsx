import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import Winner from './Winner';
import Vote from './Vote';
import * as actionCreators from '../action_creators';

export const Voting = React.createClass({
  mixins: [PureRenderMixin],
  hasWinner: function(winner) {
    return winner != null;
  },
  render: function() {
    return <div>
      {this.hasWinner(this.props.winner) ?
        <Winner ref="winner" winner={this.props.winner} /> :
        <Vote {...this.props} />}
    </div>;
  }
});

function mapStateToProps(state) {
  return {
    voteList: state.getIn(['vote', 'voteList']),
    hasVoted: state.getIn(['myVote', 'entry']),
    winner: state.get('winner')
  };
}

export const VotingContainer = connect(
  mapStateToProps,
  actionCreators
)(Voting);
