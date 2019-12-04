const express = require('express');
const router = express.Router();
const query = require('myMysql');
const multer = require('multer');
const path = require('path');

//病害新增
router.post('/insert_disease_detection',async function(req,res){
    let data=req.body;
    console.log(data);
    if(data.Facility_type=='桥梁'){
        data.Facility_type=0;
    }else{
        data.Facility_type=1;
    };
  
    let insert_sql="INSERT INTO disease_detection (disease_description,component_id,disease_id,check_id,Facility_type,position,evaluate_id,disease_level)" +
    " VALUES('"+ data.disease_description +"',"+ data.ComponentID +","+ data.disease_id +","+ data.check_id +"," +
    " "+ data.Facility_type +",'"+ data.position +"','"+ data.eval +"','"+ data.disease_level +"')";
    try{
        result=await query(insert_sql);
        res.json(1);
    }
    catch(e) {
        res.json(0);
    }
});
//病害查询
router.get('/select_disease_detection',async function(req,res){
    let data=req.query;
    console.log(data)
    if(data.Facility_type=='桥梁'){
        data.Facility_type=0;
    }else{
        data.Facility_type=1;
    }
    if (data.Facility_type==0){
        table='tbl_bridge_component'
    }
    else{
        table='tbl_passageway_component';
    }
    let select_sql=" SELECT Q.id,disease_description,component_id,disease_id,check_id,Facility_id,Patrol_unit,BCI,Q.Facility_type,POSITION,ComponentName,disease_level,"+
		" ComponentTypeName,DiseaseType,DamageType,DiseaseDefine,evaluate_id FROM disease AS P RIGHT JOIN("+
		" SELECT N.id,disease_description,component_id,disease_id,check_id,Facility_id,Patrol_unit,BCI,N.Facility_type,POSITION,disease_level,"+
		" ComponentName,ComponentTypeName,evaluate_id FROM "+ table +" AS M RIGHT JOIN("+
		" SELECT B.id,disease_description,component_id,disease_id,check_id,Facility_id,Patrol_unit,BCI,B.Facility_type,disease_level,"+
		" POSITION,evaluate_id FROM tbl_Routine_testing AS A RIGHT JOIN("+
		" SELECT id,disease_description,component_id,disease_id,check_id,Facility_type,position,evaluate_id,disease_level FROM disease_detection) AS B"+
		" ON A.id=B.check_id"+
		" WHERE check_id="+ data.id +") AS N"+
		" ON M.ComponentID=N.component_id) AS Q"+
		" ON P.DiseaseID=Q.disease_id";
    try{
        result=await query(select_sql);
        res.json(result);
    }
    catch(e) {
        console.log(`select err` + e)
    }
   
});
//查线路
router.get('/select_line', async function (req,res) {
    let data = req.query;
    if(data.Facility_type=='桥梁'){
        data.Facility_type=0;
    }else{
        data.Facility_type=1;
    };
    if (data.Facility_type==0) {
        let sql = "select LineName,BridgeLineID from tbl_bridge_line where BridgeID="+data.id+"";
        try {
            let result = await query(sql);
            res.json(result);
        }catch (e){
            console.log(`get data err` + e)
        }
    }
});

//查询构件
router.get('/select_evaluate_component',async function(req,res){
    let data=req.query;
    if(data.Facility_type=='桥梁'){
        data.Facility_type=0;
    }else{
        data.Facility_type=1;
    };
    if (data.Facility_type==0){
        let select_sql="select ComponentID, SuperStructure,StructureID,ComponentName,ComponentTypeName,evalvalue,BridgeID FROM tbl_bridge_component AS A LEFT JOIN tbl_bridge_line AS B" +
                       " ON A.BridgeLineID=B.BridgeLineID" +
                       " WHERE BridgeID="+ data.id +" and A.BridgeLineID="+data.LineID;
        try{
            result=await query(select_sql);
        }
        catch(e) {
            console.log(`select err` + e)
        }
        res.send(result);
    }
    else{
        let select_sql="SELECT A.PassagewayID,SuperStructure,StructureID,ComponentName,ComponentTypeName FROM tbl_passageway_component AS A LEFT JOIN tbl_passageway_info AS B " +
                        " ON A.PassagewayID=B.PassagewayID" +
                        " WHERE A.PassagewayID="+ data.id +"";
        try{
            result=await query(select_sql);
        }
        catch(e) {
            console.log(`select err` + e)
        }
        res.send(result);
    }
});
router.get('/select_evaluate',async function(req,res){
    let data=req.query;
    console.log(data);
    let res1;
    if(data.Facility_type=='桥梁'){
        data.Facility_type=0;
    }else{
        data.Facility_type=1;
    };
    if(data.Facility_type==0){
        let sql = `select evalvalue,ComponentTypeName,SuperStructure from tbl_bridge_component where ComponentID=${data.ComponentID}`;
        let result=await query(sql);
       for(let item of result){
            if(item.evalvalue!==''){
               res1 = result;
            }else{
                let sql1 = `select * from disease where CompType in (select ComponentTypeName from tbl_bridge_component where ComponentID=${data.ComponentID})`;
                res1=await query(sql1)
            }
       }
        try{
           
            res.json(res1);
        }
        catch(e) {
            console.log(`select err` + e)
        }
     
    }
    
})
router.get('/select_des',async function (req,res) {
    let data = req.query;
    let sql = 'select DiseaseDefine from disease where DiseaseID ='+data.disease_id;
    try{
        result=await query(sql);
        res.send(result);
    }
    catch(e) {
        console.log(`select err` + e)
    }
   
})
//对应病害库查询病害
router.get('/select_disease_select',async function(req,res){
    let data=req.query;
    let select_sql="SELECT * from disease WHERE CompType='"+ data.CompType +"'";
    try{
        result=await query(select_sql);
    }
    catch(e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

module.exports = router;