<template>
  <div id="main" class="">
    <div class="page-title chart-page">
      <div>大盘总览</div>
    </div>
    <div class="echart-group">
      <div class="echart-h-wrapper">
        <!-- 年龄占比 -->
        <div class="cell one-third echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">年龄</div>
              <div class="sub-title">单位:万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>截至昨天，各年龄段用户占比</span>
            </div>
          </h5>
          <div id="nlzbEchart" class="echart-container"></div>
          <block-nodata v-show="nlzbObj.objData.noData"></block-nodata>
          <block-loading v-show="nlzbObj.objData.loading"></block-loading>
          <block-update v-show="nlzbObj.objData.update" @update="queryAgeData"></block-update>
        </div>
        <!-- 性别比例 -->
        <div class="cell one-third echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">性别</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>截止昨天，男女用户占比</span>
            </div>
          </h5>
          <div id="gender" class="echart-container">
            <div class="gender-wrapper" v-show="!xbblObj.objData.loading && !xbblObj.objData.update && !xbblObj.objData.noData">
              <div class="gender-bar male-bar" :style="{width: xbblObj.objData.nanVal[0] + '%'}">
                <div class="male-icon"></div>
                <p>男</p>
                <h3 class="male-ratio">{{xbblObj.objData.nanVal[0]}}%</h3>

              </div>
              <div class="gender-bar female-bar" :style="{width: xbblObj.objData.nvVal[0] + '%'}">
                <div class="female-icon"></div>
                <p>女</p>
                <h3 class="female-ratio">{{xbblObj.objData.nvVal[0]}}%</h3>
              </div>
            </div>
          </div>
          <block-nodata v-show="xbblObj.objData.noData"></block-nodata>
          <block-loading v-show="xbblObj.objData.loading"></block-loading>
          <block-update v-show="xbblObj.objData.update" @update="queryGenderData"></block-update>
        </div>
        <!-- 学历比例 -->
        <div class="cell one-third echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">学历</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>截止昨天，各学历用户占比</span>
            </div>
          </h5>
          <div id="xlblEchart" class="echart-container"></div>
          <block-developing v-show="xlblObj.objData.inDevelop"></block-developing>
          <block-nodata v-show="xlblObj.objData.noData"></block-nodata>
          <block-loading v-show="xlblObj.objData.loading"></block-loading>
          <block-update v-show="xlblObj.objData.update" @update="queryEducationData"></block-update>
        </div>
      </div>
    </div>
    <div class="echart-group">
      <!--			<div class="group-title">-->
      <!--				<span class="title-text">地域信息</span>-->
      <!--			</div>-->
      <div class="echart-h-wrapper high">
        <!-- 省份分布 -->
        <div class="cell one-half echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">省份分布</div>
              <div class="sub-title">单位:万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>截止昨天，用户量top10省份</span>
            </div>
          </h5>
          <div id="sffbEchart" class="echart-container high"></div>
          <block-nodata v-show="sffbObj.objData.noData"></block-nodata>
          <block-loading v-show="sffbObj.objData.loading"></block-loading>
          <block-update v-show="sffbObj.objData.update" @update="queryProvincesData"></block-update>
        </div>
        <!-- 城市分布 -->
        <div class="cell one-half echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">城市分布</div>
              <div class="sub-title">单位:万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>截止昨天，城市分级用户量占比</span>
            </div>
          </h5>
          <div id="csfbEchart" class="echart-container high"></div>
          <block-nodata v-show="csfbObj.objData.noData"></block-nodata>
          <block-loading v-show="csfbObj.objData.loading"></block-loading>
          <block-update v-show="csfbObj.objData.update" @update="queryCityData"></block-update>
        </div>
      </div>
    </div>
    <div class="echart-group">
      <!--			<div class="group-title">-->
      <!--				<span class="title-text">终端信息</span>-->
      <!--			</div>-->
      <div class="echart-h-wrapper">
        <!-- 操作系统 -->
        <div class="cell one-half echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">操作系统</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>截止昨天，主流操作系统用户量占比</span>
            </div>
          </h5>
          <div id="czxtEchart" class="bgd echart-container"></div>
          <block-nodata v-show="czxtObj.objData.noData"></block-nodata>
          <block-loading v-show="czxtObj.objData.loading"></block-loading>
          <block-update v-show="czxtObj.objData.update" @update="queryOperationData"></block-update>
        </div>
        <!-- 终端产品 -->
        <div class="cell one-half echart-h-box relative">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">终端品牌</div>
              <div class="sub-title">单位:万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>截止昨天，用户量TOP10终端品牌</span>
            </div>
          </h5>
          <div id="zdcpEchart" class="echart-container"></div>
          <block-nodata v-show="zdcpObj.objData.noData"></block-nodata>
          <block-loading v-show="zdcpObj.objData.loading"></block-loading>
          <block-update v-show="zdcpObj.objData.update" @update="queryTerminalData"></block-update>
        </div>
      </div>
    </div>
    <div class="echart-group">
      <div class="echart-h-wrapper">
        <!-- 分类占比 -->
        <div class="cell one-half echart-h-box relative pdlr">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">会员信息</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>截止昨天，会员类型占比</span>
            </div>
          </h5>
          <div id="flzbEchart" class="echart-container"></div>
          <block-nodata v-show="flzbObj.objData.noData"></block-nodata>
          <block-loading v-show="flzbObj.objData.loading"></block-loading>
          <block-update v-show="flzbObj.objData.update" @update="queryMembershipTypeData"></block-update>
        </div>
        <!-- 增长趋势 -->
        <div class="cell one-half echart-h-box relative pdr">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">会员增长趋势</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>自然年内会员增长趋势</span>
            </div>
          </h5>
          <div id="zzqsEchart" class="echart-container"></div>
          <block-developing v-show="zzqsObj.objData.inDevelop"></block-developing>
          <block-nodata v-show="zzqsObj.objData.noData"></block-nodata>
          <block-loading v-show="zzqsObj.objData.loading"></block-loading>
          <block-update v-show="zzqsObj.objData.update" @update="queryMembershipGrowthData"></block-update>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import echartsLiquidfill from 'echarts-liquidfill'
    import {MyMixin} from '../../assets/js/echart/mixins.js'
    export default {
        name: "overView",
        mixins: [MyMixin],
        mounted: function (event) {
            var that = this;
            that.init();
        },
        methods: {
            /*初始化数据*/
            async init() {
                var that = this;
                console.log('overview init')
                /* 自然信息 */
                // let ageStat = {
                //     0:10000,
                // 	1:10000,
                // 	2:10000,
                // 	3:10000,
                // 	4:10000,
                // 	5:10000,
                // 	6:10000,
                // 	7:10000,
                // 	8:10000,
                // 	9:10000,
                // 	10:10000,
                // 	11:10000,
                // }
                // setTimeout(function(){
                // 	that.buildAgeData(ageStat);
                // },500)
                that.queryAgeData();

                // let genderStat = {'0': 1000, '1': 2201};
                // that.buildGenderData(genderStat);
                that.queryGenderData();


                // let eduStat = {
                //     "0": 90000,
                //     "1": 102455,
                //     "2": 784615,
                //     "3": 12547,
                //     "4": 11214,
                //     "5": 5784,
                // }
                // that.buildEducationData(eduStat);
                // that.queryEducationData();  //(开发中)


                /*地域信息*/
                // var provStat = {
                //     "江苏": 19000,
                // 	  "上海": 40000,
                // 	  "深圳": 10000,
                //     "广州": 19000,
                //     "湖南": 4000,
                //     "山东": 10000,
                //     "北京": 19000,
                //     "浙江": 40000,
                //     "四川": 10000,
                //     "安徽": 5000,
                // }
                // that.buildProvData(provStat);
                that.queryProvincesData();

                // 城市分布
                // let areaStat={
                //  "1": 3145,
                // 	"2": 74515,
                // 	"3": 157210,
                // 	"4": 56442,
                // 	"5": 64784,
                // 	"6": 73897
                // };
                // that.buildCityData(areaStat);
                that.queryCityData();


                /*终端信息*/
                // let operSysStat = {
                //     "AD": 187527,
                //     "iOS": 6745578,
                // 	"-998": 45457
                // }
                // that.buildOsData(operSysStat);
                that.queryOperationData();


                // let terminalBrandStat = {
                //     "oppo": 150000,
                // 	"vivo": 90000,
                // 	'小米': 220000,
                // 	'三星': 400000,
                // 	'苹果': 1000000,
                // 	"test1": 150000,
                // 	"test2": 90000,
                // 	'test3': 220000,
                // 	'test4': 400000,
                // 	'test5': 1000000
                // };
                // that.buildPhoneData(terminalBrandStat);
                that.queryTerminalData();

                /*会员信息*/
                // let memberCatergoryStat = {
                // 	"5": 187741, //体验会员
                // 	"6": 542745,
                // 	"7": 422725,
                // 	"8": 447272,
                // 	"9": 247452,
                // 	"10": 227457,
                // 	"11": 232778,
                // };
                // setTimeout(function(){
                // 	that.buildMemberTypeData(memberCatergoryStat);
                // },0)
                that.queryMembershipTypeData();

                // let memberIncreaseStat = {
                //     '1': 64845615,
                //     '2': 45237878,
                //     '3': 42452788,
                //     '4': 72578587,
                //     '5': 74587241,
                //     '6': 41757864,
                //     '7': 63842045,
                // }
                // that.buildMemberIncreaseData(memberIncreaseStat);
                // that.queryMembershipGrowthData(); //(开发中)
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../../assets/css/echartsBase';
.block-loading svg{
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
  path{
    fill: #0696ff;
  }
  rect{
    fill: #0696ff;
  }
}
</style>
