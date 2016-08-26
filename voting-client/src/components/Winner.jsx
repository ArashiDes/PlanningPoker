import React from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

export default React.createClass({
    mixins: [PureRenderMixin],
    refresh: function() {
        window.location.reload();
    },
    render: function() {
        return <div className="winner" onClick={() => this.refresh()}>
            Estimate is {this.props.winner}!
        </div>;
    }
});
