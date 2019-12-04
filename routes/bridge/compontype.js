const express = require('express');

const router = express.Router();

const query = require('myMysql');
//构件类型基本信息
router.get('/select', async function (req, res) {
    let sql = `select  ComponentTypeID,ComponentType,SuperStructure,ComponentTypeName,SuperBridgeAttr,Attrtype from mmp.componenttype`;
    try {
        let result = await query(sql);
        res.json(result);
    } catch (e) {
        console.log('get data err' + e);
    }
});
//属性信息
router.get('/selattr', async function (req, res) {
    try {
        let sql_attr = `select attrid,attrname,showtype,showvalue from tbl_componattr where ComponentTypeID=${req.query.ComponentTypeID} order by attrid asc`;
        let res_attr = await query(sql_attr);
        res.json(res_attr);
    } catch (e) {
        console.log('get data err' + e);
    }
});
//权重信息
router.get('/selweight', async function (req, res) {
    try {
        let sql_weight = `select typename,weightval from tbl_weight where ComponentTypeID=${req.query.ComponentTypeID}`;
        let res_weight = await query(sql_weight);
        res.json(res_weight);
    } catch (e) {
        console.log('get data err' + e);
    }
});
//新增构件类型（属性+权重+基本数据）
router.post('/add', async function (req, res) {
    let datacom = req.body.datacom;
    let datattr = req.body.dataattr;
    let sql = `insert into mmp.componenttype(ComponentType,ComponentTypeName,SuperStructure,Attrtype,SuperBridgeAttr) values('${datacom.ComponentType}','${datacom.ComponentTypeName}','${datacom.SuperStructure}','${datacom.Attrtype}','${datacom.SuperBridgeAttr}')`;
    try {
        let result = await query(sql);
        //查数据库里面最后一条数据的ID
        let final_sql = `select ComponentTypeID from mmp.componenttype order by ComponentTypeID desc limit 0,1`;
        let res_final = await query(final_sql);
        if (datacom.ComponentType === '030001') { //根基构件类型判断权重表加几条数据
            let weight_sql = `insert into mmp.tbl_weight(ComponentTypeID,typename,weightval) values
                                (${res_final[0].ComponentTypeID},'035001',''),
                                (${res_final[0].ComponentTypeID},'035002',''),
                                (${res_final[0].ComponentTypeID},'035003',''),
                                (${res_final[0].ComponentTypeID},'035004',''),
                                (${res_final[0].ComponentTypeID},'035005',''),
                                (${res_final[0].ComponentTypeID},'035006',''),
                                (${res_final[0].ComponentTypeID},'035007',''),
                                (${res_final[0].ComponentTypeID},'035008',''),
                                (${res_final[0].ComponentTypeID},'035009',''),
                                (${res_final[0].ComponentTypeID},'035010','')`;
            let res_weight = await query(weight_sql);
        } else if (datacom.ComponentType === '030002') {
            let weight_sql = `insert into mmp.tbl_weight(ComponentTypeID,typename,weightval) values
                                (${res_final[0].ComponentTypeID},'${datacom.ComponentTypeName}','')`;
            let res_weight = await query(weight_sql);
        }
        //根据前台传的数组遍历给属性数据库里添加数据
        for (let item of datattr) {
            let attr_sql = `insert into mmp.tbl_componattr(ComponentTypeID,attrname,showtype,showvalue) values(${res_final[0].ComponentTypeID},'${item.attrname}','${item.showtype}','${item.showvalue}')`;
            let res_attr = await query(attr_sql);
        }
        res.json(1);

    } catch (e) {
        res.json(0);
    }
})
//修改构件类型（权重）
router.post('/updateweight', async function (req, res) {
    let data = req.body;//前台传一个对象
    console.log(data)
    let dataweight = data.weightData;
    try {
        if (data.ComponentType === '030001') { //根据构件类型修改权重表的几条或一条数据
            let sql = `update mmp.tbl_weight
                        set weightval = case typename
                        when '035001' then '${dataweight[0].weightval}'
                        when '035002' then '${dataweight[1].weightval}'
                        when '035003' then '${dataweight[2].weightval}'
                        when '035004' then '${dataweight[3].weightval}'
                        when '035005' then '${dataweight[4].weightval}'
                        when '035006' then '${dataweight[5].weightval}'
                        when '035007' then '${dataweight[6].weightval}'
                        when '035008' then '${dataweight[7].weightval}'
                        when '035009' then '${dataweight[8].weightval}'
                        when '035010' then '${dataweight[9].weightval}'
                        end
                   where  ComponentTypeID=${data.ComponentTypeID}`;
            let res_sql = await query(sql);
        } else if (data.ComponentType === '030002') {
            let sql = `update mmp.tbl_weight set weightval='${dataweight[0].weightval}' where  ComponentTypeID=${data.ComponentTypeID}`;
            let res_sql = await query(sql);
        }
        res.json(1);
    } catch (e) {
        res.json(0);
    }
});
//修改构件类型（属性）
router.post('/updateattr', async function (req, res) {
    console.log(req.body);
    console.log(req.body.datacom)
    console.log(req.body.dataattr)
    let datacom = req.body.datacom; //对象
    let datattr = req.body.dataattr; //对象数组
    try {
        let updateSql = `update mmp.componenttype set ComponentTypeName='${datacom.ComponentTypeName}' where ComponentTypeID=${datacom.ComponentTypeID}`
        console.log(updateSql)
        let res_update = await query(updateSql);
        let delSql = 'delete from mmp.tbl_componattr  where ComponentTypeID='+datacom.ComponentTypeID;
        let resDel = await query(delSql);
        for (let item of datattr) {
            let sql = `insert into mmp.tbl_componattr(attrname,showtype,showvalue,ComponentTypeID) values('${item.attrname}','${item.showtype}','${item.showvalue}','${datacom.ComponentTypeID}')`;
            console.log(sql);
            let res_sql = await query(sql);
        }
        res.json(1);
    } catch (e) {
        res.json(0);
    }
});
router.get('/delete_attr', async function (req,res) {
    let sql = `delete from  mmp.tbl_componattr where ComponentTypeID=${data.ComponentTypeID}`;
    try{
        let result = await query(sql);
        res.json(1)
    }catch(e){
        console.log('delete data err' +e);
        res.json(0);
    }
});
//删除构件类型
router.get('/delete', async function (req, res) {
    let data = req.query;
    //分别删除构件类型表、属性表、权重表
    let sqlcom = `delete from  mmp.componenttype where ComponentTypeID=${data.ComponentTypeID}`;
    let sqlattr = `delete from  mmp.tbl_componattr where ComponentTypeID=${data.ComponentTypeID}`;
    let sqlweight = `delete from  mmp.tbl_weight where ComponentTypeID=${data.ComponentTypeID}`;
    try {
        let res_com = await query(sqlcom);
        let res_attr = await query(sqlattr);
        let res_weight = await query(sqlweight);
        //三张表删除同时满足成功，返回1
        Promise.all([res_com, res_attr, res_weight]).then(function (value) {
            console.log(value);
            res.json(1);
        })
    } catch (e) {
        res.json(0)
    }

})

module.exports = router;
