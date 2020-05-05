"use strict";
var weatherMap = new Map([
    ['晴', '🌞'],
    ['阴', '☁️'],
    ['多云', '🌥'],
    ['雷阵雨', '⛈'],
    ['小雨', '🌦'],
    ['中雨', '🌧'],
    ['雪', '❄️'],
    ['阵雨', '🌦'],
    ['大雨', '🌨'],
]);
module.exports = {
    getIcon: function (weatherText) {
        return (weatherMap.get(weatherText));
    }
};
