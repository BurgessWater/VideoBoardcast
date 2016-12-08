// ---------- 通用设置 ---------

// 后台接口服务器地址
var NORMAL_SERVER = 'http://192.168.0.11';
// var NORMAL_SERVER = 'http://66.66.66.52';

// 本Web页面部署地址
var SINGLE_PAGE_DEP = 'http://192.168.0.11';

// 通用后台接口请求路径
var AJAX_URL = NORMAL_SERVER + '/BIService/BiServlet';

// 聊天后台接口请求路径
var CHAT_URL = NORMAL_SERVER + '/ImService/ImServlet';

// 访客用户名
var GUEST_NAME = 'cfkd01';

// 访客密码
// var GUEST_PWD = 'cfkd01';
var GUEST_PWD = '123456';


// ---------- 直播相关地址设置 ---------

// 投资宝典 地址
var FILE_UPLOAD_URL = NORMAL_SERVER + '/BIService/FileUpLoad';

// 保存至桌面快捷方式
var SHORTCUT_URL = NORMAL_SERVER + '/BIService/DeskTopServlet';

// 聊天区域上传图片 地址
var UPLOAD_IMG_URL = NORMAL_SERVER + '/ImService/ImageUpLoad';

// 上传战绩图片 地址
var UPLOAD_ACHIEVEMENT_IMG_URL = NORMAL_SERVER + '/BIService/ImageUpLoad';

// 战绩图片获取 地址
var ACHIEVEMENT_IMG_URL = NORMAL_SERVER + '/cfpro/upload/goodrecord.png';

// 财经日历 地址 （请根据实际部署地址做修改）
// var FINANCE_URL = NORMAL_SERVER + '/financePC';
// 财经日历 临时显示地址
var FINANCE_URL = 'http://120.76.249.140/financePC';


// -------- 直播相关定时器时间设置 ---------

// 登录超时 20分钟
var LOGIN_TIME_OUT_COUNT = 20 * 60;

// 即将超时提示 15分钟 , 需小于登录超时的时间
var GOING_TIME_OUT_TIME = 15 * 60;

// 刷新token 5分钟
var REFRESH_TOKEN_TIME = 5 * 60;

// 打卡 50秒
var CHECK_TIME = 50;

// 刷新聊天记录 10秒
var CHAT_MSG_TIME = 10;

// 获取广播 30秒
var BROADCAST_TIME = 30;

// 刷新公告列表 10秒
var NEW_NOTICE_TIME = 10;

// 在线用户 50秒
var ONLINE_USER_TIME = 50;


// ---------- 用户单页面链接设置 ---------

// 登录页面
var LOGIN_URL = SINGLE_PAGE_DEP + 'login.html';

// 注册页面
var REG_URL = SINGLE_PAGE_DEP + 'reg.html';

// 找回密码页面
var RESET_URL = SINGLE_PAGE_DEP + 'reset.html';

