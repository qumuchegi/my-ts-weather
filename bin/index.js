#!/usr/bin/env node
"use strict";
exports.__esModule = true;
var inquirer = require("inquirer");
var colors = require("colors");
var axios_1 = require("axios");
var Table = require("cli-table3");
promptLoop();
function promptLoop() {
    inquirer
        .prompt({
        type: "input",
        name: "city",
        message: "请输入要查询的城市"
    })
        .then(function (answer) {
        queryWeather(answer.city, promptLoop);
    })["catch"](function (err) {
        console.log(err);
    });
}
function queryWeather(city, callback) {
    if (city === 'undefined') {
        console.warn('输入城市查不到，请重新输入');
    }
    else {
        console.log('正在查询' + city + '天气 ... ...');
        var query = "?key=56e472bf225a58cafaae1a00ac4f52b4&city=" + encodeURIComponent(city) + "&extensions=all&output=JSON";
        // 高德地图 天气API
        axios_1["default"].get('https://restapi.amap.com/v3/weather/weatherInfo' + query)
            .then(function (res) {
            if (res.status === 200 && res.data.count === '1') {
                var data = res.data;
                var _a = data.forecasts[0], _city = _a.city, reporttime = _a.reporttime, casts = _a.casts;
                var table_1 = new Table({
                    head: ['日期', '周', '白天天气', '夜晚天气', '白天温度', '晚上温度', '白天风向(风力)', '晚上风向（风力']
                });
                casts.forEach(function (_a) {
                    var date = _a.date, week = _a.week, dayweather = _a.dayweather, nightweather = _a.nightweather, daytemp = _a.daytemp, nighttemp = _a.nighttemp, daywind = _a.daywind, nightwind = _a.nightwind, daypower = _a.daypower, nightpower = _a.nightpower;
                    table_1.push([
                        colors.dim(date),
                        week,
                        dayweather,
                        nightweather,
                        daytemp,
                        nighttemp,
                        daywind + " (" + daypower + ")",
                        nightwind + " (" + nightpower + ")"
                    ]);
                });
                console.log("\u67E5\u8BE2\u5230 " + colors.green(_city) + " \u7684\u5929\u6C14\u5982\u4E0B\u8868\uFF0C\u67E5\u8BE2\u65F6\u95F4\u662F " + colors.blue(reporttime) + ": ");
                console.log(table_1.toString());
            }
            else if (res.status === 200 && res.data.count === '0') {
                console.log(colors.red('没有该城市的天气信息，请检查输入城市的名字'));
            }
            inquirer
                .prompt({
                type: 'list',
                name: 'isContinue',
                message: '继续查询吗？',
                "default": '继续',
                choices: ["继续", '算了']
            }).then(function (answer) {
                if (answer.isContinue === '继续') {
                    promptLoop();
                }
                else {
                    console.log(colors.bgCyan.red('谢谢使用，再见~'));
                }
            });
        })["catch"](function (err) {
            console.log(err);
        });
    }
}
