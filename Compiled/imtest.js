"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const canvas_1 = __importStar(require("canvas"));
const fs_1 = __importDefault(require("fs"));
function imtest() {
    return __awaiter(this, void 0, void 0, function* () {
        let can = canvas_1.default.createCanvas(960, 1500);
        let context = can.getContext('2d');
        context.drawImage(yield (0, canvas_1.loadImage)('./pfp.png'), 61, 253, 167, 167);
        context.globalCompositeOperation = 'destination-in';
        context.drawImage(yield (0, canvas_1.loadImage)('../statsPGTransparent.png'), 0, 0);
        context.globalCompositeOperation = 'source-over';
        context.drawImage(yield (0, canvas_1.loadImage)('../statsPG.png'), 0, 0);
        context.globalCompositeOperation = 'destination-over';
        context.drawImage(yield (0, canvas_1.loadImage)('../download.jpeg'), 0, 0, 960, 540);
        fs_1.default.writeFileSync('./imtest.png', can.toBuffer());
    });
}
imtest();
let list = [{ xp: 10 }, { xp: 5 }, { xp: 6 }, { xp: 7 }, { xp: 9 }];
list.sort((a, b) => a.xp - b.xp);
console.log(list);
