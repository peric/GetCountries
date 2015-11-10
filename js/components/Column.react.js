var React = require('react');

var Column = React.createClass({
    handleChange: function(event) {
        var objectKey = this.props.objectKey,
            type = event.target.dataset.type,
            columns = this.props.columns;

        this.props.onChange(objectKey, type, columns);
    },
    render: function() {
        return (
            <div className="checkbox">
                <label>
                    <input type="checkbox"
                      className="column"
                      name="column"
                      data-type="columns"
                      checked={this.props.checked}
                      onChange={this.handleChange} />
                      {this.props.name}
                </label>
            </div>
        );
    }
});

module.exports = Column;
