var virt = require("virt"),
    css = require("css"),
    extend = require("extend"),
    propTypes = require("prop_types");


var OverlayPrototype;


module.exports = Overlay;


function Overlay(props, children, context) {

    virt.Component.call(this, props, children, context);

    this.__originalBodyOverflow = "";
}
virt.Component.extend(Overlay, "virt-ui-Overlay");

Overlay.propTypes = {
    autoLockScrolling: propTypes.bool,
    show: propTypes.bool.isRequired,
    style: propTypes.object,
    opacity: propTypes.number,
    transitionEnabled: propTypes.bool
};

Overlay.defaultProps = {
    autoLockScrolling: true,
    transitionEnabled: true,
    opacity: 0.38,
    style: {}
};

OverlayPrototype = Overlay.prototype;

OverlayPrototype.componentDidMount = function() {
    if (this.props.show) {
        this.__applyAutoLockScrolling(this.props);
    }
};

OverlayPrototype.componentWillUnmount = function() {
    if (this.props.show === true) {
        this.__allowScrolling();
    }
};

OverlayPrototype.componentWillReceiveProps = function(nextProps) {
    if (this.props.show !== nextProps.show) {
        this.__applyAutoLockScrolling(nextProps);
    }
};

OverlayPrototype.__applyAutoLockScrolling = function(props) {
    if (props.autoLockScrolling) {
        if (props.show) {
            this.__preventScrolling();
        } else {
            this.__allowScrolling();
        }
    }
};

OverlayPrototype.__preventScrolling = function() {
    var body = document.getElementsByTagName("body")[0];
    this.__originalBodyOverflow = body.style.overflow;
    body.style.overflow = "hidden";
};

OverlayPrototype.__allowScrolling = function() {
    var body = document.getElementsByTagName("body")[0];
    body.style.overflow = this.__originalBodyOverflow || "";
};

OverlayPrototype.getStyles = function() {
    var props = this.props,
        styles = {
            root: {
                position: 'fixed',
                height: '100%',
                width: '100%',
                top: 0,
                left: '-100%',
                backgroundColor: props.color || "#000",
                WebkitTapHighlightColor: 'rgba(0, 0, 0, 0)',
                willChange: 'opacity'
            }
        };

    css.opacity(styles.root, 0);
    css.transform(styles.root, "translateZ(0)");

    if (props.transitionEnabled) {
        css.transition(styles.root,
            "left 0ms cubic-bezier(0.23, 1, 0.32, 1) 400ms",
            "opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"
        );
    }

    if (props.show) {
        css.opacity(styles.root, props.opacity);
        styles.root.left = "0px";
        css.transition(styles.root,
            "left 0ms cubic-bezier(0.23, 1, 0.32, 1) 0ms",
            "opacity 400ms cubic-bezier(0.23, 1, 0.32, 1) 0ms"
        );
    }

    return styles;
};

OverlayPrototype.render = function() {
    var props = this.props,
        styles = this.getStyles();

    return (
        virt.createView("div", extend(props, {
            className: "virt-ui-Overlay" + (props.className ? " " + props.className : ""),
            ref: "overlay",
            show: props.show,
            style: extend(styles.root, props.style)
        }))
    );
};
