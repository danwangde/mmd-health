var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const query = require('myMysql');

var app = express();
//app.disable('x-powered-by');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



//app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'static')));
app.use(express.static(path.join(__dirname, 'static/plan')));
app.use(express.static(path.join(__dirname, 'static/photo')));
app.use(express.static('/root/isofile'));


/*
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});
*/
//测试用的
app.get('/user/:id', function (req, res, next) {
  console.log('ID:', req.params.id);
  next();
}, function (req, res, next) {
  res.send('User Info');
});

// 自定义跨域中间件
var allowCors = function(req, res, next) {
    console.log(req.headers.origin);
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.header('Access-Control-Allow-Credentials','true');
    next();
};
app.use(allowCors);//使用跨域中间件

app.all('*',async function(req,res,next){

    let now=get_date_str(new Date());
    //let nowStr=df.dateFormat(now,'yyyy-MM-dd hh:mm:ss');
    let user='';
    let clientAddr='';
    let urlArr=req.url.split('?');
    let calledRouter=urlArr[0];
    if (calledRouter==='/'){
        user=req.query.username;
        clientAddr=req.query.ip;
    }else{
        user=req.cookies.username;
        clientAddr=req.cookies.ip;
        branch_id=req.cookies.branch_id;
    }
   try {
       let sql="INSERT INTO tbl_system_log (username,branch_id,url,ip,operation_time) VALUES('"+ user +"',"+ branch_id +",'"+ urlArr +"','"+ clientAddr +"','"+ now +"')";
       console.log(sql)
       let result = await query(sql);
   }catch(e) {
        console.log(e)
   }
    function get_date_str(Date) {
        var Y = Date.getFullYear();
        var M = Date.getMonth() + 1;
        M = M < 10 ? '0' + M : M; // ??????0
        var D = Date.getDate();
        D = D < 10 ? '0' + D : D;
        var H = Date.getHours();
        H = H < 10 ? '0' + H : H;
        var Mi = Date.getMinutes();
        Mi = Mi < 10 ? '0' + Mi : Mi;
        var S = Date.getSeconds();
        S = S < 10 ? '0' + S : S;
        return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S;
    }

    next()
});

app.use('/loginCheck',require('./routes/login_check'));
app.use('/bridgeInfo',require('./routes/bridge/bridgeinfo'));
app.use('/history',require('./routes/bridge/history'));
app.use('/documentation',require('./routes/bridge/Documentation'));
app.use('/line',require('./routes/bridge/line'));
app.use('/span',require('./routes/bridge/span'));
app.use('/abument',require('./routes/bridge/abument'));
app.use('/pier',require('./routes/bridge/pier'));
app.use('/compontype',require('./routes/bridge/compontype'));
app.use('/component',require('./routes/bridge/component'));
app.use('/passagewayinfo',require('./routes/passageway/passagewayinfo.js'));
app.use('/surface',require('./routes/passageway/surface.js'));
app.use('/entrance',require('./routes/passageway/entrance.js'));
app.use('/branch',require('./routes/branch'));
app.use('/pcomponent',require('./routes/passageway/component.js'));
app.use('/phistory',require('./routes/passageway/history'));
app.use('/pdocumentation',require('./routes/passageway/Documentation'));
app.use('/disease',require('./routes/pubcoms/disease'));
app.use('/curing',require('./routes/curing'));
app.use('/Testing',require('./routes/Testing'));
app.use('/regular',require('./routes/regular'));
app.use('/bridgedataquery',require('./routes/bridgedataquery'));
app.use('/price',require('./routes/bridge/price'));     //
app.use('/bigDataStatics',require('./routes/bigDataStatics'));     //
app.use('/BCI',require('./routes/BCI'));     //
app.use('/assess',require('./routes/assessment'));     //
app.use('/memo',require('./routes/pubcoms/memo'));     //
app.use('/notice',require('./routes/notice'));
// app.use('/ip',require('./routes/ip'));

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
