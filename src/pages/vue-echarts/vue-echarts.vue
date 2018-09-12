<template>
  <div class="hello">
    {{list}}
    <div id="myChart"></div>
    222
    <div id="myCharttwo"></div>
    222
    <div id="myChartthr"></div>
    222
    <div id="myChartfour"></div>
    222
    <div id="myChartfive"></div>
  </div>
</template>

<script>
  export default {
    name: 'echarts',
    data() {
      return {
        list: '111'
      }
    },
    mounted() {
      this.draw()
      this.twodraw()
      this.thrdraw()
      this.fourdraw()
      this.fivedraw()
    },
    methods: {
      draw() {
        let myChart = this.$echarts.init(document.getElementById('myChart'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: '客户兴趣占比',
            subtext: '(每小时更新)',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{c}'
          },
          color: ['#F9543C', '#23799D', '#8E3C68'],
          series: [
            {
              name: '访问222来源',
              type: 'pie',
              radius: '40%',
              center: ['50%', '60%'],
              data: [
                {value: 335, name: '对我感兴趣'},
                {value: 235, name: '对产品感兴趣'},
                {value: 148, name: '对公司感兴趣'}
              ],
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        })
      },
      eConsole(param) {
        if (param.name > 0) {
          this.$router.push('/')
        }
      },
      twodraw() {
        let myChart = this.$echarts.init(document.getElementById('myCharttwo'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: '近30日客户活跃度',
            subtext: '(每小时更新)',
            x: 'center'
          },
          xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['10.1', '10.6', '10.11', '10.16', '10.21', '10.26', '今天'],
            splitLine: {
              show: true,
              lineStyle: {
                color: '#ddd'
              }
            }
          },
          tooltip: {
            trigger: 'axis',
            formatter: '新用户数：{c}',
            axisPointer: {
              type: 'none'
            }
          },
          yAxis: {
            minInterval: 1,
            type: 'value',
            splitLine: {
              show: true,
              lineStyle: {
                color: '#ddd'
              }
            }
          },
          series: [{
            data: [1, 2, 1, 1, 3, 2, 2],
            type: 'line',
            showSymbol: false,
            itemStyle: {
              normal: {
                color: '#F9543C',
                borderWidth: 2,
                lineStyle: {
                  color: '#F9543C',
                  width: 3
                }
              }
            }
          }]
        })
      },
      thrdraw() {
        let myChart = this.$echarts.init(document.getElementById('myChartthr'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: '客户与我的互动',
            subtext: '(每小时更新)',
            x: 'center'
          },
          tooltip: {
            trigger: 'axis',
            formatter: '{b}数：{c}',
            axisPointer: {
              type: 'none'
            }
          },
          grid: {
            left: '0',
            right: '4%',
            bottom: '3%',
            containLabel: true
          },
          xAxis: {
            minInterval: 1,
            type: 'value',
            boundaryGap: false,
            splitLine: {
              show: false
            },
            axisLabel: {
              interval: 0,
              color: '#20202E',
              fontSize: 14
            }
          },
          yAxis: {
            type: 'category',
            data: ['点赞', '转发', '拨打电话', '咨询'],
            axisLabel: {
              interval: 0,
              color: '#20202E',
              fontSize: 14
            }
          },
          series: [{
            data: [1, 2, 4, 1],
            type: 'bar',
            showSymbol: false,
            barWidth: 25,
            itemStyle: {
              normal: {
                color: '#F9543C',
                borderWidth: 2,
                lineStyle: {
                  color: '#F9543C',
                  width: 3
                }
              }
            }
          }]
        })
      },
      fourdraw() {
        let myChart = this.$echarts.init(document.getElementById('myChartfour'))
        // 绘制图表
        myChart.setOption({
          title: {
            text: '成交漏斗图',
            subtext: '(每小时更新)',
            x: 'center'
          },
          tooltip: {
            trigger: 'item',
            formatter: '{b}'
          },
          series: [{
            name: '漏斗图',
            type: 'funnel',
            left: '13%',
            top: 90,
            bottom: 30,
            width: '70%',
            minSize: '0%',
            maxSize: '100%',
            sort: 'descending',
            gap: 2,
            label: {
              normal: {
                show: true,
                position: 'inside'
              },
              emphasis: {
                textStyle: {
                  fontSize: 20
                }
              }
            },
            labelLine: {
              normal: {
                length: 10,
                lineStyle: {
                  width: 1,
                  type: 'solid'
                }
              }
            },
            itemStyle: {
              normal: {
                borderColor: '#fff',
                borderWidth: 1
              }
            },
            data: [
              {value: 80, name: '322'},
              {value: 60, name: '155'},
              {value: 40, name: '21'},
              {value: 20, name: '0'}
            ]
          }]
        })
        myChart.on('click', this.eConsole)
      },
      fivedraw() {
        let myChart = this.$echarts.init(document.getElementById('myChartfive'))
        // 绘制图表
        myChart.setOption({
          radar: [
            {
              indicator: [
                {text: '个人魅力', max: 100},
                {text: '获客能力', max: 100},
                {text: '客户跟进力', max: 100},
                {text: '官网推广力', max: 100},
                {text: '产品推广力', max: 100},
                {text: '客户互动力', max: 100}
              ],
              name: {
                textStyle: {
                  color: '#888'
                }
              },
              center: ['50%', '50%'],
              radius: 80
            }
          ],
          graphic: {
            type: 'text',
            left: 'center',
            top: 'center',
            z: 2,
            zlevel: 100,
            style: {
              text: '77',
              x: 100,
              y: 100,
              textAlign: 'center',
              fill: '#202020',
              width: 30,
              height: 30,
              fontSize: 18
            }
          },
          series: [
            {
              type: 'radar',
              tooltip: {
                trigger: 'item'
              },
              itemStyle: {
                normal: {
                  areaStyle: {
                    type: 'default',
                    color: 'rgba(86,186,21,.6)'
                  },
                  lineStyle: {
                    color: 'rgba(86,186,21,.6)',
                    width: 1
                  }
                }
              },
              symbol: 'none',
              data: [
                {
                  value: [60, 73, 85, 40, 85, 40],
                  name: '某软件'
                }
              ]
            }
          ]
        })
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="stylus" rel="stylesheet/stylus">
  #myChart
    width: 95%
    height: 300px
    margin: 20px auto
    background: #fff
    border: 1px solid #ddd
    padding: 20px

  #myCharttwo
    width: 95%
    height: 300px
    margin: 20px auto
    background: #fff
    border: 1px solid #ddd
    padding: 20px

  #myChartthr
    width: 95%
    height: 300px
    margin: 20px auto
    background: #fff
    border: 1px solid #ddd
    padding: 20px

  #myChartfour
    width: 95%
    height: 300px
    margin: 20px auto
    background: #fff
    border: 1px solid #ddd
    padding: 20px

  #myChartfive
    width: 95%
    height: 300px
    margin: 20px auto
    background: #fff
    border: 1px solid #ddd
    padding: 20px

</style>
