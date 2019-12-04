const express = require('express');
const router = express.Router();
const query = require('myMysql');
const multer = require('multer');
const path = require('path');



/*---------------------------------------------------------------------------------*/
//养护首页（管理账号）
router.get('/select_home_manage', async function (req, res) {
  let data = req.query;
  let select_sql;
  let select_sql1;
  console.log(data);
  if (data.power == '0') {
    select_sql = "select facilities_type,Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
      " from tbl_Schedule as P right join (" +
      " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time,facilities_type from branch as M right join (" +
      " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT join(" +
      " select id, Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo where Odd_Numbers <> '') as B" +
      " on A.BridgeID=B.bridge_id" +
      " where B.facilities_type='0') as N" +
      " on M.id=N.branch_id) Q" +
      " on P.Odd_Numbers=Q.Odd_Numbers" +
      " order by Odd_Numbers desc";
    select_sql1 = "select facilities_type,Q.id, Q.Odd_Numbers,Q.PassagewayID facilitiesid,Q.PassagewayName facilitiesname,Q.PassagewayNum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
      " from tbl_Schedule as P right JOIN (" +
      " select N.id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,branch,submitter,Reporting_time,facilities_type from branch as M right JOIN (" +
      " select id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,submitter,Reporting_time,facilities_type from tbl_passageway_info as A RIGHT JOIN(" +
      " select id, Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo where Odd_Numbers <> '') AS B" +
      " on A.PassagewayID=B.bridge_id" +
      " where B.facilities_type='1') AS N" +
      " on M.id=N.branch_id) Q" +
      " on P.Odd_Numbers=Q.Odd_Numbers"+
      " order by Odd_Numbers desc";
  } else {
    select_sql = "select facilities_type,Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
      " from tbl_Schedule as P right join (" +
      " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time,facilities_type from branch as M right join (" +
      " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT join(" +
      " select id, Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo where Odd_Numbers <> '') as B" +
      " on A.BridgeID=B.bridge_id" +
      " where manageid=" + data.uid + " AND B.facilities_type='0') as N" +
      " on M.id=N.branch_id) Q" +
      " on P.Odd_Numbers=Q.Odd_Numbers"+
      " order by Odd_Numbers desc";
    select_sql1 = "select facilities_type,Q.id, Q.Odd_Numbers,Q.PassagewayID facilitiesid,Q.PassagewayName facilitiesname,Q.PassagewayNum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
      " from tbl_Schedule as P right JOIN (" +
      " select N.id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,branch,submitter,Reporting_time,facilities_type from branch as M right JOIN (" +
      " select id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,submitter,Reporting_time,facilities_type from tbl_passageway_info as A RIGHT JOIN(" +
      " select id, Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo where Odd_Numbers <> '') AS B" +
      " on A.PassagewayID=B.bridge_id" +
      " where manageid=" + data.uid + " AND B.facilities_type='1') AS N" +
      " on M.id=N.branch_id) Q" +
      " on P.Odd_Numbers=Q.Odd_Numbers"+
      " order by Odd_Numbers desc";
  }
  try {
    result = await query(select_sql);
    result1 = await query(select_sql1);
    result = result.concat(result1);

  } catch (e) {
    console.log(`select err` + e)
  }
  res.send(result);
});
/*--------------------------------------------------------------------------------------------------------------*/

//养护首页（养护账号）
router.get('/select_home', async function (req, res) {
    let data = req.query;
    let select_sql;
    let select_sql1;
    console.log(data);
    if (data.power == '0') {
        select_sql = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id," +
          " Q.branch,Q.submitter,Q.Reporting_time,P.StepID" +
          " from tbl_Schedule as P right JOIN (" +
          " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as" +
          " M right JOIN (" +
          " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT JOIN(" +
          " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
          " ON X.Odd_Numbers=Y.Odd_Numbers" +
          " WHERE X.Odd_Numbers <> ''" +
          " AND Y.StepID=0) AS B" +
          " on A.BridgeID=B.bridge_id" +
          " where B.facilities_type='0') AS N" +
          " on M.id=N.branch_id) Q" +
          " on P.Odd_Numbers=Q.Odd_Numbers"+
          " order by Odd_Numbers desc";
        select_sql1 = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id," +
          " Q.branch,Q.submitter,Q.Reporting_time,P.StepID" +
          " from tbl_Schedule as P right JOIN (" +
          " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as" +
          " M right JOIN (" +
          " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT JOIN(" +
          " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
          " ON X.Odd_Numbers=Y.Odd_Numbers" +
          " WHERE X.Odd_Numbers <> ''" +
          " AND Y.StepID=0) AS B" +
          " on A.BridgeID=B.bridge_id" +
          " where B.facilities_type='1') AS N" +
          " on M.id=N.branch_id) Q" +
          " on P.Odd_Numbers=Q.Odd_Numbers"+
          " order by Odd_Numbers desc";
    } else {
      select_sql = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
        " from tbl_Schedule as P right join (" +
        " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as M right join (" +
        " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT join(" +
        " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
        " ON X.Odd_Numbers=Y.Odd_Numbers" +
        " WHERE X.Odd_Numbers <> ''" +
        " AND Y.StepID=0) AS B" +
        " on A.BridgeID=B.bridge_id" +
        " where manageid=" + data.uid + " AND B.facilities_type='0') as N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers"+
        " order by Odd_Numbers desc";
      select_sql1 = "select Q.id, Q.Odd_Numbers,Q.PassagewayID facilitiesid,Q.PassagewayName facilitiesname,Q.PassagewayNum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
        " from tbl_Schedule as P right JOIN (" +
        " select N.id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,branch,submitter,Reporting_time from branch as M right JOIN (" +
        " select id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,submitter,Reporting_time,facilities_type from tbl_passageway_info as A RIGHT JOIN(" +
        " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
        " ON X.Odd_Numbers=Y.Odd_Numbers" +
        " WHERE X.Odd_Numbers <> ''" +
        " AND Y.StepID=0) AS B" +
        " on A.PassagewayID=B.bridge_id" +
        " where manageid=" + data.uid + " AND B.facilities_type='1') AS N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers"+
        " order by Odd_Numbers desc";
    }
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);

    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
/* -------------------------------------------------------------------------------------- */

//养护首页(已下发工单)
router.get('/select_order_ok', async function (req, res) {
    let data = req.query;
    let select_sql;
    let select_sql1;
    console.log(data);
    if (data.power == '0') {
        select_sql = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id," +
          " Q.branch,Q.submitter,Q.Reporting_time,P.StepID" +
          " from tbl_Schedule as P right JOIN (" +
          " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as" +
          " M right JOIN (" +
          " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT JOIN(" +
          " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
          " ON X.Odd_Numbers=Y.Odd_Numbers" +
          " WHERE X.Odd_Numbers <> ''" +
          " AND Y.StepID=1) AS B" +
          " on A.BridgeID=B.bridge_id" +
          " where B.facilities_type='0') AS N" +
          " on M.id=N.branch_id) Q" +
          " on P.Odd_Numbers=Q.Odd_Numbers";
        select_sql1 = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id," +
          " Q.branch,Q.submitter,Q.Reporting_time,P.StepID" +
          " from tbl_Schedule as P right JOIN (" +
          " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as" +
          " M right JOIN (" +
          " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT JOIN(" +
          " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
          " ON X.Odd_Numbers=Y.Odd_Numbers" +
          " WHERE X.Odd_Numbers <> ''" +
          " AND Y.StepID=1) AS B" +
          " on A.BridgeID=B.bridge_id" +
          " where B.facilities_type='1') AS N" +
          " on M.id=N.branch_id) Q" +
          " on P.Odd_Numbers=Q.Odd_Numbers";
    } else {
      select_sql = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
        " from tbl_Schedule as P right join (" +
        " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as M right join (" +
        " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT join(" +
        " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
        " ON X.Odd_Numbers=Y.Odd_Numbers" +
        " WHERE X.Odd_Numbers <> ''" +
        " AND Y.StepID=1) AS B" +
        " on A.BridgeID=B.bridge_id" +
        " where manageid=" + data.uid + " AND B.facilities_type='0') as N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers";
      select_sql1 = "select Q.id, Q.Odd_Numbers,Q.PassagewayID facilitiesid,Q.PassagewayName facilitiesname,Q.PassagewayNum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
        " from tbl_Schedule as P right JOIN (" +
        " select N.id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,branch,submitter,Reporting_time from branch as M right JOIN (" +
        " select id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,submitter,Reporting_time,facilities_type from tbl_passageway_info as A RIGHT JOIN(" +
        " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
        " ON X.Odd_Numbers=Y.Odd_Numbers" +
        " WHERE X.Odd_Numbers <> ''" +
        " AND Y.StepID=1) AS B" +
        " on A.PassagewayID=B.bridge_id" +
        " where manageid=" + data.uid + " AND B.facilities_type='1') AS N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers";
    }
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);

    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
/* -------------------------------------------------------------------------------------- */

//养护验收确认(待确认)
router.get('/select_unconfirm', async function (req, res) {
  let data = req.query;
  let select_sql;
  let select_sql1;
  console.log(data);
  if (data.power == '0') {
    select_sql = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id," +
      " Q.branch,Q.submitter,Q.Reporting_time,P.StepID" +
      " from tbl_Schedule as P right JOIN (" +
      " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as" +
      " M right JOIN (" +
      " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT JOIN(" +
      " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
      " ON X.Odd_Numbers=Y.Odd_Numbers" +
      " WHERE X.Odd_Numbers <> ''" +
      " AND Y.StepID=2) AS B" +
      " on A.BridgeID=B.bridge_id" +
      " where B.facilities_type='0') AS N" +
      " on M.id=N.branch_id) Q" +
      " on P.Odd_Numbers=Q.Odd_Numbers";
    select_sql1 = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id," +
      " Q.branch,Q.submitter,Q.Reporting_time,P.StepID" +
      " from tbl_Schedule as P right JOIN (" +
      " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as" +
      " M right JOIN (" +
      " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT JOIN(" +
      " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
      " ON X.Odd_Numbers=Y.Odd_Numbers" +
      " WHERE X.Odd_Numbers <> ''" +
      " AND Y.StepID=2) AS B" +
      " on A.BridgeID=B.bridge_id" +
      " where B.facilities_type='1') AS N" +
      " on M.id=N.branch_id) Q" +
      " on P.Odd_Numbers=Q.Odd_Numbers";
  } else {
    select_sql = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
      " from tbl_Schedule as P right join (" +
      " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as M right join (" +
      " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT join(" +
      " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
      " ON X.Odd_Numbers=Y.Odd_Numbers" +
      " WHERE X.Odd_Numbers <> ''" +
      " AND Y.StepID=2) AS B" +
      " on A.BridgeID=B.bridge_id" +
      " where manageid=" + data.uid + " AND B.facilities_type='0') as N" +
      " on M.id=N.branch_id) Q" +
      " on P.Odd_Numbers=Q.Odd_Numbers";
    select_sql1 = "select Q.id, Q.Odd_Numbers,Q.PassagewayID facilitiesid,Q.PassagewayName facilitiesname,Q.PassagewayNum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
      " from tbl_Schedule as P right JOIN (" +
      " select N.id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,branch,submitter,Reporting_time from branch as M right JOIN (" +
      " select id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,submitter,Reporting_time,facilities_type from tbl_passageway_info as A RIGHT JOIN(" +
      " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
      " ON X.Odd_Numbers=Y.Odd_Numbers" +
      " WHERE X.Odd_Numbers <> ''" +
      " AND Y.StepID=2) AS B" +
      " on A.PassagewayID=B.bridge_id" +
      " where manageid=" + data.uid + " AND B.facilities_type='1') AS N" +
      " on M.id=N.branch_id) Q" +
      " on P.Odd_Numbers=Q.Odd_Numbers";
  }
  try {
    result = await query(select_sql);
    result1 = await query(select_sql1);
    result = result.concat(result1);

  } catch (e) {
    console.log(`select err` + e)
  }
  res.send(result);
});

/*--------------------------------------------------------------------------*/
//养护验收确认(已确认)
router.get('/select_confirms', async function (req, res) {
    let data = req.query;
    let select_sql;
    let select_sql1;
    console.log(data);
    if (data.power == '0') {
      select_sql = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id," +
        " Q.branch,Q.submitter,Q.Reporting_time,P.StepID" +
        " from tbl_Schedule as P right JOIN (" +
        " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as" +
        " M right JOIN (" +
        " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT JOIN(" +
        " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
        " ON X.Odd_Numbers=Y.Odd_Numbers" +
        " WHERE X.Odd_Numbers <> ''" +
        " AND Y.StepID=3) AS B" +
        " on A.BridgeID=B.bridge_id" +
        " where B.facilities_type='0') AS N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers";
      select_sql1 = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id," +
        " Q.branch,Q.submitter,Q.Reporting_time,P.StepID" +
        " from tbl_Schedule as P right JOIN (" +
        " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as" +
        " M right JOIN (" +
        " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT JOIN(" +
        " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
        " ON X.Odd_Numbers=Y.Odd_Numbers" +
        " WHERE X.Odd_Numbers <> ''" +
        " AND Y.StepID=3) AS B" +
        " on A.BridgeID=B.bridge_id" +
        " where B.facilities_type='1') AS N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers";
    } else {
      select_sql = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
        " from tbl_Schedule as P right join (" +
        " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as M right join (" +
        " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT join(" +
        " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
        " ON X.Odd_Numbers=Y.Odd_Numbers" +
        " WHERE X.Odd_Numbers <> ''" +
        " AND Y.StepID=3) AS B" +
        " on A.BridgeID=B.bridge_id" +
        " where manageid=" + data.uid + " AND B.facilities_type='0') as N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers";
      select_sql1 = "select Q.id, Q.Odd_Numbers,Q.PassagewayID facilitiesid,Q.PassagewayName facilitiesname,Q.PassagewayNum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
        " from tbl_Schedule as P right JOIN (" +
        " select N.id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,branch,submitter,Reporting_time from branch as M right JOIN (" +
        " select id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,submitter,Reporting_time,facilities_type from tbl_passageway_info as A RIGHT JOIN(" +
        " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
        " ON X.Odd_Numbers=Y.Odd_Numbers" +
        " WHERE X.Odd_Numbers <> ''" +
        " AND Y.StepID=3) AS B" +
        " on A.PassagewayID=B.bridge_id" +
        " where manageid=" + data.uid + " AND B.facilities_type='1') AS N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers";
    }
    try {
      result = await query(select_sql);
      result1 = await query(select_sql1);
      result = result.concat(result1);

    } catch (e) {
      console.log(`select err` + e)
    }
    res.send(result);
  });
/* --------------------------------------------------------------------------- */
//维护进度(病害工单数量、维修工单数量、验收工单数量)
router.get('/select_discount',async function(req,res){
  let obj={};
  let data=req.query;
  console.log(data);
  let sql1="SELECT COUNT(*) discount,branch_id,DATE_FORMAT(Reporting_time,'%Y-%m') retime FROM tbl_disease_baseinfo" +
    " WHERE Odd_Numbers IS NOT NULL" +
    " AND Reporting_time>='"+ data.startTime +"'" +
    " AND Reporting_time<='"+ data.endTime +"'" +
    " and branch_id="+ data.branch_id +" "+
    " GROUP BY DATE_FORMAT(Reporting_time,'%Y-%m')";

  let sql2="SELECT COUNT(*) discount,DATE_FORMAT(Reporting_time,'%Y-%m') retime FROM tbl_disease_baseinfo AS A LEFT JOIN tbl_Schedule AS B" +
    " ON A.Odd_Numbers=B.Odd_Numbers" +
    " WHERE A.Odd_Numbers IS NOT NULL" +
    " AND B.StepID=2" +
    " AND Reporting_time>='"+ data.startTime +"'" +
    " AND Reporting_time<='"+ data.endTime +"'" +
    " and branch_id="+ data.branch_id +" "+
    " GROUP BY DATE_FORMAT(Reporting_time,'%Y-%m')";

  let sql3="SELECT COUNT(*) discount,bridge_id,DATE_FORMAT(Reporting_time,'%Y-%m') retime FROM tbl_disease_baseinfo AS A LEFT JOIN tbl_Schedule AS B" +
    " ON A.Odd_Numbers=B.Odd_Numbers" +
    " WHERE A.Odd_Numbers IS NOT NULL" +
    " AND B.StepID=3" +
    " AND Reporting_time>='"+ data.startTime +"'" +
    " AND Reporting_time<='"+ data.endTime +"'" +
    " and branch_id="+ data.branch_id +" "+
    " GROUP BY bridge_id,DATE_FORMAT(Reporting_time,'%Y-%m')";
  try {
    result1 = await query(sql1);
    result2 = await query(sql2);
    result3 = await query(sql3);
  } catch (e) {
    console.log(`select err` + e)
  }
  obj.data1 = result1;
  obj.data2 = result2;
  obj.data3 = result3;
  res.send(obj);

});
/* --------------------------------------------------------------------------- */
router.get('/select_cost',async function(req,res){
  let data=req.query;
  let obj = {};
  let select_sql="SELECT SUM(Cost) BSUMCOST,retime FROM tbl_Check AS M RIGHT JOIN (" +
    " SELECT Odd_Numbers,bridge_id,DATE_FORMAT(Reporting_time,'%Y-%m') retime FROM tbl_disease_baseinfo AS A LEFT JOIN tbl_bridge_info AS B" +
    " ON A.bridge_id=B.BridgeID" +
    " WHERE Odd_Numbers IS NOT NULL" +
    " AND Reporting_time>='"+ data.startTime +"'" +
    " AND Reporting_time<='"+ data.endTime +"'" +
    " AND facilities_type='0'" +
    " AND curingid="+ data.uid +") AS N" +
    " ON M.Odd_Numbers=N.Odd_Numbers" +
    " GROUP BY retime";

  let select_sql1="SELECT SUM(Cost) BSUMCOST,retime FROM tbl_Check AS M RIGHT JOIN (" +
    " SELECT Odd_Numbers,bridge_id,DATE_FORMAT(Reporting_time,'%Y-%m') retime FROM tbl_disease_baseinfo AS A LEFT JOIN tbl_passageway_info AS B" +
    " ON A.bridge_id=B.passagewayID" +
    " WHERE Odd_Numbers IS NOT NULL" +
    " AND Reporting_time>='"+ data.startTime +"'" +
    " AND Reporting_time<='"+ data.endTime +"'" +
    " AND facilities_type='0'" +
    " AND curingid="+ data.uid +") AS N" +
    " ON M.Odd_Numbers=N.Odd_Numbers" +
    " GROUP BY retime";

  try {
    result = await query(select_sql);
    result1 = await query(select_sql1);
    obj.bridgeCost =  result;
    obj.passagewayCost = result1;
  } catch (e) {
    console.log(`select err` + e)
  }
  res.send(obj);
});
/* --------------------------------------------------------------------------- */
router.get('/select_cost_Settlement',async function(req,res){
  let data=req.query;
  let obj = {};
  //结算费用合计（按月分组）
  let select_sql1="SELECT SUM(Cost) BSUMCOST,retime FROM tbl_Check AS M RIGHT JOIN (" +
    " SELECT Odd_Numbers,bridge_id,DATE_FORMAT(Reporting_time,'%Y-%m') retime FROM tbl_disease_baseinfo" +
    " WHERE Odd_Numbers IS NOT NULL" +
    " AND Reporting_time>='"+ data.startTime +"'" +
    " AND Reporting_time<='"+ data.endTime +"'" +
    " AND branch_id="+ data.branch_id +") AS N" +
    " ON M.Odd_Numbers=N.Odd_Numbers" +
    " GROUP BY retime";
  //申报费用合计（按月分组）
  let select_sql2="SELECT SUM(Cost) PSUMCOST,retime FROM tbl_Completion_declaration AS M RIGHT JOIN (" +
  " SELECT Odd_Numbers,bridge_id,DATE_FORMAT(Reporting_time,'%Y-%m') retime FROM tbl_disease_baseinfo" +
  " WHERE Odd_Numbers IS NOT NULL" +
  " AND Reporting_time>='"+ data.startTime +"'" +
  " AND Reporting_time<='"+ data.endTime +"'" +
  " AND branch_id="+ data.branch_id +") AS N" +
  " ON M.Odd_Numbers=N.Odd_Numbers" +
  " GROUP BY retime";
  try {
    let cost1 = await query(select_sql1);
    console.log(cost1);
    let cost2 = await query(select_sql2);
    console.log(cost2);
    obj.data1 = cost1;
    obj.data2 = cost2;
    res.json(obj);
  }catch(e){
    console.log('get data err'+ e)
  }
});
/* --------------------------------------------------------------------------- */
/* --------------------------------------------------------------------------- */
  //养护验收确认(不通过)
router.get('/select_confirm_false', async function (req, res) {
    let data = req.query;
    let select_sql;
    let select_sql1;
    console.log(data);
    if (data.power == '0') {
      select_sql = "SELECT J.id,I.Odd_Numbers,facilitiesid,facilitiesname,facilitiesnum,branch_id," +
      " branch,submitter,Reporting_time,StepID,quality FROM tbl_Check AS I RIGHT JOIN (" +
      " select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id," +
      " Q.branch,Q.submitter,Q.Reporting_time,P.StepID" +
      " from tbl_Schedule as P right JOIN (" +
      " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as" +
      " M right JOIN (" +
      " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT JOIN(" +
      " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
      " ON X.Odd_Numbers=Y.Odd_Numbers" +
      " WHERE X.Odd_Numbers <> ''" +
      " AND Y.StepID=3) AS B" +
      " on A.BridgeID=B.bridge_id" +
      " where B.facilities_type='0') AS N" +
      " on M.id=N.branch_id) Q" +
      " on P.Odd_Numbers=Q.Odd_Numbers) AS J" +
      " ON I.Odd_Numbers=J.Odd_Numbers" +
      " WHERE quality=1";
      select_sql1 = "SELECT J.id,I.Odd_Numbers,facilitiesid,facilitiesname,facilitiesnum,branch_id," +
      " branch,submitter,Reporting_time,StepID,quality FROM tbl_Check AS I RIGHT JOIN (" +
      " select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id," +
      " Q.branch,Q.submitter,Q.Reporting_time,P.StepID" +
      " from tbl_Schedule as P right JOIN (" +
      " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as" +
      " M right JOIN (" +
      " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT JOIN(" +
      " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
      " ON X.Odd_Numbers=Y.Odd_Numbers" +
      " WHERE X.Odd_Numbers <> ''" +
      " AND Y.StepID=3) AS B" +
      " on A.BridgeID=B.bridge_id" +
      " where B.facilities_type='1') AS N" +
      " on M.id=N.branch_id) Q" +
      " on P.Odd_Numbers=Q.Odd_Numbers) AS J" +
      " ON I.Odd_Numbers=J.Odd_Numbers" +
      " WHERE quality=1";
    } else {
        select_sql = "SELECT J.id,I.Odd_Numbers,facilitiesid,facilitiesname,facilitiesnum,branch_id," +
        " branch,submitter,Reporting_time,StepID,quality FROM tbl_Check AS I RIGHT JOIN (" +
        " select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
        " from tbl_Schedule as P right join (" +
        " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time from branch as M right join (" +
        " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type from tbl_bridge_info as A RIGHT join(" +
        " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
        " ON X.Odd_Numbers=Y.Odd_Numbers" +
        " WHERE X.Odd_Numbers <> ''" +
        " AND Y.StepID=3) AS B" +
        " on A.BridgeID=B.bridge_id" +
        " where manageid=" + data.uid + " AND B.facilities_type='0') as N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers) AS J" +
        " ON I.Odd_Numbers=J.Odd_Numbers" +
        " WHERE quality=1";
        select_sql1 = "SELECT J.id,I.Odd_Numbers,facilitiesid,facilitiesname,facilitiesnum,branch_id," +
        " branch,submitter,Reporting_time,StepID,quality FROM tbl_Check AS I RIGHT JOIN (" +
        " select Q.id, Q.Odd_Numbers,Q.PassagewayID facilitiesid,Q.PassagewayName facilitiesname,Q.PassagewayNum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,P.StepID " +
        " from tbl_Schedule as P right JOIN (" +
        " select N.id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,branch,submitter,Reporting_time from branch as M right JOIN (" +
        " select id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,submitter,Reporting_time,facilities_type from tbl_passageway_info as A RIGHT JOIN(" +
        " SELECT Y.StepID,X.id, X.Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type from tbl_disease_baseinfo AS X LEFT JOIN tbl_Schedule AS Y" +
        " ON X.Odd_Numbers=Y.Odd_Numbers" +
        " WHERE X.Odd_Numbers <> ''" +
        " AND Y.StepID=3) AS B" +
        " on A.PassagewayID=B.bridge_id" +
        " where manageid=" + data.uid + " AND B.facilities_type='1') AS N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers) AS J" +
        " ON I.Odd_Numbers=J.Odd_Numbers" +
        " WHERE quality=1";
    }
    try {
      result = await query(select_sql);
      result1 = await query(select_sql1);
      result = result.concat(result1);

    } catch (e) {
      console.log(`select err` + e)
    }
    res.send(result);
  });
/*-----------------------------------------------------------------------------*/
//病害统计
router.get('/select_disease_statistics', async function (req, res) {
  let data = req.query;
  console.log(data);
  let select_sql = "SELECT disease_name,unit,Solution_Tips,project_id,material,Reporting_time,bridgeNAME facilitiesname FROM tbl_bridge_info AS X RIGHT JOIN( " +
    " SELECT disease_name,unit,Solution_Tips,project_id,material,Reporting_time,bridge_id FROM tbl_disease_baseinfo AS P RIGHT JOIN (" +
    " SELECT disease_name,unit,Solution_Tips,project_id,material FROM tbl_Unit_Price AS M RIGHT JOIN (" +
    " SELECT disease_name,unit,Solution_Tips,project_id,MaterialID FROM tbl_disease AS A RIGHT JOIN (" +
    " SELECT project_id,disease_curing_id,MaterialID FROM tbl_disease_Restoration) AS B " +
    " ON A.id=B.disease_curing_id" +
    " where A.type=1 )AS N" +
    " ON M.MaterialID=N.MaterialID)AS Q" +
    " ON P.id=Q.project_id" +
    " WHERE facilities_type=0) AS Y" +
    " ON X.BridgeID=Y.bridge_id" +
    " WHERE curingid="+ data.uid +"" +
    " order by Reporting_time desc";
  let select_sql1 = "SELECT disease_name,unit,Solution_Tips,project_id,material,Reporting_time,passagewayNAME facilitiesname FROM tbl_passageway_info AS X RIGHT JOIN( " +
    " SELECT disease_name,unit,Solution_Tips,project_id,material,Reporting_time,bridge_id FROM tbl_disease_baseinfo AS P RIGHT JOIN (" +
    " SELECT disease_name,unit,Solution_Tips,project_id,material FROM tbl_Unit_Price AS M RIGHT JOIN (" +
    " SELECT disease_name,unit,Solution_Tips,project_id,MaterialID FROM tbl_disease AS A RIGHT JOIN (" +
    " SELECT project_id,disease_curing_id,MaterialID FROM tbl_disease_Restoration) AS B " +
    " ON A.id=B.disease_curing_id" +
    " where A.type=1 )AS N" +
    " ON M.MaterialID=N.MaterialID)AS Q" +
    " ON P.id=Q.project_id" +
    " WHERE facilities_type=0) AS Y" +
    " ON X.PassagewayID=Y.bridge_id" +
    " WHERE curingid="+ data.uid +""+
    " order by Reporting_time desc";
  console.log(select_sql);
  try {
    result = await query(select_sql);
    result1 = await query(select_sql1);
    result=result.concat(result1);

  } catch (e) {
    console.log(`select err` + e)
  }
  res.send(result);
});
/* ---------------------------------------------------------------------------- */
//病害统计111
router.get('/select_disease_manage', async function (req, res) {
  let data = req.query;
  console.log(data);
  if (data.uid == '1') {
    sql = '';
  } else {
    sql = " WHERE manageid=" + data.uid + "";
  };
  let select_sql = "SELECT disease_name,unit,Solution_Tips,project_id,material,Reporting_time,facilitiesname FROM tbl_Schedule AS I RIGHT JOIN( " +
    " SELECT Odd_Numbers,disease_name,unit,Solution_Tips,project_id,material,Reporting_time,bridgeNAME facilitiesname FROM tbl_bridge_info AS X RIGHT JOIN( " +
    " SELECT Odd_Numbers,disease_name,unit,Solution_Tips,project_id,material,Reporting_time,bridge_id FROM tbl_disease_baseinfo AS P RIGHT JOIN (" +
    " SELECT disease_name,unit,Solution_Tips,project_id,material FROM tbl_Unit_Price AS M RIGHT JOIN (" +
    " SELECT disease_name,unit,Solution_Tips,project_id,MaterialID FROM tbl_disease AS A RIGHT JOIN (" +
    " SELECT project_id,disease_curing_id,MaterialID FROM tbl_disease_Restoration) AS B " +
    " ON A.id=B.disease_curing_id" +
    " where A.type=1)AS N" +
    " ON M.MaterialID=N.MaterialID)AS Q" +
    " ON P.id=Q.project_id" +
    " WHERE facilities_type=0) AS Y" +
    " ON X.BridgeID=Y.bridge_id" +
    " "+sql+") AS J" +
    " ON I.Odd_Numbers=J.Odd_Numbers" +
    " WHERE StepID=0";
  let select_sql1 = "SELECT disease_name,unit,Solution_Tips,project_id,material,Reporting_time,facilitiesname FROM tbl_Schedule AS I RIGHT JOIN( " +
    " SELECT Odd_Numbers,disease_name,unit,Solution_Tips,project_id,material,Reporting_time,passagewayNAME facilitiesname FROM tbl_passageway_info AS X RIGHT JOIN( " +
    " SELECT Odd_Numbers,disease_name,unit,Solution_Tips,project_id,material,Reporting_time,bridge_id FROM tbl_disease_baseinfo AS P RIGHT JOIN (" +
    " SELECT disease_name,unit,Solution_Tips,project_id,material FROM tbl_Unit_Price AS M RIGHT JOIN (" +
    " SELECT disease_name,unit,Solution_Tips,project_id,MaterialID FROM tbl_disease AS A RIGHT JOIN (" +
    " SELECT project_id,disease_curing_id,MaterialID FROM tbl_disease_Restoration) AS B " +
    " ON A.id=B.disease_curing_id" +
    " where A.type=1)AS N" +
    " ON M.MaterialID=N.MaterialID)AS Q" +
    " ON P.id=Q.project_id" +
    " WHERE facilities_type=1) AS Y" +
    " ON X.PassagewayID=Y.bridge_id" +
    " "+sql+") AS J" +
    " ON I.Odd_Numbers=J.Odd_Numbers" +
    " WHERE StepID=0";
  console.log(select_sql);
  try {
    result = await query(select_sql);
    result1 = await query(select_sql1);
    result=result.concat(result1);

  } catch (e) {
    console.log(`select err` + e)
  }
  res.send(result);
});
/* ---------------------------------------------------------------------------- */
//养护流程首页
router.get('/select_maintain', async function (req, res) { //WHERE P.Odd_Numbers IS NULL
    let data = req.query;
    console.log(data);
    let select_sql = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,facilities_type,P.StepID,Log_id " +
        " from tbl_Schedule as P right join (" +
        " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time,facilities_type,Log_id from branch as M right join (" +
        " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type,Log_id from tbl_bridge_info as A RIGHT join(" +
        " select id, Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type,Log_id from tbl_disease_baseinfo) as B" +
        " on A.BridgeID=B.bridge_id" +
        " where curingid=" + data.uid + " AND B.facilities_type='0') as N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers"+
        " order by  Odd_Numbers desc";
    let select_sql1 = "select Q.id, Q.Odd_Numbers,Q.PassagewayID facilitiesid,Q.PassagewayName facilitiesname,Q.PassagewayNum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,facilities_type,P.StepID,Log_id " +
        " from tbl_Schedule as P right JOIN (" +
        " select N.id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,branch,submitter,Reporting_time,facilities_type,Log_id from branch as M right JOIN (" +
        " select id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,submitter,Reporting_time,facilities_type,Log_id from tbl_passageway_info as A RIGHT JOIN(" +
        " select id, Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type,Log_id from tbl_disease_baseinfo) AS B" +
        " on A.PassagewayID=B.bridge_id" +
        " where curingid=" + data.uid + " AND B.facilities_type='1') AS N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers" +
        " order by  Odd_Numbers desc";
    console.log(select_sql);
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);
        result = result.sort(compare('id',false))
        res.send(result);
        console.log(result);
    } catch (e) {
        console.log(`select err` + e)
    }
    function compare(property, desc) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            if (desc == true) {
                return value1 - value2;
            } else {
                return value2 - value1;
            }
        }
    }

});
/* ---------------------------------------------------------------------------- */
//养护流程app查询
router.get('/select_maintain_app', async function (req, res) { //WHERE P.Odd_Numbers IS NULL
    let data = req.query;
    console.log(data);
    let select_sql = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,facilities_type,P.StepID,Log_id " +
        " from tbl_Schedule as P right join (" +
        " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time,facilities_type,Log_id from branch as M right join (" +
        " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type,Log_id from tbl_bridge_info as A RIGHT join(" +
        " select id, Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type,Log_id from tbl_disease_baseinfo) as B" +
        " on A.BridgeID=B.bridge_id" +
        " where curingid=" + data.uid + " AND B.facilities_type='0') as N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers"+
        " where P.StepID=1 " +
        " order by  Odd_Numbers desc";
    let select_sql1 = "select Q.id, Q.Odd_Numbers,Q.PassagewayID facilitiesid,Q.PassagewayName facilitiesname,Q.PassagewayNum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,facilities_type,P.StepID,Log_id " +
        " from tbl_Schedule as P right JOIN (" +
        " select N.id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,branch,submitter,Reporting_time,facilities_type,Log_id from branch as M right JOIN (" +
        " select id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,submitter,Reporting_time,facilities_type,Log_id from tbl_passageway_info as A RIGHT JOIN(" +
        " select id, Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type,Log_id from tbl_disease_baseinfo) AS B" +
        " on A.PassagewayID=B.bridge_id" +
        " where curingid=" + data.uid + " AND B.facilities_type='1') AS N" +
        " on M.id=N.branch_id) Q" +
        " on P.Odd_Numbers=Q.Odd_Numbers" +
        " where P.StepID=1 " +
        " order by  Odd_Numbers desc";
    console.log(select_sql);
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);
        result = result.sort(compare('id',false))
        res.send(result);
        console.log(result);
    } catch (e) {
        console.log(`select err` + e)
    }
    function compare(property, desc) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            if (desc == true) {
                return value1 - value2;
            } else {
                return value2 - value1;
            }
        }
    }

});
//未上报病害
router.get('/select_maintain_unReport', async function (req, res) { //WHERE P.Odd_Numbers IS NULL
  let data = req.query;
  console.log(data);
  let select_sql = "select Q.id, Q.Odd_Numbers,Q.bridgeid facilitiesid,Q.bridgename facilitiesname,Q.bridgenum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,facilities_type,P.StepID,Log_id " +
    " from tbl_Schedule as P right join (" +
    " select N.id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,branch,submitter,Reporting_time,facilities_type,Log_id from branch as M right join (" +
    " select id, Odd_Numbers,bridgeid,bridgename,bridgenum,branch_id,submitter,Reporting_time,facilities_type,Log_id from tbl_bridge_info as A RIGHT join(" +
    " select id, Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type,Log_id from tbl_disease_baseinfo) as B" +
    " on A.BridgeID=B.bridge_id" +
    " where curingid=" + data.uid + " AND B.facilities_type='0') as N" +
    " on M.id=N.branch_id) Q" +
    " on P.Odd_Numbers=Q.Odd_Numbers" +
    " WHERE P.Odd_Numbers IS NULL";
  let select_sql1 = "select Q.id, Q.Odd_Numbers,Q.PassagewayID facilitiesid,Q.PassagewayName facilitiesname,Q.PassagewayNum facilitiesnum,Q.branch_id,Q.branch,Q.submitter,Q.Reporting_time,facilities_type,P.StepID,Log_id " +
    " from tbl_Schedule as P right JOIN (" +
    " select N.id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,branch,submitter,Reporting_time,facilities_type,Log_id from branch as M right JOIN (" +
    " select id, Odd_Numbers,PassagewayID,PassagewayName,PassagewayNum,branch_id,submitter,Reporting_time,facilities_type,Log_id from tbl_passageway_info as A RIGHT JOIN(" +
    " select id, Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,facilities_type,Log_id from tbl_disease_baseinfo) AS B" +
    " on A.PassagewayID=B.bridge_id" +
    " where curingid=" + data.uid + " AND B.facilities_type='1') AS N" +
    " on M.id=N.branch_id) Q" +
    " on P.Odd_Numbers=Q.Odd_Numbers" +
    " WHERE P.Odd_Numbers IS NULL";
  console.log(select_sql);
  try {
    result = await query(select_sql);
    result1 = await query(select_sql1);
    result = result.concat(result1);
    res.send(result);
    console.log(result);
  } catch (e) {
    console.log(`select err` + e)
  }

});

//删除上报流程
router.get('/delete_process', async function (req, res) {
    let data = req.query;
    let delete_sql = "delete from tbl_disease_baseinfo where id=" + data.id + "";
    try {
        result = await query(delete_sql);
    } catch (e) {
        res.json(0)
    }
    res.json(1);
});

//养护计划查询(当前登录管理员的用户id)
router.get('/select_curing_maintain', async function (req, res) {
    let data = req.query;
    console.log(data);
    let select_sql = "select facilities_type,BridgeNum facilitiesnum,BridgeName facilitiesname,BridgeID facilitiesid,plan_name,Inspection_cycle,Patrol_num,branch_id,branch from(" +
        " select facilities_type,BridgeNum,BridgeName,BridgeID,plan_name,Inspection_cycle,Patrol_num,branch_id from tbl_bridge_info as A left outer join (" +
        " select * from Maintenance_plan WHERE facilities_type='0') as B" +
        " on A.BridgeID=B.bridge_id" +
        " where A.BridgeID in (select BridgeID from tbl_bridge_info where curingid = " + data.uid + ")) as M left join branch N" +
        " on M.branch_id=N.id" +
        " where branch is not null";

    let select_sql1 = "select facilities_type,PassagewayNum facilitiesnum,PassagewayName facilitiesname,PassagewayID facilitiesid,plan_name,Inspection_cycle,Patrol_num,branch_id,branch from(" +
        " select facilities_type,PassagewayNum,PassagewayName,PassagewayID,plan_name,Inspection_cycle,Patrol_num,branch_id from tbl_passageway_info as A left outer join (" +
        " select * from Maintenance_plan WHERE facilities_type='1') as B" +
        " on A.PassagewayID=B.bridge_id" +
        " where A.PassagewayID in (select PassagewayID from tbl_passageway_info where curingid = " + data.uid + ")) as M left join branch N" +
        " on M.branch_id=N.id" +
        " where branch is not null";
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//养护计划查询(当前登录管理员的用户id)
router.get('/select_curing_play', async function (req, res) {
    let data = req.query;
    if (data.power == '0') {
        sql = '';
    } else {
        sql = " where manageid=" + data.uid + "";
    };
    let select_sql = "select '0' facilities_type,BridgeNum facilitiesnum,BridgeName facilitiesname,BridgeID facilitiesid,plan_name,Inspection_cycle,Patrol_num,branch_id,branch from(" +
        " select facilities_type,BridgeNum,BridgeName,BridgeID,plan_name,Inspection_cycle,Patrol_num,branch_id from tbl_bridge_info as A left outer join (" +
        " select * from Maintenance_plan where facilities_type='0') as B" +
        " on A.BridgeID=B.bridge_id" +
        " where A.BridgeID in (select BridgeID from tbl_bridge_info  " + sql + ")) as M left join branch N" +
        " on M.branch_id=N.id";
    console.log(select_sql);
    let select_sql1 = "select '1' facilities_type,PassagewayNum facilitiesnum,PassagewayName facilitiesname,PassagewayID facilitiesid,plan_name,Inspection_cycle,Patrol_num,branch_id,branch from(" +
        " select facilities_type,PassagewayNum,PassagewayName,PassagewayID,plan_name,Inspection_cycle,Patrol_num,branch_id from tbl_passageway_info as A left outer join (" +
        " select * from Maintenance_plan where facilities_type='1') as B" +
        " on A.PassagewayID=B.bridge_id" +
        " where A.PassagewayID in (select PassagewayID from tbl_passageway_info " + sql + ")) as M left join branch N" +
        " on M.branch_id=N.id";
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});


//养护计划添加/更新
//养护计划添加/更新
router.post('/insert_curing_play', async function (req, res) {
    let data = req.body;
    console.log(data)
    let select_sql = "select id from Maintenance_plan where bridge_id=" + data.facilitiesid + " and facilities_type='" + data.facilities_type + "'";
    console.log(select_sql)
    result = await query(select_sql);
    console.log(result)
    if (result.length > 0) {
        let update_sql = "update Maintenance_plan set plan_name='" + data.plan_name + "',Patrol_num=" +
            " " + data.Patrol_num + " where bridge_id=" + data.facilitiesid + " and facilities_type='" + data.facilities_type + "'";
        console.log(update_sql)
        try {
            result = await query(update_sql);
        } catch (e) {
            res.json(0)
        }
    } else {
        let insert_sql = "insert into Maintenance_plan (bridge_id,plan_name,Inspection_cycle,Patrol_num,branch_id,facilities_type) values(" + data.facilitiesid + "," +
            " '" + data.plan_name + "','month'," + data.Patrol_num + "," + data.branch_id + ",'" + data.facilities_type + "')";
        console.log(insert_sql)
        try {
            result = await query(insert_sql);
        } catch (e) {
            res.json(0)
        }
    }
    res.json(1)
});
//病害详情

router.get('/select_Report', async function (req, res) {
    let data = req.query;
    let select_sql;
    let select_sql1;
    if (data.power == '0') {
        select_sql = "select facilities_type,N.id,Odd_Numbers,bridge_id,bridgename facilitiesname,branch_id,BridgeRoad facilitiesroad,branch,submitter,Reporting_time,Other from branch as M right join (" +
            " select facilities_type,B.id,Odd_Numbers,bridge_id,bridgename,branch_id,submitter,BridgeRoad,Reporting_time,Other from tbl_bridge_info as A right join (" +
            " select facilities_type,id,Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,Other" +
            " from tbl_disease_baseinfo WHERE facilities_type='0') as B" +
            " ON A.BridgeID=B.bridge_id" +
            " where id=" + data.id + ") as N" +
            " ON M.id=N.branch_id";
        select_sql1 = "select facilities_type,N.id,Odd_Numbers,bridge_id,PassagewayName facilitiesname,branch_id,PassagewayRoad facilitiesroad,branch,submitter,Reporting_time,Other from branch as M right JOIN (" +
            " select facilities_type,B.id,Odd_Numbers,bridge_id,PassagewayName,branch_id,submitter,PassagewayRoad,Reporting_time,Other from tbl_passageway_info as A right JOIN (" +
            " select facilities_type,id,Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,Other" +
            " from tbl_disease_baseinfo WHERE facilities_type='1') AS B" +
            " ON A.PassagewayID=B.bridge_id" +
            " where id=" + data.id + ") AS N" +
            " ON M.id=N.branch_id";
    } else {
        select_sql = "select facilities_type,N.id,Odd_Numbers,bridge_id,bridgename facilitiesname,branch_id,BridgeRoad facilitiesroad,branch,submitter,Reporting_time,Other from branch as M right join (" +
            " select facilities_type,B.id,Odd_Numbers,bridge_id,bridgename,branch_id,submitter,BridgeRoad,Reporting_time,Other from tbl_bridge_info as A right join (" +
            " select facilities_type,id,Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,Other" +
            " from tbl_disease_baseinfo WHERE facilities_type='0') as B" +
            " ON A.BridgeID=B.bridge_id" +
            " where manageid=" + data.uid + " and id=" + data.id + ") as N" +
            " ON M.id=N.branch_id";
        select_sql1 = "select facilities_type,N.id,Odd_Numbers,bridge_id,PassagewayName facilitiesname,branch_id,PassagewayRoad facilitiesroad,branch,submitter,Reporting_time,Other from branch as M right JOIN (" +
            " select facilities_type,B.id,Odd_Numbers,bridge_id,PassagewayName,branch_id,submitter,PassagewayRoad,Reporting_time,Other from tbl_passageway_info as A right JOIN (" +
            " select facilities_type,id,Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,Other" +
            " from tbl_disease_baseinfo WHERE facilities_type='1') AS B" +
            " ON A.PassagewayID=B.bridge_id" +
            " where manageid=" + data.uid + " and id=" + data.id + ") AS N" +
            " ON M.id=N.branch_id";
    };

    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

router.get('/select_ReportDis', async function (req, res) {
    let data = req.query;
    console.log(data)
    let select_sql = "select facilities_type,N.id,Odd_Numbers,bridge_id,bridgename facilitiesname,branch_id,BridgeRoad facilitiesroad,branch,submitter,Reporting_time,Other from branch as M right join (" +
        " select facilities_type,B.id,Odd_Numbers,bridge_id,bridgename,branch_id,submitter,BridgeRoad,Reporting_time,Other from tbl_bridge_info as A right join (" +
        " select facilities_type,id,Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,Other" +
        " from tbl_disease_baseinfo WHERE facilities_type='0') as B" +
        " ON A.BridgeID=B.bridge_id" +
        " where curingid=" + data.uid + " and id=" + data.id + ") as N" +
        " ON M.id=N.branch_id";
    let select_sql1 = "select facilities_type,N.id,Odd_Numbers,bridge_id,PassagewayName facilitiesname,branch_id,PassagewayRoad facilitiesroad,branch,submitter,Reporting_time,Other from branch as M right JOIN (" +
        " select facilities_type,B.id,Odd_Numbers,bridge_id,PassagewayName,branch_id,submitter,PassagewayRoad,Reporting_time,Other from tbl_passageway_info as A right JOIN (" +
        " select facilities_type,id,Odd_Numbers,bridge_id,branch_id,submitter,Reporting_time,Other" +
        " from tbl_disease_baseinfo WHERE facilities_type='1') AS B" +
        " ON A.PassagewayID=B.bridge_id" +
        " where curingid=" + data.uid +" and id=" + data.id + ") AS N" +
        " ON M.id=N.branch_id";

    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});




//查计划

router.get('/select_plan', async function (req, res) {
    let data = req.query;
    let select_sql = "select plan_name,id from Maintenance_plan where branch_id=" + data.branch_id + "";
    console.log(select_sql);
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});


//病害查询
router.get('/select_diseases', async function (req, res) {
    let data = req.query;
    console.log('disease 111111');
    let select_sql = "select id,disease_name,unit,Solution_Tips from tbl_disease where userid=" + data.uid + " and type = 1";
    console.log(select_sql);
    try {
        result = await query(select_sql);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//病害添加
router.post('/add_disease', async function (req, res) {
    let data = req.body;
    console.log(data);
    let insert_sql = "insert into tbl_disease_Restoration (project_id,disease_curing_id,Reported_quantity" +
        "," + "Declared_quantity,Audit_quantity,Distribution_quantity,MaterialID) values(" + data.id + "," + data.disease_name + "," +
        " '" + data.Reported_quantity + "','','" + data.Audit_quantity + "'," +
        " ''," + data.MaterialID + ")";
    try {
        result = await query(insert_sql);
    }
    catch (e) {
        res.json(0)
    }
    res.json(1);
});
// 查最大病害id
router.get('/select_pid',async function(req,res){
    let sql="select max(id) pid from tbl_disease_Restoration";
    try {
        let result = await query(sql);
        res.json(result);
    }catch (e) {
        console.log('get data err'+e)
    }
})
//病害添加
router.post('/add_disease_app', async function (req, res) {
  let data = req.body;
  console.log(data);
  let insert_sql = "insert into tbl_disease_Restoration (project_id,disease_curing_id,Reported_quantity" +
    "," + "Declared_quantity,Audit_quantity,Distribution_quantity,MaterialID,longitude,latitude,disPosition,structure) values(" + data.id + "," + data.disease_name + "," +
    " '" + data.Reported_quantity + "','','" + data.Audit_quantity + "'," +
    " ''," + data.MaterialID + ",'"+data.longitude+"','"+data.latitude+"','"+data.disPosition+"','"+data.structure+"')";
  console.log(insert_sql);
  try {
    result = await query(insert_sql);
  }
  catch (e) {
    res.json(0)
  }
  res.json(1);
});




//病害上报
router.post('/insert_disease', async function (req, res) {
    let data = req.body;
    console.log('22222222222222222222222')
    console.log(data);
    let date = require("silly-datetime");
    let today = date.format(new Date(), 'YYMMDD');
    let select_sql = "select count(*) as count from tbl_disease_baseinfo where left(Odd_Numbers,6)=" + today + "";
    console.log(select_sql);
    result = await query(select_sql);
    console.log(result);
    num = (result[0].count) + 1;
    if (num <= 9) {
        Odd_Numbers = today + '0000' + num;
    } else {
        Odd_Numbers = today + '000' + num;
    }
    insert_sql = "update tbl_disease_baseinfo set Odd_Numbers='" + Odd_Numbers + "',Reporting_time='" + data.Reporting_time + "',Other='" + data.Other + "' where id = " + data.id + "";
    console.log(insert_sql)
    insert_sql1 = "insert into tbl_work_order (branch_id,project_Leader,problem_source,time_limit,engineering_properties,Processing_requirements," +
        " Commission_member,send_time,Odd_Numbers) values(" + data.branch_id + ",'','','','','','','','" + Odd_Numbers + "')";
    console.log(insert_sql1);
    insert_sql2 = "insert into tbl_Schedule (Odd_Numbers,StepID) values('" + Odd_Numbers + "',0)";
    console.log(insert_sql2);
    try {
        result1 = await query(insert_sql);
        result2 = await query(insert_sql1);
        result3 = await query(insert_sql2);
        res.json(1);
    } catch (e) {
        console.log(e);
        res.json(0)
    }

});
//查工单信息
router.get('/select_WorkOrder', async function (req, res) {
    let sql = `select project_Leader,problem_source,time_limit,engineering_properties,Processing_requirements,Commission_member,send_time from mmp.tbl_work_order  where Odd_Numbers='${req.query.Odd_Numbers}'`;

    try {
        let result = await query(sql);
        res.json(result);
    } catch (e) {
        res.json(0);
    }
})
//工单派发
router.post('/insert_WorkOrder', async function (req, res) {
    let data = req.body;
    let send_time = get_date_str(new Date());
    console.log(data);
    let update_sql = "update tbl_work_order set project_Leader='" + data.project_Leader + "',problem_source='" + data.problem_source + "'," +
        " time_limit='" + data.time_limit + "',engineering_properties='" + data.engineering_properties + "'," +
        " Processing_requirements='" + data.Processing_requirements + "',Commission_member='" + data.Commission_member + "'," +
        " send_time='" + send_time + "' " +
        " where Odd_Numbers='" + data.Odd_Numbers + "'";
    let insert_sql = "insert into tbl_Completion_declaration (Disease_description,Completion_time,Cost,Remarks,submitter,Reporting_time,Odd_Numbers)" +
        " values('','','','','','','" + data.Odd_Numbers + "')";
    let update_sql1 = "update tbl_Schedule set StepID=1 where Odd_Numbers='" + data.Odd_Numbers + "'";
    try {
        result1 = await query(update_sql);
        result2 = await query(insert_sql);
        result3 = await query(update_sql1);
    } catch (e) {
        res.json(0)
    }
    res.json(1);
    function get_date_str(Date) {
        var Y = Date.getFullYear();
        var M = Date.getMonth() + 1;
        M = M < 10 ? '0' + M : M; // ??????0
        var D = Date.getDate();
        D = D < 10 ? '0' + D : D;
        var H = Date.getHours();
        H = H < 10 ? '0' + H : H;
        var Mi = Date.getMinutes();
        Mi = Mi < 10 ? '0' + Mi : Mi;
        var S = Date.getSeconds();
        S = S < 10 ? '0' + S : S;
        return Y + '-' + M + '-' + D + ' ' + H + ':' + Mi + ':' + S;
    }
});
//竣工申报
router.post('/insert_finished', async function (req, res) {
    let data = req.body;
    console.log(data);
    let update_sql = "update tbl_Completion_declaration set Completion_time='" + data.Completion_time + "'," +
        " Cost='" + data.Cost + "',Remarks='" + data.Remarks + "',submitter='" + data.submitter + "',Reporting_time='" + data.Reporting_time + "'" +
        " where Odd_Numbers='" + data.Odd_Numbers + "'";
        console.log(update_sql)
    let insert_sql = "insert into tbl_Check (Disease_description,Cost,quality,Opinion,manage_Sign,manage_Sign_time,curing_Sign,curing_Sign_time,Odd_Numbers)" +
        " values('','','','','','','','','" + data.Odd_Numbers + "')";
        console.log(insert_sql)
    let update_sql1 = "update tbl_Schedule set StepID=2 where Odd_Numbers='" + data.Odd_Numbers + "'";
    console.log(update_sql1)
    try {
        result1 = await query(update_sql);
        result2 = await query(insert_sql);
        result3 = await query(update_sql1);
    }
    catch (e) {
        res.json(0)
    }
    res.json(1);
});


//验收确认查表
router.get('/select_confirm', async function (req, res) {
    let sql = `select quality,manage_Sign,manage_Sign_time,curing_Sign,curing_Sign_time,Cost,Opinion from mmp.tbl_Check where Odd_Numbers='${req.query.Odd_Numbers}'`;
    try {
        let result = await query(sql);
        res.json(result);
    } catch (e) {
        res.json(0);
    }
})
//验收确认
router.post('/insert_Check', async function (req, res) {
    let data = req.body;
    console.log(data);
    let update_sql = "update tbl_Check set Cost='" + data.Cost + "',quality='" + data.quality + "'," +
        " Opinion='" + data.Opinion + "',manage_Sign='" + data.manage_Sign + "',manage_Sign_time='" + data.manage_Sign_time + "',curing_Sign='" + data.curing_Sign + "'," +
        " curing_Sign_time='" + data.curing_Sign_time + "'" +
        " where Odd_Numbers='" + data.Odd_Numbers + "'";
    console.log(update_sql);
    let update_sql1 = "update tbl_Schedule set StepID=3 where Odd_Numbers='" + data.Odd_Numbers + "'";
    console.log(update_sql1);
    try {
        result = await query(update_sql);
        result1 = await query(update_sql1);
    } catch (e) {
        res.json(0)
    }
    res.json(1);
});

//查竣工申报
router.get('/complete', async function (req, res) {
    let sql = `select Completion_time,Cost,submitter,Reporting_time,Remarks from mmp.tbl_Completion_declaration where Odd_Numbers='${req.query.Odd_Numbers}'`;
    console.log(sql);
    try {
        let result = await query(sql);
        res.json(result);
    } catch (e) {
        res.json(0);
    }
})
//查询工程量清单
router.get('/select_list', async function (req, res) {
    let data = req.query;
    console.log(data);
    let select_sql = "select D.id, project,Unit_Price,Features,D.unit,disease_curing_id,material,Reported_quantity,Audit_quantity,declare_num,Check_num,disease_name " +
        " from tbl_disease as S right join (" +
        " select Q.id, project,Unit_Price,Features,unit,disease_curing_id,material,Reported_quantity,Audit_quantity,declare_num,Check_num " +
        " from tbl_Maintenance_Project as P right join(" +
        " select M.id, pro_id,declare_num,Check_num,disease_curing_id,material,Reported_quantity,Audit_quantity " +
        " from tbl_disease_list as M right join(" +
        " select disease_curing_id,material,Reported_quantity,Audit_quantity from tbl_Unit_Price as A right join (" +
        " select disease_curing_id,MaterialID,Reported_quantity,Audit_quantity from tbl_disease_Restoration" +
        " where project_id = " + data.id + ") as B" +
        " on A.MaterialID=B.MaterialID) as N " +
        " on M.disease_id=N.disease_curing_id" +
        " where projects_id = " + data.id + ") as Q" +
        " on P.id=Q.pro_id) as D" +
        " ON S.id=D.disease_curing_id where S.type=1 group by D.id";
    console.log(select_sql);
    try {
        result = await query(select_sql);
        console.log(result);
    }
    catch (e) {

        console.log(`select err` + e)
    }
    res.send(result);
});

//新增需要传给前端的数据(病害名，病害id，板厚，上报数量，材质)
router.get('/select_data', async function (req, res) {
    let data = req.query;
    console.log(data);
    let select_sql = "select disease_curing_id,disease_name,Plate_thickness,Reported_quantity,Material from tbl_Unit_Price as M right join (" +
        " select disease_curing_id,disease_name,Plate_thickness,Reported_quantity,MaterialID from tbl_disease as A right join(" +
        " select disease_curing_id,Reported_quantity,MaterialID from tbl_disease_Restoration" +
        " where project_id=" + data.id + ") as B" +
        " on A.id=B.disease_curing_id" +
        " where A.type=1) as N" +
        " on M.MaterialID=N.MaterialID";
    try {
        result = await query(select_sql);
        console.log(result)
    }
    catch (e) {

        console.log(`select err` + e)
    }
    res.send(result);
});

//新增需要传给前端的数据(养护项目，单价，项目特征，单位)
router.get('/select_date_1', async function (req, res) {
    let data = req.query;
    console.log(data)
    let select_sql = "select id,project,Features,unit,Unit_Price from tbl_Maintenance_Project where dis_id="+ data.dis_id +"";
    console.log(select_sql)
    try {
        result = await query(select_sql);
    }
    catch (e) {

        console.log(`select err` + e)
    }
    res.send(result);
});

//新增工程量清单
router.post('/insert_list', async function (req, res) {
    let data = req.body.data;
    console.log(data);
    for (let i=0;i< data.length;i++){
        let insert_sql = "insert into tbl_disease_list (projects_id,disease_id,pro_id,declare_num,Check_num) values(" + data[i].id + "," +
            " " + data[i].disease_name + "," + data[i].project + ",'" + data[i].declare_num + "','" + data[i].Check_num + "')";
        try {
            result = await query(insert_sql);
        }
        catch (e) {
            res.json(0);
        }
    }
    res.json(1);
});

//修改工程量清单
router.get('/update_date', async function (req, res) {
    let data = req.query;
    let update_sql = "update tbl_disease_list set disease_id=" + data.disease_id + ",pro_id=" + data.pro_id + "," +
        " declare_num=" + data.declare_num + ",Check_num=" + data.Audit_quantity + " where id=" + data.id + "";
    try {
        result = await query(update_sql);
    }
    catch (e) {
        res.json(0);
    }
    res.send(1);
});
//删除工程量清单
router.get('/delete_date', async function (req, res) {
    let data = req.query;
    let delete_sql = "delete from tbl_disease_list where id=" + data.id + "";
    try {
        result = await query(delete_sql);
        res.json(1);
    }
    catch (e) {
        res.json(0);
    }

});

//查询流程进度（到哪一步）
router.get('/select_Schedule', async function (req, res) {
    let data = req.query;
    let select_sql = "select StepID from tbl_Schedule where Odd_Numbers='" + data.Odd_Numbers + "'";
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
//查完成时限和处置要求
router.get('/select_require', async function (req, res) {
    let data = req.query;
    let select_sql = "select time_limit,Processing_requirements  from tbl_work_order where Odd_Numbers='" + data.Odd_Numbers + "'";
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//查单项病害详情
router.get('/select_item', async function (req, res) {
    let data = req.query;
    let select_sql = "select * from tbl_work_order where Odd_Numbers='" + data.Odd_Numbers + "'";
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//对应病害详情查询（id=病害基础信息自增id）
router.get('/select_disease', async function (req, res) {
    let data = req.query;
    console.log(data)
    let select_sql = "SELECT disPosition,structure,N.disId,disease_name,N.id,unit,N.MaterialID,Material,Solution_Tips,Reported_quantity,Declared_quantity," +
        " Audit_quantity,Distribution_quantity from tbl_Unit_Price as M right JOIN( " +
        " SELECT disPosition,structure,A.id disId,B.id, A.disease_name,A.unit,B.MaterialID,A.Solution_Tips,B.Reported_quantity,B.Declared_quantity,B.Audit_quantity,B.Distribution_quantity " +
        " from tbl_disease as A left JOIN " +
        " (select * from tbl_disease_Restoration) AS B " +
        " on A.id=B.disease_curing_id " +
        " where project_id=" + data.id + " and A.type=1) AS N " +
        " ON M.MaterialID=N.MaterialID";
    try {
        result = await query(select_sql);
        console.log(result);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//对应病害详情插入（id=病害基础信息自增id）
router.get('/insert_disease_details', async function (req, res) {
    let data = req.query;
    let insert_sql = "insert into tbl_disease_Restoration (project_id,disease_curing_id,Reported_quantity," +
        " Declared_quantity,Audit_quantity,Distribution_quantity)" +
        " values(" + data.project_id + "," + data.disease_curing_id + ",'" + data.Reported_quantity + "'," +
        " '','" + data.Audit_quantity + "','')";
});
//查询日常巡查报表
//查询日常巡查报表
router.get('/select_Daily_inspection', async function (req, res) {
    let data = req.query;
    console.log(data)
    let arr = [];
    let arr2 = [];
    if (data.facilities_type == '0') {
        select = "SELECT id FROM tbl_daily_inspection" +
            " WHERE task_id=" + data.id + "" +
            " AND facilities_type='0'";
        result = await query(select);
        console.log(result);
        for (let i of result) {
            arr.push(i.id)
        }
        arr = arr.toString();

        let select_sql1 = "select bridgename,branch,Bridge_brand,Limit_height_load,Roadway,Sidewalk,expansion_joint,Railing,Drainage_facilities," +
            "Bridge_connection,Superstructure,Bearing,Substructure,Whether_construction,other_disease," +
            " Inspecting_Officer,Inspection_date from branch as M right join (" +
            " select bridgename,branch_id,Bridge_brand,Limit_height_load,Roadway,Sidewalk,expansion_joint,Railing,Drainage_facilities," +
            " Bridge_connection,Superstructure,Bearing,Substructure,Whether_construction,other_disease," +
            " Inspecting_Officer,Inspection_date from tbl_bridge_info as A right join (" +
            " select bridge_id,branch_id,Bridge_brand,Limit_height_load,Roadway,Sidewalk,expansion_joint,Railing,Drainage_facilities," +
            " Bridge_connection,Superstructure,Bearing,Substructure,Whether_construction,other_disease," +
            " Inspecting_Officer,Inspection_date from tbl_daily_inspection where id in (" + arr + ") and facilities_type='0') as B" +
            " on A.BridgeID=B.bridge_id) as N" +
            " on M.id=N.branch_id";
        console.log(select_sql1)
        result1 = await query(select_sql1);
        for (let i of result1) {
            let obj = new Object();
            obj.Bridge_brand = i.Bridge_brand.split('#');
            obj.Limit_height_load = i.Limit_height_load.split('#');
            obj.Roadway = i.Roadway.split('#');
            obj.Sidewalk = i.Sidewalk.split('#');
            obj.expansion_joint = i.expansion_joint.split('#');
            obj.Railing = i.Railing.split('#');
            obj.Drainage_facilities = i.Drainage_facilities.split('#');
            obj.Bridge_connection = i.Bridge_connection.split('#');
            obj.Superstructure = i.Superstructure.split('#');
            obj.Bearing = i.Bearing.split('#');
            obj.Substructure = i.Substructure.split('#');
            obj.Whether_construction = i.Whether_construction;
            obj.other_disease = i.other_disease;
            obj.Inspecting_Officer = i.Inspecting_Officer;
            obj.Inspection_date = i.Inspection_date;
            obj.bridgename = i.bridgename;
            obj.branch = i.branch;
            arr2.push(obj)
        }
        console.log(arr2)
        res.send(arr2);
    }
    else {
        select = "SELECT id FROM tbl_daily_inspection" +
            " WHERE task_id=" + data.id + "" +
            " AND facilities_type='1'";
        result = await query(select);
        console.log(result);
        for (let i of result) {
            arr.push(i.id)

        }
        arr = arr.toString();
        let select_sqls = "select PassagewayName,branch,Bridge_brand,Limit_height_load,Roadway,Sidewalk,expansion_joint,Railing,Drainage_facilities," +
            " Bridge_connection,Superstructure,Bearing,Substructure,Whether_construction,other_disease," +
            " Inspecting_Officer,Inspection_date from branch as M right JOIN (" +
            " select PassagewayName,branch_id,Bridge_brand,Limit_height_load,Roadway,Sidewalk,expansion_joint,Railing,Drainage_facilities," +
            " Bridge_connection,Superstructure,Bearing,Substructure,Whether_construction,other_disease," +
            " Inspecting_Officer,Inspection_date from tbl_passageway_info as A right JOIN (" +
            " select bridge_id,branch_id,Bridge_brand,Limit_height_load,Roadway,Sidewalk,expansion_joint,Railing,Drainage_facilities," +
            " Bridge_connection,Superstructure,Bearing,Substructure,Whether_construction,other_disease," +
            " Inspecting_Officer,Inspection_date from tbl_daily_inspection where id in (" + arr + ") and facilities_type='1') AS B" +
            " on A.PassagewayID=B.bridge_id) AS N" +
            " on M.id=N.branch_id";
        //console.log(select_sql1)
        results = await query(select_sqls);
        console.log(results);
        for (let i of results) {
            let obj = new Object();
            obj.Bridge_brand = i.Bridge_brand.split('#');
            obj.Limit_height_load = i.Limit_height_load.split('#');
            obj.Roadway = i.Roadway.split('#');
            obj.Sidewalk = i.Sidewalk.split('#');
            obj.expansion_joint = i.expansion_joint.split('#');
            obj.Railing = i.Railing.split('#');
            obj.Drainage_facilities = i.Drainage_facilities.split('#');
            obj.Bridge_connection = i.Bridge_connection.split('#');
            obj.Superstructure = i.Superstructure.split('#');
            obj.Bearing = i.Bearing.split('#');
            obj.Substructure = i.Substructure.split('#');
            obj.Whether_construction = i.Whether_construction;
            obj.other_disease = i.other_disease;
            obj.Inspecting_Officer = i.Inspecting_Officer;
            obj.Inspection_date = i.Inspection_date;
            obj.bridgename = i.bridgename;
            obj.branch = i.branch;
            arr2.push(obj)
        }

        console.log(arr2)
        res.send(arr2);
    }

});

/* //桥梁查询
router.get('/select_bridge', async function (req, res) {
    let data = req.query;
    let select_sql = "select bridgename,bridgeid from tbl_bridge_info where curingid=" + data.uid + "";
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
}); */



//养护端日常检测和流程同步显示
router.post('/insert_into', async function (req, res) {
    let data = req.body;
    console.log(data)
    let select_sql="select max(id) id from tbl_daily_inspection";
    resultmax = await query(select_sql);
    MaxId=resultmax[0].id+1;
    data.Bearing = JSON.parse(data.Bearing).join("#");
    data.Bridge_brand = JSON.parse(data.Bridge_brand).join("#");
    data.Bridge_connection = JSON.parse(data.Bridge_connection).join("#");
    data.Drainage_facilities = JSON.parse(data.Drainage_facilities).join("#");
    data.Limit_height_load = JSON.parse(data.Limit_height_load).join("#");
    data.Railing = JSON.parse(data.Railing).join("#");
    data.Roadway = JSON.parse(data.Roadway).join("#");
    data.Sidewalk = JSON.parse(data.Sidewalk).join("#");
    data.Superstructure = JSON.parse(data.Superstructure).join("#");
    data.Substructure = JSON.parse(data.Substructure).join("#");
    data.expansion_joint = JSON.parse(data.expansion_joint).join("#");
    console.log(data);
    let insert_sql = "CALL `insert_into`(" + data.BridgeName + ", '" + data.A_Signin_date + "','" + data.B_Signin_date + "'," + data.branch + "," +
        " '" + data.Inspecting_Officer + "','" + data.Bridge_brand + "','" + data.Limit_height_load + "','" + data.Roadway + "','" + data.Sidewalk + "'," +
        " '" + data.expansion_joint + "','" + data.Railing + "','" + data.Drainage_facilities + "','" + data.Bridge_connection + "','" + data.Superstructure + "'," +
        " '" + data.Bearing + "','" + data.Substructure + "','" + data.Whether_construction + "','" + data.other_disease + "','" + data.Inspection_date + "'," +
        " '" + data.weather + "','" + data.plan + "','" + data.Other + "','" + data.Reporting_time + "','" + data.facilities_type + "',"+MaxId+")";
    console.log(insert_sql);
    try {
        result = await query(insert_sql);
        res.json(1);
    } catch (e) {
        res.json(0);
        console.log(e);
    }

});
//养护端日常检测和流程同步显示
router.post('/insert_into_app', async function (req, res) {
    let data = req.body;
    console.log(data)
    let select_sql="select max(id) id from tbl_daily_inspection";
    resultmax = await query(select_sql);
    MaxId=resultmax[0].id+1;
    data.Bearing = data.Bearing.join("#");
    data.Bridge_brand = data.Bridge_brand.join("#");
    data.Bridge_connection = data.Bridge_connection.join("#");
    data.Drainage_facilities = data.Drainage_facilities.join("#");
    data.Limit_height_load = data.Limit_height_load.join("#");
    data.Railing = data.Railing.join("#");
    data.Roadway = data.Roadway.join("#");
    data.Sidewalk = data.Sidewalk.join("#");
    data.Superstructure = data.Superstructure.join("#");
    data.Substructure = data.Substructure.join("#");
    data.expansion_joint = data.expansion_joint.join("#");
    // console.log(data);
    let insert_sql = "CALL `insert_into`(" + data.BridgeName + ", '" + data.A_Signin_date + "','" + data.B_Signin_date + "'," + data.branch + "," +
        " '" + data.Inspecting_Officer + "','" + data.Bridge_brand + "','" + data.Limit_height_load + "','" + data.Roadway + "','" + data.Sidewalk + "'," +
        " '" + data.expansion_joint + "','" + data.Railing + "','" + data.Drainage_facilities + "','" + data.Bridge_connection + "','" + data.Superstructure + "'," +
        " '" + data.Bearing + "','" + data.Substructure + "','" + data.Whether_construction + "','" + data.other_disease + "','" + data.Inspection_date + "'," +
        " '" + data.weather + "','" + data.plan + "','" + data.Other + "','" + data.Reporting_time + "','" + data.facilities_type + "',"+MaxId+")";
    console.log(insert_sql);
    try {
        result = await query(insert_sql);
        res.json(1);
    } catch (e) {
        res.json(0);
        console.log(e);
    }

});

//设施查询
router.get('/select_bridge', async function (req, res) {
    let data = req.query;
    if (data.facilities_type == '0') {
        let select_sql = "select bridgename facilitiesname,bridgeid facilitiesid from tbl_bridge_info where curingid=" + data.uid + "";
        try {
            result = await query(select_sql);
        } catch (e) {
            console.log(`select err` + e)
        }
        res.send(result);
    }
    else {
        let select_sql = "select PassagewayName facilitiesname,PassagewayID facilitiesid from tbl_passageway_info where curingid=" + data.uid + "";
        try {
            result = await query(select_sql);
        } catch (e) {
            console.log(`select err` + e)
        }
        res.send(result);
    }
});



//日常巡查表插入
router.post('/insert_Daily_inspection', async function (req, res) {
    let data = req.post;
    let insert_sql = "insert into tbl_daily_inspection (bridge_id,branch_id,Bridge_brand,Limit_height_load,Roadway,Sidewalk," +
        " expansion_joint,Railing,Drainage_facilities,Bridge_connection,Superstructure,Bearing,Substructure," +
        " Whether_construction,other_disease,Inspecting_Officer,Inspection_date,weather,A_Signin_date,B_Signin_date,task_id) values(" + data.bridge_id + "," +
        " " + data.branch_id + ",'" + data.Bridge_brand + "','" + data.Limit_height_load + "','" + data.Roadway + "'," +
        " '" + data.Sidewalk + "','" + data.expansion_joint + "','" + data.Railing + "','" + data.Drainage_facilities + "'," +
        " '" + data.Bridge_connection + "','" + data.Superstructure + "','" + data.Bearing + "','" + data.Substructure + "'," +
        " '" + data.Whether_construction + "','" + data.other_disease + "','" + data.Inspecting_Officer + "'," +
        " '" + data.Inspection_date + "','" + data.weather + "','" + data.A_Signin_date + "','" + data.B_Signin_date + "','" + data.task_id + "')";
    try {
        result = await query(insert_sql);
    } catch (e) {
        res.json(0)
    }
    res.json(1);
});

router.get('/select_home_maintain', async function (req, res) {
    let data = req.query;
    let select_sql = "select Q.branch_id,P.BridgeName facilitiesname,P.BridgeNum facilitiesnum,Q.bridge_id facilitiesid,branch,Q.Patrol_num,Q.count,Q.id," +
        " Q.A_Signin_date,Q.B_Signin_date,Q.task_id,Q.Inspecting_Officer,Q.plan_name,facilities_type" +
        " from tbl_bridge_info as P right join (" +
        " select N.Patrol_num,N.count,N.id,N.bridge_id,branch,N.branch_id,N.Inspecting_Officer," +
        " N.A_Signin_date,N.B_Signin_date,N.task_id,N.plan_name,facilities_type " +
        " from branch as M right join (" +
        " select Patrol_num ,count(*) count,A.id,A.bridge_id,A.branch_id,A.Inspecting_Officer," +
        " A.A_Signin_date,A.B_Signin_date,A.task_id,plan_name,B.facilities_type " +
        " from tbl_daily_inspection as A left join Maintenance_plan as B" +
        " on A.bridge_id=B.bridge_id WHERE B.facilities_type='0' AND A.facilities_type='0'" +
        " group by DATE_FORMAT(Inspection_date,'%Y-%m'),bridge_id,A.task_id) as N " +
        " ON M.id=N.branch_id) as Q" +
        " ON P.BridgeID=Q.bridge_id" +
        " where P.curingid=" + data.uid + "" +
        " order by A_Signin_date desc"
    let select_sql1 = "select Q.branch_id,P.PassagewayName facilitiesname,P.PassagewayNum facilitiesnum,Q.bridge_id facilitiesid,branch,Q.Patrol_num,Q.count,Q.id," +
        " Q.A_Signin_date,Q.B_Signin_date,Q.task_id,Q.Inspecting_Officer,Q.plan_name,facilities_type" +
        " from tbl_passageway_info as P right join (" +
        " select N.Patrol_num,N.count,N.id,N.bridge_id,branch,N.branch_id,N.Inspecting_Officer," +
        " N.A_Signin_date,N.B_Signin_date,N.task_id,N.plan_name,facilities_type " +
        " from branch as M right join (" +
        " select Patrol_num ,count(*) count,A.id,A.bridge_id,A.branch_id,A.Inspecting_Officer," +
        " A.A_Signin_date,A.B_Signin_date,A.task_id,plan_name,B.facilities_type " +
        " from tbl_daily_inspection as A left join Maintenance_plan as B" +
        " on A.bridge_id=B.bridge_id WHERE B.facilities_type='1' AND A.facilities_type='1'" +
        " group by DATE_FORMAT(Inspection_date,'%Y-%m'),bridge_id,A.task_id) as N " +
        " ON M.id=N.branch_id) as Q" +
        " ON P.PassagewayID=Q.bridge_id" +
        " where P.curingid=" + data.uid + "" +
        " order by A_Signin_date desc"
    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);
        console.log(result);
    } catch (e) {
        console.log(`insert err` + e)
    }
    res.send(result);
});
//日常巡查首页展示
router.get('/select_home_page', async function (req, res) {
    let data = req.query;
    let select_sql;
    let select_sql1;
    if (data.power == '0') {
        select_sql = "select Q.branch_id,P.BridgeName facilitiesname,P.BridgeNum facilitiesnum,Q.bridge_id facilitiesid,branch,Q.Patrol_num,Q.count,Q.id," +
            " Q.A_Signin_date,Q.B_Signin_date,Q.task_id,Q.Inspecting_Officer,Q.plan_name,facilities_type" +
            " from tbl_bridge_info as P right join (" +
            " select N.Patrol_num,N.count,N.id,N.bridge_id,branch,N.branch_id,N.Inspecting_Officer," +
            " N.A_Signin_date,N.B_Signin_date,N.task_id,N.plan_name,facilities_type " +
            " from branch as M right join (" +
            " select Patrol_num ,count(*) count,A.id,A.bridge_id,A.branch_id,A.Inspecting_Officer," +
            " A.A_Signin_date,A.B_Signin_date,A.task_id,plan_name,B.facilities_type " +
            " from tbl_daily_inspection as A left join Maintenance_plan as B" +
            " on A.bridge_id=B.bridge_id WHERE B.facilities_type='0' AND A.facilities_type='0'" +
            " group by DATE_FORMAT(Inspection_date,'%Y-%m'),bridge_id,A.task_id) as N " +
            " ON M.id=N.branch_id) as Q" +
            " ON P.BridgeID=Q.bridge_id";
        select_sql1 = "select Q.branch_id,P.PassagewayName facilitiesname,P.PassagewayNum facilitiesnum,Q.bridge_id facilitiesid,branch,Q.Patrol_num,Q.count,Q.id," +
            " Q.A_Signin_date,Q.B_Signin_date,Q.task_id,Q.Inspecting_Officer,Q.plan_name,facilities_type" +
            " from tbl_passageway_info as P right join (" +
            " select N.Patrol_num,N.count,N.id,N.bridge_id,branch,N.branch_id,N.Inspecting_Officer," +
            " N.A_Signin_date,N.B_Signin_date,N.task_id,N.plan_name,facilities_type " +
            " from branch as M right join (" +
            " select Patrol_num ,count(*) count,A.id,A.bridge_id,A.branch_id,A.Inspecting_Officer," +
            " A.A_Signin_date,A.B_Signin_date,A.task_id,plan_name,B.facilities_type " +
            " from tbl_daily_inspection as A left join Maintenance_plan as B" +
            " on A.bridge_id=B.bridge_id WHERE B.facilities_type='1' AND A.facilities_type='1'" +
            " group by DATE_FORMAT(Inspection_date,'%Y-%m'),bridge_id,A.task_id) as N " +
            " ON M.id=N.branch_id) as Q" +
            " ON P.PassagewayID=Q.bridge_id";
    } else {
        select_sql = "select Q.branch_id,P.BridgeName facilitiesname,P.BridgeNum facilitiesnum,Q.bridge_id facilitiesid,branch,Q.Patrol_num,Q.count,Q.id," +
            " Q.A_Signin_date,Q.B_Signin_date,Q.task_id,Q.Inspecting_Officer,Q.plan_name,facilities_type" +
            " from tbl_bridge_info as P right join (" +
            " select N.Patrol_num,N.count,N.id,N.bridge_id,branch,N.branch_id,N.Inspecting_Officer," +
            " N.A_Signin_date,N.B_Signin_date,N.task_id,N.plan_name,facilities_type " +
            " from branch as M right join (" +
            " select Patrol_num ,count(*) count,A.id,A.bridge_id,A.branch_id,A.Inspecting_Officer," +
            " A.A_Signin_date,A.B_Signin_date,A.task_id,plan_name,B.facilities_type " +
            " from tbl_daily_inspection as A left join Maintenance_plan as B" +
            " on A.bridge_id=B.bridge_id WHERE B.facilities_type='0' AND A.facilities_type='0'" +
            " group by DATE_FORMAT(Inspection_date,'%Y-%m'),bridge_id,A.task_id) as N " +
            " ON M.id=N.branch_id) as Q" +
            " ON P.BridgeID=Q.bridge_id" +
            " where P.manageid=" + data.uid + "";
        select_sql1 = "select Q.branch_id,P.PassagewayName facilitiesname,P.PassagewayNum facilitiesnum,Q.bridge_id facilitiesid,branch,Q.Patrol_num,Q.count,Q.id," +
            " Q.A_Signin_date,Q.B_Signin_date,Q.task_id,Q.Inspecting_Officer,Q.plan_name,facilities_type" +
            " from tbl_passageway_info as P right join (" +
            " select N.Patrol_num,N.count,N.id,N.bridge_id,branch,N.branch_id,N.Inspecting_Officer," +
            " N.A_Signin_date,N.B_Signin_date,N.task_id,N.plan_name,facilities_type " +
            " from branch as M right join (" +
            " select Patrol_num ,count(*) count,A.id,A.bridge_id,A.branch_id,A.Inspecting_Officer," +
            " A.A_Signin_date,A.B_Signin_date,A.task_id,plan_name,B.facilities_type " +
            " from tbl_daily_inspection as A left join Maintenance_plan as B" +
            " on A.bridge_id=B.bridge_id WHERE B.facilities_type='1' AND A.facilities_type='1'" +
            " group by DATE_FORMAT(Inspection_date,'%Y-%m'),bridge_id,A.task_id) as N " +
            " ON M.id=N.branch_id) as Q" +
            " ON P.PassagewayID=Q.bridge_id" +
            " where P.manageid=" + data.uid + "";
    }

    try {
        result = await query(select_sql);
        result1 = await query(select_sql1);
        result = result.concat(result1);
        console.log(result);
    } catch (e) {
        console.log(`insert err` + e)
    }
    res.send(result);
});

//材质查询选择
router.get('/select_material', async function (req, res) {
    let data = req.query;
    console.log(data);
    let select_sql="select MaterialID,material from tbl_Unit_Price where disid="+ data.id +"";
    console.log(select_sql)
    try{
        result=await query(select_sql);
    }
    catch(e) {
        console.log(`select err` + e)
    }
    res.send(result);

});

//删除病害详情
router.get('/delete_Disease_details', async function (req, res) {
    let data = req.query;
    let delete_sql = "delete from tbl_disease_Restoration where id=" + data.id + "";
    try {
        result = await query(delete_sql);
    }
    catch (e) {
        res.json(0)
    }
    res.json(1);
});

//修改病害详情
router.post('/update_Disease_details', async function (req, res) {
    let data = req.body;
    let update_sql = "update tbl_disease_Restoration set MaterialID=" + data.MaterialID + " ," +
        " Reported_quantity=" + data.Reported_quantity + ",Audit_quantity=" + data.Audit_quantity + "" +
        " where id=" + data.id + "";
    try {
        result = await query(update_sql);
    }
    catch (e) {
        res.json(0)
    }
    res.json(1);
});

//查部门
router.get('/select_branchname_id', async function (req, res) {
    let data = req.query;
    let select_sql = "select id,branch from branch where id=" + data.branch_id + "";
    try {
        result = await query(select_sql);
    }
    catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, path.join(__dirname, '../static/photo'));
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let upload = multer({
    storage: storage,
    limits:{
        //限制文件数量
        files: 5
    }
});


//图片查看(病害上报/竣工申报)
router.get('/select_photo_app', async function (req, res) {
    let data = req.query;
    console.log(123);
    console.log(data);
    let select_sql = "select * from tbl_photo where baseinfo_id=" + data.baseinfo_id + " and photo_type='" + data.photo_type + "' and project_id="+ data.project_id +"";
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
//图片查看(病害上报/竣工申报)
router.get('/select_photo', async function (req, res) {
    let data = req.query;
    console.log(data)
    let select_sql = "select * from tbl_photo where baseinfo_id=" + data.baseinfo_id + " and photo_type='" + data.photo_type + "'";
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
//图片查看总体
router.get('/select_photo_total', async function (req, res) {
    let data = req.query;
    let select_sql = "select * from tbl_photo where baseinfo_id=" + data.baseinfo_id + "";
    try {
        result1 = await query(select_sql);
        res.json(result1);
    }
    catch (e) {
        console.log(`select err` + e)
    }

});
//图片上传
router.post('/insert_photo', upload.fields([{name:'file0',maxCount:1},{name:'file1',maxCount:1}]), async function (req, res) {
    let data = req.body;
    console.log('图片上传111')
    console.log(data);
    let file = req.files;
    let newArr = [];
    newArr.push(file.file0[0].filename);
    newArr.push(file.file1[0].filename);
    console.log(newArr);
    try {
        for (let item of newArr) {
            let insert_sql = "insert into tbl_photo (baseinfo_id,photo_name,photo_type,project_id) values(" + data.baseinfo_id + ",'" + item + "','" + data.photo_type + "',"+ data.project_id +")";
            result1 = await query(insert_sql);
        }
    } catch  (e) {
        console.log(e)
        res.json(0)
    }

    res.json(1)


});
//图片上传app
router.post('/insert_photo_app', upload.single('file'), async function (req, res) {
  let data = req.body;
  console.log(data)
  let file = req.file;
  console.log(file);
  //let insert_sql = "insert into tbl_photo (baseinfo_id,photo_name,photo_type) values(" + data.baseinfo_id + ",'" + file.filename + "','" + data.photo_type + "')";
 /* try {
    result1 = await query(insert_sql);
    res.json(1);
  }
  catch (e) {
    res.json(0)
  }*/
});


//新增
router.post('/insert_dis',async function(req,res){
    let data=req.body;
    console.log(111212);
    console.log(data);
    let pid=(data.pid)+1;
    let insert_sql
    if (data.type==1){
        insert_sql="insert into tbl_disease (disease_name,unit,Solution_Tips,Plate_thickness,classification,userid,parent_id,type,pid) " +
            " values('"+ data.disease_name +"','"+ data.unit +"','"+ data.Solution_Tips +"','"+ data.Plate_thickness +"','"+data.classification +"','"+ data.uid +"',"+ data.pid +",'"+data.type +"',"+ pid +")";
        console.log(insert_sql)
        let select_sql="select id from mmp.tbl_disease order by id desc limit 0,1";
        result1=await query(select_sql);
        let mid=result1[0].id + 1;
        console.log(mid)
        let insert_sql1="insert into tbl_Unit_Price (material,disid) values('"+ data.material +"',"+ mid +")";
        let resData = await query(insert_sql1)
    }
    else{
        insert_sql="insert into tbl_disease (disease_name,userid,parent_id,type,pid) " +
            " values('"+ data.disease_name +"','"+data.uid+"',"+ data.pid +",'"+data.type +"',"+ pid +")";
        console.log(insert_sql)
    }
    try{
        result=await query(insert_sql);
        res.json(1);
    }
    catch(e) {
        res.json(0)
    }
});
//删除
router.get('/delete_dis',async function(req,res){
    let data=req.query;
    let delete_sql="delete from tbl_disease where id="+ data.id +"";
    let delete_sql1="delete from tbl_Unit_Price where disid="+ data.id +"";
    try{
        result=await query(delete_sql);
        result1=await query(delete_sql1);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1);
});
//查询
router.get('/select_dis',async function(req,res){
    let data=req.query;
    let sql="select count(*) cont from tbl_disease where userid ="+data.uid;
    let response=await query(sql);
    console.log(response)
    if (response[0].cont === 0){
        await copyData(data.uid)
    }
    let sql2;
    let result;
    let resArr=[];
    if (data.uid !== 1) {
        sql2 = "select * from tbl_disease AS A LEFT JOIN tbl_Unit_Price As B ON A.id=B.disid where userid ="+data.uid;
        result=await query(sql2);
    }
    try{
        let rootArr=[];
        resArr.push(result[0]);
        rootArr.push(result[0]);
        func(rootArr,result);
        res.send(resArr)
    }
    catch(e) {
        console.log(`delete err` + e)
    }
    async function func(dataArr,result){
        for (let n=0;n<dataArr.length;n++){
            for (let j=0;j<result.length;j++){
                if (dataArr[n].pid==result[j].parent_id){
                    let Arr=[];
                    Arr.push(result[j]);
                    resArr.push(result[j]);
                    func(Arr,result);
                }
            }
        }
    }

});
//修改
router.post('/update_dis',async function(req,res){
    let data=req.body;
    console.log(data);
    let update_sql="update tbl_disease set disease_name='"+ data.disease_name +"',unit='"+ data.unit +"'," +
        " Solution_Tips='"+ data.Solution_Tips +"',Plate_thickness='"+ data.Plate_thickness +"',classification='"+ data.classification +"'" +
        " where id="+ data.id +"" +
        " and userid=" + data.userid;
    let update_sql1="update tbl_Unit_Price set material='"+ data.material +"'" +
                    " where MaterialID="+ data.MaterialID +"";
    try{
        result=await query(update_sql);
        result1=await query(update_sql1);
    }
    catch(e) {
        res.json(0)
    }
    res.json(1);
});
router.post('/insert_trajectory',async function(req,res){
  let data=req.body;
  console.log(data)
  let sql="insert into tbl_trajectory (longitude,latitude,time,facilitiesid,facilities_type) values('"+ data.longitude +"','"+ data.latitude +"','"+ data.time +"','"+ data.facilitiesid +"','" +data.facilities_type+"')";
  try {
    result = await query(sql);
  }
  catch(e) {
    res.json(0)
  }
  res.json(1);
});
router.get('/select_trajectory',async function(req,res){
  let data=req.query;
  let sql="select longitude,latitude from tbl_trajectory where facilitiesid='"+ data.facilitiesid +"' and time='"+ data.time +"'";
  try {
    result = await query(sql);
  } catch (e) {
    console.log(`select err` + e)
  }
  res.send(result);
});
router.post('/update_into',async function(req,res){
    let data=req.body;
    console.log(data)
    data.Bearing = JSON.parse(data.Bearing).join("#");
    data.Bridge_brand = JSON.parse(data.Bridge_brand).join("#");
    data.Bridge_connection = JSON.parse(data.Bridge_connection).join("#");
    data.Drainage_facilities = JSON.parse(data.Drainage_facilities).join("#");
    data.Limit_height_load = JSON.parse(data.Limit_height_load).join("#");
    data.Railing = JSON.parse(data.Railing).join("#");
    data.Roadway = JSON.parse(data.Roadway).join("#");
    data.Sidewalk = JSON.parse(data.Sidewalk).join("#");
    data.Superstructure = JSON.parse(data.Superstructure).join("#");
    data.Substructure = JSON.parse(data.Substructure).join("#");
    data.expansion_joint = JSON.parse(data.expansion_joint).join("#");
    let update="update tbl_daily_inspection set Bridge_brand='"+ data.Bridge_brand +"',Limit_height_load='"+ data.Limit_height_load +"',Roadway='"+ data.Roadway +"'," +
                " Sidewalk='"+ data.Sidewalk +"',expansion_joint='"+ data.expansion_joint +"',Railing='"+ data.Railing +"',Drainage_facilities='"+ data.Drainage_facilities +"'," +
                " Bridge_connection='"+ data.Bridge_connection +"',Superstructure='"+ data.Superstructure +"',Bearing='"+ data.Bearing +"',Substructure='"+ data.Substructure +"'," +
                " Whether_construction='"+ data.Whether_construction +"',other_disease='"+ data.other_disease +"' where id = "+ data.Log_id +"";
    try {
        result = await query(update);
        res.json(1);
    } catch (e) {
        res.json(0);
    }
});

router.post('/update_start_time',async function(req,res){
    let data=req.body;
    console.log(data)
    let update_sql="update tbl_daily_inspection set A_Signin_date='"+ data.start_time +"' where id="+ data.id +"";
    try {
        result = await query(update_sql);
        res.json(1);
    } catch (e) {
        res.json(0);
    }
});

router.post('/update_end_time',async function(req,res){
    let data=req.body;
    console.log(data)
    let update_sql="update tbl_daily_inspection set B_Signin_date='"+ data.end_time +"' where id="+ data.id +"";
    try {
        result = await query(update_sql);
        res.json(1);
    } catch (e) {
        res.json(0);
    }
});
router.get('/select_maintain_statics', async function (req,res) {
    let data = req.query;
    let sql1 = "SELECT COUNT(*) discount,branch_id,facilitiesname,facilitiesnum,facilitiesid,branch,Patrol_num,COUNT,Lid id,A_Signin_date,B_Signin_date,task_id,Inspecting_Officer,plan_name,facilities_type FROM tbl_disease_Restoration AS E RIGHT JOIN(" +
        " SELECT L.id Did,K.branch_id,facilitiesname,facilitiesnum,facilitiesid,branch,Patrol_num,COUNT,Lid,A_Signin_date,B_Signin_date,task_id,Inspecting_Officer,plan_name,K.facilities_type,Log_id FROM tbl_disease_baseinfo AS L RIGHT JOIN (" +
        " select Q.branch_id,P.BridgeName facilitiesname,P.BridgeNum facilitiesnum,Q.bridge_id facilitiesid,branch,Q.Patrol_num,Q.count,Q.id Lid," +
        " Q.A_Signin_date,Q.B_Signin_date,Q.task_id,Q.Inspecting_Officer,Q.plan_name,facilities_type" +
        " from tbl_bridge_info as P right JOIN (" +
        " select N.Patrol_num,N.count,N.id,N.bridge_id,branch,N.branch_id,N.Inspecting_Officer," +
        " N.A_Signin_date,N.B_Signin_date,N.task_id,N.plan_name,facilities_type" +
        " from branch as M right JOIN (" +
        " select Patrol_num ,count(*) count,A.id,A.bridge_id,A.branch_id,A.Inspecting_Officer," +
        " A.A_Signin_date,A.B_Signin_date,A.task_id,plan_name,A.facilities_type" +
        " from tbl_daily_inspection as A left join Maintenance_plan AS B" +
        " on A.bridge_id=B.bridge_id" +
        " group by DATE_FORMAT(Inspection_date,'%Y-%m'),bridge_id,A.task_id) AS N" +
        " ON M.id=N.branch_id) AS Q" +
        " ON P.BridgeID=Q.bridge_id" +
        " where P.curingid=" + data.branch_id +") AS K" +
        " ON L.Log_id=K.Lid" +
        " WHERE Log_id IS NOT NULL" +
        " AND Odd_Numbers is NOT NULL" +
        " and DATE_FORMAT(Reporting_time,'%Y-%m')='" + data.time + "') AS W" +
        " ON E.project_id=W.Did" +
        " GROUP BY branch_id,facilitiesname,facilitiesnum,facilitiesid,branch,Patrol_num,COUNT,Lid,A_Signin_date,B_Signin_date,task_id,Inspecting_Officer,plan_name,facilities_type";
        let sql2 = "SELECT COUNT(*) discount,branch_id,facilitiesname,facilitiesnum,facilitiesid,branch,Patrol_num,COUNT,Lid id,A_Signin_date,B_Signin_date,task_id,Inspecting_Officer,plan_name,facilities_type FROM tbl_disease_Restoration AS E RIGHT JOIN(" +
            " SELECT L.id Did,K.branch_id,facilitiesname,facilitiesnum,facilitiesid,branch,Patrol_num,COUNT,Lid,A_Signin_date,B_Signin_date,task_id,Inspecting_Officer,plan_name,K.facilities_type,Log_id FROM tbl_disease_baseinfo AS L RIGHT JOIN (" +
            " select Q.branch_id,P.PassagewayName facilitiesname,P.PassagewayNum facilitiesnum,Q.bridge_id facilitiesid,branch,Q.Patrol_num,Q.count,Q.id Lid," +
            " Q.A_Signin_date,Q.B_Signin_date,Q.task_id,Q.Inspecting_Officer,Q.plan_name,facilities_type" +
            " from tbl_passageway_info as P right JOIN (" +
            " select N.Patrol_num,N.count,N.id,N.bridge_id,branch,N.branch_id,N.Inspecting_Officer," +
            " N.A_Signin_date,N.B_Signin_date,N.task_id,N.plan_name,facilities_type" +
            " from branch as M right JOIN (" +
            " select Patrol_num ,count(*) count,A.id,A.bridge_id,A.branch_id,A.Inspecting_Officer," +
            " A.A_Signin_date,A.B_Signin_date,A.task_id,plan_name,A.facilities_type" +
            " from tbl_daily_inspection as A left join Maintenance_plan AS B" +
            " on A.bridge_id=B.bridge_id" +
            " group by DATE_FORMAT(Inspection_date,'%Y-%m'),bridge_id,A.task_id) AS N" +
            " ON M.id=N.branch_id) AS Q" +
            " ON P.PassagewayID=Q.bridge_id" +
            " where P.curingid=" + data.branch_id +") AS K" +
            " ON L.Log_id=K.Lid" +
            " WHERE Log_id IS NOT NULL" +
            " AND Odd_Numbers is NOT NULL" +
            " and DATE_FORMAT(Reporting_time,'%Y-%m')='" + data.time + "') AS W" +
            " ON E.project_id=W.Did" +
            " GROUP BY branch_id,facilitiesname,facilitiesnum,facilitiesid,branch,Patrol_num,COUNT,Lid,A_Signin_date,B_Signin_date,task_id,Inspecting_Officer,plan_name,facilities_type"
        try {
            let res1 = await query(sql1);
            let res2 = await query(sql2);
            let result = res1.concat(res2);
            res.json(result);
        }catch (e) {

        }
})
router.get('/select_info',async function(req,res){
    data=req.query;
    select_sql="SELECT userid,equipmentcode,user_name,POWER,state,registrant_id,branch FROM branch AS M RIGHT JOIN (" +
                " SELECT userid,equipmentcode,user_name,power,case when state='0' then '禁用' ELSE '启用' END AS state ,registrant_id,user_branch_id FROM app_equipment_code AS A LEFT JOIN admin AS B" +
                " ON A.userid=B.id" +
                " WHERE equipmentcode='"+ data.code +"') AS N" +
                " ON M.id=N.user_branch_id";
    try {
        result = await query(select_sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
router.get('/select_material_app',async function(req,res){
    console.log('mmp 11111111');
    let select_sql="select MaterialID,material from tbl_Unit_Price";
    try{
        result=await query(select_sql);
    }
    catch(e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
//新增map接口
router.get('/select_map', async function (req,res) {
    let data = req.query;
   let sql = "SELECT longitude,latitude FROM tbl_trajectory WHERE facilitiesid="+data.facilitiesid+" AND facilities_type='"+data.facilities_type + "' and time=date_format('"+data.Reporting_time +"','%Y-%m-%d')";
   console.log(sql)
   try {
    let result = await query(sql);
    res.json(result);
   }catch (e) {
       console.log('get data err'+e)
   }
});

async function copyData(uid) {
    let sql="select * from tbl_disease where userid=1";
    let result = await query(sql);
    try{
        for (let i=0;i<result.length;i++){
            let insert_sql="insert into tbl_disease (disease_name,unit,Solution_Tips,Plate_thickness,classification,userid,parent_id,type,pid) " +
                " values('"+ result[i].disease_name +"','"+ result[i].unit +"','"+ result[i].Solution_Tips +"','"+ result[i].Plate_thickness +"'," +
                " '"+ result[i].classification +"',"+ uid +","+ result[i].parent_id +","+ result[i].type +","+ result[i].pid +")";
            let results = await query(insert_sql);
        }
    }catch (e){
        return 0;
    }
    return 1;
}
module.exports = router;
