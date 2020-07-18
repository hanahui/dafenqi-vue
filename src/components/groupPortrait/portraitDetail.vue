<template>
  <div id="main" class="pd">
    <div class="page-title bgd chart-page">
      <div>群体列表 - 显示画像 <span v-if="groupName != ''">- {{groupName}}</span><button type="button" class="btn btn-default btn-back fr" @click="back" style="position: relative;top: -7px;">返回</button></div>
    </div>
    <!-- 模块信息 -->
    <div class="mgt module-content echart-h-wrapper">
      <!-- 年龄占比 -->
      <div class="cell one-third bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0001') != -1">
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
      <div class="cell one-third bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0002') != -1">
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
      <div class="cell one-third bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0003') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">学历</div>
          </div>
          <div class="title-tips">
            <span class="tips-text"><span class="tips-arrow"></span>截止昨天，各学历用户占比</span>
          </div>
        </h5>
        <div id="xlblEchart" class="echart-container"></div>
        <block-nodata v-show="xlblObj.objData.noData"></block-nodata>
        <block-loading v-show="xlblObj.objData.loading"></block-loading>
        <block-update v-show="xlblObj.objData.update" @update="queryEducationData"></block-update>
      </div>
      <!-- 访问次数 -->
      <div class="cell one-third bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0010') != -1">
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
      <!-- 时间段占比 -->
      <div class="cell one-third bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0011') != -1">
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
      <!-- 类型比例 -->
      <div class="cell one-third bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0014') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">类型比例</div>
            <div class="sub-title">单位：万</div>
          </div>
          <div class="title-tips">
            <span class="tips-text"><span class="tips-arrow"></span>用户总播放和正片播放次数</span>
          </div>
        </h5>
        <div id="hdxwEchart" class="echart-container"></div>
        <block-nodata v-show="hdxwObj.objData.noData"></block-nodata>
        <block-loading v-show="hdxwObj.objData.loading"></block-loading>
        <block-update v-show="hdxwObj.objData.update" @update="queryActionData"></block-update>
      </div>
      <!-- 平均天使用时长 -->
      <div class="cell one-third bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0012') != -1">
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
      <!-- 视频比例 -->
      <div class="cell one-third bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0018') != -1">
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
      <!-- 性别 -->
      <div class="cell one-third echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0030') != -1">
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
        <block-update v-show="xbxfObj.objData.update" @update="queryGenderData"></block-update>
      </div>
      <!-- 年龄-->
      <div class="cell one-third echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0031') != -1">
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
      <div class="cell one-third echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0032') != -1">
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
      <!-- 省份分布 -->
      <div class="cell one-half bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0004') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">省份分布</div>
            <div class="sub-title">单位:万</div>
          </div>
          <div class="title-tips">
            <span class="tips-text"><span class="tips-arrow"></span>截止昨天，用户量top10省份</span>
          </div>
        </h5>
        <div id="sffbEchart" class="echart-container"></div>
        <block-nodata v-show="sffbObj.objData.noData"></block-nodata>
        <block-loading v-show="sffbObj.objData.loading"></block-loading>
        <block-update v-show="sffbObj.objData.update" @update="queryProvincesData"></block-update>
      </div>
      <!-- 城市分布 -->
      <div class="cell one-half bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0005') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">城市分布</div>
            <div class="sub-title">单位:万</div>
          </div>
          <div class="title-tips">
            <span class="tips-text"><span class="tips-arrow"></span>截止昨天，城市分级用户量占比</span>
          </div>
        </h5>
        <div id="csfbEchart" class="echart-container"></div>
        <block-nodata v-show="csfbObj.objData.noData"></block-nodata>
        <block-loading v-show="csfbObj.objData.loading"></block-loading>
        <block-update v-show="csfbObj.objData.update" @update="queryCityData"></block-update>
      </div>
      <!-- 操作系统 -->
      <div class="cell one-half bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0006') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">操作系统</div>
          </div>
          <div class="title-tips">
            <span class="tips-text"><span class="tips-arrow"></span>截止昨天，主流操作系统用户量占比</span>
          </div>
        </h5>
        <div id="czxtEchart" class="echart-container"></div>
        <block-nodata v-show="czxtObj.objData.noData"></block-nodata>
        <block-loading v-show="czxtObj.objData.loading"></block-loading>
        <block-update v-show="czxtObj.objData.update" @update="queryOperationData"></block-update>
      </div>
      <!-- 终端产品 -->
      <div class="cell one-half bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0007') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">终端品牌</div>
            <div class="sub-title">单位:万</div>
          </div>
          <div class="title-tips">
            <span class="tips-text"><span class="tips-arrow"></span>截止昨天，用户量TOP10终端品牌占比</span>
          </div>
        </h5>
        <div id="zdcpEchart" class="echart-container"></div>
        <block-nodata v-show="zdcpObj.objData.noData"></block-nodata>
        <block-loading v-show="zdcpObj.objData.loading"></block-loading>
        <block-update v-show="zdcpObj.objData.update" @update="queryTerminalData"></block-update>
      </div>
      <!-- 分类占比 -->
      <div class="cell one-half bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0008') != -1">
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
      <div class="cell one-half bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0009') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">会员增长趋势</div>
          </div>
          <div class="title-tips">
            <span class="tips-text"><span class="tips-arrow"></span>自然年内会员增长趋势</span>
          </div>
        </h5>
        <div id="zzqsEchart" class="echart-container"></div>
        <block-nodata v-show="zzqsObj.objData.noData"></block-nodata>
        <block-loading v-show="zzqsObj.objData.loading"></block-loading>
        <block-update v-show="zzqsObj.objData.update" @update="queryMembershipGrowthData"></block-update>
      </div>
      <!-- 消费类型 -->
      <div class="cell one-half bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0016') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">消费类型</div>
            <div class="sub-title">单位：万</div>
          </div>
          <div class="title-tips">
            <span class="tips-text"><span class="tips-arrow"></span>截止当前，用户消费类型占比</span>
          </div>
        </h5>
        <div id="xflxEchart" class="echart-container"></div>
        <block-nodata v-show="typeObj.objData.noData"></block-nodata>
        <block-loading v-show="typeObj.objData.loading"></block-loading>
        <block-update v-show="typeObj.objData.update" @update="queryTypeData"></block-update>
      </div>
      <!-- 消费能力 -->
      <div class="cell one-half bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0017') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">消费能力</div>
            <div class="sub-title">单位：万</div>
          </div>
          <div class="title-tips">
            <span class="tips-text"><span class="tips-arrow"></span>截至当前，用户消费等级占比</span>
          </div>
        </h5>
        <div id="xfnlEchart" class="echart-container"></div>
        <block-nodata v-show="abilityObj.objData.noData"></block-nodata>
        <block-loading v-show="abilityObj.objData.loading"></block-loading>
        <block-update v-show="abilityObj.objData.update" @update="queryAbilityData"></block-update>
      </div>
      <!-- 内容类型偏好 -->
      <div class="cell one-half bgd echart-h-box relative module-item" v-if="selectedModuleCode.indexOf('M0026') != -1">
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
      <div class="cell one-half bgd echart-h-box relative module-item" v-if="selectedModuleCode.indexOf('M0027') != -1">
        <div class="echart-select absolute">
          <custom-select :list="fixedTypeList"
                         :default-value.sync="yearSelected"></custom-select>
        </div>
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">年代偏好</div>
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
      <!-- 人物偏好TOP10 -->
      <div class="cell one-half bgd echart-h-box relative module-item" v-if="selectedModuleCode.indexOf('M0028') != -1">
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
        <block-update v-show="personTopObj.update" @update="queryPersonTopData"></block-update>
      </div>
      <!-- 内容偏好TOP10-->
      <div class="cell one-half bgd echart-h-box relative module-item"  v-if="selectedModuleCode.indexOf('M0029') != -1" >
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
        <block-update v-show="contentTopObj.update" @update="queryContentTopData"></block-update>
      </div>
      <!-- 社交活跃度趋势 -->
      <div class="cell two-thirds bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0015') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">社交活跃度趋势</div>
          </div>
          <div class="title-tips">
            <span class="tips-text"><span class="tips-arrow"></span>用户总播放和正片播放次数</span>
          </div>
        </h5>
        <div id="shhyEchart" class="echart-container"></div>
        <block-nodata v-show="shhyObj.objData.noData"></block-nodata>
        <block-loading v-show="shhyObj.objData.loading"></block-loading>
        <block-update v-show="shhyObj.objData.update" @update="queryActivityData"></block-update>
      </div>
      <!-- 一级分类 -->
      <div class="cell two-thirds bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0019') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">一级分类</div>
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
      <!-- 播放次数 -->
      <div class="cell w24 bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0013') != -1">
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
      <!-- 性别偏好 -->
      <div class="cell w24 bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0020') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">性别偏好</div>
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
      <!-- 城市偏好 -->
      <div class="cell w24 bgd echart-h-box module-item" v-if="selectedModuleCode.indexOf('M0021') != -1">
        <h5 class="chart-title">
          <div class="title-text">
            <div class="main-title">城市偏好</div>
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
</template>

<script>
    import {MyMixin} from "../../assets/js/echart/mixins";
    import {getModuleList} from "../../assets/js/groupPortraitApi";
    import {getFirstCategoryData} from "../../assets/js/wholeKanbanApi";
    import CustomSelect from '../customSelect'

    export default {
        name: "portraitDetail",
        mixins: [MyMixin],
        components: {
            'custom-select': CustomSelect
        },
        data(){
            return {
                searchKey: this.$route.query.searchKey || '',
                buttonId: this.$route.query.buttonId || '',
                curPage: this.$route.query.curPage ||  1,
                pageSize: this.$route.query.pageSize || '10',
                _backPath: '',
                groupId: this.$route.query.groupId || '',
                groupName: this.$route.query.groupName || '',
                moduleList: [
                    // {
                    // 	id: 1,
                    // 	code: 'M0001',
                    // },
                    // {
                    //     id: 2,
                    //     code: 'M0002',
                    // },
                    // {
                    //     id: 4,
                    //     code: 'M0004',
                    // },
                    // {
                    //     id: 5,
                    //     code: 'M0005',
                    // },
                ], // 显示的模块对象
                selectedModuleId: [],  // 显示的模块id
                // selectedModuleCode: ['M0001','M0002','M0004','M0005','M0006','M0007'],  // 显示的模块码
                selectedModuleCode: [],  // 显示的模块码
                MODULE_DATA: '/labelsys-service/population/show/', // 模块数据接口
            }
        },
        beforeRouteEnter(to,from,next){
            console.log('router form',from)
            next(vm =>  {
                vm._backPath = from.path;
            })
        },
        created: function () {
            var that = this;
            let documentCookie = document.cookie;
            let len = documentCookie.length;
            let arr = documentCookie.split(';');
            // console.log(arr)
            let product = '';
            arr.forEach(function(text){
                let index = text.indexOf('productArray=');
                if(index !== -1){
                    product = text.substring(index+13);
                }
            });
            //console.log(product);
            //console.log(product.replace(/@/g, ','));
            if(product.replace(/@/g, ',') == ''){
                product = '0';
            }else{
                product = product.replace(/@/g, ',');
            }
            console.log(product, '请求分类产品')
            that.queryFirstCategory(product)
            // 获取已选模块id
            var idText = that.$route.query.moduleId;
            // 请求显示模块列表
            let params  = {isvalid: '1', moduleIds: idText}
            getModuleList(params).then(res => {
                let data = res.data;
                if(data.retCode == 0){
                    var list = data.resultData;
                    list.forEach(function(item){
                        that.moduleList.push({
                            id: item.id,
                            code: item.moduleCode
                        });
                        that.selectedModuleCode.push(item.moduleCode);
                    })
                    that.init();
                }
            })

            that.selectedModuleId = idText.split(',');
            that.selectedModuleId = that.selectedModuleId.map(Number);
            console.log('selected selectedModuleId--->', that.selectedModuleId);

            // 模块数据接口
            that.MODULE_DATA = that.MODULE_DATA + that.groupId;
            console.log(that.MODULE_DATA,'获取的群体模块url')
        },
        methods: {
            queryFirstCategory: function(productValue){
                let that = this;
                let params  = {product: productValue};
                // getFirstCategoryData(params).then(res => {
                    let data = {"retCode":"0","retDesc":"成功","resultData":["电视剧","少儿","电影","综艺","教育","音乐","演艺","纪实","体育","动漫"]};
                    if(data.retCode == 0){
                        if(data.resultData && data.resultData.length > 0){
                            that.contentTopSelected = data.resultData[0];
                            // console.log(res.resultData);
                            that.formatFirstCategory(data.resultData);
                        }
                    }
                // })
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
            },
            back: function(){
                var that = this;
                console.log('back html===>',that._backPath +'?searchKey='+that.searchKey+'&curPage='+that.curPage+'&pageSize='+that.pageSize+'&buttonId='+that.buttonId)

                if(that._backPath){
                    that.$router.push({
                        path: that._backPath || '/overView',
                        query: {
                            searchKey: that.searchKey,
                            curPage: that.curPage,
                            pageSize: that.pageSize,
                            buttonId: that.buttonId
                        }
                    })
                }else{
                    that.$router.push({
                        path: '/',
                    })
                }

            },
            /* 初始化数据 */
            init: function () {
                var that = this;
                that.moduleList.forEach(function(item){
                    that.querySwitch(item);
                });
            },

            /* 根据模块码请求所需要请求的模块数据 */
            querySwitch: function(module){
                var that = this;
                var url = that.MODULE_DATA+'/'+module.id;
                console.log('请求模块url===', url);
                switch(module.code){
                    case 'M0001':
                        that.queryAgeData(url);
                        break;
                    case 'M0002':
                        that.queryGenderData(url);
                        break;
                    case 'M0003':
                        that.queryEducationData(url);
                        break;
                    case 'M0004':
                        that.queryProvincesData(url);
                        break;
                    case 'M0005':
                        that.queryCityData(url);
                        break;
                    case 'M0006':
                        that.queryOperationData(url);
                        break;
                    case 'M0007':
                        that.queryTerminalData(url);
                        break;
                    case 'M0008':
                        that.queryMembershipTypeData(url);
                        break;
                    case 'M0009':
                        that.queryMembershipGrowthData(url);
                        break;
                    case 'M0010':
                        that.queryVisitData(url);
                        break;
                    case 'M0011':
                        that.queryPeriodData(url);
                        break;
                    case 'M0012':
                        that.queryUsedurData(url);
                        break;
                    case 'M0013':
                        that.queryPlayData({},url);
                        break;
                    case 'M0014':
                        that.queryActionData(url);
                        break;
                    case 'M0015':
                        that.queryActivityData(url);
                        break;
                    case 'M0016':
                        that.queryTypeData(url);
                        break;
                    case 'M0017':
                        that.queryAbilityData(url);
                        break;
                    case 'M0018':
                        that.queryVideoData({},url);
                        break;
                    case 'M0019':
                        that.queryCategoryData({},url);
                        break;
                    case 'M0020':
                        that.queryGenderPreferenceData({},url);
                        break;
                    case 'M0021':
                        that.queryCityPreferenceData({},url);
                        break;
                    case 'M0026':
                        that.queryTypePreferData({className: that.typeSelected},url);
                        break;
                    case 'M0027':
                        that.queryYearPreferData({className: that.yearSelected},url);
                        break;
                    case 'M0028':
                        let personTopParam = {
                            attributeName: that.personSwitch,
                            className: that.personTopSelected
                        }
                        that.queryPersonTopData(personTopParam,url);
                        break;
                    case 'M0029':
                        let contentTopParam = {
                            className: that.contentTopSelected
                        }
                        if(that.contentTopSelected === ''){
                            return;
                        }
                        that.queryContentTopData(contentTopParam,url);
                        break;
                    case 'M0030':
                        that.queryConsumeGenderData(url);
                        break;
                    case 'M0031':
                        that.queryConsumeAgeData(url);
                        break;
                    case 'M0032':
                        that.queryConsumeCityData(url);
                        break;
                    default: return;
                }
            },
            // 内容-类型偏好
            queryType: function(){
                let that = this;
                let typeParam = {
                    className: that.typeSelected
                };
                var url = that.MODULE_DATA+'/26';
                console.log(typeParam, 'typeParam')
                that.queryTypePreferData(typeParam,url);
            },
            // 内容-年代偏好
            queryYear: function(){
                let that = this;
                let yearParam = {
                    className: that.yearSelected
                }
                var url = that.MODULE_DATA+'/27';
                console.log(yearParam, 'yearParam')
                that.queryYearPreferData(yearParam,url);
            },
            queryPersonTop: function(){
                let that = this;
                let personTopParam = {
                    attributeName: that.personSwitch,
                    className: that.personTopSelected
                }
                var url = that.MODULE_DATA+'/28';
                that.queryPersonTopData(personTopParam,url);
            },
            queryContentTop: function(){
                let that = this;
                let contentTopParam = {
                    className: that.contentTopSelected
                }
                var url = that.MODULE_DATA+'/29';
                that.queryContentTopData(contentTopParam,url);
            },
        }
    }
</script>

<style lang="less">
  @import '../../assets/css/echartsBase';
  [v-cloak]{
    display: none !important;
  }
  .module-content{
    display: flex;
    height: inherit;
    padding-bottom: 16px;
    flex-wrap: wrap;
    align-content: flex-start
  }
</style>
