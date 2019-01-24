// import json2 from './bbb'
// console.log(json2)
const json = {
  nodes: [
    {
      'name': '三国演义',
      // 'x': 0,
      // y: 0,
      'symbolSize': 150,
      'draggable': 'true',
      'value': 27

    }, {
      'name': '刘备2239',
      'value': 15,
      'symbolSize': 80,
      'category': '刘备2239',
      'draggable': 'true'
    }, {
      'name': '使君70',
      'symbolSize': 3,
      'category': '刘备2239',
      'draggable': 'true',
      'value': 1
    }, {
      'name': '玄德1770',
      'symbolSize': 60,
      'category': '刘备2239',
      'draggable': 'true',
      'value': 1
    }, {
      'name': '皇叔112',
      'symbolSize': 15,
      'category': '刘备2239',
      'draggable': 'true',
      'value': 1
    }, {
      'name': '诸葛亮1892',
      'value': 60,
      'symbolSize': 60,
      'category': '诸葛亮1892',
      'draggable': 'true'
    }, {
      'name': '孔明1643',
      'symbolSize': 50,
      'category': '诸葛亮1892',
      'draggable': 'true',
      'value': 1
    }
    //   'name': '卧龙40',
    //   'symbolSize': 3,
    //   'category': '诸葛亮1892',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '曹操979',
    //   'value': 5,
    //   'symbolSize': 40,
    //   'category': '曹操979',
    //   'draggable': 'true'
    // }, {
    //   'name': '孟德29',
    //   'symbolSize': 3,
    //   'category': '曹操979',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '曹公44',
    //   'symbolSize': 7,
    //   'category': '曹操979',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '关羽948',
    //   'value': 40,
    //   'symbolSize': 18,
    //   'category': '关羽948',
    //   'draggable': 'true'
    // }, {
    //   'name': '云长431',
    //   'symbolSize': 20,
    //   'category': '关羽948',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '关公508',
    //   'symbolSize': 25,
    //   'category': '关羽948',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '张飞408',
    //   'value': 8,
    //   'symbolSize': 25,
    //   'category': '张飞408',
    //   'draggable': 'true'
    // }, {
    //   'name': '翼德55',
    //   'symbolSize': 5,
    //   'category': '张飞408',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '赵云393',
    //   'value': 5,
    //   'symbolSize': 30,
    //   'category': '赵云393',
    //   'draggable': 'true'
    // }, {
    //   'name': '子龙95',
    //   'symbolSize': 7,
    //   'category': '赵云393',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '孙权390',
    //   'value': 30,
    //   'symbolSize': 30,
    //   'category': '孙权390',
    //   'draggable': 'true'
    // }, {
    //   'name': '仲谋10',
    //   'symbolSize': 3,
    //   'category': '孙权390',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '吴侯72',
    //   'symbolSize': 10,
    //   'category': '孙权390',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '吕布384',
    //   'value': 20,
    //   'symbolSize': 30,
    //   'category': '吕布384',
    //   'draggable': 'true'
    // }, {
    //   'name': '奉先15',
    //   'symbolSize': 3,
    //   'category': '吕布384',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '温侯12',
    //   'symbolSize': 3,
    //   'category': '吕布384',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '周瑜328',
    //   'value': 6,
    //   'symbolSize': 18,
    //   'category': '周瑜328',
    //   'draggable': 'true'
    // }, {
    //   'name': '公瑾60',
    //   'symbolSize': 5,
    //   'category': '周瑜328',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '周郎35',
    //   'symbolSize': 3,
    //   'category': '周瑜328',
    //   'draggable': 'true',
    //   'value': 1
    // }, {
    //   'name': '魏延327',
    //   'value': 6,
    //   'symbolSize': 18,
    //   'category': '魏延327',
    //   'draggable': 'true'
    // }, {
    //   'name': '文长12',
    //   'symbolSize': 3,
    //   'category': '魏延327',
    //   'draggable': 'true',
    //   'value': 1
    //
    // }
  ],
  links: [
    {
      'source': '三国演义',
      'target': '刘备2239'
    }, {
      'source': '刘备2239',
      'target': '使君70'
    }, {
      'source': '刘备2239',
      'target': '玄德1770'
    }, {
      'source': '刘备2239',
      'target': '皇叔112'
    }, {
      'source': '三国演义',
      'target': '诸葛亮1892'
    }, {
      'source': '诸葛亮1892',
      'target': '孔明1643'
    }, {
      'source': '诸葛亮1892',
      'target': '卧龙40'
    }, {
      'source': '三国演义',
      'target': '曹操979'
    }, {
      'source': '曹操979',
      'target': '孟德29'
    }, {
      'source': '曹操979',
      'target': '曹公44'
    }, {
      'source': '三国演义',
      'target': '关羽948'
    }, {
      'source': '关羽948',
      'target': '云长431'
    }, {
      'source': '关羽948',
      'target': '关公508'
    }, {
      'source': '三国演义',
      'target': '张飞408'
    }, {
      'source': '张飞408',
      'target': '翼德55'
    }, {
      'source': '三国演义',
      'target': '赵云393'
    }, {
      'source': '赵云393',
      'target': '子龙95'
    }, {
      'source': '三国演义',
      'target': '孙权390'
    }, {
      'source': '孙权390',
      'target': '仲谋10'
    }, {
      'source': '孙权390',
      'target': '吴侯72'
    }, {
      'source': '三国演义',
      'target': '吕布384'
    }, {
      'source': '吕布384',
      'target': '奉先15'
    }, {
      'source': '吕布384',
      'target': '温侯12'
    }, {
      'source': '三国演义',
      'target': '周瑜328'
    }, {
      'source': '周瑜328',
      'target': '公瑾60'
    }, {
      'source': '周瑜328',
      'target': '周郎35'
    }, {
      'source': '三国演义',
      'target': '魏延327'
    }, {
      'source': '魏延327',
      'target': '文长12'
    }, {
      'source': '三国演义',
      'target': '法学院'
    }
  ],
  categories: [{
    'name': '刘备2239'
  }, {
    'name': '诸葛亮1892'
  }, {
    'name': '曹操979'
  }, {
    'name': '关羽948'
  }, {
    'name': '张飞408'
  }, {
    'name': '赵云393'
  }, {
    'name': '孙权390'
  }, {
    'name': '吕布384'
  }, {
    'name': '周瑜328'
  }, {
    'name': '魏延327'
  }, {

  }]
}
console.log(json)
const number = 12
const jjj = {
  nodes: new Array(number).fill(1).map((item, index) => {
    return {
      name: `元素${index + 1}`,
      category: index
    }
  }),
  categories: new Array(number).fill(1).map((item, index) => {
    return {
      name: `元素${index + 1}`
    }
  }),
  links: new Array(number * 2).fill(1).map((item, index) => {
    // new Array(number).fill(1).map((child, idx) => {
    //
    // })
    return {
      source: `元素${index % number + 1}`,
      target: `元素${~~(Math.random() * number) + 1}`
      // lineStyle: {
      //   normal: {
      //     color: 'red'
      //   }
      // }
    }
  })
}
// console.log(jjj.nodes)
// console.log(jjj.links)
// console.log(jjj.categories)
export function createUserTop6() {
  return {
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: jjj.links.length * 9
        },
        symbolSize: 30,
        data: jjj.nodes,
        links: jjj.links,
        categories: jjj.categories,
        focusNodeAdjacency: true,
        roam: false,
        label: {
          normal: {
            show: true
            // position: 'inside'

          }
        },
        lineStyle: {
          normal: {
            opacity: 0.7,
            width: 3,
            curveness: 0.1
          }
        }
      }
    ]
  }
}
// export function createUserTop6() {
//   return {
//     // title: {
//     //   text: 'STEP DAY：网站地图',
//     //   subtext: 'From:www.stepday.com',
//     //   x: 'right',
//     //   y: 'bottom'
//     // },
//     // tooltip: {
//     //   trigger: 'item',
//     //   formatter: '{a} : {b}'
//     // },
//     // legend: {
//     //   x: 'left',
//     //   data: []
//     // },
//     series: [
//       {
//         type: 'force',
//         name: '点击访问',
//         categories: [
//           {
//             name: '点击访问',
//             itemStyle: {
//               normal: {
//                 color: '#ff7f50'
//               }
//             }
//           }
//         ],
//         itemStyle: {
//           normal: {
//             label: {
//               show: true,
//               textStyle: {
//                 color: '#800080'
//               }
//             },
//             nodeStyle: {
//               brushType: 'both',
//               strokeColor: 'rgba(255,215,0,0.4)',
//               lineWidth: 8
//             }
//           }
//         },
//         minRadius: 15,
//         maxRadius: 200,
//         density: 0.05,
//         attractiveness: 1.2,
//         nodes: [
//           { category: 0, name: '博客', value: 10, url: 'http://www.stepday.com/blog/' },
//           { category: 0, name: '论坛', value: 10, url: 'http://www.stepday.com/post/' },
//           { category: 0, name: '管理', value: 10, url: 'http://www.stepday.com/list/?1' },
//           { category: 0, name: '管理经验谈', value: 10, url: 'http://www.stepday.com/list/?2' },
//           { category: 0, name: '管理课堂', value: 10, url: 'http://www.stepday.com/list/?3' },
//           { category: 0, name: '技术', value: 10, url: 'http://www.stepday.com/list/?6' },
//           { category: 0, name: '技术积累', value: 10, url: 'http://www.stepday.com/list/?7' },
//           { category: 0, name: '技术讲座', value: 10, url: 'http://www.stepday.com/list/?8' },
//           { category: 0, name: '技术探讨', value: 10, url: 'http://www.stepday.com/list/?9' },
//           { category: 0, name: '创业', value: 10, url: 'http://www.stepday.com/list/?10' },
//           { category: 0, name: '思考的准备', value: 10, url: 'http://www.stepday.com/list/?11' },
//           { category: 0, name: '奋斗在路上', value: 10, url: 'http://www.stepday.com/list/?12' },
//           { category: 0, name: '经营的思考', value: 10, url: 'http://www.stepday.com/list/?13' },
//           { category: 0, name: '屌丝经济', value: 10, url: 'http://www.stepday.com/list/?14' },
//           { category: 0, name: '投资理财', value: 10, url: 'http://www.stepday.com/list/?15' },
//           { category: 0, name: '屌丝形象', value: 10, url: 'http://www.stepday.com/list/?22' },
//           { category: 0, name: '健康指数', value: 10, url: 'http://www.stepday.com/list/?23' },
//           { category: 0, name: '爱情季节', value: 10, url: 'http://www.stepday.com/list/?24' },
//           { category: 0, name: '感悟生活', value: 10, url: 'http://www.stepday.com/list/?30' },
//           { category: 0, name: '烦恼回收站', value: 10, url: 'http://www.stepday.com/list/?32' },
//           { category: 0, name: '工作浅谈', value: 10, url: 'http://www.stepday.com/list/?34' },
//           { category: 0, name: '神级吐槽', value: 10, url: 'http://www.stepday.com/list/?35' },
//           { category: 0, name: '专题', value: 10, url: 'http://www.stepday.com/zhuanti/highcharts/' },
//           { category: 0, name: 'Highcharts API', value: 10, url: 'http://www.stepday.com/zhuanti/highcharts/' },
//           { category: 0, name: '博客精简模式', value: 10, url: 'http://www.stepday.com/zhuanti/picBlog/' },
//           { category: 0, name: '论坛精简模式', value: 10, url: 'http://www.stepday.com/zhuanti/picPost/' },
//           { category: 0, name: '登录', value: 10, url: 'http://www.stepday.com/login/' },
//           { category: 0, name: '注册', value: 10, url: 'http://www.stepday.com/register/' },
//           { category: 0, name: 'STEP DAY', value: 10, url: 'http://www.stepday.com' }
//         ],
//         links: [
//           { source: 0, target: 28, weight: 4 },
//           { source: 1, target: 28, weight: 4 },
//           { source: 26, target: 28, weight: 4 },
//           { source: 27, target: 28, weight: 4 },
//           { source: 2, target: 0, weight: 2 },
//           { source: 2, target: 1, weight: 2 },
//           { source: 5, target: 0, weight: 2 },
//           { source: 5, target: 1, weight: 2 },
//           { source: 9, target: 0, weight: 2 },
//           { source: 9, target: 1, weight: 2 },
//           { source: 13, target: 0, weight: 2 },
//           { source: 13, target: 1, weight: 2 },
//           { source: 15, target: 0, weight: 2 },
//           { source: 15, target: 1, weight: 2 },
//           { source: 22, target: 0, weight: 2 },
//           { source: 22, target: 1, weight: 2 },
//           { source: 3, target: 2, weight: 1 },
//           { source: 4, target: 2, weight: 2 },
//           { source: 6, target: 5, weight: 1 },
//           { source: 7, target: 5, weight: 2 },
//           { source: 8, target: 5, weight: 1 },
//           { source: 10, target: 9, weight: 1 },
//           { source: 11, target: 9, weight: 2 },
//           { source: 12, target: 9, weight: 1 },
//           { source: 14, target: 13, weight: 1 },
//           { source: 16, target: 15, weight: 2 },
//           { source: 17, target: 15, weight: 1 },
//           { source: 18, target: 15, weight: 1 },
//           { source: 19, target: 15, weight: 2 },
//           { source: 20, target: 15, weight: 1 },
//           { source: 21, target: 15, weight: 1 },
//           { source: 23, target: 22, weight: 2 },
//           { source: 24, target: 22, weight: 1 },
//           { source: 25, target: 22, weight: 1 }
//         ]
//       }
//     ]
//   }
// }
// //创建ECharts图表
// function DrawEChart(ec) {
//   //--- 折柱 ---
//   myChart = ec.init(document.getElementById('main'));
//   //图表显示提示信息
//   myChart.showLoading({
//     text: '站点关系图正在努力加载...'
//   });
//   myChart.hideLoading();
//   myChart.setOption({
//     title: {
//       text: 'STEP DAY：网站地图',
//       subtext: 'From:www.stepday.com',
//       x: 'right',
//       y: 'bottom'
//     },
//     tooltip: {
//       trigger: 'item',
//       formatter: '{a} : {b}'
//     },
//     legend: {
//       x: 'left',
//       data: []
//     },
//     series: [
//       {
//         type: 'force',
//         name: '点击访问',
//         categories: [
//           {
//             name: '点击访问',
//             itemStyle: {
//               normal: {
//                 color: '#ff7f50'
//               }
//             }
//           }
//         ],
//         itemStyle: {
//           normal: {
//             label: {
//               show: true,
//               textStyle: {
//                 color: '#800080'
//               }
//             },
//             nodeStyle: {
//               brushType: 'both',
//               strokeColor: 'rgba(255,215,0,0.4)',
//               lineWidth: 8
//             }
//           }
//         },
//         minRadius: 15,
//         maxRadius: 200,
//         density: 0.05,
//         attractiveness: 1.2,
//         nodes: [
//           { category: 0, name: '博客', value: 10, url: 'http://www.stepday.com/blog/' },
//           { category: 0, name: '论坛', value: 10, url: 'http://www.stepday.com/post/' },
//           { category: 0, name: '管理', value: 10, url: 'http://www.stepday.com/list/?1' },
//           { category: 0, name: '管理经验谈', value: 10, url: 'http://www.stepday.com/list/?2' },
//           { category: 0, name: '管理课堂', value: 10, url: 'http://www.stepday.com/list/?3' },
//           { category: 0, name: '技术', value: 10, url: 'http://www.stepday.com/list/?6' },
//           { category: 0, name: '技术积累', value: 10, url: 'http://www.stepday.com/list/?7' },
//           { category: 0, name: '技术讲座', value: 10, url: 'http://www.stepday.com/list/?8' },
//           { category: 0, name: '技术探讨', value: 10, url: 'http://www.stepday.com/list/?9' },
//           { category: 0, name: '创业', value: 10, url: 'http://www.stepday.com/list/?10' },
//           { category: 0, name: '思考的准备', value: 10, url: 'http://www.stepday.com/list/?11' },
//           { category: 0, name: '奋斗在路上', value: 10, url: 'http://www.stepday.com/list/?12' },
//           { category: 0, name: '经营的思考', value: 10, url: 'http://www.stepday.com/list/?13' },
//           { category: 0, name: '屌丝经济', value: 10, url: 'http://www.stepday.com/list/?14' },
//           { category: 0, name: '投资理财', value: 10, url: 'http://www.stepday.com/list/?15' },
//           { category: 0, name: '屌丝形象', value: 10, url: 'http://www.stepday.com/list/?22' },
//           { category: 0, name: '健康指数', value: 10, url: 'http://www.stepday.com/list/?23' },
//           { category: 0, name: '爱情季节', value: 10, url: 'http://www.stepday.com/list/?24' },
//           { category: 0, name: '感悟生活', value: 10, url: 'http://www.stepday.com/list/?30' },
//           { category: 0, name: '烦恼回收站', value: 10, url: 'http://www.stepday.com/list/?32' },
//           { category: 0, name: '工作浅谈', value: 10, url: 'http://www.stepday.com/list/?34' },
//           { category: 0, name: '神级吐槽', value: 10, url: 'http://www.stepday.com/list/?35' },
//           { category: 0, name: '专题', value: 10, url: 'http://www.stepday.com/zhuanti/highcharts/' },
//           { category: 0, name: 'Highcharts API', value: 10, url: 'http://www.stepday.com/zhuanti/highcharts/' },
//           { category: 0, name: '博客精简模式', value: 10, url: 'http://www.stepday.com/zhuanti/picBlog/' },
//           { category: 0, name: '论坛精简模式', value: 10, url: 'http://www.stepday.com/zhuanti/picPost/' },
//           { category: 0, name: '登录', value: 10, url: 'http://www.stepday.com/login/' },
//           { category: 0, name: '注册', value: 10, url: 'http://www.stepday.com/register/' },
//           { category: 0, name: 'STEP DAY', value: 10, url: 'http://www.stepday.com' }
//         ],
//         links: [
//           { source: 0, target: 28, weight: 4 },
//           { source: 1, target: 28, weight: 4 },
//           { source: 26, target: 28, weight: 4 },
//           { source: 27, target: 28, weight: 4 },
//           { source: 2, target: 0, weight: 2 },
//           { source: 2, target: 1, weight: 2 },
//           { source: 5, target: 0, weight: 2 },
//           { source: 5, target: 1, weight: 2 },
//           { source: 9, target: 0, weight: 2 },
//           { source: 9, target: 1, weight: 2 },
//           { source: 13, target: 0, weight: 2 },
//           { source: 13, target: 1, weight: 2 },
//           { source: 15, target: 0, weight: 2 },
//           { source: 15, target: 1, weight: 2 },
//           { source: 22, target: 0, weight: 2 },
//           { source: 22, target: 1, weight: 2 },
//           { source: 3, target: 2, weight: 1 },
//           { source: 4, target: 2, weight: 2 },
//           { source: 6, target: 5, weight: 1 },
//           { source: 7, target: 5, weight: 2 },
//           { source: 8, target: 5, weight: 1 },
//           { source: 10, target: 9, weight: 1 },
//           { source: 11, target: 9, weight: 2 },
//           { source: 12, target: 9, weight: 1 },
//           { source: 14, target: 13, weight: 1 },
//           { source: 16, target: 15, weight: 2 },
//           { source: 17, target: 15, weight: 1 },
//           { source: 18, target: 15, weight: 1 },
//           { source: 19, target: 15, weight: 2 },
//           { source: 20, target: 15, weight: 1 },
//           { source: 21, target: 15, weight: 1 },
//           { source: 23, target: 22, weight: 2 },
//           { source: 24, target: 22, weight: 1 },
//           { source: 25, target: 22, weight: 1 }
//         ]
//       }
//     ]
//   });
//
//   var ecConfig = require('echarts/config');
//   //实现节点点击事件
//   function focus(param) {
//     var option = myChart.getOption();
//     var data = param.data;
//     //判断节点的相关数据是否正确
//     if (data != null && data != undefined) {
//       if (data.url != null && data.url != undefined) {
//         //根据节点的扩展属性url打开新页面
//         window.open(data.url);
//       }
//     }
//   }
//   //绑定图表节点的点击事件
//   myChart.on(ecConfig.EVENT.CLICK, focus)
// }
