const weatherMap = new Map([
  ['晴', '🌞'],
  ['阴', '☁️'],
  ['多云', '🌥'],
  ['雷阵雨', '⛈'],
  ['小雨', '🌦'],
  ['中雨', '🌧'],
  ['雪', '❄️'],
  ['阵雨', '🌦'],
  ['大雨', '🌨'],
])

export = {
  getIcon: (weatherText: string): string => {
    return (weatherMap.get(weatherText)) as string
  },
}