<template>
  <div id="main" class="">
    <div class="page-title chart-page">
      <div>访问偏好</div>
    </div>
    <div class="echart-group">
      <!--				<div class="group-title">-->
      <!--					<span class="title-text">登录访问</span>-->
      <!--				</div>-->
      <div class="echart-h-wrapper">
        <!-- 访问次数 -->
        <div class="cell one-third bgd echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">访问次数</div>
              <div class="sub-title">单位：百万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>用户登录访问次数</span>
            </div>
          </h5>
          <div id="fwcsEchart" class="echart-container"></div>
          <block-nodata v-show="fwcsObj.objData.noData"></block-nodata>
          <block-loading v-show="fwcsObj.objData.loading"></block-loading>
          <block-update v-show="fwcsObj.objData.update" @update="queryVisitData"></block-update>
        </div>
        <!-- 会员信息 -->
        <div class="cell one-third bgd echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">时间段占比</div>
              <div class="sub-title">单位：万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>用户在固定时间段的访问次数占比</span>
            </div>
          </h5>
          <div id="hyxxEchart" class="echart-container"></div>
          <block-nodata v-show="hyxxObj.objData.noData"></block-nodata>
          <block-loading v-show="hyxxObj.objData.loading"></block-loading>
          <block-update v-show="hyxxObj.objData.update" @update="queryPeriodData"></block-update>
        </div>
        <!-- 平均天使用时长 -->
        <div class="cell one-third bgd echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">平均天使用时长</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>各时长段用户量占比</span>
            </div>
          </h5>
          <div id="syscEchart" class="echart-container"></div>
          <block-nodata v-show="syscObj.objData.noData"></block-nodata>
          <block-loading v-show="syscObj.objData.loading"></block-loading>
          <block-update v-show="syscObj.objData.update" @update="queryUsedurData"></block-update>
        </div>
      </div>
    </div>
    <div class="echart-group">
      <!--				<div class="group-title">-->
      <!--					<span class="title-text">社交行为</span>-->
      <!--				</div>-->
      <div class="echart-h-wrapper">
        <!-- 互动行为 -->
        <div class="cell one-third bgd echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">类型比例</div>
              <div class="sub-title">单位：万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>社交次数</span>
            </div>
          </h5>
          <div id="hdxwEchart" class="echart-container"></div>
          <block-nodata v-show="hdxwObj.objData.noData"></block-nodata>
          <block-loading v-show="hdxwObj.objData.loading"></block-loading>
          <block-update v-show="hdxwObj.objData.update" @update="queryActionData"></block-update>
        </div>
        <!-- 社交活跃度趋势 -->
        <div class="cell two-thirds bgd echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">社交活跃度趋势</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>用户总播放和正片播放次数</span>
            </div>
          </h5>
          <div id="shhyEchart" class="echart-container"></div>
          <block-developing v-show="shhyObj.objData.inDevelop"></block-developing>
          <block-nodata v-show="shhyObj.objData.noData"></block-nodata>
          <block-loading v-show="shhyObj.objData.loading"></block-loading>
          <block-update v-show="shhyObj.objData.update" @update="queryActivityData"></block-update>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {MyMixin} from '../../assets/js/echart/mixins.js'
    export default {
        name: "accessPreference",
        mixins: [MyMixin],
        data(){
            return {}
        },
        mounted: function (event) {
            var that = this;
            that.init();
        },
        methods: {
            /*初始化数据*/
            init: function () {
                var that = this;
                /* 行为拆分 6个接口*/
                // let visitTimesStat={
                //     "last_month_visit": 480041272,
                // "last_6month_visit": 1200074127,
                // "last_3month_visit": 72007217,
                // "last_12month_visit": 48007272
                // }
                // that.buildVisitData(visitTimesStat);
                that.queryVisitData();


                // let timeRateStat={
                // '00:00-7:30':24542112,
                //     '7:31-8:30':24542112,
                //     '8:31-11:30':24542112,
                //     '11:31-13:30':24542112,
                //     '13:31-18:00':24542112,
                //     '18:01-22:00':24542112,
                //     '22:01-24:00':24542112,
                // };
                // that.buildVisitPeriodData(timeRateStat);
                that.queryPeriodData();


                that.queryUsedurData();
                // let actionTypeStat={
                //     "last_month_app_comment_cnt": 28800,
                //     "last_month_app_up_cnt": 52800,
                //     "last_month_app_share_cnt": 76800
                // }
                // that.buildSocialData(actionTypeStat);
                that.queryActionData();

                //that.queryActivityData(apis.activityUrl);
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../../assets/css/echartsBase';
</style>
