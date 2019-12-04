const express = require('express');

const router = express.Router();

const query = require('myMysql');

router.post('/select',async function(req,res){
    console.log(req.body);
    let sql = `select a.PassageWayNum, a.PassageWayName,b.BuildType,b.PassHisID,b.BuildDate from mmp.tbl_passageway_info a inner join mmp.tbl_passageway_history b on a.PassagewayID=b.PassagewayID where a.PassagewayID=${req.body.PassagewayID} and  b.PassagewayID=${req.body.PassagewayID}`;
    try{
        let result = await query(sql);
        res.json(result);
    }catch(e){
        console.log('get data err'+e);
    }
})

router.post('/insert',async function(req,res){
    let sql = `insert into mmp.tbl_passageway_history(PassagewayID,BuildType,BuildDate) values (${req.body.PassagewayID},'${req.body.BuildType}','${req.body.BuildDate}')`;
    try{
        let result = await query(sql);
        res.json(1);
    }catch(e){
        res.json(0);
    }
})

router.post('/update',async function(req,res){
    let sql = `update  mmp.tbl_passageway_history set BuildType='${req.body.BuildType}',BuildDate='${req.body.BuildDate}' where PassHisID=${req.body.PassHisID}`;
    try{
        let result = await query(sql);
        res.json(1);
    }catch(e){
        res.json(0);
    }
})

router.post('/delete',async function(req,res){
    let sql = `delete from mmp.tbl_passageway_history where PassHisID=${req.body.PassHisID}`;
    try{
        let result = await query(sql);
        res.json(1);
    }catch(e){
        res.json(0);
    }
})

module.exports = router;