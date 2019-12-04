const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const sequelize = require('mySequelize');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const query = require('myMysql');




//检测计划查询
router.get('/select_plan', async function (req, res) {
    let data = req.query;
    let select_sql = "select facilities_type, N.id,bridgename,bridge_id,File_name,plan_name,start_time,end_time,branch_id,branch,plan_type from branch as M right join (" +
        " select facilities_type, B.id,bridgename,bridge_id,File_name,plan_name,start_time,end_time,branch_id,plan_type from tbl_bridge_info as A RIGHT join(" +
        " select facilities_type, id,bridge_id,File_name,plan_name,start_time,end_time,branch_id,plan_type from tbl_Testing_plan" +
        " where plan_type='0') as B" +
        " on A.BridgeID=B.bridge_id" +
        " where manageid=" + data.uid + ") as N" +
        " on M.id=N.branch_id";
    let select_sql1 = "select facilities_type, N.id,PassagewayName,PassagewayID,File_name,plan_name,start_time,end_time,branch_id,branch,plan_type from branch as M right join (" +
        " select facilities_type, B.id,PassagewayName,PassagewayID,File_name,plan_name,start_time,end_time,branch_id,plan_type from tbl_passageway_info as A RIGHT join(" +
        " select facilities_type, id,bridge_id,File_name,plan_name,start_time,end_time,branch_id,plan_type from tbl_Testing_plan" +
        " where plan_type='1') as B" +
        " on A.PassagewayID=B.bridge_id" +
        " where manageid=" + data.uid + ") as N" +
        " on M.id=N.branch_id";
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);
    } catch (e) {
        console.log(`insert err` + e)
    }
    res.send(result);
});

//计划删除
router.get('/delete_plan', async function (req, res) {
    let data = req.query;
    let delete_sql = "delete from tbl_Testing_plan where id=" + data.id + "";
    try {
        result = await query(delete_sql);
        res.json(1);
    } catch (e) {
        res.json(0);
    }

});


//常规定期检测首页查询
router.get('/select_routine', async function (req, res) {
    let data = req.query;
    console.log(data)
    let select_sql = "select Facility_type from tbl_Routine_testing";
    result = await query(select_sql);
    let result1;
    let result2;
    let result3 = [];
    for (i = 0; i < result.length; i++) {
        if (result[i].Facility_type == 0) {
            let select;
            if (data.uid !== '1') {
                select = "SELECT small_id,Test_Report, Odd_Numbers, N.id, Facility_type,bridgename,Inspection_date,Patrol,Patrol_unit FROM tbl_Testing_plan AS M RIGHT JOIN (" +
                    " select small_id,Test_Report, Odd_Numbers, B.id, Facility_type,bridgename,Inspection_date,Patrol,Patrol_unit from tbl_bridge_info as A right JOIN(" +
                    " select small_id,Test_Report, Odd_Numbers, id, case Facility_type" +
                    " when 0 then \"桥梁\" " +
                    " end as Facility_type,"+
                    " Facility_id,Inspection_date,Patrol,Patrol_unit" +
                    " from tbl_Routine_testing" +
                    " where Facility_type=0" +
                    " ) AS B" +
                    " ON A.BridgeID=B.Facility_id" +
                    " where A.manageid=" + data.uid +") AS N " +
                    " ON M.id=N.small_id" +
                    " WHERE state='ok'";
            } else {
                select = "SELECT small_id,Test_Report, Odd_Numbers, N.id, Facility_type,bridgename,Inspection_date,Patrol,Patrol_unit FROM tbl_Testing_plan AS M RIGHT JOIN (" +
                    "select small_id,Test_Report, Odd_Numbers, B.id, Facility_type,bridgename,Inspection_date,Patrol,Patrol_unit from tbl_bridge_info as A right join(" +
                    " select small_id,Test_Report, Odd_Numbers, id, case Facility_type " +
                    " when 0 then \"桥梁\" " +
                    " end as Facility_type," +
                    " Facility_id,Inspection_date,Patrol,Patrol_unit" +
                    " from tbl_Routine_testing" +
                    " where Facility_type=0" +
                    " ) as B " +
                    " ON A.BridgeID=B.Facility_id"+
                    " ON M.id=N.small_id" +
                    " WHERE state='ok'";
            }
            result1 = await query(select);
            console.log(result1);
        } else {
            let select;
            if (data.uid !== '1') {
                select = "SELECT small_id,Test_Report, Odd_Numbers, N.id, Facility_type,passagewayname,Inspection_date,Patrol,Patrol_unit FROM tbl_Testing_plan AS M RIGHT JOIN (" +
                    " select small_id,Test_Report, Odd_Numbers, B.id, Facility_type,PassagewayName,Inspection_date,Patrol,Patrol_unit from tbl_passageway_info as A right join(" +
                    " select small_id,Test_Report, Odd_Numbers, id, case Facility_type " +
                    " when 1 then \"人行通道\"" +
                    " end as Facility_type," +
                    " Facility_id,Inspection_date,Patrol,Patrol_unit" +
                    " from tbl_Routine_testing" +
                    " where Facility_type=1 " +
                    " ) as B " +
                    " ON A.PassagewayID=B.Facility_id" +
                    " where A.manageid=" + data.uid +") AS N " +
                    " ON M.id=N.small_id" +
                    " WHERE state='ok'";
            } else {
                select = "SELECT small_id,Test_Report, Odd_Numbers, N.id, Facility_type,passagewayname,Inspection_date,Patrol,Patrol_unit FROM tbl_Testing_plan AS M RIGHT JOIN (" +
                    " select small_id,Test_Report, Odd_Numbers, B.id, Facility_type,PassagewayName,Inspection_date,Patrol,Patrol_unit from tbl_passageway_info as A right join(" +
                    " select small_id,Test_Report, Odd_Numbers, id, case Facility_type " +
                    " when 1 then \"人行通道\"" +
                    " end as Facility_type," +
                    " Facility_id,Inspection_date,Patrol,Patrol_unit" +
                    " from tbl_Routine_testing" +
                    " where Facility_type=1 " +
                    " ) as B " +
                    " ON A.PassagewayID=B.Facility_id"+
                    " ON M.id=N.small_id" +
                    " WHERE state='ok'";
            }
            result2 = await query(select);
            console.log(result2);
        }
    }
    result3.push(result1);
    result3.push(result2);
    res.send(result3);
    console.log(result3)
});

//常规定期检测首页查询(检测)
router.get('/select_routine_check', async function (req, res) {
    let data = req.query;
    console.log(data);
    let sql = 'select branch from branch where id=' + data.branch_id;
    let res1 = await query(sql);
    let branch = res1[0].branch;
    console.log(branch);
    let select_sql = "select Facility_type from tbl_Routine_testing";
    result = await query(select_sql);
    let result1;
    let result2;
    let result3 = [];
    for (i = 0; i < result.length; i++) {
        if (result[i].Facility_type == 0) {
            let select = "SELECT small_id,X.state,BCI,Test_Report, Odd_Numbers,X.id, Facility_type,bridgename,BridgeID,Inspection_date,Patrol,Patrol_unit,plan_id,plan_name FROM tbl_big_plan AS T RIGHT JOIN(" +
                " SELECT small_id,state,BCI,Test_Report, Odd_Numbers,N.id, Facility_type,bridgename,BridgeID,Inspection_date,Patrol,Patrol_unit,plan_id FROM tbl_Testing_plan AS M RIGHT JOIN (" +
                " select small_id,BCI, Test_Report, Odd_Numbers, B.id, Facility_type,bridgename,BridgeID,Inspection_date,Patrol,Patrol_unit from tbl_bridge_info as A right JOIN(" +
                " select BCI, Test_Report, Odd_Numbers, id, case Facility_type" +
                " when 0 then \"桥梁\" " +
                " end as Facility_type, " +
                " Facility_id,Inspection_date,Patrol,Patrol_unit,small_id" +
                " from tbl_Routine_testing" +
                " where Facility_type=0" +
                " ) AS B" +
                " ON A.BridgeID=B.Facility_id" +
                "  where Patrol_unit='" + branch + "') AS N" +
                " ON M.id=N.small_id) AS X" +
                " ON T.id=X.plan_id" +
                " order by id desc";
            result1 = await query(select);
        } else {
            let select = "SELECT small_id,X.state,BCI,Test_Report, Odd_Numbers,X.id, Facility_type,passagewayname,passagewayid,Inspection_date,Patrol,Patrol_unit,plan_id,plan_name FROM tbl_big_plan AS T RIGHT JOIN(" +
            " SELECT small_id,state,BCI,Test_Report, Odd_Numbers,N.id, Facility_type,passagewayname,passagewayid,Inspection_date,Patrol,Patrol_unit,plan_id FROM tbl_Testing_plan AS M RIGHT JOIN (" +
            " select small_id,BCI, Test_Report, Odd_Numbers, B.id, Facility_type,passagewayname,passagewayid,Inspection_date,Patrol,Patrol_unit from tbl_passageway_info as A right JOIN(" +
            " select BCI, Test_Report, Odd_Numbers, id, case Facility_type" +
            " when 1 then \"人行通道\" " +
            " end as Facility_type, " +
            " Facility_id,Inspection_date,Patrol,Patrol_unit,small_id" +
            " from tbl_Routine_testing" +
            " where Facility_type=1" +
            " ) AS B" +
            " ON A.passagewayid=B.Facility_id" +
            "  where Patrol_unit='" + branch + "') AS N" +
            " ON M.id=N.small_id) AS X" +
            " ON T.id=X.plan_id" +
            " order by id desc";
            result2 = await query(select);
        }
    }
    result3.push(result1);
    result3.push(result2);
    res.send(result3);
});
router.get('/select_planname',async function(req,res){
   
    let data=req.query;
     console.log(data)
	let select_sql="select plan_name,id from tbl_big_plan WHERE uid in (select registrant_id from admin where id="+data.uid+")";
	try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//常规定期检测查看详情(管理 Facility_type设施类型判断，uid当前登录id)
router.get('/select_details_manage', async function (req, res) {
    let data = req.query;
    console.log(data);
    let result;
    if (data.Facility_type == '桥梁') {
        data.Facility_type = 0;
    } else {
        data.Facility_type = 1;
    }
    let Facility_type = data.Facility_type;
    if (Facility_type == 0) {
        let select_sql;
        if (data.uid !== '1') {
            select_sql = "select bridgename,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_bridge_info as A right join (" +
                " select id, Facility_id,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_Routine_testing) as B" +
                " ON A.bridgeid=B.Facility_id" +
                " where A.manageid=" + data.uid + "" +
                " and B.id=" + data.id + "";
        } else {
            select_sql = "select bridgename,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_bridge_info as A right join (" +
                " select id, Facility_id,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_Routine_testing) as B" +
                " ON A.bridgeid=B.Facility_id" +
                " where B.id=" + data.id + "";
        }
        console.log(select_sql)
        try {
            result = await query(select_sql);
        } catch (e) {
            console.log(`select err` + e)
        }
        res.send(result);
    } else {
        let select_sql;
        if (data.uid !== '1') {
            select_sql = "select PassagewayName,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_passageway_info as A right join (" +
                " select id, Facility_id,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_Routine_testing) as B" +
                " ON A.PassagewayID=B.Facility_id" +
                " where A.manageid=" + data.uid + "" +
                " and B.id=" + data.id + "";
        } else {
            select_sql = "select PassagewayName,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_passageway_info as A right join (" +
                " select id, Facility_id,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_Routine_testing) as B" +
                " ON A.PassagewayID=B.Facility_id" +
                " where A.manageid=" + data.uid + "" +
                " and B.id=" + data.id + "";
        }

        try {
            result = await query(select_sql);
            console.log(result)
        } catch (e) {
            console.log(`select err` + e)
        }
        res.send(result);
    };

});
/*-------------------------------------------------------------*/
//常规定期检测查看详情(检测 Facility_type设施类型判断，uid当前登录id)
router.get('/select_details_manage', async function (req, res) {
    let data = req.query;
    console.log(data);
    let result;
    if (data.Facility_type == '桥梁') {
        data.Facility_type = 0;
    } else {
        data.Facility_type = 1;
    }
    let Facility_type = data.Facility_type;
    if (Facility_type == 0) {
        let select_sql;
        if (data.uid !== '1') {
            select_sql = "select bridgename,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_bridge_info as A right join (" +
                " select id, Facility_id,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_Routine_testing) as B" +
                " ON A.bridgeid=B.Facility_id" +
                " and B.id=" + data.id + "";
            console.log(select_sql)
        } else {
            select_sql = "select bridgename,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_bridge_info as A right join (" +
                " select id, Facility_id,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_Routine_testing) as B" +
                " ON A.bridgeid=B.Facility_id" +
                " where B.id=" + data.id + "";
        }
        console.log(select_sql)
        try {
            result = await query(select_sql);
        } catch (e) {
            console.log(`select err` + e)
        }
        res.send(result);
    } else {
        let select_sql;
        if (data.uid !== '1') {
            select_sql = "select PassagewayName,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_passageway_info as A right join (" +
                " select id, Facility_id,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_Routine_testing) as B" +
                " ON A.PassagewayID=B.Facility_id" +
                " and B.id=" + data.id + "";
        } else {
            select_sql = "select PassagewayName,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_passageway_info as A right join (" +
                " select id, Facility_id,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_Routine_testing) as B" +
                " ON A.PassagewayID=B.Facility_id" +
                " and B.id=" + data.id + "";
        }

        try {
            result = await query(select_sql);
            console.log(result)
        } catch (e) {
            console.log(`select err` + e)
        }
        res.send(result);
    };

});
/*-------------------------------------------------------------*/


//常规定期检测查看详情(Facility_type设施类型判断，uid当前登录id)
router.get('/select_details_check', async function (req, res) {
    let data = req.query;
    console.log(data);
    let result;
    if (data.Facility_type == '桥梁') {
        data.Facility_type = 0;
    } else {
        data.Facility_type = 1;
    }
    let Facility_type = data.Facility_type;
    if (Facility_type == 0) {
        let select_sql = "SELECT bridgename,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI,plan_name FROM tbl_big_plan AS M RIGHT JOIN (" +
            "select bridgename,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_bridge_info as A right join (" +
            " select id, Facility_id,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_Routine_testing) as B" +
            " ON A.bridgeid=B.Facility_id" +
            " where B.id=" + data.id + ") AS N" +
            " ON M.id=N.plan_id";
        console.log(select_sql)
        try {
            result = await query(select_sql);
        } catch (e) {
            console.log(`select err` + e)
        }
        res.send(result);
    } else {
        let select_sql = "SELECT PassagewayName,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI,plan_name FROM tbl_big_plan AS M RIGHT JOIN (" +
            "select PassagewayName,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_passageway_info as A right join (" +
            " select id, Facility_id,Patrol,Patrol_unit,Inspection_date,plan_id,Test_Report,BCI from tbl_Routine_testing) as B" +
            " ON A.PassagewayID=B.Facility_id" +
            " where B.id=" + data.id + ") AS N" +
            " ON M.id=N.plan_id";
        try {
            result = await query(select_sql);
        } catch (e) {
            console.log(`select err` + e)
        }
        res.send(result);
    }

});

//查询检测计划(检测)
router.get('/select_check_plan', async function (req, res) {
    let data = req.query;
    console.log(data)
    let select_sql = "SELECT A.id,plan_name FROM tbl_Testing_plan AS A RIGHT JOIN tbl_big_plan AS B" +
        " ON A.plan_id=B.id" +
        " WHERE branch_id=" + data.branch_id + "" +
        " and facilities_type='0'";
    console.log(select_sql)
    try {
        result = await query(select_sql);
        console.log(result)
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//查询检测计划(检测)
router.get('/select_check_plan1', async function (req, res) {
    let data = req.query;
    console.log(data)
    let select_sql = "SELECT A.id,plan_name FROM tbl_Testing_plan AS A RIGHT JOIN tbl_big_plan AS B" +
        " ON A.plan_id=B.id" +
        " WHERE branch_id=" + data.branch_id + "" +
        " and facilities_type='1'";
    try {
        result = await query(select_sql);
        console.log(result)
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//结构性能检测首页显示
router.get('/select_structure', async function (req, res) {
    let data = req.query;
    if (data.Facility_type == '桥梁') {
        data.Facility_type = 0;
    } else {
        data.Facility_type = 1;
    };
    console.log(data);
    let Facility_type = data.Facility_type;
    if (Facility_type == 0) {
        let select_sql;
        if (data.uid !== '1') {
            select_sql = "select Q.id, Odd_Numbers,bridgename,type,component from tbl_bridge_info as P right join (" +
                " select N.id, Odd_Numbers,Facility_id,type,component from tbl_Routine_testing as M RIGHT join (" +
                " select A.id, case Facility_type" +
                " when 0 then '桥梁'" +
                " when 1 then '人行通道'" +
                " end as type," +
                " component,check_id from tbl_structure_testing as A left join Conventional_structure as B" +
                " on A.id=B.structure_id" +
                " where check_id =" + data.id + ") as N" +
                " ON M.id=N.check_id) as Q" +
                " on P.BridgeID=Q.Facility_id";
        } else {
            select_sql = "select Q.id, Odd_Numbers,bridgename,type,component from tbl_bridge_info as P right join (" +
                " select N.id, Odd_Numbers,Facility_id,type,component from tbl_Routine_testing as M RIGHT join (" +
                " select A.id, case Facility_type" +
                " when 0 then '桥梁'" +
                " when 1 then '人行通道'" +
                " end as type," +
                " component,check_id from tbl_structure_testing as A left join Conventional_structure as B" +
                " on A.id=B.structure_id" +
                " where check_id =" + data.id + ") as N" +
                " ON M.id=N.check_id) as Q" +
                " on P.BridgeID=Q.Facility_id";
        }
        console.log(select_sql);
        try {
            result = await query(select_sql);
        } catch (e) {
            console.log(`select err` + e)
        }
        res.send(result);
    } else {
        let select_sql;
        if (data.uid !== '1') {
            select_sql = "select Q.id, Odd_Numbers,PassagewayName,type,component from tbl_passageway_info as P right join (" +
                " select N.id, Odd_Numbers,Facility_id,type,component from tbl_Routine_testing as M RIGHT join (" +
                " select A.id, case Facility_type" +
                " when 0 then '桥梁'" +
                " when 1 then '人行通道'" +
                " end as type," +
                " component,check_id from tbl_structure_testing as A left join Conventional_structure as B" +
                " on A.id=B.structure_id" +
                " where check_id =" + data.id + ") as N" +
                " ON M.id=N.check_id) as Q" +
                " on P.PassagewayID=Q.Facility_id";
        } else {
            select_sql = "select Q.id, Odd_Numbers,PassagewayName,type,component from tbl_passageway_info as P right join (" +
                " select N.id, Odd_Numbers,Facility_id,type,component from tbl_Routine_testing as M RIGHT join (" +
                " select A.id, case Facility_type" +
                " when 0 then '桥梁'" +
                " when 1 then '人行通道'" +
                " end as type," +
                " component,check_id from tbl_structure_testing as A left join Conventional_structure as B" +
                " on A.id=B.structure_id" +
                " where check_id =" + data.id + ") as N" +
                " ON M.id=N.check_id) as Q" +
                " on P.PassagewayID=Q.Facility_id";
        }
        try {
            result = await query(select_sql);
        } catch (e) {
            console.log(`select err` + e)
        }
        res.send(result);
    }
});

//结构性能检测首页显示（check）
router.get('/select_structure_check', async function (req, res) {
    let data = req.query;
    if (data.Facility_type == '桥梁') {
        data.Facility_type = 0;
    } else {
        data.Facility_type = 1;
    };
    console.log(data);
    let Facility_type = data.Facility_type;
    if (Facility_type == 0) {
        let select_sql = "select Q.id, Odd_Numbers,bridgename,type,component from tbl_bridge_info as P right join (" +
            " select N.id, Odd_Numbers,Facility_id,type,component from tbl_Routine_testing as M RIGHT join (" +
            " select A.id, case Facility_type" +
            " when 0 then '桥梁'" +
            " when 1 then '人行通道'" +
            " end as type," +
            " component,check_id from tbl_structure_testing as A left join Conventional_structure as B" +
            " on A.id=B.structure_id" +
            " where check_id =" + data.id + ") as N" +
            " ON M.id=N.check_id) as Q" +
            " on P.BridgeID=Q.Facility_id";
        console.log(select_sql);
        try {
            result = await query(select_sql);
        } catch (e) {
            console.log(`select err` + e)
        }
        res.send(result);
    } else {
        let select_sql = "select Q.id, Odd_Numbers,PassagewayName,type,component from tbl_passageway_info as P right join (" +
            " select N.id, Odd_Numbers,Facility_id,type,component from tbl_Routine_testing as M RIGHT join (" +
            " select A.id, case Facility_type" +
            " when 0 then '桥梁'" +
            " when 1 then '人行通道'" +
            " end as type," +
            " component,check_id from tbl_structure_testing as A left join Conventional_structure as B" +
            " on A.id=B.structure_id" +
            " where check_id =" + data.id + ") as N" +
            " ON M.id=N.check_id) as Q" +
            " on P.PassagewayID=Q.Facility_id";
        try {
            result = await query(select_sql);
        } catch (e) {
            console.log(`select err` + e)
        }
        res.send(result);
    }
});

//结构性能检测详情展示(id  tbl_structure_testing自增id)
router.get('/select_Structural_details', async function (req, res) {
    let data = req.query;
    let obj = {};
    let select_sql1 = "select component,type,diameter,steel_min,steel_max," +
        " steel_avg,steel_set_up,protect_min,protect_max,protect_avg," +
        " protect_set_up,protect_Features,protect_evaluate from tbl_Reinforced_concrete" +
        " where Odd_Numbers='" + data.Odd_Numbers + "'" +
        " and id=" + data.id + "";
    let select_sql2 = "select component,avg,evaluate from tbl_carbonization" +
        " where Odd_Numbers='" + data.Odd_Numbers + "'" +
        " and id=" + data.id + "";
    let select_sql3 = "select component,test_method,Strength,Design,evaluate from tbl_concrete_strength" +
        " where Odd_Numbers='" + data.Odd_Numbers + "'" +
        " and id=" + data.id + "";
    let select_sql4 = "select component,min,max,evaluate from tbl_Chloride_ion" +
        " where Odd_Numbers='" + data.Odd_Numbers + "'" +
        " and id=" + data.id + "";
    let select_sql5 = "select component,min,max,evaluate from tbl_resistivity" +
        " where Odd_Numbers='" + data.Odd_Numbers + "'" +
        " and id=" + data.id + "";
    let select_sql6 = "select component,min,max,evaluate from tbl_potential" +
        " where Odd_Numbers='" + data.Odd_Numbers + "'" +
        " and id=" + data.id + "";
    try {
        result = await query(select_sql1);
        result1 = await query(select_sql2);
        result2 = await query(select_sql3);
        result3 = await query(select_sql4);
        result4 = await query(select_sql5);
        result5 = await query(select_sql6);
        obj.reinforced_concrete = result;
        obj.carbonization = result1;
        obj.concrete_strength = result2;
        obj.chloride_ion = result3;
        obj.resistivity = result4;
        obj.potential = result5;
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(obj);
});

//结构性能检测新增
router.post('/insert_struct', async function (req, res) {
    let data = req.body;
    let ID;
    console.log(data);
    if (data.Facility_type == '桥梁') {
        data.Facility_type = 0;
    } else {
        data.Facility_type = 1;
    }
    let insert_sql = "call `insert_struct`('" + data.Facility_type + "'," + data.Facility_id + "," +
        " '" + data.component + "','" + data.Odd_Numbers + "','" + data.type + "','" + data.diameter + "'," +
        " " + data.steel_min + "," + data.steel_max + "," + data.steel_avg + "," + data.steel_set_up + "," +
        " " + data.protect_min + "," + data.protect_max + "," + data.protect_avg + "," + data.protect_set_up + "," +
        " " + data.protect_Features + "," + data.protect_evaluate + "," + data.avg + "," + data.evaluate + "," +
        " '" + data.test_method + "'," + data.Strength + "," + data.Design + "," + data.Hevaluate + "," +
        " " + data.Lmin + "," + data.Lmax + "," + data.Levaluate + "," + data.Dmin + "," + data.Dmax + "," +
        " " + data.Devaluate + "," + data.Gmin + "," + data.Gmax + "," + data.Gevaluate + ")";
    try {
        result = await query(insert_sql);
        console.log(result);
        let select_sql = "select max(id) finaid from tbl_structure_testing";
        id = await query(select_sql);
        console.log(id);
        ID = id[0].finaid;
        console.log(ID);
        let insert_sql1 = "insert into Conventional_structure (check_id,structure_id) values(" + data.id + "," + ID + ")";
        console.log(insert_sql1);
        result2 = await query(insert_sql1);
        res.json(1);
    } catch (e) {
        res.json(0);
    }

});

//结构性能检测删除
router.get('/delete_struct', async function (req, res) {
    let data = req.query;
    let delete_sql = "call `delete_struct`(" + data.id + ")";
    try {
        result = await query(delete_sql);
    } catch (e) {
        res.json(0);
    }
    res.json(1);
});

//结构性能检测修改
router.post('/update_struct', async function (req, res) {
    let data = req.body;
    console.log(data);
    let update_sql = "call `update_struct`(" + data.diameter + "," + data.steel_min + "," + data.steel_max + "," + data.steel_avg + "," +
        " " + data.steel_set_up + "," + data.protect_min + "," + data.protect_max + "," + data.protect_avg + "," + data.protect_set_up + "," +
        " " + data.protect_Features + "," + data.protect_evaluate + "," + data.avg + "," + data.strength + "," + data.design + "," +
        " " + data.Lmin + "," + data.Lmax + "," + data.Dmin + "," + data.Dmax + "," + data.Gmin + "," + data.Gmax + "," + data.id + ")";
    try {
        result = await query(update_sql);
        res.json(1);
    } catch (e) {
        res.json(0);
    }

});
//常规定期检测病害
router.get('/select_testing_disease', async function (req, res) {
    let data = req.query;
    let select_sql = "select component_type,component_name,damage_type,disease_location,disease_description from disease_detection" +
        " where Odd_Numbers='" + data.Odd_Numbers + "'";
    console.log(select_sql);
    try {
        result = await query(select_sql);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

});



//常规定期检测记录删除
router.get('/delete_Record', async function (req, res) {
    let data = req.query;
    console.log(data);
    let delete_sql = "CALL `DeleteSql`('" + data.id + "')";
    console.log(delete_sql)
    try {
        result = await query(delete_sql);
        res.json(1)
    } catch (e) {
        res.json(0);
    }


});
//荷载试验首页查询(manage)
router.get('/select_load', async function (req, res) {
    let data = req.query;
    let select_sql;
    if (data.uid == '1') {
        select_sql = "SELECT N.id,Test_Report,bridgename,Inspection_date,Detection_range,Filling_person,Reviewer,small_id FROM tbl_Testing_plan AS M RIGHT JOIN(" +
            " select id,Test_Report,bridgename,Inspection_date,Detection_range,Filling_person,Reviewer,small_id from tbl_bridge_info as A right JOIN (" +
            " select id,Test_Report,bridge_id,Inspection_date,Detection_range,Filling_person,Reviewer,small_id from tbl_Load_test) AS B" +
            " ON A.BridgeID=B.bridge_id)AS N" +
            " ON M.id=N.small_id" +
            " WHERE state='ok'";
    } else {
        select_sql = "SELECT N.id,Test_Report,bridgename,Inspection_date,Detection_range,Filling_person,Reviewer,small_id FROM tbl_Testing_plan AS M RIGHT JOIN(" +
            " select id,Test_Report,bridgename,Inspection_date,Detection_range,Filling_person,Reviewer,small_id from tbl_bridge_info as A right join (" +
            " select id,Test_Report,bridge_id,Inspection_date,Detection_range,Filling_person,Reviewer,small_id from tbl_Load_test) as B" +
            " ON A.BridgeID=B.bridge_id" +
            " where manageid=" + data.uid +") AS N "+
            " ON M.id=N.small_id" +
            " WHERE state='ok'";
    }
    try {
        result = await query(select_sql);
        console.log(result);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

});

//荷载试验首页查询(check)
router.get('/select_load_check', async function (req, res) {
    let data = req.query;
    let select_sql = "SELECT N.id,small_id,bridgename,Inspection_date,Detection_range,Filling_person,Reviewer,Test_Report,state FROM tbl_Testing_plan AS M RIGHT JOIN (" +
        " select id,small_id,bridgename,Inspection_date,Detection_range,Filling_person,Reviewer,Test_Report from tbl_bridge_info as A right JOIN (" +
            " select id, small_id, bridge_id,Inspection_date,Detection_range,Filling_person,Reviewer,Test_Report from tbl_Load_test) AS B" +
            " ON A.BridgeID=B.bridge_id) AS N" +
            " ON M.id=N.small_id";
    console.log(select_sql);
    try {
        result = await query(select_sql);
        console.log(result);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

});
//荷载试验详细内容查询(id=荷载试验表中的自增id)
router.get('/select_loadDetail', async function (req, res) {
    let data = req.query;
    console.log(data);
    let select_sql = "select bridgename,bridge_id,plan_id,Inspection_date,branch_id,branch,Filling_person,Detection_range,Reviewer,Auditor," +
        " Detection_Content,detection_result,Detection_conclusion,Reform_scheme,recommended_measure,Test_Report from branch as M right join (" +
        " select bridgename,bridge_id,plan_id,Inspection_date,branch_id,Filling_person,Detection_range,Reviewer,Auditor," +
        " Detection_Content,detection_result,Detection_conclusion,Reform_scheme,recommended_measure,Test_Report from tbl_bridge_info as A right join(" +
        " select bridge_id,plan_id,Inspection_date,branch_id,Filling_person,Detection_range,Reviewer,Auditor," +
        " Detection_Content,detection_result,Detection_conclusion,Reform_scheme,recommended_measure,Test_Report from tbl_Load_test" +
        " where id = " + data.id + ") as B" +
        " on A.BridgeID=B.bridge_id ) as N" +
        " on M.id=N.branch_id";
    console.log(select_sql);
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});


//结构性能选择(manage)
router.get('/select_struct', async function (req, res) {
    let data = req.query;
    let select_sql = "select LineName,PierNum,ComponentName from tbl_bridge_component as P right join (" +
        " select BridgePierID,LineName,PierNum from tbl_bridge_pier as M inner join (" +
        " select BridgeLineID,LineName from tbl_bridge_line as A left join tbl_bridge_info as B" +
        " on A.BridgeID=B.BridgeID" +
        " where B.manageid=" + data.uid + " and A.BridgeID=" + data.BridgeID + ") as N" +
        " on M.BridgeLineID=N.BridgeLineID) as Q" +
        " on P.StructureID=Q.BridgePierID" +
        " where SuperStructure='001003'";
    let select_sql1 = "select LineName,BridgeAbutmentNum,ComponentName from tbl_bridge_component as P right join (" +
        " select BridgeAbuID,LineName,BridgeAbutmentNum from tbl_bridge_abutment as M inner join (" +
        " select BridgeLineID,LineName from tbl_bridge_line as A left join tbl_bridge_info as B" +
        " on A.BridgeID=B.BridgeID" +
        " where B.manageid=" + data.uid + " and A.BridgeID=" + data.BridgeID + ") as N" +
        " on M.BridgeLineID=N.BridgeLineID) as Q" +
        " on P.StructureID=Q.BridgeAbuID" +
        " where SuperStructure='001002'";
    let select_sql2 = "select LineName,SpanNum,ComponentName from tbl_bridge_component as P right join (" +
        " select BridgeSpanID,LineName,SpanNum from tbl_bridge_span as M inner join (" +
        " select BridgeLineID,LineName from tbl_bridge_line as A left join tbl_bridge_info as B" +
        " on A.BridgeID=B.BridgeID" +
        " where B.manageid=" + data.uid + " and A.BridgeID=" + data.BridgeID + ") as N" +
        " on M.BridgeLineID=N.BridgeLineID) as Q" +
        " on P.StructureID=Q.BridgeSpanID" +
        " where SuperStructure='001001'";
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result2 = await query(select_sql2);
        result = result.concat(result1);
        result = result.concat(result2);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

});

//结构性能选择(check)
router.get('/select_struct_check', async function (req, res) {
    let data = req.query;
    let select_sql = "select LineName,PierNum,ComponentName from tbl_bridge_component as P right join (" +
        " select BridgePierID,LineName,PierNum from tbl_bridge_pier as M inner join (" +
        " select BridgeLineID,LineName from tbl_bridge_line as A left join tbl_bridge_info as B" +
        " on A.BridgeID=B.BridgeID" +
        " where  A.BridgeID=" + data.BridgeID + ") as N" +
        " on M.BridgeLineID=N.BridgeLineID) as Q" +
        " on P.StructureID=Q.BridgePierID" +
        " where SuperStructure='001003'";
    let select_sql1 = "select LineName,BridgeAbutmentNum,ComponentName from tbl_bridge_component as P right join (" +
        " select BridgeAbuID,LineName,BridgeAbutmentNum from tbl_bridge_abutment as M inner join (" +
        " select BridgeLineID,LineName from tbl_bridge_line as A left join tbl_bridge_info as B" +
        " on A.BridgeID=B.BridgeID" +
        " where A.BridgeID=" + data.BridgeID + ") as N" +
        " on M.BridgeLineID=N.BridgeLineID) as Q" +
        " on P.StructureID=Q.BridgeAbuID" +
        " where SuperStructure='001002'";
    let select_sql2 = "select LineName,SpanNum,ComponentName from tbl_bridge_component as P right join (" +
        " select BridgeSpanID,LineName,SpanNum from tbl_bridge_span as M inner join (" +
        " select BridgeLineID,LineName from tbl_bridge_line as A left join tbl_bridge_info as B" +
        " on A.BridgeID=B.BridgeID" +
        " where A.BridgeID=" + data.BridgeID + ") as N" +
        " on M.BridgeLineID=N.BridgeLineID) as Q" +
        " on P.StructureID=Q.BridgeSpanID" +
        " where SuperStructure='001001'";
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result2 = await query(select_sql2);
        result = result.concat(result1);
        result = result.concat(result2);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

});

//查当前账号下的桥和人行通道

//桥梁
router.get('/select_bri', async function (req, res) {
    let data = req.query;
    let select_sql = "select BridgeID,BridgeName from tbl_bridge_info where manageid=" + data.uid + "";
    try {
        result = await query(select_sql);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

});
//人行通道
router.get('/select_passage', async function (req, res) {
    let data = req.query;
    let select_sql = "select PassagewayID,PassagewayName from tbl_passageway_info where manageid=" + data.uid + "";
    try {
        result = await query(select_sql);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

});

//桥梁(check)
router.get('/select_bri_check', async function (req, res) {
    let data = req.query;
    let select_sql = "select BridgeID,BridgeName from tbl_bridge_info where checkid=" + data.uid + "";
    try {
        result = await query(select_sql);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

});
//人行通道(check)
router.get('/select_passage_check', async function (req, res) {
    let data = req.query;
    let select_sql = "select PassagewayID,PassagewayName from tbl_passageway_info where checkid=" + data.uid + "";
    try {
        result = await query(select_sql);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

});

//部门
router.get('/select_branchs', async function (req, res) {
    let data = req.query;
    let select_sql = "select id,branch from branch where find_in_set(id, getChildLst(" + data.id + ")) and branch_type=0";
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//新建检测计划
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, path.join(__dirname, '../static/plan'));
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + file.originalname);
    }
});

let upload = multer({
    storage: storage
});
/*
router.post('/insert_file', upload.single('file'), async function (req, res) {
    let file = req.file;
    console.log(file);
    let data = req.body;
    console.log(data);
    let path = file.path.toString();
    path = path.replace(new RegExp("\\\\", "gm"), "=");
    console.log(path);
    let insert_sql = "insert into tbl_Testing_plan (bridge_id,File_name,plan_name,start_time,end_time,branch_id,plan_type,facilities_type)" +
        " values(" + data.facilityName + ",'" + file.filename + "','" + data.plan_name + "','" + data.start_time + "'," +
        " '" + data.end_time + "'," + data.branch + ",'" + data.plan_type + "','" + data.facilities_type + "')";
    console.log(insert_sql);
    try {
        result = await query(insert_sql);
        res.json(1);
    } catch (e) {
        res.json(0);
        console.log(`insert err` + e)
    }

    //console.log(file);
    //res.send(file);

}); */

//荷载试验记录新增
router.post('/insert_load', upload.single('file'), async function (req, res) {
    let data = req.body;
    console.log(data);
    let file = req.file;
    console.log(file);
    let insert_sql = "insert into tbl_Load_test (bridge_id,plan_id,Inspection_date,branch_id,Filling_person,Detection_range," +
        " Auditor,Reviewer,Detection_Content,detection_result,Detection_conclusion,Reform_scheme,recommended_measure,Test_Report)" +
        " values(" + data.bridge_id + "," + data.plan_id + ",'" + data.Inspection_date + "'," + data.branch_id + ",'" + data.Filling_person + "'," +
        " '" + data.Detection_range + "','" + data.Auditor + "','" + data.Reviewer + "','" + data.Detection_Content + "','" + data.detection_result + "'," +
        " '" + data.Detection_conclusion + "','" + data.Reform_scheme + "','" + data.recommended_measure + "','" + file.filename + "')";
    try {
        result = await query(insert_sql);
        res.json(1)

    } catch (e) {
        res.json(0);
    }


});

//荷载试验记录自增
router.post('/insert_load1', async function (req, res) {
    let data = req.body;
    console.log(data);
    let select_sql = "select max(id) id from tbl_Testing_plan"
    result2 = await query(select_sql);
    let small_id = result2[0].id;

    try {
        for (let item of data.branch_arr.reverse()) {
            let insert_sql = "insert into tbl_Load_test (bridge_id,plan_id,small_id)" +
                " values(" + item + "," + data.id + "," + small_id + ")";
            console.log(insert_sql);
            result = await query(insert_sql);
            small_id -=1;
        }

        res.json(1)
    } catch (e) {
        res.json(0);
    }


});

//荷载试验记录修改(id==荷载试验表自增id)a
router.post('/update_load', upload.single('file'), async function (req, res) {
    let file;
    if (req.file == undefined) {
        file = req.body.Test_Report;
    } else {
        file = req.file.filename;
    };
    let data = req.body;
    console.log(data);
    let update_sql = "update tbl_Load_test set Inspection_date='" + data.Inspection_date + "',Filling_person='" + data.Filling_person + "',Detection_range='" + data.Detection_range + "'," +
        " Auditor='" + data.Auditor + "',Reviewer='" + data.Reviewer + "',Detection_Content='" + data.Detection_Content + "',detection_result='" + data.detection_result + "'," +
        " Detection_conclusion='" + data.Detection_conclusion + "',Reform_scheme='" + data.Reform_scheme + "',recommended_measure='" + data.recommended_measure + "'," +
        " Test_Report='" + file + "' where id=" + data.id + "";
    try {
        result = await query(update_sql);
        res.json(1)
    } catch (e) {
        res.json(0);
    }

});

//荷载试验记录删除(id==荷载试验表自增id)
router.get('/delete_load', async function (req, res) {
    let data = req.query;
    let delete_sql = "delete from tbl_Load_test where id=" + data.id + "";
    try {
        result = await query(delete_sql);
        res.json(1)
    } catch (e) {
        res.json(0);
    }

});


//计划修改
router.post('/update_plan', upload.single('file'), async function (req, res) {
    let file;
    if (req.file == undefined) {
        file = req.body.File_name;
    } else {
        file = req.file.filename;
    };
    let data = req.body;
    console.log(data);
    let update_sql = "update tbl_Testing_plan set File_name='" + file + "',plan_name='" + data.plan_name + "'," +
        "start_time='" + data.start_time + "',end_time='" + data.end_time + "',branch_id=" + data.branch_id + "" +
        " where id=" + data.id + "";
    console.log(update_sql)
    try {
        result = await query(update_sql);
        res.json(1);

    } catch (e) {
        res.json(0);
    }
});

//常规定期检测新增
router.post('/insert_routine', upload.single('file'), async function (req, res) {
    let file;
    if (req.file == undefined) {
        file = req.body.File_name;
    } else {
        file = req.file.filename;
    };
    let data = req.body;
    console.log(data)
    let select_sql1 = "select count(*) count from tbl_Routine_testing";
    result1 = await query(select_sql1);
    num = (result1[0].count) + 1;
    let insert_sql = "insert into tbl_Routine_testing(Odd_Numbers,Facility_type,Facility_id,Inspection_date,Patrol,Patrol_unit,plan_id,BCI,Test_Report) " +
        " values('" + num + "','" + data.Facility_type + "','" + data.Facility_id + "','" + data.Inspection_date + "','" + data.Patrol + "'," +
        " '" + data.Patrol_unit + "','" + data.plan_id + "','" + data.BCI + "','" + file + "')";
    try {
        result = await query(insert_sql);
    }
    catch (e) {
        res.json(0);
    }
    res.json(1);

});

//常规定期检测新增
router.post('/insert_routine1', async function (req, res) {

    let data = req.body;
    console.log(data)
    let sel_branch = "select branch from branch where id=" + data.branch_id;
    let res_branch = await query(sel_branch);
    let branch = res_branch[0].branch;
    let select_sql = "select max(id) id from tbl_Testing_plan"
    result2 = await query(select_sql);
    let small_id = result2[0].id;
    console.log(small_id);
    let select_sql1 = "select count(*) count from tbl_Routine_testing";
    result1 = await query(select_sql1);
    num = (result1[0].count) + 1;

    try {
        for (let item of data.branch_arr.reverse()) {
            let insert_sql = "insert into tbl_Routine_testing(Odd_Numbers,Facility_type,Facility_id,Patrol_unit,plan_id,small_id) " +
                " values('" + num + "','" + data.plan_type + "','" + item + "'," +
                " '" + branch + "','" + data.id + "'," + small_id + ")";
            result = await query(insert_sql);
            small_id -= 1;
        }
        res.json(1);
    }
    catch (e) {
        res.json(0);
    }


});
//小计划确认
router.get('/update_state', async function (req, res) {
    data = req.query;
    update_sql = "update tbl_Testing_plan set state='ok' where id=" + data.small_id + "";
    try {
        result = await query(update_sql);
    }
    catch (e) {
        res.json(0)
    }
    res.json(1);

});


//常规检测数据修改
router.post('/update_routine', upload.single('file'), async function (req, res) {
    let file;
    if (req.file == undefined) {
        file = req.body.Test_Report;
    } else {
        file = req.file.filename;
    };
    let data = req.body;
    console.log(data)
    let update_sql = "update tbl_Routine_testing set Inspection_date='" + data.Inspection_date + "',Patrol='" + data.Patrol + "'," +
        " BCI=" + data.BCI + ",Test_Report='" + file + "' where id=" + data.id + "";
    try {
        result = await query(update_sql);
        res.json(1);
    }
    catch (e) {
        res.json(0);
    }
});

//检测人员的计划(check)
router.get('/select_plan_check', async function (req, res) {
    let data = req.query;
    let select_sql = "SELECT bridge_id,bridgename,branch,branch_id,plan_type,facilities_type,plan_name,start_time,end_time,File_name FROM tbl_bridge_info AS M RIGHT JOIN (" +
        " SELECT bridge_id,branch,branch_id,plan_type,facilities_type,plan_name,start_time,end_time,File_name FROM branch AS A RIGHT JOIN (" +
        " SELECT bridge_id,plan_type,facilities_type,plan_name,branch_id,start_time,end_time,File_name FROM tbl_Testing_plan) AS B" +
        " ON A.id=B.branch_id) AS N" +
        " ON M.bridgeid=N.bridge_id" +
        " WHERE checkid=" + data.uid + "";
    try {
        result = await query(select_sql);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//查检测部门
router.get('/select_check_branch', async function (req, res) {
    let data = req.query;
    let select_sql = "select id,branch from branch where id =" + data.branch_id + "";
    try {
        result = await query(select_sql);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//查询大计划返回id
router.get('/select_big_plan', async function (req, res) {
    let data = req.query;
    console.log(data);
    if (data.uid == '1') {
        select_sql = "select * from tbl_big_plan order by id desc ";
    } else {
        select_sql = "select * from tbl_big_plan where uid = " + data.uid + " order by id desc";
    }

    try {
        result = await query(select_sql);
        console.log(result);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//新建大计划
router.post('/inset_big_plan', upload.single('file'), async function (req, res) {
    let data = req.body;
    let file = req.file;
    let insert_sql = "insert into tbl_big_plan(plan_name,start_time,end_time,file_name,uid) values('" + data.plan_name + "','" + data.start_time + "','" + data.end_time + "','" + file.filename + "'," + data.uid + ")";
    try {
        result = await query(insert_sql);
        res.json(1);
    }
    catch (e) {
        res.json(0);
    }
});
//根据小计划修改大计划状态
router.get('/update_big_plan1', async function (req, res) {
    let data = req.query;
    try {
        let update_sql = "update tbl_big_plan set state='" + data.state + "' where id= " + data.id + "";
        result = await query(update_sql);
        res.json(1);
    }
    catch (e) {
        res.json(0);
    }
});
//修改大计划
router.post('/update_big_plan', upload.single('file'), async function (req, res) {
    let data = req.body;
    console.log(data)
    if (req.file == undefined) {
        file = req.body.file_name;
    } else {
        file = req.file.filename;
    };
    try {
        let update_sql = "update tbl_big_plan set plan_name='" + data.plan_name + "',start_time='" + data.start_time + "',end_time='" + data.end_time + "',file_name='" + file + "' where id= " + data.id + "";
        result = await query(update_sql);
        res.json(1);
    }
    catch (e) {
        res.json(0);
    }
});

//删除大计划
router.get('/delete_big_plan', async function (req, res) {
    let data = req.query;
    let delete_sql = "delete from tbl_big_plan where id=" + data.id + "";
    try {
        result = await query(delete_sql);
        res.json(1);
    }
    catch (e) {
        res.json(0);
    }
});

//大计划下的小计划
router.get('/select_small_plan', async function (req, res) {
    let data = req.query;
    let select_sql = "SELECT N.id,bridge_id facilitiesid,bridgename facilitiesname,branch_id,branch,plan_type,facilities_type,state FROM branch AS M RIGHT JOIN (" +
        " SELECT B.id,bridge_id,bridgename,branch_id,plan_type,facilities_type,state FROM tbl_bridge_info AS A RIGHT JOIN (" +
        " SELECT id,bridge_id,branch_id,plan_type,facilities_type,state FROM tbl_Testing_plan" +
        " WHERE plan_id=" + data.id + "" +
        " and plan_type='0') AS B" +
        " ON A.BridgeID=B.bridge_id) AS N" +
        " ON M.id=N.branch_id";
    let select_sql1 = "SELECT N.id,PassagewayID facilitiesid,PassagewayName facilitiesname,branch_id,branch,plan_type,facilities_type,state FROM branch AS M RIGHT JOIN (" +
        " SELECT B.id,PassagewayID,PassagewayName,branch_id,plan_type,facilities_type,state FROM tbl_passageway_info AS A RIGHT JOIN (" +
        " SELECT id,bridge_id,branch_id,plan_type,facilities_type,state FROM tbl_Testing_plan" +
        " WHERE plan_id=" + data.id + "" +
        " and plan_type='1') AS B" +
        " ON A.PassagewayID=B.bridge_id) AS N" +
        " ON M.id=N.branch_id";
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1)
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//新建小计划
router.post('/insert_file', async function (req, res) {
    let data = req.body;
    try {
        for (let item of data.branch_arr) {
            let insert_sql = "insert into tbl_Testing_plan (plan_id,bridge_id,branch_id,plan_type,facilities_type)" +
                " values(" + data.id + "," + item + "," + data.branch_id + ",'" + data.plan_type + "','" + data.facilities_type + "')";
            console.log(insert_sql);
            result = await query(insert_sql);
        }
        res.json(1);
    } catch (e) {
        console.log(`insert err` + e)
    }

});

//修改小计划
router.post('/update_small_plan', async function (req, res) {
    let data = req.body;
    console.log(data)
    let update_sql = "update tbl_Testing_plan set bridge_id=" + data.facilitiesid + ",branch_id=" + data.branch_id + ",plan_type=" + data.plan_type + ",facilities_type=" + data.facilities_type + "" +
        " where id=" + data.id + "";
    try {
        result = await query(update_sql);
        res.json(1);
    } catch (e) {
        res.json(0);
        console.log(`insert err` + e)
    }
});

//删除小计划
router.get('/delete_small_plan', async function (req, res) {
    let data = req.query;
    let delete_sql = "delete from tbl_Testing_plan where id = " + data.id + "";
    try {
        result = await query(delete_sql);
        res.json(1);
    } catch (e) {
        res.json(0);
        console.log(`insert err` + e)
    }
});

//检测页面展示小计划
router.get('/select_small', async function (req, res) {
    let data = req.query;
    let select_sql = "SELECT Y.id,bridge_id facilitiesid,bridgename facilitiesname,branch,branch_id,plan_type,facilities_type,plan_id,plan_name,start_time,end_time,file_name,Y.state FROM tbl_bridge_info AS X RIGHT JOIN(" +
        " SELECT N.id,bridge_id,branch,branch_id,plan_type,facilities_type,plan_id,plan_name,start_time,end_time,file_name,N.state FROM branch AS M RIGHT JOIN(" +
        " SELECT A.id,bridge_id,branch_id,plan_type,facilities_type,plan_id,plan_name,start_time,end_time,file_name,A.state FROM tbl_Testing_plan AS A LEFT JOIN tbl_big_plan AS B" +
        " ON A.plan_id=B.id" +
        " WHERE branch_id=" + data.branch_id + " and plan_type='0') AS N" +
        " ON M.id=N.branch_id) AS Y" +
        " ON X.BridgeID=Y.bridge_id order by Y.id desc";
    let select_sql1 = "SELECT Y.id,PassagewayID facilitiesid,PassagewayName facilitiesname,branch,branch_id,plan_type,facilities_type,plan_id,plan_name,start_time,end_time,file_name,Y.state FROM tbl_passageway_info AS X RIGHT JOIN(" +
        " SELECT N.id, bridge_id,branch,branch_id,plan_type,facilities_type,plan_id,plan_name,start_time,end_time,file_name,N.state FROM branch AS M RIGHT JOIN(" +
        " SELECT A.id,bridge_id,branch_id,plan_type,facilities_type,plan_id,plan_name,start_time,end_time,file_name,A.state FROM tbl_Testing_plan AS A LEFT JOIN tbl_big_plan AS B" +
        " ON A.plan_id=B.id" +
        " WHERE branch_id=" + data.branch_id + " and plan_type='1') AS N" +
        " ON M.id=N.branch_id) AS Y" +
        " ON X.PassagewayID=Y.bridge_id order by Y.id desc";
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1)
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//删除检测病害
router.get('/delete_check_dis', async function (req, res) {
    let data = req.query;
    let delete_sql = "delete from disease_detection where id=" + data.id + "";
    try {
        result = await query(delete_sql);
        res.json(1);
    } catch (e) {
        res.json(0);
        console.log(`insert err` + e)
    }
});
//检测统计页面(管理单位)
router.get('/select_Statistics_manage', async function (req, res) {
    let data = req.query;
    console.log(data)
    if (data.power == '0') {
        sql = '';
    } else {
        sql = " where manageid=" + data.uid + "";
    };
    let select_sql = "SELECT Q.id,Facility_type,Facility_id,bridgename Facilityname,Inspection_date,Patrol,Patrol_unit,Test_Report,plan_name FROM tbl_bridge_info AS P RIGHT JOIN (" +
        " SELECT N.id,Facility_type,Facility_id,Inspection_date,Patrol,Patrol_unit,Test_Report,plan_name FROM Maintenance_plan AS M RIGHT JOIN (" +
        " SELECT B.id,A.plan_id,Facility_type,Facility_id,Inspection_date,Patrol,Patrol_unit,Test_Report FROM tbl_Testing_plan AS A RIGHT JOIN (" +
        " SELECT id,plan_id,Facility_type,Facility_id,Inspection_date,Patrol,Patrol_unit,Test_Report FROM tbl_Routine_testing) AS B" +
        " ON A.id=B.plan_id" +
        " WHERE Facility_type='0') AS N" +
        " ON M.id=N.plan_id) AS Q" +
        " ON P.BridgeID=Q.Facility_id" +
        " " + sql + "";
    let select_sql1 = "SELECT Q.id,Facility_type,Facility_id,PassagewayName Facilityname,Inspection_date,Patrol,Patrol_unit,Test_Report,plan_name FROM tbl_passageway_info AS P RIGHT JOIN (" +
        " SELECT N.id,Facility_type,Facility_id,Inspection_date,Patrol,Patrol_unit,Test_Report,plan_name FROM Maintenance_plan AS M RIGHT JOIN (" +
        " SELECT B.id,A.plan_id,Facility_type,Facility_id,Inspection_date,Patrol,Patrol_unit,Test_Report FROM tbl_Testing_plan AS A RIGHT JOIN (" +
        " SELECT id,plan_id,Facility_type,Facility_id,Inspection_date,Patrol,Patrol_unit,Test_Report FROM tbl_Routine_testing) AS B" +
        " ON A.id=B.plan_id" +
        " WHERE Facility_type='1') AS N" +
        " ON M.id=N.plan_id) AS Q" +
        " ON P.PassagewayID=Q.Facility_id" +
        " " + sql + "";
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);
        console.log(result);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
/*-----------------------------------------------------------------*/
//检测统计页面(检测单位)
router.get('/select_Statistics_check', async function (req, res) {
    let data = req.query;
    console.log(data)

    let select_sql = "SELECT Q.id,Facility_type,Facility_id,bridgename Facilityname,Inspection_date,Patrol,Patrol_unit,Test_Report,plan_name FROM tbl_bridge_info AS P RIGHT JOIN (" +
        " SELECT N.id,Facility_type,Facility_id,Inspection_date,Patrol,Patrol_unit,Test_Report,plan_name FROM Maintenance_plan AS M RIGHT JOIN (" +
        "  SELECT id,plan_id,Facility_type,Facility_id,Inspection_date,Patrol,Patrol_unit,Test_Report FROM tbl_Routine_testing" +
        "  WHERE Facility_type='0') AS N" +
        "  ON M.id=N.plan_id) AS Q" +
        "  ON P.BridgeID=Q.Facility_id" +
        "  order by id DESC";
    let select_sql1 = "SELECT Q.id,Facility_type,Facility_id,PassagewayName Facilityname,Inspection_date,Patrol,Patrol_unit,Test_Report,plan_name FROM tbl_passageway_info AS P RIGHT JOIN (" +
        " SELECT N.id,Facility_type,Facility_id,Inspection_date,Patrol,Patrol_unit,Test_Report,plan_name FROM Maintenance_plan AS M RIGHT JOIN (" +
        " SELECT id,plan_id,Facility_type,Facility_id,Inspection_date,Patrol,Patrol_unit,Test_Report FROM tbl_Routine_testing) AS B" +
        " ON A.id=B.plan_id" +
        " WHERE Facility_type='1') AS N" +
        " ON M.id=N.plan_id) AS Q" +
        " ON P.PassagewayID=Q.Facility_id"  +
        " order by id desc";
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);
        console.log(result);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
/*-----------------------------------------------------------------*/
//检测统计页面(荷载试验 管理)
router.get('/select_Statistics_load', async function (req, res) {
    let data = req.query;
    let select_sql = "SELECT J.id,plan_id,plan_name,bridge_id,bridgename,Inspection_date,Detection_range,Filling_person,Reviewer,branch_id,branch FROM branch AS I RIGHT JOIN (" +
        " SELECT Y.id,plan_id,plan_name,bridge_id,bridgename,Inspection_date,Detection_range,Filling_person,Reviewer,branch_id FROM tbl_bridge_info AS X RIGHT JOIN (" +
        " SELECT Q.id,plan_id,plan_name,bridge_id,Inspection_date,Detection_range,Filling_person,Reviewer,branch_id FROM tbl_big_plan AS P RIGHT JOIN (" +
        " SELECT B.id,A.plan_id,B.bridge_id,Inspection_date,Detection_range,Filling_person,Reviewer,B.branch_id FROM tbl_Testing_plan AS A RIGHT JOIN (" +
        " SELECT id,plan_id,bridge_id,Inspection_date,Detection_range,Filling_person,Reviewer,branch_id FROM tbl_Load_test) AS B" +
        " ON A.id=B.plan_id" +
        " WHERE facilities_type='1') AS Q" +
        " ON P.id=Q.plan_id) AS Y" +
        " ON X.BridgeID=Y.bridge_id" +
        " WHERE manageid=" + data.uid + ") AS J" +
        " ON I.id=J.branch_id";
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
/*---------------------------------------------------------------*/
//检测统计页面(荷载试验 检测)
router.get('/select_Statistics_load_check', async function (req, res) {
    let data = req.query;
    console.log(data)
    let select_sql = "SELECT J.id,plan_id,plan_name,bridge_id,bridgename,Inspection_date,Detection_range,Filling_person,Reviewer,branch_id,branch FROM branch AS I RIGHT JOIN (" +
        " SELECT Y.id,plan_id,plan_name,bridge_id,bridgename,Inspection_date,Detection_range,Filling_person,Reviewer,branch_id FROM tbl_bridge_info AS X RIGHT JOIN (" +
        " SELECT Q.id,plan_id,plan_name,bridge_id,Inspection_date,Detection_range,Filling_person,Reviewer,branch_id FROM tbl_big_plan AS P RIGHT JOIN (" +
        " SELECT DISTINCT(B.id) id,A.plan_id,B.bridge_id,Inspection_date,Detection_range,Filling_person,Reviewer,B.branch_id FROM tbl_Testing_plan AS A right JOIN (" +
        " SELECT id,plan_id,bridge_id,Inspection_date,Detection_range,Filling_person,Reviewer,branch_id FROM tbl_Load_test) AS B" +
        " ON A.plan_id=B.plan_id" +
        " WHERE A.facilities_type='1') AS Q" +
        " ON P.id=Q.plan_id) AS Y" +
        " ON X.BridgeID=Y.bridge_id) AS J" +
        " ON I.id=J.branch_id" + 
        " order by id desc"
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
/*---------------------------------------------------------------*/
//查病害等级
router.get('/select_score', async function (req, res) {
    let data = req.query;
    select_sql = "SELECT DamGrade FROM tbl_disease_score" +
        " WHERE DiseaseID=" + data.DiseaseID + "";
    try {
        result = await query(select_sql);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
//查病害等级
router.get('/select_score_grade', async function (req, res) {
    let data = req.query;
    select_sql = 'SELECT DamageExplain from disease where DiseaseID =' + data.disease_id;
    try {
        result = await query(select_sql);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
/* --------------------------------------------------------------------------- */
router.get('/select_bridge_struct', async function (req, res) {
    let data = req.query;
    let sql = "SELECT id,branch label FROM branch WHERE id=" + data.branch_id + "";
    let select_sql = "SELECT bridgeid id ,bridgename label FROM tbl_bridge_info WHERE manageid=" + data.uid + "";
    result = await query(sql);
    result1 = await query(select_sql);
    console.log("后恢复恶化" + result)
    result[0].children = result1;
    res.send(result)

});
router.get('/select_passage_struct', async function (req, res) {
    let data = req.query;
    let sql = "SELECT id,branch label FROM branch WHERE id=" + data.branch_id + "";
    let select_sql = "SELECT PassagewayID id ,PassagewayName label FROM tbl_passageway_info WHERE manageid=" + data.uid + "";
    result = await query(sql);
    result1 = await query(select_sql);
    console.log("后恢复恶化" + result)
    result[0].children = result1;
    res.send(result)

});
function Struct(id, label, BridgeLineID, children, level) {
    this.id = id;
    this.label = label;
    this.BridgeLineID = BridgeLineID;
    this.children = children;
    this.level = level;
    this.expanded = true;
}
router.get('/tree', async function (req, res) {
    let treedata = [];
    let bridge = {};
    let sql_line = 'select LineName from mmp.tbl_bridge_line where BridgeLineID=' + req.query.LineID;
    let res1 = await query(sql_line);
    let BridgeLineID = req.query.LineID;
    let LineName = res1[0].LineName;
    bridge.bridgeId = req.query.BridgeID;
    bridge.label = req.query.BridgeName;
    bridge.children = [];
    bridge.level = 1;
    bridge.expanded = true;
    //let line_sql = `select BridgeLineID, LineName from mmp.tbl_bridge_line where BridgeID = ${req.query.BridgeID}`;
    try {
        //resInfo = await query(line_sql);
        let oneLine = {};
        oneLine.id = BridgeLineID;
        oneLine.label = LineName;
        oneLine.children = [];
        oneLine.level = 2;
        oneLine.expanded = true;
        let span_sql = `select BridgeSpanID,SpanNum  from mmp.tbl_bridge_span where BridgeLineID = ${BridgeLineID}`;
        let res_span = await query(span_sql);
        let spans = [];
        for (let j = 0; j < res_span.length; j++) {
            let one_span = {};
            one_span.id = res_span[j].BridgeSpanID;
            one_span.label = res_span[j].SpanNum;
            one_span.BridgeLineID = BridgeLineID;
            one_span.level = 4;
            one_span.expanded = true;
            one_span.children = [];
            let sqlComponent = `select ComponentID id,ComponentName label from mmp.tbl_bridge_component where BridgeLineID=${BridgeLineID} and SuperStructure='001001' and StructureID=${res_span[j].BridgeSpanID}`;
            let res_com = await query(sqlComponent);
            one_span.children = res_com;
            spans.push(one_span);
        }
        let up = new Struct(1, "上部结构", BridgeLineID, spans, 3);
        oneLine.children.push(up);

        let pier_sql = `select BridgePierID,PierNum  from mmp.tbl_bridge_pier where  BridgeLineID = ${BridgeLineID}`;
        let res_pier = await query(pier_sql);
        let downs = [];
        for (let j = 0; j < res_pier.length; j++) {
            let one_pier = {};
            one_pier.id = res_pier[j].BridgePierID;
            one_pier.label = res_pier[j].PierNum;
            one_pier.BridgeLineID = BridgeLineID;
            one_pier.level = 4;
            one_pier.expanded = true;
            one_pier.children = [];
            let sqlComponent = `select ComponentID id,ComponentName label from mmp.tbl_bridge_component where BridgeLineID=${BridgeLineID} and SuperStructure='001003' and StructureID=${res_pier[j].BridgePierID}`;
            let res_com = await query(sqlComponent);
            one_pier.children = res_com;
            downs.push(one_pier);
        }

        let abutment_sql = `select BridgeAbuID,BridgeAbutmentNum  from mmp.tbl_bridge_abutment where BridgeLineID = ${BridgeLineID}`;
        let res_abutment = await query(abutment_sql);
        for (let j = 0; j < res_abutment.length; j++) {
            let one_abutment = {};
            one_abutment.id = res_abutment[j].BridgeAbuID;
            one_abutment.label = res_abutment[j].BridgeAbutmentNum;
            one_abutment.BridgeLineID = BridgeLineID;
            one_abutment.level = 4;
            one_abutment.expanded = true;
            one_abutment.children = [];
            let sqlComponent = `select ComponentID id,ComponentName label from mmp.tbl_bridge_component where BridgeLineID=${BridgeLineID} and SuperStructure='001002' and StructureID=${res_abutment[j].BridgeAbuID}`;
            let res_com = await query(sqlComponent);
            one_abutment.children = res_com;
            downs.push(one_abutment);
        }
        let down = new Struct(2, "下部结构", BridgeLineID, downs, 3);
        oneLine.children.push(down);


        let surface_sql = `select BridgeSurfaceID  from mmp.tbl_bridge_surface where  BridgeLineID = ${BridgeLineID}`;
        let res_surface = await query(surface_sql);
        let surface = {};
        surface.typeID = 3;
        surface.label = '桥面系';
        surface.BridgeLineID = BridgeLineID;
        surface.level = 3;
        let sqlComponent1 = `select ComponentID id,ComponentName label from mmp.tbl_bridge_component where BridgeLineID=${BridgeLineID} and SuperStructure='001004' and StructureID=${res_surface[0].BridgeSurfaceID}`;
        let res_com_surface = await query(sqlComponent1);
        surface.children = res_com_surface;
        if (res_surface.length !== 0) {
            surface.id = res_surface[0].BridgeSurfaceID;
        }

        oneLine.children.push(surface);

        let att_sql = `select BridgeAttachID  from mmp.tbl_bridge_attachment where  BridgeLineID = ${BridgeLineID}`;
        let res_attr = await query(att_sql);
        let attachment = {};
        attachment.typeID = 4;
        attachment.label = '附属设施';
        attachment.BridgeLineID = BridgeLineID;
        attachment.level = 3;
        let sqlComponent2 = `select ComponentID id,ComponentName label from mmp.tbl_bridge_component where BridgeLineID=${BridgeLineID} and SuperStructure='001005' and StructureID=${res_attr[0].BridgeAttachID}`;
        let res_com_attachment = await query(sqlComponent2);
        attachment.children = res_com_attachment;
        if (res_attr.length !== 0) {
            attachment.id = res_attr[0].BridgeAttachID;
        };
        oneLine.children.push(attachment);

        let anti_sql = `select AntiknockID  from mmp.tbl_bridge_antiknock where  BridgeLineID = ${BridgeLineID}`;
        let res_anti = await query(anti_sql);
        let antiknock = {};
        antiknock.typeID = 5;
        antiknock.label = '抗震设施';
        antiknock.BridgeLineID = BridgeLineID;
        antiknock.level = 3;
        let sqlComponent3 = `select ComponentID id,ComponentName label from mmp.tbl_bridge_component where BridgeLineID=${BridgeLineID} and SuperStructure='001006' and StructureID=${res_anti[0].AntiknockID}`;
        let res_com_antiknock = await query(sqlComponent3);
        antiknock.children = res_com_antiknock;
        if (res_anti.length !== 0) {
            antiknock.id = res_anti[0].AntiknockID;
        };
        oneLine.children.push(antiknock);
        bridge.children.push(oneLine);

        treedata.push(bridge)
        console.log(treedata)
        res.json(treedata);
    } catch (e) {
        console.log(`select err` + e)
    }

});

module.exports = router;
