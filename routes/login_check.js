const express = require('express');
const router = express.Router();
const query = require('myMysql');
const os = require('os');

function getIPAdress() {
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}
const myHost = getIPAdress();

//登录验证
function obj(state, msg){
    this.state = state;
    this.msg = msg;
}

router.get('/', async function(req, res, next) {
    let username = req.query.username;
    let password = req.query.password;
    let res_body;
    password=new Buffer(password).toString('base64');
    console.log(req.query);
    let result = await query("select id,user_name,password,power,state,registrant_id,user_branch_id from admin where user_name = '" + username + "'");
    console.log(result);
    if(result.length){
        if(result[0].state){
            if(result[0].password === password){
                let msg = new Object();
                msg.userid = result[0].id;
                msg.username = username;
                msg.usertype = result[0].power;
                msg.state = result[0].state;
                msg.branch_id=result[0].user_branch_id;
                res_body = new obj('ok', msg);
                res.cookie('username',username);
                res.cookie('ip',myHost);
                res.cookie('branch_id', msg.branch_id);
                res.cookie('psd',password);
            }
            else{
                res_body = new obj('err', '密码错误');
            }
        }
        else{
            res_body = new obj('err', '该用户已被禁止登录，请联系管理员');
        }
    }
    else{
        res_body = new obj('err', '用户名不存在');
    }
    res.json(res_body);
    console.log(res_body);

});
//
// //添加用户
// //power值用户权限：
//state状态标识  0可用，1不可用
router.post('/insert_user',async function(req,res){                             //超级管理员注册管理员接口
    let data=req.body;
    password=new Buffer(data.password).toString('base64');
    let select_branchid="select id from branch where branch = '"+ data.branch +"'";
    let result3 = await query(select_branchid);
    branch_id=result3[0].id;
    let insert_sql = "insert into admin (user_name,password,power,state,registrant_id,user_branch_id) VALUES('" + data.user_name + "','" + password + "','" + data.power + "','" + data.state + "','"+ data.registrant_id +"',"+ branch_id +")";
    try {
        result = await query(insert_sql);
    } catch (e) {
        if (e=="Error: ER_DUP_ENTRY: Duplicate entry 'jinan8' for key 'user_name'"){
            res.json(2)//用户名重复
        }
        else{
            res.json(3)//部门重复
        }
    }
    let select_sql="select id from admin where user_name='"+ data.user_name +"'";
    result1 = await query(select_sql);
    console.log(result1[0].id);
    let updtate_branch_sql="update branch set user_id = "+ result1[0].id +" where id='"+ branch_id +"'";
    let result2 = await query(updtate_branch_sql);
    res.json(1)
});

//查询
router.post('/select_user',async function (req,res) {
    let data=req.body;
    let select_users="select A.id,A.password,user_name,A.power,A.state,B.branch " +
                       "from admin as A left join branch B " +
                          "on A.user_branch_id=B.id"+
                      " where A.registrant_id="+ data.registrant_id +"";
    console.log(select_users)
    try {
        result = await query(select_users);
    } catch (e) {
        console.log(`insert err` + e)
    }
    res.json(result)
});

// //用户修改
router.post('/update_user',async function(req,res){
    let data=req.body;
    let password=new Buffer(data.password).toString('base64');
    console.log(data);
    let select_branchid1="select id from branch where branch = '"+ data.branch +"'";
    let result3 = await query(select_branchid1);
    branch_id=result3[0].id;
    let update_users_sql="update admin set power = "+ data.power +",password='"+password +"',state="+ data.state +",registrant_id="+ data.registrant_id +",user_branch_id="+ branch_id +" where user_name= '"+ data.user_name +"'";
    console.log(update_users_sql)
    try{
        result=await query(update_users_sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1)
});
//密码修改
router.post('/update_password',async function(req,res){
    let data=req.body;
    password=new Buffer(data.password).toString('base64');
    let update_password_sql="update admin set password='"+ password +"' where user_name='"+ data.username +"'";
    try{
        result=await query(update_password_sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1)
});
// //用户删除
router.post('/delete_user',async function(req,res) {
   let data=req.body;
   let del_user_sql="DELETE from admin WHERE admin.id='"+ data.user_id +"'";
   let update_bridge="update tbl_bridge_info set checkid='',curingid='' where (curingid="+ data.user_id +" or checkid="+ data.user_id +")";
    try{
        result=await query(del_user_sql);
        result1=await query(update_bridge);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1)
});

//查询对应管理员所有用户信息    传入部门id
router.get('/select_all_admin',async function (req,res) {
    let data=req.query;
    let select_users="select N.id,N.user_name,N.power,N.state,N.branch,M.BridgeNum,M.BridgeName,M.MainStructType from tbl_bridge_info as M left join ( " +
                     " select A.id,A.user_name,A.power,A.state,B.branch from admin as A right join ( " +
                     " select * from branch where find_in_set(id, getChildLst("+ data.branch_id +"))) as B" +
                     "on A.user_branch_id=B.id" +
                     "where user_name is not null) as N" +
                     "on (M.curingid=N.id or M.checkid=N.id)" +
                     "WHERE user_name is not null";
    try{
        result=await query(select_users);
    }
    catch(e) {
        console.log(`select err` + e)
    }
    res.send(ress)

});

//查询当前管理员所有的部门（树形结构）
router.get('/select_branch', async function(req, res, next) {
    let array=[];
    await query('SELECT * from branch ', function(err, rows, fields) {
        if (err) throw err;
        //get all data
        let result = [];//存放起始对象
        let allMenu = rows;//获取sql出的全部json对象
        for(i=0;i<allMenu.length;i++){
            if(allMenu[i].user_id == req.query.user_id){
                result.push(allMenu[i]) ;//根据id号获取根对象
                break;
            }
        }
        // //     //judege result exist or not
        if(result.length==0){
            return res.json('Failed! id is not exist!');
        }else{
            result.children=[];
            result.children=getAllChild(result);//调用
            console.log(result);
            let result1= JSON.parse(JSON.stringify(result).replace(/branch/g,"label"));
            array.push(result1[0]);
            res.json(array);
        }
        //     //find some item all child
        function findItemChild(item){
            let arrayList=[];
            for(let i in allMenu){
                if(allMenu[i].parent_id == item.id){
                    arrayList.push(allMenu[i]);
                }
            }
            return arrayList;
        }
        //get all child
        function getAllChild(array){
            let childList=findItemChild(array[0]);
            if(childList == null){
                return [];
            }
            else{
                for(let j in childList){
                    childList[j].children=[];
                    childList[j].children=getAllChild([childList[j]]);
                }
                array[0].children=childList;
            }
            return childList;

        }
    });
});

//超级管理员新增部门       branch(添加的部门名称)  id（他的父级id,哪个部门新建的他就是那个部门的id）
//部门类型0检测 1养护 2管理
router.get('/insert_branch', async function(req,res){
    let data=req.query;
    let insert_sql="insert into branch (branch,parent_id,user_id,branch_type) values('"+ data.branch +"','"+ data.id +"','','"+ data.branch_type +"')";
    try{
        result=await query(insert_sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1)
});


router.get('/select',async function(req,res){
    let data=req.query;
    let result;
    let result1;
    let res_branch={};
    if (data.user_name=='root'){
        let select_admin_sql2="select branch from branch where parent_id = 1 and branch_type = 2";
        let select_admin_sql3="select branch from branch where parent_id = 1 and branch_type = 0";
        let select_admin_sql4="select branch from branch where parent_id = 1 and branch_type = 1";
        try{
            result=await query(select_admin_sql2);
            result1=await query(select_admin_sql3);
            result2=await query(select_admin_sql4);
            res_branch.curing=result;
            res_branch.check=result1;
            res_branch.manage=result2;
        }
        catch(e) {
            console.log(`select err` + e)
        }
    }
    else{
        let select_admin_sql="select branch from branch where parent_id = "+ data.parent_id +" and branch_type = 1 ";
        let select_admin_sql1="select branch from branch where parent_id = "+ data.parent_id +" and branch_type = 0 ";
        try{
            result=await query(select_admin_sql);
            result1=await query(select_admin_sql1);
            res_branch.curing=result;
            res_branch.check=result1
        }
        catch(e) {
            console.log(`select err` + e)
        }
    }
    res.json(res_branch);
});
//app新增接口
router.get('/app_login', async function(req, res, next) {
    let code = req.query.code;
    let res_body;
    console.log(req.query);
    let result = await query("SELECT B.id,userid,equipmentcode,Users,user_name,power,state,registrant_id,user_branch_id FROM app_equipment_code AS A LEFT JOIN admin AS B" +
                                " ON A.userid=B.id" +
                                " WHERE equipmentcode='"+ code +"'");
    console.log(result);
    if(result.length){
        if(result[0].state){
            let msg = new Object();
            msg.userid = result[0].id;
            msg.user = result[0].Users;
            msg.parentId = result[0].registrant_id;
            msg.code = result[0].equipmentcode;
            msg.username = result[0].user_name;
            msg.usertype = result[0].power;
            msg.state = result[0].state;
            msg.branch_id=result[0].user_branch_id;
            res_body = new obj('ok', msg);
            res.cookie('username',result[0].user_name);
        }
        else{
            res_body = new obj('err', '该用户已被禁止登录，请联系管理员');
        }
    }
    else{
        res_body = new obj('err', '用户名不存在');
    }
    res.json(res_body);
    console.log(res_body);

});
//设备码查询
router.get('/select_code',async function(req,res){
    data=req.query;
    select_sql="SELECT * FROM app_equipment_code WHERE userid="+ data.uid +"";
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
//添加设备码
router.post('/insert_code',async function(req,res){
    let data=req.body;
    console.log(data);
    insert_sql="INSERT INTO app_equipment_code (userid,equipmentcode,Users) VALUES("+ data.uid +",'"+ data.equipmentcode +"'"+",'"+ data.Users +"')";
    console.log(insert_sql)
    try {
        result = await query(insert_sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1);
});
//删除设备码
router.get('/delete_code',async function(req,res){
    data=req.query;
    delete_sql="delete from app_equipment_code where codeid="+ data.codeid +"";
    try {
        result = await query(delete_sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1);
});
//管理账号修改自己密码
router.post('/update_password', async function (req,res) {
    let data = req.body;
    let password=new Buffer(data.password).toString('base64');
    let sql = "update admin set password='"+password +"'" +"where user_name='" + data.username +",";
    let result = await query(sql);
    try{
        res.json(1);
    }catch(e){
        console.log('update password err'+e);
    }
})
module.exports = router;
