<template>
  <div id="main" class="">
    <div class="top-search page-title">
      <div class="top-title">个人画像</div>
    </div>
    <div class="search-wrapper clearFix">
      <div class="search-item floatL">
        <span class="search-label floatL">类型：</span>
        <div class="floatL select-wrapper">
          <span class="search-select" @click="selectFlag = !selectFlag">{{selectedTypeText}}</span>
          <div class="select-options" v-show="selectFlag">
            <ul class="options-list">
              <li class="options-item"
                  v-for="option in selectOption"
                  :data-value="option.value"
                  @click="selectedType(option)">
                {{option.text}}
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div class="search-item floatL">
        <input type="text"
               placeholder="请输入"
               :class="{disable: selectedTypeValue === null}"
               :readonly="selectedTypeValue === null"
               v-model="searchCont"
               class="search-input">
      </div>
      <span class="btn  btn-primary floatL" @click="getUserInfo()">查询</span>
    </div>
    <div class="main-cont" :class="{man: userSex === '0' || userSex === '-998', woman: userSex === '1'}">
      <div class="cont-wrapper clearFix">
        <div class="cont-left floatL">
          <div class="personal-item detailed-info">
            <div class="item-title">
              <p class="title-text text-right">详细信息</p>
              <div class="line">
                <img v-show="userSex === '1'" src="./images/line-left@2x.png"
                     alt="" class="line-image top">
                <img v-show="userSex === '0' || userSex === '-998'" src="./images/man-line-left@2x.png"
                     alt="" class="line-image top">
              </div>
            </div>
            <div class="item-cont left detailed-info-cont clearFix">
              <div class="detailed-info-wrapper-left detailed-info-left floatL">
                <div class="detailed-info-item">
                  <p class="info-subTitle"><span class="front-icon"></span>基础属性</p>
                  <p class="info-text">咪咕账号：<span class="span-cursor" :title="userInformation.account">{{userInformation.account}}</span></p>
                  <p class="info-text">手机：<span class="">{{userInformation.phone_num}}</span></p>
                  <p class="info-text">UDID：<span class="span-cursor" :title="userInformation.udid">{{userInformation.udid}}</span></p>
                  <p class="info-text">年龄：{{userInformation.age | ageFilters}}</p>
                  <p class="info-text">性别：{{userInformation.gender | genderFilters}}</p>
                  <p class="info-text">学历：{{userInformation.education | educationFilters}}</p>
                  <p class="info-text">婚姻：{{userInformation.marriage | marriageFilters}}</p>
                  <p class="info-text">咪咕会员：<span>{{userInformation.is_member | memberFilters}}</span></p>
                  <p class="info-text">会员类型：{{userInformation.member_type | memberTypeFilters}}</p>
                  <!-- <p class="info-text">会员累计天数：{{userInformation.total_member_days}}</p> -->
                  <p class="info-text">注册时间：{{userInformation.register_date | timeFilters}}</p>
                  <p class="info-text">连续会员次数：{{userInformation.member_duration_times}}</p>
                </div>
              </div>
              <div class="detailed-info-wrapper-right detailed-info-right floatL">
                <div class="detailed-info-item">
                  <p class="info-subTitle"><span class="front-icon"></span>归属地</p>
                  <p class="info-text">国家：{{userInformation.phone_country}}</p>
                  <p class="info-text">省份：{{userInformation.phone_prov}}</p>
                  <p class="info-text">城市：{{userInformation.phone_city}}</p>
                  <!-- <p class="info-text">区县：{{userInformation.phone_county}}</p> -->
                </div>
                <div class="detailed-info-item">
                  <p class="info-subTitle"><span class="front-icon"></span>常住地</p>
                  <p class="info-text">国家：{{userInformation.location_country}}</p>
                  <p class="info-text">省份：{{userInformation.location_prov}}</p>
                  <p class="info-text">城市：{{userInformation.location_city}}</p>
                  <!-- <p class="info-text">区县：{{userInformation.location_type}}</p> -->
                </div>
              </div>
            </div>
          </div>
          <div class="personal-item detailed-info">
            <div class="item-title">
              <p class="title-text text-right">主要目标</p>
              <div class="line">
                <img class="line-image bottom"
                     v-show="userSex === '1'" src="./images/line-right@2x.png" alt="">
                <img class="line-image bottom"
                     v-show="userSex === '0' || userSex === '-998'"
                     src="./images/man-line-right@2x.png" alt="">
              </div>
            </div>
            <div class="item-cont left echarts-radar">
              <div id="echarts" class="echarts-wrapper"></div>
            </div>
          </div>
        </div>
        <div class="cont-center floatL person-img">
          <img class="image" v-show="userSex === '0'" src="./images/man@2x.png" alt="">
          <img class="image" v-show="userSex === '1'" src="./images/woman@2x.png" alt="">
          <img class="image" v-show="userSex === '-998'" src="./images/Unknown@2x.png" alt="">
        </div>
        <div class="cont-right floatR">
          <div class="personal-item detailed-info">
            <div class="item-title">
              <p class="title-text text-left">行为特征</p>
              <div class="line">
                <img src="./images/line-right@2x.png"
                     v-show="userSex === '1'" alt="" class="line-image top">
                <img src="./images/man-line-right@2x.png"
                     v-show="userSex === '0' || userSex === '-998'" alt=""
                     class="line-image top">
              </div>
            </div>
            <div class="item-cont padding-left right-item-cont">
              <p class="info-text">常用时段：{{userInformation.last_month_visit_period}}</p>
              <p class="info-text">日均使用时长：{{userInformation.last_month_visit_time_avg | timeAvgFilters}}</p>
              <p class="info-text">日均播放时长：{{userInformation.last_month_play_time_avg | timeAvgFilters}}</p>
              <p class="info-text">工作日/节假日：{{userInformation.weekdays_or_holidays}}</p>
              <p class="info-text">近期社交频率：{{userInformation.recent_social_frequency}}</p>
              <p class="info-text">最近一次访问时间：{{userInformation.last_visit_time | timeFilters}}</p>
              <p class="info-text">最近一次播放时间：{{userInformation.last_play_time | timeFilters}}</p>
              <p class="info-text">消费频率：{{userInformation.last_12month_consume_times}}</p>
              <p class="info-text">年消费额：{{userInformation.last_12month_consume_amt | consumeFilters}}</p>
              <p class="info-text">最近一次消费：{{userInformation.last_consume_type | lastConsumeTypeFilters}}</p>
            </div>
          </div>
          <div class="personal-item detailed-info">
            <div class="item-title">
              <p class="title-text text-left">内容偏好</p>
              <div class="line">
                <img src="./images/line-left@2x.png"
                     v-show="userSex === '1'" alt="" class="line-image bottom">
                <img src="./images/man-line-left@2x.png"
                     v-show="userSex === '0' || userSex === '-998'" alt=""
                     class="line-image bottom">
              </div>
            </div>
            <div class="item-cont padding-left right-item-cont">
              <p class="info-text">长视频与短视频比例：{{userInformation.last_month_long_video_vv | ratioFilters(userInformation.last_month_short_video_vv)}}</p>
              <p class="info-text">分类：{{userInformation.ph_type}}</p>
              <p class="info-text">内容类型：{{userInformation.ph_content_type}}</p>
              <p class="info-text">播出年代：{{userInformation.ph_broadcast_period}}</p>
              <p class="info-text">导演：{{userInformation.ph_director}}</p>
              <p class="info-text">演员：{{userInformation.ph_actor}}</p>
              <p class="info-text">尝鲜度：{{userInformation.tasting_degree}}</p>
              <p class="info-text">兴趣范围：{{userInformation.scope_of_interest}}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
    import {getPersonalInfo} from "../../assets/js/personalApi";
    export default {
        name: "index",
        data: function() {
            return {
                userAccount: '',
                userMobile: '',
                selectFlag: false, // 类型下拉选择标识
                selectOption: [
                    {value: 'phone_num', text: '手机号码'},
                    {value: 'account', text: '咪咕账户'},
                    {value: 'imei', text: 'imei'},
                    {value: 'user_id', text: 'user_id'},
                ],
                selectedTypeValue: null, // 选中类型value
                selectedTypeText: '请选择', // 选中类型text
                searchCont: '', // 搜索内容
                userSex: '-998', // 用户性别
                userInformation: { // 用户详细信息
                    account: "--", // 账号
                    phone_num: '--', // 手机号
                    udid: '--', // UDID
                    age: "--", // 年龄
                    gender: "--", // 性别
                    education: "--", // 学历
                    marriage: "--", // 婚姻
                    is_member: "--", // 是否咪咕会员
                    member_type: "--", // 会员类型
                    total_member_days: "--", // 会员累计天数
                    register_date: "--", // 会员注册时间
                    member_duration_times: "--", // 连续会员次数

                    phone_country: '--', // 手机归属国家
                    phone_prov: "--", // 手机归属省
                    phone_city: "--", // 手机归属市
                    phone_county: '--', // 手机归属地(区县)

                    location_country: '--', // 常驻国家
                    location_prov: "--", // 常驻省
                    location_city: "--", // 常驻市
                    location_type: "--", // 常驻地

                    last_month_visit_period: "--", // 常用时段
                    last_month_visit_time_avg: "--", // 日均使用时长
                    last_month_play_time_avg: "--", // 日均播放时长
                    weekdays_or_holidays: "--", // 工作日/节假日
                    recent_social_frequency: "--", // 近期社交频率
                    last_visit_time: "--", // 最近一次使用时间
                    last_play_time: "--", // 最近一次播放时间
                    last_12month_consume_times: "--", // 年消费次数
                    last_12month_consume_amt: "--", // 年消费额
                    last_consume_type: "--", // 最近一次消费

                    /* ratio_of_video: "--", // 长视频与短视频比例 */
                    last_month_long_video_vv:"--",//长视频
                    last_month_short_video_vv:"--",//短视频
                    ph_type: "--", // 分类
                    ph_content_type: "--", // 内容类型
                    ph_broadcast_period: "--", // 播出年代
                    ph_director: "--", // 导演
                    ph_actor: "--", // 演员
                    tasting_degree: "--", // 尝鲜度
                    scope_of_interest: "--", // 兴趣范围
                },
                objData:{
                    id:'echarts',
                    colorData:['rgba(28,175,274,0.55)'],
                    indicatorList:[{
                        text: '消费力',
                        max: 10
                    },
                        {
                            text: '活跃度',
                            max: 10
                        },
                        {
                            text: '影响力',
                            max: 10
                        },
                        {
                            text: '效益值',
                            max: 10
                        },
                        {
                            text: '忠诚度',
                            max: 10
                        }],
                    variableList: ['last_12month_consume_ability','last_month_activity','last_month_social_effect','benefit_value','loyalty_value'],
                    dataList:[]
                }
            }
        },
        mounted: function() {
            var that = this;
            that.radarOption(that.objData);
        },
        filters: {
            // 时间格式化
            timeFilters: function(data) {
                var length = data.length;
                if(6 == length){
                    data = data.substring(0,4)+"-"+data.substring(4,6);
                }
                if(8 == length){
                    data = data.substring(0,4)+"-"+data.substring(4,6)+"-"+data.substring(6,8);
                }
                if(10 == length){
                    data = data.substring(0,4)+"-"+data.substring(4,6)+"-"+data.substring(6,8)+" "
                        +data.substring(8,10);
                }
                if(12 == length){
                    data = data.substring(0,4)+"-"+data.substring(4,6)+"-"+data.substring(6,8)+" "
                        +data.substring(8,10)+":"+data.substring(8,12);
                }
                if(14 == length){
                    data = data.substring(0,4)+"-"+data.substring(4,6)+"-"+data.substring(6,8)+" "
                        +data.substring(8,10)+":"+data.substring(10,12)+":"+data.substring(12,14);
                }
                return data;
            },
            // 年龄
            ageFilters: function(age){
                var res = "--";
                if("0" === age){
                    return "0-14岁";
                }
                if("1" === age){
                    return "19-22岁";
                }
                if("2" === age){
                    return "23-25岁";
                }
                if("3" === age){
                    return "26-30岁";
                }
                if("4" === age){
                    return "31-35岁";
                }
                if("5" === age){
                    return "36-40岁";
                }
                if("6" === age){
                    return "41-45岁";
                }
                if("7" === age){
                    return "46-50岁";
                }
                if("8" === age){
                    return "51-55岁";
                }
                if("9" === age){
                    return "56-60岁";
                }
                if("10" === age){
                    return "61-65岁";
                }
                if("11" === age){
                    return "65岁以上";
                }
                return res;
            },
            // 性别
            genderFilters: function(gender){
                var res = "--";
                if("0" === gender){
                    return "男";
                }
                if("1" === gender){
                    return "女";
                }
                return res;
            },
            // 学历
            educationFilters: function(education){
                var res = "--";
                if("0" === education){
                    return "小学";
                }
                if("1" === education){
                    return "初中";
                }
                if("2" === education){
                    return "高中";
                }
                if("3" === education){
                    return "专科";
                }
                if("4" === education){
                    return "本科";
                }
                if("5" === education){
                    return "硕士";
                }
                if("6" === education){
                    return "博士";
                }
                if("7" === education){
                    return "博士后";
                }
                return res;
            },
            // 婚姻
            marriageFilters: function(marriage){
                var res = "--";
                if("0" === marriage){
                    return "已婚";
                }
                if("1" === marriage){
                    return "未婚";
                }
                return res;
            },
            // 会员
            memberFilters: function(member){
                var res = "--";
                if("0" === member){
                    return "否";
                }
                if("1" === member){
                    return "是";
                }
                return res;
            },
            // 会员类型
            memberTypeFilters: function(memberType){
                var res = "--";
                if("1" === memberType){
                    return "钻石会员";
                }
                if("2" === memberType){
                    return "黄金会员";
                }
                if("3" === memberType){
                    return "体验会员";
                }
                if("4" === memberType){
                    return "游客";
                }
                return res;
            },
            /*
            * 时长
            * 秒转分钟，保留两位小数
            */
            timeAvgFilters: function(timeAvg){
                if("--" == timeAvg){
                    return timeAvg;
                }
                var result = ((Number(timeAvg) / 60)).toFixed(2).toString();
                return result+"分钟";
            },
            /*
             * 消费
             * 分转元，保留两位小数
             */
            consumeFilters: function(consume){
                if("--" == consume){
                    return consume;
                }
                var result = ((Number(consume) / 100)).toFixed(2).toString();
                return result+"元";
            },
            //最近消费类型
            lastConsumeTypeFilters: function(lastConsumeType){
                var res = "--";
                if("DAY" === lastConsumeType){
                    return "包日";
                }
                if("MONTH" === lastConsumeType){
                    return "包月";
                }
                if("SERIE" === lastConsumeType){
                    return "按部";
                }
                return res;
            },
            //长短视频比例
            ratioFilters: function(longData,shortData){
                if("--" === longData || "--" === shortData){
                    return "--";
                }
                var _longData = Number(longData);
                var _shortData = Number(shortData);
                var gcd = loadGcd(_longData,_shortData);
                var longGcd = _longData/gcd;
                var shortGcd = _shortData/gcd;
                return longGcd.toString()+":"+shortGcd.toString();
            }
        },
        methods: {
            // 选中类型事件
            selectedType: function(option) {
                var that = this;
                that.selectFlag = false;
                that.selectedTypeText = option.text;
                that.selectedTypeValue = option.value;
            },
            // 查询事件
            getUserInfo: function() {
                let that = this;
                let params = {
                    type: that.selectedTypeValue,
                    typeValue: that.searchCont
                }
                console.log(params, '查询个人画像参数')
                getPersonalInfo(params).then(res => {
                    let data = res.data;
                    var infoData = data.resultData;
                    if(infoData) {
                        // 赋值个人信息
                        infoData.phone_country = "中国";
                        infoData.local_country = "中国";
                        that.userSex = infoData.gender;
                        for(key in that.userInformation) {
                            var val = infoData[key]
                            if("" != val && "-998" != val && null != val){
                                that.userInformation[key] = infoData[key];
                            }else{
                                that.userInformation[key] = "--";
                            }
                        }
                        // 赋值echart雷达图表数据
                        that.objData.dataList = that.objData.variableList.map(function(value, index, arr){
                            return Number(infoData[value]);
                        });
                        that.buildRadar();
                    } else {
                        for(let key in that.userInformation) {
                            that.userInformation[key] = '--';
                        }
                        that.$myModal({
                            show: true,
                            type: 'warning',
                            title:'未查询到该用户信息!',
                            okText: '知道了',
                        })
                    }
                })

            },
            buildRadar: function(){
                var that = this;
                var userSex = that.userSex;
                if("1" === userSex){
                    that.objData.colorData = ['rgba(246,167,179,0.55)'];
                }else{
                    that.objData.colorData =['rgba(28,175,274,0.55)'];
                }
                that.radarOption(that.objData);
            },
            radarOption: function(obj){
                var chart = this.echarts.init(document.getElementById(obj.id));
                var option = {
                    color: obj.colorData,
                    length: {
                        show: false
                    },
                    tooltip: {
                        trigger: 'axis'
                    },
                    radar: {
                        indicator: obj.indicatorList,
                        center: ['40%','50%'],
                        radius: 100,
                        splitNumber: 4,
                        name: {
                            color: '#4d4d4d',
                            fontSize: 14,
                        },
                        axisLine: {
                            show: false
                        },
                        splitLine: {
                            lineStyle: {
                                color: ['#7E766A'],
                            }
                        },
                        splitArea: {
                            areaStyle: {
                                color: ['rgba(255,255,255,0.0)']
                            }
                        }
                    },
                    series: {
                        type: 'radar',
                        symbol: 'none',
                        tooltip: {
                            trigger: 'item'
                        },
                        itemStyle: {normal: {areaStyle: {type: 'default'}}},
                        data: [{
                            name: '用户分析:',
                            value: obj.dataList,
                            symbol: 'circle',
                            label: {
                                show: false,
                                color: '#fff'
                            }
                        }]
                    }
                }
                chart.setOption(option);
            }
        }
    }
</script>

<style lang="less" scoped>
  border-radius {
    border-radius: 4px;
  }

  .span-cursor{
    cursor: pointer;
  }

  .personal_portrait_page{
    width: 100%;
    min-width: 1080px;
    height: auto;
  }

  .top-search{
    width: 100%;
  }

  .search-wrapper{
    height: 32px;
    line-height: 32px;
    margin-bottom: 8px;
  }

  .search-wrapper .search-item{
    padding-right: 33px;
  }

  .search-item .select-wrapper{
    position: relative;
  }

  .search-item .search-input, .search-item .search-select{
    height: 32px;
    line-height: 32px;
    padding-left: 10px;
  }

  .search-item .search-input{
    outline: none;
  }

  .search-input.disable::-webkit-input-placeholder{
    color: #ccc;
  }

  .search-item .search-select{
    display: inline-block;
    width: 170px;
  }

  .search-item .select-options{
    position: absolute;
    top: 32px;
    line-height: 20px;
    font-size: 12px;
    width: 170px;
    padding: 5px 10px;
    z-index: 100;
  }

  .select-options .options-item{
    cursor: pointer;
  }

  .select-options .options-item:hover{
    color: #0696ff;
  }

  .search-wrapper .search-btn{
    display: inline-block;
    width: inherit;
    height: 40px;
    line-height: 40px;
    margin-right: 8px;
    padding: 0 16px;
    color: #f2f2f2;
    font-size: 16px;
    border-radius: 4px;
    background: #0696ff;
    cursor: pointer;
    vertical-align: middle;
  }

  .search-wrapper .search-btn:hover{

  }

  .main-cont{
    padding: 30px 0;
  }

  .main-cont .cont-wrapper{
    margin: 0 auto;
    /*min-width: 1080px;*/
    position: relative;
  }

  .cont-wrapper .cont-left, .cont-wrapper .cont-right {
    width: 45%;
  }

  .cont-wrapper .cont-center{
    width: 10%;
  }

  .personal-item {
    min-height: 400px;
    line-height: 25px;
  }

  .personal-item .item-cont{
    padding-top: 25px;
  }

  .item-cont{
    padding-left: 2%;
  }

  .item-cont.padding-left{
    padding-left: 18%;
  }

  .item-title{
    position: relative;
  }

  .item-title .title-text{
    height: 28px;
    line-height: 28px;
    font-size: 20px;
    font-family: PingFangSC-Medium;
  }

  .main-cont.woman .personal-item .title-text{
    color: #F6A7B3;
  }

  .main-cont.man .personal-item .title-text{
    color: #F5A623;
  }

  .item-title .title-text.text-right{
    text-align: right;
    padding-right: 18%;
  }

  .item-title .title-text.text-left{
    text-align: left;
    padding-left: 18%;
  }

  .line{
    position: relative;
  }

  .line .line-image{
    position: absolute;
    left: 0;
    top: 0;
    display: inline-block;
    width: 100%;
    height: 60px;
  }

  .line .line-image.bottom{
    transform: rotate(180deg);
    top:-36px;
  }

  .detailed-info-wrapper-left{
    width: 52%;
  }
  .detailed-info-wrapper-right{
    width: 42%;
  }

  .detailed-info-item .info-subTitle {
    font-size: 18px;
    margin-bottom: 5px;
  }

  .info-text{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .detailed-info-item .info-text{
    height: 25px;
    line-height: 25px;
    padding-left: 20px;
  }

  .detailed-info .front-icon {
    display: inline-block;
    width: 10px;
    height: 10px;
    background: #C9C058;
    margin-right: 10px;
  }

  .main-cont.woman .detailed-info .front-icon{
    background: #F6A7B3;
  }

  .person-img{
    position: relative;
  }

  .person-img .image{
    position: absolute;
    top: 70px;
    left: 50%;
    margin-left: -75px;
    display: block;
    width: 150px;
    height: auto;
  }

  .echarts-wrapper{
    height: 300px;
    margin: 0 auto;
  }
</style>
