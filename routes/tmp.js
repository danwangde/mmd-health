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
        " AND facilities_type='1' AND Odd_Numbers IS NOT NULL AND date_format(Reporting_time,'%Y')='"+ data.time +"')AS N" +
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
        " AND facilities_type='0' AND Odd_Numbers IS NOT NULL AND date_format(Reporting_time,'%Y')='"+ data.time +"')AS N" +
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