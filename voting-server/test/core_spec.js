import {
    List,
    Map
} from 'immutable';
import {
    expect
} from 'chai';

import {
    setEntries,
    next,
    vote,
    restart
} from '../src/core';

describe('application logic :', () => {

    describe('setEntries -', () => {

        it('adds the entries to the state', () => {
            const state = Map();
            const entries = List.of('0', '1', '2', '3', '5', '8', '13');
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('0', '1', '2', '3', '5', '8', '13'),
                initialEntries: List.of('0', '1', '2', '3', '5', '8', '13')
            }));
        });

        it('converts to immutable', () => {
            const state = Map();
            const entries = ['0', '1', '2', '3', '5', '8', '13'];
            const nextState = setEntries(state, entries);
            expect(nextState).to.equal(Map({
                entries: List.of('0', '1', '2', '3', '5', '8', '13'),
                initialEntries: List.of('0', '1', '2', '3', '5', '8', '13')
            }));
        });

    });

    describe('next -', () => {

        it('takes all entries under vote', () => {
            const state = Map({
                entries: List.of('0', '1', '2', '3', '5', '8', '13')
            });
            const nextState = next(state);
            expect(nextState).to.equal(Map({
                vote: Map({
                    round: 1,
                    voteList: List.of('0', '1', '2', '3', '5', '8', '13')
                }),
                entries: List.of()
            }));
        });

        it('returns Winner', () => {
            expect(
                next(Map({
                    vote: Map({
                        round: 1,
                        voteList: List.of('0', '1', '2', '3', '5', '8', '13'),
                        tally: Map({
                            '1': 4,
                            '2': 2
                        })
                    }),
                    entries: List()
                }))
            ).to.equal(
                Map({
                    winner: '1'
                })
            );
        });

        it('puts both from tied vote back to entries', () => {
            expect(
                next(Map({
                    vote: Map({
                        round: 1,
                        voteList: List.of('0', '1', '2', '3', '5', '8', '13'),
                        tally: Map({
                            '1': 3,
                            '2': 3
                        })
                    }),
                    entries: List()
                }))
            ).to.equal(
                Map({
                    vote: Map({
                        round: 2,
                        voteList: List.of('1', '2')
                    }),
                    entries: List()
                })
            );
        });

        it('marks winner when just one entry left', () => {
            expect(
                next(Map({
                    vote: Map({
                        round: 1,
                        voteList: List.of('0', '1', '2', '3', '5', '8', '13'),
                        tally: Map({
                            '1': 4,
                            '2': 2
                        })
                    }),
                    entries: List()
                }))
            ).to.equal(
                Map({
                    winner: '1'
                })
            );
        });

    });

    describe('restart -', () => {

        it('returns to initial entries and takes the first two entries under vote', () => {
            expect(
                restart(Map({
                    vote: Map({
                        round: 1,
                        voteList: List.of('0', '1', '2', '3', '5', '8', '13')
                    }),
                    entries: List(),
                    initialEntries: List.of('0', '1', '2', '3', '5', '8', '13')
                }))
            ).to.equal(
                Map({
                    vote: Map({
                        round: 2,
                        voteList: List.of('0', '1', '2', '3', '5', '8', '13')
                    }),
                    entries: List(),
                    initialEntries: List.of('0', '1', '2', '3', '5', '8', '13')
                })
            );
        });

        it('clears winner after restart', () => {
            expect(
                restart(Map({
                    vote: Map({
                        round: 1,
                        voteList: List.of('0', '1', '2', '3', '5', '8', '13'),
                        tally: Map({
                            '1': 4,
                            '2': 2
                        })
                    }),
                    entries: List()
                }))
            ).to.equal(
                Map({
                    vote: Map({
                        round: 2,
                        voteList: List.of('0', '1', '2', '3', '5', '8', '13'),

                    }),
                    entries: List(),
                    initialEntries: List.of('0', '1', '2', '3', '5', '8', '13')

                }));
        });

    });

    describe('vote -', () => {

        it('creates a tally for the voted entry', () => {
            expect(
                vote(Map({
                    round: 1,
                    voteList: List.of('0', '1', '2', '3', '5', '8', '13')
                }), '1', 'voter1')
            ).to.equal(
                Map({
                    round: 1,
                    voteList: List.of('0', '1', '2', '3', '5', '8', '13'),
                    tally: Map({
                        '1': 1
                    }),
                    votes: Map({
                        voter1: '1'
                    })
                })
            );
        });

        it('adds to existing tally for the voted entry', () => {
            expect(
                vote(Map({
                    round: 1,
                    voteList: List.of('0', '1', '2', '3', '5', '8', '13'),
                    tally: Map({
                        '1': 3,
                        '2': 2
                    }),
                    votes: Map()
                }), '1', 'voter1')
            ).to.equal(
                Map({
                    round: 1,
                    voteList: List.of('0', '1', '2', '3', '5', '8', '13'),
                    tally: Map({
                        '1': 4,
                        '2': 2
                    }),
                    votes: Map({
                        voter1: '1'
                    })
                })
            );
        });

        it('nullifies previous vote for the same voter', () => {
            expect(
                vote(Map({
                    round: 1,
                    voteList: List.of('0', '1', '2', '3', '5', '8', '13'),
                    tally: Map({
                        '1': 3,
                        '2': 2
                    }),
                    votes: Map({
                        voter1: '2'
                    })
                }), '1', 'voter1')
            ).to.equal(
                Map({
                    round: 1,
                    voteList: List.of('0', '1', '2', '3', '5', '8', '13'),
                    tally: Map({
                        '1': 4,
                        '2': 1
                    }),
                    votes: Map({
                        voter1: '1'
                    })
                })
            );
        });

        it('ignores the vote if for an invalid entry', () => {
            expect(
                vote(Map({
                    round: 1,
                    voteList: List.of('0', '1', '2', '3', '5', '8', '13')
                }), 'Sunshine')
            ).to.equal(
                Map({
                    round: 1,
                    voteList: List.of('0', '1', '2', '3', '5', '8', '13')
                })
            );
        });

    });

});
