<template>
  <div id="main" class="main">
    <div class="page-title bgd">
      <div>系统日志</div>
    </div>
    <div class="font-size0" style="padding-bottom: 8px;">
      <button class="hot-button" :class="{'hot-button-blue': chartType == 'user'}" @click="chartType = 'user'">用户量</button>
      <button class="hot-button" :class="{'hot-button-blue': chartType == 'visit'}" @click="chartType = 'visit'">访问量</button>
    </div>
    <div class="page-content">
      <div class="content-container">
        <div class="cell content-right bgd two-thirds relative">
          <h5 class="chart-title">
            <div class="title-text">
              <!--<div class="main-title">省份分布</div>-->
              <div class="sub-title">单位:{{chartObj.unit}}</div>
            </div>
            <!--<div class="title-tips">-->
            <!--<span class="tips-text">截止昨天，用户量top10省份</span>-->
            <!--</div>-->
          </h5>
          <div id="bar" style="height: 500px;" class="echart-container bgd-light"></div>
        </div>
        <div class="cell content-left one-third pdl">
          <my-table :table-data="tableData" :cols="userCols" v-show="chartType=='user'">
            <template slot="cont" slot-scope="{record}">{{formatNum(record.cont)}}</template>
            <template slot="contRate" slot-scope="{record}">{{record.contRate}}%</template>
          </my-table>
          <my-table :table-data="tableData" :cols="visitCols"  v-show="chartType=='visit'">
            <template slot="cont" slot-scope="{record}">{{formatNum(record.cont)}}</template>
            <template slot="contRate" slot-scope="{record}">{{record.contRate}}%</template>
          </my-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import CustomTable from '../customTable'
    import {getSystemLogData} from '../../assets/js/reportCenterApi'
    import {MyMixin} from "../../assets/js/echart/mixins";
    export default {
        name: "systemLog",
        mixins: [MyMixin],
        components: {
            'my-table': CustomTable
        },
        data: function(){
            return {
                chartType: 'user',
                userCols: [
                {title: '时间', key: 'operTime', tooltip: true, width: '50%'},
                {title: '用户量(人)', key: 'contUser', width: '50%',align:'center'},
            ],
                visitCols: [
                    {title: '时间', key: 'operTime', tooltip: true, width: '50%'},
                    {title: '访问量(次)', key: 'contVisit', width: '50%',align:'center'},

                ],
                tableData: [],
                chartData: [],
                replaceData:[
                    {content:'01',repContent:'1月'},
                    {content:'02',repContent:'2月'},
                    {content:'03',repContent:'3月'},
                    {content:'04',repContent:'4月'},
                    {content:'05',repContent:'5月'},
                    {content:'06',repContent:'6月'},
                    {content:'07',repContent:'7月'},
                    {content:'08',repContent:'8月'},
                    {content:'09',repContent:'9月'},
                    {content:'10',repContent:'10月'},
                    {content:'11',repContent:'11月'},
                    {content:'12',repContent:'12月'}
                ],
                chartObj: {
                    id:'bar',
                    colorData:['#0696FF'],
                    unit: '(人)',
                    name: '访问用户',
                    xAxisData:['7月', '8月', '9月', '10月', '11月', '12月'],
                    yAxisData:{
                        name: '访问用户',
                        type: 'line',
                        symbol:"emptyCircle",
                        symbolSize:"6",
                        areaStyle: { // 填充设置
                            normal: {
                                color: new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                    offset: 0,
                                    color: window.top.theme === 'lightTheme' ? '#0696ff' : '#1890ff',
                                    opacity: 0.2
                                }, {
                                    offset: 1,
                                    color: window.top.theme === 'lightTheme' ? '#ffffff' : '#000000',
                                    opacity: 0.2
                                }])
                            }
                        },
                        data:[]
                    },
                },
            }
        },
        watch: {
            chartType: function(newValue,oldValue){
                let that = this;
                if(newValue != oldValue){
                    // loadData
                    that.loadData();
                }
            }
        },
        mounted: function(){
            let that = this;
            that.init();
        },
        methods: {
            /*
        	* 初始化数据
        	*/
            init: function () {
                let that = this;
                getSystemLogData().then(res => {
                    let resp = res.data;
                    if ('0' == resp.retCode) {
                        that.tableData = resp.resultData.day;
                        that.chartData = resp.resultData.month;
                        that.loadData();
                    }
                })
                // //test
                // let resultData = {
                //     month: [
                //         {
                //             operTime: '04',
                //             contUser: 1,
                //             contVisit: 6
                //         },
                //         {
                //             operTime: '05',
                //             contUser: 5,
                //             contVisit: 12
                //         }
                //     ],
                //     day: [
                //         {
                //             operTime: '2019-04-25',
                //             contUser: 1,
                //             contVisit: 6
                //         },
                //         {
                //             operTime: '2019-05-25',
                //             contUser: 5,
                //             contVisit: 12
                //         }
                //     ]
                // }
                // that.tableData = resultData.day;
                // that.chartData = resultData.month;
                // that.loadData();
            },
            /* 数据处理 */
            replaceDataUtil: function(data, replaceData, valueKey){
                let arr = [];
                if(!data || data.length == 0){
                    console.log("methods--->dataReplace--->obj:无数据");
                    return arr;
                }
                data.map(function(item){
                    let obj = {};
                    obj.name = item.operTime;
                    obj.value = Number(item[valueKey]);
                    for(let i = 0; i < replaceData.length; i++){
                        if(replaceData[i].content == item.operTime){
                            obj.name = replaceData[i].repContent;
                            break;
                        }
                    }
                    arr.push(obj);
                });
                return arr;
            },
            loadData: function(){
                let that = this;
                console.log(that.chartType)
                if(that.chartType == 'user'){
                    that.chartObj.yAxisData.name = '访问用户';
                    that.chartObj.unit = '(人)';
                    let replaceData = that.replaceDataUtil(that.chartData, that.replaceData, 'contUser');
                    that.bulidChartData(replaceData);
                } else if(that.chartType == 'visit'){
                    that.chartObj.yAxisData.name = '访问次数';
                    that.chartObj.unit = '(次)';
                    let replaceData = that.replaceDataUtil(that.chartData, that.replaceData, 'contVisit');
                    that.bulidChartData(replaceData);
                }
            },
            /* 构建图表数据 */
            bulidChartData: function(dataList){
                console.log("methods--->bulidTopData--->dataList:",dataList);
                let that = this;
                var xAxisData = new Array();
                var yAxisData = new Array();
                for(var i in dataList){
                    var obj = dataList[i];
                    var name = obj.name;
                    var value = obj.value;
                    xAxisData.push(name);
                    yAxisData.push(value);
                };
                that.chartObj.xAxisData = xAxisData;
                that.chartObj.yAxisData.data = yAxisData;
                console.log("methods--->bulidPhoneData--->objData:",that.chartObj);
                setTimeout(function(){
                    that.lineOption(that.chartObj);
                },500)
            }
        }
    }
</script>

<style lang="less" scoped>
  @import '../../assets/css/echartsBase';
  @import '../../assets/css/reportCenter';
</style>
