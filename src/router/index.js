import Vue from "vue";
import Router from "vue-router";
import App from "@/App";

/* 整体看板 */
import overView from "../components/wholeView/overView";

import accessPreference from "../components/wholeView/accessPreference";
import consumptionPreference from "../components/wholeView/consumptionPreference";
import playPreference from "../components/wholeView/playPreference";
import contentPreference from "../components/wholeView/contentPreference";
import hotTop from "../components/wholeView/hotTop";

/* 个人画像 */
import personalPortrait from "../components/personalPortait/index";

/* 报表中心 */
import hotPortrait from "../components/reportCenter/hotPortrait";
import hotSearch from "../components/reportCenter/hotSearch";
import systemLog from "../components/reportCenter/systemLog";

/* 我的收藏 */
import myCollection from "../components/myCollection/index";

/* 群体画像 */
import groupList from "../components/groupPortrait/list";
import groupDetail from "../components/groupPortrait/detail";
import portraitDetail from "../components/groupPortrait/portraitDetail";
import configure from "../components/groupPortrait/configure";

/* 标签市场 */
import labelList from "../components/labelMarket/list";
import labelDetail from "../components/labelMarket/detail";
import customLabelDetail from '../components/labelMarket/customDetail';
import labelOverview from "../components/labelMarket/labelOverview";

// 任务列表
import taskList from '@/components/tasklist/list'

// 任务一审
import firstAudit from "../components/auditList/firstAudit";

// 任务二审
import secondAudit from "../components/auditList/secondAudit";

// 任务审核配置
import auditConfiguration from "../components/auditConfiguration/auditConfiguration";

// 任务执行历史
import taskHistory from '@/components/tasklist/executiveHitory'

// 任务日志列表下载
import taskLog from '@/components/tasklist/logList'

// 模板管理
import templateList from '@/components/template/list'
import templateAdd from '@/components/template/add'

// 自定义提数
import customExtract from '@/components/customExtract/customExtract'

// 数据集管理
import datas from '@/components/ds/datas'
import datasAdd from '@/components/ds/add.vue'

/* 魔百和详单 */
import mobihe from "../components/mobihe/mobihe";

/* 号码包 */
import numberPack from "../components/numberPack/numberPack";

// 标签配置
import labelConfig from "../components/labelConfig/index.vue";

// 标签表配置
import labelTab from "../components/labelTabConfig/labelTab.vue";
import labelTabConfig from "../components/labelTabConfig/addOrEdit.vue";



Vue.use(Router);

export default new Router({
  routes: [
    {
      path: "/",
      name: "index",
      redirect: "/overView"
    },
    {
      path: "/overView",
      name: "overView",
      component: overView
    },
    {
      path: "/accessPreference",
      name: "accessPreference",
      component: accessPreference
    },
    {
      path: "/consumptionPreference",
      name: "consumptionPreference",
      component: consumptionPreference
    },
    {
      path: "/playPreference",
      name: "playPreference",
      component: playPreference
    },
    {
      path: "/contentPreference",
      name: "contentPreference",
      component: contentPreference
    },
    {
      path: "/hotTop",
      name: "hotTop",
      component: hotTop
    },
    {
      path: "/personalPortrait",
      name: "personalPortrait",
      component: personalPortrait
    },
    {
      path: "/hotPortrait",
      name: "hotPortrait",
      component: hotPortrait
    },
    {
      path: "/hotSearch",
      name: "hotSearch",
      component: hotSearch
    },
    {
      path: "/systemLog",
      name: "systemLog",
      component: systemLog
    },
    {
      path: "/myCollection",
      name: "myCollection",
      component: myCollection
    },
    {
      path: "/group",
      name: "groupList",
      component: groupList
    },
    {
      path: "/group/detail",
      name: "groupDetail",
      component: groupDetail
    },
    {
      path: "/group/portraitDetail",
      name: "portraitDetail",
      component: portraitDetail
    },
    {
      path: "/group/configure",
      name: "configure",
      component: configure
    },
    {
      path: "/label",
      name: "labelList",
      component: labelList
    },
    {
      path: "/label/detail",
      name: "labelDetail",
      component: labelDetail
    },
    {
      path: "/label/customDetail",
      name: "customLabelDetail",
      component: customLabelDetail
    },
    {
      path: "/LabelOverview",
      name: "labelOverview",
      component: labelOverview
    },
    {
      path: "/taskList",
      name: "taskList",
      component: taskList
    },
    {
      path: "/task/history",
      name: 'taskHistory',
      component: taskHistory
    },
    {
      path: "/task/log",
      name: 'taskLog',
      component: taskLog
    },
    {
      path: "/firstAudit",
      name: "firstAudit",
      component: firstAudit
    },
    {
      path: "/secondAudit",
      name: "secondAudit",
      component: secondAudit
    },
    {
      path: "/auditConfiguration",
      name: "auditConfiguration",
      component: auditConfiguration
    },
    {
      path: "/templateList",
      name: "templateList",
      component: templateList
    },
    {
      path: "/templateList/add",
      name: "templateAdd",
      component: templateAdd
    },
    {
      path: "/templateList/detail",
      name: "templateAdd",
      component: templateAdd
    },
    {
      path: "/templateList/edit",
      name: "templateAdd",
      component: templateAdd
    },
    {
      path: "/customExtract",
      name: "customExtract",
      component: customExtract
    },
    {
      path: "/labelTab",
      name: "labelTab",
      component: labelTab
    },
    {
      path: "/labelTabConfig/add",
      name: "labelTabAdd",
      component: labelTabConfig
    },
    {
      path: "/labelTabConfig/edit",
      name: "labelTabEdit",
      component: labelTabConfig
    },
    {
      path: "/labelConfig",
      name: "labelConfig",
      component: labelConfig
    },
    {
      path: "/mobihe",
      name: "mobihe",
      component: mobihe
    },
    {
      path: '/datas',
      name: 'datas',
      component: datas
    },
    {
      path: '/datas/add',
      name: 'datasAdd',
      component: datasAdd
    },
    {
      path: '/datas/detail',
      name: 'datasDetail',
      component: datasAdd
    },
    {
      path: "/numberPack",
      name: "numberPack",
      component: numberPack
    },
  ]
});
