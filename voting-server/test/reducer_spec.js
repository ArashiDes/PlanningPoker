import {Map, fromJS} from 'immutable';
import {expect} from 'chai';

import reducer from '../src/reducer';

describe('reducer', () => {

  it('handles SET_ENTRIES', () => {
    const initialState = Map();
    const action = {type: 'SET_ENTRIES', entries: ['0','1','2','3','5','8','13']};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      entries: ['0','1','2','3','5','8','13'],
      initialEntries: ['0','1','2','3','5','8','13']
    }));
  });

  it('handles NEXT', () => {
    const initialState = fromJS({
      entries: ['0','1','2','3','5','8','13']
    });
    const action = {type: 'NEXT'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        round: 1,
        voteList: ['0','1','2','3','5','8','13']
      },
      entries: []
    }));
  });

  it('handles VOTE', () => {
    const initialState = fromJS({
      vote: {
        round: 1,
        voteList: ['0','1','2','3','5','8','13']
      },
      entries: []
    });
    const action = {type: 'VOTE', entry: '1', clientId: 'voter1'};
    const nextState = reducer(initialState, action);

    expect(nextState).to.equal(fromJS({
      vote: {
        round: 1,
        voteList: ['0','1','2','3','5','8','13'],
        tally: {'1': 1},
        votes: {
          voter1: '1'
        }
      },
      entries: []
    }));
  });

  it('has an initial state', () => {
    const action = {type: 'SET_ENTRIES', entries: ['0','1','2','3','5','8','13']};
    const nextState = reducer(undefined, action);
    expect(nextState).to.equal(fromJS({
      entries: ['0','1','2','3','5','8','13'],
      initialEntries: ['0','1','2','3','5','8','13']
    }));
  });

  it('can be used with reduce', () => {
    const actions = [
      {type: 'SET_ENTRIES', entries: ['0','1','2','3','5','8','13']},
      {type: 'NEXT'},
      {type: 'VOTE', entry: '1', clientId: 'voter1'},
      {type: 'VOTE', entry: '2', clientId: 'voter2'},
      {type: 'VOTE', entry: '2', clientId: 'voter3'},
      {type: 'NEXT'}
    ];
    const finalState = actions.reduce(reducer, Map());

    expect(finalState).to.equal(fromJS({
      winner: '2',
      initialEntries: ['0','1','2','3','5','8','13']
    }));
  });

});
