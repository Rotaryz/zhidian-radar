// 将所有的接口请求都通过这个统一输出
import business from './business'
import upload from './upload'
import client from './client'
import jwt from './jwt'
import im from './im'
import live from './live'
import clientDetail from './clientDetail'
import goods from './goods'
import echart from './echart'
import global from './global'
import news from './news'
import mine from './mine'
import service from './service'
import activity from './activity'
import orderForm from './orderForm'
import radar from './radar'
import marketing from './n-marketing'
import coupon from './coupon'
import nEchart from './n-echart'

// 营销
export const Marketing = marketing
// 授权模块
export const Jwt = jwt

// 名片
export const Business = business

// 上传
export const UpLoad = upload

// 客户资料
export const ClientDetail = clientDetail

// 动态
export const Live = live

// 客户
export const Client = client

// 雷达消息im
export const Im = im

// 商品
export const Goods = goods

// 图表
export const Echart = echart

// 企业微信
export const Global = global

// 消息相关
export const News = news

// 我的
export const Mine = mine

// 我的服务
export const Service = service

// 我的活动
export const Activity = activity

// 我的订单
export const OrderForm = orderForm

// 雷达
export const Radar = radar

// 优惠券
export const Coupon = coupon

// AI智能运营图表
export const NEchart = nEchart
