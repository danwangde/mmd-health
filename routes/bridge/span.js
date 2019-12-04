const express = require('express');

const router = express.Router();

const query = require('myMysql');

router.get('/select',async function(req,res){
     //查桥跨表返回跨基本信息
    let sql = `select * from mmp.tbl_bridge_span where BridgeLineID=${req.query.BridgeLineID} and BridgeSpanID=${req.query.BridgeSpanID}`;
    let resInfo = await query(sql);
    //查构件表返回当前桥跨下的构件
    let sqlCom = `select * from mmp.tbl_bridge_component where BridgeLineID=${req.query.BridgeLineID} and SuperStructure='001001' and StructureID=${req.query.BridgeSpanID}`
    try{
        let resCom = await query(sqlCom);
        let obj ={};
        obj.data1=resInfo;
        obj.data2=resCom;
        res.json(obj);
    }catch(e){
        console.log('get data err'+e);
    }
})
//桥跨的新增
router.get('/insert',async function(req,res){
    console.log(req.query);
    let sql = `insert into mmp.tbl_bridge_span(BridgeLineID,SpanNum) values(${req.query.BridgeLineID},'${req.query.spanName}')`;
    try{
        let result = await query(sql);
        res.json(1);
    }catch(e){
        console.log('get data err'+e);
        res.json(0);
    }
})
//桥跨的修改
router.post('/update',async function(req,res){
    let sql = `update mmp.tbl_bridge_span set SpanLength=${req.body.SpanLength},SpanWidth=${req.body.SpanWidth},Clearance='${req.body.Clearance}',ArticuleNum='${req.body.ArticuleNum}',SpanCombine='${req.body.SpanCombine}' where BridgeSpanID=${req.body.BridgeSpanID}`;
    try{
        let result = await query(sql);
        console.log(result);
        res.json(1);
    }catch(e){
        console.log('get data err'+e);
        res.json(0);

    }
})
//桥跨的删除
router.get('/delete',async function(req,res){
    let sql = `delete from mmp.tbl_bridge_span where BridgeSpanID=${req.query.BridgeSpanID}`;
    try{
        let result = await query(sql);
        res.json(1);
    }catch(e){
        console.log('insert data err'+e);
        res.json(0);

    }
})

//返回桥跨可选的构件类型
router.get('/selType',async function(req,res){
    let sqlType = `select ComponentTypeName from mmp.componenttype where SuperStructure='跨'`;
    try{
        let result = await query(sqlType);
        res.json(result);
    }catch(e){
        console.log('insert data err'+e);
    }
})
//桥跨下构件信息的新增
router.get('/add',async function(req,res){
   
    let sql = `insert into mmp.tbl_bridge_component(BridgeLineID,SuperStructure,StructureID,ComponentNum,ComponentName,ComponentTypeName) values(${req.query.BridgeLineID},'${req.query.SuperStructure}',${req.query.StructureID},'${req.query.ComponentNum}','${req.query.ComponentName}','${req.query.ComponentTypeName}')`;
    try{
        let result = await query(sql);
        console.log(result);
        res.json('构件新增成功');
    }catch(e){
        console.log('get data err'+e);
    }
})
//桥跨下构件信息的修改
router.get('/updateCom',async function(req,res){
   
    let sql = `update mmp.tbl_bridge_component set
                    ComponentTypeName='${req.query.ComponentTypeName}', 
                    ComponentNum='${req.query.ComponentNum}', 
                    ComponentName='${req.query.ComponentName}'
                where ComponentID=${req.query.ComponentID}`;
    try{
        let result = await query(sql);
        console.log(result);
        res.json('信息更新成功');
    }catch(e){
        console.log('get data err'+e);
    }
})
//桥跨下构件信息的删除
router.get('/deleteCom',async function(req,res){
    let sql = `delete from mmp.tbl_bridge_component where ComponentID=${req.query.ComponentID}`;
    try{
        let result = await query(sql);
        res.json('删除成功');
    }catch(e){
        console.log('insert data err'+e);
    }
})

module.exports = router;

