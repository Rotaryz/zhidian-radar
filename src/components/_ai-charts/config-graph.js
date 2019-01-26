// import json2 from './bbb'
// console.log(json2)
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
          repulsion: Math.max(jjj.links.length * 9, jjj.nodes.length * 6, 6 * 12)
        },
        symbolSize: 30,
        data: jjj.nodes,
        links: jjj.links,
        categories: jjj.categories,
        focusNodeAdjacency: true,
        roam: true,
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

const number2 = 100
const json = {
  nodes: new Array(number2).fill(1).map((item, index) => {
    return {
      name: `元素${index + 1}`,
      category: index
    }
  }),
  categories: new Array(number2).fill(1).map((item, index) => {
    return {
      name: `元素${index + 1}`
    }
  }),
  links: new Array(number2 * 2).fill(1).map((item, index) => {
    // new Array(number2).fill(1).map((child, idx) => {
    //
    // })
    return {
      source: `元素${index % number2 + 1}`,
      target: `元素${~~(Math.random() * number2) + 1}`
      // lineStyle: {
      //   normal: {
      //     color: 'red'
      //   }
      // }
    }
  })
}
export function createUserTop6Detail() {
  return {
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: Math.max(json.links.length * 5, json.nodes.length * 5, 6 * 12)
        },
        symbolSize: 30,
        data: json.nodes,
        links: json.links,
        categories: json.categories,
        focusNodeAdjacency: true,
        roam: true,
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
