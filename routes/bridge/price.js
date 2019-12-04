const express = require('express');

const router = express.Router();

const query = require('myMysql');

//插入
router.post('/insert_Project',async function(req,res){
    let data=req.body;
    console.log(data);
    let insert_sql="insert into tbl_Maintenance_Project (project,Unit_Price,Features,unit,dis_id,creat_time) values('"+ data.project +"','"+ data.Unit_Price +"'," +
        " '"+ data.Features +"','"+ data.unit +"',"+ data.disease_name +",'"+ data.creat_time +"')";
    console.log(insert_sql);
    try{
        result=await query(insert_sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1);
});
//查询
router.get('/select_Project',async function(req,res){
    let data=req.query;
    let select_sql="SELECT A.id,disease_name,project,Unit_Price,Features,A.unit,dis_id,creat_time from tbl_Maintenance_Project AS A LEFT JOIN tbl_disease AS B" +
        " ON A.dis_id=B.id";
    try{
        result=await query(select_sql);
    }
    catch(e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//删除
router.get('/delete_Project',async function(req,res){
    let data=req.query;
    let delete_sql="delete from tbl_Maintenance_Project where id="+ data.id +"";
    try{
        result=await query(delete_sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1);
});

//修改
router.post('/update_Project',async function(req,res){
    let data=req.body;
    console.log(data)
    let update_sql="update tbl_Maintenance_Project set project='"+ data.project +"',Unit_Price='"+ data.Unit_Price +"'," +
        " Features='"+ data.Features +"',unit='"+ data.unit +"',dis_id="+ data.disease_name +""+
        " where id="+ data.id +"";
    console.log(update_sql)
    try{
        result=await query(update_sql);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1);
});

module.exports = router;
