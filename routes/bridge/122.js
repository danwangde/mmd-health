const express = require('express');

const router = express.Router();

const query = require('myMysql');

//桥首页信息
router.get('/select',async function(req,res){
    console.log(req.url);
    let userid = req.query.userid,
        usertype = req.query.usertype,
        sql,
        resData;
    if(usertype=='1'){
        sql = `select BridgeID, BridgeNum,BridgeName,TotalLength,ManageUnit,CuringGrade,MainStructType from mmp.tbl_bridge_info where manageid='${userid}'`;
        console.log(sql)
    }else if(usertype=='2'){
        sql = `select BridgeID, BridgeNum,BridgeName,TotalLength,ManageUnit,CuringGrade,MainStructType from mmp.tbl_bridge_info where curingid='${userid}'`;
    }else if(usertype=='3'){
        sql = `select BridgeID, BridgeNum,BridgeName,TotalLength,ManageUnit,CuringGrade,MainStructType from mmp.tbl_bridge_info where checkid='${userid}'`;
    }else{
        sql = `select BridgeID, BridgeNum,BridgeName,TotalLength,ManageUnit,CuringGrade,MainStructType from mmp.tbl_bridge_info`;
    }
    try{
        resData = await query(sql);
    } catch(e){
        console.log(`select err`+e)
    }
    console.log(resData);
    res.json(resData);

});

//桥梁新增
router.post('/insert',async function(req,res){
    console.log(req.body);
    let branch_sql = `select branch from mmp.branch where id in (select user_branch_id from mmp.admin where id='${req.body.userid}' )`;
    let resBranch = await query(branch_sql);
    let sql = `insert into mmp.tbl_bridge_info(manageid,ManageUnit,BridgeName,BridgeNum,MainStructType) values('${req.body.userid}','${resBranch[0].branch}','${req.body.name}','${req.body.num}','${req.body.type}')`;
    console.log(sql);
    try{
         let resData = await query(sql);
         res.json(1);
    } catch(e){
        console.log(`select err`+e);
        res.json(0);
    }
    
});
//桥梁修改
router.post('/update',async function(req,res){
    console.log(req.body);
    let cur_sql = `select id from admin where user_branch_id=${req.body.CuringUnit}`;
    let check_sql = `select id from admin where user_branch_id=${req.body.CheckUnit}`;
    let cur_res = await query(cur_sql);
    let check_res = await query(check_sql);
    let sql = `update mmp.tbl_bridge_info set 
                    BridgeName='${req.body.BridgeName}',
                    MainStructType='${req.body.MainStructType}',
                    FunctionType='${req.body.FunctionType}',
                    CuringType='${req.body.CuringType}',
                    CuringGrade='${req.body.CuringGrade}',
                    BridgeArea='${req.body.BridgeArea}',
                    BridgeTown='${req.body.BridgeTown}',
                    BridgeRoad='${req.body.BridgeRoad}',
                    TotalLength='${req.body.TotalLength}',
                    TotalArea='${req.body.TotalArea}',
                    MaxSpan='${req.body.MaxSpan}',
                    AcrossName='${req.body.AcrossName}',
                    ManageUnit='${req.body.ManageUnit}',
                    CuringUnit='${req.body.CuringUnit}',
                    NumberRule='${req.body.NumberRule}',
                    BridgeLON='${req.body.BridgeLON}',
                    BridgeLAT='${req.body.BridgeLAT}',
                    LimitHeight='${req.body.LimitHeight}',
                    LimitWidth='${req.body.LimitWidth}',
                    LimitLoad='${req.body.LimitLoad}',
                    WaterLevel='${req.body.WaterLevel}',
                    HighestWaterLevel='${req.body.HighestWaterLevel}',
                    DesignWaterLevel='${req.body.DesignWaterLevel}',
                    AntiSeismic='${req.body.AntiSeismic}',
                    LoadStandard='${req.body.LoadStandard}',
                    LoadGrade='${req.body.LoadGrade}',
                    DesignUnit='${req.body.DesignUnit}',
                    BuildUnit='${req.body.BuildUnit}',
                    SuperviseUnit='${req.body.SuperviseUnit}',
                    CheckUnit='${req.body.CheckUnit}',
                    curingid='${cur_res[0].id}',
                    checkid='${check_res[0].id}'
                where BridgeID=${req.body.BridgeID}`;
    try{
        let resData = await query(sql);
        res.json(1);
   } catch(e){
       console.log(`select err`+e);
       res.json(0);
   }
   
})
//桥删除
router.get('/delete',async function(req,res){
    console.log(req.body);
    let sql = `delete from mmp.tbl_bridge_info where BridgeID= '${req.query.BridgeID}'`;

    let del;
    try{
        del = await query(sql);
        res.json(1);
    }catch (e) {
        console.log(`select err`+e);
        res.json(0);
    }
});
//桥基础信息展示
router.post('/selInfo', async function(req,res){

    let sql = `select * from mmp.tbl_bridge_info where BridgeID = ${req.body.BridgeID} `;
    let resInfo;
    try{
         resInfo = await query(sql);

    }catch (e) {
        console.log(`select err`+e)
    }
    console.log(resInfo);
    res.send(resInfo);
});

router.get('/selcom',async function(req,res){
    let structType;
    if(req.query.typeid=='4'){
        structType='001005'
    }else if(req.query.typeid=='5'){
        structType='001006'
    }else if(req.query.typeid=='3'){
        structType='001004'
    }
    let sqlCom = `select * from mmp.tbl_bridge_component where BridgeLineID=${req.query.BridgeLineID} and SuperStructure='${structType}' and StructureID=${req.query.id}`;
    try{
        let res_com = await query(sqlCom);
        console.log(res_com);
        res.json(res_com);
    }catch(e){
        res.json(0);
    }
})

function Struct(typeID, label,BridgeLineID, children){
    this.typeID = typeID;
    this.label = label;
    this.BridgeLineID = BridgeLineID;
    this.children = children;
}
//生成桥结构树
router.get('/tree', async function(req,res){
    let treedata=[];
    let bridge = {};
    bridge.bridgeId=req.query.BridgeID;
    bridge.label=req.query.BridgeName;
    bridge.children = [];
    bridge.level = 1;
    let line_sql = `select BridgeLineID, LineName from mmp.tbl_bridge_line where BridgeID = ${req.query.BridgeID}`;
    try{
        resInfo = await query(line_sql);
        for(let i = 0; i< resInfo.length; i++){
            let oneLine = {};
            oneLine.BridgeLineID = resInfo[i].BridgeLineID;
            oneLine.label = resInfo[i].LineName;
            oneLine.children = [];
            oneLine.level = 2;

            let span_sql = `select BridgeSpanID,SpanNum  from mmp.tbl_bridge_span where BridgeLineID = ${resInfo[i].BridgeLineID}`;
            let res_span  = await query(span_sql);
            let spans = [];
            for(let j = 0; j < res_span.length; j++){
                let one_span = {};
                one_span.spanID = res_span[j].BridgeSpanID;
                one_span.label = res_span[j].SpanNum;
                one_span.BridgeLineID = resInfo[i].BridgeLineID;
                one_span.level = 4;
                spans.push(one_span);
            }
            let up = new Struct(1, "上部结构",resInfo[i].BridgeLineID, spans,3);
            oneLine.children.push(up);

            let pier_sql = `select BridgePierID,PierNum  from mmp.tbl_bridge_pier where  BridgeLineID = ${resInfo[i].BridgeLineID}`;
            let res_pier  = await query(pier_sql);
            let downs = [];
            for(let j = 0; j < res_pier.length; j++){
                let one_pier = {};
                one_pier.pierId = res_pier[j].BridgePierID;
                one_pier.label = res_pier[j].PierNum;
                one_pier.BridgeLineID = resInfo[i].BridgeLineID;
                one_pier.level = 4;
                downs.push(one_pier);
            }
            
            let abutment_sql = `select BridgeAbuID,BridgeAbutmentNum  from mmp.tbl_bridge_abutment where BridgeLineID = ${resInfo[i].BridgeLineID}`;
            let res_abutment  = await query(abutment_sql);
            for(let j = 0; j < res_abutment.length; j++){
                let one_abutment = {};
                one_abutment.abutmentId = res_abutment[j].BridgeAbuID;
                one_abutment.label = res_abutment[j].BridgeAbutmentNum;
                one_abutment.BridgeLineID = resInfo[i].BridgeLineID;
                one_abutment.level = 4;
                downs.push(one_abutment);
            }
            let down = new Struct(2, "下部结构", resInfo[i].BridgeLineID, downs,3);
            oneLine.children.push(down);


            let surface_sql = `select BridgeSurfaceID  from mmp.tbl_bridge_surface where  BridgeLineID = ${resInfo[i].BridgeLineID}`;
            let res_surface  = await query(surface_sql);
            let surface = new Struct(3, "桥面系",resInfo[i].BridgeLineID,'',3);
            if(res_surface.length!==0){
                surface.surfaceid = res_surface[0].BridgeSurfaceID;
            }
		
            oneLine.children.push(surface);

            let att_sql = `select BridgeAttachID  from mmp.tbl_bridge_attachment where  BridgeLineID = ${resInfo[i].BridgeLineID}`;
            let res_attr  = await query(att_sql);
           
            let attachment = new Struct(4, "附属设施",resInfo[i].BridgeLineID,'',3);
            if(res_attr.length!==0){
                attachment.attachmentid = res_attr[0].BridgeAttachID;
            };
            oneLine.children.push(attachment);

            let anti_sql = `select AntiknockID  from mmp.tbl_bridge_antiknock where  BridgeLineID = ${resInfo[i].BridgeLineID}`;
            let res_anti  = await query(anti_sql);
           
            let antiknock = new Struct(5, "抗震设施",resInfo[i].BridgeLineID,'',3);
            if(res_anti.length!==0){
                antiknock.antiknockid = res_anti[0].AntiknockID;
            };
            oneLine.children.push(antiknock);
            bridge.children.push(oneLine);
        }
        treedata.push(bridge)
        console.log(treedata)
        res.json(treedata);
   }catch (e) {
       console.log(`select err`+e)
   }

});
//查当前管理下的检测单位
router.get('/selCheck',async function(req,res){
    let data = req.query;
    let sql = `select branch,id from branch where id in(select user_branch_id from admin where registrant_id=${data.manageid} and power = '3')`;
    try{
        let result = await query(sql);
        res.json(result);
    }catch(e){
        console.log('get data err'+e);
    }
})
//查当前管理下的养护单位
router.get('/selCuring',async function(req,res){
    let data = req.query;
    let sql = `select branch,id from branch where id in(select user_branch_id from admin where registrant_id=${data.manageid} and power = '2')`;
    try{
        let result = await query(sql);
        res.json(result);
    }catch(e){
        console.log('get data err'+e);
    }
})
module.exports = router;