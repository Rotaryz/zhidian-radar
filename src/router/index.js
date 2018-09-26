import Vue from 'vue'
import Router from 'vue-router'
import storage from 'storage-controller'

const Oauth = () => import('pages/oauth/oauth')
const Radar = () => import('pages/radar/radar')
const News = () => import('pages/news/news')
const Chat = () => import('pages/chat-msg/chat-msg')
const Client = () => import('pages/client/client')
const Mine = () => import('pages/mine/mine')
const ScrollDemo = () => import('pages/scroll-demo/scroll-demo')
const Echarts = () => import('pages/vue-echarts/vue-echarts')
const Cdetail = () => import('pages/client-detail/client-detail')
const Cdata = () => import('pages/detail-data/detail-data')
const ClientTag = () => import('pages/client-tag/client-tag')
const ClientSetGroup = () => import('pages/client-set-group/client-set-group')
const ClientCreateGroup = () => import('pages/client-create-group/client-create-group')
const ClientAddUser = () => import('pages/client-add-user/client-add-user')
const ClientSearch = () => import('pages/client-search/client-search')
const ClientUserList = () => import('pages/client-user-list/client-user-list')
const EditCard = () => import('pages/edit-card/edit-card')
const ChangeAutograph = () => import('pages/change-autograph/change-autograph')
const ShareCard = () => import('pages/share-card/share-card')
const GoodsDetail = () => import('pages/goods-detail/goods-detail')
const GoodsList = () => import('pages/goods-list/goods-list')
const DynamicList = () => import('pages/dynamic-list/dynamic-list')
const EditDynamic = () => import('pages/edit-dynamic/edit-dynamic')
const AddFlow = () => import('pages/add-flow/add-flow')
const MyData = () => import('pages/my-data/my-data')
const PageError = () => import('pages/page-error/page-error')
const Home = () => import('pages/home/home')
const SelectGoods = () => import('pages/select-goods/select-goods')
const NewGroupMsg = () => import('pages/new-group-msg/new-group-msg')
const NewsAddGroup = () => import('pages/news-add-group/news-add-group')
const NewsChatGroup = () => import('pages/news-chat-group/news-chat-group')
const UsefulWord = () => import('pages/useful-word/useful-word')
const AddWord = () => import('pages/add-word/add-word')
const GroupCode = () => import('pages/group-code/group-code')
const PersonCode = () => import('pages/person-code/person-code')
const RobotCode = () => import('pages/robot-code/robot-code')

Vue.use(Router)

const route = new Router({
  mode: 'history',
  routes: [
    // {
    //   path: '/',
    //   redirect: '/shareCard'
    // },
    {
      path: '/oauth',
      component: Oauth
    },
    {
      path: '/',
      component: Home,
      children: [{
        path: 'mine',
        component: Mine,
        meta: {
          title: '我的'
        },
        children: [{
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
          path: 'my-data',
          component: MyData,
          meta: {
            title: '我的图表'
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
        }]
      }, {
        path: '/chat/:id',
        component: Chat,
        meta: {
          title: ''
        },
        children: [{
          path: 'select-goods',
          component: SelectGoods,
          meta: {
            title: '选择商品'
          }
        }, {
          path: 'useful-word',
          component: UsefulWord,
          meta: {
            title: '常用语'
          },
          children: [
            {
              path: 'add-word',
              component: AddWord,
              meta: {
                title: '常用语'
              }
            }
          ]
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
        component: Radar,
        meta: {
          title: '雷达'
        },
        children: [
          {
            path: 'client-detail',
            component: Cdetail,
            meta: {
              title: '客户详情'
            },
            children: [
              {
                path: 'client-tag',
                component: ClientTag,
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
        }
      },
      {
        path: '/news-add-group',
        component: NewsAddGroup,
        meta: {
          title: '添加组'
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
          },
          {
            path: 'useful-word',
            component: UsefulWord,
            meta: {
              title: '常用语'
            },
            children: [
              {
                path: 'add-word',
                component: AddWord,
                meta: {
                  title: '常用语'
                }
              }
            ]
          }
        ]
      },
      {
        path: '/new-group-msg',
        component: NewGroupMsg,
        meta: {
          title: '新建群发'
        }
      },
      {
        path: '/client',
        component: Client,
        meta: {
          title: '客户'
        },
        children: [
          {
            path: 'client-user-list',
            component: ClientUserList,
            meta: {
              title: '客户列表'
            },
            children: [
              {
                path: 'client-add-user',
                component: ClientAddUser,
                meta: {
                  title: '添加成员'
                }
              },
              {
                path: 'client-set-group',
                component: ClientSetGroup,
                meta: {
                  title: '设置分组'
                }
              },
              {
                path: 'client-search',
                component: ClientSearch,
                meta: {
                  title: '搜索'
                }
              },
              {
                path: 'client-detail',
                component: Cdetail,
                meta: {
                  title: '客户详情'
                },
                children: [
                  {
                    path: 'client-tag',
                    component: ClientTag,
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
            component: Cdetail,
            meta: {
              title: '客户详情'
            },
            children: [
              {
                path: 'client-tag',
                component: ClientTag,
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
            component: ClientSetGroup,
            meta: {
              title: '设置分组'
            }
          },
          {
            path: 'client-create-group',
            component: ClientCreateGroup,
            meta: {
              title: '添加分组'
            }
          },
          {
            path: 'client-search',
            component: ClientSearch,
            meta: {
              title: '搜索'
            }
          }
        ]
      },
      {
        path: '/client-tag',
        component: ClientTag,
        meta: {
          title: '标签'
        }
      },
      {
        path: '/client-search',
        component: ClientSearch,
        meta: {
          title: '搜索'
        }
      },
      {
        path: '/client-detail',
        component: Cdetail,
        meta: {
          title: '客户详情'
        }
      },
      {
        path: '/client-set-group',
        component: ClientSetGroup,
        meta: {
          title: '设置分组'
        }
      },
      {
        path: '/client-create-group',
        component: ClientCreateGroup,
        meta: {
          title: '添加分组'
        }
      }]
    },
    {
      path: '/page-error',
      component: PageError,
      meta: {
        title: '异常'
      }
    },
    // 测试
    {
      path: '/shareCard',
      component: ShareCard,
      meta: {
        title: '分享名片'
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
