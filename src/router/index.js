import Vue from 'vue'
import Router from 'vue-router'
import storage from 'storage-controller'

const Oauth = () => import('pages/oauth/oauth')
// const Radar = () => import('pages/radar/radar')
const News = () => import('pages/news/news')
const Chat = () => import('pages/chat-msg/chat-msg')
const ChatList = () => import('pages/chat-msg-list/chat-msg-list')
// const Client = () => import('pages/client/client')
// const Mine = () => import('pages/mine/mine')
const ScrollDemo = () => import('pages/scroll-demo/scroll-demo')
const Echarts = () => import('pages/vue-echarts/vue-echarts')
// const Cdetail = () => import('pages/client-detail/client-detail')
const Cdata = () => import('pages/detail-data/detail-data')
// const ClientTag = () => import('pages/client-tag/client-tag')
// const ClientSetGroup = () => import('pages/client-set-group/client-set-group')
// const ClientCreateGroup = () => import('pages/client-create-group/client-create-group')
// const ClientAddUser = () => import('pages/client-add-user/client-add-user')
// const ClientSearch = () => import('pages/client-search/client-search')
// const ClientUserList = () => import('pages/client-user-list/client-user-list')
const EditCard = () => import('pages/edit-card/edit-card')
const ChangeAutograph = () => import('pages/change-autograph/change-autograph')
const ShareCard = () => import('pages/share-card/share-card')
const GoodsDetail = () => import('pages/goods-detail/goods-detail')
const GoodsList = () => import('pages/goods-list/goods-list')
const DynamicList = () => import('pages/dynamic-list/dynamic-list')
const EditDynamic = () => import('pages/edit-dynamic/edit-dynamic')
const AddFlow = () => import('pages/add-flow/add-flow')
// const MyData = () => import('pages/my-data/my-data')
const PageError = () => import('pages/page-error/page-error')
const Home = () => import('pages/home/home')
const SelectGoods = () => import('pages/select-goods/select-goods')
const NewGroupMsg = () => import('pages/new-group-msg/new-group-msg')
const NewsAddGroup = () => import('pages/news-add-group/news-add-group')
const NewsChatGroup = () => import('pages/news-chat-group/news-chat-group')
// const UsefulWord = () => import('pages/useful-word/useful-word')
// const AddWord = () => import('pages/add-word/add-word')
const GroupCode = () => import('pages/group-code/group-code')
const PersonCode = () => import('pages/person-code/person-code')
const RobotCode = () => import('pages/robot-code/robot-code')
const MyService = () => import('pages/my-service/my-service')
const MyActivity = () => import('pages/my-activity/my-activity')
const TeamActivity = () => import('pages/team-activity/team-activity')
const OrderFormManage = () => import('pages/order-form-manage/order-form-manage')
const OrderDetail = () => import('pages/order-detail/order-detail')
const ShelfService = () => import('pages/shelf-service/shelf-service')
const MyMsg = () => import('pages/my-msg/my-msg')
const zTestEcharts = () => import('pages/z-test-echarts/z-test-echarts')
const zTest = () => import('pages/z-test-z/z-test-z')
// 新版
const NClient = () => import('pages/n-client/n-client')
const NMarketing = () => import('pages/n-marketing/n-marketing')
const NClientSearch = () => import('pages/n-client-search/n-client-search')
const NClientUserList = () => import('pages/n-client-user-list/n-client-user-list')
const NClientSetGroup = () => import('pages/n-client-set-group/n-client-set-group')
const NClientCreateGroup = () => import('pages/n-client-create-group/n-client-create-group')
const NClientDetail = () => import('pages/n-client-detail/n-client-detail')
const NRadar = () => import('pages/n-radar/n-radar')
const NClientTag = () => import('pages/n-client-tag/n-client-tag')
const NMarketingDetail = () => import('pages/n-marketing-detail/n-marketing-detail')
const NMine = () => import('pages/n-mine/n-mine')
const NUsefulWord = () => import('pages/n-useful-word/n-useful-word')
const NAddWord = () => import('pages/n-add-word/n-add-word')
const NMyData = () => import('pages/n-my-data/n-my-data')
const NClientAddUser = () => import('pages/n-client-add-user/n-client-add-user')

Vue.use(Router)

const route = new Router({
  mode: 'hash',
  routes: [
    {
      path: '/z-test-charts',
      component: zTestEcharts
    },
    {
      path: '/z-test',
      component: zTest
    },
    {
      path: '/oauth',
      component: Oauth
    },
    {
      path: '/',
      component: Home,
      children: [{
        path: 'mine',
        component: NMine,
        meta: {
          title: '我的'
        },
        children: [{
          path: 'shareCard',
          component: ShareCard,
          meta: {
            title: '分享名片'
          }
        },
        {
          path: 'editCard',
          component: EditCard,
          meta: {
            title: '编辑名片'
          },
          children: [{
            path: 'changeAutograph',
            component: ChangeAutograph,
            meta: {
              title: '修改签名'
            }
          }]
        },
        {
          path: '/radar1',
          component: NRadar
        },
        {
          path: 'my-data',
          component: NMyData,
          meta: {
            title: '报表'
          }
        },
        {
          path: 'group-code',
          component: GroupCode,
          meta: {
            title: '微信群码'
          }
        },
        {
          path: 'person-code',
          component: PersonCode,
          meta: {
            title: '个人微信'
          },
          children: [{
            path: 'robot-code',
            component: RobotCode,
            meta: {
              title: '机器人微信'
            }
          }]
        },
        {
          path: 'goodList',
          component: GoodsList,
          meta: {
            title: '我的产品'
          },
          children: [{
            path: 'goodsDetail',
            component: GoodsDetail,
            meta: {
              title: '产品详情'
            }
          }]
        },
        {
          path: 'dynamicList',
          component: DynamicList,
          meta: {
            title: '动态'
          },
          children: [{
            path: 'editDynamic',
            component: EditDynamic,
            meta: {
              title: '发布动态'
            }
          }]
        },
        {
          path: 'my-activity',
          component: MyActivity,
          meta: {
            title: '我的活动'
          },
          children: [{
            path: 'team-activity',
            component: TeamActivity,
            meta: {
              title: '团队活动'
            }
          }]
        },
        {
          path: 'my-msg',
          component: MyMsg,
          meta: {
            title: '个人信息'
          }
        },
        {
          path: 'my-service',
          component: MyService,
          meta: {
            title: '我的服务'
          },
          children: [{
            path: 'shelf-service',
            component: ShelfService,
            meta: {
              title: '上架服务'
            }
          }]
        },
        {
          path: 'order-form-manage',
          component: OrderFormManage,
          meta: {
            title: '订单管理'
          },
          children: [{
            path: 'order-detail',
            component: OrderDetail,
            meta: {
              title: '订单详情'
            }
          }]
        },
        {
          path: 'useful-word',
          component: NUsefulWord,
          meta: {
            title: '话术'
          },
          children: [
            {
              path: 'add-word',
              component: NAddWord,
              meta: {
                title: '新增话术'
              }
            }
          ]
        }]
      }, {
        path: '/chat/:id',
        component: Chat,
        meta: {
          title: '聊天'
        },
        children: [{
          path: 'chat-list',
          component: ChatList,
          meta: {
            title: '聊天记录'
          }
        },
        {
          path: 'select-goods',
          component: SelectGoods,
          meta: {
            title: '选择商品'
          }
        }, {
          path: 'group-code',
          component: GroupCode,
          meta: {
            title: '微信群码'
          }
        },
        {
          path: 'person-code',
          component: PersonCode,
          meta: {
            title: '个人微信'
          },
          children: [{
            path: 'robot-code',
            component: RobotCode,
            meta: {
              title: '机器人微信'
            }
          }]
        }]
      },
      {
        path: '/scroll-demo',
        component: ScrollDemo,
        meta: {
          title: '测试滚动'
        }
      },
      {
        path: '/echarts',
        component: Echarts,
        meta: {
          title: ''
        }
      },
      {
        path: '/detail-data',
        component: Cdata,
        meta: {
          title: '客户资料'
        }
      },
      {
        path: '/addflow',
        component: AddFlow,
        meta: {
          title: '添加跟进内容'
        }
      }, {
        path: '/radar',
        component: NRadar,
        meta: {
          title: '雷达'
        },
        children: [
          {
            path: 'client-detail',
            component: NClientDetail,
            meta: {
              title: '客户详情'
            },
            children: [
              {
                path: 'client-tag',
                component: NClientTag,
                meta: {
                  title: '标签'
                }
              },
              {
                path: 'detail-data',
                component: Cdata,
                meta: {
                  title: '客户资料'
                }
              },
              {
                path: 'addflow',
                component: AddFlow,
                meta: {
                  title: '添加跟进内容'
                }
              }
            ]
          }
        ]
      },
      {
        path: '/news',
        component: News,
        meta: {
          title: '消息'
        },
        children: [
          {
            path: 'new-group-msg',
            component: NewGroupMsg,
            meta: {
              title: '群发小秘书'
            },
            children: [
              {
                path: 'news-add-group',
                component: NewsAddGroup,
                meta: {
                  title: '新建群发'
                },
                children: [
                  {
                    path: 'news-chat-group',
                    component: NewsChatGroup,
                    meta: {
                      title: '群发'
                    }
                  }
                ]
              },
              {
                path: 'news-chat-group',
                component: NewsChatGroup,
                meta: {
                  title: '群发'
                }
              }
            ]
          }
        ]
      },
      {
        path: '/news-add-group',
        component: NewsAddGroup,
        meta: {
          title: '新建群发'
        }
      },
      {
        path: '/news-chat-group',
        component: NewsChatGroup,
        meta: {
          title: '群发'
        },
        children: [ // todo
          {
            path: 'select-goods',
            component: SelectGoods,
            meta: {
              title: '选择商品'
            }
          },
          {
            path: 'group-code',
            component: GroupCode,
            meta: {
              title: '微信群码'
            }
          },
          {
            path: 'person-code',
            component: PersonCode,
            meta: {
              title: '个人微信'
            },
            children: [{
              path: 'robot-code',
              component: RobotCode,
              meta: {
                title: '机器人微信'
              }
            }]
          }
        ]
      },
      {
        path: '/new-group-msg',
        component: NewGroupMsg,
        meta: {
          title: '群发小秘书'
        }
      },
      {
        path: '/market',
        component: NMarketing,
        meta: {
          title: '营销'
        },
        children: [
          {
            path: 'market-detail',
            component: NMarketingDetail,
            meta: {
              title: '营销详情'
            }
          }
        ]
      },
      {
        path: '/client',
        component: NClient,
        meta: {
          title: '客户'
        },
        children: [
          {
            path: 'client-user-list',
            component: NClientUserList,
            meta: {
              title: '客户列表'
            },
            children: [
              {
                path: 'news-chat-group',
                component: NewsChatGroup,
                meta: {
                  title: '群发'
                }
              },
              {
                path: 'client-add-user',
                component: NClientAddUser,
                meta: {
                  title: '添加成员'
                }
              },
              {
                path: 'client-set-group',
                component: NClientSetGroup,
                meta: {
                  title: '设置分组'
                }
              },
              {
                path: 'client-search',
                component: NClientSearch,
                meta: {
                  title: '搜索'
                }
              },
              {
                path: 'client-detail',
                component: NClientDetail,
                meta: {
                  title: '客户详情'
                },
                children: [
                  {
                    path: 'client-tag',
                    component: NClientTag,
                    meta: {
                      title: '标签'
                    }
                  },
                  {
                    path: 'detail-data',
                    component: Cdata,
                    meta: {
                      title: '客户资料'
                    }
                  },
                  {
                    path: 'addflow',
                    component: AddFlow,
                    meta: {
                      title: '添加跟进内容'
                    }
                  }
                ]
              }
            ]
          },
          {
            path: 'client-detail',
            component: NClientDetail,
            meta: {
              title: '客户详情'
            },
            children: [
              {
                path: 'client-tag',
                component: NClientTag,
                meta: {
                  title: '标签'
                }
              },
              {
                path: 'detail-data',
                component: Cdata,
                meta: {
                  title: '客户资料'
                }
              },
              {
                path: 'addflow',
                component: AddFlow,
                meta: {
                  title: '添加跟进内容'
                }
              }
            ]
          },
          {
            path: 'client-set-group',
            component: NClientSetGroup,
            meta: {
              title: '设置分组'
            }
          },
          {
            path: 'client-create-group',
            component: NClientCreateGroup,
            meta: {
              title: '添加分组'
            }
          },
          {
            path: 'client-search',
            component: NClientSearch,
            meta: {
              title: '搜索'
            }
          }
        ]
      },
      // {
      //   path: '/client-tag',
      //   component: ClientTag,
      //   meta: {
      //     title: '标签'
      //   }
      // },
      // {
      //   path: '/client-detail',
      //   component: Cdetail,
      //   meta: {
      //     title: '客户详情'
      //   }
      // },
      {
        path: '/client-set-group',
        component: NClientSetGroup,
        meta: {
          title: '设置分组'
        }
      },
      {
        path: '/client-create-group',
        component: NClientCreateGroup,
        meta: {
          title: '添加分组'
        }
      }]
    },
    {
      path: '/client-search',
      component: NClientSearch,
      meta: {
        title: '搜索'
      }
    },
    {
      path: '/client-detail',
      component: NClientDetail,
      meta: {
        title: '客户详情'
      },
      children: [
        {
          path: 'client-tag',
          component: NClientTag,
          meta: {
            title: '标签'
          }
        },
        {
          path: 'detail-data',
          component: Cdata,
          meta: {
            title: '客户资料'
          }
        },
        {
          path: 'addflow',
          component: AddFlow,
          meta: {
            title: '添加跟进内容'
          }
        }
      ]
    },
    {
      path: '/page-error',
      component: PageError,
      meta: {
        title: '异常'
      }
    }
  ]
})

const DEFAULT_TITLE = '雷达'
const DEFAULT_ROUTE = '/radar'
const OAUTH_ROUTE = '/oauth'

route.beforeEach((to, from, next) => {
  document.title = to.meta.title ? to.meta.title : DEFAULT_TITLE
  if (to.path === '/') {
    const token = storage.get('token', '')
    if (token) {
      next({path: DEFAULT_ROUTE, replace: true})
    } else {
      next({path: OAUTH_ROUTE, replace: true})
    }
  }
  next()
})

export default route
