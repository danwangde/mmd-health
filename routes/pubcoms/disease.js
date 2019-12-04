const express = require('express');
const router = express.Router();
const query = require('myMysql');


router.get('/select', async function (req, res) {
    let sql = `select DiseaseID, DiseaseType, Type, CompType, DamageType, DiseaseDefine, DamageExplain, RelateSites from mmp.disease`;
    try {
        let result = await query(sql);
        res.json(result);
    } catch (e) {
        console.log('get data err' + e);
    }
})

//增加病害+损坏程度，扣分值
router.post('/add', async function (req, res) {
    let datadis = req.body.datadis;
    let datascore = req.body.datascore;
    let comType;
    if (datadis.RelateSites && datadis.RelateSites == '105001') {
        comType = datadis.CompType;
    } else {
        comType = datadis.CompType.ComponentTypeName;
    }
    let sql = `insert into mmp.disease(DiseaseType,Type,RelateSites,CompType,DamageType,DiseaseDefine,DamageExplain) values('市政桥梁病害库','${datadis.Type}','${datadis.RelateSites}','${comType}','${datadis.DamageType}','${datadis.DiseaseDefine}','${datadis.DamageExplain}')`;
    console.log(sql)
    try {
        let result = await query(sql);
        let sel_sql = `select DiseaseID from mmp.disease order by DiseaseID desc limit 0,1`;
        let res_sql = await query(sel_sql);
        for (let item of datascore) {
            let score_sql = `insert into mmp.tbl_disease_score(DiseaseID,DamGrade,Score) values(${res_sql[0].DiseaseID},'${item.DamGrade}','${item.Score}')`;
            console.log(score_sql);
            let res_score = await query(score_sql);
        }
        res.json(1);
    } catch (e) {
        console.log('data' + e);
        res.json(0);
    }
})

function Obj(id, name, select) {
    this.id = id;
    this.name = name;
    this.select = select;
}

router.get('/selCom', async function (req, res) {
    let sql = `select ComponentTypeName from mmp.componenttype where ComponentType='${req.query.type}' and SuperStructure <> '001001'`;
    console.log(sql)
    try {
        let result = await query(sql);

        res.json(result);
    } catch (e) {
        console.log('get data err' + e);
    }
})
router.get('/selComPas', async function (req, res) {
    let sql = `select ComponentTypeName from mmp.componenttype where ComponentType='${req.query.type}'`;
    console.log(sql)
    try {
        let result = await query(sql);

        res.json(result);
    } catch (e) {
        console.log('get data err' + e);
    }
})
//构件类型返回值
router.get('/selComData', async function (req, res) {
    let data = req.query;
    console.log(data)
    let sql = `select ComponentTypeName from mmp.componenttype where ComponentType='${req.query.type}' and SuperStructure <> '001001'`;
    let obj = {};
    try {
        let result = await query(sql);
        let resCom = result.map((item, index) => {
            let com = new Obj(index + 1, item.ComponentTypeName);
            if (data.CompType.match(item.ComponentTypeName)) {
                com.select = true;
            } else {
                com.select = false;
            }
            return com;
        })
        obj.select = data.CompType;
        obj.component = resCom;
        res.json(obj);
    } catch (e) {
        console.log('get data err' + e);
    }
})

router.get('/selComDataPass', async function (req, res) {
    let data = req.query;
    console.log(data)
    let sql = `select ComponentTypeName from mmp.componenttype where ComponentType='${req.query.type}'`;
    let obj = {};
    try {
        let result = await query(sql);
        let resCom = result.map((item, index) => {
            let com = new Obj(index + 1, item.ComponentTypeName);
            if (data.CompType.match(item.ComponentTypeName)) {
                com.select = true;
            } else {
                com.select = false;
            }
            return com;
        })
        obj.select = data.CompType;
        obj.component = resCom;
        res.json(obj);
    } catch (e) {
        console.log('get data err' + e);
    }
})


// 损坏程度、扣分值
router.get('/selScore', async function (req, res) {
    console.log(req.query.DiseaseID)
    try {
        let sql_score = `select id,DamGrade,Score from tbl_disease_score where DiseaseID=${req.query.DiseaseID} group by id asc`;
        let res_weight = await query(sql_score);
        res_weight = res_weight.sort(compare('id', false))
        res.json(res_weight);
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

//修改病害+损坏程度，扣分值
router.post('/update', async function (req, res) {
    let data = req.body;
    let datadis = req.body.datadis;
    let datascore = req.body.datascore;
    let comData;
    console.log(data);
    if (!datadis.RelateSites) {
        datadis.RelateSites = '';
    }

    if (datadis.RelateSites && datadis.RelateSites == '105001') {
        comData = datadis.CompType
    } else {
        comData = data.select;
    }
    try {
        let sql = `update mmp.disease set Type='${datadis.Type}', RelateSites='${datadis.RelateSites}', CompType='${comData}',  DamageType='${datadis.DamageType}',  DiseaseDefine='${datadis.DiseaseDefine}',  DamageExplain='${datadis.DamageExplain}' where DiseaseID=${datadis.DiseaseID}`;
        let result = await query(sql);
        let delSql = `delete from tbl_disease_score where DiseaseID=${datadis.DiseaseID}`;
        let del_res = await query(delSql);
        for(let item of datascore){
            console.log(datascore)
            let score_sql = `insert into  mmp.tbl_disease_score(DamGrade,Score,DiseaseID) values('${item.DamGrade}','${item.Score}',${datadis.DiseaseID})`;
            console.log(score_sql)
            let res_score = await query(score_sql);
        }
        res.json(1)
    } catch (e) {
        res.json(0);
    }

})
//删除病害+损坏程度，扣分值
router.get('/delete', async function (req, res) {
    let sql = `delete from mmp.disease where DiseaseID=${req.query.DiseaseID}`;
    let score_sql = `delete from mmp.tbl_disease_score where DiseaseID=${req.query.DiseaseID}`;
    try {
        let res_dis = await query(sql);
        let res_score = await query(score_sql);
        //三张表删除同时满足成功，返回1
        Promise.all([res_dis, res_score]).then(function (value) {
            res.json(1);
        })
    } catch (e) {
        res.json(0)
    }
})

module.exports = router;