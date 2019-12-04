const express = require('express');
const router = express.Router();
const query = require('myMysql');
const multer = require('multer');
const path = require('path');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, path.join(__dirname, '../../static/photo'));
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let upload = multer({
    storage: storage
});
//新增备忘录
router.post('/insert_memorandum',upload.single('file'),async function(req,res){
    let data=req.body;
    let file;
    if(req.file) {
        file = req.file;
    }else {
        file = '';
    }
    console.log(file);
    let sql="insert into memorandum (content,path,theme,creat_time,branch_id,state) values('"+ data.content +"','"+file.filename+"','"+ data.theme +"','"+ data.creat_time +"',"+ data.branch_id +",'" +"0'" +")";
    console.log(sql);
    try {
        result = await query(sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1);
});
//删除备忘录
router.get('/delete_memorandum',async function(req,res){
    let data=req.query;
    let sql="delete from memorandum where memorandum_id="+ data.memorandum_id +"";
    try {
        result = await query(sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1);
});

router.get('/select_memorandum1',async function(req,res){
    let data=req.query;
    // let preDate = new Date(date.getTime() + 48*60*60*1000); //前一天
    let pre = get_date_str(new Date());
    console.log(pre);
    let sql="select * from memorandum where branch_id="+ data.branch_id +"" +
        " and DATE_FORMAT(creat_time,'%Y-%m-%d')='"+pre+"'" +
        " and state= '0'"+
        " ORDER BY creat_time desc";
    console.log(sql)
    try {
        result = await query(sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
    function get_date_str(Date) {
        var Y = Date.getFullYear();
        var M = Date.getMonth() + 1;
        M = M < 10 ? '0' + M : M;// ??????0
        var D = Date.getDate();
        D = D < 10 ? '0' + D : D;
        var H = Date.getHours();
        H = H < 10 ? '0' + H : H;
        var Mi = Date.getMinutes();
        Mi = Mi < 10 ? '0' + Mi : Mi;
        var S = Date.getSeconds();
        S = S < 10 ? '0' + S : S;
        return Y + '-' + M + '-' + D ;
    };
});

//查询备忘录
router.get('/select_memorandum',async function(req,res){
    let data=req.query;
    let sql="select * from memorandum where branch_id="+ data.branch_id +"" +
        " ORDER BY creat_time desc";
    try {
        result = await query(sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//修改备忘录
router.post('/update_memorandum1',async function(req,res){
    let data=req.body;
    console.log(data)
    let pre = get_date_str(new Date());
    try {
        let sql="update memorandum set state='1' where DATE_FORMAT(creat_time,'%Y-%m-%d')='"+pre+"'" ;
        console.log(sql);
        result = await query(sql);
        res.json(1);
    }
    catch(e) {
        res.json(0)
    }
    function get_date_str(Date) {
        var Y = Date.getFullYear();
        var M = Date.getMonth() + 1;
        M = M < 10 ? '0' + M : M;// ??????0
        var D = Date.getDate();
        D = D < 10 ? '0' + D : D;
        var H = Date.getHours();
        H = H < 10 ? '0' + H : H;
        var Mi = Date.getMinutes();
        Mi = Mi < 10 ? '0' + Mi : Mi;
        var S = Date.getSeconds();
        S = S < 10 ? '0' + S : S;
        return Y + '-' + M + '-' + D ;
    };

});

//修改备忘录
router.post('/update_memorandum',upload.single('file'),async function(req,res){
    let data=req.body;
    let file;
    if (req.file == undefined) {
        file = req.body.path;
    } else {
        file = req.file.filename;
    };
    let sql="update memorandum set content='"+ data.content +"',path='"+file+"',theme='"+ data.theme +"',creat_time='"+ data.creat_time +"' where memorandum_id="+ data.memorandum_id +"";
    try {
        result = await query(sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1);
});
router.get('/select_log',async function(req,res){
    let data=req.query;
    let sql="SELECT username,branch,url,ip,operation_time FROM branch AS A RIGHT JOIN(" +
        " SELECT username,branch_id,url,ip,operation_time FROM tbl_system_log" +
        " WHERE branch_id IN (select id from branch where find_in_set(id, getChildLst("+ data.branch_id +")) AND id <> "+ data.branch_id +")) AS B" +
        " ON A.id=B.branch_id"
    try {
        let result = await query(sql);
        console.log(result);
        //result = result.sort(compare('operation_time',true));
        res.send(result);
    } catch (e) {
        console.log(`select err` + e)
    }

});
module.exports = router;
