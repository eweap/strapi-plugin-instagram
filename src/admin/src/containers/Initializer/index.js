"use strict";
/**
 *
 * Initializer
 *
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const prop_types_1 = __importDefault(require("prop-types"));
const pluginId_1 = __importDefault(require("../../pluginId"));
class Initializer extends react_1.default.PureComponent {
    // eslint-disable-line react/prefer-stateless-function
    componentDidMount() {
        // Emit the event 'pluginReady'
        this.props.updatePlugin(pluginId_1.default, 'isReady', true);
    }
    render() {
        return null;
    }
}
Initializer.propTypes = {
    updatePlugin: prop_types_1.default.func.isRequired,
};
exports.default = Initializer;
//# sourceMappingURL=index.js.map