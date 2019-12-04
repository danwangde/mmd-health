const express = require('express');
const router = express.Router();
const query = require('myMysql');



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
    console.log(insert_sql);
    try{
        result=await query(insert_sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1)
});

//注册用户时超级管理员和管理员显示的不同部门       入参：用户名  user_name   当前用户部门id   uese_branch_id
router.get('/select',async function(req,res){
    let data=req.query;
    let result;
    let result1;
    let res_branch={};
    if (data.user_id==1){
        let select_admin_sql2="select branch from branch where parent_id = 1 and branch_type = 1";
        let select_admin_sql3="select branch from branch where parent_id = 1 and branch_type = 0";
        let select_admin_sql4="select branch from branch where branch_type = 2";
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
        let select_admin_sql="select branch from branch where parent_id = "+ data.branch_id +" and branch_type = 1 ";
        let select_admin_sql1="select branch from branch where parent_id = "+ data.branch_id +" and branch_type = 0 ";
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
//修改部门名称
router.post('/update_branch',async function(req,res){
    let data=req.body;
    let update_sql="update branch set branch='"+ data.branch +"' where id = "+ data.id +"";
    try{
        result=await query(update_sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1)
});
//删除部门（递归删除子部门）
router.get('/delete_branch',async function(req,res){
    let data=req.query;
    let delete_sql="delete A from branch A right join " +
                   " (select id from branch where find_in_set(id, getChildLst("+ data.branch_id +"))) B " +
                   " on A.id=B.id";
    try{
        result=await query(delete_sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1)
});

//部门查询（首页）
router.get('/select_branch_all',async  function(req,res){
    let data=req.query;
    let resArr=[];
    console.log(data);
    let select_all="select * from branch where find_in_set(id, getChildLst("+ data.branch_id +")) order by id asc";
    try{
        result=await query(select_all);
        let rootArr=[];
        resArr.push(result[0]);
        rootArr.push(result[0]);
        func(rootArr,result);
        res.send(resArr)
    }
    catch(e) {
        console.log(`delete err` + e)
    }
    // res.send(result);
    async function func(dataArr,result){
        for (let n=0;n<dataArr.length;n++){
            for (let j=0;j<result.length;j++){
                if (dataArr[n].id==result[j].parent_id){
                    let Arr=[];
                    Arr.push(result[j]);
                    resArr.push(result[j]);
                    func(Arr,result);
                }
            }
        }
    }
});

module.exports = router;
