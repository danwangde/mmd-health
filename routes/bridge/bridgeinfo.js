const express = require('express');

const router = express.Router();

const query = require('myMysql');

const multer = require('multer');

const path = require('path');


router.get('/select_facility', async function (req,res) {
    let userid = req.query.userid,
        usertype = req.query.usertype,
        sql_passage,
        resData;
    if (usertype == '1') {
        sql_passage = `select PassagewayID BridgeID,CuringUnit,ChannelLongitude BridgeLON,ChannelLatitude BridgeLAT,PassagewayNum, PassagewayName BridgeName,PassagewayNum,Length,Width,High,ManageUnit from mmp.tbl_passageway_info where manageid=${userid} order by PassagewayID desc`;
    } else if (usertype == '2') {
        sql_passage = `select PassagewayID BridgeID,CuringUnit,ChannelLongitude BridgeLON,ChannelLatitude BridgeLAT,PassagewayNum, PassagewayName BridgeName,PassagewayNum,Length,Width,High,ManageUnit from mmp.tbl_passageway_info where curingid=${userid} order by PassagewayID desc`;
    } else if (usertype == '3') {
        sql_passage = `select PassagewayID BridgeID,CuringUnit,ChannelLongitude BridgeLON,ChannelLatitude BridgeLAT,PassagewayNum, PassagewayName BridgeName,PassagewayNum,Length,Width,High,ManageUnit from mmp.tbl_passageway_info where checkid=${userid} order by PassagewayID desc`;
    } else {
        sql_passage = `select PassagewayID BridgeID,CuringUnit,ChannelLongitude BridgeLON,ChannelLatitude BridgeLAT,PassagewayNum, PassagewayName BridgeName,PassagewayNum,Length,Width,High,ManageUnit from mmp.tbl_passageway_info order by PassagewayID desc`;
    }
    try {
        resData = await query(sql_passage);
        for(let item of resData) {
            let CuringUnit = item.CuringUnit;
            let branch_sql = `select branch from branch where id=${CuringUnit}`;
            let resBranch = await query(branch_sql);
            let res_branch = resBranch[0].branch;
            item.CuringUnit = res_branch;
        }
        res.json(resData);
    } catch (e) {
        console.log(`select err` + e)
    }

});

//桥首页信息
router.get('/select', async function (req, res) {
    console.log(req.url);
    let userid = req.query.userid,
        usertype = req.query.usertype,
        sql,
        resData;
    if (usertype == '1') {
        sql = `select BridgeID,CuringUnit,BridgeLON,BridgeLAT, BridgeNum,BridgeName,TotalLength,ManageUnit,CuringGrade,MainStructType from mmp.tbl_bridge_info where manageid='${userid}' order by BridgeID desc`;
        console.log(sql)
    } else if (usertype == '2') {
        sql = `select BridgeID,CuringUnit,BridgeLON,BridgeLAT, BridgeNum,BridgeName,TotalLength,ManageUnit,CuringGrade,MainStructType from mmp.tbl_bridge_info where curingid='${userid}' order by BridgeID desc`;
    } else if (usertype == '3') {
        sql = `select BridgeID,CuringUnit,BridgeLON,BridgeLAT, BridgeNum,BridgeName,TotalLength,ManageUnit,CuringGrade,MainStructType from mmp.tbl_bridge_info where checkid='${userid}' order by BridgeID desc`;
    } else {
        sql = `select BridgeID,CuringUnit,BridgeLON,BridgeLAT, BridgeNum,BridgeName,TotalLength,ManageUnit,CuringGrade,MainStructType from mmp.tbl_bridge_info order by BridgeID desc`;
    }
    try {
        resData = await query(sql);
        for(let item of resData) {
          let CuringUnit = item.CuringUnit;
          let branch_sql = `select branch from branch where id=${CuringUnit}`;
          let resBranch = await query(branch_sql);
          let res_branch = resBranch[0].branch;
          item.CuringUnit = res_branch;
        }


    } catch (e) {
        console.log(`select err` + e)
    }
    console.log(resData);
    res.json(resData);

});

//桥梁新增
router.post('/insert', async function (req, res) {
    console.log(req.body);
    let branch_sql = `select branch from mmp.branch where id in (select user_branch_id from mmp.admin where id='${req.body.userid}' )`;
    let resBranch = await query(branch_sql);
    let sql = `insert into mmp.tbl_bridge_info(manageid,ManageUnit,BridgeName,BridgeNum,MainStructType) values('${req.body.userid}','${resBranch[0].branch}','${req.body.name}','${req.body.num}','${req.body.type}')`;
    console.log(sql);
    try {
        let resData = await query(sql);
        res.json(1);
    } catch (e) {
        console.log(`select err` + e);
        res.json(0);
    }

});
//桥梁修改
router.post('/update', async function (req, res) {
    console.log(req.body);
    let BridgeLON = req.body.locationInfo.split(',')[0];

    let BridgeLAT = req.body.locationInfo.split(',')[1];
    // let cur_sql = `select id from admin where user_branch_id=${req.body.CuringUnit}`;
    // let check_sql = `select id from admin where user_branch_id=${req.body.CheckUnit}`;
  // CuringUnit='${req.body.CuringUnit}',  CheckUnit='${req.body.CheckUnit}',
  //                     curingid='${cur_res[0].id}',
  //                     checkid='${check_res[0].id}'
   // let cur_res = await query(cur_sql);
    //let check_res = await query(check_sql);
    let sql = `update mmp.tbl_bridge_info set 
                    BridgeName='${req.body.BridgeName}',
                    BridgeNum='${req.body.BridgeNum}',
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
                    NumberRule='${req.body.NumberRule}',
                    BridgeLON='${BridgeLON}',
                    BridgeLAT='${BridgeLAT}',
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
                    SuperviseUnit='${req.body.SuperviseUnit}'
                where BridgeID=${req.body.BridgeID}`;
    try {
        let resData = await query(sql);
        res.json(1);
    } catch (e) {
        console.log(`select err` + e);
        res.json(0);
    }

})
//桥删除
router.get('/delete', async function (req, res) {
    console.log(req.body);
    let sql = `delete from mmp.tbl_bridge_info where BridgeID= '${req.query.BridgeID}'`;

    let del;
    try {
        del = await query(sql);
        res.json(1);
    } catch (e) {
        console.log(`select err` + e);
        res.json(0);
    }
});

//分配设施
router.get('/updateFacility', async function (req, res) {
  console.log(req.query);
  let cur_sql = `select id from admin where user_branch_id=${req.query.CuringUnit}`;
  let cur_res = await query(cur_sql);
  let sql = `update mmp.tbl_bridge_info set  CuringUnit='${req.query.CuringUnit}', curingid='${cur_res[0].id}' where BridgeID = ${req.query.BridgeID}`;
  try {
    let resData = await query(sql);
    res.json(1);
  } catch (e) {
    console.log(`select err` + e);
    res.json(0);
  }
});
router.get('/updateFacility1', async function (req, res) {
    console.log(req.query);
    let cur_sql = `select id from admin where user_branch_id=${req.query.CuringUnit}`;
    let cur_res = await query(cur_sql);
    let sql = `update mmp.tbl_passageway_info set  CuringUnit='${req.query.CuringUnit}', curingid='${cur_res[0].id}' where PassagewayID = ${req.query.PassagewayID}`;
    try {
      let resData = await query(sql);
      res.json(1);
    } catch (e) {
      console.log(`select err` + e);
      res.json(0);
    }
  });

//桥基础信息展示
router.get('/selInfo', async function (req, res) {

    let sql = `select * from mmp.tbl_bridge_info where BridgeID = ${req.query.BridgeID} `;
    let resInfo;
    try {
        resInfo = await query(sql);//BridgeLON    BridgeLAT
        for(let item of resInfo) {
            item.locationInfo = item.BridgeLON + ',' + item.BridgeLAT;
        };

    } catch (e) {
        console.log(`select err` + e)
    }
    console.log(resInfo);
    res.send(resInfo);
});

router.get('/selcom', async function (req, res) {
    let structType;
    if (req.query.typeid == '4') {
        structType = '001006'
    } else if (req.query.typeid == '5') {
        structType = '001005'
    } else if (req.query.typeid == '3') {
        structType = '001004'
    }
    let sqlCom = `select * from mmp.tbl_bridge_component where BridgeLineID=${req.query.BridgeLineID} and SuperStructure='${structType}' and StructureID=${req.query.id}`;
    try {
        let res_com = await query(sqlCom);
        console.log(res_com);
        res.json(res_com);
    } catch (e) {
        res.json(0);
    }
})

function Struct(typeID, label, BridgeLineID, children, level) {
    this.typeID = typeID;
    this.label = label;
    this.BridgeLineID = BridgeLineID;
    this.children = children;
    this.level = level;
    this.expanded = true;
}
//生成桥结构树
router.get('/tree', async function (req, res) {
    let treedata = [];
    let bridge = {};
    bridge.bridgeId = req.query.BridgeID;
    bridge.label = req.query.BridgeName;
    bridge.children = [];
    bridge.level = 1;
    bridge.expanded = true;
    let line_sql = `select BridgeLineID, LineName from mmp.tbl_bridge_line where BridgeID = ${req.query.BridgeID}`;
    try {
        resInfo = await query(line_sql);
        for (let i = 0; i < resInfo.length; i++) {
            let oneLine = {};
            oneLine.BridgeLineID = resInfo[i].BridgeLineID;
            oneLine.label = resInfo[i].LineName;
            oneLine.children = [];
            oneLine.level = 2;
            oneLine.expanded = true;
            let span_sql = `select BridgeSpanID,SpanNum  from mmp.tbl_bridge_span where BridgeLineID = ${resInfo[i].BridgeLineID}`;
            let res_span = await query(span_sql);
            let spans = [];
            for (let j = 0; j < res_span.length; j++) {
                let one_span = {};
                one_span.spanID = res_span[j].BridgeSpanID;
                one_span.label = res_span[j].SpanNum;
                one_span.BridgeLineID = resInfo[i].BridgeLineID;
                one_span.level = 4;
                one_span.expanded = true;
                spans.push(one_span);
            }
            let up = new Struct(1, "上部结构", resInfo[i].BridgeLineID, spans, 3);
            oneLine.children.push(up);

            let pier_sql = `select BridgePierID,PierNum  from mmp.tbl_bridge_pier where  BridgeLineID = ${resInfo[i].BridgeLineID}`;
            let res_pier = await query(pier_sql);
            let downs = [];
            for (let j = 0; j < res_pier.length; j++) {
                let one_pier = {};
                one_pier.pierId = res_pier[j].BridgePierID;
                one_pier.label = res_pier[j].PierNum;
                one_pier.BridgeLineID = resInfo[i].BridgeLineID;
                one_pier.level = 4;
                one_pier.expanded = true;
                downs.push(one_pier);
            }

            let abutment_sql = `select BridgeAbuID,BridgeAbutmentNum  from mmp.tbl_bridge_abutment where BridgeLineID = ${resInfo[i].BridgeLineID}`;
            let res_abutment = await query(abutment_sql);
            for (let j = 0; j < res_abutment.length; j++) {
                let one_abutment = {};
                one_abutment.abutmentId = res_abutment[j].BridgeAbuID;
                one_abutment.label = res_abutment[j].BridgeAbutmentNum;
                one_abutment.BridgeLineID = resInfo[i].BridgeLineID;
                one_abutment.level = 4;
                one_abutment.expanded = true;
                downs.push(one_abutment);
            }
            let down = new Struct(2, "下部结构", resInfo[i].BridgeLineID, downs, 3);
            oneLine.children.push(down);


            let surface_sql = `select BridgeSurfaceID  from mmp.tbl_bridge_surface where  BridgeLineID = ${resInfo[i].BridgeLineID}`;
            let res_surface = await query(surface_sql);
            let surface = new Struct(3, "桥面系", resInfo[i].BridgeLineID, [], 3);
            if (res_surface.length !== 0) {
                surface.surfaceid = res_surface[0].BridgeSurfaceID;
            }

            oneLine.children.push(surface);

            let att_sql = `select BridgeAttachID  from mmp.tbl_bridge_attachment where  BridgeLineID = ${resInfo[i].BridgeLineID}`;
            let res_attr = await query(att_sql);

            let attachment = new Struct(4, "附属设施", resInfo[i].BridgeLineID, [], 3);
            if (res_attr.length !== 0) {
                attachment.attachmentid = res_attr[0].BridgeAttachID;
            };
            oneLine.children.push(attachment);

            let anti_sql = `select AntiknockID  from mmp.tbl_bridge_antiknock where  BridgeLineID = ${resInfo[i].BridgeLineID}`;
            let res_anti = await query(anti_sql);

            let antiknock = new Struct(5, "抗震设施", resInfo[i].BridgeLineID, [], 3);
            if (res_anti.length !== 0) {
                antiknock.antiknockid = res_anti[0].AntiknockID;
            };
            oneLine.children.push(antiknock);
            bridge.children.push(oneLine);
        }
        treedata.push(bridge)
        console.log(treedata)
        res.json(treedata);
    } catch (e) {
        console.log(`select err` + e)
    }

});
//查当前管理下的检测单位
router.get('/selCheck', async function (req, res) {
    let data = req.query;
    let sql = `select branch,id from branch where id in(select user_branch_id from admin where registrant_id=${data.manageid} and power = '3')`;
    try {
        let result = await query(sql);
        res.json(result);
    } catch (e) {
        console.log('get data err' + e);
    }
})
//查当前管理下的养护单位
router.get('/selCuring', async function (req, res) {
    let data = req.query;
    let sql = `select branch,id from branch where id in(select user_branch_id from admin where registrant_id=${data.manageid} and power = '2')`;
    try {
        let result = await query(sql);
        res.json(result);
    } catch (e) {
        console.log('get data err' + e);
    }
});
/* ----------------------------------------------------------------- */
router.get('/select_manage_list', async function (req, res) {
    let data = req.query;
    console.log(data);
    if (data.power == '0') {
        sql = '';
    } else {
        sql = " where manageid=" + data.uid + "";
    };
    let select_sql = "SELECT R.id,Odd_Numbers,Reporting_time,facilitiesid,facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,facilitiesroad,StepID,disease_curing_id,group_concat(disease_name) disease_name FROM tbl_disease AS E RIGHT JOIN( " +
        " SELECT V.id,V.Odd_Numbers,Reporting_time,facilitiesid,facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,facilitiesroad,StepID,disease_curing_id FROM tbl_disease_Restoration AS K RIGHT JOIN (" +
        " SELECT U.id,U.Odd_Numbers,Reporting_time,facilitiesid,facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,facilitiesroad,StepID FROM tbl_Schedule AS T RIGHT JOIN(" +
        " SELECT Y.id,Odd_Numbers,Reporting_time,bridge_id facilitiesid,bridgename facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,BridgeRoad facilitiesroad FROM branch AS X RIGHT JOIN (" +
        " SELECT J.id,Odd_Numbers,Reporting_time,bridge_id,bridgename,branch_id,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,BridgeRoad FROM tbl_bridge_info AS I RIGHT JOIN (" +
        " SELECT N.id,N.Odd_Numbers,N.Reporting_time,bridge_id,branch_id,project_Leader,N.submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time FROM tbl_Check AS M RIGHT JOIN(" +
        " SELECT Q.id,Q.Odd_Numbers,Q.Reporting_time,bridge_id,branch_id,project_Leader,Q.submitter,send_time,Completion_time,problem_source FROM tbl_Completion_declaration AS P RIGHT JOIN(" +
        " SELECT A.id,A.Odd_Numbers,Reporting_time,A.bridge_id,A.branch_id,project_Leader,submitter,send_time,problem_source FROM tbl_disease_baseinfo AS A LEFT JOIN tbl_work_order AS B" +
        " ON A.Odd_Numbers=B.Odd_Numbers" +
        " WHERE facilities_type='0') AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS J" +
        " ON I.BridgeID=J.bridge_id" +
        " " + sql + ") AS Y" +
        " ON X.id=Y.branch_id" +
        " GROUP BY Odd_Numbers) AS U" +
        " ON T.Odd_Numbers=U.Odd_Numbers) as V" +
        " ON K.project_id=V.ID) AS R" +
        " ON E.id=R.disease_curing_id" +
        " GROUP BY Odd_Numbers desc";
    let select_sql1 = "SELECT R.id,Odd_Numbers,Reporting_time,facilitiesid,facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,facilitiesroad,StepID,disease_curing_id,group_concat(disease_name) disease_name FROM tbl_disease AS E RIGHT JOIN(" +
        " SELECT V.id,V.Odd_Numbers,Reporting_time,facilitiesid,facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,facilitiesroad,StepID,disease_curing_id FROM tbl_disease_Restoration AS K RIGHT JOIN (" +
        " SELECT U.id,U.Odd_Numbers,Reporting_time,facilitiesid,facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,facilitiesroad,StepID FROM tbl_Schedule AS T RIGHT JOIN(" +
        " SELECT Y.id,Odd_Numbers,Reporting_time,PassagewayID facilitiesid,PassagewayName facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,PassagewayRoad facilitiesroad FROM branch AS X RIGHT JOIN (" +
        " SELECT J.id,Odd_Numbers,Reporting_time,PassagewayID,PassagewayName,branch_id,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,PassagewayRoad FROM tbl_passageway_info AS I RIGHT JOIN (" +
        " SELECT N.id,N.Odd_Numbers,N.Reporting_time,bridge_id,branch_id,project_Leader,N.submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time FROM tbl_Check AS M RIGHT JOIN(" +
        " SELECT Q.id,Q.Odd_Numbers,Q.Reporting_time,bridge_id,branch_id,project_Leader,Q.submitter,send_time,Completion_time,problem_source FROM tbl_Completion_declaration AS P RIGHT JOIN(" +
        " SELECT A.id,A.Odd_Numbers,Reporting_time,A.bridge_id,A.branch_id,project_Leader,submitter,send_time,problem_source FROM tbl_disease_baseinfo AS A LEFT JOIN tbl_work_order AS B" +
        " ON A.Odd_Numbers=B.Odd_Numbers" +
        " WHERE facilities_type='0') AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS J" +
        " ON I.PassagewayID=J.bridge_id" +
        " " + sql + ") AS Y" +
        " ON X.id=Y.branch_id" +
        " GROUP BY Odd_Numbers) AS U" +
        " ON T.Odd_Numbers=U.Odd_Numbers) as V" +
        " ON K.project_id=V.ID) AS R" +
        " ON E.id=R.disease_curing_id" +
        " GROUP BY Odd_Numbers desc";
    try {
        result = await query(select_sql);
        console.log(result);
        result1 = await query(select_sql1);
        console.log(result1);
        result = result.concat(result1)
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
/* ----------------------------------------------------------------- */
router.get('/select_curing_list', async function (req, res) {
    let data = req.query;
    console.log(data);
    if (data.power == '0') {
        sql = '';
    } else {
        sql = " where curingid=" + data.uid + "";
    };
    let select_sql = "SELECT R.id,Odd_Numbers,Reporting_time,facilitiesid,facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,facilitiesroad,StepID,disease_curing_id,group_concat(disease_name) disease_name FROM tbl_disease AS E RIGHT JOIN( " +
        " SELECT V.id,V.Odd_Numbers,Reporting_time,facilitiesid,facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,facilitiesroad,StepID,disease_curing_id FROM tbl_disease_Restoration AS K RIGHT JOIN (" +
        " SELECT U.id,U.Odd_Numbers,Reporting_time,facilitiesid,facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,facilitiesroad,StepID FROM tbl_Schedule AS T RIGHT JOIN(" +
        " SELECT Y.id,Odd_Numbers,Reporting_time,bridge_id facilitiesid,bridgename facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,BridgeRoad facilitiesroad FROM branch AS X RIGHT JOIN (" +
        " SELECT J.id,Odd_Numbers,Reporting_time,bridge_id,bridgename,branch_id,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,BridgeRoad FROM tbl_bridge_info AS I RIGHT JOIN (" +
        " SELECT N.id,N.Odd_Numbers,N.Reporting_time,bridge_id,branch_id,project_Leader,N.submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time FROM tbl_Check AS M RIGHT JOIN(" +
        " SELECT Q.id,Q.Odd_Numbers,Q.Reporting_time,bridge_id,branch_id,project_Leader,Q.submitter,send_time,Completion_time,problem_source FROM tbl_Completion_declaration AS P RIGHT JOIN(" +
        " SELECT A.id,A.Odd_Numbers,Reporting_time,A.bridge_id,A.branch_id,project_Leader,submitter,send_time,problem_source FROM tbl_disease_baseinfo AS A LEFT JOIN tbl_work_order AS B" +
        " ON A.Odd_Numbers=B.Odd_Numbers" +
        " WHERE facilities_type='0') AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS J" +
        " ON I.BridgeID=J.bridge_id" +
        " " + sql + ") AS Y" +
        " ON X.id=Y.branch_id" +
        " GROUP BY Odd_Numbers) AS U" +
        " ON T.Odd_Numbers=U.Odd_Numbers) as V" +
        " ON K.project_id=V.ID) AS R" +
        " ON E.id=R.disease_curing_id" +
        " GROUP BY Odd_Numbers" +
        " order by Reporting_time desc";
    let select_sql1 = "SELECT R.id,Odd_Numbers,Reporting_time,facilitiesid,facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,facilitiesroad,StepID,disease_curing_id,group_concat(disease_name) disease_name FROM tbl_disease AS E RIGHT JOIN(" +
        " SELECT V.id,V.Odd_Numbers,Reporting_time,facilitiesid,facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,facilitiesroad,StepID,disease_curing_id FROM tbl_disease_Restoration AS K RIGHT JOIN (" +
        " SELECT U.id,U.Odd_Numbers,Reporting_time,facilitiesid,facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,facilitiesroad,StepID FROM tbl_Schedule AS T RIGHT JOIN(" +
        " SELECT Y.id,Odd_Numbers,Reporting_time,PassagewayID facilitiesid,PassagewayName facilitiesname,branch_id,Branch,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,PassagewayRoad facilitiesroad FROM branch AS X RIGHT JOIN (" +
        " SELECT J.id,Odd_Numbers,Reporting_time,PassagewayID,PassagewayName,branch_id,project_Leader,submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time,PassagewayRoad FROM tbl_passageway_info AS I RIGHT JOIN (" +
        " SELECT N.id,N.Odd_Numbers,N.Reporting_time,bridge_id,branch_id,project_Leader,N.submitter,send_time,Completion_time,problem_source,Cost,manage_Sign_time FROM tbl_Check AS M RIGHT JOIN(" +
        " SELECT Q.id,Q.Odd_Numbers,Q.Reporting_time,bridge_id,branch_id,project_Leader,Q.submitter,send_time,Completion_time,problem_source FROM tbl_Completion_declaration AS P RIGHT JOIN(" +
        " SELECT A.id,A.Odd_Numbers,Reporting_time,A.bridge_id,A.branch_id,project_Leader,submitter,send_time,problem_source FROM tbl_disease_baseinfo AS A LEFT JOIN tbl_work_order AS B" +
        " ON A.Odd_Numbers=B.Odd_Numbers" +
        " WHERE facilities_type='0') AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS J" +
        " ON I.PassagewayID=J.bridge_id" +
        " " + sql + ") AS Y" +
        " ON X.id=Y.branch_id" +
        " GROUP BY Odd_Numbers) AS U" +
        " ON T.Odd_Numbers=U.Odd_Numbers) as V" +
        " ON K.project_id=V.ID) AS R" +
        " ON E.id=R.disease_curing_id" +
        " GROUP BY Odd_Numbers" +
        " order by Reporting_time desc";
    try {
        result = await query(select_sql);
        console.log(result);
        result1 = await query(select_sql1);
        console.log(result1);
        result = result.concat(result1)
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});


//按桥梁用途分
router.get('/select_purpose', async function (req, res) {
    let data = req.query;
    let select_sql = "SELECT sum(type1+TYPE2+TYPE3+TYPE4+TYPE5+TYPE6) count,type1,type2,type3,type4,type5,type6,branch FROM(" +
        " SELECT " +
        " SUM(CASE WHEN FunctionType='042001' then 1 ELSE 0 END) AS 'type1'," +
        " SUM(CASE WHEN FunctionType='042002' then 1 ELSE 0 END) AS 'type2'," +
        " SUM(CASE WHEN FunctionType='042003' then 1 ELSE 0 END) AS 'type3'," +
        " SUM(CASE WHEN FunctionType='042004' then 1 ELSE 0 END) AS 'type4'," +
        " SUM(CASE WHEN FunctionType='042005' then 1 ELSE 0 END) AS 'type5'," +
        " SUM(CASE WHEN FunctionType='042006' then 1 ELSE 0 END) AS 'type6',branch FROM tbl_bridge_info AS M RIGHT JOIN (" +
        " SELECT A.id,branch FROM admin AS A RIGHT JOIN (" +
        " SELECT id,branch from branch where find_in_set(id, getChildLst(" + data.id + "))) AS B" +
        " ON A.user_branch_id=B.id) AS N" +
        " ON M.checkid=N.id" +
        " GROUP BY branch) L group by branch";
    try {
        result = await query(select_sql);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
//按结构形式分
router.get('/select_form', async function (req, res) {
    let data = req.query;
    let select_sql = "SELECT sum(type1+type2+type3+type4+type5+type6+type7+type8+type9+type10) count,type1,type2,type3,type4,type5,type6,type7,type8,type9,type10,branch FROM(" +
        " SELECT" +
        " SUM(CASE WHEN MainStructType='035001' then 1 ELSE 0 END) AS 'type1'," +
        " SUM(CASE WHEN MainStructType='035002' then 1 ELSE 0 END) AS 'type2'," +
        " SUM(CASE WHEN MainStructType='035003' then 1 ELSE 0 END) AS 'type3'," +
        " SUM(CASE WHEN MainStructType='035004' then 1 ELSE 0 END) AS 'type4'," +
        " SUM(CASE WHEN MainStructType='035005' then 1 ELSE 0 END) AS 'type5'," +
        " SUM(CASE WHEN MainStructType='035006' then 1 ELSE 0 END) AS 'type6'," +
        " SUM(CASE WHEN MainStructType='035007' then 1 ELSE 0 END) AS 'type7'," +
        " SUM(CASE WHEN MainStructType='035008' then 1 ELSE 0 END) AS 'type8'," +
        " SUM(CASE WHEN MainStructType='035009' then 1 ELSE 0 END) AS 'type9'," +
        " SUM(CASE WHEN MainStructType='035010' then 1 ELSE 0 END) AS 'type10',branch FROM tbl_bridge_info AS M RIGHT JOIN (" +
        " SELECT A.id,branch FROM admin AS A RIGHT JOIN (" +
        " SELECT id,branch from branch where find_in_set(id, getChildLst(" + data.id + "))) AS B" +
        " ON A.user_branch_id=B.id) AS N" +
        " ON M.checkid=N.id" +
        " GROUP BY branch) L group by branch";
    try {
        result = await query(select_sql);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
//按养护等级分
router.get('/select_Grade', async function (req, res) {
    let data = req.query;
    let select_sql = "SELECT sum(type1+TYPE2+TYPE3) count,type1,type2,type3,branch FROM(" +
        " SELECT" +
        " SUM(CASE WHEN CuringGrade='044001' then 1 ELSE 0 END) AS 'type1'," +
        " SUM(CASE WHEN CuringGrade='044002' then 1 ELSE 0 END) AS 'TYPE2'," +
        " SUM(CASE WHEN CuringGrade='044003' then 1 ELSE 0 END) AS 'TYPE3',branch FROM tbl_bridge_info AS M RIGHT JOIN (" +
        " SELECT A.id,branch FROM admin AS A RIGHT JOIN (" +
        " SELECT id,branch from branch where find_in_set(id, getChildLst(" + data.id + "))) AS B" +
        " ON A.user_branch_id=B.id) AS N" +
        " ON M.checkid=N.id" +
        " GROUP BY branch) L group by branch";
    try {
        result = await query(select_sql);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
//按养护类别分
router.get('/select_category', async function (req, res) {
    let data = req.query;
    let select_sql = "SELECT sum(type1+TYPE2+TYPE3+TYPE4+TYPE5+TYPE6) count,type1,type2,type3,type4,type5,type6,branch FROM(" +
        " SELECT " +
        " SUM(CASE WHEN CuringType='045001' then 1 ELSE 0 END) AS 'type1'," +
        " SUM(CASE WHEN CuringType='045002' then 1 ELSE 0 END) AS 'type2'," +
        " SUM(CASE WHEN CuringType='045003' then 1 ELSE 0 END) AS 'type3'," +
        " SUM(CASE WHEN CuringType='045004' then 1 ELSE 0 END) AS 'type4'," +
        " SUM(CASE WHEN CuringType='045005' then 1 ELSE 0 END) AS 'type5'," +
        " SUM(CASE WHEN CuringType='045006' then 1 ELSE 0 END) AS 'type6',branch FROM tbl_bridge_info AS M RIGHT JOIN (" +
        " SELECT A.id,branch FROM admin AS A RIGHT JOIN (" +
        " SELECT id,branch from branch where find_in_set(id, getChildLst(" + data.id + "))) AS B" +
        " ON A.user_branch_id=B.id) AS N" +
        " ON M.checkid=N.id" +
        " GROUP BY branch) L group by branch";
    try {
        result = await query(select_sql);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//查经纬度
router.get('/select_lon_lat', async function (req, res) {
    let data = req.query;
    console.log(data);
    let select_sql = "SELECT BridgeLON,BridgeLAT FROM tbl_bridge_info" +
        " WHERE manageid=" + data.uid + "";
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//桥梁信息查询
router.get('/select_bridgeinfo', async function (req, res) {
    let data = req.query;
    if(data.power=='0'){
       sql = '';
    }else{
        sql = " where manageid="+data.uid+"";
    }
    let select_sql = "SELECT BridgeID,BridgeName,BridgeLON,BridgeLAT,BridgeRoad,MainStructType,CuringGrade FROM tbl_bridge_info" +
        ""+sql+"";
        console.log(select_sql);
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//桥梁数量，面积查询，长度
router.get('/select_number', async function (req, res) {
    let data = req.query;
    let select_sql;
    if (data.power == '0') {
        select_sql = "select COUNT(*) count,sum(TotalLength) TotalLength,sum(TotalArea) TotalArea  from tbl_bridge_info WHERE manageid ";
    } else {
        select_sql = "select COUNT(*) count,sum(TotalLength) TotalLength,sum(TotalArea) TotalArea  from tbl_bridge_info WHERE manageid = " + data.uid + "";
    }
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});


//桥类型数量
router.get('/select_classnum', async function (req, res) {
    let data = req.query;
    let select_sql;
    if (data.power == '0') {
        select_sql = "select " +
            " SUM(CASE WHEN MainStructType='035001' then 1 ELSE 0 END) AS '梁桥'," +
            " SUM(CASE WHEN MainStructType='035002' then 1 ELSE 0 END) AS '悬臂+挂梁'," +
            " SUM(CASE WHEN MainStructType='035003' then 1 ELSE 0 END) AS '桁架桥'," +
            " SUM(CASE WHEN MainStructType='035004' then 1 ELSE 0 END) AS '钢构桥'," +
            " SUM(CASE WHEN MainStructType='035005' then 1 ELSE 0 END) AS '钢结构拱桥'," +
            " SUM(CASE WHEN MainStructType='035006' then 1 ELSE 0 END) AS '圬工拱桥(无上部结构)'," +
            " SUM(CASE WHEN MainStructType='035007' then 1 ELSE 0 END) AS '圬工拱桥（有上部结构）'," +
            " SUM(CASE WHEN MainStructType='035008' then 1 ELSE 0 END) AS '钢筋混凝土拱桥'," +
            " SUM(CASE WHEN MainStructType='035009' then 1 ELSE 0 END) AS '人行天桥(梁桥)'," +
            " SUM(CASE WHEN MainStructType='035010' then 1 ELSE 0 END) AS '人行天桥(钢桁架桥)' FROM tbl_bridge_info ";
    } else {
        select_sql = "select " +
            " SUM(CASE WHEN MainStructType='035001' then 1 ELSE 0 END) AS '梁桥'," +
            " SUM(CASE WHEN MainStructType='035002' then 1 ELSE 0 END) AS '悬臂+挂梁'," +
            " SUM(CASE WHEN MainStructType='035003' then 1 ELSE 0 END) AS '桁架桥'," +
            " SUM(CASE WHEN MainStructType='035004' then 1 ELSE 0 END) AS '钢构桥'," +
            " SUM(CASE WHEN MainStructType='035005' then 1 ELSE 0 END) AS '钢结构拱桥'," +
            " SUM(CASE WHEN MainStructType='035006' then 1 ELSE 0 END) AS '圬工拱桥(无上部结构)'," +
            " SUM(CASE WHEN MainStructType='035007' then 1 ELSE 0 END) AS '圬工拱桥（有上部结构）'," +
            " SUM(CASE WHEN MainStructType='035008' then 1 ELSE 0 END) AS '钢筋混凝土拱桥'," +
            " SUM(CASE WHEN MainStructType='035009' then 1 ELSE 0 END) AS '人行天桥(梁桥)'," +
            " SUM(CASE WHEN MainStructType='035010' then 1 ELSE 0 END) AS '人行天桥(钢桁架桥)' FROM tbl_bridge_info " +
            " WHERE manageid=" + data.uid + "";
    }
    try {
        result = await query(select_sql);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }
});

//功能类型
router.get('/select_func', async function (req, res) {
    let data = req.query;
    let select_sql;
    if (data.power == '0') {
        select_sql = "SELECT " +
            " SUM(CASE WHEN FunctionType='042001' then 1 ELSE 0 END) AS '跨江桥'," +
            " SUM(CASE WHEN FunctionType='042002' then 1 ELSE 0 END) AS '跨河涌桥'," +
            " SUM(CASE WHEN FunctionType='042003' then 1 ELSE 0 END) AS '跨铁路桥'," +
            " SUM(CASE WHEN FunctionType='042004' then 1 ELSE 0 END) AS '立交桥'," +
            " SUM(CASE WHEN FunctionType='042005' then 1 ELSE 0 END) AS '高架桥'," +
            " SUM(CASE WHEN FunctionType='042006' then 1 ELSE 0 END) AS '人行天桥' FROM tbl_bridge_info ";
    } else {
        select_sql = "SELECT " +
            " SUM(CASE WHEN FunctionType='042001' then 1 ELSE 0 END) AS '跨江桥'," +
            " SUM(CASE WHEN FunctionType='042002' then 1 ELSE 0 END) AS '跨河涌桥'," +
            " SUM(CASE WHEN FunctionType='042003' then 1 ELSE 0 END) AS '跨铁路桥'," +
            " SUM(CASE WHEN FunctionType='042004' then 1 ELSE 0 END) AS '立交桥'," +
            " SUM(CASE WHEN FunctionType='042005' then 1 ELSE 0 END) AS '高架桥'," +
            " SUM(CASE WHEN FunctionType='042006' then 1 ELSE 0 END) AS '人行天桥' FROM tbl_bridge_info " +
            " where manageid=" + data.uid + "";
    }
    try {
        result = await query(select_sql);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }
});

//养护级别
router.get('/select_grade_sql', async function (req, res) {
    let data = req.query;
    let select_sql;
    if (data.power == '0') {
        select_sql = "SELECT" +
            " SUM(CASE WHEN CuringGrade='044001' then 1 ELSE 0 END) AS 'I等'," +
            " SUM(CASE WHEN CuringGrade='044002' then 1 ELSE 0 END) AS 'II等'," +
            " SUM(CASE WHEN CuringGrade='044003' then 1 ELSE 0 END) AS 'III等' FROM tbl_bridge_info";
    } else {
        select_sql = "SELECT" +
            " SUM(CASE WHEN CuringGrade='044001' then 1 ELSE 0 END) AS 'I等'," +
            " SUM(CASE WHEN CuringGrade='044002' then 1 ELSE 0 END) AS 'II等'," +
            " SUM(CASE WHEN CuringGrade='044003' then 1 ELSE 0 END) AS 'III等' FROM tbl_bridge_info" +
            " where manageid=" + data.uid + "";
    }
    try {
        result = await query(select_sql);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

});


//查询费用
router.get('/select_sumcost', async function (req, res) {
    let data = req.query;
    let select_sql;
    if (data.power == '0') {
        select_sql = "SELECT sum(sumcost) suma FROM tbl_bridge_info AS M RIGHT JOIN (" +
            " SELECT sum(Cost) sumcost,bridge_id FROM tbl_Check AS A LEFT JOIN tbl_disease_baseinfo AS B " +
            " ON A.Odd_Numbers=B.Odd_Numbers" +
            " WHERE facilities_type='0'" +
            " GROUP BY bridge_id) AS N" +
            " ON M.BridgeID=N.bridge_id";
    } else {
        select_sql = "SELECT sum(sumcost) suma FROM tbl_bridge_info AS M RIGHT JOIN (" +
            " SELECT sum(Cost) sumcost,bridge_id FROM tbl_Check AS A LEFT JOIN tbl_disease_baseinfo AS B " +
            " ON A.Odd_Numbers=B.Odd_Numbers" +
            " WHERE facilities_type='0'" +
            " GROUP BY bridge_id) AS N" +
            " ON M.BridgeID=N.bridge_id" +
            " WHERE manageid=" + data.uid + "";
    }
    try {
        result = await query(select_sql);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

});


//应查次数
router.get('/select_sumnum', async function (req, res) {
    let data = req.query;
    let obj = {};
    let arr = [];
    let select_sql;
    let select_sql1;
    if (data.power == '0') {
        select_sql = "SELECT SUM(count_num) SUMNUM FROM tbl_bridge_info AS A RIGHT JOIN (" +
            " SELECT SUM(Patrol_num) count_num,bridge_id FROM Maintenance_plan" +
            " WHERE facilities_type='0'" +
            " GROUP BY bridge_id)AS B" +
            " ON A.BridgeID=B.bridge_id";
        console.log(select_sql);

        select_sql1 = "SELECT SUM(count_num) SUMNUM FROM tbl_passageway_info AS A RIGHT JOIN (" +
            " SELECT SUM(Patrol_num) count_num,bridge_id FROM Maintenance_plan" +
            " WHERE facilities_type='1'" +
            " GROUP BY bridge_id)AS B" +
            " ON A.PassagewayID=B.bridge_id";
        console.log(select_sql1);

    } else {
        select_sql = "SELECT SUM(count_num) SUMNUM FROM tbl_bridge_info AS A RIGHT JOIN (" +
            " SELECT SUM(Patrol_num) count_num,bridge_id FROM Maintenance_plan" +
            " WHERE facilities_type='0'" +
            " GROUP BY bridge_id)AS B" +
            " ON A.BridgeID=B.bridge_id" +
            " WHERE manageid=" + data.uid + "";
        console.log(select_sql);
        select_sql1 = "SELECT SUM(count_num) SUMNUM FROM tbl_passageway_info AS A RIGHT JOIN (" +
            " SELECT SUM(Patrol_num) count_num,bridge_id FROM Maintenance_plan" +
            " WHERE facilities_type='1'" +
            " GROUP BY bridge_id)AS B" +
            " ON A.PassagewayID=B.bridge_id" +
            " WHERE manageid=" + data.uid + "";
        console.log(select_sql1);
    }

    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        sum = result[0].SUMNUM + result1[0].SUMNUM;
        let key = 'SUMNUM';
        obj[key] = sum;
        arr.push(obj)
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(arr);
    console.log(arr)
});

//已查次数
router.get('/select_num', async function (req, res) {
    let data = req.query;
    let obj = {};
    let arr = [];
    let select_sql;
    let select_sql1;
    if (data.power == '0') {
        select_sql = "SELECT SUM(countnum) num FROM tbl_bridge_info AS A RIGHT JOIN (" +
            " SELECT COUNT(*) countnum,bridge_id FROM tbl_daily_inspection" +
            " WHERE facilities_type='0'" +
            " GROUP BY bridge_id) AS B" +
            " ON A.BridgeID=B.bridge_id";
        select_sql1 = "SELECT SUM(countnum) num FROM tbl_passageway_info AS A RIGHT JOIN (" +
            " SELECT COUNT(*) countnum,bridge_id FROM tbl_daily_inspection" +
            " WHERE facilities_type='1'" +
            " GROUP BY bridge_id) AS B" +
            " ON A.PassagewayID=B.bridge_id";
    } else {
        select_sql = "SELECT SUM(countnum) num FROM tbl_bridge_info AS A RIGHT JOIN (" +
            " SELECT COUNT(*) countnum,bridge_id FROM tbl_daily_inspection" +
            " WHERE facilities_type='0'" +
            " GROUP BY bridge_id) AS B" +
            " ON A.BridgeID=B.bridge_id" +
            " WHERE manageid=" + data.uid + "";
        select_sql1 = "SELECT SUM(countnum) num FROM tbl_passageway_info AS A RIGHT JOIN (" +
            " SELECT COUNT(*) countnum,bridge_id FROM tbl_daily_inspection" +
            " WHERE facilities_type='1'" +
            " GROUP BY bridge_id) AS B" +
            " ON A.PassagewayID=B.bridge_id" +
            " WHERE manageid=" + data.uid + "";
    }
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        sum = result[0].num + result1[0].num;
        let key = 'NUM';
        obj[key] = sum;
        arr.push(obj)
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(arr);
});

//养护进程
router.get('/select_setp', async function (req, res) {
    let data = req.query;
    let obj = {};
    let arr = [];
    let select_sql;
    let select_sql1;
    if (data.power == '0') {
        select_sql = "SELECT " +
            " sum(case when StepID='0' then 1 ELSE 0 END) AS 'step_one'," +
            " SUM(case when StepID='1' then 1 ELSE 0 END) AS 'step_two'," +
            " SUM(case when StepID='2' then 1 ELSE 0 END) AS 'step_three'," +
            " SUM(case when StepID='3' then 1 ELSE 0 END) AS 'step_four' FROM tbl_Schedule AS M RIGHT JOIN (" +
            " SELECT Odd_Numbers FROM tbl_bridge_info AS A LEFT JOIN tbl_disease_baseinfo AS B" +
            " ON A.BridgeID=B.bridge_id" +
            " WHERE facilities_type='0' ) AS N" +
            " ON M.Odd_Numbers=N.Odd_Numbers";
        select_sql1 = "SELECT " +
            " sum(case when StepID='0' then 1 ELSE 0 END) AS 'step_one'," +
            " SUM(case when StepID='1' then 1 ELSE 0 END) AS 'step_two'," +
            " SUM(case when StepID='2' then 1 ELSE 0 END) AS 'step_three'," +
            " SUM(case when StepID='3' then 1 ELSE 0 END) AS 'step_four' FROM tbl_Schedule AS M RIGHT JOIN (" +
            " SELECT Odd_Numbers FROM tbl_passageway_info AS A LEFT JOIN tbl_disease_baseinfo AS B" +
            " ON A.PassagewayID=B.bridge_id" +
            " WHERE facilities_type='1') AS N" +
            " ON M.Odd_Numbers=N.Odd_Numbers";
    } else {
        select_sql = "SELECT " +
            " sum(case when StepID='0' then 1 ELSE 0 END) AS 'step_one'," +
            " SUM(case when StepID='1' then 1 ELSE 0 END) AS 'step_two'," +
            " SUM(case when StepID='2' then 1 ELSE 0 END) AS 'step_three'," +
            " SUM(case when StepID='3' then 1 ELSE 0 END) AS 'step_four' FROM tbl_Schedule AS M RIGHT JOIN (" +
            " SELECT Odd_Numbers FROM tbl_bridge_info AS A LEFT JOIN tbl_disease_baseinfo AS B" +
            " ON A.BridgeID=B.bridge_id" +
            " WHERE facilities_type='0'" +
            " and manageid=" + data.uid + ") AS N" +
            " ON M.Odd_Numbers=N.Odd_Numbers";
        select_sql1 = "SELECT " +
            " sum(case when StepID='0' then 1 ELSE 0 END) AS 'step_one'," +
            " SUM(case when StepID='1' then 1 ELSE 0 END) AS 'step_two'," +
            " SUM(case when StepID='2' then 1 ELSE 0 END) AS 'step_three'," +
            " SUM(case when StepID='3' then 1 ELSE 0 END) AS 'step_four' FROM tbl_Schedule AS M RIGHT JOIN (" +
            " SELECT Odd_Numbers FROM tbl_passageway_info AS A LEFT JOIN tbl_disease_baseinfo AS B" +
            " ON A.PassagewayID=B.bridge_id" +
            " WHERE facilities_type='1'" +
            " and manageid=" + data.uid + ") AS N" +
            " ON M.Odd_Numbers=N.Odd_Numbers";
    }

    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        step_one = result[0].step_one + result1[0].step_one;
        step_two = result[0].step_two + result1[0].step_two;
        step_three = result[0].step_three + result1[0].step_three;
        step_four = result[0].step_four + result1[0].step_four;
        let key = 'step_one';
        let key1 = 'step_two';
        let key2 = 'step_three';
        let key3 = 'step_four';
        obj[key] = step_one;
        obj[key1] = step_two;
        obj[key2] = step_three;
        obj[key3] = step_four;
        arr.push(obj)
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.json(arr);
});

//病害统计(已修复桥梁)
router.get('/select_discount', async function (req, res) {
    let data = req.query;
    let select_sql;
    if(data.power=='0'){
        select_sql = "SELECT SUM(discount) COUNT,DATE FROM tbl_bridge_info AS P RIGHT JOIN (" +
        " SELECT project_id,discount,bridge_id,DATE FROM tbl_Schedule AS M RIGHT JOIN (" +
        " SELECT project_id,count(disease_curing_id) discount,bridge_id,Odd_Numbers,DATE_FORMAT(Reporting_time,'%Y-%m') AS DATE " +
        " FROM tbl_disease_Restoration AS A LEFT JOIN tbl_disease_baseinfo AS B" +
        " ON A.project_id=B.id" +
        " WHERE facilities_type='0'" +
        " GROUP BY project_id,DATE) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers" +
        " WHERE StepID>2) AS Q" +
        " ON P.BridgeID=Q.bridge_id" +
        " GROUP BY DATE";
    }else{
        select_sql = "SELECT SUM(discount) COUNT,DATE FROM tbl_bridge_info AS P RIGHT JOIN (" +
        " SELECT project_id,discount,bridge_id,DATE FROM tbl_Schedule AS M RIGHT JOIN (" +
        " SELECT project_id,count(disease_curing_id) discount,bridge_id,Odd_Numbers,DATE_FORMAT(Reporting_time,'%Y-%m') AS DATE " +
        " FROM tbl_disease_Restoration AS A LEFT JOIN tbl_disease_baseinfo AS B" +
        " ON A.project_id=B.id" +
        " WHERE facilities_type='0'" +
        " GROUP BY project_id,DATE) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers" +
        " WHERE StepID>2) AS Q" +
        " ON P.BridgeID=Q.bridge_id" +
        " WHERE manageid=" + data.uid + "" +
        " GROUP BY DATE";
    }
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.json(result);
});
//病害统计(未修复桥梁)
router.get('/select_discount1', async function (req, res) {
    let data = req.query;
    let select_sql;
    if(data.power=='0'){
        select_sql = "SELECT SUM(discount) COUNT,DATE FROM tbl_bridge_info AS P RIGHT JOIN (" +
        " SELECT project_id,discount,bridge_id,DATE FROM tbl_Schedule AS M RIGHT JOIN (" +
        " SELECT project_id,count(disease_curing_id) discount,bridge_id,Odd_Numbers,DATE_FORMAT(Reporting_time,'%Y-%m') AS DATE " +
        " FROM tbl_disease_Restoration AS A LEFT JOIN tbl_disease_baseinfo AS B" +
        " ON A.project_id=B.id" +
        " WHERE facilities_type='0'" +
        " GROUP BY project_id,DATE) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers" +
        " WHERE StepID<=2) AS Q" +
        " ON P.BridgeID=Q.bridge_id" +
        " GROUP BY DATE";
    }else{
        select_sql = "SELECT SUM(discount) COUNT,DATE FROM tbl_bridge_info AS P RIGHT JOIN (" +
        " SELECT project_id,discount,bridge_id,DATE FROM tbl_Schedule AS M RIGHT JOIN (" +
        " SELECT project_id,count(disease_curing_id) discount,bridge_id,Odd_Numbers,DATE_FORMAT(Reporting_time,'%Y-%m') AS DATE " +
        " FROM tbl_disease_Restoration AS A LEFT JOIN tbl_disease_baseinfo AS B" +
        " ON A.project_id=B.id" +
        " WHERE facilities_type='0'" +
        " GROUP BY project_id,DATE) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers" +
        " WHERE StepID<=2) AS Q" +
        " ON P.BridgeID=Q.bridge_id" +
        " WHERE manageid=" + data.uid + "" +
        " GROUP BY DATE";
    }
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.json(result);
});
//病害统计(未修复人行通道)
router.get('/select_discount2', async function (req, res) {
    let data = req.query;
    let select_sql;
    if(data.power=='0'){
        select_sql = "SELECT SUM(discount) COUNT,DATE FROM tbl_passageway_info AS P RIGHT JOIN (" +
        " SELECT project_id,discount,bridge_id,DATE FROM tbl_Schedule AS M RIGHT JOIN (" +
        " SELECT project_id,count(disease_curing_id) discount,bridge_id,Odd_Numbers,DATE_FORMAT(Reporting_time,'%Y-%m') AS DATE " +
        " FROM tbl_disease_Restoration AS A LEFT JOIN tbl_disease_baseinfo AS B" +
        " ON A.project_id=B.id" +
        " WHERE facilities_type='1'" +
        " GROUP BY project_id,DATE) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers" +
        " WHERE StepID<=2) AS Q" +
        " ON P.PassagewayID=Q.bridge_id" +
        " GROUP BY DATE";
    }else{
        select_sql = "SELECT SUM(discount) COUNT,DATE FROM tbl_passageway_info AS P RIGHT JOIN (" +
        " SELECT project_id,discount,bridge_id,DATE FROM tbl_Schedule AS M RIGHT JOIN (" +
        " SELECT project_id,count(disease_curing_id) discount,bridge_id,Odd_Numbers,DATE_FORMAT(Reporting_time,'%Y-%m') AS DATE " +
        " FROM tbl_disease_Restoration AS A LEFT JOIN tbl_disease_baseinfo AS B" +
        " ON A.project_id=B.id" +
        " WHERE facilities_type='1'" +
        " GROUP BY project_id,DATE) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers" +
        " WHERE StepID<=2) AS Q" +
        " ON P.PassagewayID=Q.bridge_id" +
        " WHERE manageid=" + data.uid + "" +
        " GROUP BY DATE";
    }
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.json(result);
});
//病害统计(已修复人行通道)
router.get('/select_discount3', async function (req, res) {
    let data = req.query;
    if(data.power=='0'){
        select_sql = "SELECT SUM(discount) COUNT,DATE FROM tbl_passageway_info AS P RIGHT JOIN (" +
        " SELECT project_id,discount,bridge_id,DATE FROM tbl_Schedule AS M RIGHT JOIN (" +
        " SELECT project_id,count(disease_curing_id) discount,bridge_id,Odd_Numbers,DATE_FORMAT(Reporting_time,'%Y-%m') AS DATE " +
        " FROM tbl_disease_Restoration AS A LEFT JOIN tbl_disease_baseinfo AS B" +
        " ON A.project_id=B.id" +
        " WHERE facilities_type='1'" +
        " GROUP BY project_id,DATE) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers" +
        " WHERE StepID>2) AS Q" +
        " ON P.PassagewayID=Q.bridge_id" +
        " GROUP BY DATE";
    }else{
        select_sql = "SELECT SUM(discount) COUNT,DATE FROM tbl_passageway_info AS P RIGHT JOIN (" +
        " SELECT project_id,discount,bridge_id,DATE FROM tbl_Schedule AS M RIGHT JOIN (" +
        " SELECT project_id,count(disease_curing_id) discount,bridge_id,Odd_Numbers,DATE_FORMAT(Reporting_time,'%Y-%m') AS DATE " +
        " FROM tbl_disease_Restoration AS A LEFT JOIN tbl_disease_baseinfo AS B" +
        " ON A.project_id=B.id" +
        " WHERE facilities_type='1'" +
        " GROUP BY project_id,DATE) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers" +
        " WHERE StepID>2) AS Q" +
        " ON P.PassagewayID=Q.bridge_id" +
        " WHERE manageid=" + data.uid + "" +
        " GROUP BY DATE";
    }
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.json(result);
});

//权重

router.get('/select_weight', async function (req, res) {
    let data = req.query;
    let select_sql = "select * from tbl_bridge_weight";
    try {
        result = await query(select_sql);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
router.post('/insert_weight', async function (req, res) {
    let data = req.body;
    let insert_sql = "insert into tbl_bridge_weight (bridgetype_name,bridge_type,deck_weight,upper_weight,down_weight) " +
        " values('" + data.bridgetype_name + "','" + data.bridge_type + "','" + data.deck_weight + "','" + data.upper_weight + "','" + data.down_weight + "')";
    try {
        result = await query(insert_sql);
    }
    catch (e) {
        res.json(0)
    }
    res.json(1);
});
router.post('/update_weight', async function (req, res) {
    let data = req.body;
    let update_sql = "update tbl_bridge_weight set bridge_type='" + data.bridge_type + "',bridgetype_name='" + data.bridgetype_name + "'," +
        " deck_weight='" + data.deck_weight + "',upper_weight='" + data.upper_weight + "',down_weight='" + data.down_weight + "' " +
        " where id=" + data.id + "";
    try {
        result = await query(update_sql);
    }
    catch (e) {
        res.json(0)
    }
    res.json(1);
});
router.get('/delete_weight', async function (req, res) {
    let data = req.query;
    let delete_sql = "delete from tbl_bridge_weight where id=" + data.id + "";
    try {
        result = await query(delete_sql);
    }
    catch (e) {
        res.json(0)
    }
    res.json(1);
});

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, path.join(__dirname, '../../static/photo'));
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let upload = multer({
    storage: storage
});


router.post('/insert_photos', upload.single('file'), async function (req, res) {
    let file = req.file;
    console.log(file);
    let data = req.body;
    console.log(data);
    let insert_sql = "insert into bridge_photo (photo_name,facilities_id,facilities_type)" +
        " values('" + file.filename + "'," + data.facilities_id + ",'" + data.facilities_type + "')";
    try {
        result = await query(insert_sql);
    }
    catch (e) {
        res.json(0);
        console.log(`insert err` + e)
    }
    res.json(1);

});
router.get('/deleteImage', async function (req,res) {
    let data = req.query;
    let sql = "delete from bridge_photo where id="+data.id;
    try {
        let result = await query(sql);
        res.json(1)
    }catch(e) {
        console.log('delete image err' +e);
    }
})
router.post('/insert_video', upload.single('file'), async function (req, res) {
    let file = req.file;
    let data = req.body;
    console.log(data)
    let insert_sql = "insert into bridge_video (video_name,facilities_id,facilities_type)" +
        " values('" + file.filename + "'," + data.facilities_id + ",'" + data.facilities_type + "')";
    try {
        result = await query(insert_sql);
    }
    catch (e) {
        res.json(0);
        console.log(`insert err` + e)
    }
    res.json(1);

});
router.get('/select_photos', async function (req, res) {
    let data = req.query;
    console.log(data)
    let select_sql = "select * from bridge_photo where facilities_id=" + data.facilities_id + " and facilities_type='" + data.facilities_type + "'";
    console.log(select_sql)
    try {
        result1 = await query(select_sql);
        console.log(result1)
        res.json(result1);
    }
    catch (e) {
        console.log(`select err` + e)
    }
});
router.get('/select_video', async function (req, res) {
    let data = req.query;
    console.log(data)
    let select_sql = "select * from bridge_video where facilities_id=" + data.facilities_id + " and facilities_type='" + data.facilities_type + "'";
    console.log(select_sql)
    try {
        result1 = await query(select_sql);
        console.log(result1)
        res.json(result1);
    }
    catch (e) {
        console.log(`select err` + e)
    }
});

router.get('/delete_video', async function (req, res) {
    let data = req.query;
    let delete_sql = "delete from bridge_video" +
        " where id=" + data.id + "";
    try {
        result = await query(delete_sql);
        res.json(1);
    } catch (e) {
        console.log(`select err` + e);
        res.json(0);
    }

});
router.get('/cs', async function (req, res) {
    try {
        let result = {
            "chartArr": [
                {
                    "type": "温度",
                    "xData": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                    "yData": [
                        {
                            "name": "邮件营销",
                            "type": "line",
                            "stack": "总量",
                            "data": [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            "name": "联盟广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            "name": "视频广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            "name": "直接访问",
                            "type": "line",
                            "stack": "总量",
                            "data": [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            "name": "搜索引擎",
                            "type": "line",
                            "stack": "总量",
                            "data": [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                },
                {
                    "type": "变形监测",
                    "xData": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                    "yData": [
                        {
                            "name": "邮件营销",
                            "type": "line",
                            "stack": "总量",
                            "data": [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            "name": "联盟广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            "name": "视频广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            "name": "直接访问",
                            "type": "line",
                            "stack": "总量",
                            "data": [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            "name": "搜索引擎",
                            "type": "line",
                            "stack": "总量",
                            "data": [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                },
                {
                    "type": "静力水准仪",
                    "xData": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                    "yData": [
                        {
                            "name": "邮件营销",
                            "type": "line",
                            "stack": "总量",
                            "data": [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            "name": "联盟广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            "name": "视频广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            "name": "直接访问",
                            "type": "line",
                            "stack": "总量",
                            "data": [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            "name": "搜索引擎",
                            "type": "line",
                            "stack": "总量",
                            "data": [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                },
                {
                    "type": "振弦式应变",
                    "xData": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                    "yData": [
                        {
                            "name": "邮件营销",
                            "type": "line",
                            "stack": "总量",
                            "data": [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            "name": "联盟广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            "name": "视频广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            "name": "直接访问",
                            "type": "line",
                            "stack": "总量",
                            "data": [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            "name": "搜索引擎",
                            "type": "line",
                            "stack": "总量",
                            "data": [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                },
                {
                    "type": "振弦式应变SOIL",
                    "xData": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                    "yData": [
                        {
                            "name": "邮件营销",
                            "type": "line",
                            "stack": "总量",
                            "data": [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            "name": "联盟广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            "name": "视频广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            "name": "直接访问",
                            "type": "line",
                            "stack": "总量",
                            "data": [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            "name": "搜索引擎",
                            "type": "line",
                            "stack": "总量",
                            "data": [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                },
                {
                    "type": "压差变送器",
                    "xData": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                    "yData": [
                        {
                            "name": "邮件营销",
                            "type": "line",
                            "stack": "总量",
                            "data": [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            "name": "联盟广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            "name": "视频广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            "name": "直接访问",
                            "type": "line",
                            "stack": "总量",
                            "data": [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            "name": "搜索引擎",
                            "type": "line",
                            "stack": "总量",
                            "data": [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                },
                {
                    "type": "基康水准仪",
                    "xData": ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
                    "yData": [
                        {
                            "name": "邮件营销",
                            "type": "line",
                            "stack": "总量",
                            "data": [120, 132, 101, 134, 90, 230, 210]
                        },
                        {
                            "name": "联盟广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [220, 182, 191, 234, 290, 330, 310]
                        },
                        {
                            "name": "视频广告",
                            "type": "line",
                            "stack": "总量",
                            "data": [150, 232, 201, 154, 190, 330, 410]
                        },
                        {
                            "name": "直接访问",
                            "type": "line",
                            "stack": "总量",
                            "data": [320, 332, 301, 334, 390, 330, 320]
                        },
                        {
                            "name": "搜索引擎",
                            "type": "line",
                            "stack": "总量",
                            "data": [820, 932, 901, 934, 1290, 1330, 1320]
                        }
                    ]
                }
            ]
        }
        res.json(result);
    } catch (e) {
        console.log(`select err` + e);
        res.json(0);
    }

});
module.exports = router;
