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
exports.onConfirm = exports.confirm = exports.onInit = exports.init = exports.onSelect = exports.select = exports.onSearch = exports.search = void 0;
const services_1 = require("./services");
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status = 200 } = yield (0, services_1.searchJob)(req.body);
    res.json(data).status(status);
});
exports.search = search;
const onSearch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { data, status = 200 } = yield (0, services_1.onSearchJob)(body);
    res.json(data).status(status);
});
exports.onSearch = onSearch;
const select = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status = 200 } = yield (0, services_1.selectJob)(req.body);
    res.json(data).status(status);
});
exports.select = select;
const onSelect = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status = 200 } = yield (0, services_1.onSelectJob)(req.body);
    res.json(data);
});
exports.onSelect = onSelect;
const init = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, } = yield (0, services_1.initJob)(req.body);
    res.json(data);
});
exports.init = init;
const onInit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, services_1.onInitJob)(req.body);
    res.json(data);
});
exports.onInit = onInit;
const confirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status = 200 } = yield (0, services_1.confirmJob)(req.body);
    res.json(data).status(status);
});
exports.confirm = confirm;
const onConfirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data } = yield (0, services_1.onConfirmJob)(req.body);
    res.json(data);
});
exports.onConfirm = onConfirm;
