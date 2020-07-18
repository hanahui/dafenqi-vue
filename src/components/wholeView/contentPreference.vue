<template>
  <div id="main" class="">
    <div class="page-title bgd chart-page" style="margin-bottom: 8px;">
      <div>内容偏好</div>
      <div class="font-size0 pdt24">
        <button class="hot-button" :class="{'hot-button-blue': isMember === '1'}" @click="buttonClick('1')">会员</button>
        <button class="hot-button" :class="{'hot-button-blue': isMember === '0'}" @click="buttonClick('0')">非会员</button>
      </div>
    </div>
    <div class="echart-group">
      <!--				<div class="group-title">-->
      <!--					<span class="title-text">内容类型偏好</span>-->
      <!--				</div>-->
      <div class="echart-h-wrapper">
        <!-- 内容类型偏好 -->
        <div class="cell one-half bgd echart-h-box relative">
          <div class="echart-select absolute">
            <custom-select :list="fixedTypeList"
                           :default-value.sync="typeSelected"></custom-select>
          </div>
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">内容类型偏好</div>
              <div class="sub-title">单位：万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>不同内容类型的喜好人数</span>
            </div>
          </h5>
          <div id="typePreferEchart" class="echart-container"></div>
          <block-nodata v-show="typePreferObj.objData.noData"></block-nodata>
          <block-loading v-show="typePreferObj.objData.loading"></block-loading>
          <block-update v-show="typePreferObj.objData.update" @update="queryType"></block-update>
        </div>
        <!-- 年代偏好 -->
        <div class="cell one-half bgd echart-h-box  relative">
          <div class="echart-select absolute">
            <custom-select :list="fixedTypeList"
                           :default-value.sync="yearSelected"></custom-select>
          </div>
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">年代偏好TOP10</div>
              <div class="sub-title">单位：万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>不同内容年代的喜好人数</span>
            </div>
          </h5>
          <div id="yearPreferEchart" class="echart-container"></div>
          <block-nodata v-show="yearPreferObj.objData.noData"></block-nodata>
          <block-loading v-show="yearPreferObj.objData.loading"></block-loading>
          <block-update v-show="yearPreferObj.objData.update" @update="queryYear"></block-update>
        </div>
      </div>
    </div>
    <div class="echart-group">
      <div class="echart-h-wrapper">
        <!-- 人物偏好TOP10 -->
        <div class="cell one-half bgd echart-h-box relative">
          <div class="echart-switch absolute inline-flex">
							<span class="switch-item"
                    :class="{active: personSwitch == '导演'}"
                    @click="personSwitch = '导演'">导演</span>
            <span class="switch-item"
                  :class="{active: personSwitch == '主演'}"
                  @click="personSwitch = '主演'">演员</span>
          </div>
          <div class="echart-select absolute" style="right: 180px">
            <custom-select :list="fixedTypeList1"
                           :default-value.sync="personTopSelected"></custom-select>
          </div>
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">人物偏好TOP10</div>
              <div class="sub-title">单位：万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>各种人物的喜好人数</span>
            </div>
          </h5>
          <div id="personTopEchart" class="echart-container"></div>
          <block-nodata v-show="personTopObj.noData"></block-nodata>
          <block-loading v-show="personTopObj.loading"></block-loading>
          <block-update v-show="personTopObj.update" @update="queryPersonTop"></block-update>
        </div>
        <!-- 内容偏好TOP10-->
        <div class="cell one-half bgd echart-h-box relative">
          <div class="echart-select absolute">
            <custom-select :list="contentTypeList"
                           :default-value.sync="contentTopSelected"></custom-select>
          </div>
          <h5 class="chart-title">
            <div class="title-text">
              <div class="main-title">内容偏好TOP10</div>
              <div class="sub-title">单位：万</div>
            </div>
            <div class="title-tips">
              <span class="tips-text"><span class="tips-arrow"></span>各种类型的喜好人数</span>
            </div>
          </h5>
          <div id="contentTopEchart" class="echart-container"></div>
          <block-nodata v-show="contentTopObj.noData"></block-nodata>
          <block-loading v-show="contentTopObj.loading"></block-loading>
          <block-update v-show="contentTopObj.update" @update="queryContentTop"></block-update>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {MyMixin} from '../../assets/js/echart/mixins.js'
    import {getFirstCategoryData} from "../../assets/js/wholeKanbanApi";
    import CustomSelect from '../customSelect'

    export default {
        name: "contentPreference",
        mixins: [MyMixin],
        components: {
            'custom-select': CustomSelect
        },
        data(){
          return {
              isMember:"1",//是否会员,
              personSwitch: '导演',
              fixedTypeList1: [
                  {
                      text: '电影',
                      value: '电影'
                  },{
                      text: '电视剧',
                      value: '电视剧'
                  }
              ],
              contentTypeList: [],
              personTopSelected: '电影',
              contentTopSelected: '',
          }
        },
        created: function () {
            let that = this;
            let documentCookie = document.cookie;
            let len = documentCookie.length;
            let arr = documentCookie.split(';');
            // console.log(document.cookie, 'cookie', arr)
            let product = '';
            arr.forEach(function(text){
                let index = text.indexOf('productArray=');
                if(index !== -1){
                    product = text.substring(index+13);
                }
            });
            //console.log(product.replace(/@/g, ','));
            if(product.replace(/@/g, ',') == ''){
                product = '0';
            }else{
                product = product.replace(/@/g, ',');
            }
            that.queryFirstCategory(product)
        },
        mounted: function (event) {
            var that = this;
            that.init()
        },
        watch: {
            isMember: function(val, oldVal){
                // console.log("watch--->isMember--->val:",val,",oldVal:",oldVal);
                var that = this;
                that.init();
                that.queryContentTop();
            },
        },
        methods: {
            queryFirstCategory: function(productValue){
                let that = this;
                let params = {product: productValue}
                console.log(params, '请求分类产品')
                // getFirstCategoryData(params).then(res => {
                    let resp = {"retCode":"0","retDesc":"成功","resultData":["电视剧","少儿","电影","综艺","教育","音乐","演艺","纪实","体育","动漫"]};
                    if(resp.retCode == 0){
                        if(resp.resultData && resp.resultData.length > 0){
                            // 默认选中第一项
                            //that.typeSelected = that.yearSelected = that.contentTopSelected = res.resultData[0];
                            that.contentTopSelected = resp.resultData[0];
                            // console.log(res.resultData);
                            that.formatFirstCategory(resp.resultData);
                        }
                    }
                // })
            },
            /*初始化数据*/
            init: function () {
                var that = this;
                that.queryType();
                that.queryYear();
                that.queryPersonTop();
            },
            queryType: function(){
                let that = this;
                let typeParam = {
                    isMember: that.isMember,
                    className: that.typeSelected
                };
                // console.log(typeParam, 'typeParam')
                that.queryTypePreferData(typeParam);
            },
            queryYear: function(){
                let that = this;
                let yearParam = {
                    isMember: that.isMember,
                    className: that.yearSelected
                }
                console.log(yearParam, 'yearParam')
                that.queryYearPreferData(yearParam);
            },
            queryPersonTop: function(){
                let that = this;
                let personTopParam = {
                    isMember: that.isMember,
                    attributeName: that.personSwitch,
                    className: that.personTopSelected
                }
                // console.log('00000', apis.personTopUrl, personTopParam)
                that.queryPersonTopData(personTopParam);
            },
            queryContentTop: function(){
                let that = this;
                let contentTopParam = {
                    isMember: that.isMember,
                    className: that.contentTopSelected
                }
                that.queryContentTopData(contentTopParam);
            },
            formatFirstCategory: function(firstCategoryList){
                let that = this;
                // console.log(firstCategoryList)
                firstCategoryList.forEach(function(item){
                    console.log(item)
                    that.contentTypeList.push({
                        text: item,
                        value: item
                    })
                })
            }
        }
    }
</script>

<style lang="less" scoped>
@import '../../assets/css/echartsBase';
</style>
