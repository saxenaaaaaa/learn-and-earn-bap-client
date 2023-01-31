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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getJob = void 0;
const axios_1 = __importDefault(require("axios"));
const flatted_1 = require("flatted");
function getJob(jobDTO) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield axios_1.default.post("http://localhost:5001/jobSearch", jobDTO);
            result = (0, flatted_1.stringify)(result);
            console.log(result["message"]);
            ///
            ///
            return result;
        }
        catch (error) {
            console.error(error);
            return {
                error: error,
                errorOccured: true,
            };
        }
    });
}
exports.getJob = getJob;
