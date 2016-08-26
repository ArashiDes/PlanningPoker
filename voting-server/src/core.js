import {
    List,
    Map,
    OrderedMap
} from 'immutable';

export const INITIAL_STATE = Map();

export function setEntries(state, entries) {
    const list = List(entries);
    return state.set('entries', list)
        .set('initialEntries', list);
}

function getWinners(vote) {
    if (!vote) return [];
    const [zero, one, two, three, five, eight, thirteen] = vote.get('voteList');

    const zeroVotes = vote.getIn(['tally', zero], 0);
    const oneVotes = vote.getIn(['tally', one], 0);
    const twoVotes = vote.getIn(['tally', two], 0);
    const threeVotes = vote.getIn(['tally', three], 0);
    const fiveVotes = vote.getIn(['tally', five], 0);
    const eightVotes = vote.getIn(['tally', eight], 0);
    const thirteenVotes = vote.getIn(['tally', thirteen], 0);

    var voteList = [{
        id: zero,
        value: zeroVotes
    }, {
        id: one,
        value: oneVotes
    }, {
        id: two,
        value: twoVotes
    }, {
        id: three,
        value: threeVotes
    }, {
        id: five,
        value: fiveVotes
    }, {
        id: eight,
        value: eightVotes
    }, {
        id: thirteen,
        value: thirteenVotes
    }];

    var orderedMap = getOm(voteList);

    var filteredVotes = orderedMap.filter(x => x.value > 0).sortBy(x => x.value);

    if (filteredVotes.size == 1) return [filteredVotes.first().id];
    if (filteredVotes.size == 2) {
        if (filteredVotes.first().value > filteredVotes.last().value) return [filteredVotes.first().id];
        else if (filteredVotes.first().value < filteredVotes.last().value) return [filteredVotes.last().id];
        else return [filteredVotes.first().id, filteredVotes.last().id];

    }
    return filteredVotes;
}

function getOm(arr) {
    return OrderedMap().withMutations(map => {
        arr.forEach(item => map.set(item.id, item))
    })
}

export function next(state, round = state.getIn(['vote', 'round'], 0)) {
    const entries = state.get('entries').concat(getWinners(state.get('vote')));
    if (entries.size === 1) {
        return state.remove('vote')
            .remove('entries')
            .set('reveal', 1)
            .set('winner', entries.first());
    } else {
        return state.merge({
            vote: Map({
                round: round + 1,
                voteList: entries.take(entries.size)
            }),
            entries: entries.skip(entries.size)
        });
    }
}

export function restart(state) {
    const round = state.getIn(['vote', 'round'], 0);
    return next(
        state.set('entries', state.get('initialEntries'))
        .set('reveal', 0)
        .remove('vote')
        .remove('winner'),
        round
    );
}




function removePreviousVote(voteState, voter) {
    const previousVote = voteState.getIn(['votes', voter]);
    if (previousVote) {
        return voteState.updateIn(['tally', previousVote], t => t - 1)
            .removeIn(['votes', voter]);
    } else {
        return voteState;
    }
}

function addVote(voteState, entry, voter) {
    if (voteState.get('voteList').includes(entry)) {
        return voteState.updateIn(['tally', entry], 0, t => t + 1)
            .setIn(['votes', voter], entry);
    } else {
        return voteState;
    }
}

export function vote(voteState, entry, voter) {
    return addVote(
        removePreviousVote(voteState, voter),
        entry,
        voter
    );
}
