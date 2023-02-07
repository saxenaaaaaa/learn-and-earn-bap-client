"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.onConfirm = exports.onInit = exports.onSelect = exports.confirm = exports.init = exports.select = exports.onSearch = exports.search = void 0;
const services_1 = require("./services");
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = yield (0, services_1.searchJob)(req.body);
    res.json(resp);
});
exports.search = search;
const onSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const resp = yield (0, services_1.getJobOnSearch)(body);
    res.json(resp);
});
exports.onSearch = onSearch;
const select = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = yield (0, services_1.selectJob)(req.body);
    res.json(resp);
});
exports.select = select;
const init = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = yield (0, services_1.initJob)(req.body);
    res.json(resp);
});
exports.init = init;
const confirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let resp;
    resp = yield (0, services_1.getJobConfirm)(req.body);
    res.json(resp);
});
exports.confirm = confirm;
const onSelect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    res.json("res from on select");
});
exports.onSelect = onSelect;
const onInit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    (0, services_1.onInitJob)(body);
    res.json("res from on Init");
});
exports.onInit = onInit;
const onConfirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let body = req.body;
    res.json("res from on confirm ");
});
exports.onConfirm = onConfirm;
