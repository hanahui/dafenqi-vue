<template>
  <div id="main" class="">
    <div class="page-title chart-page" style="margin-bottom: 8px;">
      <div>播放偏好</div>
      <div class="font-size0 pdt24">
        <button class="hot-button" :class="{'hot-button-blue': isMember === '1'}" @click="buttonClick('1')">会员</button>
        <button class="hot-button" :class="{'hot-button-blue': isMember === '0'}" @click="buttonClick('0')">非会员</button>
      </div>
    </div>
    <div class="echart-group">
      <!--<div class="group-title">-->
      <!--<span class="title-text">类型偏好行为</span>-->
      <!--</div>-->
      <div class="echart-h-wrapper">
        <!-- 视频分类 -->
        <div class="cell bgd one-third echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">视频比例</div>
              <div class="sub-title">单位：百万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>根据近30天播放次数和视频属性统计</span>
            </div>
          </h5>
          <div id="spblEchart" class="echart-container"></div>
          <block-nodata v-show="spblObj.objData.noData"></block-nodata>
          <block-loading v-show="spblObj.objData.loading"></block-loading>
          <block-update v-show="spblObj.objData.update" @update="queryVideoData"></block-update>
        </div>
        <div class="cell bgd two-thirds echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">播放次数</div>
              <div class="sub-title">单位：百万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>用户总播放和正片播放次数</span>
            </div>
          </h5>
          <div id="spbfEchart" class="echart-container"></div>
          <block-nodata v-show="spbfObj.objData.noData"></block-nodata>
          <block-loading v-show="spbfObj.objData.loading"></block-loading>
          <block-update v-show="spbfObj.objData.update" @update="queryPlayData"></block-update>
        </div>
      </div>
    </div>
    <div class="echart-group relative">
      <!--<div class="group-title">-->
      <!--<span class="title-text">一级分类</span>-->
      <!--</div>-->
      <div class="echart-switch absolute inline-flex">
					<span class="switch-item"
                :class="{active: echartSwitch == 0}"
                @click="echartSwitch = 0">全部</span>
        <span class="switch-item"
              :class="{active: echartSwitch == 1}"
              @click="echartSwitch = 1">性别</span>
        <span class="switch-item"
              :class="{active: echartSwitch == 2}"
              @click="echartSwitch = 2">城市</span>
      </div>
      <div class="echart-h-wrapper absolute" :class="{visible: echartSwitch == 0}">
        <!-- 一级分类 -->
        <div class="cell bgd w24 echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">播放类型</div>
              <div class="sub-title">单位：百万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>根据近30天播放次数和视频属性统计</span>
            </div>
          </h5>
          <div id="yjflEchart" class="echart-container"></div>
          <block-nodata v-show="yjflObj.objData.noData"></block-nodata>
          <block-loading v-show="yjflObj.objData.loading"></block-loading>
          <block-update v-show="yjflObj.objData.update" @update="queryCategoryData"></block-update>
        </div>
      </div>

      <!-- 性别偏好-->
      <div class="echart-h-wrapper absolute" :class="{visible: echartSwitch == 1}">
        <div class="cell bgd w24 echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">播放类型</div>
              <div class="sub-title">单位：百万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>根据近30天播放次数、内容一级分类和性别特征统计</span>
            </div>
          </h5>
          <div id="xbzsEchart" class="echart-container"></div>
          <block-nodata v-show="xbzsObj.objData.noData"></block-nodata>
          <block-loading v-show="xbzsObj.objData.loading"></block-loading>
          <block-update v-show="xbzsObj.objData.update" @update="queryGenderPreferenceData"></block-update>
        </div>
      </div>

      <!-- 城市偏好-->
      <div class="echart-h-wrapper absolute" :class="{visible: echartSwitch == 2}">
        <div class="cell bgd w24 echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">播放类型</div>
              <div class="sub-title">单位：百万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>根据近30天播放次数、内容一级分类和城市级别统计</span>
            </div>
          </h5>
          <div id="cszsEchart" class="echart-container"></div>
          <block-nodata v-show="cszsObj.objData.noData"></block-nodata>
          <block-loading v-show="cszsObj.objData.loading"></block-loading>
          <block-update v-show="cszsObj.objData.update" @update="queryCityPreferenceData"></block-update>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {MyMixin} from '../../assets/js/echart/mixins.js'
    export default {
        name: "playPreference",
        mixins: [MyMixin],
        data(){
            return  {
                isMember:"1",//是否会员
                echartSwitch: 0, // 播放类型显示标识(0:全部 1:性别 2:城市)
            }
        },
        mounted: function (event) {
            var that = this;
            that.init();
        },
        watch: {
            isMember: function(val, oldVal){
                console.log("watch--->isMember--->val:",val,",oldVal:",oldVal);
                var that = this;
                that.init();
            }
        },
        methods: {
            /*初始化数据*/
            init: function () {
                var that = this;
                var param = {
                    isMember: that.isMember
                };

                // 测试视频类型
                // let videoTypeStat={
                //     "last_month_long_video_vv": 1160460434,
                // "last_month_short_video_vv": 1160460434
                // };
                // that.buildSpblData(videoTypeStat);
                that.queryVideoData(param);

                // 测试播放次数
                // let playTimesStat = {
                //    "last_month_cv": 480000000,
                //    "last_12month_vv": 4800000000,
                //    "last_month_vv": 480000000,
                //    "last_12month_cv": 120000000,
                //    "last_3month_cv": 480000000,
                //    "last_3month_vv": 960000000,
                //    "last_6month_vv": 120000000,
                //    "last_6month_cv": 720000000
                // }
                // that.buildVvcvData(playTimesStat);
                that.queryPlayData(param);

                // 测试一级分类
                // let oneClassStat = {
                //    "last_month_sport_vv": 40460434,
                // 	"last_month_variety_vv": 40460434,
                // 	"last_month_tv_vv": 40460434,
                // 	"last_month_comic_vv": 739943400,
                // 	"last_month_education_vv": 739943400,
                // 	"last_month_record_vv": 739943400,
                // 	"last_month_music_vv": 40460434,
                // 	"last_month_film_vv": 40460434,
                // 	"last_month_art_vv": 739943400,
                // 	"last_month_child_vv": 40460434
                // }
                // that.buildYjflData(oneClassStat);
                that.queryCategoryData(param);

                // 测试性别偏好
                // let sexLikeStat = {
                //    "0": {
                //        "last_month_sport_vv": 14450155,
                //        "last_month_variety_vv": 14450155,
                //        "last_month_tv_vv": 14450155,
                //        "last_month_comic_vv": 264265500,
                //        "last_month_education_vv": 264265500,
                //        "last_month_record_vv": 264265500,
                //        "last_month_music_vv": 14450155,
                //        "last_month_film_vv": 14450155,
                //        "last_month_art_vv": 264265500,
                //        "last_month_child_vv": 14450155
                //    },
                //    "1": {
                //        "last_month_sport_vv": 26010279,
                //        "last_month_variety_vv": 26010279,
                //        "last_month_tv_vv": 26010279,
                //        "last_month_comic_vv": 475677900,
                //        "last_month_education_vv": 475677900,
                //        "last_month_record_vv": 475677900,
                //        "last_month_music_vv": 26010279,
                //        "last_month_film_vv": 26010279,
                //        "last_month_art_vv": 475677900,
                //        "last_month_child_vv": 26010279
                //    }
                // }
                // that.buildSexData(sexLikeStat);
                that.queryGenderPreferenceData(param);

                // 测试城市偏好
                // let cityLikeStat = {
                //    "1": {
                //        "last_month_sport_vv": 8670093,
                //        "last_month_variety_vv": 8670093,
                //        "last_month_tv_vv": 8670093,
                //        "last_month_comic_vv": 158559300,
                //        "last_month_education_vv": 158559300,
                //        "last_month_record_vv": 158559300,
                //        "last_month_music_vv": 8670093,
                //        "last_month_film_vv": 8670093,
                //        "last_month_art_vv": 158559300,
                //        "last_month_child_vv": 8670093
                //    },
                //    "2": {
                //        "last_month_sport_vv": 2890031,
                //        "last_month_variety_vv": 2890031,
                //        "last_month_tv_vv": 2890031,
                //        "last_month_comic_vv": 52853100,
                //        "last_month_education_vv": 52853100,
                //        "last_month_record_vv": 52853100,
                //        "last_month_music_vv": 2890031,
                //        "last_month_film_vv": 2890031,
                //        "last_month_art_vv": 52853100,
                //        "last_month_child_vv": 2890031
                //    },
                //    "3": {
                //        "last_month_sport_vv": 5780062,
                //        "last_month_variety_vv": 5780062,
                //        "last_month_tv_vv": 5780062,
                //        "last_month_comic_vv": 105706200,
                //        "last_month_education_vv": 105706200,
                //        "last_month_record_vv": 105706200,
                //        "last_month_music_vv": 5780062,
                //        "last_month_film_vv": 5780062,
                //        "last_month_art_vv": 105706200,
                //        "last_month_child_vv": 5780062
                //    },
                //    "4": {
                //        "last_month_sport_vv": 23120248,
                //        "last_month_variety_vv": 23120248,
                //        "last_month_tv_vv": 23120248,
                //        "last_month_comic_vv": 422824800,
                //        "last_month_education_vv": 422824800,
                //        "last_month_record_vv": 422824800,
                //        "last_month_music_vv": 23120248,
                //        "last_month_film_vv": 23120248,
                //        "last_month_art_vv": 422824800,
                //        "last_month_child_vv": 23120248
                //    }
                // }
                // that.buildCityPreferenceData(cityLikeStat);
                that.queryCityPreferenceData(param);
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../../assets/css/echartsBase';
</style>
