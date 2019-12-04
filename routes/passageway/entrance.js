const express = require('express');

const router = express.Router();

const query = require('myMysql');

router.get('/select',async function(req,res){
    //查出入口表返回出入口基本信息
    let sql = `select * from mmp.tbl_passageway_entrance where PassagewayID=${req.query.PassagewayID} and EntranceID=${req.query.EntranceID}`;
    let resInfo = await query(sql);
    //查构件表返回当前出入口下的构件
    let sqlCom = `select * from mmp.tbl_passageway_component where PassagewayID=${req.query.PassagewayID} and SuperStructure='079002' and StructureID=${req.query.EntranceID}`;
    try{
        let resCom = await query(sqlCom);
        let obj ={};
        obj.data1=resInfo;
        obj.data2=resCom;
        res.json(obj);
    }catch(e){
        console.log('get data err'+e);
    }
});
//出入口的新增
router.post('/insert',async function(req,res){
    let sql = `insert into mmp.tbl_passageway_entrance(PassagewayID,EntranceName) values(${req.body.PassagewayID},'${req.body.EntranceName}')`;
    try{
        let result = await query(sql);
        console.log(result);
        res.json(1);
    }catch(e){
        console.log('get data err'+e);
        res.json(0);
    }
});
//出入口信息修改 Width  Slope GuardrailMaterial   GuardrailLength  GuardrailHigh
router.post('/update',async function(req,res){
    let sql = `update mmp.tbl_passageway_entrance set EntranceName='${req.body.EntranceName}',Slope='${req.body.Slope}',StairwayMatrial='${req.body.StairwayMatrial}',NonslipMaterial='${req.body.NonslipMaterial}',Width=${req.body.Width},GuardrailMaterial='${req.body.GuardrailMaterial}',GuardrailLength=${req.body.GuardrailLength},GuardrailHigh=${req.body.GuardrailHigh} where EntranceID=${req.body.EntranceID}`;
    console.log(sql)
    try{
        let result = await query(sql);
        console.log(result);
        res.json(1);
    }catch(e){
        console.log('get data err'+e);
        res.json(0);
    }
})
//出入口的删除
router.get('/delete',async function(req,res){
    let sql = `delete from mmp.tbl_passageway_entrance where EntranceID=${req.query.EntranceID}`;
    try{
        let result = await query(sql);
        res.json(1);
    }catch(e){
        console.log('insert data err'+e);
        res.json(0);
    }
})
//返回出入口可选的构件类型
router.get('/selType',async function(req,res){
    let sqlType = `select ComponentTypeName from mmp.componenttype where SuperStructure = '出入口'`;
    try{
        let result = await query(sqlType);
        res.json(result);
    }catch(e){
        console.log('insert data err'+e);
    }
})
//出入口下构件信息的新增
router.get('/add',async function(req,res){
   
    let sql = `insert into mmp.tbl_passageway_component(PassagewayID,SuperStructure,StructureID,ComponentNum,ComponentName,ComponentTypeName) values(${req.query.PassagewayID},'${req.query.SuperStructure}',${req.query.StructureID},'${req.query.ComponentNum}','${req.query.ComponentName}','${req.query.ComponentTypeName}')`;
    try{
        let result = await query(sql);
        console.log(result);
        res.json(result);
    }catch(e){
        console.log('get data err'+e);
    }
})
//出入口下构件信息的修改
router.get('/updateCom',async function(req,res){
   
    let sql = `update mmp.tbl_passageway_component set
                    ComponentTypeName='${req.query.ComponentTypeName}', 
                    ComponentNum='${req.query.ComponentNum}', 
                    ComponentName='${req.query.ComponentName}'
                where ComponentID=${req.query.ComponentID}`;
    try{
        let result = await query(sql);
        console.log(result);
        res.json('更新成功');
    }catch(e){
        console.log('get data err'+e);
    }
})
//出入口下构件信息的删除
router.get('/deleteCom',async function(req,res){
    let sql = `delete from mmp.tbl_passageway_component where ComponentID=${req.query.ComponentID}`;
    try{
        let result = await query(sql);
        res.json('删除成功');
    }catch(e){
        console.log('insert data err'+e);
    }
})

module.exports = router;

