"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectJobMessage = exports.searchJobMessageBuilder = void 0;
const searchJobMessageBuilder = (body) => {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const intent = {};
    if ((_a = body === null || body === void 0 ? void 0 : body.titles) === null || _a === void 0 ? void 0 : _a[0].key) {
        intent.item = {
            "descriptor": {
                "name": (_b = body === null || body === void 0 ? void 0 : body.titles) === null || _b === void 0 ? void 0 : _b[0].key
            }
        };
    }
    if ((_c = body === null || body === void 0 ? void 0 : body.companies) === null || _c === void 0 ? void 0 : _c[0].name) {
        intent.provider = {
            "descriptor": {
                "name": (_d = body === null || body === void 0 ? void 0 : body.companies) === null || _d === void 0 ? void 0 : _d[0].name
            },
        };
    }
    if ((_e = body === null || body === void 0 ? void 0 : body.companies) === null || _e === void 0 ? void 0 : _e[0].locations) {
        intent.provider = { locations: (_f = body === null || body === void 0 ? void 0 : body.companies) === null || _f === void 0 ? void 0 : _f[0].locations };
    }
    if ((_g = body === null || body === void 0 ? void 0 : body.skills) === null || _g === void 0 ? void 0 : _g.length) {
        intent.tags = [{
                code: "Skills",
                name: "",
                list: (_h = body === null || body === void 0 ? void 0 : body.skills) === null || _h === void 0 ? void 0 : _h.map((skill) => { return { code: skill.skill }; })
            }];
    }
    const message = { message: { intent: intent } };
    return message;
};
exports.searchJobMessageBuilder = searchJobMessageBuilder;
const selectJobMessage = (body) => {
    return "message select job";
};
exports.selectJobMessage = selectJobMessage;
