const express = require('express');

const router = express.Router();

const query = require('myMysql');

router.get('/select', async function (req, res) {
    //查桥台表返回出入口基本信息
    let sql = `select * from mmp.tbl_bridge_abutment where BridgeLineID=${req.query.BridgeLineID} and BridgeAbuID=${req.query.BridgeAbuID} order by BridgeAbuID desc`;
    let resInfo = await query(sql);
    //查构件表返回当前桥台下的构件
    let sqlCom = `select * from mmp.tbl_bridge_component where BridgeLineID=${req.query.BridgeLineID} and SuperStructure='001002' and StructureID=${req.query.BridgeAbuID}`
    try {
        let resCom = await query(sqlCom);
        let obj = {};
        obj.data1 = resInfo;
        obj.data2 = resCom;
        console.log(obj)
        res.json(obj);
    } catch (e) {
        console.log('get data err' + e);
    }
})
//桥台的新增
router.get('/insert', async function (req, res) {
    console.log(req.query)
    let sql = `insert into mmp.tbl_bridge_abutment(BridgeLineID,BridgeAbutmentNum) values(${req.query.BridgeLineID},'${req.query.abutmentName}')`;
    try {
        let result = await query(sql);
        console.log(result);
        res.json(1);
    } catch (e) {
        console.log('get data err' + e);
        res.json(0);
    }
})
//桥台的修改
router.post('/update', async function (req, res) {
    let sql = `update mmp.tbl_bridge_abutment set BridgeAbutmentNum=${req.body.BridgeAbutmentNum},CapForm=${req.body.CapForm},CapLength=${req.body.CapLength},CapHeight='${req.body.CapHeight}',CapWidth='${req.body.CapWidth} where BridgeAbuID=${req.body.BridgeAbuID}`;
    try {
        let result = await query(sql);
        console.log(result);
        res.json(1);
    } catch (e) {
        console.log('get data err' + e);
        res.json(0);
    }
})
//桥台的删除
router.get('/delete', async function (req, res) {
    let sql = `delete from mmp.tbl_bridge_abutment where BridgeAbuID=${req.query.BridgeAbuID}`;
    try {
        let result = await query(sql);
        res.json(1);
    } catch (e) {
        console.log('insert data err' + e);
        res.json(0);

    }
})

//返回桥台可选的构件类型
router.get('/selType', async function (req, res) {
    let sqlType = `select ComponentTypeName from mmp.componenttype where SuperStructure='桥台'`;
    try {
        let result = await query(sqlType);
        res.json(result);
    } catch (e) {
        console.log('insert data err' + e);
    }
})
//桥台下构件信息的新增
router.get('/add', async function (req, res) {

    let sql = `insert into mmp.tbl_bridge_component(BridgeLineID,SuperStructure,StructureID,ComponentNum,ComponentName,ComponentTypeName) values(${req.query.BridgeLineID},'${req.query.SuperStructure}',${req.query.StructureID},'${req.query.ComponentNum}','${req.query.ComponentName}','${req.query.ComponentTypeName}')`;
    try {
        let result = await query(sql);
        console.log(result);
        res.json('构件新增成功');
    } catch (e) {
        console.log('get data err' + e);
    }
})
//桥台下构件信息的修改
router.get('/updateCom', async function (req, res) {

    let sql = `update mmp.tbl_bridge_component set
                    ComponentTypeName='${req.query.ComponentTypeName}', 
                    ComponentNum='${req.query.ComponentNum}', 
                    ComponentName='${req.query.ComponentName}'
                where ComponentID=${req.query.ComponentID}`;
    try {
        let result = await query(sql);
        console.log(result);
        res.json('信息更新成功');
    } catch (e) {
        console.log('get data err' + e);
    }
})
//桥台下构件信息的删除
router.get('/deleteCom', async function (req, res) {
    let sql = `delete from mmp.tbl_bridge_component where ComponentID=${req.query.ComponentID}`;
    try {
        let result = await query(sql);
        res.json('删除成功');
    } catch (e) {
        console.log('insert data err' + e);
    }
})

module.exports = router;