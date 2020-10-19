import Vue from 'vue'
import Router from 'vue-router'
import Home from '@/components/home.vue'
import workPlace from '@/components/menu/workPlace'
import Login from "../views/login";
import LoginSys from "../views/login/login";
import Signup from "../views/login/signup";
import LoginByPwd from "../views/login/loginbypwd";
import Main from '../views/Main';

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      // 首页
      path: '/main',
      name: 'Main',
      component: Main
    },
    {
      // 登录页
      path: '/userlogin',
      name: 'LoginSys',
      component: LoginSys
    },
    {
      //z注册
      path: '/signup',
      name: 'Signup',
      component: Signup
    },
    {
      // 密码登录
      path: '/userloginpwd',
      name: 'LoginByPwd',
      component: LoginByPwd
    },



    {
      // 登录页 废弃
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
        redirect: '/home/workPlace',
        children: [
        {
          path: 'workPlace',
          component: workPlace,
          name: '首页'
        },

        {
          path: 'organlist',
          component: resolve => require(['@/components/menu/organlist'], resolve),
          name: '机构推荐'
        },
          {
            path: 'orgcoller',
            component: resolve => require(['@/components/menu/orgcoller'], resolve),
            name: '机构审核'
          },
          {
            path: 'goodslist',
            component: resolve => require(['@/components/menu/goodslist'], resolve),
            name: '产品推荐'
          },
          {
            path: 'floorprice',
            component: resolve => require(['@/components/menu/floorprice'], resolve),
            name: '产品底价'
          },
          {
            path: 'userlist',
            component: resolve => require(['@/components/menu/usercenter/userlist'], resolve),
            name: '用户中心'
          },
          {
            path: 'giveuser',
            component: resolve => require(['@/components/menu/usercenter/giveuser'], resolve),
            name: '分配用户'
          },
          {
            path: 'userlistsys',
            component: resolve => require(['@/components/menu/userlistsys'], resolve),
            name: '密码修改'
          },
          {
            path: 'adslist',
            component: resolve => require(['@/components/menu/adslist'], resolve),
            name: '推荐中心'
          },
          {
            path: 'extendlist',
            component: resolve => require(['@/components/menu/extendlist'], resolve),
            name: '推广中心'
          },
          {
            path: 'swiperlist',
            component: resolve => require(['@/components/menu/swiperlist'], resolve),
            name: '轮播图管理'
          },
          {
            path: 'addtype',
            component: resolve => require(['@/components/menu/addtype'], resolve),
            name: '添加类型'
          },
          {
            path: 'newslist',
            component: resolve => require(['@/components/menu/newslist'], resolve),
            name: '头条新闻'
          },
          {
            path: 'usermoney',
            component: resolve => require(['@/components/menu/usermoney'], resolve),
            name: '用户佣金'
          },
          {
            path: 'checkusermoney',
            component: resolve => require(['@/components/menu/checkusermoney'], resolve),
            name: '申请提现列表'
          },
          {
            path: 'usermoneyhistory',
            component: resolve => require(['@/components/menu/usermoneyhistory'], resolve),
            name: '申请提现历史'
          },
          {
            path: 'userpaylist',
            component: resolve => require(['@/components/menu/userpaylist'], resolve),
            name: '用户消费列表'
          },
          {
            path: 'orderlist',
            component: resolve => require(['@/components/menu/orderlist'], resolve),
            name: '订单列表'
          },
          {
            path: 'ratio',
            component: resolve => require(['@/components/menu/ratio'], resolve),
            name: '用户佣金比例'
          },
          {
            path: 'competition',
            component: resolve => require(['@/components/menu/competition'], resolve),
            name: '竞价推荐申请'
          },

          {
            path: 'orgcompetition',
            component: resolve => require(['@/components/menu/orgcompetition'], resolve),
            name: '机构竞价申请'
          },

          {
            path: 'draw',
            component: resolve => require(['@/components/menu/draw/draw'], resolve),
            name: '抽奖管理'
          },
          {
            path: 'userdraw',
            component: resolve => require(['@/components/menu/draw/userdraw'], resolve),
            name: '抽奖管理'
          },
          {
            path: 'classtype',
            component: resolve => require(['@/components/menu/classtype'], resolve),
            name: '课程参数'
          },
          {
            path: 'sys',
            component: resolve => require(['@/components/menu/sys'], resolve),
            name: '关于我们'
          },
          {
            path: 'qsandb',
            component: resolve => require(['@/components/menu/other/qsandb'], resolve),
            name: '学员保障问题汇总'
          },
          {
            path: 'chatuserlist',
            component: resolve => require(['@/components/menu/chatuserlist'], resolve),
            name: '机构坐席管理'
          },
          {
            path: 'aisystem',
            component: resolve => require(['@/components/menu/aitest/aisystem'], resolve),
            name: '系统设置'
          },
          {
            path: 'powersystem',
            component: resolve => require(['@/components/menu/power/powersystem'], resolve),
            name: '权限分配'
          },
          {
            path: 'schoolpower',
            component: resolve => require(['@/components/menu/power/schoolpower'], resolve),
            name: '分校权限分配'
          },
          {
            path: 'schooltypes',
            component: resolve => require(['@/components/menu/power/schooltypes'], resolve),
            name: '营业范围'
          },
          {
            path: 'orgindex',
            component: resolve => require(['@/components/menu/other/orgindex'], resolve),
            name: '营业范围'
          },
          {
            path: 'knowledge',
            component: resolve => require(['@/components/menu/aitest/aiall/knowledge'], resolve),
            name: '知识点库'
          },
          {
            path: 'videoclass',
            component: resolve => require(['@/components/menu/aitest/aiall/videoclass'], resolve),
            name: '视频课程'
          },
          {
            path: 'aitestlist',
            component: resolve => require(['@/components/menu/aitest/aiall/aitestlist'], resolve),
            name: '试题列表'
          },
          {
            path: 'aiuser',
            component: resolve => require(['@/components/menu/aitest/aiuser'], resolve),
            name: 'AI用户'
          },
          {
            path: 'addlittleclass',
            component: resolve => require(['@/components/menu/littleclass/addlittleclass'], resolve),
            name: '小班管理'
          },
          {
            path: 'saler',
            component: resolve => require(['@/components/menu/school/saler/saler'], resolve),
            name: '业务员管理'
          },
          {
            path: 'source',
            component: resolve => require(['@/components/menu/source/source'], resolve),
            name: '来源管理'
          },
          {
            path: 'student',
            component: resolve => require(['@/components/menu/school/student/student'], resolve),
            name: '学员管理'
          },
          {
            path: 'addstudent',
            component: resolve => require(['@/components/menu/school/student/addstudent'], resolve),
            name: '录入管理'
          },
          {
            path: 'detail',
            component: resolve => require(['@/components/menu/detail'], resolve),
            name: '个人中心'
          },
          {
            path: 'finance',
            component: resolve => require(['@/components/menu/finance/finance'], resolve),
            name: '财务管理'
          },
          {
            path: 'nofinance',
            component: resolve => require(['@/components/menu/finance/nofinance'], resolve),
            name: '非直营分校录入审核'
          },
          {
            path: 'allfinance',
            component: resolve => require(['@/components/menu/finance/allfinance'], resolve),
            name: '分校课程管理'
          },
          {
            path: 'salepackage',
            component: resolve => require(['@/components/menu/salepackage/salepackage'], resolve),
            name: '销售包管理'
          },
          {
            path: 'classhour',
            component: resolve => require(['@/components/menu/classhour/classhour'], resolve),
            name: '课时管理'
          },
          {
            path: 'ftof',
            component: resolve => require(['@/components/menu/ftof/ftof'], resolve),
            name: '面授课程'
          },
          {
            path: 'plan',
            component: resolve => require(['@/components/menu/plan/plan'], resolve),
            name: '方案管理'
          },
          {
            path: 'financeorder',
            component: resolve => require(['@/components/menu/orders/financeorder'], resolve),
            name: '付款订单'
          },
          {
            path: 'owelist',
            component: resolve => require(['@/components/menu/owelist/owelist'], resolve),
            name: '本校学员欠费'
          },
          {
            path: 'salerowelist',
            component: resolve => require(['@/components/menu/owelist/salerowelist'], resolve),
            name: '学员欠费'
          },
          {
            path: 'checkowelist',
            component: resolve => require(['@/components/menu/owelist/checkowelist'], resolve),
            name: '欠费审核'
          },
          {
            path: 'fowelist',
            component: resolve => require(['@/components/menu/finance/fowelist'], resolve),
            name: '欠费列表'
          },
          {
            path: 'potuser',
            component: resolve => require(['@/components/menu/school/saler/potuser'], resolve),
            name: '潜在用户'
          },
          {
            path: 'searchstudent',
            component: resolve => require(['@/components/menu/school/student/searchstudent'], resolve),
            name: '学员信息查询'
          },
          {
            path: 'salershare',
            component: resolve => require(['@/components/menu/school/saler/salershare'], resolve),
            name: '业务员分享'
          },
          {
            path: 'schoolproduct',
            component: resolve => require(['@/components/menu/school/schoolproduct'], resolve),
            name: '分校课程'
          },
          {
            path: 'schoollist',
            component: resolve => require(['@/components/menu/school/schoollist'], resolve),
            name: '分校列表'
          },
          {
            path: 'financeauditing',
            component: resolve => require(['@/components/menu/finance/financeauditing'], resolve),
            name: '分校审核'
          },
          {
            path: 'suserorder',
            component: resolve => require(['@/components/menu/school/saler/suserorder'], resolve),
            name: '业务员订单'
          },
          {
            path: 'userlevel',
            component: resolve => require(['@/components/menu/appuser/userlevel'], resolve),
            name: '会员等级'
          },
          {
            path: 'paytype',
            component: resolve => require(['@/components/menu/pay/paytype'], resolve),
            name: '收款方式'
          },
          {
            path: 'paybank',
            component: resolve => require(['@/components/menu/pay/paybank'], resolve),
            name: '收款银行'
          },
          {
            path: 'classsys',
            component: resolve => require(['@/components/menu/class/classsys'], resolve),
            name: '班级设置'
          },
          {
            path: 'classstudent',
            component: resolve => require(['@/components/menu/class/classstudent'], resolve),
            name: '班级学员'
          },
          {
            path: 'classchange',
            component: resolve => require(['@/components/menu/class/classchange'], resolve),
            name: '学员换班'
          },
          {
            path: 'addgroupclass',
            component: resolve => require(['@/components/menu/groupclass/addgroupclass'], resolve),
            name: '团班录入'
          },
          {
            path:'filetype',
            component: resolve =>require(['@/components/menu/download/filetype'], resolve),
            name:'资料类型'
          },
          {
            path:'filelist',
            component: resolve =>require(['@/components/menu/download/filelist'], resolve),
            name:'资料管理'
          },
          {
            path:'pricesys',
            component: resolve =>require(['@/components/menu/aitest/pricesys'], resolve),
            name:'价格设置'
          },
          {
            path:'endtime',
            component: resolve =>require(['@/components/menu/sys/endtime'], resolve),
            name:'课程到期时间'
          },
          {
            path:'viplist',
            component: resolve =>require(['@/components/menu/school/viplist'], resolve),
            name:'学员会员列表'
          },
          {
            path:'batchadd',
            component: resolve =>require(['@/components/menu/sys/batchadd'], resolve),
            name:'批量录入'
          },
          {
            path:'addfinance',
            component: resolve =>require(['@/components/menu/finance/addfinance'], resolve),
            name:'录入审核'
          },
          {
            path:'grouprefund',
            component: resolve =>require(['@/components/menu/finance/grouprefund'], resolve),
            name:'拼团退款列表'
          },
          {
            path:'schoolcheck',
            component: resolve =>require(['@/components/menu/groupclass/schoolcheck'], resolve),
            name:'校长审核列表'
          },
          {
            path:'financecheck',
            component: resolve =>require(['@/components/menu/groupclass/financecheck'], resolve),
            name:'财务审核列表'
          },
          {
            path:'newpackage',
            component: resolve =>require(['@/components/menu/salepackage/newpackage'], resolve),
            name:'AI销售包'
          },
          {
            path:'userassign',
            component: resolve =>require(['@/components/menu/intentionuser/userassign'], resolve),
            name:'用户分配'
          },
          {
            path:'assigned',
            component: resolve =>require(['@/components/menu/intentionuser/assigned'], resolve),
            name:'已分配用户'
          },
          {
            path:'comrate',
            component: resolve =>require(['@/components/menu/intentionuser/comrate'], resolve),
            name:'业务员完成度'
          },
          {
            path:'salerassign',
            component: resolve =>require(['@/components/menu/intentionuser/salerassign'], resolve),
            name:'分配用户'
          },
          {
            path:'applyopenclass',
            component: resolve =>require(['@/components/menu/school/applyopenclass'], resolve),
            name:'申请开课'

          },
          {
            path: 'salerproductco',
            component: resolve => require(['@/components/menu/saler/salerproductco'], resolve),
            name: '业务员课程管理'
          },
          {
            path: 'learnhistory',
            component: resolve => require(['@/components/menu/school/student/learnhistory'], resolve),
            name: '学习记录'
          },
          {
            path: 'schoolsys',
            component: resolve => require(['@/components/menu/school/schoolsys'], resolve),
            name: '校长列表'
          },
          {
            path: 'wordindex',
            component: resolve => require(['@/components/menu/word/wordindex'], resolve),
            name: '单词翻译'
          },
          {
            path: 'teacherlist',
            component: resolve => require(['@/components/menu/assistant/teacher/teacherlist'], resolve),
            name: '教师管理'
          },
          {
            path: 'product',
            component: resolve => require(['@/components/menu/assistant/product/product'], resolve),
            name: '助教课程'
          },
          {
            path: 'addtask',
            component: resolve => require(['@/components/menu/saletask/addtask'], resolve),
            name: '设置绩效'
          },
          {
            path: 'tasksure',
            component: resolve => require(['@/components/menu/saletask/salertasklist'], resolve),
            name: '绩效确认'
          },
          {
            path: 'tasksearch',
            component: resolve => require(['@/components/menu/saletask/tasksearch'], resolve),
            name: '绩效查询'
          },
          {
            path: 'mytask',
            component: resolve => require(['@/components/menu/saletask/mytask'], resolve),
            name: '我的绩效'
          },
          {
            path: 'joinorg',
            component: resolve => require(['@/components/menu/org/joinorg'], resolve),
            name: '机构入驻'
          },
          {
            path: 'changeclass',
            component: resolve => require(['@/components/menu/saler/changeclass'], resolve),
            name: '业务员申请转班'
          },
          {
            path: 'syschangeclass',
            component: resolve => require(['@/components/menu/school/sys/syschangeclass'], resolve),
            name: '校长审核转班'
          },
          {
            path: 'financechangeclass',
            component: resolve => require(['@/components/menu/finance/financechangeclass'], resolve),
            name: '财务审核转班'
          },
          {
            path: 'addsalary',
            component: resolve => require(['@/components/menu/salary/addsalary'], resolve),
            name: '工资条发放'
          },
          {
            path: 'salarysearch',
            component: resolve => require(['@/components/menu/salary/salarysearch'], resolve),
            name: '工资查询'
          },

          {
            path: 'liveurl',
            component: resolve => require(['@/components/menu/assistant/liveurl'], resolve),
            name: '直播链接'
          },
          {
            path: 'pushsearch',
            component: resolve => require(['@/components/menu/finance/pushsearch'], resolve),
            name: '推广查询'
          },
          {
            path: 'viplistadd',
            component: resolve => require(['@/components/menu/saler/viplistadd'], resolve),
            name: 'VIP批量录入'
          },
          {
            path: 'returnorder',
            component: resolve => require(['@/components/menu/saler/returnorder'], resolve),
            name: '订单恢复'
          },
          {
            path: 'getusers',
            component: resolve => require(['@/components/menu/huanggang/getusers'], resolve),
            name: '黄冈领取列表'
          },
          {
            path: 'exebookindex',
            component: resolve => require(['@/components/menu/exebook/exe_book_index'], resolve),
            name: '作业本管理'
          },
          {
            path: 'apply',
            component: resolve => require(['@/components/menu/saler/drawback/apply'], resolve),
            name: '退款申请'
          },
          {
            path: 'reoundcheck',
            component: resolve => require(['@/components/menu/finance/reoundcheck'], resolve),
            name: '财务审核退款'
          },
          {
            path: 'schoolsyscheck',
            component: resolve => require(['@/components/menu/saler/drawback/schoolsyscheck'], resolve),
            name: '校长审核退款'
          },
          {
            path: 'addrefund',
            component: resolve => require(['@/components/menu/saler/refund/addrefund'], resolve),
            name: '申请返款'
          },
          {
            path: 'refundcheck',
            component: resolve => require(['@/components/menu/finance/refundcheck'], resolve),
            name: '财务审核返款'
          },
          {
            path: 'schoolsyscheckrefund',
            component: resolve => require(['@/components/menu/school/sys/schoolsyscheckrefund'], resolve),
            name: '校长审核返款'
          },
          {
            path: 'statistics',
            component: resolve => require(['@/components/menu/finance/statistics'], resolve),
            name: '统计模块'
          },
          {
            path: 'schoolstudent',
            component: resolve => require(['@/components/menu/school/schoolstudent'], resolve),
            name: '学生信息'
          },
          {
            path: 'classmsg',
            component: resolve => require(['@/components/menu/class/classmsg'], resolve),
            name: '短信通知'
          },
          {
            path: 'videos',
            component: resolve => require(['@/components/menu/classhour/videos'], resolve),
            name: '阶段管理'
          },
          {
            path: 'browserhis',
            component: resolve => require(['@/components/menu/other/browserhis'], resolve),
            name: '浏览记录'
          },
          {
            path: 'browserhisbyid',
            component: resolve => require(['@/components/menu/other/browserhisbyid'], resolve),
            name: '查询浏览记录'
          },
          {
            path: 'procollect',
            component: resolve => require(['@/components/menu/other/procollect'], resolve),
            name: '查看课程收藏'
          },
          {
            path: 'orgcollect',
            component: resolve => require(['@/components/menu/other/orgcollect'], resolve),
            name: '查看课程收藏'
          },
          {
            path: 'audtionuser',
            component: resolve => require(['@/components/menu/other/audtionuser'], resolve),
            name: '预约试听列表'
          },
          {
            path: 'searchuserorders',
            component: resolve => require(['@/components/menu/school/searchuserorders'], resolve),
            name: '查询用户订单'
          },
          {
            path: 'indexad',
            component: resolve => require(['@/components/menu/indexsys/indexad'], resolve),
            name: '闪屏广告'
          },

          {
            path: 'booklist',
            component: resolve => require(['@/components/menu/book/booklist'], resolve),
            name: '书本管理'
          },
          {
            path: 'bookpower',
            component: resolve => require(['@/components/menu/book/bookpower'], resolve),
            name: '用户书本权限'
          },
          {
            path: 'getbookhis',
            component: resolve => require(['@/components/menu/book/getbookhis'], resolve),
            name: '领取记录'
          },
          {
            path: 'usertesthis',
            component: resolve => require(['@/components/menu/book/usertesthis'], resolve),
            name: '用户试题记录'
          },
          {
            path: 'useridea',
            component: resolve => require(['@/components/menu/book/useridea'], resolve),
            name: '用户反馈'
          },
          {
            path: 'bookhis',
            component: resolve => require(['@/components/menu/book/bookhis'], resolve),
            name: '书本购买记录'
          },
          {
            path: 'shareidea',
            component: resolve => require(['@/components/menu/book/shareidea'], resolve),
            name: '分享反馈'
          },
          {
            path: 'bookbind',
            component: resolve => require(['@/components/menu/book/bookbind'], resolve),
            name: '书本绑定'
          },
          {
            path: 'assigned-order',
            component: resolve => require(['@/components/menu/orders/assigned-order'], resolve),
            name: '分配订单'
          },
          {
            path: 'ordersys',
            component: resolve => require(['@/components/menu/orders/ordersys'], resolve),
            name: '订单系统'
          },
          {
            path: 'partnerlist',
            component: resolve => require(['@/components/menu/partner/partnerlist'], resolve),
            name: '合伙人管理'
          },
          {
            path: 'partnermoney',
            component: resolve => require(['@/components/menu/partner/partnermoney'], resolve),
            name: '合伙人佣金'
          },


          {
            path: 'agent',
            component: resolve => require(['@/components/menu/agent/agent'], resolve),
            name: '代理商管理'
          },
          {
            path: 'agent_order_list',
            component: resolve => require(['@/components/menu/agent/agent_order_list'], resolve),
            name: '订单列表'
          },
          {
            path: 'message_list',
            component: resolve => require(['@/components/menu/agent/message_list'], resolve),
            name: '信息列表'
          },
          {
            path: 'agentorg',
            component: resolve => require(['@/components/menu/agent/agentorg'], resolve),
            name: '代理商机构'
          },

          {
            path: 'agentorgusers',
            component: resolve => require(['@/components/menu/agent/agentorgusers'], resolve),
            name: '代理商机构用户'
          },
          {
            path: 'agentorgorders',
            component: resolve => require(['@/components/menu/agent/agentorgorders'], resolve),
            name: '机构订单'
          },
          {
            path: 'agentoforg',
            component: resolve => require(['@/components/menu/agent/agentoforg'], resolve),
            name: '机构列表'
          },


          {
            path: 'messager',
            component: resolve => require(['@/components/menu/sendpower/messager'], resolve),
            name: '信息员管理'
          },
          {
            path: 'businesser',
            component: resolve => require(['@/components/menu/sendpower/businesser'], resolve),
            name: '运营员管理'
          },
      ]
    }
  ]
})
