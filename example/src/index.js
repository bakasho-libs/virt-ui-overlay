var virt = require("virt"),
    virtDOM = require("virt-dom"),
    propTypes = require("prop_types"),
    Overlay = require("../..");


var AppPrototype;


function App(props, children, context) {
    var _this = this;

    virt.Component.call(this, props, children, context);

    this.state = {
        size: {
            width: 0,
            height: 0
        }
    };

    this.onResize = function(data, next) {
        return _this.__onResize(data, next);
    };
}
virt.Component.extend(App, "App");
AppPrototype = App.prototype;

App.childContextTypes = {
    muiTheme: propTypes.object.isRequired,
    size: propTypes.object.isRequired
};

AppPrototype.__onResize = function(data, next) {
    this.setState({
        size: data
    }, next);
};

AppPrototype.componentDidMount = function() {
    var _this = this;

    this.onMessage("virt.resize", this.onResize);

    this.emitMessage("virt.getDeviceDimensions", null, function(error, data) {
        if (!error) {
            _this.setState({
                size: data
            });
        }
    });
};

AppPrototype.componentWillUnmount = function() {
    RouteStore.removeChangeListener(this.onChange);
    this.offMessage("virt.resize", this.onResize);
};

AppPrototype.getChildContext = function() {
    return {
        size: this.state.size,
        muiTheme: {
            palette: {
                backgroundColor: "#000"
            }
        }
    };
};

AppPrototype.render = function() {
    var size = this.state.size;

    return (
        virt.createView("App",
            virt.createView(Overlay, {
                show: true
            })
        )
    );
};

virtDOM.render(virt.createView(App), document.getElementById("app"));
