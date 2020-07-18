<template>
  <div id="main" class="">
    <div class="page-title bgd pdr chart-page" style="margin-bottom: 8px;">
      <div>热播排行</div>
      <div class="font-size0 pdt24">
        <button class="hot-button" :class="{'hot-button-blue': isMember === '1'}" @click="buttonClick('1')">会员</button>
        <button class="hot-button" :class="{'hot-button-blue': isMember === '0'}" @click="buttonClick('0')">非会员</button>
      </div>
    </div>

    <div class="echart-group">
      <!--			<div class="group-title">-->
      <!--				<span class="title-text">热门导演演员</span>-->
      <!--			</div>-->
      <div class="echart-h-wrapper">
        <!-- 导演 -->
        <div class="cell one-half bgd echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">导演</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>近30天作品播放次数TOP10</span>
            </div>
          </h5>
          <div id="dyEchart" class="echart-container">
            <!--<svg id="directorSvg"></svg>-->

          </div>
          <block-nodata v-show="directorObj.noData"></block-nodata>
          <block-loading v-show="directorObj.loading"></block-loading>
          <block-update v-show="directorObj.update" @update="queryDirectorData"></block-update>
        </div>
        <!-- 演员 -->
        <div class="cell one-half bgd echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">演员</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>近30天作品播放次数TOP10</span>
            </div>
          </h5>
          <div id="yyEchart" class="echart-container">
            <!--<svg id="actorSvg"></svg>-->
          </div>
          <block-nodata v-show="actorObj.noData"></block-nodata>
          <block-loading v-show="actorObj.loading"></block-loading>
          <block-update v-show="actorObj.update" @update="queryActorData"></block-update>
        </div>
      </div>
    </div>
    <div class="echart-group">
      <!--			<div class="group-title">-->
      <!--				<span class="title-text">热门影视</span>-->
      <!--			</div>-->
      <div class="echart-h-wrapper">
        <!-- 电影 -->
        <div class="cell one-half bgd echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">电影</div>
              <div class="sub-title">单位：万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>近30天播放次数TOP10</span>
            </div>
          </h5>
          <div id="ysdyEchart" class="echart-container"></div>
          <block-nodata v-show="movieObj.noData"></block-nodata>
          <block-loading v-show="movieObj.loading"></block-loading>
          <block-update v-show="movieObj.update" @update="queryMovieData"></block-update>
        </div>
        <!-- 电视剧-->
        <div class="cell one-half bgd echart-h-box">
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">电视剧</div>
              <div class="sub-title">单位：百万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>近30天播放次数TOP10</span>
            </div>
          </h5>
          <div id="ysdsEchart" class="echart-container"></div>
          <block-nodata v-show="TVPlayObj.noData"></block-nodata>
          <block-loading v-show="TVPlayObj.loading"></block-loading>
          <block-update v-show="TVPlayObj.update" @update="queryTVPlayObjData"></block-update>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {MyMixin} from '../../assets/js/echart/mixins.js'
    import {getHotDirectorData,getHotActorData,getHotMoviesData,getHotTVData} from "../../assets/js/wholeKanbanApi";

    export default {
        name: "hotTop",
        mixins: [MyMixin],
        data(){
          return {
              isMember: "1",
              dyyyValueList:[[50,50],[21,25],[76,66],[37,76],[89,88],[56,32],[85,42],[10,60],[30,50],[70,40]],
              dyyySymbolSizeList:[100,80,80,80,60,60,60,40,40,40],
              dyyyColorList:['#F04864','#1890FF','#1890FF','#1890FF','#C2E4FD','#C2E4FD','#C2E4FD','#5DB6F9','#5DB6F9','#5DB6F9'],
              ddyyLabelColor: window.top.theme === 'lightTheme' ? '#4d4d4d' : '#e6e6e6',
              // 导演
              directorObj : {
                  //id: 'directorSvg',
                  id: 'dyEchart',
                  titleText: '导演',
                  noData: false, // 无数据
                  loading: false,
                  update: false,
                  dataList: []
              },
              // 演员
              actorObj : {
                  //id: 'actorSvg',
                  id: 'yyEchart',
                  titleText: '演员',
                  noData: false, // 无数据
                  loading: false,
                  update: false,
                  dataList: []
              },
              // 电影
              movieObj : {
                  id : 'ysdyEchart',
                  titleText : '电影',
                  subtext:'单位:万',
                  noData: false, // 无数据
                  loading: false,
                  update: false,
                  subValue:10000,
                  labelUnit: '',
                  yAxisData : [],
                  xAxisData : []
              },
              // 电视剧
              TVPlayObj : {
                  id : 'ysdsEchart',
                  titleText : '电视剧',
                  subtext:'单位:百万',
                  noData: false, // 无数据
                  loading: false,
                  update: false,
                  subValue:1000000,
                  labelUnit: '',
                  yAxisData : [],
                  xAxisData : []
              }
          }
        },
        mounted : function(event) {
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
        methods : {
            /*初始化数据*/
            init : function() {
                var that = this;
                var param = {
                    isMember: that.isMember
                };

                // let hotDirectorStat = [
                //     {
                //         "name": "Jackson",
                //         "class_name": "导演",
                //         "play_nums": "4842",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Tome",
                //         "class_name": "导演",
                //         "play_nums": "5842",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Tome",
                //         "class_name": "导演",
                //         "play_nums": "3689",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Tome",
                //         "class_name": "导演",
                //         "play_nums": "2487",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Tome",
                //         "class_name": "导演",
                //         "play_nums": "1450",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Jackson",
                //         "class_name": "导演",
                //         "play_nums": "4842",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Tome",
                //         "class_name": "导演",
                //         "play_nums": "5842",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Tome",
                //         "class_name": "导演",
                //         "play_nums": "3689",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Tome",
                //         "class_name": "导演",
                //         "play_nums": "2487",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Tome",
                //         "class_name": "导演",
                //         "play_nums": "1450",
                //         "is_member": "1"
                //     },
                //
                // ]
                // that.buildDirectorData(hotDirectorStat);
                that.queryDirectorData(param);

                // let hotActorStat=[
                //     {
                //         "name": "Tome",
                //         "class_name": "主演",
                //         "play_nums": "3100293322",
                //         "is_member": "1"
                //     }
                // ];
                // that.buildActorData(hotActorStat);
                that.queryActorData(param);

                // let hotMovieStat=[
                //     {
                //         "name": "Tome",
                //         "class_name": "电影",
                //         "play_nums": "41490030",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Tome",
                //         "class_name": "电影",
                //         "play_nums": "41490030",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Jerry",
                //         "class_name": "电影",
                //         "play_nums": "41490030",
                //         "is_member": "1"
                //     }
                // ]
                // that.buildMovieData(hotMovieStat);
                that.queryMovieData(param);

                // let hotTvStat=[
                //     {
                //         "name": "Tome",
                //         "class_name": "电视剧",
                //         "play_nums": "300678926",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Tome",
                //         "class_name": "电视剧",
                //         "play_nums": "300678926",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Tome",
                //         "class_name": "电视剧",
                //         "play_nums": "300678926",
                //         "is_member": "1"
                //     },
                //     {
                //         "name": "Tome",
                //         "class_name": "电视剧",
                //         "play_nums": "300678926",
                //         "is_member": "1"
                //     }
                // ]
                // that.buildTvData(hotTvStat);
                that.queryTVPlayObjData(param);
            },
            /* 请求热门导演数据 */
            queryDirectorData: function(params) {
                let that = this;
                that.clearEchart(that.directorObj.id);
                // 如果是失败刷新 隐藏update
                if(that.directorObj.update) {
                    that.directorObj.update = false;
                }
                // 显示加载中
                that.directorObj.loading = true;
                console.log("请求热门导演数据");

                // 请求
                getHotDirectorData(params).then(res => {
                    let resp = res.data;
                    if ('0' == resp.retCode) {
                        that.directorObj.loading = false; // 隐藏加载中
                        var resultData = resp.resultData;
                        if($.isEmptyObject(resultData) || $.isEmptyObject(resultData.hotDirectorStat)){
                            that.directorObj.noData = true;
                            return;
                        }
                        that.buildDirectorData(resultData.hotDirectorStat);
                    }else{
                        that.directorObj.loading = false; // 隐藏加载中
                        that.directorObj.update = true;  // 显示加载失败
                    }
                })
            },
            /* 请求热门演员数据 */
            queryActorData: function(params) {
                let that = this;
                that.clearEchart(that.actorObj.id);
                // 如果是失败刷新 隐藏update
                if(that.actorObj.update) {
                    that.actorObj.update = false;
                }
                // 显示加载中
                that.actorObj.loading = true;
                // 请求
                getHotActorData(params).then(res => {
                    let resp =  res.data;
                    if ('0' == resp.retCode) {
                        that.actorObj.loading = false; // 隐藏加载中
                        var resultData = resp.resultData;
                        if($.isEmptyObject(resultData) || $.isEmptyObject(resultData.hotActorStat)){
                            that.actorObj.noData = true;
                            return;
                        }
                        that.buildActorData(resultData.hotActorStat);
                    }else{
                        that.actorObj.loading = false; // 隐藏加载中
                        that.actorObj.update = true;  // 显示加载失败
                    }
                })
            },
            /* 请求热门电影数据 */
            queryMovieData: function(params) {
                let that = this;
                that.clearEchart(that.movieObj.id);
                // 如果是失败刷新 隐藏update
                if(that.movieObj.update) {
                    that.movieObj.update = false;
                }
                // 显示加载中
                that.movieObj.loading = true;
                // 请求

                getHotMoviesData(params).then(res => {
                    let resp = res.data;
                    if ('0' == resp.retCode) {
                        that.movieObj.loading = false; // 隐藏加载中
                        var resultData = resp.resultData;
                        if($.isEmptyObject(resultData) || $.isEmptyObject(resultData.hotMovieStat)){
                            that.movieObj.noData = true;
                            return;
                        }
                        that.buildMovieData(resultData.hotMovieStat);
                    }else{
                        that.movieObj.loading = false; // 隐藏加载中
                        that.movieObj.update = true;  // 显示加载失败
                    }
                })
            },
            /* 请求热门电视剧数据 */
            queryTVPlayObjData: function(params) {
                let that = this;
                that.clearEchart(that.TVPlayObj.id);
                // 如果是失败刷新 隐藏update
                if(that.TVPlayObj.update) {
                    that.TVPlayObj.update = false;
                }
                // 显示加载中
                that.TVPlayObj.loading = true;
                // 请求
                getHotTVData(params).then(res => {
                    let resp = res.data;
                    if ('0' == resp.retCode) {
                        that.TVPlayObj.loading = false; // 隐藏加载中
                        var resultData = resp.resultData;
                        if($.isEmptyObject(resultData) || $.isEmptyObject(resultData.hotTvStat)){
                            that.TVPlayObj.noData = true;
                            return;
                        }
                        that.buildTvData(resultData.hotTvStat);
                    }else{
                        that.TVPlayObj.loading = false; // 隐藏加载中
                        that.TVPlayObj.update = true;  // 显示加载失败
                    }
                })
            },

            /*构建导演数据*/
            buildDirectorData: function(hotDirectorStat){
                console.log("methods--->buildspblData--->hotDirectorStat:",hotDirectorStat);
                var that = this;
                if(hotDirectorStat){
                    var totalCount = 0;
                    for(var i in hotDirectorStat){
                        var obj = hotDirectorStat[i];
                        totalCount += Number(obj.play_nums);
                    }
                    var dataList = new Array();
                    for(var i in hotDirectorStat){
                        var obj = hotDirectorStat[i];
                        var data = new Object();
                        var ratio = that.loadRatio(obj.play_nums,totalCount,true,2);
                        data.name = obj.name;
                        data.data = ratio + '%';
                        data.value = that.dyyyValueList[i];
                        data.symbolSize = that.dyyySymbolSizeList[i];
                        data.itemStyle = new Object({color:that.dyyyColorList[i]});
                        dataList.push(data);
                    }
                    that.directorObj.dataList = dataList.reverse();
                    console.log(that.directorObj.dataList)
                }
                //console.log("methods--->buildspblData--->objData:",that.directorObj);
                that.dyyyOption(that.directorObj)
            },
            /*构建演员数据*/
            buildActorData: function(hotActorStat){
                console.log("methods--->buildActorData--->hotActorStat:",hotActorStat);
                var that = this;
                if(hotActorStat){
                    var totalCount = 0;
                    for(var i in hotActorStat){
                        var obj = hotActorStat[i];
                        totalCount += Number(obj.play_nums);
                    }
                    var dataList = new Array();
                    for(var i in hotActorStat){
                        var obj = hotActorStat[i];
                        var data = new Object();
                        var ratio = that.loadRatio(obj.play_nums,totalCount,true,2);
                        data.name = obj.name;
                        data.data = ratio + '%';
                        data.value = that.dyyyValueList[i];
                        data.symbolSize = that.dyyySymbolSizeList[i];
                        data.itemStyle = new Object({color:that.dyyyColorList[i]});
                        dataList.push(data);
                    }
                    that.actorObj.dataList = dataList.reverse();
                }
                console.log("methods--->buildActorData--->objData:",that.actorObj);
                setTimeout(function(){
                    that.dyyyOption(that.actorObj);
                },500)
                // that.dyyyOption(that.actorObj);
            },
            /*构建电影数据*/
            buildMovieData: function(hotMovieStat){
                console.log("methods--->buildMovieData--->hotMovieStat:",hotMovieStat);
                var that = this;
                if(hotMovieStat){
                    var xAxisData = new Array();
                    var yAxisData = new Array();
                    for(var i in hotMovieStat){
                        var obj = hotMovieStat[i];
                        var name = obj.name;
                        var value = that.loadRatio(obj.play_nums,that.movieObj.subValue,false,1);
                        xAxisData.push(value);
                        yAxisData.push(name);
                    };
                    xAxisData.reverse();
                    yAxisData.reverse();
                    that.movieObj.xAxisData = xAxisData;
                    that.movieObj.yAxisData = yAxisData;
                }
                console.log("methods--->buildMovieData--->objData:",that.movieObj);
                setTimeout(function(){
                    that.transverseBarOption(that.movieObj);
                },500)
                // that.transverseBarOption(that.movieObj);
            },
            /*构建电视剧数据*/
            buildTvData: function(hotTvStat){
                console.log("methods--->buildTvData--->hotTvStat:",hotTvStat);
                var that = this;
                if(hotTvStat){
                    var xAxisData = new Array();
                    var yAxisData = new Array();
                    for(var i in hotTvStat){
                        var obj = hotTvStat[i];
                        var name = obj.name;
                        var value = new Number(obj.play_nums);
                        var _value = that.loadRatio(value,that.TVPlayObj.subValue,false,1);
                        xAxisData.push(_value);
                        yAxisData.push(name);
                    };
                    xAxisData.reverse();
                    yAxisData.reverse();
                    that.TVPlayObj.xAxisData = xAxisData;
                    that.TVPlayObj.yAxisData = yAxisData;
                }
                console.log("methods--->buildTvData--->objData:",that.TVPlayObj);
                setTimeout(function(){
                    that.transverseBarOption(that.TVPlayObj);
                },500)
                // that.transverseBarOption(that.TVPlayObj);
            },

            /*
             * 导演演员Echart
             */
            dyyyOption: function(obj) {
                console.log("obj.id", obj.id);
                console.log("obj.dataList", obj.dataList);
                var chart = this.echarts.init(document.getElementById(obj.id));
                var option = {
                    tooltip: {
                        backgroundColor: '#ffffff',
                        padding: 0,
                        formatter: function (obj) {
                            return '' +
                                '<div class="tooltip-wrapper">' +
                                // '	<div class="tooltip-title">' +
                                // '		<span class="tooltip-title-text">'+obj.name+'</span>' +
                                // '	</div>' +
                                '	<div class="tooltip-content">' +
                                '		<div class="tooltip-content-item">' +
                                '			<span class="item-name">'+ obj.name+'：</span>' +
                                '			<span class="item-value">'+obj.data.data+'</span>' +
                                '		</div>' +
                                '	</div>' +
                                '</div>' +
                                ''
                        }
                    },
                    xAxis : [ {
                        show : false,
                        type : 'category'
                    } ],
                    yAxis : [ {
                        show : false,
                        type : 'value'
                    } ],
                    series : [ {
                        type : 'scatter',
                        symbol : 'circle',
                        symbolSize : 120,
                        label : {
                            normal : {
                                show : true,
                                formatter : '{b}',
                                color : this.ddyyLabelColor,
                                textStyle : {
                                    fontSize : '16'
                                }
                            },
                        },
                        itemStyle : {
                            normal : {
                                color : '#00acea'
                            }
                        },
                        data : obj.dataList
                    }]
                };
                chart.setOption(option);
                chart.resize();
            },
        }
    }
</script>

<style lang="less" scoped>
@import '../../assets/css/echartsBase';
</style>
