#!/usr/bin/env node

import inquirer = require("inquirer");
import colors = require("colors");
import axios,{AxiosResponse} from "axios";
import Table = require("cli-table3");
import weatherIcon = require("./weather-icon-map");
const getIcon = weatherIcon.getIcon;

promptLoop()

function promptLoop(){
  inquirer
  .prompt({
    type: "input",
    name: "city",
    message: "请输入要查询的城市"
  })
  .then((answer: {city: string}) => {
    queryWeather(answer.city, promptLoop)
  })
  .catch((err: Error) => {
    console.log(err)
  })
}

interface WeatherRes {
  status: string,
  count: string,
  info: string,
  infocode: string,
  forecasts: Forecast[]
}

interface Forecast {
  city: string,
  adcode: string,
  province: string,
  reporttime: string,
  casts: Cast[]
}

interface Cast {
  date: string,
  week:string,
  dayweather: string,
  nightweather: string,
  daytemp: string,
  nighttemp: string,
  daywind: string,
  nightwind: string,
  daypower: string,
  nightpower: string
}

function queryWeather(city: string, callback:()=>void): void {
  if(city === 'undefined'){
    console.warn('输入城市查不到，请重新输入')
  }else{
    console.log('正在查询'+city+'的天气 ... ...');
    const query:string = `?key=56e472bf225a58cafaae1a00ac4f52b4&city=${encodeURIComponent(city)}&extensions=all&output=JSON`;
    // 高德地图 天气API
    axios.get('https://restapi.amap.com/v3/weather/weatherInfo'+query)
    .then((res: AxiosResponse<any>) => {
      if(res.status===200 && res.data.count === '1') {
        const data = res.data;
        const {city:_city, reporttime, casts} = data.forecasts[0];
        const table = new Table({
          head: ['日期', '周', '白天天气', '夜晚天气', '白天温度', '晚上温度', '白天风向(风力)', '晚上风向（风力']
        });
        (casts as Cast[]).forEach(({
          date,
          week,
          dayweather,
          nightweather,
          daytemp,
          nighttemp,
          daywind,
          nightwind,
          daypower,
          nightpower
        }) => {
          table.push(
            [
              colors.magenta(date),
              week,
              dayweather + ` ${getIcon(dayweather)}`,
              nightweather+ ` ${getIcon(nightweather)}`,
              daytemp,
              nighttemp,
              `${daywind} (${daypower})`,
              `${nightwind} (${nightpower})`
            ]
          )
        });
        console.log(`查询到 ${colors.green(_city)} 的天气如下表，查询时间是 ${colors.bgWhite.green(reporttime)}: `)
        console.log(table.toString())
      }else if(res.status===200 && res.data.count === '0'){
        console.log(colors.red('没有该城市的天气信息，请检查输入城市的名字'))
      }

      inquirer
      .prompt({
        type: 'list',
        name: 'isContinue',
        message: '继续查询吗？',
        default: '继续',
        choices: ["继续", '算了'],
      }).then((answer: {isContinue: string})=>{
        if(answer.isContinue==='继续'){
          promptLoop()
        }else {
          console.log(colors.bgCyan.red('谢谢使用，再见~'))
        }
      })
    }).catch((err: Error)=>{
      console.log(err)
    })
  }
}