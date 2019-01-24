import APP_CONFIG from 'utils/_app-config'
/**
 * 默认X轴的值=>xAxisData
 * @type {string[]}
 */
const DEFAULT_X_DATA = new Array(12).fill(1).map((item, index) => {
  return `${(index + 1) * 2}:00`
})
/**
 * 默认y轴的值=>seriesData
 * @type {Array}
 */
let DEFAULT_SERIES_DATA_FN
if (APP_CONFIG.env === 'production') {
  DEFAULT_SERIES_DATA_FN = (number) => {
    return new Array(number).fill({
      data: new Array(12).fill(0)
    })
  }
} else {
  // 默认y轴的值=>seriesData.item
  let DEFAULT_SERIES_DATA_ITEM = (itemNumber) => {
    return new Array(12).fill(1).map((item, index) => {
      return ~~(Math.random() * (itemNumber)) // todo
    })
  }
  DEFAULT_SERIES_DATA_FN = (number, itemNumberArr = []) => {
    return new Array(number).fill(1).map((item, index) => {
      return {
        data: DEFAULT_SERIES_DATA_ITEM(itemNumberArr[index] || 100)
      }
    })
  }
}

/**
 * 订单和金额
 * @param args
 * @returns {{yAxis: Array, xAxis: {axisLabel: {color: string, fontSize: number, align: string}, data, offset: number, axisLine: {lineStyle: {color: string, width: number}, show: boolean}, splitLine: {lineStyle: {color: string, width: number}, show: boolean}, axisTick: {lineStyle: {color: string, width: number}, show: boolean}, type: string, boundaryGap: boolean}, legend: {padding: number[], borderRadius: number, data: {name: *, icon: string}[], bottom: number, itemHeight: number, show: boolean, itemWidth: number}, grid: {top: string, left: string, bottom: string, right: string, containLabel: boolean}, series: Array, tooltip: {padding: number[], axisPointer: {lineStyle: {color: string, width: number}}, trigger: string, textStyle: {align: string}}}}
 */
export function createOrderAmount(args = {}) {
  let {xAxisData, seriesData} = args
  const smooth = 0.5
  const colorObj = [
    // {
    //   name: '新增率',
    //   color: '#AA41E0'
    // },
    {
      name: '金额',
      color: '#FD3F3F'
    },
    // {
    //   name: '订单',
    //   color: '#4050EF'
    // },
    {
      name: '订单',
      color: '#4050EF'
    }
  ]
  const legendData = colorObj.map((item) => {
    return {
      name: item.name,
      icon: 'rect'
    }
  })
  if (!xAxisData || !xAxisData.length) {
    xAxisData = DEFAULT_X_DATA
  }
  if (!seriesData || !seriesData.length) {
    seriesData = DEFAULT_SERIES_DATA_FN(2, [1000, 100])
    console.log(seriesData)
  }
  let series = []
  let yAxis = []
  seriesData.forEach((item, index) => {
    series.push({
      name: colorObj[index].name,
      data: item.data,
      type: 'line',
      smooth,
      yAxisIndex: index,
      itemStyle: {
        normal: {
          name: colorObj[index].name,
          color: colorObj[index].color,
          borderWidth: 1,
          lineStyle: {
            color: colorObj[index].color,
            width: 3
          }
        }
      }
    })
    yAxis.push({
      minInterval: 1,
      type: 'value',
      name: colorObj[index].name,
      splitLine: {
        show: true,
        lineStyle: {
          color: '#EFEFEF',
          width: 0.5,
          type: 'dotted'
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: '#c4c4c4',
          width: 0.5
        }
      },
      axisLabel: {
        formatter: '{value}',
        color: '#666'
        // show: true,
        // showMinLabel: true,
        // showMaxLabel: true,
        // formatter: function (value) { return value }
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#c4c4c4',
          width: 0.5
        }
      }
    })
  })
  return {
    legend: {
      show: true,
      itemWidth: 8,
      itemHeight: 8,
      borderRadius: 0,
      bottom: 12,
      padding: [0, 25, 0, 25],
      data: legendData
    },
    grid: {
      top: '18.149779735682818%',
      left: '4.415954415954416%',
      right: '8%',
      bottom: '18.828193832599119%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      offset: 5.5,
      splitLine: {
        show: false,
        lineStyle: {
          color: '#E6E6E6',
          width: 0.5
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        align: 'center'
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: '#ccc',
          width: 0.5
        }
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#ccc',
          width: 0.5
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      textStyle: {
        align: 'left'
      },
      axisPointer: {
        lineStyle: {
          color: '#ccc',
          width: 0.5
        }
      },
      padding: [10, 50, 10, 20]
    },
    yAxis,
    series
  }
}
/**
 * 创建PNES
 * @param args
 * @returns {{yAxis: {axisLabel: {formatter: string, color: string}, minInterval: number, axisLine: {lineStyle: {color: string, width: number}, show: boolean}, splitLine: {lineStyle: {color: string, width: number, type: string}, show: boolean}, axisTick: {lineStyle: {color: string, width: number}, show: boolean}, type: string}, xAxis: {axisLabel: {color: string, fontSize: number, align: string}, data: *, offset: number, axisLine: {lineStyle: {color: string, width: number}, show: boolean}, splitLine: {lineStyle: {color: string, width: number}, show: boolean}, axisTick: {lineStyle: {color: string, width: number}, show: boolean}, type: string, boundaryGap: boolean}, legend: {padding: number[], borderRadius: number, data: {name: *, icon: string}[], bottom: number, itemHeight: number, show: boolean, itemWidth: number}, grid: {top: string, left: string, bottom: string, right: string, containLabel: boolean}, series: *, tooltip: {padding: number[], axisPointer: {lineStyle: {color: string, width: number}}, trigger: string, textStyle: {align: string}}}}
 */
export function createPNES(args = {}) {
  let {xAxisData, seriesData} = args
  const smooth = 0.5
  const colorObj = [
    {
      name: '新增率',
      color: '#AA41E0'
    },
    {
      name: '转化率',
      color: '#FD3F3F'
    },
    {
      name: '流失率',
      color: '#4050EF'
    },
    {
      name: '唤醒率',
      color: '#FDC33F'
    }
  ]
  const legendData = colorObj.map((item) => {
    return {
      name: item.name,
      icon: 'rect'
    }
  })
  if (!xAxisData || !xAxisData.length) {
    xAxisData = DEFAULT_X_DATA
  }
  if (!seriesData || !seriesData.length) {
    seriesData = DEFAULT_SERIES_DATA_FN(4)
  }
  let series = seriesData.map((item, index) => {
    return {
      name: colorObj[index].name,
      data: item.data,
      type: 'line',
      smooth,
      itemStyle: {
        normal: {
          color: colorObj[index].color,
          borderWidth: 1,
          lineStyle: {
            color: colorObj[index].color,
            width: 3
          }
        }
      }
    }
  })
  return {
    legend: {
      show: true,
      itemWidth: 8,
      itemHeight: 8,
      borderRadius: 0,
      bottom: 12,
      padding: [0, 25, 0, 25],
      data: legendData
    },
    grid: {
      top: '8.149779735682818%',
      left: '4.415954415954416%',
      right: '4%',
      bottom: '18.828193832599119%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      offset: 5.5,
      splitLine: {
        show: false,
        lineStyle: {
          color: '#E6E6E6',
          width: 0.5
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        align: 'center'
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: '#ccc',
          width: 0.5
        }
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#ccc',
          width: 0.5
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      textStyle: {
        align: 'left'
      },
      axisPointer: {
        lineStyle: {
          color: '#ccc',
          width: 0.5
        }
      },
      padding: [10, 50, 10, 20]
    },
    yAxis: {
      minInterval: 1,
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#EFEFEF',
          width: 0.5,
          type: 'dotted'
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: '#c4c4c4',
          width: 0.5
        }
      },
      axisLabel: {
        formatter: '{value}',
        color: '#666'
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#c4c4c4',
          width: 0.5
        }
      }
    },
    series
  }
}

/**
 * 创建最近15天活跃值
 * @param args
 * @returns {{yAxis: {axisLabel: {formatter: string, color: string}, minInterval: number, axisLine: {lineStyle: {color: string, width: number}, show: boolean}, splitLine: {lineStyle: {color: string, width: number, type: string}, show: boolean}, axisTick: {lineStyle: {color: string, width: number}, show: boolean}, type: string}, xAxis: {axisLabel: {color: string, fontSize: number, align: string}, data, offset: number, axisLine: {lineStyle: {color: string, width: number}, show: boolean}, splitLine: {lineStyle: {color: string, width: number}, show: boolean}, axisTick: {lineStyle: {color: string, width: number}, show: boolean}, type: string, boundaryGap: boolean}, grid: {top: string, left: string, bottom: string, right: string, containLabel: boolean}, series: *, tooltip: {padding: number[], axisPointer: {lineStyle: {color: string, width: number}}, trigger: string, textStyle: {align: string}}}}
 * @private
 */
export function createVitality(args = {}) {
  let {xAxisData, seriesData} = args
  const smooth = 0.5
  const colorObj = [
    {
      name: '活跃度',
      color: '#AA41E0',
      colorStops0: 'rgba(170,65,224, 0.55)',
      colorStops1: 'rgba(170,65,224, 0.05)'
    }
  ]
  if (!xAxisData || !xAxisData.length) {
    xAxisData = DEFAULT_X_DATA
  }
  if (!seriesData || !seriesData.length) {
    seriesData = DEFAULT_SERIES_DATA_FN(1)
  }
  let series = seriesData.map((item, index) => {
    return {
      name: colorObj[index].name,
      data: item.data,
      type: 'line',
      smooth,
      areaStyle: {
        color: {
          type: 'linear',
          x: 0,
          x2: 0,
          y: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: colorObj[index].colorStops0
            },
            {
              offset: 1,
              color: colorObj[index].colorStops1
            }
          ],
          globalCoord: false
        }
      },
      itemStyle: {
        normal: {
          color: colorObj[index].color,
          borderWidth: 1,
          lineStyle: {
            color: colorObj[index].color,
            width: 3
          }
        }
      }
    }
  })
  return {
    grid: {
      top: '8.149779735682818%',
      left: '4.415954415954416%',
      right: '4%',
      bottom: '8.828193832599119%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: xAxisData,
      offset: 5.5,
      splitLine: {
        show: false,
        lineStyle: {
          color: '#E6E6E6',
          width: 0.5
        }
      },
      axisLabel: {
        color: '#666',
        fontSize: 12,
        align: 'center'
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: '#ccc',
          width: 0.5
        }
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#ccc',
          width: 0.5
        }
      }
    },
    tooltip: {
      trigger: 'axis',
      textStyle: {
        align: 'left'
      },
      axisPointer: {
        lineStyle: {
          color: '#ccc',
          width: 0.5
        }
      },
      padding: [10, 50, 10, 20]
    },
    yAxis: {
      minInterval: 1,
      type: 'value',
      splitLine: {
        show: true,
        lineStyle: {
          color: '#EFEFEF',
          width: 0.5,
          type: 'dotted'
        }
      },
      axisTick: {
        show: false,
        lineStyle: {
          color: '#c4c4c4',
          width: 0.5
        }
      },
      axisLabel: {
        formatter: '{value}',
        color: '#666'
      },
      axisLine: {
        show: false,
        lineStyle: {
          color: '#c4c4c4',
          width: 0.5
        }
      }
    },
    series
  }
}
