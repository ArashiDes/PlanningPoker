import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';
import {connect} from 'react-redux';
import Winner from './Winner';
import * as actionCreators from '../action_creators';

export const VOTE_WIDTH_PERCENT = 8;

export const Results = React.createClass({
    mixins: [PureRenderMixin],
    hasWinner: function(winner) {
        return winner != null;
    },
    getVoteList: function() {
        return this.props.voteList || [];
    },
    getVotes: function(entry) {
        if (this.props.reveal == null || this.props.reveal == 0)
            return 0;
        if (this.props.tally && this.props.tally.has(entry.toString())) {
            return this.props.tally.get(entry.toString());
        }
        return 0;
    },
    getVotesBlockWidth: function(entry) {
        if (this.props.reveal == null || this.props.reveal == 0)
            return "0%";
        return (this.getVotes(entry) * VOTE_WIDTH_PERCENT) + '%';
    },
    render: function() {
        return <div className="results">
            <div className="tally">
                {this.getVoteList().map(entry => <div key={entry} className="entry">
                    <h1>{entry}</h1>
                    <div className="voteVisualization">
                        <div className="votesBlock" style={{
                            width: this.getVotesBlockWidth(entry)
                        }}></div>
                    </div>
                    <div className="voteCount">
                        {this.getVotes(entry)}
                    </div>
                </div>)}
            </div>
            <div className="management">
                {this.props.winner && this.props.reveal
                    ? <button ref="restart" onClick={this.props.restart}>
                            Restart
                        </button>
                    : <button ref="next" className="next" onClick={this.props.next}>
                        Next
                    </button>
}
            </div>
        </div>
    }
});

function mapStateToProps(state) {
    return {
        voteList: state.getIn(['vote', 'voteList']),
        tally: state.getIn(['vote', 'tally']),
        winner: state.get('winner'),
        reveal: state.get('reveal')
    }
}

export const ResultsContainer = connect(mapStateToProps, actionCreators)(Results);
