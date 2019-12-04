const express = require('express');
const router = express.Router();
const query = require('myMysql');

//查线路表返回相应数据
router.get('/select',async (req,res)=> {
    let sql = `select BridgeID,BridgeLineID, LineName,LineNum,MainStructureType,LineLength,LineWidth,DeckArea,BridgeSpan,AcrossGroup,BridgeSpanType,BridgeHeadName,BridgeTailName,RetainingWallType,BankRevetmentType,LadderCount,CurveRadius,HorizontalSlope,VerticalSlope,StraightObliqueCorner,GuideLength,GuideVerticalSlope from mmp.tbl_bridge_line where BridgeID=${req.query.BridgeID} and BridgeLineID=${req.query.BridgeLineID}`;
    try{
        let resData =  await query(sql);
        console.log(resData);
        res.json(resData);
    }catch (e) {
        console.log('get data err'+e)
    }
});
router.post('/update',async (req,res)=> {
    let sql = `update mmp.tbl_bridge_line set
                    LineName='${req.body.LineName}',
                    LineNum='${req.body.LineNum}',
                    MainStructureType='${req.body.MainStructureType}',
                    LineLength='${req.body.LineLength}',
                    LineWidth='${req.body.LineWidth}',
                    DeckArea='${req.body.DeckArea}',
                    BridgeSpan='${req.body.BridgeSpan}',
                    AcrossGroup='${req.body.AcrossGroup}',
                    BridgeSpanType='${req.body.BridgeSpanType}',
                    BridgeHeadName='${req.body.BridgeHeadName}',
                    BridgeTailName='${req.body.BridgeTailName}',
                    RetainingWallType='${req.body.RetainingWallType}',
                    BankRevetmentType='${req.body.BankRevetmentType}',
                    LadderCount='${req.body.LadderCount}',
                    CurveRadius='${req.body.CurveRadius}',
                    HorizontalSlope='${req.body.HorizontalSlope}',
                    VerticalSlope='${req.body.VerticalSlope}',
                    StraightObliqueCorner='${req.body.StraightObliqueCorner}',
                    GuideLength='${req.body.GuideLength}',
                    GuideVerticalSlope='${req.body.GuideVerticalSlope}'
                where BridgeID=${req.body.BridgeID} and BridgeLineID=${req.body.BridgeLineID}`;
    console.log(sql);
    try{
        let result = await query(sql);
        res.json(1);
    }catch(e){
        console.log('update err:'+e);
        res.json(0);

    }
});


//新增线路
router.get('/insert',async (req,res) =>{
    let sql =`insert into mmp.tbl_bridge_line(BridgeID,LineName) values(${req.query.BridgeID},'${req.query.lineName}')`;
    try{
        let result = await query(sql);
        let sql_select = `select BridgeLineID from mmp.tbl_bridge_line order by BridgeLineID desc limit 0,1`;
        let res_sel = await query(sql_select);
        let sql_surface = `insert into mmp.tbl_bridge_surface(BridgeLineID) values(${res_sel[0].BridgeLineID})`;
        let sql_attach = `insert into mmp.tbl_bridge_attachment(BridgeLineID) values(${res_sel[0].BridgeLineID})`;
        let sql_anti = `insert into mmp.tbl_bridge_antiknock(BridgeLineID) values(${res_sel[0].BridgeLineID})`;
        await query(sql_surface);
        await query(sql_attach);
        await query(sql_anti);
        res.json(1);
    }catch(e){
        console.log(e);
        res.json(0)
    }
});

router.get('/delete',async (req,res)=> {
    let sql = `delete from mmp.tbl_bridge_line where BridgeLineID=${req.query.BridgeLineID}`;
    try{
        let result = await query(sql);
        res.json(1);
    }catch (e) {
        console.log('delete err:'+e);
        res.json(0)
    }
});

module.exports = router;

