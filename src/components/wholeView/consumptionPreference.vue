<template>
  <div id="main" class="">
    <div class="page-title chart-page">
      <div>消费偏好</div>
    </div>
    <div class="echart-group">
      <!--				<div class="group-title">-->
      <!--					<span class="title-text">消费信息</span>-->
      <!--				</div>-->
      <div class="echart-h-wrapper">
        <!-- 消费类型 -->
        <div class="cell one-half bgd echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">消费类型</div>
              <div class="sub-title">单位：万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>截至当前，用户最近一次会员消费的类型占比</span>
            </div>
          </h5>
          <div id="xflxEchart" class="echart-container"></div>
          <block-nodata v-show="typeObj.objData.noData"></block-nodata>
          <block-loading v-show="typeObj.objData.loading"></block-loading>
          <block-update v-show="typeObj.objData.update" @update="queryTypeData"></block-update>
        </div>
        <!-- 消费能力 -->
        <div class="cell one-half bgd echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">消费能力</div>
              <div class="sub-title">单位：万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>过去12个月的会员消费金额占比</span>
            </div>
          </h5>
          <div id="xfnlEchart" class="echart-container"></div>
          <block-nodata v-show="abilityObj.objData.noData"></block-nodata>
          <block-loading v-show="abilityObj.objData.loading"></block-loading>
          <block-update v-show="abilityObj.objData.update" @update="queryAbilityData"></block-update>
        </div>
      </div>
    </div>
    <div class="echart-group">
      <!--				<div class="group-title">-->
      <!--					<span class="title-text">消费结构</span>-->
      <!--				</div>-->
      <div class="echart-h-wrapper">
        <!-- 性别 -->
        <div class="cell one-third echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">消费-性别</div>
              <div class="sub-title">单位:万元</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>不同性别的用户在过去12个月的会员消费金额和比例</span>
            </div>
          </h5>
          <div id="consumption-gender" class="echart-container">
            <div class="gender-wrapper" v-show="xbxfObj.objData.nanVal[0] > 0">
              <div class="gender-bar male-bar" :style="{width: xbxfObj.objData.nanRatio + '%'}">
                <div class="male-icon"></div>
                <p>男</p>
                <h3 class="male-ratio">{{xbxfObj.objData.nanVal[0]}}</h3>

              </div>
              <div class="gender-bar female-bar" :style="{width: xbxfObj.objData.nvRatio + '%'}">
                <div class="female-icon"></div>
                <p>女</p>
                <h3 class="female-ratio">{{xbxfObj.objData.nvVal[0]}}</h3>
              </div>
            </div>
          </div>
          <block-nodata v-show="xbxfObj.objData.noData"></block-nodata>
          <block-loading v-show="xbxfObj.objData.loading"></block-loading>
          <block-update v-show="xbxfObj.objData.update" @update="queryConsumeGenderData"></block-update>
        </div>
        <!-- 年龄-->
        <div class="cell one-third echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">消费-年龄</div>
              <div class="sub-title">单位:万元</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>不同年龄段的用户在过去12个月的会员消费金额和比例</span>
            </div>
          </h5>
          <div id="nlxfEchart" class="echart-container"></div>
          <block-nodata v-show="nlxfObj.objData.noData"></block-nodata>
          <block-loading v-show="nlxfObj.objData.loading"></block-loading>
          <block-update v-show="nlxfObj.objData.update" @update="queryAgeData"></block-update>
        </div>
        <!-- 城市-->
        <div class="cell one-third echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">消费-城市级别</div>
              <div class="sub-title">单位:万元</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>各级城市的用户在过去12个月的会员消费金额和比例</span>
            </div>
          </h5>
          <div id="csxfEchart" class="echart-container"></div>
          <block-developing v-show="csxfObj.objData.inDevelop"></block-developing>
          <block-nodata v-show="csxfObj.objData.noData"></block-nodata>
          <block-loading v-show="csxfObj.objData.loading"></block-loading>
          <block-update v-show="csxfObj.objData.update" @update="queryEducationData"></block-update>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {MyMixin} from '../../assets/js/echart/mixins.js'
    export default {
        name: "consumptionPreference",
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
                /* 消费行为 */
                // var consumeTypeStat = {
                // 	'5': '1039',
                // 	'-998': '13880',
                // 	'DAY': '194933',
                // 	'HOUR': '72159',
                // 	'BOSS_MONTH': '505591',
                // 	'1 MONTH': '47230',
                // 	'3MONTH': '1906',
                // 	'6 MONTH': '1906',
                // 	'12 MONTH': '245',
                // 	'': '429',
                // }
                // that.buildTypeData(consumeTypeStat);
                that.queryTypeData();

                /* 消费能力 */
                //var consumeAbilityStat = {}
                that.queryAbilityData();

                // 消费结构-性别
                // let consumeGenderStat = {'0': 540, '1': 2201};
                // that.buildConsumeGenderData(consumeGenderStat);
                that.queryConsumeGenderData();

                // 消费结构-年龄
                // let consumeAgeStat = {
                //   0:10000,
                // 1:10000,
                // 2:10000,
                // 3:10000,
                // 4:10000,
                // 5:10000,
                // 6:10000,
                // 7:10000,
                // 8:10000,
                // 9:10000,
                // 10:10000,
                // 11:10000,
                // }
                // that.buildConsumeAgeData(consumeAgeStat);
                that.queryConsumeAgeData();

                // 消费结构-城市
                // let consumeCityStat={
                // 	"1": 3145,
                // 	"2": 74515,
                // 	"3": 157210,
                // 	"4": 56442,
                // 	"5": 64784,
                // 	"6": 73897
                // };
                // that.buildConsumeCityData(consumeCityStat);
                that.queryConsumeCityData();
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../../assets/css/echartsBase';
</style>
