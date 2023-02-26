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
exports.select = exports.status = exports.confirm = exports.init = exports.search = void 0;
const services_1 = require("./services");
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status = 200 } = yield (0, services_1.searchTrainingService)(req.body);
    return res.status(status).json(data);
});
exports.search = search;
const init = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status = 200 } = yield (0, services_1.initTrainingService)(req.body);
    return res.status(status).json(data);
});
exports.init = init;
const confirm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status = 200 } = yield (0, services_1.confirmTrainingService)(req.body);
    return res.status(status).json(data);
});
exports.confirm = confirm;
const status = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status = 200 } = yield (0, services_1.statusTrainingService)(req.body);
    return res.status(status).json(data);
});
exports.status = status;
const select = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, status = 200 } = yield (0, services_1.selectTrainingService)(req.body);
    return res.status(status).json(data);
});
exports.select = select;
