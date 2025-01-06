"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.chatResponseApi = exports.chatCompleteApiV2 = void 0;
const tslib_1 = require("tslib");
const axios_1 = tslib_1.__importDefault(require("axios"));
const chatCompleteApiV2 = async (streamGPT, data) => {
    const url = 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.KEY_OPENAI || "";
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };
    console.log({
        model: "gpt-3.5-turbo",
        max_tokens: 600,
        ...data,
        stream: true, // stream always is true.
    });
    try {
        const response = await axios_1.default.post(url, {
            model: "gpt-3.5-turbo",
            max_tokens: 600,
            stream: true, ...data,
        }, {
            headers,
            responseType: 'stream'
        });
        response.data.on('data', handleData);
        response.data.on('end', () => {
            streamGPT.push(null);
            streamGPT.destroy();
            console.log("end");
        });
    }
    catch (error) {
        console.error(error);
    }
    function handleData(chunk) {
        const dataString = chunk.toString();
        streamGPT.push(dataString);
    }
};
exports.chatCompleteApiV2 = chatCompleteApiV2;
const chatResponseApi = async (data) => {
    const url = 'https://api.openai.com/v1/chat/completions';
    const apiKey = process.env.KEY_OPENAI || "";
    const headers = {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
    };
    /// edit
    if (data.messages.length >= 8) {
        data.messages = [data.messages[0], ...data.messages.slice(data.messages.length - 7, data.messages.length)];
    }
    ///end edit
    console.log({
        model: "gpt-3.5-turbo",
        max_tokens: 600,
        ...data,
        stream: false // stream always is false.
    });
    try {
        console.log("start");
        const response = await axios_1.default.post(url, {
            model: "gpt-3.5-turbo",
            max_tokens: 600,
            ...data,
            stream: false,
        }, {
            headers,
            responseType: 'json'
        });
        console.log(response.data);
        return response.data;
    }
    catch (error) {
        console.error(error);
        return JSON.parse("{}");
    }
};
exports.chatResponseApi = chatResponseApi;
//# sourceMappingURL=chat_api.js.map