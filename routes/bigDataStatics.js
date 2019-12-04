const xlsx = require('node-xlsx')
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const query = require('myMysql');

router.get('/select_bci_bigData', async function (req,res) {
    let data = req.query;
    let date = new Date();
    let nowYear = date.getFullYear();
    let lastYear = (date.getFullYear()-4).toString();
    let sql ="SELECT A,B,C,D,E,TIME,COUNT(DISTINCT(Y.BridgeId)) DISCONT FROM tbl_bridge_info AS X RIGHT JOIN(\n" +
        " SELECT BridgeId,\n" +
        " SUM(case when Grade='A' then 1 ELSE 0 END) A,\n" +
        " SUM(case when Grade='B' then 1 ELSE 0 END) B,\n" +
        " SUM(case when Grade='C' then 1 ELSE 0 END) C,\n" +
        " SUM(case when Grade='D' then 1 ELSE 0 END) D,\n" +
        " SUM(case when Grade='E' then 1 ELSE 0 END) E,TIME FROM tbl_bci_score AS A RIGHT JOIN (\n" +
        " SELECT DATE_FORMAT(Inspection_date,'%Y') TIME,P.id,BridgeId from tbl_Routine_testing AS P LEFT JOIN tbl_BCI AS Q\n" +
        " ON P.id=Q.check_id\n" +
        " WHERE DATE_FORMAT(Inspection_date,'%Y')<='"+nowYear+"'\n" +
        " AND DATE_FORMAT(Inspection_date,'%Y')>='"+lastYear+"'\n" +
        " GROUP BY P.id) AS B\n" +
        " ON A.check_id=B.id\n" +
        " GROUP BY TIME) AS Y\n" +
        " ON X.BridgeID=Y.BridgeId\n" +
        " WHERE manageid=" +data.uid +
        " GROUP BY time";

    try{
        let result = await query(sql);
        res.json(result);
    }catch (e) {
        console.log('get data err' +e);
    }

});
//桥梁BCI检测评估
router.get('/select_bci',async function (req,res) {
    let data = req.query;
    let sql = "SELECT COUNT(N.BridgeID) value,\n" +
        " CASE when Grade='A' THEN \"A级别\"\n" +
        " when Grade='B' then \"B级别\"\n" +
        " when Grade='C' then \"C级别\"\n" +
        " when Grade='D' then \"D级别\"\n" +
        " when Grade='E' then \"E级别\"\n" +
        " END name\n" +
        " FROM tbl_bridge_info AS M RIGHT JOIN(\n" +
        " SELECT distinct(A.check_id),BridgeID,Grade FROM tbl_BCI AS A LEFT JOIN tbl_bci_score AS B\n" +
        " ON A.check_id=B.check_id) AS N\n" +
        " ON M.BridgeID=N.BridgeID\n" +
        " WHERE manageid="+data.uid +
        " GROUP BY name";
    try {
        let result = await query(sql);
        let resObj = {};
        resObj.x = [];
        resObj.y = [];
        for (let item of result) {
            resObj.x.push(item.name);
            resObj.y.push(item);
        }
        console.log('bci 111111111111111111111');
        res.json(resObj);
    }catch (e) {
        console.log('get data err' +e);
    }
});
//BCI图表
router.get('/select_bci_bar', async function (req,res) {
    let data = req.query;
    let date = new Date();
    let nowYear = date.getFullYear();
    let sql ="SELECT A,B,C,D,E,COUNT(DISTINCT(Y.BridgeId)) DISCONT FROM tbl_bridge_info AS X RIGHT JOIN(\n" +
        "SELECT BridgeId,\n" +
        "SUM(case when Grade='A' then 1 ELSE 0 END) A,\n" +
        "SUM(case when Grade='B' then 1 ELSE 0 END) B,\n" +
        "SUM(case when Grade='C' then 1 ELSE 0 END) C,\n" +
        "SUM(case when Grade='D' then 1 ELSE 0 END) D,\n" +
        "SUM(case when Grade='E' then 1 ELSE 0 END) E FROM tbl_bci_score AS A RIGHT JOIN (\n" +
        "SELECT P.id,BridgeId from tbl_Routine_testing AS P LEFT JOIN tbl_BCI AS Q\n" +
        "ON P.id=Q.check_id\n" +
        "WHERE DATE_FORMAT(Inspection_date,'%Y')='"+data.nowYear+"'\n" +
        "GROUP BY P.id) AS B\n" +
        "ON A.check_id=B.id) AS Y\n" +
        "ON X.BridgeID=Y.BridgeId\n" +
        "WHERE manageid="+data.uid;

    try{
        let result = await query(sql);
        res.json(result);
    }catch (e) {
        console.log('get data err' +e);
    }

});

//BCI表格
router.get('/select_bci_table', async function (req,res) {
    let data = req.query;
    let date = new Date();
    let nowYear = data.nowYear;
    let lastYear = nowYear-1;
    let sql ="SELECT Bridgename,Q.BCI,BCI_Deck,BCI_Top,BCI_Bottom,DATE_FORMAT(Inspection_date,'%Y') TIME FROM tbl_Routine_testing AS P RIGHT JOIN(\n" +
        "SELECT Bridgename,BCI,BCI_Deck,BCI_Top,BCI_Bottom,N.check_id FROM tbl_bridge_info AS M RIGHT JOIN(\n" +
        "SELECT BridgeID,BCI,BCI_Deck,BCI_Top,BCI_Bottom,A.check_id FROM tbl_BCI AS A right JOIN tbl_bci_score AS B\n" +
        "ON A.check_id=B.check_id\n" +
        "GROUP BY B.check_id) AS N\n" +
        "ON M.BridgeID=N.BridgeID\n" +
        "WHERE manageid=" + data.uid +") AS Q\n" +
        "ON P.id=Q.check_id\n" +
        "WHERE (DATE_FORMAT(Inspection_date,'%Y')='"+nowYear+"'\n" +
        "OR DATE_FORMAT(Inspection_date,'%Y')='"+lastYear+"')";

    try{
        let result = await query(sql);
        let reduce = result[0].BCI - result[1].BCI;
        let resArr = [];
        result[0].reduce = reduce;
        resArr.push(result[0]);
        res.json(resArr);
    }catch (e) {
        console.log('get data err' +e);
    }

});




//养护资金使用分析
router.get('/select_price', async function (req, res) {
    let data = req.query;
    let sql1 = "SELECT SUM(Cost) fund,COUNT(disease_curing_id) dis,TIME FROM tbl_Check AS P RIGHT JOIN(" +
        " SELECT disease_curing_id,Odd_Numbers,date_format(Reporting_time,'%Y-%m') AS time FROM tbl_disease_Restoration AS M RIGHT JOIN (" +
        " SELECT B.id,BridgeID,Odd_Numbers,Reporting_time FROM tbl_bridge_info AS A RIGHT join tbl_disease_baseinfo AS B" +
        " ON A.BridgeID=B.bridge_id" +
        " WHERE manageid=" + data.uid +
        " AND facilities_type=0) AS N" +
        " ON M.project_id=N.id" +
        " WHERE date_format(Reporting_time,'%Y')=" + data.time +
        " GROUP BY disease_curing_id,Odd_Numbers,time) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers" +
        " GROUP BY TIME" +
        " HAVING fund IS NOT NULL";
    console.log(sql1)
    let sql2 = "SELECT SUM(Cost) fund,COUNT(disease_curing_id) dis,TIME FROM tbl_Check AS P RIGHT JOIN(" +
        " SELECT disease_curing_id,Odd_Numbers,date_format(Reporting_time,'%Y-%m') AS time FROM tbl_disease_Restoration AS M RIGHT JOIN (" +
        " SELECT B.id,PassagewayID,Odd_Numbers,Reporting_time FROM tbl_passageway_info AS A RIGHT join tbl_disease_baseinfo AS B" +
        " ON A.PassagewayID=B.bridge_id" +
        " WHERE manageid=" + data.uid +
        " AND facilities_type=1) AS N" +
        " ON M.project_id=N.id" +
        " WHERE date_format(Reporting_time,'%Y')=" + data.time +
        " GROUP BY disease_curing_id,Odd_Numbers,time) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers" +
        " GROUP BY TIME" +
        " HAVING fund IS NOT NULL";
    try {
        let res1 = await query(sql1);
        let res2 = await query(sql2);
        let response = res1.concat(res2);
        console.log(response)
        let result = response.reduce((groups, item) => {
            var groupFound = groups.find(arrItem => item.TIME === arrItem.TIME);
            if (groupFound) {
                groupFound.dis += item.dis;
                groupFound.fund += item.fund;
            } else {
                var newGroup = {
                    TIME: item.TIME,
                    dis: item.dis,
                    fund: item.fund
                }
                groups.push(newGroup);
            }
            return groups;
        }, []);
        res.json(result);
    } catch (e) {
        console.log('get data err' + e);
    }
});
//养护资金使用分析 柱状图
router.get('/select_details_bar', async function (req, res) {
    let data = req.query;
    let sql1 = "SELECT COUNT(disease_curing_id) 'all', sum(case when classification='0' then 1 ELSE 0 END) AS 'bar'," +
        " sum(case when classification='1' then 1 ELSE 0 END) AS 'passageway'," +
        " sum(case when classification='2' then 1 ELSE 0 END) AS 'structure'," +
        " sum(case when classification='3' then 1 ELSE 0 END) AS 'attachment',N.TIME FROM tbl_disease AS M RIGHT JOIN (" +
        " SELECT A.id,date_format(Reporting_time,'%Y-%m') TIME,disease_curing_id FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B" +
        " ON A.id=B.project_id" +
        " WHERE branch_id IN(select id from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1)" +
        " AND date_format(Reporting_time,'%Y')=" + data.time + ") AS N" +
        " ON M.id=N.disease_curing_id" +
        " GROUP BY TIME";
    let sql2 = "SELECT SUM(Cost) 'all', sum(case when classification='0' then Cost ELSE 0 END) AS 'bar'," +
        " sum(case when classification='1' then Cost ELSE 0 END) AS 'passageway'," +
        " sum(case when classification='2' then Cost ELSE 0 END) AS 'structure'," +
        " sum(case when classification='3' then Cost ELSE 0 END) AS 'attachment',Q.TIME FROM tbl_disease AS P RIGHT JOIN (" +
        " SELECT TIME,disease_curing_id,Cost FROM tbl_Check AS M right JOIN (" +
        " SELECT A.id,date_format(Reporting_time,'%Y-%m') TIME,disease_curing_id,Odd_Numbers FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B" +
        " ON A.id=B.project_id" +
        " WHERE branch_id IN(select id from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1)" +
        " AND date_format(Reporting_time,'%Y')=" + data.time + ") AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS Q" +
        " ON P.id=Q.disease_curing_id" +
        " GROUP BY TIME";
    try {
        let res1 = await query(sql1);
        let res2 = await query(sql2);
        let result = [];
        for (let i = 0; i < res1.length; i++) {
            let tmp = {};
            tmp.Time = res1[i].TIME;
            delete res1[i].TIME;
            delete res2[i].TIME;
            tmp.Bar = res1[i];
            tmp.Line = res2[i];
            result.push(tmp);
        }
        result = result.sort(compare('Time', true))
        res.json(result);
    } catch (e) {
        console.log('get data err' + e);
    }
    function compare(property, desc) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            if (desc == true) {
                return value1.localeCompare(value2);
            } else {
                return value2.localeCompare(value1);
            }
        }
    };
});
//养护资金使用分析 折线图
router.get('/select_details_line', async function (req, res) {
    let data = req.query;
    let sql = "SELECT SUM(Cost) '全部', sum(case when classification='0' then Cost ELSE 0 END) AS '车行道'," +
        " sum(case when classification='1' then Cost ELSE 0 END) AS '人行道'," +
        " sum(case when classification='2' then Cost ELSE 0 END) AS '结构'," +
        " sum(case when classification='3' then Cost ELSE 0 END) AS '附属设施',Q.TIME FROM tbl_disease AS P RIGHT JOIN (" +
        " SELECT TIME,disease_curing_id,Cost FROM tbl_Check AS M right JOIN (" +
        " SELECT A.id,date_format(Reporting_time,'%Y-%m') TIME,disease_curing_id,Odd_Numbers FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B" +
        " ON A.id=B.project_id" +
        " WHERE branch_id IN(select id from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1)" +
        " AND date_format(Reporting_time,'%Y')=" + data.time + ") AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS Q" +
        " ON P.id=Q.disease_curing_id" +
        " GROUP BY TIME";
    try {
        let response = await query(sql);

        res.json(response);
    } catch (e) {
        console.log('get data err' + e);
    }
});
//养护资金使用分析 表格
router.get('/select_details_table', async function (req, res) {
    let data = req.query;
    let sql = "SELECT sum(case when classification='0' then 1 ELSE 0 END) AS 'car'," +
        " sum(case when classification='1' then 1 ELSE 0 END) AS 'passageway'," +
        " sum(case when classification='2' then 1 ELSE 0 END) AS 'structure'," +
        " sum(case when classification='3' then 1 ELSE 0 END) AS 'attachment'," +
        " sum(case when classification='0' then Cost ELSE 0 END) AS 'car1'," +
        " sum(case when classification='1' then Cost ELSE 0 END) AS 'passageway1'," +
        " sum(case when classification='2' then Cost ELSE 0 END) AS 'structure1'," +
        " sum(case when classification='3' then Cost ELSE 0 END) AS 'attachment1',TIME FROM tbl_disease AS P RIGHT JOIN(" +
        " SELECT TIME,disease_curing_id,Cost FROM tbl_Check AS M right JOIN (" +
        " SELECT A.id,date_format(Reporting_time,'%Y-%m') TIME,disease_curing_id,Odd_Numbers FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B " +
        " ON A.id=B.project_id" +
        " WHERE branch_id IN(select id from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1)" +
        " AND date_format(Reporting_time,'%Y')=" + data.time + ") AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS Q" +
        " ON P.id=Q.disease_curing_id" +
        " GROUP BY TIME";
    try {
        let response = await query(sql);
        let result = [];
        for (let i = 0; i < response.length; i++) {
            let tmp = {};
            tmp.time = response[i].TIME;
            let date = new Date(response[i].TIME);
            tmp.time = date.getMonth() + 1 + '月';
            tmp.car = {};
            tmp.car.dis = response[i].car;
            tmp.car.price = response[i].car1;
            tmp.passageway = {};
            tmp.passageway.dis = response[i].passageway;
            tmp.passageway.price = response[i].passageway1;
            tmp.structure = {};
            tmp.structure.dis = response[i].structure;
            tmp.structure.price = response[i].structure1;
            tmp.attachment = {};
            tmp.attachment.dis = response[i].attachment;
            tmp.attachment.price = response[i].attachment1;
            tmp.price = tmp.car.price + tmp.passageway.price + tmp.structure.price + tmp.attachment.price;
            tmp.number = tmp.car.dis + tmp.passageway.dis + tmp.structure.dis + tmp.attachment.dis;
            result.push(tmp)
        }
        result = result.sort(compare('time', false))
        res.json(result);
    } catch (e) {
        console.log('get data err' + e);
    }
    function compare(property, desc) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            if (desc == true) {
                return value1.localeCompare(value2);
            } else {
                return value2.localeCompare(value1);
            }
        }
    };
});
/*---------------------------------------------------------------------------------------------------------------------------------------------------*/


/* ----------------------------------------------------------------------------------------------------------------------------------------------------- */
//设施病害对比养护资金分析 按病害数量排名
router.get('/select_left_capital', async function (req, res) {
    let data = req.query;
    let sql1 = "SELECT BridgeName facilitiesname,COUNT(disease_curing_id) COUNTDIS FROM tbl_disease_Restoration AS M RIGHT JOIN(" +
        " SELECT A.id,BridgeName FROM tbl_disease_baseinfo AS A LEFT JOIN tbl_bridge_info AS B" +
        " ON A.bridge_id=B.BridgeID" +
        " WHERE facilities_type=0" +
        " AND manageid=" + data.uid +
        " AND DATE_FORMAT(Reporting_time,'%Y')=" + data.time + ") AS N" +
        " ON M.project_id=N.id" +
        " GROUP BY BridgeName";
    let sql2 = "SELECT PassagewayName facilitiesname,COUNT(disease_curing_id) COUNTDIS FROM tbl_disease_Restoration AS M RIGHT JOIN(" +
        " SELECT A.id,PassagewayName FROM tbl_disease_baseinfo AS A LEFT JOIN tbl_passageway_info AS B" +
        " ON A.bridge_id=B.PassagewayID" +
        " WHERE facilities_type=1" +
        " AND manageid=" + data.uid +
        " AND DATE_FORMAT(Reporting_time,'%Y')=" + data.time + ") AS N" +
        " ON M.project_id=N.id"
    " GROUP BY PassagewayName";
    try {
        let res1 = await query(sql1);
        let res2 = await query(sql2);
        let response = res1.concat(res2);
        let result = response.sort(compare('COUNTDIS', false));
        res.json(result);
    } catch (e) {
        console.log('get data err' + e);
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
//设施病害对比养护资金分析 按资金使用排名
router.get('/select_right_capital', async function (req, res) {
    let data = req.query;
    let sql1 = "SELECT BridgeName facilitiesname,Cost FROM tbl_disease_Restoration AS P RIGHT JOIN (" +
        " SELECT N.id,BridgeName,N.Odd_Numbers,Cost FROM tbl_Check AS M RIGHT JOIN (" +
        " SELECT A.id,BridgeName,Odd_Numbers FROM tbl_disease_baseinfo AS A LEFT JOIN tbl_bridge_info AS B" +
        " ON A.bridge_id=B.BridgeID" +
        " WHERE facilities_type=0" +
        " AND manageid=" + data.uid +
        " AND DATE_FORMAT(Reporting_time,'%Y')=" + data.time + " ) AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS Q" +
        " ON P.project_id=Q.id" +
        " GROUP BY BridgeName";
    let sql2 = "SELECT PassagewayName facilitiesname,Cost FROM tbl_disease_Restoration AS P RIGHT JOIN (" +
        " SELECT N.id,PassagewayName,N.Odd_Numbers,Cost FROM tbl_Check AS M RIGHT JOIN (" +
        " SELECT A.id,PassagewayName,Odd_Numbers FROM tbl_disease_baseinfo AS A LEFT JOIN tbl_passageway_info AS B" +
        " ON A.bridge_id=B.PassagewayID" +
        " WHERE facilities_type=1" +
        " AND manageid=" + data.uid +
        " AND DATE_FORMAT(Reporting_time,'%Y')=" + data.time + ") AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS Q" +
        " ON P.project_id=Q.id" +
        " GROUP BY PassagewayName";
    try {
        let res1 = await query(sql1);
        let res2 = await query(sql2);
        let response = res1.concat(res2);
        let result = response.sort(compare('Cost', false));
        res.json(result);
    } catch (e) {
        console.log('get data err' + e);
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
//设施病害对比养护资金分析  图表部分
router.get('/select_detail_capital_bar', async function (req, res) {
    let data = req.query;
    let sql1 = "SELECT SUM(Cost) 'all', BridgeName name," +
        " sum(case when classification='0' then Cost ELSE 0 END) AS 'car'," +
        " sum(case when classification='1' then Cost ELSE 0 END) AS 'passway'," +
        " sum(case when classification='2' then Cost ELSE 0 END) AS 'structure'," +
        " sum(case when classification='3' then Cost ELSE 0 END) AS 'attachment' FROM tbl_disease AS L RIGHT JOIN (" +
        " SELECT COST,disease_curing_id,BridgeName FROM tbl_Check AS P RIGHT JOIN (" +
        " SELECT TIME,disease_curing_id,Odd_Numbers,BridgeName FROM tbl_bridge_info AS M RIGHT JOIN(" +
        " SELECT bridge_id,A.id,date_format(Reporting_time,'%Y-%m') TIME,disease_curing_id,Odd_Numbers FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B " +
        " ON A.id=B.project_id" +
        " WHERE branch_id IN(select id from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1)" +
        " AND date_format(Reporting_time,'%Y')=" + data.time +
        " AND facilities_type='0' AND Odd_Numbers IS NOT NULL)AS N" +
        " ON M.BridgeID=N.bridge_id) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS K" +
        " ON L.id=K.disease_curing_id" +
        " GROUP BY BridgeName";
    let sql2 = "SELECT SUM(Cost) 'all', PassagewayName name," +
        " sum(case when classification='0' then Cost ELSE 0 END) AS 'car'," +
        " sum(case when classification='1' then Cost ELSE 0 END) AS 'passway'," +
        " sum(case when classification='2' then Cost ELSE 0 END) AS 'structure'," +
        " sum(case when classification='3' then Cost ELSE 0 END) AS 'attachment' FROM tbl_disease AS L RIGHT JOIN (" +
        " SELECT COST,disease_curing_id,PassagewayName FROM tbl_Check AS P RIGHT JOIN (" +
        " SELECT TIME,disease_curing_id,Odd_Numbers,PassagewayName FROM tbl_passageway_info AS M RIGHT JOIN(" +
        " SELECT bridge_id,A.id,date_format(Reporting_time,'%Y-%m') TIME,disease_curing_id,Odd_Numbers FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B " +
        " ON A.id=B.project_id" +
        " WHERE branch_id IN(select id from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1)" +
        " AND date_format(Reporting_time,'%Y')=" + data.time +
        " AND facilities_type='1' AND Odd_Numbers IS NOT NULL)AS N" +
        " ON M.PassagewayID=N.bridge_id) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS K" +
        " ON L.id=K.disease_curing_id" +
        " GROUP BY PassagewayName";

    let sql3 = "SELECT BridgeName name," +
        " COUNT(disease_curing_id) 'all'," +
        " sum(case when classification='0' then 1 ELSE 0 END) AS 'car'," +
        " sum(case when classification='1' then 1 ELSE 0 END) AS 'passway'," +
        " sum(case when classification='2' then 1 ELSE 0 END) AS 'structure'," +
        " sum(case when classification='3' then 1 ELSE 0 END) AS 'attachment' FROM tbl_disease AS L RIGHT JOIN (" +
        " SELECT COST,disease_curing_id,BridgeName FROM tbl_Check AS P RIGHT JOIN (" +
        " SELECT TIME,disease_curing_id,Odd_Numbers,BridgeName FROM tbl_bridge_info AS M RIGHT JOIN(" +
        " SELECT bridge_id,A.id,date_format(Reporting_time,'%Y-%m') TIME,disease_curing_id,Odd_Numbers FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B " +
        " ON A.id=B.project_id" +
        " WHERE branch_id IN(select id from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1)" +
        " AND date_format(Reporting_time,'%Y')=" + data.time +
        " AND facilities_type='0' AND Odd_Numbers IS NOT NULL)AS N" +
        " ON M.BridgeID=N.bridge_id) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS K" +
        " ON L.id=K.disease_curing_id" +
        " GROUP BY BridgeName";

    let sql4 = "SELECT PassagewayName name," +
        " COUNT(disease_curing_id) 'all'," +
        " sum(case when classification='0' then 1 ELSE 0 END) AS 'car'," +
        " sum(case when classification='1' then 1 ELSE 0 END) AS 'passway'," +
        " sum(case when classification='2' then 1 ELSE 0 END) AS 'structure'," +
        " sum(case when classification='3' then 1 ELSE 0 END) AS 'attachment' FROM tbl_disease AS L RIGHT JOIN (" +
        " SELECT COST,disease_curing_id,PassagewayName FROM tbl_Check AS P RIGHT JOIN (" +
        " SELECT TIME,disease_curing_id,Odd_Numbers,PassagewayName FROM tbl_passageway_info AS M RIGHT JOIN(" +
        " SELECT bridge_id,A.id,date_format(Reporting_time,'%Y-%m') TIME,disease_curing_id,Odd_Numbers FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B " +
        " ON A.id=B.project_id" +
        " WHERE branch_id IN(select id from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1)" +
        " AND date_format(Reporting_time,'%Y')=" + data.time +
        " AND facilities_type='1' AND Odd_Numbers IS NOT NULL)AS N" +
        " ON M.PassagewayID=N.bridge_id) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS K" +
        " ON L.id=K.disease_curing_id" +
        " GROUP BY PassagewayName";
    try {
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
        let res1 = await query(sql1);
        let res2 = await query(sql2);
        let res3 = await query(sql3);
        let res4 = await query(sql4);
        let obj = {};
        obj.price = res1.concat(res2);
        obj.number = res3.concat(res4);
        console.log(obj.price)
        console.log(obj.number);

        let result = [];
        for (let i = 0; i < obj.price.length; i++) {
            let tmp = {};
            tmp.name = obj.price[i].name;
            delete obj.price[i].name;
            delete obj.number[i].name;
            tmp.bar = obj.price[i];
            tmp.line = obj.number[i];
            tmp.price = obj.price[i].all;
            tmp.number = obj.number[i].all;
            if (tmp.price == null) {
                tmp.price = 0;
            }
            if (tmp.number == null) {
                tmp.number = 0;
            }
            result.push(tmp)
        }
        if (data.arrange == 0) {
            result = result.sort(compare('number', true))
        } else if (data.arrange == 1) {
            result = result.sort(compare('price', true))
        }
        res.json(result);
        console.log(result[0].line.人行道);
    } catch (e) {
        console.log('get data err' + e);
    }
});
//设施病害对比养护资金分析  下面的表格
router.get('/select_detail_capital_table', async function (req, res) {
    let data = req.query;
    let sql1 = "SELECT PassagewayName name,branch,car,passway,structure,attachment,car1,passway1,structure1,attachment1 FROM branch AS V RIGHT JOIN (" +
        " SELECT PassagewayName,branch_id," +
        "  sum(case when classification='0' then 1 ELSE 0 END) AS 'car'," +
        " sum(case when classification='1' then 1 ELSE 0 END) AS 'passway'," +
        " sum(case when classification='2' then 1 ELSE 0 END) AS 'structure'," +
        " sum(case when classification='3' then 1 ELSE 0 END) AS 'attachment'," +
        " sum(case when classification='0' then Cost ELSE 0 END) AS 'car1'," +
        " sum(case when classification='1' then Cost ELSE 0 END) AS 'passway1'," +
        " sum(case when classification='2' then Cost ELSE 0 END) AS 'structure1'," +
        " sum(case when classification='3' then Cost ELSE 0 END) AS 'attachment1' FROM tbl_disease AS L RIGHT JOIN(" +
        " SELECT branch_id,COST,disease_curing_id,PassagewayName FROM tbl_Check AS P RIGHT JOIN (" +
        " SELECT bridge_id,branch_id,disease_curing_id,Odd_Numbers,PassagewayName FROM tbl_passageway_info AS M RIGHT JOIN(" +
        " SELECT branch_id,bridge_id,A.id,disease_curing_id,Odd_Numbers FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B " +
        " ON A.id=B.project_id" +
        " WHERE branch_id IN (select id from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1)" +
        " AND facilities_type='1' AND Odd_Numbers IS NOT NULL AND date_format(Reporting_time,'%Y')='" + data.time + "')AS N" +
        " ON M.PassagewayID=N.bridge_id) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS K" +
        " ON L.id=K.disease_curing_id" +
        " GROUP BY PassagewayName) AS F" +
        " ON V.id=F.branch_id";
    let sql2 = "SELECT BridgeName name,branch,car,passway,structure,attachment,car1,passway1,structure1,attachment1 FROM branch AS V RIGHT JOIN (" +
        " SELECT BridgeName,branch_id," +
        " sum(case when classification='0' then 1 ELSE 0 END) AS 'car'," +
        " sum(case when classification='1' then 1 ELSE 0 END) AS 'passway'," +
        " sum(case when classification='2' then 1 ELSE 0 END) AS 'structure'," +
        " sum(case when classification='3' then 1 ELSE 0 END) AS 'attachment'," +
        " sum(case when classification='0' then Cost ELSE 0 END) AS 'car1'," +
        " sum(case when classification='1' then Cost ELSE 0 END) AS 'passway1'," +
        " sum(case when classification='2' then Cost ELSE 0 END) AS 'structure1'," +
        " sum(case when classification='3' then Cost ELSE 0 END) AS 'attachment1' FROM tbl_disease AS L RIGHT JOIN(" +
        " SELECT branch_id,COST,disease_curing_id,BridgeName FROM tbl_Check AS P RIGHT JOIN (" +
        " SELECT bridge_id,branch_id,disease_curing_id,Odd_Numbers,BridgeName FROM tbl_bridge_info AS M RIGHT JOIN(" +
        " SELECT branch_id,bridge_id,A.id,disease_curing_id,Odd_Numbers FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B " +
        " ON A.id=B.project_id" +
        " WHERE branch_id IN (select id from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1)" +
        " AND facilities_type='0' AND Odd_Numbers IS NOT NULL AND date_format(Reporting_time,'%Y')='" + data.time + "')AS N" +
        " ON M.BridgeID=N.bridge_id) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS K" +
        " ON L.id=K.disease_curing_id" +
        " GROUP BY BridgeName) AS F" +
        " ON V.id=F.branch_id";
    try {
        let res1 = await query(sql1);
        let res2 = await query(sql2);
        let response = res1.concat(res2);
        let result = [];
        for (let i = 0; i < response.length; i++) {
            let tmp = {};
            tmp.name = response[i].name;
            tmp.branch = response[i].branch;
            tmp.car = {};
            tmp.car.dis = response[i].car;
            tmp.car.price = response[i].car1;
            tmp.passway = {};
            tmp.passway.dis = response[i].passway;
            tmp.passway.price = response[i].passway1;
            tmp.structure = {};
            tmp.structure.dis = response[i].structure;
            tmp.structure.price = response[i].structure1;
            tmp.attachment = {};
            tmp.attachment.dis = response[i].attachment;
            tmp.attachment.price = response[i].attachment1;
            tmp.price = response[i].attachment1 + response[i].structure1 + response[i].car1 + response[i].passway1;
            tmp.number = response[i].attachment + response[i].structure + response[i].car + response[i].passway;
            result.push(tmp);
        }
        if (data.arrange == 0) {
            result = result.sort(compare('number', true))
        } else if (data.arrange == 1) {
            result = result.sort(compare('price', true))
        }
        res.json(result);
    } catch (e) {
        console.log('get data err' + e);
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

//如果选择的是全部的话返回当前登录账号的branch_id，否则，选择哪个养护公司就返回哪个养护公司的id（养护公司查询接口）
router.get('/select_branch_all', async function (req, res) {
    data = req.query;
    let sql = "select id,branch from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1";
    try {
        result = await query(sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});
/* ---------------------------------------------------------------------------------------------------------------------- 首页*/
//病害上报数量统计 
router.get('/select_submit_disease', async function (req, res) {
    let data = req.query;
    let sql1 = "SELECT TIME,COUNT(disease_curing_id) report FROM tbl_Schedule AS M RIGHT JOIN (" +
        " SELECT A.id,date_format(Reporting_time,'%Y-%m') TIME,disease_curing_id,Odd_Numbers FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B " +
        " ON A.id=B.project_id" +
        " WHERE branch_id IN (select id from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1)" +
        " AND date_format(Reporting_time,'%Y')=" + data.time + ") AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers" +
        " WHERE StepID=0" +
        " GROUP BY TIME";
    let sql2 = "SELECT TIME,COUNT(disease_curing_id) handle FROM tbl_Schedule AS M RIGHT JOIN (" +
        " SELECT A.id,date_format(Reporting_time,'%Y-%m') TIME,disease_curing_id,Odd_Numbers FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B" +
        " ON A.id=B.project_id" +
        " WHERE branch_id IN (select id from branch where find_in_set(id, getChildLst(" + data.branch_id + ")) AND branch_type=1)" +
        " AND date_format(Reporting_time,'%Y')=" + data.time + ") AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers" +
        " WHERE StepID=2" +
        " GROUP BY TIME";
    try {
        let res1 = await query(sql1);
        console.log(res1);
        let res2 = await query(sql2);
        console.log(res2);

        let resArr = [];
        let resObj = {};
        resObj.time = [];
        resObj.report = [];
        resObj.handle = [];

        for (let i = 0; i < res1.length; i++) {
            res1[i].flag = 0;
        }
        for (let i = 0; i < res2.length; i++) {
            res2[i].flag = 0;
        }

        for (let i = 0; i < res1.length; i++) {
            for (let j = 0; j < res2.length; j++) {
                if (res1[i].TIME == res2[j].TIME) {
                    let tmp = {};
                    tmp.TIME = res1[i].TIME;
                    tmp.handle = res2[j].handle;
                    tmp.report = res1[i].report;
                    res1[i].flag = 1;
                    res2[j].flag = 1;
                    resArr.push(tmp);
                }
            }
        }
        for (let item of res1) {
            if (item.flag == 0) {
                let tmp = {};
                tmp.TIME = item.TIME;
                tmp.handle = 0;
                tmp.report = item.report;
                resArr.push(tmp);
            }
        }
        for (let item of res2) {
            if (item.flag == 0) {
                let tmp = {};
                tmp.TIME = item.TIME;
                tmp.handle = item.handle;
                tmp.report = 0;
                resArr.push(tmp);
            }
        }
        resArr = resArr.sort(compare('TIME', true));
        console.log(resArr)
        for (let item of resArr) {
            resObj.time.push(item.TIME);
            resObj.report.push(item.report);
            resObj.handle.push(item.handle);
        }
        res.json(resObj);

    } catch (e) {
        console.log('get data err' + e);
    }

    function compare(property, desc) {
        return function (a, b) {
            var value1 = a[property];
            var value2 = b[property];
            if (desc == true) {
                return value1.localeCompare(value2);
            } else {
                return value2.localeCompare(value1);
            }
        }
    };
});
//结算管理 结算统计
router.get('/select_manage_statics', async function (req, res) {
    let data = req.query;
    let sql = "SELECT group_concat(disease_name) disease_name,bridgename facilitiesname,branch,Cost,manage_Sign_time,project_Leader,problem_source,Odd_Numbers," +
        " CASE WHEN classification='0'THEN Audit_quantity ELSE 0 END AS 'bar'," +
        " CASE WHEN classification='1'THEN Audit_quantity ELSE 0 END AS 'passageway'," +
        " case when classification='2' then Audit_quantity ELSE 0 END AS 'struct'," +
        " CASE WHEN classification='3'THEN Audit_quantity ELSE 0 END AS 'attachment'  FROM tbl_disease AS W RIGHT JOIN (" +
        " SELECT bridgename,branch,Cost,manage_Sign_time,project_Leader,problem_source,disease_curing_id,Audit_quantity,Odd_Numbers FROM tbl_bridge_info AS X RIGHT JOIN(" +
        " SELECT branch,Cost,manage_Sign_time,project_Leader,problem_source,disease_curing_id,bridge_id,Audit_quantity,Odd_Numbers FROM branch AS T RIGHT JOIN (" +
        " SELECT Cost,manage_Sign_time,project_Leader,problem_source,disease_curing_id,bridge_id,branch_id,Audit_quantity,K.Odd_Numbers FROM tbl_Schedule AS L RIGHT JOIN(" +
        " SELECT Cost,manage_Sign_time,project_Leader,problem_source,disease_curing_id,bridge_id,branch_id,P.Odd_Numbers,Audit_quantity FROM tbl_Check AS P RIGHT JOIN (" +
        " SELECT project_Leader,problem_source,disease_curing_id,M.Odd_Numbers,bridge_id,N.branch_id,Audit_quantity FROM tbl_work_order AS M RIGHT JOIN (" +
        " SELECT A.id,disease_curing_id,Odd_Numbers,bridge_id,branch_id,Audit_quantity FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B " +
        " ON A.id=B.project_id" +
        " WHERE branch_id=" + data.branch_id + " AND date_FORMAT(Reporting_time,'%Y-%m')='" + data.time + "') AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS K" +
        " ON L.Odd_Numbers=K.Odd_Numbers" +
        " WHERE L.StepID=3) AS R" +
        " ON T.id=R.branch_id) AS Y" +
        " ON X.BridgeID=Y.bridge_id) E" +
        " ON W.id=E.disease_curing_id" +
        " GROUP BY Odd_Numbers";
    try {
        let result = await query(sql);
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

})
router.get('/loadStatics', async function (req, res) {
    let data = req.query;
    let sql = "SELECT Odd_Numbers, group_concat(disease_name) disease_name,bridgename facilitiesname,branch,project_Leader,manage_Sign_time,problem_source," +
        " CASE WHEN classification='0'THEN Audit_quantity ELSE 0 END AS 'bar'," +
        " CASE WHEN classification='1'THEN Audit_quantity ELSE 0 END AS 'passageway'," +
        " case when classification='2' then Audit_quantity ELSE 0 END AS 'struct'," +
        " CASE WHEN classification='3'THEN Audit_quantity ELSE 0 END AS 'attachment',Cost FROM tbl_disease AS W RIGHT JOIN (" +
        " SELECT bridgename,branch,Cost,manage_Sign_time,project_Leader,problem_source,disease_curing_id,Audit_quantity,Odd_Numbers FROM tbl_bridge_info AS X RIGHT JOIN(" +
        " SELECT branch,Cost,manage_Sign_time,project_Leader,problem_source,disease_curing_id,bridge_id,Audit_quantity,Odd_Numbers FROM branch AS T RIGHT JOIN (" +
        " SELECT Cost,manage_Sign_time,project_Leader,problem_source,disease_curing_id,bridge_id,branch_id,Audit_quantity,K.Odd_Numbers FROM tbl_Schedule AS L RIGHT JOIN(" +
        " SELECT Cost,manage_Sign_time,project_Leader,problem_source,disease_curing_id,bridge_id,branch_id,P.Odd_Numbers,Audit_quantity FROM tbl_Check AS P RIGHT JOIN (" +
        " SELECT project_Leader,problem_source,disease_curing_id,M.Odd_Numbers,bridge_id,N.branch_id,Audit_quantity FROM tbl_work_order AS M RIGHT JOIN (" +
        " SELECT A.id,disease_curing_id,Odd_Numbers,bridge_id,branch_id,Audit_quantity FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B " +
        " ON A.id=B.project_id" +
        " WHERE branch_id=" + data.branch_id + " AND date_FORMAT(Reporting_time,'%Y-%m')='" + data.time + "') AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS K" +
        " ON L.Odd_Numbers=K.Odd_Numbers" +
        " WHERE L.StepID=3) AS R" +
        " ON T.id=R.branch_id) AS Y" +
        " ON X.BridgeID=Y.bridge_id) E" +
        " ON W.id=E.disease_curing_id" +
        " GROUP BY Odd_Numbers";
        try {
            let result = await query(sql);
            for (let item of result) {
                if(item.manage_Sign_time !=='0000-00-00 00:00:00') {
                    item.manage_Sign_time = get_date_str(new Date(item.manage_Sign_time))
                }
                
            };
            var data1 = [];
            data1.push(['单号','病害名称','设施名称','维护公司','项目负责人', '验收时间','问题来源','车行道/桥面','人行道/桥结构','结构','附属设施','最终审计金额'])
            if(result)
            {
                for(var i = 0; i < result.length; i++)
                {
                    var arr=[];
                    var value=result[i];
                    for(var j in value){
                        arr.push(value[j]);
                    }
                    data1.push(arr);
                    console.log(data1)
                }
            }
            var buffer = xlsx.build([
                {
                    name:'sheet1',
                    data:data1
                }
            ]);
            let filename = path.join(__dirname, '../static/')+"结算统计-" + new Date().getTime() + ".xlsx"
            fs.writeFileSync(filename,buffer,{'flag':'w'});
            res.json(filename);
        } catch (e) {
            console.log(`select err` + e)
        }
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

})
//竣工结算 结算资料 项目清单汇总
router.get('/select_manage_costInformation', async function (req, res) {
    let data = req.query;
    let sql = "SELECT project,Unit_Price,unit,Check_num FROM tbl_Schedule AS P RIGHT JOIN (" +
        " SELECT group_concat(project) project,Unit_Price,unit,Odd_Numbers,Check_num FROM tbl_Maintenance_Project AS M RIGHT JOIN (" +
        " SELECT A.id,pro_id,Odd_Numbers,Check_num FROM tbl_disease_baseinfo AS A left join tbl_disease_list AS B " +
        " ON A.id=B.projects_id" +
        " WHERE branch_id=" + data.branch_id +
        " AND date_FORMAT(Reporting_time,'%Y-%m')='" + data.time + "') AS N" +
        " ON M.id=N.pro_id" +
        " GROUP BY Odd_Numbers) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers" +
        " WHERE StepID=3";
    try {
        let result = await query(sql);
        for (let item of result) {
            item.totalPrice = item.Check_num * item.Unit_Price;
        }
        console.log(result)
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }

})
router.get('/downloadEnd',async function(req,res) {
    let data = req.query;
    
    let sql = "SELECT project,unit,Check_num, Unit_Price FROM tbl_Schedule AS P RIGHT JOIN (" +
        " SELECT group_concat(project) project,Unit_Price,unit,Odd_Numbers,Check_num FROM tbl_Maintenance_Project AS M RIGHT JOIN (" +
        " SELECT A.id,pro_id,Odd_Numbers,Check_num FROM tbl_disease_baseinfo AS A left join tbl_disease_list AS B " +
        " ON A.id=B.projects_id" +
        " WHERE branch_id=" + data.branch_id +
        " AND date_FORMAT(Reporting_time,'%Y-%m')='" + data.time + "') AS N" +
        " ON M.id=N.pro_id" +
        " GROUP BY Odd_Numbers) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers" +
        " WHERE StepID=3";
    try {
        let result = await query(sql);
        console.log(result)
        for (let item of result) {
            item.totalPrice = item.Check_num * item.Unit_Price;
        };
        var data1 = [];
        data1.push(['项目名称、项目特征','计量单位','工程量','费用单价','	合计'])
        if(result)
        {
            for(var i = 0; i < result.length; i++)
            {
                var arr=[];
                var value=result[i];
                for(var j in value){
                    arr.push(value[j]);
                }
                data1.push(arr);
                console.log(data1)
            }
        }
        var buffer = xlsx.build([
            {
                name:'sheet1',
                data:data1
            }
        ]);
        let filename = path.join(__dirname, '../static/')+"明细表-" + new Date().getTime() + ".xlsx"
        fs.writeFileSync(filename,buffer,{'flag':'w'});
        res.json(filename);
    } catch (e) {
        console.log(`select err` + e)
    }
})
//竣工结算 结算资料 工程造价审核定单
router.get('/select_manage_costInformatExamine', async function (req, res) {
    let data = req.query;
    let sql = "SELECT disease_name,Z.Odd_Numbers,branch,bridgename facilitiesname,JG_COST,YS_COST,manage_Sign_time FROM tbl_Schedule AS Z RIGHT JOIN (" +
        " SELECT GROUP_CONCAT(disease_name) disease_name,Odd_Numbers,branch,bridgename,JG_COST,YS_COST,manage_Sign_time FROM tbl_disease AS E RIGHT JOIN(" +
        " SELECT Y.id,disease_curing_id,Odd_Numbers,branch,bridgename,JG_COST,YS_COST,manage_Sign_time FROM tbl_bridge_info AS X RIGHT JOIN(" +
        " SELECT K.id,disease_curing_id,Odd_Numbers,branch,bridge_id,JG_COST,YS_COST,manage_Sign_time FROM branch AS L RIGHT JOIN (" +
        " SELECT Q.id,disease_curing_id,Q.Odd_Numbers,branch_id,bridge_id,JG_COST,Cost YS_COST,manage_Sign_time FROM tbl_Check AS P RIGHT JOIN(" +
        " SELECT N.id,disease_curing_id,N.Odd_Numbers,branch_id,bridge_id,Cost JG_COST FROM tbl_Completion_declaration AS M RIGHT JOIN (" +
        " SELECT A.id,disease_curing_id,Odd_Numbers,branch_id,bridge_id FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B " +
        " ON A.id=B.project_id" +
        " WHERE branch_id=" + data.branch_id +
        " AND date_FORMAT(Reporting_time,'%Y-%m')='" + data.time + "') AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS K" +
        " ON L.id=K.branch_id) AS Y" +
        " ON X.BridgeID=Y.bridge_id) AS R" +
        " ON E.id=R.disease_curing_id" +
        " GROUP BY Odd_Numbers) AS C" +
        " ON Z.Odd_Numbers=C.Odd_Numbers" +
        " WHERE StepID=3";
    try {
        let result = await query(sql);
        for (let item of result) {
            if(item.manage_Sign_time !=='0000-00-00 00:00:00') {
                item.manage_Sign_time = get_date_str(new Date(item.manage_Sign_time))
            }
            
        };
        res.json(result);
    } catch (e) {
        console.log(`select err` + e)
    }
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
router.get('/downloadFile',async function (req,res) {
    let data = req.query;
    let sql = "SELECT Z.Odd_Numbers,bridgename facilitiesname,disease_name,branch,YS_COST,manage_Sign_time FROM tbl_Schedule AS Z RIGHT JOIN (" +
        " SELECT GROUP_CONCAT(disease_name) disease_name,Odd_Numbers,branch,bridgename,YS_COST,manage_Sign_time FROM tbl_disease AS E RIGHT JOIN(" +
        " SELECT Y.id,disease_curing_id,Odd_Numbers,branch,bridgename,YS_COST,manage_Sign_time FROM tbl_bridge_info AS X RIGHT JOIN(" +
        " SELECT K.id,disease_curing_id,Odd_Numbers,branch,bridge_id,YS_COST,manage_Sign_time FROM branch AS L RIGHT JOIN (" +
        " SELECT Q.id,disease_curing_id,Q.Odd_Numbers,branch_id,bridge_id,Cost YS_COST,manage_Sign_time FROM tbl_Check AS P RIGHT JOIN(" +
        " SELECT N.id,disease_curing_id,N.Odd_Numbers,branch_id,bridge_id FROM tbl_Completion_declaration AS M RIGHT JOIN (" +
        " SELECT A.id,disease_curing_id,Odd_Numbers,branch_id,bridge_id FROM tbl_disease_baseinfo AS A left join tbl_disease_Restoration AS B" +
        " ON A.id=B.project_id" +
        " WHERE branch_id=" + data.branch_id +
        " AND date_FORMAT(Reporting_time,'%Y-%m')='" + data.time + "') AS N" +
        " ON M.Odd_Numbers=N.Odd_Numbers) AS Q" +
        " ON P.Odd_Numbers=Q.Odd_Numbers) AS K" +
        " ON L.id=K.branch_id) AS Y" +
        " ON X.BridgeID=Y.bridge_id) AS R" +
        " ON E.id=R.disease_curing_id" +
        " GROUP BY Odd_Numbers) AS C" +
        " ON Z.Odd_Numbers=C.Odd_Numbers" +
        " WHERE StepID=3";
        try {
            let result = await query(sql);
            console.log(result)
            for (let item of result) {
                if(item.manage_Sign_time !=='0000-00-00 00:00:00') {
                    item.manage_Sign_time = get_date_str(new Date(item.manage_Sign_time))
                }
            };
            var data1 = [];
            data1.push(['单号','设施名称','病害','养护公司','金额','时间'])
            if(result)
            {
                for(var i = 0; i < result.length; i++)
                {
                    var arr=[];
                    var value=result[i];
                    for(var j in value){
                        arr.push(value[j]);
                    }
                    data1.push(arr);
                    console.log(data1)
                }
            }
            var buffer = xlsx.build([
                {
                    name:'sheet1',
                    data:data1
                }
            ]);
            let filename = path.join(__dirname, '../static/')+"审核订单明细表-" + new Date().getTime() + ".xlsx"
            fs.writeFileSync(filename,buffer,{'flag':'w'});
            res.json(filename);
        } catch (e) {
            console.log(`select err` + e)
        }
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
})
router.post('/select_thermogram', async function (req,res) {
    let data = req.body;
    let sql1, sql2;
    let demoData=[[
        {"coord": [120.14322240845, 30.236064370321], "elevation": 21}, {
            "coord": [120.14280555506, 30.23633761213],
            "elevation": 5
        }, {"coord": [120.14307598649, 30.236125905084], "elevation": 30.7}, {
            "coord": [120.14301682797, 30.236035316745],
            "elevation": 15.4
        }, {"coord": [120.1428734612, 30.236160551632], "elevation": 1.6}, {
            "coord": [120.14200215328, 30.23595702204],
            "elevation": 8.9
        }, {"coord": [120.14138577045, 30.236113748704], "elevation": 18.4}, {
            "coord": [120.1400398833, 30.235973050702],
            "elevation": 19
        }, {"coord": [120.13893453465, 30.23517220446], "elevation": 12.6}, {
            "coord": [120.1382899739, 30.234062922977],
            "elevation": 17.7
        }, {"coord": [120.13634057665, 30.233446752432], "elevation": 24.5}, {
            "coord": [120.13413680453, 30.232112168844],
            "elevation": 37.8
        }, {"coord": [120.13333353311, 30.232145779364], "elevation": 48.7}, {
            "coord": [120.13306479103, 30.231759284837],
            "elevation": 63.7
        }, {"coord": [120.13265960629, 30.231641351722], "elevation": 32.3}, {
            "coord": [120.1327455782, 30.231430284343],
            "elevation": 81.9
        }, {"coord": [120.13218153673, 30.230180120187], "elevation": 114.1}, {
            "coord": [120.13170681763, 30.229925745619],
            "elevation": 125.3
        }, {"coord": [120.13140700148, 30.229576173509], "elevation": 128}, {
            "coord": [120.13119614803, 30.228996846637],
            "elevation": 161.2
        }, {"coord": [120.13066649155, 30.228846445356], "elevation": 176}, {
            "coord": [120.13023980134, 30.228226570416],
            "elevation": 198.1
        }, {"coord": [120.12989250643, 30.228177899345], "elevation": 213.1}, {
            "coord": [120.1297674531, 30.227895075522],
            "elevation": 226.1
        }, {"coord": [120.12941575407, 30.228596968401], "elevation": 244.8}, {
            "coord": [120.12900512996, 30.228293967376],
            "elevation": 253.7
        }, {"coord": [120.12920653848, 30.228281493076], "elevation": 258.5}, {
            "coord": [120.12914997592, 30.22811126636],
            "elevation": 256.9
        }, {"coord": [120.12887629039, 30.227990425169], "elevation": 244.7}, {
            "coord": [120.12797286481, 30.228127070174],
            "elevation": 235.4
        }, {"coord": [120.12749160626, 30.228348006385], "elevation": 234.9}, {
            "coord": [120.12728472245, 30.228132519108],
            "elevation": 221.7
        }, {"coord": [120.12725816563, 30.227718527678], "elevation": 206.5}, {
            "coord": [120.12699742758, 30.227225482569],
            "elevation": 199.4
        }, {"coord": [120.12705029341, 30.226639976046], "elevation": 190.2}, {
            "coord": [120.12620458002, 30.225849596694],
            "elevation": 186.2
        }, {"coord": [120.12629723613, 30.225609780737], "elevation": 175.1}, {
            "coord": [120.12611630111, 30.225592655172],
            "elevation": 179.4
        }, {"coord": [120.12623751461, 30.225514547091], "elevation": 194.1}, {
            "coord": [120.12569412003, 30.225289138515],
            "elevation": 167.6
        }, {"coord": [120.1260081246, 30.225109979145], "elevation": 160.7}, {
            "coord": [120.12428900347, 30.224907917069],
            "elevation": 155.3
        }, {"coord": [120.1233608862, 30.224531990576], "elevation": 167.9}, {
            "coord": [120.12328968155, 30.225342953599],
            "elevation": 172.4
        }]];
    if (data.time.length == 4) {
        sql1 = "SELECT COUNT(MIN) coun,MIN,longitude,latitude FROM(" +
            " SELECT CONCAT(lon,lat) MIN,longitude,latitude FROM(" +
            " SELECT N.id,left(longitude,5) lon,left(latitude,5) lat,longitude,latitude FROM tbl_disease_Restoration AS M RIGHT JOIN(" +
            " SELECT id FROM tbl_disease_baseinfo AS A RIGHT JOIN (" +
            " SELECT bridgeid FROM tbl_bridge_info WHERE manageid=" +data.uid+ ") AS B" +
            " ON A.bridge_id=B.bridgeid" +
            " WHERE facilities_type='0'" +
            " AND DATE_FORMAT(Reporting_time,'%Y')='" + data.time +"') AS N" +
            " ON M.project_id=N.id" +
            " )c)d" +
            " GROUP BY MIN";
        sql2 = "SELECT COUNT(MIN) coun,MIN,longitude,latitude FROM(" +
            " SELECT CONCAT(lon,lat) MIN,longitude,latitude FROM(" +
            " SELECT N.id,left(longitude,5) lon,left(latitude,5) lat,longitude,latitude FROM tbl_disease_Restoration AS M RIGHT JOIN(" +
            " SELECT id FROM tbl_disease_baseinfo AS A RIGHT JOIN (" +
            " SELECT PassagewayID FROM tbl_passageway_info WHERE manageid=" +data.uid+ ") AS B" +
            " ON A.bridge_id=B.PassagewayID" +
            " WHERE facilities_type='1'" +
            " AND DATE_FORMAT(Reporting_time,'%Y')='" + data.time +"') AS N" +
            " ON M.project_id=N.id" +
            " )c)d" +
            " GROUP BY MIN";
    }
    else {
        sql1 = "SELECT COUNT(MIN) coun,MIN,longitude,latitude FROM(" +
            " SELECT CONCAT(lon,lat) MIN,longitude,latitude FROM(" +
            " SELECT N.id,left(longitude,5) lon,left(latitude,5) lat,longitude,latitude FROM tbl_disease_Restoration AS M RIGHT JOIN(" +
            " SELECT id FROM tbl_disease_baseinfo AS A RIGHT JOIN (" +
            " SELECT bridgeid FROM tbl_bridge_info WHERE manageid=" +data.uid+ ") AS B" +
            " ON A.bridge_id=B.bridgeid" +
            " WHERE facilities_type='0'" +
            " AND DATE_FORMAT(Reporting_time,'%Y-%m')='" + data.time +"') AS N" +
            " ON M.project_id=N.id" +
            " )c)d" +
            " GROUP BY MIN";
        sql2 = "SELECT COUNT(MIN) coun,MIN,longitude,latitude FROM(" +
            " SELECT CONCAT(lon,lat) MIN,longitude,latitude FROM(" +
            " SELECT N.id,left(longitude,5) lon,left(latitude,5) lat,longitude,latitude FROM tbl_disease_Restoration AS M RIGHT JOIN(" +
            " SELECT id FROM tbl_disease_baseinfo AS A RIGHT JOIN (" +
            " SELECT PassagewayID FROM tbl_passageway_info WHERE manageid=" +data.uid+ ") AS B" +
            " ON A.bridge_id=B.PassagewayID" +
            " WHERE facilities_type='1'" +
            " AND DATE_FORMAT(Reporting_time,'%Y-%m')='" + data.time +"') AS N" +
            " ON M.project_id=N.id" +
            " )c)d" +
            " GROUP BY MIN";
    }
    try {
        let res1 = await query(sql1);
        let res2 = await query(sql2);
        let result = res1.concat(res2);
        let tmpArr = [];
        let resArr = [];
        for(let i=0;i<result.length;i++) {
            let tmp = {};
            tmp.coord =[];
            tmp.coord.push(result[i].longitude);
            tmp.coord.push(result[i].latitude);
            tmp.elevation = result[i].coun;
            tmpArr.push(tmp);
        }
        resArr.push(tmpArr);
        res.json(demoData);
    } catch (e) {
        console.log('get data err' + e);
    }
})
module.exports = router;