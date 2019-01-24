let DEFAULT_SERIES_DATA_FN
DEFAULT_SERIES_DATA_FN = function (number) {
  return new Array(number).fill(1).map((item, index) => {
    return {
      value: ~~(Math.random() * 300),
      name: `项目${index + 1}`
    }
  })
}

/**
 * 兴趣的商品占比
 * @param args
 * @returns {{color: *, legend: {padding: number[], borderRadius: number, data: *, bottom: number, itemHeight: number, itemWidth: number}, series: {data, center: string[], name: string, avoidLabelOverlap: boolean, label: {normal: {show: boolean, position: string}, emphasis: {show: boolean, textStyle: {fontSize: string, fontWeight: string}}}, labelLine: {normal: {show: boolean}}, type: string, radius: string[]}[], tooltip: {formatter: string, trigger: string}}}
 */
export function createShop(args = {}) {
  let {seriesData} = args
  if (!seriesData || !seriesData.length) {
    seriesData = DEFAULT_SERIES_DATA_FN(4)
  }
  const legendData = seriesData.map((item) => {
    return {
      name: item.name,
      icon: 'rect'
    }
  })
  const colorObj = [
    {
      color: '#AA41E0'
    },
    {
      color: '#FD3F3F'
    },
    {
      color: '#4050EF'
    },
    {
      color: '#FDC33F'
    }
  ]
  let colorArr = seriesData.map((item, index) => {
    return colorObj[index].color
  })
  return {
    legend: {
      itemWidth: 8,
      itemHeight: 8,
      borderRadius: 0,
      bottom: 12,
      padding: [0, 25, 0, 25],
      data: legendData
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },
    color: colorArr,
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['50%', '45%'],
        avoidLabelOverlap: false,
        data: seriesData,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '12',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        }
      }
    ]
  }
}

/**
 * 客户性别占比
 * @param args
 * @returns {{color: *, legend: {padding: number[], borderRadius: number, data: *, bottom: number, itemHeight: number, itemWidth: number}, series: {data, center: string[], name: string, avoidLabelOverlap: boolean, label: {normal: {show: boolean, position: string}, emphasis: {show: boolean, textStyle: {fontSize: string, fontWeight: string}}}, labelLine: {normal: {show: boolean}}, type: string, radius: string[]}[], tooltip: {formatter: string, trigger: string}}}
 */
export function createGender(args = {}) {
  let {seriesData} = args
  if (!seriesData || !seriesData.length) {
    seriesData = DEFAULT_SERIES_DATA_FN(3)
  }
  const legendData = seriesData.map((item) => {
    return {
      name: item.name,
      icon: `image://https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548249415269&di=c5c9059bd8d1093afc1a1e3e7f131ddd&imgtype=0&src=http%3A%2F%2Fp0.so.qhimgs1.com%2Ft018c598c510a2918e4.png` // todo
    }
  })
  const colorObj = [
    {
      color: '#4050EF'
    },
    {
      color: '#AA41E0'
    },
    {
      color: '#FD3F3F'
    }
  ]
  let colorArr = seriesData.map((item, index) => {
    return colorObj[index].color
  })
  return {
    legend: {
      itemWidth: 14,
      itemHeight: 14,
      borderRadius: 0,
      orient: 'vertical',
      x: '60%',
      y: 'center',
      padding: [50, 25, 50, 50],
      data: legendData
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },
    color: colorArr,
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        data: seriesData,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '12',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        }
      }
    ]
  }
}

/**
 * 用户分组
 * @param args
 * @returns {{color: *, legend: {padding: number[], borderRadius: number, orient: string, data: *, itemHeight: number, x: string, itemWidth: number, y: string}, series: {data, center: string[], name: string, avoidLabelOverlap: boolean, label: {normal: {show: boolean, position: string}, emphasis: {show: boolean, textStyle: {fontSize: string, fontWeight: string}}}, labelLine: {normal: {show: boolean}}, type: string, radius: string[]}[], tooltip: {formatter: string, trigger: string}}}
 */
export function createUser(args = {}) {
  let {seriesData} = args
  if (!seriesData || !seriesData.length) {
    seriesData = DEFAULT_SERIES_DATA_FN(4)
  }
  const legendData = seriesData.map((item) => {
    return {
      name: item.name,
      icon: `image://https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1548249415269&di=c5c9059bd8d1093afc1a1e3e7f131ddd&imgtype=0&src=http%3A%2F%2Fp0.so.qhimgs1.com%2Ft018c598c510a2918e4.png` // todo
    }
  })
  const colorObj = [
    {
      color: '#22CED4'
    },
    {
      color: '#4050EF'
    },
    {
      color: '#FDC33F'
    },
    {
      color: '#FD3F3F'
    }
  ]
  let colorArr = seriesData.map((item, index) => {
    return colorObj[index].color
  })
  return {
    legend: {
      itemWidth: 14,
      itemHeight: 14,
      borderRadius: 0,
      orient: 'vertical',
      x: '60%',
      y: 'center',
      padding: [50, 25, 50, 50],
      data: legendData
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b} : {c} ({d}%)'
    },
    color: colorArr,
    series: [
      {
        name: '',
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        data: seriesData,
        label: {
          normal: {
            show: false,
            position: 'center'
          },
          emphasis: {
            show: true,
            textStyle: {
              fontSize: '12',
              fontWeight: 'bold'
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        }
      }
    ]
  }
}
