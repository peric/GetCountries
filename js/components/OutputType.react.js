var React = require('react');

var OutputType = React.createClass({
    handleChange: function(event) {
        var objectKey = this.props.objectKey,
            type = event.target.dataset.type,
            outputTypes = this.props.outputTypes;

        this.props.onChange(objectKey, type, outputTypes);
    },
    render: function() {
        return (
            <div className="radio">
                <label>
                    <input
                    type="radio"
                    className="outputType"
                    name="outputType"
                    data-type="outputTypes"
                    checked={this.props.checked}
                    onChange={this.handleChange} />
                            {this.props.name}
                </label>
            </div>
            );
    }
});

module.exports = OutputType;