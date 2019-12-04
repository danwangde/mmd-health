const express = require('express');

const router = express.Router();

const query = require('myMysql');

router.post('/select',async function(req,res){
    console.log(req.body);
    let sql = `select a.BridgeNum, a.BridgeName,b.BuildType,b.BridgeHistoryId,b.BuildDate from mmp.tbl_bridge_info a inner join mmp.tbl_bridge_history b on a.BridgeID=b.BridgeID where a.BridgeID=${req.body.BridgeID} and  b.BridgeID=${req.body.BridgeID}`;
    try{
        let result = await query(sql);
        res.json(result);
    }catch(e){
        console.log('get data err'+e);
    }
})

router.post('/insert',async function(req,res){
    let sql = `insert into mmp.tbl_bridge_history(BridgeID,BuildType,BuildDate) values (${req.body.BridgeID},'${req.body.BuildType}','${req.body.BuildDate}')`;
    try{
        let result = await query(sql);
        res.json(1);
    }catch(e){
        res.json(0);
    }
})

router.post('/update',async function(req,res){
    let sql = `update  mmp.tbl_bridge_history set BuildType='${req.body.BuildType}',BuildDate='${req.body.BuildDate}' where BridgeHistoryId=${req.body.BridgeHistoryId}`;
    try{
        let result = await query(sql);
        res.json(1);
    }catch(e){
        res.json(0);
    }
})

router.post('/delete',async function(req,res){
    let sql = `delete from mmp.tbl_bridge_history where BridgeHistoryId=${req.body.BridgeHistoryId}`;
    try{
        let result = await query(sql);
        res.json(1);
    }catch(e){
        res.json(0);
    }
})

module.exports = router;