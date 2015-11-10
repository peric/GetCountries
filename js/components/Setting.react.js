var React = require('react');

var Setting = React.createClass({
    handleChange: function(event) {
        var objectKey = this.props.objectKey,
            type = event.target.dataset.type,
            settings = this.props.settings;

        this.props.onChange(objectKey, type, settings);
    },
    render: function() {
        return (
            <div className="checkbox">
                <label>
                    <input
                    type="checkbox"
                    className="setting"
                    name="setting"
                    data-type="settings"
                    checked={this.props.checked}
                    onChange={this.handleChange}
                    disabled={this.props.disabled} />
                            {this.props.longName}
                </label>
            </div>
        );
    }
});

module.exports = Setting;
