<template>
  <div id="main" class="">
    <div class="page-title bgd">
      <div>热门标签</div>
    </div>
    <div class="page-content">
      <!--				<div class="content-title">-->
      <!--					<span class="title-text">使用Top10</span>-->
      <!--				</div>-->
      <div class="content-container">
        <div class="cell content-right bgd two-thirds relative">
          <h5 class="chart-title">
            <div class="title-text">
              <!--<div class="main-title"></div>-->
              <div class="sub-title">单位:(次)</div>
            </div>
            <!--<div class="title-tips">-->
            <!--<span class="tips-text">截止昨天，用户量TOP10终端品牌</span>-->
            <!--</div>-->
          </h5>
          <div id="topEchart" class="echart-container bgd-light"></div>
        </div>
        <div class="cell content-left one-third pdl">
          <my-table :table-data="tableData" :cols="cols">
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
    import {getHotPortraitData} from '../../assets/js/reportCenterApi'
    import {MyMixin} from "../../assets/js/echart/mixins";
    export default {
        name: "hotSearch",
        mixins: [MyMixin],
        components: {
            'my-table': CustomTable
        },
        data(){
            return {
                tableData: [],
                topObj:{
                    objData:{
                        id:'topEchart',
                        colorData:['#0696FF'],
                        seriesName: '访问次数',
                        xAxisData:['电影','电视剧','综艺','动漫','纪实','教育','演绎','体育','音乐','少儿'],
                        yAxisData:['220','120','165','65','40','35','45','160','86','44']
                    }
                },
                cols: [
                    {title: '浏览内容', key: 'content', tooltip: true, width: '33.333%'},
                    {title: '浏览次数(次)', key: 'cont', width: '33.333%',slot:'cont',align:'right'},
                    {title: '占比(%)', key: 'contRate', width: '33.333%',slot: 'contRate',align: 'center'},
                ]
            }
        },
        mounted: function (event) {
            var that = this;
            that.init();
            // that.singleBarOption(that.topObj.objData);
        },
        methods: {
            /*
        	* 处理数据
        	* return array
        	*/
            loadData: function(datas){
                console.log("methods--->dataReplace--->datas:",datas);
                if(0 == datas.length){
                    console.log("methods--->dataReplace--->datas:无数据");
                    return null;
                };
                let arr = [];
                datas.forEach(function(item){
                    let obj = {};
                    obj.name = item.content;
                    obj.value = item.cont;
                    arr.push(obj);
                });
                return arr;
            },

            /*初始化数据*/
            init: function () {
                var that = this;
                let params = {funcType:'3'};
                // common.ajax(apis.HotContentUrl, params, function (resp) {
                //     if ('0' == resp.retCode) {
                //         that.tableData = resp.resultData;
                //         var datas = resp.resultData;
                //         var dataList = that.loadData(datas);
                //         that.bulidEchartData(dataList);
                //     }else{
                //         //$.xcConfirm(resp.retDesc, $.xcConfirm.typeEnum.info)
                //         $.xcConfirm('抱歉，出错了，请稍后再试', $.xcConfirm.typeEnum.error)
                //     }
                // });
                getHotPortraitData(params).then(res => {
                    let resp = res.data;
                    if ('0' == resp.retCode) {
                        that.tableData = resp.resultData;
                        var datas = resp.resultData;
                        var dataList = that.loadData(datas);
                        that.bulidEchartData(dataList);
                    }
                })
            },
            /*构建Echart数据*/
            bulidEchartData: function(dataList){
                var that = this;
                console.log("methods--->bulidTopData--->dataList:",dataList);
                var that = this;
                var xAxisData = new Array();
                var yAxisData = new Array();
                for(var i in dataList){
                    var obj = dataList[i];
                    var name = obj.name;
                    var value = Number(obj.value);
                    xAxisData.push(name);
                    yAxisData.push(value);
                };
                that.topObj.objData.xAxisData = xAxisData;
                that.topObj.objData.yAxisData = yAxisData;
                console.log("methods--->bulidPhoneData--->objData:",that.topObj.objData);
                setTimeout(function(){
                    that.singleBarOption(that.topObj.objData);
                },500)
            }
        }
    }
</script>

<style lang="less" scoped>
  @import '../../assets/css/echartsBase';
  @import '../../assets/css/reportCenter';
</style>
