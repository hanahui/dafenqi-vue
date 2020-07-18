/* 画像系统共用方法 */
import {
  getAgeData,
  getCityData,
  getEducationData,
  getGenderData,
  getMembershipGrowthData,
  getMembershipTypeData,
  getOperationData,
  getProvinceData,
  getTerminalData,
  getVisitData,
  getPeriodRateData,
  getUsedurData,
  getActionTypeData,
  getActivityData,
  getUserActionData,
  getConsumeTypeData,
  getConsumeAbilityData,
  getConsumeGenderData,
  getConsumeAgeData,
  getConsumeCityData,
  getVideoData,
  getPlayCountData,
  getCategoryData,
  getPlayGenderData,
  getPlayCityData,
  getTypePreferData,
  getYearPreferData,
  getPersonTopData,
  getContentTopData,
} from "../wholeKanbanApi";
import loadingComponent  from  '../../../components/loading'
import updateComponent  from  '../../../components/update'
import nodataComponent  from  '../../../components/nodata'
import developingComponent from "../../../components/developing";

export const MyMixin = {
  components: {
    'block-loading': loadingComponent,
    'block-update': updateComponent,
    'block-developing': developingComponent,
    'block-nodata': nodataComponent
  },
  data: function(){
      return {
          labelColor: this.$store.state.systemTheme === 'lightTheme' ? '#4d4d4d' :   '#cccccc',
          lineColor: this.$store.state.systemTheme === 'lightTheme' ?  '#555760' :  '#4d4d4d',
          pieColorList: this.$store.state.systemTheme === 'lightTheme' ? ['#0696ff','#0ABDBA','#6EDC8C','#E9AD09','#EE5396','#6829C4','#BE95FF'] :   ['#0696ff','#0ABDBA','#6EDC8C','#E9AD09','#FF7EB6','#8B3FFC', '#BE95FF'],
          mapColorList: this.$store.state.systemTheme === 'lightTheme' ? ['#E6E6E6','#E0EDFC','#B4D3F6','#6EA7FF','#0064CE'] :  ['#1B4C72','#005597','#1B70BE','#0AC2FF','#46FAFF'],
          mapTooltipBackground: this.$store.state.systemTheme === 'lightTheme' ? 'rgba(255,255,255,0.0)' :   'rgba(255,255,255,0.8)',
          pictogramColor: this.$store.state.systemTheme === 'lightTheme' ? ['#1890ff','#0ABDBA','#A46EFF'] :   ['#1890ff','#6EDC8C','#BE95FF'],
          pictogramBackground: this.$store.state.systemTheme === 'lightTheme' ? '#ffffff' :  '#252525',
          lineChartColor: this.$store.state.systemTheme === 'lightTheme' ? '#0696ff' : '#1890ff',
          lineAreaStartColor: this.$store.state.systemTheme === 'lightTheme' ? '#0696ff' :  '#1890ff',
          lineAreaEndColor: this.$store.state.systemTheme === 'lightTheme' ? '#ffffff' :  '#000000',
          barBackground: this.$store.state.systemTheme === 'lightTheme' ?  '#EDF7FF' :  '#333333',
          typeSelected: '电影',
          yearSelected: '电影',
          // 内容类型/年代偏好 暂时固定类型下拉数据
          fixedTypeList: [{
              text: '电影',
              value: '电影'
          },{
              text: '电视剧',
              value: '电视剧'
          },{
              text: '动漫',
              value: '动漫'
          },],
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
          // 年龄占比
          nlzbObj:{
              replaceData:[
                  /*{content:'0',repContent:'14-18岁'},
                  {content:'1',repContent:'19-22岁'},
                  {content:'2',repContent:'23-25岁'},
                  {content:'3',repContent:'26-30岁'},
                  {content:'4',repContent:'31-35岁'},
                  {content:'5',repContent:'36-40岁'},
                  {content:'6',repContent:'41-45岁'},
                  {content:'7',repContent:'46-50岁'},
                  {content:'8',repContent:'51-55岁'},
                  {content:'9',repContent:'56-60岁'},
                  {content:'10',repContent:'61-65岁'},
                  {content:'11',repContent:'65岁以上'}, */
                  {content:'0',repContent:'0-23岁'},
                  {content:'1',repContent:'24-30岁'},
                  {content:'2',repContent:'31-35岁'},
                  {content:'3',repContent:'36-40岁'},
                  {content:'4',repContent:'41-45岁'},
                  {content:'5',repContent:'46-50岁'},
                  {content:'6',repContent:'50岁以上'},
              ],
              objData:{
                  id:'nlzbEchart',
                  noData: false, // 无数据
                  loading: false,  // 加载中
                  update: false,  // 加载失败 重新加载
                  titleText:'年龄',
                  subtext:'单位:万',
                  subValue:10000,
                  name:'年龄',
                  legend: ['0-23岁', '24-30岁', '31-35岁', '36-40岁', '41-45岁', '46-50岁', '50岁以上'],
                  dataList:[]
              }
          },
          // 性别比例
          xbblObj:{
              replaceData:[
                  {content:'0',repContent:'男'},
                  {content:'1',repContent:'女'}
              ],
              objData:{
                  titleText:'性别',
                  noData: false, // 无数据
                  loading: false,  // 加载中
                  update: false,  // 加载失败 重新加载
                  nanVal:[0],
                  nvVal:[0]
              }
          },
          // 学历比例 (开发中 展示数据开发中)
          xlblObj:{
              replaceData:[
                  {content:'0',repContent:'小学'},
                  {content:'1',repContent:'初中'},
                  {content:'2',repContent:'高中'},
                  {content:'3',repContent:'专科'},
                  {content:'4',repContent:'本科'},
                  {content:'5',repContent:'硕士'},
                  {content:'6',repContent:'博士'},
                  {content:'7',repContent:'博士后'},
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'xlblEchart',
                  titleText:'学历',
                  inDevelop: true,  // 开发中(展示开发中)
                  noData: false, // 无数据
                  loading: false,  // 加载中
                  update: false,  // 加载失败 重新加载
                  seriesName: '占比',
                  xAxisData:[],
                  yAxisData:[]
              }
          },
          // 省份分布
          sffbObj:{
              replaceData:[
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'sffbEchart',
                  titleText:'省份分布TOP10',
                  subtext:'单位:万',
                  noData: false, // 无数据
                  loading: false,  // 加载中
                  update: false,  // 加载失败 重新加载
                  subValue:10000,
                  labelUnit: '',
                  yAxisData:[],
                  xAxisData:[]
              }
          },
          // 城市分布
          csfbObj:{
              replaceData:[
                  {content:'1',repContent:'一线城市'},
                  {content:'2',repContent:'新一线城市'},
                  {content:'3',repContent:'二线'},
                  {content:'4',repContent:'三线'},
                  {content:'5',repContent:'四线'},
                  {content:'6',repContent:'五线'},
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'csfbEchart',
                  titleText:'城市分布',
                  subtext:'单位:万',
                  noData: false, // 无数据
                  loading: false,  // 加载中
                  update: false,  // 加载失败 重新加载
                  subValue:10000,
                  colorData:['#0696ff','#2FC25B','#FACC14','#F04864','#8543E0','#5155CF'],
                  name:'城市分布',
                  legend: ['一线城市','新一线城市','二线','三线','四线','五线','其他'],
                  dataList:[]
              }
          },
          // 操作系统
          czxtObj:{
              replaceData:[
                  /* {content:'AD',repContent:'Android'},
                  {content:'Ios',repContent:'iOS'}, */
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'czxtEchart',
                  titleText:'操作系统',
                  noData: false, // 无数据
                  loading: false,  // 加载中
                  update: false,  // 加载失败 重新加载
                  legendData:[],
                  xAxisData:[]
              }
          },
          // 终端类型
          zdcpObj:{
              replaceData:[
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'zdcpEchart',
                  titleText:'终端品牌 ',
                  subtext:'单位:万',
                  noData: false, // 无数据
                  loading: false,  // 加载中
                  update: false,  // 加载失败 重新加载
                  subValue:10000,
                  seriesName: '用户量',
                  colorData:['#0696ff'],
                  xAxisData:[],
                  yAxisData:[]
              }
          },
          // 会员分类
          flzbObj:{
              replaceData:[
                  {content:'5',repContent:'体验会员'},
                  {content:'6',repContent:'世界杯会员'},
                  {content:'7',repContent:'黄金会员'},
                  {content:'8',repContent:'钻石会员'},
                  {content:'9',repContent:'钻石会员(TV尊享)'},
                  {content:'10',repContent:'超级会员'},
                  {content:'11',repContent:'大站包会员'},
                  {content:'12',repContent:'咪爱会员'}
              ],
              objData:{
                  id:'flzbEchart',
                  titleText:'会员分类占比',
                  noData: false, // 无数据
                  loading: false,  // 加载中
                  update: false,  // 加载失败 重新加载
                  colorData:['#BAE7FF','#90D5FF','#69C0FF','#40A9FF','#008EFF','#0A6DD9','#0150B3','#013A8C'],
                  legendData:[],
                  seriesDataList:[]
              }
          },
          // 会员增长
          zzqsObj:{
              replaceData:[
                  {content:'-998',repContent:'未知'}
              ],
              objData:{
                  id:'zzqsEchart',
                  titleText:'会员增长趋势',
                  inDevelop: true,  // 开发中(展示开发中)
                  noData: false, // 无数据
                  loading: false,  // 加载中
                  update: false,  // 加载失败 重新加载
                  xAxisData:['1月', '2月', '3月','4月', '5月', '6月','7月','8月', '9月', '10月','11月','12月'],
                  yAxisData:[{
                      name: '评论次数',
                      type: 'line',
                      symbol:'emptyCircle',
                      symbolSize:'6',
                      areaStyle: { // 填充设置
                          normal: {
                              color: new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                  offset: 0,
                                  color: this.lineAreaStartColor,
                                  opacity: 0.2
                              }, {
                                  offset: 1,
                                  color: this.lineAreaEndColor,
                                  opacity: 0.2
                              }])
                          }
                      },
                      data:[]
                  }],
              }
          },
          // 访问次数
          fwcsObj:{
              replaceData:[
                  {content:'last_month_visit',repContent:'近1个月'},
                  {content:'last_3month_visit',repContent:'近3个月'},
                  {content:'last_6month_visit',repContent:'近6个月'},
                  {content:'last_12month_visit',repContent:'近1年'},
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'fwcsEchart',
                  titleText:'访问次数',
                  subtext:'单位:百万',
                  noData: false, // 无数据
                  loading: false, // 加载中
                  update: false,  // 失败刷新
                  subValue:1000000,
                  seriesName: '访问次数',
                  xAxisData:[],
                  yAxisData:[]
              },
          },
          //时间段占比
          hyxxObj:{
              replaceData:[
                  // {content:'00:00-7:30',repContent:'0点至7点半'},
                  // {content:'7:31-8:30',repContent:'7点半至8点半'},
                  // {content:'8:31-11:30',repContent:'8点半至11点半'},
                  // {content:'11:31-13:30',repContent:'11点半至13点半'},
                  // {content:'13:31-18:00',repContent:'13点半至18点'},
                  // {content:'18:01-22:00',repContent:'18点至22点'},
                  // {content:'22:01-24:00',repContent:'22点至24点'},
                  // {content:'-998',repContent:'其他'},
                  {content:'00:00-7:30',repContent:'00:00-7:30'},
                  {content:'7:31-8:30',repContent:'7:30-8:30'},
                  {content:'8:31-11:30',repContent:'8:30-11:30'},
                  {content:'11:31-13:30',repContent:'11:30-13:30'},
                  {content:'13:31-18:00',repContent:'13:30-18:00'},
                  {content:'18:01-22:00',repContent:'18:00-22:00'},
                  {content:'22:01-24:00',repContent:'22:00-24:00'},
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'hyxxEchart',
                  titleText:'时间段占比',
                  subtext:'单位:万',
                  noData: false, // 无数据
                  loading: false, // 加载中
                  update: false,  // 失败刷新
                  subValue:10000,
                  name:'时间段占比',
                  tooltipName: '次数',
                  legend: ['00:00-7:30','7:30-8:30','8:30-11:30','11:30-13:30','13:30-18:30','18:00-22:00','22:00-24:00','其他'],
                  dataList:[]
              }
          },
          // 平均天使用时长
          syscObj:{
              replaceData:[
                  {content:'1',repContent:'0-5分钟'},
                  {content:'2',repContent:'6-10分钟'},
                  {content:'3',repContent:'11-15分钟'},
                  {content:'4',repContent:'16-60分钟'},
                  {content:'5',repContent:'1小时以上'},
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'syscEchart',
                  titleText:'平均天使用时长',
                  noData: false, // 无数据
                  loading: false, // 加载中
                  update: false,  // 失败刷新
                  labelUnit: '%',
                  yAxisData:[],
                  xAxisData:[]
              },
          },
          // 播放次数
          spbfObj:{
              replaceVvData:[
                  {content:'last_month_vv',repContent:'近1个月'},
                  {content:'last_3month_vv',repContent:'近3个月'},
                  {content:'last_6month_vv',repContent:'近6个月'},
                  {content:'last_12month_vv',repContent:'近1年'},
                  {content:'-998',repContent:'其他'}
              ],
              replaceCvData:[
                  {content:'last_month_cv',repContent:'近1个月'},
                  {content:'last_3month_cv',repContent:'近3个月'},
                  {content:'last_6month_cv',repContent:'近6个月'},
                  {content:'last_12month_cv',repContent:'近1年'},
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'spbfEchart',
                  titleText:'播放次数',
                  subtext:'单位:百万',
                  noData: false, // 无数据
                  loading: false, // 加载中
                  update: false,  // 失败刷新
                  subValue:1000000,
                  colorData:['#0696FF', '#41D9C7','#F8D145'], // 柱状图颜色值
                  legendData:[],
                  xAxisData:[],
                  yAxisData:[]
              }
          },
          // 类型比例
          hdxwObj:{
              replaceData:[
                  {content:'last_month_app_up_cnt',repContent:'点赞次数'},
                  {content:'last_month_app_comment_cnt',repContent:'评论次数'},
                  {content:'last_month_app_share_cnt',repContent:'分享次数'},
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'hdxwEchart',
                  titleText:'类型比例',
                  subtext:'单位:万',
                  noData: false, // 无数据
                  loading: false, // 加载中
                  update: false,  // 失败刷新
                  subValue:10000,
                  name:'类型比例',
                  tooltipName: '次数',
                  legend: ['点赞次数','评论次数','分享次数','其他'],
                  dataList:[]
              }
          },
          // 社交活跃度趋势
          shhyObj:{
              replaceData:[
                  {content:'',repContent:''}
              ],
              objData:{
                  id:'shhyEchart',
                  titleText:'社交活跃度趋势',
                  inDevelop: true,  // (开发中)
                  noData: false, // 无数据
                  loading: false, // 加载中
                  update: false,  // 失败刷新
                  legendData:['评论次数','回复次数','点赞次数','评分次数'],
                  xAxisData:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
                  yAxisData:[
                      {name: '评论次数',
                          type: 'line',
                          symbol:'emptyCircle',
                          symbolSize:'6',
                          data:[3468,6834,1152,7464,5264,3167,8343,8366,2561,6676,5412,8745]
                      },
                      {name: '回复次数',
                          type: 'line',
                          symbol:'emptyCircle',
                          symbolSize:'6',
                          data:['6887','3474','8315','4232','7225','5523','2215','7236','7821','3466','8521','1472']
                      },
                      {name: '点赞次数',
                          type: 'line',
                          symbol:'emptyCircle',
                          symbolSize:'6',
                          data:['3282','1322','7866','7756','3816','3656','6123','5445','2651','3255','2356','4152']
                      },
                      {name: '评分次数',
                          type: 'line',
                          symbol:'emptyCircle',
                          symbolSize:'6',
                          data:['4175','4648','7458','2874','2331','7421','6681','5136','5412','2211','2581','2014']
                      }
                  ]
              }
          },
          // 消费类型
          typeObj:{
              replaceData:[
                  {content:'DAY',repContent:'DAY'},
                  {content:'MONTH',repContent:'MONTH'},
                  {content:'HOUR',repContent:'HOUR'},
                  {content:'BOSS_MONTH',repContent:'BOSS_MONTH'},
                  {content:'1 MONTH',repContent:'1 MONTH'},
                  {content:'3 MONTH',repContent:'3 MONTH'},
                  {content:'6 MONTH',repContent:'6 MONTH'},
                  {content:'12 MONTH',repContent:'12 MONTH'},
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'xflxEchart',
                  titleText:'消费类型',
                  subtext:'单位:万',
                  noData: false,  // 无数据
                  loading: false, // 加载中
                  update: false,  // 失败刷新
                  subValue:10000,
                  dataList:[]
              }
          },
          // 消费能力
          abilityObj:{
              replaceData:[
                  {content:'lt',repContent:'低：100元以下'},
                  {content:'mi',repContent:'中：100~175元'},
                  {content:'gt',repContent:'高：大于175元'},
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'xfnlEchart',
                  titleText:'消费能力',
                  subtext:'单位:万',
                  noData: false,  // 无数据
                  loading: false, // 加载中
                  update: false,  // 失败刷新
                  subValue:10000,
                  legend: ['低：100元以下','中：100~175元','高：大于175元','其他'],
                  dataList:[]
              }
          },
          // 消费结构-性别
          xbxfObj:{
              replaceData:[
                  {content:'0',repContent:'男'},
                  {content:'1',repContent:'女'}
              ],
              objData:{
                  titleText:'性别',
                  noData: false, // 无数据
                  loading: false,  // 加载中
                  update: false,  // 加载失败 重新加载
                  subValue:10000,
                  nanRatio: 0,
                  nanVal:[0],
                  nvRatio: 0,
                  nvVal:[0]
              }
          },
          // 消费结构-年龄
          nlxfObj:{
              replaceData:[
                  {content:'0',repContent:'0-18岁'},
                  {content:'1',repContent:'19-30岁'},
                  {content:'2',repContent:'31-50岁'},
                  {content:'3',repContent:'51-65岁'},
                  {content:'4',repContent:'65岁以上'}
              ],
              objData:{
                  id:'nlxfEchart',
                  noData: false, // 无数据
                  loading: false,  // 加载中
                  update: false,  // 加载失败 重新加载
                  titleText:'年龄',
                  subtext:'单位:万元',
                  subValue:10000,
                  name:'年龄',
                  tooltipName: '消费金额',
                  legend: ['0-18岁', '19-30岁', '31-50岁', '51-65岁', '65岁以上'],
                  dataList:[]
              }
          },
          // 消费结构-城市
          csxfObj:{
              replaceData:[
                  {content:'1',repContent:'一线'},
                  {content:'2',repContent:'新一线'},
                  {content:'3',repContent:'二线'},
                  {content:'4',repContent:'三线'},
                  {content:'5',repContent:'四线'},
                  {content:'6',repContent:'五线'},
                  {content:'-998',repContent:'其他'}
              ],
              objData:{
                  id:'csxfEchart',
                  titleText:'城市级别',
                  subtext:'单位:万',
                  noData: false, // 无数据
                  loading: false,
                  update: false,
                  subValue:10000,
                  seriesName: '消费金额',
                  xAxisData:[],
                  yAxisData:[]
              }
          },
          // 视频比例
          spblObj:{
              replaceData:[
                  {content:'last_month_short_video_vv',repContent:'短视频'},
                  {content:'last_month_long_video_vv',repContent:'长视频'}
              ],
              objData:{
                  id:'spblEchart',
                  titleText:'视频比例',
                  subtext:'单位:百万',
                  noData: false, // 无数据
                  loading: false,
                  update: false,
                  subValue:1000000,
                  tooltipName: '次数',
                  legend: ['短视频','长视频'],
                  dataList:[]
              }
          },
          // 一级分类
          yjflObj:{
              replaceData:[
                  {content:'last_month_film_vv',repContent:'电影'},
                  {content:'last_month_tv_vv',repContent:'电视剧'},
                  {content:'last_month_sport_vv',repContent:'体育'},
                  {content:'last_month_variety_vv',repContent:'综艺'},
                  {content:'last_month_comic_vv',repContent:'动漫'},
                  {content:'last_month_record_vv',repContent:'纪实'},
                  {content:'last_month_education_vv',repContent:'教育'},
                  {content:'last_month_art_vv',repContent:'演艺'},
                  {content:'last_month_music_vv',repContent:'音乐'},
                  {content:'last_month_child_vv',repContent:'少儿'}
              ],
              objData:{
                  id:'yjflEchart',
                  titleText:'一级分类',
                  subtext:'单位:百万',
                  noData: false, // 无数据
                  loading: false,
                  update: false,
                  subValue:1000000,
                  seriesName: '人数',
                  xAxisData:[],
                  yAxisData:[]
              }
          },
          // 性别偏好
          xbzsObj:{
              replaceData:[
                  {content:'0',repContent:'男'},
                  {content:'1',repContent:'女'}
              ],
              objData:{
                  id:'xbzsEchart',
                  subValue:1000000,
                  noData: false, // 无数据
                  loading: false,
                  update: false,
                  legendData:[],
                  xAxisData:['电影','电视剧','综艺','动漫','纪实','教育','演艺','体育','音乐','少儿'],
                  yAxisData:[]
              }
          },
          // 城市偏好
          cszsObj:{
              replaceData:[
                  {content:'1',repContent:'一线'},
                  {content:'2',repContent:'二线'},
                  {content:'3',repContent:'三线'},
                  {content:'4',repContent:'其他'}
              ],
              objData:{
                  id:'cszsEchart',
                  noData: false, // 无数据
                  loading: false,
                  update: false,
                  subValue:1000000,
                  legendData:[],
                  xAxisData:['电影','电视剧','综艺','动漫','纪实','教育','演艺','体育','音乐','少儿'],
                  yAxisData:[]
              }
          },
          // 内容偏好-内容类型偏好
          typePreferObj: {
              replaceData:[
                  {content:'last_month_film_vv',repContent:'电影'},
                  {content:'last_month_tv_vv',repContent:'电视剧'},
                  {content:'last_month_sport_vv',repContent:'体育'},
                  {content:'last_month_variety_vv',repContent:'综艺'},
                  {content:'last_month_comic_vv',repContent:'动漫'},
                  {content:'last_month_record_vv',repContent:'纪实'},
                  {content:'last_month_education_vv',repContent:'教育'},
                  {content:'last_month_art_vv',repContent:'演艺'},
                  {content:'last_month_music_vv',repContent:'音乐'},
                  {content:'last_month_child_vv',repContent:'少儿'}
              ],
              objData:{
                  id:'typePreferEchart',
                  titleText:'类型偏好',
                  subtext:'单位:万',
                  noData: false, // 无数据
                  loading: false,
                  update: false,
                  subValue:10000,
                  seriesName: '人数',
                  xAxisData:[],
                  yAxisData:[]
              }
          },
          // 内容偏好-内容年代偏好
          yearPreferObj: {
              objData:{
                  id:'yearPreferEchart',
                  titleText:'年代偏好',
                  subtext:'单位:万',
                  noData: false, // 无数据
                  loading: false,
                  update: false,
                  subValue:10000,
                  seriesName: '人数',
                  xAxisData:[],
                  yAxisData:[]
              }
          },
          // 内容偏好-人物top10
          personTopObj: {
              id : 'personTopEchart',
              titleText : '人物TOP10',
              subtext:'单位:万',
              noData: false, // 无数据
              loading: false,
              update: false,
              subValue:10000,
              labelUnit: '',
              yAxisData : [],
              xAxisData : []
          },
          // 内容偏好-内容top10
          contentTopObj: {
              id : 'contentTopEchart',
              titleText : '内容TOP10',
              subtext:'单位:万',
              noData: false, // 无数据
              loading: false,
              update: false,
              subValue:10000,
              labelUnit: '',
              yAxisData : [],
              xAxisData : []
          }
      }
  },
  watch: {
    typeSelected: function(val, oldVal){
        console.log('watch--->typeSelected--->val:',val)
        let that = this;
        that.queryType();
    },
    yearSelected: function(val, oldVal){
        console.log('watch--->yearSelected--->val:',val)
        let that = this;
        that.queryYear();
    },
    personSwitch: function(val, oldVal){
        console.log('watch--->personSwitch--->val:',val)
        let that = this;
        that.queryPersonTop();
    },
    personTopSelected: function(val, oldVal){
        // console.log('watch--->personTopSelected--->val:',val)
        let that = this;
        that.queryPersonTop();
    },
    contentTopSelected: function(val, oldVal){
        // console.log('watch--->contentTopSelected--->val:',val)
        let that = this;
        that.queryContentTop();
    },
  },
  methods: {
    clearEchart: function (id) {
      if(document.getElementById(id)){
        var echart = this.echarts.init(document.getElementById(id));
        echart.clear();
      }
    },
    /* 排序（升序）*/
    sortUtil: function () {
      return function (obj1, obj2) {
        var val1 = obj1.value;
        var val2 = obj2.value;
        var _val1 = 0;
        var _val2 = 0;
        if (!isNaN(Number(val1))) {
          _val1 = Number(val1);
        }

        if (!isNaN(Number(val2))) {
          _val2 = Number(val2);
        }

        if (_val1 > _val2) {
          return -1;
        }
        else if (_val1 < _val2) {
          return 1;
        }
        else {
          return 0;
        }
      }
    },
    /*
            * 处理数据(重载方法,用来处理时间段的排序)
            * 将对象转化为数组,数组内{name:key,value:[key]}
            * return
            */
    replaceTimeDataUtil: function (obj, replaceDate) {
      console.log("methods--->dataReplace--->obj:", obj, ",replaceDate:", replaceDate);
      let that = this;
      var arr = new Array();
      if (that._isEmptyObject(obj)) {
        console.log("methods--->dataReplace--->obj:无数据");
        return arr;
      }
      ;
      for (var i in replaceDate) {
        var replaceObj = replaceDate[i];
        for (var key in obj) {
          if (replaceObj.content == key) {
            var _obj = new Object();
            _obj.name = replaceObj.repContent;
            _obj.value = obj[key];
            arr.push(_obj);
            break;
          }
        }
      }
      ;
      console.log("methods--->dataReplace--->arr:", arr);
      return arr;
    },
    /*
        * 处理数据
        * 将对象转化为数组,数组内{name:key,value:[key]}
        * return
        */
    replaceDataUtil: function (obj, replaceDate) {
      let that = this;
      console.log("methods--->dataReplace--->obj:", obj, ",replaceDate:", replaceDate);
      var arr = new Array();
      if (that._isEmptyObject(obj)) {
        console.log("methods--->dataReplace--->obj:无数据");
        return arr;
      }
      ;
      for (var key in obj) {
        var _obj = new Object();
        _obj.name = key;
        _obj.value = obj[key];
        for (var i in replaceDate) {
          var replaceObj = replaceDate[i];
          if (replaceObj.content == key) {
            _obj.name = replaceObj.repContent;
            break;
          }
        }
        ;
        arr.push(_obj);
      }
      console.log("methods--->dataReplace--->arr:", arr);
      return arr;
    },
    /*
        * 计算占比(四舍五入)
        * val:数量
        * totalVal:总数
        * isPercentage:是否百分比,默认为是
        * decimalNum:小数位数,默认为2
        */
    loadRatio: function (val, totalVal, isPercentage, decimalNum) {
      console.log("methods--->loadRatio--->val:", val, ",totalVal:", totalVal);
      if (typeof decimalNum == 'undefined') {
        decimalNum = 2;
      }
      ;
      var obj = 1;
      if (isPercentage) {
        obj = 100;
      }
      ;
      if ('' == val || '' == totalVal) {
        return '0';
      }
      ;
      var result = ((Number(val) / Number(totalVal)) * obj).toFixed(decimalNum).toString();
      console.log("methods--->loadRatio--->result:", result);
      return result;
    },
    // 数字千分化(整型或浮点数字)
    formatNum: function (num) {
      if (typeof num === 'number') {
        if (num % 1 === 0) { // 整型
          return num.toString().replace(/(\d{1,3})(?=(\d{3})+$)/g, '$1,');
        }
        else { // 浮点
          return num.toString().replace(/(\d)(?=(\d{3})+\.)/g, '$1,');
        }
      }
      else {
        return num;
      }
    },
    // 判断是否是空对象
    _isEmptyObject: function(obj){
      let arr = Object.keys(obj);
      if(arr.length === 0){
        return true;
      }else{
        return false;
      }
    },
    // 环形图配置
    pieOption: function (obj) {
      var chart = this.echarts.init(document.getElementById(obj.id));
      chart.clear();
      var option = {
        color: this.pieColorList,
        tooltip: {
          show: true,
          trigger: 'item',
          borderWidth: 0,
          padding: 0,
          formatter: function (params) {
            console.log(params)
            let name = obj.tooltipName || '人数';
            let el = '<div class="tooltip-wrapper">' +
              '	<div class="tooltip-title">' +
              '		<span class="tooltip-title-icon" style="background: ' + params.color + '"></span>' +
              '		<span class="tooltip-title-text">' + params.name + '</span>' +
              '	</div>' +
              '	<div class="tooltip-content">' +
              '		<div class="tooltip-content-item">' +
              '			<span class="item-name">' + name + '：</span>' +
              '			<span class="item-value">' + params.value + '</span></div>' +
              '		<div class="tooltip-content-item">' +
              '			<span class="item-name">占比：</span>' +
              '			<span class="item-value">' + params.percent + '%</span>' +
              '		</div>' +
              '	</div>' +
              '</div>'
            return el;
          },
          extraCssText: 'min-width: 110px; background-color: rgba(251,252,255,0.8);',
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '0%',
          containLabel: true
        },
        legend: {
          show: true,
          orient: 'horizontal',
          type: 'plain',
          top: '87%',
          padding: 5,
          itemGap: 10,
          itemWidth: 8,
          icon: 'circle',
          borderRadius: 1,
          textStyle: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            color: this.labelColor,
          },
          data: obj.legend || null
        },
        series: [{
          name: obj.name,
          type: 'pie',
          hoverAnimation: true,
          radius: ['36%', '55%'],
          label: {
            show: true,
            fontFamily: 'PingFang SC',
            formatter: '{d}%',
            position: 'outside',
            color: this.labelColor,
            fontSize: '12'
          },
          // 视觉引导线
          labelLine: {
            normal: {
              show: true,
              length: 20,
              length2: 0,
              smooth: true
            }
          },
          data: obj.dataList
        }]
      };
      chart.setOption(option);
      setTimeout(function () {
        chart.resize()
      }, 100)
    },
    // 环形图（右侧legend）配置
    legendPieOption: function (obj) {
      var chart = this.echarts.init(document.getElementById(obj.id));
      chart.clear();
      var option = {
        // color: ['#0696ff','#2FC25B','#FACC14','#F04864','#8543E0','#5155CF'],
        color: ['#0696ff', '#41D9C7', '#2FC25B', '#FACC14', '#E7955C', '#FA7D92', '#F04864', '#D598D9'],
        tooltip: {
          show: true,
          trigger: 'item',
          // backgroundColor: '#FBFCFF',
          // borderColor: '#9FA0A3',
          borderWidth: 0,
          padding: 0,
          formatter: function (params) {
            let name = obj.tooltipName || '人数';
            let el = '<div class="tooltip-wrapper">' +
              '	<div class="tooltip-title">' +
              '		<span class="tooltip-title-icon" style="background: ' + params.color + '"></span>' +
              '		<span class="tooltip-title-text">' + params.name + '</span>' +
              '	</div>' +
              '	<div class="tooltip-content">' +
              '		<div class="tooltip-content-item">' +
              '			<span class="item-name">' + name + '：</span>' +
              '			<span class="item-value">' + params.value + '</span></div>' +
              '		<div class="tooltip-content-item">' +
              '			<span class="item-name">占比：</span>' +
              '			<span class="item-value">' + params.percent + '</span>' +
              '		</div>' +
              '	</div>' +
              '</div>'
            return el;
          },
          extraCssText: 'min-width: 100px; background-color: rgba(251,252,255,0.8)',
        },
        grid: {
          top: 10,
          left: '2%',
          right: '2%',
          bottom: '0%',
          containLabel: true
        },
        legend: {
          type: 'plain',
          orient: 'vertical',
          right: '5%',
          bottom: '15%',
          padding: 15,
          itemGap: 10,
          itemWidth: 10,
          icon: 'circle',
          borderRadius: 1,
          textStyle: {
            fontFamily: 'PingFang SC',
            fontSize: '12',
            color: this.labelColor
          },
          data: obj.legend || null
        },
        series: [{
          name: obj.name,
          type: 'pie',
          hoverAnimation: true,
          center: ['40%', '55%'],
          radius: ['36%', '55%'],
          label: {
            show: true,
            fontFamily: 'PingFang SC',
            formatter: '{d}%',
            position: 'outside',
            color: this.labelColor,
            fontSize: '14'
          },
          // 视觉引导线
          labelLine: {
            normal: {
              show: true,
              length: 20,
              length2: 0,
              smooth: true
            }
          },
          data: obj.dataList
        }]
      };
      chart.setOption(option);
      setTimeout(function () {
        chart.resize()
      }, 100)
    },
    // 单个柱形图
    singleBarOption: function (obj) {
      let that = this;
      var chart = this.echarts.init(document.getElementById(obj.id));
      chart.clear();
      var option = {
        color: ['#0696FF', '#41D9C7', '#F8D145', '#8542e0'],
        grid: {
          top: 100,
          left: '4%',
          right: '4%',
          bottom: 30,
          containLabel: true
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          padding: 0,
          formatter: function (params) {
            let el = that.barTooltipFormatter(params);
            return el;
          },
          extraCssText: 'min-width: 100px; background-color: rgba(251,252,255,0.8)',
        },
        xAxis: [{
          data: obj.xAxisData,
          axisLine: {//X轴轴线
            show: true,
            lineStyle: {
              color: this.lineColor,
              width: 1,
              type: 'solid'
            }
          },
          axisTick: {//X轴刻度
            show: false
          },
          axisLabel: {//X轴刻度标签
            show: true,
            interval: 0,
            inside: false,
            rotate: -30,
            margin: 10,
            fontSize: 12,
            textStyle: {
              color: this.labelColor
            }
          },
          splitLine: {//分隔线
            show: false
          },
          splitArea: {//分隔区域
            show: false
          }
        }],
        yAxis: [{
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            margin: 20,
            fontSize: 14,
            textStyle: {
              color: this.labelColor
            }
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: this.lineColor
            }
          },
          splitArea: {//分隔区域
            show: false
          }
        }],
        series: [{
          name: obj.seriesName,
          type: 'bar',
          barWidth: '40%',
          barMaxWidth: 30,
          label: {
            normal: {
              show: false,
              position: 'top',
              formatter: '{c}',
              color: this.labelColor,
              fontSize: 14
            }
          },
          data: obj.yAxisData
        }]
      };
      chart.setOption(option);
      setTimeout(function () {
        chart.resize()
      }, 100)
    },
    // 柱形图tooltip
    barTooltipFormatter: function (params) {
      let contentEl = '';
      let showLegend = false;
      if (params.length > 1) {
        showLegend = true;
      }
      for (let i = 0; i < params.length; i++) {
        let legend = '';
        if (showLegend) {
          legend = '<span class="item-legend" style="background: ' + params[i].color + '"></span>'
        }
        contentEl += '' +
          '<div class="tooltip-content-item">' + legend +
          '	<span class="item-name">' + params[i].seriesName + '：</span>' +
          '	<span class="item-value">' + params[i].data + '</span>' +
          '</div>' +
          ''
      }
      return '' +
        '<div class="tooltip-wrapper">' +
        '	<div class="tooltip-title">' +
        '		<span class="tooltip-title-text">' + params[0].axisValue + '</span>' +
        '	</div>' +
        '	<div class="tooltip-content">' + contentEl +
        '	</div>' +
        '</div>' +
        ''
    },
    // map tooltip
    mapTooltipFormatter: function (params) {
      let contentEl = '';
      console.log(params)
      if (!params.data) {
        return '';
      }
      contentEl += '' +
        '<div class="tooltip-content-item">' +
        '	<span class="item-name">占比：</span>' +
        '	<span class="item-value">' + params.data.rate + '%</span>' +
        '</div>' +
        '<div class="tooltip-content-item">' +
        '   <span class="item-name">用户量：</span>' +
        '   <span class="item-value">' + params.data.value + '</span>' +
        '</div>' +
        '';

      return '' +
        '<div class="tooltip-wrapper">' +
        '	<div class="tooltip-title">' +
        '		<span class="tooltip-title-icon" style="background: ' + params.color + '"></span>' +
        '		<span class="tooltip-title-text">' + params.name + '</span>' +
        '	</div>' +
        '	<div class="tooltip-content">' + contentEl +
        '	</div>' +
        '</div>' +
        '';
    },
    // 多个柱形图
    multipleBarOption: function (obj) {
      let that = this;
      var chart = this.echarts.init(document.getElementById(obj.id));
      chart.clear();
      var option = {
        color: ['#0696FF', '#41D9C7', '#F8D145', '#8542e0'], // 柱状图颜色值,
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          padding: 0,
          formatter: function (params, ticket, callback) {
            let el = that.barTooltipFormatter(params);
            return el;
          },
          extraCssText: 'min-width: 100px; background-color: rgba(251,252,255,0.8)',
        },
        legend: {
          top: '10%',
          left: '40%',
          padding: 5,
          itemGap: 20,
          itemWidth: 8,
          icon: 'circle',
          borderRadius: 1,
          data: obj.legendData,
          textStyle: {
            color: this.labelColor
          }
        },
        grid: {
          top: 100,
          left: '4%',
          right: '4%',
          bottom: 30,
          containLabel: true
        },
        xAxis: [{
          data: obj.xAxisData,
          type: 'category',
          boundaryGap: true,
          axisLine: { //X轴轴线
            show: true,
            lineStyle: {
              color: this.lineColor,
              width: 1,
              type: 'solid'
            }
          },
          axisTick: { //X轴刻度
            show: false
          },
          axisLabel: { //X轴刻度标签
            show: true,
            inside: false,
            margin: 20,
            fontSize: 14,
            textStyle: {
              color: this.labelColor
            }
          },
          splitLine: { //分隔线
            show: false
          },
          splitArea: { //分隔区域
            show: false
          }
        }],
        yAxis: [{
          axisLine: {
            show: false,
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            margin: 20,
            fontSize: 14,
            textStyle: {
              color: this.labelColor
            },
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: this.lineColor
            }
          },
          splitArea: { //分隔区域
            show: false
          }
        }],
        series: obj.yAxisData
      };
      chart.setOption(option);
      setTimeout(function () {
        chart.resize()
      }, 100)
    },
    // 横向柱形图
    transverseBarOption: function (obj) {
      let that = this;
      console.log(obj.id,document.getElementById(obj.id));
      var chart = this.echarts.init(document.getElementById(obj.id));
      chart.clear();
      var dataList = obj.xAxisData;
      var dataMax = Math.max.apply(Math, dataList);
      var dataMaxList = [];
      for (var i = 0; i < dataList.length; i++) {
        dataMaxList.push(dataMax * 1.2)
      }
      var option = {
        color: obj.colorData,
        grid: {
          top: 80,
          left: '5%',
          right: 60,
          bottom: 30,
          containLabel: true
        },
        legend: {
          show: false
        },
        xAxis: {
          axisLine: {//X轴轴线
            show: false
          },
          axisTick: {//X轴刻度
            show: false
          },
          axisLabel: {//X轴刻度标签
            show: false,
            fontSize: 14,
          },
          splitLine: {//分隔线
            show: false
          },
          splitArea: {//分隔区域
            show: false
          }
        },
        yAxis: {
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            show: true,
            fontSize: 14,
            textStyle: {
              color: this.labelColor
            },
            width: 60,
            height: 30
          },
          splitLine: {
            show: false
          },
          splitArea: {//分隔区域
            show: false
          },
          data: obj.yAxisData
        },
        series: [{
          type: 'bar',
          barGap: '-100%',
          barCategoryGap: '20%',
          barWidth: 25,
          z: -10,
          itemStyle: {
            normal: {
              color: '#0696ff'
            }
          },
          data: dataList
        }, {
          type: 'bar',
          barGap: '-100%',
          barWidth: 25,
          z: -12,
          itemStyle: {
            normal: {
              color: this.barBackground
            }
          },
          label: {
            normal: {
              show: true,
              position: 'right',
              fontSize: 14,
              fontFamily: 'PingFang SC',
              color: this.labelColor,
              offset: [5, 0],
              formatter: function (params) {
                return dataList[params.dataIndex] === 0 ? '-' : dataList[params.dataIndex] + obj.labelUnit
              }
            }
          },
          data: dataMaxList
        }]
      };
      chart.setOption(option);
      setTimeout(function () {
        chart.resize()
      }, 100)
    },
    // 折线图配置
    lineOption: function (obj) {
      let that = this;
      var chart = this.echarts.init(document.getElementById(obj.id));
      chart.clear();
      var option = {
        color: ['#0696ff', '#6EDC8C', '#2fc25b', '#facc14', '#e7955c', '#fa7d92', '#f04864', '#d598d9', '#8542e0', '#3436c7'],//颜色
        tooltip: {
          trigger: 'axis',
          padding: 0,
          formatter: function (params) {
            let el = that.barTooltipFormatter(params);
            return el;
          },
          extraCssText: 'min-width: 100px; background-color: rgba(251,252,255,0.8)',
        },
        grid: {
          top: 100,
          left: '4%',
          right: '4%',
          bottom: 30,
          containLabel: true
        },
        legend: {
          top: '10%',
          left: '40%',
          padding: 5,
          itemGap: 20,
          itemWidth: 8,
          icon: 'circle',
          borderRadius: 1,
          data: obj.legendData,
          textStyle: {
            color: this.labelColor
          }
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: obj.xAxisData,
          axisLine: {
            show: true,
            lineStyle: {
              color: this.lineColor,
              width: 1,
              type: 'solid'
            }
          },
          axisLabel: {
            show: true,
            inside: false,
            margin: 20,
            fontSize: 14,
            textStyle: {
              color: this.labelColor
            }
          },
          splitLine: {
            show: false
          },
          splitArea: {//分隔区域
            show: false
          }
        },
        yAxis: {
          type: 'value',
          axisLine: {
            show: false
          },
          axisLabel: {
            show: true,
            margin: 20,
            fontSize: 14,
            textStyle: {
              color: this.labelColor
            }
          },
          axisTick: {
            show: false
          },
          splitLine: {
            lineStyle: {
              type: 'dashed',
              color: this.lineColor
            }
          },
          splitArea: {//分隔区域
            show: false
          }
        },
        series: obj.yAxisData
      };
      chart.setOption(option);
      setTimeout(function () {
        chart.resize()
      }, 100)
    },
    /*操作系统Echart*/ /* 象形图 */
    czxtOption: function (obj) {
      var chart = this.echarts.init(document.getElementById(obj.id));
      chart.clear();
      var option = {
        grid: {
          left: '4%',
          right: '8%',
          bottom: '4%',
          containLabel: true
        },
        legend: {
          show: true,
          orient: 'horizontal',
          top: '80%',
          width: '90%',
          padding: 5,
          itemGap: 30,
          itemWidth: 8,
          icon: 'circle',
          borderRadius: 1,
          data: obj.legendData,
          textStyle: {
            color: this.labelColor,
            fontSize: '12',
          }
        },
        series: obj.xAxisData
      };
      chart.setOption(option);
      setTimeout(function () {
        chart.resize()
      }, 100)
    },
    /*会员分类占比Echart*/
    flzbOption: function (obj) {
      var chart = this.echarts.init(document.getElementById(obj.id));
      chart.clear();
      var option = {
        color: obj.colorData,
        legend: {
          // orient: 'horizontal',
          // x:center,
          // y:bottom,
          show: true,
          orient: 'horizontal',
          top: '70%',
          width: '90%',
          itemGap: 16,
          itemWidth: 8,
          icon: 'circle',
          borderRadius: 1,
          data: obj.legendData,
          textStyle: {
            color: this.labelColor,
          }
        },
        grid: {
          top: '35%',
          bottom: '10%',
          right: '7%',
          height: '30%',
          width: '100%',
          containLabel: true
        },
        xAxis: {
          show: false,
          type: 'value'
        },
        yAxis: {
          show: false,
          type: 'category',
          data: ['会员分类占比']
        },
        series: obj.seriesDataList
      };
      chart.setOption(option);
      setTimeout(function () {
        chart.resize()
      }, 100)
    },
    /* 地图配置 */
    mapOption: function (obj) {
      let that = this;
      var chart = this.echarts.init(document.getElementById(obj.id));
      chart.clear();
      var list = obj.yAxisData;
      var option = {
        tooltip: {
          position: function (point, params, dom, rect, size) {
            return [point[0], point[1] - 10]
          },
          formatter: function (params) {
            let el = that.mapTooltipFormatter(params);
            return el;
            // return params.seriesName+'<br />'+params.name+'：'+params.value
          },//数据格式化
          extraCssText: 'min-width: 140px; background-color: ' + this.mapTooltipBackground,
        },
        visualMap: {
          type: 'piecewise',
          pieces: [
            {min: 1000, label: '[1000, +)'}, // 不指定 max，表示 max 为无限大（Infinity）。
            {min: 600, max: 1000, label: '[600, 1000)'},
            {min: 300, max: 600, label: '[300, 600)'},
            {min: 100, max: 300, label: '[100, 300)'},
            {max: 100, label: '(0, 100]'},
          ],
          min: list[0].value,
          max: list[list.length - 1].value,
          left: 'left',
          top: 'bottom',
          // text: ['高','低'],
          textGap: 20,
          itemGap: 10,
          itemWidth: 30,
          inRange: {
            symbol: 'rect',
            color: this.mapColorList //取值范围的颜色
          },
          textStyle: {
            color: this.labelColor,
          },
          show: true //图注
        },
        geo: {
          map: 'china',
          roam: false,//不开启缩放和平移
          zoom: 1.1,//视角缩放比例
          label: {
            normal: {
              show: false,
            },
            emphasis: {
              show: false,
            }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(255, 255, 255, 1)',
              borderWidth: 1,
            },
            emphasis: {
              areaColor: '#F3B329',//鼠标选择区域颜色
              borderWidth: 0,
            }
          },
        },
        series: [
          {
            name: '人数',
            type: 'map',
            geoIndex: 0,
            data: list,
          }
        ]
      };
      chart.setOption(option);
      setTimeout(function () {
        chart.resize()
      }, 100)
    },


    /* 请求年龄数据*/
    queryAgeData: function (url) {
      console.log('请求年龄数据');
      console.log(this.nlzbObj)
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.nlzbObj.objData.update) {
        that.nlzbObj.objData.update = false;
      }
      // 显示加载中
      that.nlzbObj.objData.loading = true;
      console.log(that.nlzbObj.objData.update, that.nlzbObj.objData.loading, '是否加载 更新');
      // 请求
      // getAgeData(url).then(res => {
        // console.log( '请求年龄数据===', res.data)
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"ageStat":{"4":"27030245","6":"7545711","5":"4172232","3":"3569015","7":"2139155","8":"1013730","1":"892118","2":"699954","9":"515842","null":"368309","10":"356107","11":"211585","0":"29787"}}}
            if (resp.retCode ==  '0') {
                that.nlzbObj.objData.loading = false; // 隐藏加载中
                var resultData = resp.resultData;
                if(that._isEmptyObject(resultData) || that._isEmptyObject(resultData.ageStat)){
                    that.nlzbObj.objData.noData = true; // 显示无数据
                    return;
                }
                that.buildAgeData(resultData.ageStat);
            }else{
                that.nlzbObj.objData.loading = false; // 隐藏加载中
                that.nlzbObj.objData.update = true;  // 显示加载失败

            }
      // }).catch()
    },
    /* 请求性别数据 */
    queryGenderData: function (url) {
      console.log('请求性别数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.xbblObj.objData.update) {
        that.xbblObj.objData.update = false;
      }
      // 显示加载中
      that.xbblObj.objData.loading = true;
      // 请求
      // getGenderData(url).then(res => {
      //   console.log('请求性别数据===',res.data)
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"genderStat":{"0":"18778315","1":"10091121","null":"458861"}}};
        if (resp.retCode == '0') {
          that.xbblObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.genderStat)) {
            that.xbblObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildGenderData(resultData.genderStat);
        }
        else {
          that.xbblObj.objData.loading = false; // 隐藏加载中
          that.xbblObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求学历数据 */
    queryEducationData: function (url) {
      console.log('请求学历数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.xlblObj.objData.update) {
        that.xlblObj.objData.update = false;
      }
      // 显示加载中
      that.xlblObj.objData.loading = true;
      // 请求
      getEducationData(url).then(res => {
        let resp = res.data;
        if (resp.retCode == '0') {
          that.xlblObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.eduStat)) {
            that.xlblObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildEducationData(resultData.eduStat);
        }
        else {
          that.xlblObj.objData.loading = false; // 隐藏加载中
          that.xlblObj.objData.update = true;  // 显示加载失败
        }
      })
    },
    /* 请求省市分布top10数据 */
    queryProvincesData: function (url) {
      console.log('请求省市top10数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.sffbObj.objData.update) {
        that.sffbObj.objData.update = false;
      }
      // 显示加载中
      that.sffbObj.objData.loading = true;
      // 请求
      // getProvinceData(url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"provStat":{"江苏":"19143820","广东":"18550285","安徽":"16002619","浙江":"14348380","山东":"10149576","河南":"8457155","云南":"7163197","江西":"7077356","福建":"6373842","湖北":"5613667","四川":"4880667","上海":"3972399","重庆":"3396769","湖南":"3216065","辽宁":"3207823","广西":"2812337","贵州":"2372443","内蒙古":"2365863","河北":"2204018","北京":"1849781","黑龙江":"1785685","山西":"1721861","陕西":"1680739","甘肃":"1332236","吉林":"1135213","宁夏":"1064857","海南":"689466","新疆":"657403","天津":"640812","青海":"435312","西藏":"207957"}}};
        if (resp.retCode == '0') {
          that.sffbObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.provStat)) {
            that.sffbObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildProvData(resultData.provStat);
        }
        else {
          that.sffbObj.objData.loading = false; // 隐藏加载中
          that.sffbObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求城市分布数据 */
    queryCityData: function (url) {
      console.log('请求城市数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.csfbObj.objData.update) {
        that.csfbObj.objData.update = false;
      }
      // 显示加载中
      that.csfbObj.objData.loading = true;
      // 请求
      // getCityData(url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"areaStat":{"4":"9638515","5":"9436095","3":"7976833","1":"6864207","2":"6447911","6":"3245210"}}};
        if (resp.retCode == '0') {
          that.csfbObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.areaStat)) {
            that.csfbObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildCityData(resultData.areaStat);
        }
        else {
          that.csfbObj.objData.loading = false; // 隐藏加载中
          that.csfbObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求操作系统数据 */
    queryOperationData: function (url) {
      console.log('请求操作系统数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.czxtObj.objData.update) {
        that.czxtObj.objData.update = false;
      }
      // 显示加载中
      that.czxtObj.objData.loading = true;
      console.log(that.czxtObj.objData.update, '更新');
      console.log(that.czxtObj.objData.loading, '更新');
      // 请求
      // getOperationData(url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"operSysStat":{"AD":"144558067","iOS":"12414671"}}};
        if (resp.retCode == '0') {
          that.czxtObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.operSysStat)) {
            that.czxtObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildOsData(resultData.operSysStat);
        }
        else {
          that.czxtObj.objData.loading = false; // 隐藏加载中
          that.czxtObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求终端品牌数据 */
    queryTerminalData: function (url) {
      console.log('请求终端品牌数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.zdcpObj.objData.update) {
        that.zdcpObj.objData.update = false;
      }
      // 显示加载中
      that.zdcpObj.objData.loading = true;
      // 请求
      // getTerminalData(url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"terminalBrandStat":{"VIVO":"19573948","HUAWEI":"18769535","OPPO":"17465169","APPLE":"12414723","HONOR":"12298466","XIAOMI":"11895289","SAMSUNG":"6491621","HISTBANDROIDV6":"5718342","HISTBANDROIDV5":"4081547","MEIZU":"3543234"}}};
        if (resp.retCode == '0') {
          that.zdcpObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData) || that._isEmptyObject(resultData.terminalBrandStat)) {
            that.zdcpObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildPhoneData(resultData.terminalBrandStat);
        }
        else {
          that.zdcpObj.objData.loading = false; // 隐藏加载中
          that.zdcpObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求会员分类数据 */
    queryMembershipTypeData: function (url) {
      console.log('请求会员类型数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.flzbObj.objData.update) {
        that.flzbObj.objData.update = false;
      }
      // 显示加载中
      that.flzbObj.objData.loading = true;
      // 请求
      // getMembershipTypeData(url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"memberCatergoryStat":{"-998":"134231205","0":"17012996","8":"3279291","5":"818111","1":"745197","7":"313934","2":"179432","normal":"168351","3":"76506","4":"58032"}}};
        if (resp.retCode == '0') {
          that.flzbObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.memberCatergoryStat)) {
            that.flzbObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildMemberTypeData(resultData.memberCatergoryStat);
        }
        else {
          that.flzbObj.objData.loading = false; // 隐藏加载中
          that.flzbObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求会员增长数据 */
    queryMembershipGrowthData: function (url) {
      console.log('请求会员增长数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.zzqsObj.objData.update) {
        that.zzqsObj.objData.update = false;
      }
      // 显示加载中
      that.zzqsObj.objData.loading = true;
      // 请求
      getMembershipGrowthData(url).then(res => {
        let resp = res.data;
        if (resp.retCode == '0') {
          that.zzqsObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.memberIncreaseStat)) {
            that.zzqsObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildMemberIncreaseData(resultData.memberIncreaseStat);
        }
        else {
          that.zzqsObj.objData.loading = false; // 隐藏加载中
          that.zzqsObj.objData.update = true;  // 显示加载失败
        }
      })
    },

    /*构建年龄数据*/
    buildAgeData: function (ageStat) {
      var that = this;
      console.log("methods--->buildAgeData--->ageStat:", ageStat);
      //源数据：14-18岁、
      //19-22岁、23-25岁、
      //26-30岁、31-35岁、
      //36-40岁、41-45岁、46-50岁、
      //51-55岁、56-60岁、61-65岁、65岁以上
      //构建后：0-18，19-30岁，31-50岁，51-65岁，65以上
      var dataList = new Array();
      if (ageStat) {
        var arr = new Array();
        var oneDataCount = 0;
        var twoDataCount = 0;
        var threeDataCount = 0;
        var fourDataCount = 0;
        var fiveDataCount = 0;
        var sixDataCount = 0;
        var sevenDataCount = 0;
        for (var key in ageStat) {
          console.log('age data key===>', key)
          if (0 == key || key == 1) {
            oneDataCount += Number(ageStat[key]);
          }
          if (1 < key && 3 >= key) {
            twoDataCount += Number(ageStat[key]);
          }
          if (4 == key) {
            threeDataCount += Number(ageStat[key]);
          }
          if (5 == key) {
            fourDataCount += Number(ageStat[key]);
          }
          if (6 == key) {
            fiveDataCount += Number(ageStat[key]);
          }
          if (7 == key) {
            sixDataCount += Number(ageStat[key]);
          }
          if (8 <= key) {
            sevenDataCount += Number(ageStat[key]);
          }
        }
        arr[0] = that.loadRatio(oneDataCount, that.nlzbObj.objData.subValue, false, 1);
        arr[1] = that.loadRatio(twoDataCount, that.nlzbObj.objData.subValue, false, 1);
        arr[2] = that.loadRatio(threeDataCount, that.nlzbObj.objData.subValue, false, 1);
        arr[3] = that.loadRatio(fourDataCount, that.nlzbObj.objData.subValue, false, 1);
        arr[4] = that.loadRatio(fiveDataCount, that.nlzbObj.objData.subValue, false, 1);
        arr[5] = that.loadRatio(sixDataCount, that.nlzbObj.objData.subValue, false, 1);
        arr[6] = that.loadRatio(sevenDataCount, that.nlzbObj.objData.subValue, false, 1);
        dataList = that.replaceDataUtil(arr, that.nlzbObj.replaceData);
        dataList.sort(that.sortUtil());
      }
      console.log(dataList, '年龄饼图数据list');
      that.nlzbObj.objData.dataList = dataList;
      console.log("methods--->buildAgeData--->objData:", that.nlzbObj.objData);
      setTimeout(function () {
        that.pieOption(that.nlzbObj.objData);
      }, 500)
    },
    /*构建性别数据*/
    buildGenderData: function (genderStat) {
      console.log("methods--->buildGenderData--->genderStat:", genderStat);
      var that = this;
      var dataList = new Array();
      if (genderStat) {
        for (var key in genderStat) {
          if (key != 0 && key != 1) {
            delete genderStat[key];
          }
        }
        dataList = that.replaceDataUtil(genderStat, that.xbblObj.replaceData);
      }
      var totalValue = 0;
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name;
        var value = obj.value;
        totalValue += Number(value);
      }
      ;
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name;
        var value = obj.value;
        var _value = that.loadRatio(value, totalValue, true, 0);
        if ('男' == name) {
          var nanArr = new Array();
          nanArr.push(_value);
          that.xbblObj.objData.nanVal = nanArr;
        }
        if ('女' == name) {
          var nvArr = new Array();
          nvArr.push(_value);
          that.xbblObj.objData.nvVal = nvArr;
        }
      }
      ;
      console.log("methods--->buildGenderData--->objData:", that.xbblObj.objData);
    },
    /*构建学历数据*/
    buildEducationData: function (eduStat) {
      var that = this;
      console.log("methods--->buildEducationData--->eduStat:", eduStat);
      var dataList = new Array();
      if (eduStat) {
        dataList = that.replaceDataUtil(eduStat, that.xlblObj.replaceData);
      }
      var totalValue = 0;
      for (var i in dataList) {
        var obj = dataList[i];
        var value = obj.value;
        totalValue += Number(value);
      }
      ;
      var xAxisData = new Array();
      var yAxisData = new Array();
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name;
        var value = obj.value;
        var _value = that.loadRatio(value, totalValue, true, 0);
        xAxisData.push(name);
        yAxisData.push(_value);
      }
      ;
      that.xlblObj.objData.xAxisData = xAxisData;
      that.xlblObj.objData.yAxisData = yAxisData;
      console.log("methods--->buildEducationData--->objData:", that.xlblObj.objData);
      setTimeout(function () {
        that.singleBarOption(that.xlblObj.objData);
      }, 500)
      // singleBarOption(that.xlblObj.objData);
    },
    /*构建省份TOP10数据*/
    buildProvData: function (provStat) {
      console.log("methods--->buildProvData--->provStat:", provStat);
      var that = this;
      var dataList = new Array();
      if (provStat) {
        dataList = that.replaceDataUtil(provStat, that.sffbObj.replaceData);
        dataList.reverse();
      }
      // var xAxisData = new Array();
      // var yAxisData = new Array();
      var totalData = 0;
      for (var i in dataList) {
        var obj = dataList[i];
        totalData += Number(obj.value);
      }
      ;
      for (var i in dataList) {
        var obj = dataList[i];
        // var name = obj.name;
        // var value = that.loadRatio(obj.value,that.sffbObj.objData.subValue,false,1);
        // xAxisData.push(value);
        // yAxisData.push(name);
        obj.rate = ((Number(obj.value) / totalData) * 100).toFixed(1);
        obj.value = Number(that.loadRatio(obj.value, that.sffbObj.objData.subValue, false, 1));
      }
      ;
      dataList.sort(function (a, b) {
        return b.value - a.value;
      })
      // that.sffbObj.objData.xAxisData = xAxisData;
      // that.sffbObj.objData.yAxisData = yAxisData;
      that.sffbObj.objData.yAxisData = dataList;
      console.log("methods--->buildProvData--->objData:", that.sffbObj.objData);
      setTimeout(function () {
        that.mapOption(that.sffbObj.objData);
      }, 500)
      // that.mapOption(that.sffbObj.objData);
    },
    /*构建城市数据*/
    buildCityData: function (areaStat) {
      console.log("methods--->buildCityData--->areaStat:", areaStat);
      var that = this;
      var dataList = new Array();
      if (areaStat) {
        dataList = that.replaceDataUtil(areaStat, that.csfbObj.replaceData);
        for (var i in dataList) {
          var obj = dataList[i];
          dataList[i].value = that.loadRatio(obj.value, that.csfbObj.objData.subValue, false, 1);
        }
        ;
        dataList.sort(that.sortUtil());
      }
      that.csfbObj.objData.dataList = dataList;
      console.log("methods--->buildCityData--->objData:", that.csfbObj.objData);
      setTimeout(function () {
        that.pieOption(that.csfbObj.objData);
      }, 500)
      // that.pieOption(that.csfbObj.objData);
    },
    /*构建操作系统数据*/
    buildOsData: function (operSysStat) {

      var that = this;
      console.log("methods--->buildOsData--->operSysStat:", operSysStat);
      var dataList = new Array();
      if (operSysStat) {
        dataList = that.replaceDataUtil(operSysStat, that.zdcpObj.replaceData);
      }
      var totalValue = 0;
      for (var i in dataList) {
        var obj = dataList[i];
        var value = obj.value;
        totalValue += Number(value);
      }
      ;
      var length = dataList.length;
      var centerData = new Array();
      switch (length) {
        case 1:
          centerData = [['50%', '50%']];
          break;
        case 2:
          centerData = [['30%', '50%'], ['70%', '50%']];
          break;
        case 3:
          centerData = [['20%', '50%'], ['50%', '50%'], ['80%', '50%']];
          break;
      }
      var colorList = that.pictogramColor;
      var legendData = new Array();
      var xAxisData = new Array();
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name;
        var value = obj.value;
        var _value = that.loadRatio(value, totalValue, false, 4);
        var data = new Array();
        data.push(
          {
            value: _value,
            itemStyle: {
              color: colorList[i]
            }
          })
        var obj = {
          type: 'liquidFill',
          name: '',
          data: [],
          radius: '38%',
          color: '',
          center: '',
          outline: {
            borderDistance: 5,
            itemStyle: {
              borderWidth: 8,
              borderColor: ''
            },
          },
          backgroundStyle: {
            color: this.pictogramBackground
          },
          label: {
            normal: {
              textStyle: {
                color: this.labelColor,
                fontSize: 36
              }
            }
          },
          itemStyle: {
            opacity: 0.7
          }
        }
        obj.name = name;
        obj.data = data;
        obj.color = colorList[i];
        obj.center = centerData[i];
        obj.outline.itemStyle.borderColor = colorList[i];
        legendData.push(name);
        xAxisData.push(obj);
      }
      console.log("methods--->buildOsData--->legendData:", legendData);
      console.log("methods--->buildOsData--->xAxisData:", JSON.stringify(xAxisData));
      that.czxtObj.objData.legendData = legendData;
      that.czxtObj.objData.xAxisData = xAxisData;
      console.log("methods--->buildOsData--->objData:", that.czxtObj.objData);
      setTimeout(function () {
        that.czxtOption(that.czxtObj.objData);
      }, 500)
      // that.czxtOption(that.czxtObj.objData);
    },
    /*构建终端产品数据*/
    buildPhoneData: function (terminalBrandStat) {
      var that = this;
      console.log("methods--->buildPhoneData--->terminalBrandStat:", terminalBrandStat);
      var dataList = new Array();
      if (terminalBrandStat) {
        dataList = that.replaceDataUtil(terminalBrandStat, that.zdcpObj.replaceData);
      }

      var xAxisData = new Array();
      var yAxisData = new Array();
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name;
        var value = that.loadRatio(obj.value, that.zdcpObj.objData.subValue, false, 1);
        ;
        xAxisData.push(name);
        yAxisData.push(value);
      }
      ;
      that.zdcpObj.objData.xAxisData = xAxisData;
      that.zdcpObj.objData.yAxisData = yAxisData;
      console.log("methods--->buildPhoneData--->objData:", that.zdcpObj.objData);
      setTimeout(function () {
        that.singleBarOption(that.zdcpObj.objData);
      }, 500)
      // that.singleBarOption(that.zdcpObj.objData);
    },
    /*构建会员分类数据*/
    buildMemberTypeData: function (memberCatergoryStat) {
      var that = this;
      console.log("methods--->buildMemberTypeData--->memberCatergoryStat:", memberCatergoryStat);
      var dataList = new Array();
      //有效数据[5,12]
      if (memberCatergoryStat) {
        for (var key in memberCatergoryStat) {
          if (isNaN(Number(key)) || key < 5 || key > 12) {
            delete memberCatergoryStat[key];
          }
        }
        console.log("methods--->buildMemberTypeData--->-------memberCatergoryStat:", memberCatergoryStat);
        dataList = that.replaceDataUtil(memberCatergoryStat, that.flzbObj.replaceData);
        console.log("methods--->buildMemberTypeData--->-------dataList:", dataList);
      }
      var totalValue = 0;
      for (var i in dataList) {
        var obj = dataList[i];
        var value = obj.value;
        totalValue += Number(value);
      }
      ;
      var legendData = new Array();
      var seriesDataList = new Array();
      var _normal = new Object();
      _normal.show = true;
      _normal.formatter = '{c}%';
      _normal.fontSize = '12';
      _normal.position = 'top';
      _normal.distance = 10;
      _normal.color = this.labelColor;
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name;
        var value = obj.value;
        legendData.push(name);
        var value = that.loadRatio(value, totalValue, true, 0);
        var obj = new Object();
        var objData = new Array();
        objData.push(value);
        obj.name = name;
        obj.data = objData;
        obj.type = 'bar';
        obj.stack = '总量';
        obj.label = _normal;
        seriesDataList.push(obj);
      }
      ;
      that.flzbObj.objData.legendData = legendData;
      that.flzbObj.objData.seriesDataList = seriesDataList;
      console.log("methods--->buildMemberTypeData--->objData:", that.flzbObj.objData);
      setTimeout(function () {
        that.flzbOption(that.flzbObj.objData);
      }, 500)
      // that.flzbOption(that.flzbObj.objData);
    },
    /*构建会员增长数据*/
    buildMemberIncreaseData: function (memberIncreaseStat) {
      var that = this;
      console.log("methods--->buildMemberIncreaseData--->memberIncreaseStat:", memberIncreaseStat);
      var dataList = new Array();
      if (memberIncreaseStat) {
        dataList = that.replaceDataUtil(memberIncreaseStat, that.zzqsObj.replaceData);
      }
      var xAxisData = new Array();
      var yAxisData = new Array();
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name + '月';
        var value = obj.value;
        xAxisData.push(name);
        yAxisData.push(value);
      }
      ;
      that.zzqsObj.objData.xAxisData = xAxisData;
      that.zzqsObj.objData.yAxisData[0].data = yAxisData;
      console.log("methods--->buildMemberIncreaseData--->objData:", that.zzqsObj.objData);
      setTimeout(function () {
        that.lineOption(that.zzqsObj.objData);
      }, 500)
      //  that.lineOption(that.zzqsObj.objData);
    },


    /* 请求访问次数数据 */
    queryVisitData: function (url) {
      console.log('请求访问次数数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.fwcsObj.objData.update) {
        that.fwcsObj.objData.update = false;
      }
      // 显示加载中
      that.fwcsObj.objData.loading = true;
      // 请求
      getVisitData(url).then(res => {
        let resp = res.data;
        if (resp.retCode == '0') {
          that.fwcsObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.visitTimesStat)) {
            that.fwcsObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildVisitData(resultData.visitTimesStat);
        }
        else {
          that.fwcsObj.objData.loading = false; // 隐藏加载中
          that.fwcsObj.objData.update = true;  // 显示加载失败
        }
      })
    },
    /* 请求时间段占比数据 */
    queryPeriodData: function (url) {
      console.log('请求时间段占比数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.hyxxObj.objData.update) {
        that.hyxxObj.objData.update = false;
      }
      // 显示加载中
      that.hyxxObj.objData.loading = true;
      // 请求
      getPeriodRateData(url).then(res => {
        let resp = res.data;
        if (resp.retCode == '0') {
          that.hyxxObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.timeRateStat)) {
            that.hyxxObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildVisitPeriodData(resultData.timeRateStat);
        }
        else {
          that.hyxxObj.objData.loading = false; // 隐藏加载中
          that.hyxxObj.objData.update = true;  // 显示加载失败
        }
      })
    },
    /* 请求平均使用时长数据 */
    queryUsedurData: function (url) {
      console.log('请求平均使用时长数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.syscObj.objData.update) {
        that.syscObj.objData.update = false;
      }
      // 显示加载中
      that.syscObj.objData.loading = true;
      // 请求
      getUsedurData(url).then(res => {
        let resp = res.data;
        if (resp.retCode == '0') {
          that.syscObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.dayUseDurStat)) {
            that.syscObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildVisitTimeData(resultData.dayUseDurStat);
        }
        else {
          that.syscObj.objData.loading = false; // 隐藏加载中
          that.syscObj.objData.update = true;  // 显示加载失败
        }
      })
    },
    /* 请求行为类型数据 */
    queryActionData: function (url) {
      console.log('请求行为类型数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.hdxwObj.objData.update) {
        that.hdxwObj.objData.update = false;
      }
      // 显示加载中
      that.hdxwObj.objData.loading = true;
      // 请求
      getActionTypeData(url).then(res => {
        let resp = res.data;
        if (resp.retCode == '0') {
          that.hdxwObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.actionTypeStat)) {
            that.hdxwObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildSocialData(resultData.actionTypeStat);
        }
        else {
          that.hdxwObj.objData.loading = false; // 隐藏加载中
          that.hdxwObj.objData.update = true;  // 显示加载失败
        }
      })
    },
    /* 请求社交活跃度数据 */
    queryActivityData: function (url) {
      console.log('请求社交活跃度趋势数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.shhyObj.objData.update) {
        that.shhyObj.objData.update = false;
      }
      // 显示加载中
      that.shhyObj.objData.loading = true;
      // 请求
      getActivityData(url).then(res => {
        let resp = res.data;
        if (resp.retCode == '0') {
          that.shhyObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.activeTendStat)) {
            that.shhyObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildTrendData(resultData.activeTendStat);
        }
        else {
          that.shhyObj.objData.loading = false; // 隐藏加载中
          that.shhyObj.objData.update = true;  // 显示加载失败
        }
      })
    },

    /*构建访问次数数据*/
    buildVisitData: function (visitTimesStat) {
      console.log("methods--->buildVisitData--->dataList:", dataList);
      var that = this;
      var dataList = new Array();
      if (visitTimesStat) {
        dataList = that.replaceTimeDataUtil(visitTimesStat, that.fwcsObj.replaceData);
      }
      var xAxisData = new Array();
      var yAxisData = new Array();
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name;
        var value = that.loadRatio(obj.value, that.fwcsObj.objData.subValue, false, 1);
        xAxisData.push(name);
        yAxisData.push(value);
      }
      ;
      that.fwcsObj.objData.xAxisData = xAxisData;
      that.fwcsObj.objData.yAxisData = yAxisData;
      console.log("methods--->buildVisitData--->objData:", that.fwcsObj.objData);
      setTimeout(function () {
        that.singleBarOption(that.fwcsObj.objData);
      }, 500)
      // that.singleBarOption(that.fwcsObj.objData);
    },
    /*构建访问时间段数据*/
    buildVisitPeriodData: function (timeRateStat) {
      console.log("methods--->buildVisitPeriodData--->dataList:", dataList);
      var that = this;
      var dataList = new Array();
      if (timeRateStat) {
        for (var key in timeRateStat) {
          if ('-998' == key) {
            delete timeRateStat[key];
            break;
          }
        }
        dataList = that.replaceDataUtil(timeRateStat, that.hyxxObj.replaceData);
        for (var i in dataList) {
          var obj = dataList[i];
          dataList[i].value = that.loadRatio(obj.value, that.hyxxObj.objData.subValue, false, 1);
        }
        ;
        dataList.sort(that.sortUtil());
      }
      that.hyxxObj.objData.dataList = dataList;
      console.log("methods--->buildVisitPeriodData--->objData:", that.hyxxObj.objData);
      setTimeout(function () {
        that.pieOption(that.hyxxObj.objData);
      }, 500)
      //  that.pieOption(that.hyxxObj.objData);
    },
    /*构建平均天使用时长数据*/
    buildVisitTimeData: function (dayUseDurStat) {
      console.log("methods--->buildVisitTimeData--->dataList:", dataList);
      var that = this;
      var dataList = new Array();
      if (dayUseDurStat) {
        dataList = that.replaceDataUtil(dayUseDurStat, that.syscObj.replaceData);
        dataList.reverse();
      }
      var totalValue = 0;
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name;
        var value = obj.value;
        totalValue += Number(value);
      }
      ;
      var xAxisData = new Array();
      var yAxisData = new Array();
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name;
        var value = that.loadRatio(obj.value, totalValue, true, 1);
        xAxisData.push(value);
        yAxisData.push(name);
      }
      ;
      that.syscObj.objData.xAxisData = xAxisData;
      that.syscObj.objData.yAxisData = yAxisData;
      console.log("methods--->buildVisitTimeData--->objData:", that.syscObj.objData);
      setTimeout(function () {
        that.transverseBarOption(that.syscObj.objData);
      }, 500)
      // that.transverseBarOption(that.syscObj.objData);
    },
    /*构建类型比例数据*/
    buildSocialData: function (actionTypeStat) {
      console.log("methods--->buildSocialData--->actionTypeStat:", actionTypeStat);
      var that = this;
      var dataList = new Array();
      if (actionTypeStat) {
        dataList = that.replaceDataUtil(actionTypeStat, that.hdxwObj.replaceData);
        for (var i in dataList) {
          var obj = dataList[i];
          dataList[i].value = that.loadRatio(obj.value, that.hdxwObj.objData.subValue, false, 1);
        }
        ;
        dataList.sort(that.sortUtil());
      }
      that.hdxwObj.objData.dataList = dataList;
      console.log("methods--->buildSocialData--->objData:", that.hdxwObj.objData);
      setTimeout(function () {
        that.pieOption(that.hdxwObj.objData);
      }, 500)
      // that.pieOption(that.hdxwObj.objData);
    },
    /*构建趋势数据*/
    buildTrendData: function (dataList) {
      console.log("methods--->buildSocialData--->dataList:", dataList);
      var that = this;
      //that.hdxwObj.objData.dataList = dataList;
      console.log("methods--->buildSocialData--->objData:", that.shhyObj.objData);
      setTimeout(function () {
        that.lineOption(that.shhyObj.objData);
      }, 500)
      // that.lineOption(that.shhyObj.objData);
    },


    /* 请求消费类型数据 */
    queryTypeData: function (url) {
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.typeObj.objData.update) {
        that.typeObj.objData.update = false;
      }
      // 显示加载中
      that.typeObj.objData.loading = true;
      // 请求
      // getConsumeTypeData(url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"consumeTypeStat":{"BOSS_MONTH":"1056572","DAY":"478238","1 MONTH":"365479","HOUR":"337188","3 MONTH":"5513","12 MONTH":"1336","6 MONTH":"114","YEAR":"4"}}};
        if (resp.retCode == '0') {
          that.typeObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.consumeTypeStat)) {
            that.typeObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildTypeData(resultData.consumeTypeStat);
        }
        else {
          that.typeObj.objData.loading = false; // 隐藏加载中
          that.typeObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求消费能力数据 */
    queryAbilityData: function (url) {
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.abilityObj.objData.update) {
        that.abilityObj.objData.update = false;
      }
      // 显示加载中
      that.abilityObj.objData.loading = true;
      // 请求
      // getConsumeAbilityData(url).then(res =>  {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"consumeAblityStat":{"lt":571856,"mi":630,"gt":5435642}}};
        if (resp.retCode == '0') {
          that.abilityObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.consumeAblityStat)) {
            that.abilityObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildAbilityData(resultData.consumeAblityStat);
        }
        else {
          that.abilityObj.objData.loading = false; // 隐藏加载中
          that.abilityObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求消费结构-性别数据 */
    queryConsumeGenderData: function (url) {
      console.log('请求消费结构性别数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.xbxfObj.objData.update) {
        that.xbxfObj.objData.update = false;
      }
      // 显示加载中
      that.xbxfObj.objData.loading = true;
      // 请求
      // getConsumeGenderData(url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"consumeGenderStat":{"0":46336119180,"1":27236431294,"null":724618568}}};
        if (resp.retCode == '0') {
          that.xbxfObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          var Datas = resultData.consumeGenderStat || resultData.consumeGender
          if (that._isEmptyObject(resultData) || that._isEmptyObject(Datas)) {
            that.xbxfObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildConsumeGenderData(Datas);
        }
        else {
          that.xbxfObj.objData.loading = false; // 隐藏加载中
          that.xbxfObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求消费结构-年龄数据 */
    queryConsumeAgeData: function (url) {
      console.log('请求消费结构年龄数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.nlxfObj.objData.update) {
        that.nlxfObj.objData.update = false;
      }
      // 显示加载中
      that.nlxfObj.objData.loading = true;
      // 请求
      // getConsumeAgeData(url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"consumeAgeStat":{"11":333723183,"0":101036650,"1":2155295785,"2":2223587800,"3":11689099637,"4":24547789643,"null":513520412,"5":12155388884,"6":11871890105,"7":5475229127,"8":2600615260,"9":1245026145,"10":723656066}}};
        if (resp.retCode == '0') {
          that.nlxfObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          var Datas = resultData.consumeAgeStat || resultData.consumeGender
          if (that._isEmptyObject(resultData) || that._isEmptyObject(Datas)) {
            that.nlxfObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildConsumeAgeData(Datas);
        }
        else {
          that.nlxfObj.objData.loading = false; // 隐藏加载中
          that.nlxfObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求消费结构-城市数据 */
    queryConsumeCityData: function (url) {
      console.log('请求消费结构城市数据');
      let that = this;
      // 如果是失败刷新 隐藏update
      if (that.csxfObj.objData.update) {
        that.csxfObj.objData.update = false;
      }
      // 显示加载中
      that.csxfObj.objData.loading = true;
      // 请求
      // getConsumeCityData(url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"consumeCityStat":{"1":16391709367,"2":7376177578,"3":12021273636,"4":11510734027,"5":20402846359,"6":13376200304}}};
        if (resp.retCode == '0') {
          that.csxfObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          var Datas = resultData.consumeCityStat || resultData.consumeGender
          if (that._isEmptyObject(resultData) || that._isEmptyObject(Datas)) {
            that.csxfObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildConsumeCityData(Datas);
        }
        else {
          that.csxfObj.objData.loading = false; // 隐藏加载中
          that.csxfObj.objData.update = true;  // 显示加载失败
        }
      // })
    },

    /*构建消费类型*/
    buildTypeData: function (consumeTypeStat) {
      console.log("methods--->buildTypeData--->consumeTypeStat:", consumeTypeStat, this);
      var that = this;
      var dataList = new Array();
      var filterData = {};
      if (consumeTypeStat) {
        for (var key in consumeTypeStat) {
          console.log(key)
          if ('DAY' == key || 'HOUR' == key || 'BOSS_MONTH' == key || '1 MONTH' == key || '3 MONTH' == key || '6 MONTH' == key || '12 MONTH' == key) {
            filterData[key] = consumeTypeStat[key];
          }
        }
        dataList = that.replaceDataUtil(filterData, that.typeObj.replaceData);
        for (var i in dataList) {
          var obj = dataList[i];
          dataList[i].value = that.loadRatio(obj.value, that.typeObj.objData.subValue, false, 1);
        }
        ;
        dataList.sort(that.sortUtil());
      }
      that.typeObj.objData.dataList = dataList;
      console.log("methods--->buildTypeData--->objData:", that.typeObj.objData);
      setTimeout(function () {
        that.legendPieOption(that.typeObj.objData);
      }, 500)
      // that.legendPieOption(that.typeObj.objData);
    },
    /*构建消费能力*/
    buildAbilityData: function (consumeAbilityStat) {
      console.log("methods--->buildAbilityData--->consumeAbilityStat:", consumeAbilityStat);
      var that = this;
      var dataList = new Array();
      if (consumeAbilityStat) {
        dataList = that.replaceDataUtil(consumeAbilityStat, that.abilityObj.replaceData);
        for (var i in dataList) {
          var obj = dataList[i];
          dataList[i].value = that.loadRatio(obj.value, that.abilityObj.objData.subValue, false, 1);
        }
        ;
        dataList.sort(that.sortUtil());
      }
      that.abilityObj.objData.dataList = dataList;
      console.log("methods--->buildAbilityData--->objData:", that.abilityObj.objData);
      setTimeout(function () {
        that.legendPieOption(that.abilityObj.objData);
      }, 500)
      // that.legendPieOption(that.abilityObj.objData);
    },
    /* 构建消费结构-性别*/
    buildConsumeGenderData: function (genderStat) {
      console.log("methods--->buildConsumeGenderData--->genderStat:", genderStat);
      var that = this;
      var dataList = new Array();
      if (genderStat) {
        for (var key in genderStat) {
          if (key != 0 && key != 1) {
            delete genderStat[key];
          }
        }
        dataList = that.replaceDataUtil(genderStat, that.xbxfObj.replaceData);
      }
      var totalValue = 0;
      for (var i in dataList) {
        var obj = dataList[i];
        var value = obj.value;
        totalValue += Number(value);
      }
      ;
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name;
        var value = that.loadRatio(obj.value, that.xbxfObj.objData.subValue, false, 1);
        var _value = that.loadRatio(obj.value, totalValue, true, 0);
        if ('男' == name) {
          var nanArr = new Array();
          nanArr.push(value);
          that.xbxfObj.objData.nanRatio = _value;
          that.xbxfObj.objData.nanVal = nanArr;
        }
        if ('女' == name) {
          var nvArr = new Array();
          nvArr.push(value);
          that.xbxfObj.objData.nvRatio = _value;
          that.xbxfObj.objData.nvVal = nvArr;
        }
      }
      ;
      console.log("methods--->buildGenderData--->objData:", that.xbxfObj.objData);
    },
    /* 构建消费结构-年龄数据*/
    buildConsumeAgeData: function (ageStat) {
      var that = this;
      console.log("methods--->buildAgeData--->ageStat:", ageStat);
      //源数据：14-18岁、
      //19-22岁、23-25岁、
      //26-30岁、31-35岁、
      //36-40岁、41-45岁、46-50岁、
      //51-55岁、56-60岁、61-65岁、65岁以上
      //构建后：0-18，19-30岁，31-50岁，51-65岁，65以上
      var dataList = new Array();
      if (ageStat) {
        var arr = new Array();
        var oneDataCount = 0;
        var twoDataCount = 0;
        var threeDataCount = 0;
        var fourDataCount = 0;
        var fiveDataCount = 0;
        for (var key in ageStat) {
          console.log('age data key===>', key)
          if (0 == key) {
            oneDataCount += Number(ageStat[key]);
          }
          if (1 <= key && 3 >= key) {
            twoDataCount += Number(ageStat[key]);
          }
          if (4 <= key && 7 >= key) {
            threeDataCount += Number(ageStat[key]);
          }
          if (8 <= key && 10 >= key) {
            fourDataCount += Number(ageStat[key]);
          }
          if (11 <= key) {
            fiveDataCount += Number(ageStat[key]);
          }
        }
        arr[0] = that.loadRatio(oneDataCount, that.nlxfObj.objData.subValue, false, 1);
        arr[1] = that.loadRatio(twoDataCount, that.nlxfObj.objData.subValue, false, 1);
        arr[2] = that.loadRatio(threeDataCount, that.nlxfObj.objData.subValue, false, 1);
        arr[3] = that.loadRatio(fourDataCount, that.nlxfObj.objData.subValue, false, 1);
        arr[4] = that.loadRatio(fiveDataCount, that.nlxfObj.objData.subValue, false, 1);
        dataList = that.replaceDataUtil(arr, that.nlxfObj.replaceData);
        dataList.sort(that.sortUtil());
      }
      console.log(dataList, '年龄饼图数据list');
      that.nlxfObj.objData.dataList = dataList;
      console.log("methods--->buildAgeData--->objData:", that.nlxfObj.objData);
      setTimeout(function () {
        that.pieOption(that.nlxfObj.objData);
      }, 500)
      // that.pieOption(that.nlxfObj.objData);
    },
    /* 构建消费结构-城市级别数据*/
    buildConsumeCityData: function (cityStat) {
      console.log("methods--->buildConsumeCityData--->cityStat:", cityStat);
      var that = this;
      var dataList = new Array();
      if (cityStat) {
        dataList = that.replaceDataUtil(cityStat, that.csxfObj.replaceData);
      }
      var xAxisData = new Array();
      var yAxisData = new Array();
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name;
        var value = that.loadRatio(obj.value, that.csxfObj.objData.subValue, false, 1);
        xAxisData.push(name);
        yAxisData.push(value);
      }
      ;
      that.csxfObj.objData.xAxisData = xAxisData;
      that.csxfObj.objData.yAxisData = yAxisData;
      console.log("methods--->buildConsumeCityData--->objData:", that.csxfObj.objData);
      setTimeout(function () {
        that.singleBarOption(that.csxfObj.objData);
      }, 500)
      // that.singleBarOption(that.csxfObj.objData);
    },


    /* 请求视频比例数据 */
    queryVideoData: function (params,url) {
      let that = this;
      that.clearEchart(that.spblObj.objData.id);
      // 如果是失败刷新 隐藏update
      if (that.spblObj.objData.update) {
        that.spblObj.objData.update = false;
      }
      // 显示加载中
      that.spblObj.objData.loading = true;
      console.log(that.spblObj.objData.loading, '消费能力加载中');
      // 请求
      // getVideoData(params,url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"videoTypeStat":{"last_month_long_video_vv":1.34360786E8,"last_month_short_video_vv":2.1157351E7}}};
        if (resp.retCode == '0') {
          that.spblObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.videoTypeStat)) {
            that.spblObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildSpblData(resultData.videoTypeStat);
        }
        else {
          that.spblObj.objData.loading = false; // 隐藏加载中
          that.spblObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求播放次数数据 */
    queryPlayData: function (params,url) {
      console.log('请求播放次数数据');
      let that = this;
      that.clearEchart(that.spbfObj.objData.id);
      // 如果是失败刷新 隐藏update
      if (that.spbfObj.objData.update) {
        that.spbfObj.objData.update = false;
      }
      // 显示加载中
      that.spbfObj.objData.loading = true;
      // 请求
      var param = params || {}
      // getPlayCountData(params,url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"playTimesStat":{"last_month_cv":5.9135275E7,"last_12month_vv":3.01808551E8,"last_month_vv":6.4066827E7,"last_12month_cv":2.82880992E8,"last_3month_cv":1.25662043E8,"last_3month_vv":1.34654056E8,"last_6month_vv":2.10172191E8,"last_6month_cv":1.97369277E8}}};
        if (resp.retCode == '0') {
          that.spbfObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.playTimesStat)) {
            that.spbfObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildVvcvData(resultData.playTimesStat);
        }
        else {
          that.spbfObj.objData.loading = false; // 隐藏加载中
          that.spbfObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求一级分类数据 */
    queryCategoryData: function (params,url) {
      let that = this;
      that.clearEchart(that.yjflObj.objData.id);
      // 如果是失败刷新 隐藏update
      if (that.yjflObj.objData.update) {
        that.yjflObj.objData.update = false;
      }
      // 显示加载中
      that.yjflObj.objData.loading = true;
      console.log(that.yjflObj.objData.loading, '消费能力加载中')
      // 请求
      // getCategoryData(params,url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"oneClassStat":{"last_month_sport_vv":1982020.0,"last_month_variety_vv":1.0108383E7,"last_month_tv_vv":1.17817373E8,"last_month_comic_vv":1349732.0,"last_month_education_vv":685678.0,"last_month_record_vv":1359413.0,"last_month_music_vv":156030.0,"last_month_film_vv":1.3647743E7,"last_month_art_vv":5017.0,"last_month_child_vv":3089346.0}}};
        if (resp.retCode == '0') {
          that.yjflObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.oneClassStat)) {
            that.yjflObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildYjflData(resultData.oneClassStat);
        }
        else {
          that.yjflObj.objData.loading = false; // 隐藏加载中
          that.yjflObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求性别偏好 */
    queryGenderPreferenceData: function (params,url) {
      let that = this;
      that.clearEchart(that.xbzsObj.objData.id);
      // 如果是失败刷新 隐藏update
      if (that.xbzsObj.objData.update) {
        that.xbzsObj.objData.update = false;
      }
      // 显示加载中
      that.xbzsObj.objData.loading = true;
      // 请求
      // getPlayGenderData(params,url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"sexLikeStat":{"0":{"last_month_sport_vv":1122344,"last_month_variety_vv":4159346,"last_month_tv_vv":47192816,"last_month_comic_vv":600755,"last_month_education_vv":270138,"last_month_record_vv":685592,"last_month_music_vv":74193,"last_month_film_vv":7026636,"last_month_art_vv":2365,"last_month_child_vv":1222926},"1":{"last_month_sport_vv":789467,"last_month_variety_vv":5634984,"last_month_tv_vv":62223006,"last_month_comic_vv":640187,"last_month_education_vv":329135,"last_month_record_vv":583241,"last_month_music_vv":72994,"last_month_film_vv":5873474,"last_month_art_vv":2346,"last_month_child_vv":1758343}}}};
        if (resp.retCode == '0') {
          that.xbzsObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.sexLikeStat)) {
            that.xbzsObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildSexData(resultData.sexLikeStat);
        }
        else {
          that.xbzsObj.objData.loading = false; // 隐藏加载中
          that.xbzsObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求城市偏好 */
    queryCityPreferenceData: function (params,url) {
      let that = this;
      that.clearEchart(that.cszsObj.objData.id);
      // 如果是失败刷新 隐藏update
      if (that.cszsObj.objData.update) {
        that.cszsObj.objData.update = false;
      }
      // 显示加载中
      that.cszsObj.objData.loading = true;
      // 请求
      // getPlayCityData(params,url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"cityLikeStat":{"1":{"last_month_sport_vv":812165,"last_month_variety_vv":3789191,"last_month_tv_vv":42285883,"last_month_comic_vv":383635,"last_month_education_vv":118312,"last_month_record_vv":450202,"last_month_music_vv":47208,"last_month_film_vv":4415038,"last_month_art_vv":1539,"last_month_child_vv":694793},"2":{"last_month_sport_vv":347346,"last_month_variety_vv":2017825,"last_month_tv_vv":24203314,"last_month_comic_vv":228224,"last_month_education_vv":82748,"last_month_record_vv":240709,"last_month_music_vv":27224,"last_month_film_vv":2572773,"last_month_art_vv":772,"last_month_child_vv":436975},"3":{"last_month_sport_vv":284202,"last_month_variety_vv":1674536,"last_month_tv_vv":19853331,"last_month_comic_vv":261279,"last_month_education_vv":37757,"last_month_record_vv":209432,"last_month_music_vv":26137,"last_month_film_vv":2385315,"last_month_art_vv":976,"last_month_child_vv":574376},"4":{"last_month_sport_vv":351265,"last_month_variety_vv":2051688,"last_month_tv_vv":23300198,"last_month_comic_vv":355054,"last_month_education_vv":284539,"last_month_record_vv":320125,"last_month_music_vv":42136,"last_month_film_vv":3166677,"last_month_art_vv":1352,"last_month_child_vv":1143796}}}};
        if (resp.retCode == '0') {
          that.cszsObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          if (that._isEmptyObject(resultData) || that._isEmptyObject(resultData.cityLikeStat)) {
            that.cszsObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildCityPreferenceData(resultData.cityLikeStat);
        }
        else {
          that.cszsObj.objData.loading = false; // 隐藏加载中
          that.cszsObj.objData.update = true;  // 显示加载失败
        }
      // })
    },

    /*构建长、短视频数据*/
    buildSpblData: function (videoTypeStat) {
      console.log("methods--->buildspblData--->videoTypeStat:", videoTypeStat);
      var that = this;
      var dataList = new Array();
      if (videoTypeStat) {
        dataList = that.replaceDataUtil(videoTypeStat, that.spblObj.replaceData);
        for (var i in dataList) {
          var obj = dataList[i];
          dataList[i].value = that.loadRatio(obj.value, that.spblObj.objData.subValue, false, 1);
        }
        ;
        dataList.sort(that.sortUtil());
      }
      that.spblObj.objData.dataList = dataList;
      console.log("methods--->buildspblData--->objData:", that.spblObj.objData);
      setTimeout(function () {
        that.pieOption(that.spblObj.objData);
      }, 500)
      // that.pieOption(that.spblObj.objData);
    },
    /*构建播放次数数据 vvDataList:播放次数  cvDataList:正片播放次数*/
    buildVvcvData: function (data) {
      console.log("methods--->buildVvcvData--->data:", data);
      var that = this;
      var vvObj = new Object();
      var cvObj = new Object();
      for (var key in data) {
        if (key.lastIndexOf("cv") > 0) {
          cvObj[key] = data[key];
        }
        else {
          vvObj[key] = data[key];
        }
      }
      var vvDataList = new Array();
      if (vvObj) {
        vvDataList = that.replaceTimeDataUtil(vvObj, that.spbfObj.replaceVvData);
      }
      var cvDataList = new Array();
      if (cvObj) {
        cvDataList = that.replaceTimeDataUtil(cvObj, that.spbfObj.replaceCvData);
      }
      var legendData = ['播放次数', '正片播放次数'];
      var xAxisData = ['近1个月', '近3个月', '近6个月', '近1年'];
      var vvData = ['0', '0', '0', '0'];
      var cvData = ['0', '0', '0', '0'];
      for (var i in xAxisData) {
        var xName = xAxisData[i];
        for (var j in vvDataList) {
          var obj = vvDataList[j];
          var name = obj.name;
          var value = that.loadRatio(obj.value, that.spbfObj.objData.subValue, false, 1);
          ;
          if (xName == name) {
            vvData[i] = value;
            break;
          }
        }
        for (var k in cvDataList) {
          var obj = cvDataList[k];
          var name = obj.name;
          var value = that.loadRatio(obj.value, that.spbfObj.objData.subValue, false, 1);
          ;
          if (xName == name) {
            cvData[i] = value;
            break;
          }
        }

      }
      var vvAxisData = new Object();
      vvAxisData.name = '播放次数';
      vvAxisData.type = 'bar';
      vvAxisData.barGap = 0.2;
      vvAxisData.barWidth = '20%';
      vvAxisData.label = {
        normal: {
          show: false,
          position: 'top',
          formatter: '{c}',
          color: '#f2f2f2',
          fontSize: 14,
        }
      };
      vvAxisData.data = vvData;
      var cvAxisData = new Object();
      cvAxisData.name = '正片播放次数';
      cvAxisData.type = 'bar';
      cvAxisData.barGap = 0.2,
        cvAxisData.barWidth = '20%',
        cvAxisData.label = {
          normal: {
            show: false,
            position: 'top',
            formatter: '{c}',
            color: '#f2f2f2',
            fontSize: 14,
          }
        };
      cvAxisData.data = cvData;
      that.spbfObj.objData.legendData = legendData;
      that.spbfObj.objData.xAxisData = xAxisData;
      that.spbfObj.objData.yAxisData[0] = vvAxisData;
      that.spbfObj.objData.yAxisData[1] = cvAxisData;
      console.log("methods--->buildVvcvData--->objData:", that.spbfObj.objData);
      setTimeout(function () {
        that.multipleBarOption(that.spbfObj.objData);
      }, 500)
      //that.multipleBarOption(that.spbfObj.objData);
    },
    /*构建一级分类数据*/
    buildYjflData: function (oneClassStat) {
      console.log("methods--->buildYjflData--->oneClassStat:", oneClassStat);
      var that = this;
      var dataList = new Array();
      if (oneClassStat) {
        dataList = that.replaceDataUtil(oneClassStat, that.yjflObj.replaceData);
      }
      var xAxisData = new Array();
      var yAxisData = new Array();
      for (var i in dataList) {
        var obj = dataList[i];
        var name = obj.name;
        var value = that.loadRatio(obj.value, that.yjflObj.objData.subValue, false, 1);
        xAxisData.push(name);
        yAxisData.push(value);
      }
      ;
      that.yjflObj.objData.xAxisData = xAxisData;
      that.yjflObj.objData.yAxisData = yAxisData;
      console.log("methods--->buildYjflData--->objData:", that.yjflObj.objData);
      setTimeout(function () {
        that.singleBarOption(that.yjflObj.objData);
      }, 500)
      // that.singleBarOption(that.yjflObj.objData);
    },
    /*构建性别偏好数据*/
    buildSexData: function (sexLikeStat) {
      console.log("methods--->buildSexData--->sexLikeStat:", sexLikeStat);
      var that = this;
      var dataList = new Array();
      if (sexLikeStat) {
        dataList = that.replaceDataUtil(sexLikeStat, that.xbzsObj.replaceData);
        var _dataList = new Array();
        for (var i in dataList) {
          var obj = new Object();
          obj.name = dataList[i].name;
          obj.valueList = that.replaceDataUtil(dataList[i].value, that.yjflObj.replaceData);
          _dataList.push(obj);
        }
      }
      console.log("methods--->buildSexData--->_dataList:", _dataList);
      var legendData = new Array;
      var xAxisData = that.xbzsObj.objData.xAxisData;
      var yAxisData = new Array;
      for (var i in _dataList) {
        var name = _dataList[i].name;
        var valueList = _dataList[i].valueList;
        legendData.push(name);
        var yAxisObj = new Object();
        yAxisObj.name = name;
        yAxisObj.type = 'bar';
        yAxisObj.barGap = 0.2;
        yAxisObj.barWidth = '20%';
        yAxisObj.barMaxWidth = 120;
        yAxisObj.data = new Array();
        for (var j in xAxisData) {
          var xAxisName = xAxisData[j];
          for (var k in valueList) {
            var valueName = valueList[k].name;
            if (xAxisName == valueName) {
              var val = that.loadRatio(valueList[k].value, that.xbzsObj.objData.subValue, false, 1);
              yAxisObj.data.push(val);
              break;
            }
          }
        }
        console.log("methods--->buildSexData--->yAxisObj:", yAxisObj);
        yAxisData.push(yAxisObj);
      }
      that.xbzsObj.objData.legendData = legendData;
      that.xbzsObj.objData.yAxisData = yAxisData;
      console.log("methods--->buildSexData--->objData:", that.xbzsObj.objData);
      setTimeout(function () {
        that.multipleBarOption(that.xbzsObj.objData);
      }, 500)
      // that.multipleBarOption(that.xbzsObj.objData);
    },
    /*构建城市偏好数据*/
    buildCityPreferenceData: function (cityLikeStat) {
      console.log("methods--->buildCityPreferenceData--->cityLikeStat:", cityLikeStat);
      var that = this;
      var dataList = new Array();
      if (cityLikeStat) {
        dataList = that.replaceDataUtil(cityLikeStat, that.cszsObj.replaceData);
        var _dataList = new Array();
        for (var i in dataList) {
          var obj = new Object();
          obj.name = dataList[i].name;
          obj.valueList = that.replaceDataUtil(dataList[i].value, that.yjflObj.replaceData);
          _dataList.push(obj);
        }
      }
      console.log("methods--->buildSexData--->_dataList:", _dataList);

      var legendData = new Array;
      var xAxisData = that.cszsObj.objData.xAxisData;
      var yAxisData = new Array;
      for (var i in _dataList) {
        var name = _dataList[i].name;
        var valueList = _dataList[i].valueList;
        legendData.push(name);
        var yAxisObj = new Object();
        yAxisObj.name = name;
        yAxisObj.type = 'bar';
        yAxisObj.barGap = 0.2;
        yAxisObj.barWidth = '15%';
        yAxisObj.barMaxWidth = '20%';
        yAxisObj.data = new Array();
        for (var j in xAxisData) {
          var xAxisName = xAxisData[j];
          for (var k in valueList) {
            var valueName = valueList[k].name;
            if (xAxisName == valueName) {
              var val = that.loadRatio(valueList[k].value, that.cszsObj.objData.subValue, false, 1);
              yAxisObj.data.push(val);
              break;
            }
          }
        }
        console.log("methods--->buildCityPreferenceData--->yAxisObj:", yAxisObj);
        yAxisData.push(yAxisObj);
      }
      that.cszsObj.objData.legendData = legendData;
      that.cszsObj.objData.yAxisData = yAxisData;
      console.log("methods--->buildCityPreferenceData--->objData:", that.cszsObj.objData);
      setTimeout(function () {
        that.multipleBarOption(that.cszsObj.objData);
      }, 500)
      // that.multipleBarOption(that.cszsObj.objData);
    },



    /* 请求内容偏好-内容类型偏好数据*/
    queryTypePreferData: function (params,url) {
      let that = this;
      that.clearEchart(that.typePreferObj.objData.id);
      if (that.typePreferObj.objData.update) {
        that.typePreferObj.objData.update = false;
      }
      if (that.typePreferObj.objData.noData) {
        that.typePreferObj.objData.noData = false;
      }
      // 显示加载中
      that.typePreferObj.objData.loading = true;
      console.log(that.typePreferObj.objData.loading, '类型偏好加载中');
      // 请求
      // getTypePreferData(params,url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"nameStat":{"喜剧":"260395","青春":"25297","科幻":"106417","历史":"58251","悬疑":"112597","偶像":"2061","剧情":"424966","犯罪":"114419","动画":"58073","谍战":"928","爱情":"170875","惊悚":"127346","家庭":"21573","战争":"47026","冒险":"166086","动作":"367928","奇幻":"112028"}}};
        if (resp.retCode == '0') {
          that.typePreferObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          var Datas = resultData.nameStat || resultData.contentTypePreference
          if (that._isEmptyObject(resultData) || that._isEmptyObject(Datas)) {
            that.typePreferObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildTypePreferData(Datas);
        }
        else {
          that.typePreferObj.objData.loading = false; // 隐藏加载中
          that.typePreferObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求内容偏好-年代偏好数据*/
    queryYearPreferData: function (params,url) {
      let that = this;
      that.clearEchart(that.yearPreferObj.objData.id);
      if (that.yearPreferObj.objData.update) {
        that.yearPreferObj.objData.update = false;
      }
      if (that.yearPreferObj.objData.noData) {
        that.yearPreferObj.objData.noData = false;
      }
      // 显示加载中
      that.yearPreferObj.objData.loading = true;
      console.log(that.yearPreferObj.objData.loading, '年代偏好加载中');
      // 请求
      // getYearPreferData(params,url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"timeStat":{"2019年":"315923","2016年":"151687","2018年":"151677","2015年":"137103","2017年":"118357","2012年":"71293","2014年":"57078","2013年":"55808","2011年":"38740","2010年":"33377"}}};
        if (resp.retCode == '0') {
          that.yearPreferObj.objData.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          var Datas = resultData.timeStat || resultData.yearsPreference
          if (that._isEmptyObject(resultData) || that._isEmptyObject(Datas)) {
            that.yearPreferObj.objData.noData = true; // 显示无数据
            return;
          }
          that.buildYearPreferData(Datas);
        }
        else {
          that.yearPreferObj.objData.loading = false; // 隐藏加载中
          that.yearPreferObj.objData.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求内容偏好-人物TOP10数据*/
    queryPersonTopData: function (params,url) {
      let that = this;
      that.clearEchart(that.personTopObj.id);
      // 如果是失败刷新 隐藏update
      if (that.personTopObj.update) {
        that.personTopObj.update = false;
      }
      if (that.personTopObj.noData) {
        that.personTopObj.noData = false;
      }
      // 显示加载中
      that.personTopObj.loading = true;
      console.log("请求人物TOP10数据");
      // getPersonTopData(params,url).then(res => {
        let resp =  {"retCode":"0","retDesc":"成功","resultData":{"attributeStat":{"王晶":"38032","叶伟信":"32088","张涛":"24409","蒂姆·米勒":"22352","莱恩·约翰逊":"21595","饺子":"20408","刘伟强":"20193","罗兰·艾默里奇":"19965","西蒙·韦斯特":"19178","本·扬格":"18207"}}};
        if (resp.retCode == '0') {
          that.personTopObj.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          var Datas = resultData.attributeStat || resultData.userPreference
          if (that._isEmptyObject(resultData) || that._isEmptyObject(Datas)) {
            that.personTopObj.noData = true; // 显示无数据
            return;
          }
          that.buildPersonTOPData(Datas);
        }
        else {
          that.personTopObj.loading = false; // 隐藏加载中
          that.personTopObj.update = true;  // 显示加载失败
        }
      // })
    },
    /* 请求内容偏好-内容TOP10数据*/
    queryContentTopData: function (params,url) {
      let that = this;
      that.clearEchart(that.contentTopObj.id);
      // 如果是失败刷新 隐藏update
      if (that.contentTopObj.update) {
        that.contentTopObj.update = false;
      }
      if (that.contentTopObj.noData) {
        that.contentTopObj.noData = false;
      }
      // 显示加载中
      if (that.contentTopObj.loading) {
        return;
      }
      that.contentTopObj.loading = true;
      console.log("请求内容TOP10数据");
      // getContentTopData(params,url).then(res => {
        let resp = {"retCode":"0","retDesc":"成功","resultData":{"contentStat":{"燃烧":"81896","蜗牛与黄鹂鸟":"72785","猎天狼":"59620","小娘惹":"55261","哪吒降妖记":"54144","痕迹":"46363","猫系女友遇上暖心饲养员，林允张新成解锁音乐浪漫，甜到炸裂！":"39562","爱情的开关":"36101","秋蝉":"35038","奈何BOSS又如何":"34374"}}};
        if (resp.retCode == '0') {
          that.contentTopObj.loading = false; // 隐藏加载中
          var resultData = resp.resultData;
          var Datas = resultData.contentStat || resultData.contentPreference
          if (that._isEmptyObject(resultData) || that._isEmptyObject(Datas)) {
            that.contentTopObj.noData = true; // 显示无数据
            return;
          }
          that.buildContentTOPData(Datas);
        }
        else {
          that.contentTopObj.loading = false; // 隐藏加载中
          that.contentTopObj.update = true;  // 显示加载失败
        }
      // })
    },

    /* 构建内容偏好-内容类型偏好数据*/
    buildTypePreferData: function (contentStat) {
      console.log("methods--->buildTypePreferData--->typePreferData:", contentStat);
      var that = this;
      // var dataList = new Array();
      // if(contentStat){
      //     dataList = that.replaceDataUtil(contentStat,that.typePreferObj.replaceData);
      // }
      var xAxisData = new Array();
      var yAxisData = new Array();
      // for(var i in dataList){
      //     var obj = dataList[i];
      //     var name = obj.name;
      //     var value = that.loadRatio(obj.value,that.typePreferObj.objData.subValue,false,1);
      //     xAxisData.push(name);
      //     yAxisData.push(value);
      // };
      for (var key in contentStat) {
        var name = key;
        var value = that.loadRatio(contentStat[key], that.typePreferObj.objData.subValue, false, 1);
        xAxisData.push(name);
        yAxisData.push(value);
      }
      ;

      that.typePreferObj.objData.xAxisData = xAxisData;
      that.typePreferObj.objData.yAxisData = yAxisData;
      console.log("methods--->buildTypePreferData--->objData:", that.typePreferObj.objData);
      setTimeout(function () {
        that.singleBarOption(that.typePreferObj.objData);
      }, 500)
      // that.singleBarOption(that.typePreferObj.objData);
    },
    /* 构建内容偏好-年代偏好数据*/
    buildYearPreferData: function (contentStat) {
      console.log("methods--->buildYearPreferData--->yearPreferData:", contentStat);
      var that = this;
      // var dataList = new Array();
      // if(contentStat){
      //     dataList = that.replaceDataUtil(contentStat,that.typePreferObj.replaceData);
      // }
      var xAxisData = new Array();
      var yAxisData = new Array();
      // for(var i in dataList){
      //     var obj = dataList[i];
      //     var name = obj.name;
      //     var value = that.loadRatio(obj.value,that.typePreferObj.objData.subValue,false,1);
      //     xAxisData.push(name);
      //     yAxisData.push(value);
      // };

      for (var key in contentStat) {
        var name = key;
        var value = that.loadRatio(contentStat[key], that.yearPreferObj.objData.subValue, false, 1);
        xAxisData.push(name);
        yAxisData.push(value);
      }
      ;
      xAxisData.reverse();
      yAxisData.reverse();
      that.yearPreferObj.objData.xAxisData = xAxisData;
      that.yearPreferObj.objData.yAxisData = yAxisData;
      console.log("methods--->buildYearPreferData--->objData:", that.yearPreferObj.objData);
      setTimeout(function () {
        that.singleBarOption(that.yearPreferObj.objData);
      }, 500)
      // that.singleBarOption(that.yearPreferObj.objData);
    },
    /* 构建内容偏好-人物TOP10数据*/
    buildPersonTOPData: function (personTopData) {
      console.log("methods--->buildPersonTopData--->personTopData:", personTopData);
      var that = this;
      if (personTopData) {
        var xAxisData = new Array();
        var yAxisData = new Array();
        // for(var i in personTopData){
        //     var obj = personTopData[i];
        //     var name = obj.attribute_value;
        //     var value = that.loadRatio(obj.favorite_nums,that.personTopObj.subValue,false,1);
        //     xAxisData.push(value);
        //     yAxisData.push(name);
        // };
        for (var key in personTopData) {
          var name = key;
          var value = that.loadRatio(personTopData[key], that.personTopObj.subValue, false, 1);
          xAxisData.push(value);
          yAxisData.push(name);
        }
        xAxisData.reverse();
        yAxisData.reverse();
        that.personTopObj.xAxisData = xAxisData;
        that.personTopObj.yAxisData = yAxisData;
      }
      console.log("methods--->buildPersonTopData--->objData:", that.personTopObj);
      setTimeout(function () {
        that.transverseBarOption(that.personTopObj);
      }, 500)
      // that.transverseBarOption(that.personTopObj);
    },
    /* 构建内容偏好-内容TOP10数据*/
    buildContentTOPData: function (contentTopData) {
      console.log("methods--->buildContentTopData--->contentTopData:", contentTopData);
      var that = this;
      if (contentTopData) {
        var xAxisData = new Array();
        var yAxisData = new Array();
        // for(var i in contentTopData){
        //     var obj = contentTopData[i];
        //     var name = obj.content_name;
        //     if(name.length > 9){
        //         name = name.substring(0, 9) + '...'
        //     }
        //     var value = that.loadRatio(obj.favorite_nums,that.contentTopObj.subValue,false,1);
        //     xAxisData.push(value);
        //     yAxisData.push(name);
        // };
        for (var key in contentTopData) {
          var name = key;
          if (name.length > 9) {
            name = name.substring(0, 9) + '...'
          }
          var value = that.loadRatio(contentTopData[key], that.contentTopObj.subValue, false, 1);
          xAxisData.push(value);
          yAxisData.push(name);
        }
        xAxisData.reverse();
        yAxisData.reverse();
        that.contentTopObj.xAxisData = xAxisData;
        that.contentTopObj.yAxisData = yAxisData;
      }
      console.log("methods--->buildContentTopData--->objData:", that.contentTopObj);
      setTimeout(function () {
        that.transverseBarOption(that.contentTopObj);
      }, 500)
      // that.transverseBarOption(that.contentTopObj);
    },
    /*会员按钮切换事件*/
    buttonClick: function (isMember) {
      console.log("methods--->buttonClick--->isMember:", isMember);
      var that = this;
      that.isMember = isMember;
    }
  }
}
