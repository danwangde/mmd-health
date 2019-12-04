const express = require('express');

const router = express.Router();

const query = require('myMysql');

const mapData = require('map');

//返回当前结构可选的构件类型
router.get('/selType', async function (req, res) {
    console.log("req.query1");
    console.log(req.query);
    let sql;
    try {
        if (req.query.type == '001001') {
            sql = `select ComponentTypeName from mmp.tbl_evaluate where MainStructType='${req.query.MainStructType}'`;
        } else {
            sql = `select ComponentTypeName from mmp.componenttype where SuperStructure='${req.query.type}'`;
        }

        let result = await query(sql);
        res.json(result);
    } catch (e) {
        console.log('insert data err' + e);
    }

})
//返回评价项和属性信息
router.get('/selpub', async function (req, res) {
    console.log("req.query");
    console.log(req.query);
    let reseval;
    let evalarrfin;
    let evaluate; //compname
    try {
        if (req.query.SuperStructure == '001001') {
            let sql = `select evalitem from tbl_evaluate where MainStructType='${req.query.MainStructType}' and ComponentTypeName='${req.query.ComponentTypeName}'`;
            reseval = await query(sql);
            let evalarr = reseval[0].evalitem.split(',');
            evalarrfin = evalarr.map(function (item) {

                return mapData.evalDataMap.get(item);
            })

            console.log(evalarrfin);
            evaluate = evalarrfin.map(function (item, index) {
                let obj = {};
                obj.id = index + 1;
                obj.name = item;
                obj.select = false;
                return obj;
            })
        }
        let comattr_sql = `select attrid, attrname,showtype,showvalue from mmp.tbl_componattr where ComponentTypeID in (select ComponentTypeID from mmp.componenttype where ComponentTypeName='${req.query.ComponentTypeName}')`;
        let resattr = await query(comattr_sql);
        console.log(resattr);

        let attrarr = resattr.map(function (item) {
            item.showvalue = item.showvalue.split(',');
            item.showvalue = item.showvalue.map(function (item1, index) {
                let obj = {};
                if (item.showtype == '031001') {
                    obj.id = index + 1;
                    obj.name = item1;
                } else if (item.showtype == '031002') {
                    obj.select = false;
                    obj.name = item1;
                } else if (item.showtype == '031004') {
                    obj.name = item1;
                }
                return obj;
            })
            return item;
        })

        //console.log(evalarr);



        let objData = {};
        objData.evaluate = evaluate;
        objData.resattr = attrarr;
        console.log(objData);
        res.json(objData);
    } catch (e) {
        res.json(0);
        console.log('get data err' + e);
    }
})
//构件信息的新增
router.post('/add', async function (req, res) {
    console.log("/add")
    console.log(req.body)
    let data = req.body;
    let eval = '';
    if (data.SuperStructure == '001001') {
        data.evalvalue = data.evalvalue.map(function (item) {
            item.name = mapData.evalMap.get(item.name)
            return item;
        })
        console.log(data.evalvalue);
        for (let item of data.evalvalue) {
            console.log(item);
            if (item.select) {
                eval += item.name;
                eval += ',';
            }
        }
        console.log(eval);
        eval = eval.substring(0, eval.length - 1);
    }

    try {
        let sql = `insert into mmp.tbl_bridge_component(BridgeLineID,SuperStructure,StructureID,ComponentNum,ComponentName,ComponentTypeName,evalvalue) values(${data.BridgeLineID},'${data.SuperStructure}',${data.StructureID},'${data.ComponentNum}','${data.ComponentName}','${data.ComponentTypeName.ComponentTypeName}','${eval}')`;

        let result = await query(sql);
        let com_sql = `select ComponentID from mmp.tbl_bridge_component order by ComponentID desc limit 0,1`;
        let res_com = await query(com_sql);

        //循环遍历给构件-属性表插入数据

        for (let index of data.comattr.keys()) {
            let attr = '';
            for (let i of data.comattr[index].showvalue) {
                if (data.comattr[index].showtype == '031004') {
                    attr = i.name;
                } else if (data.comattr[index].showtype == '031002' && i.select) {
                    attr += i.name;
                    attr += ',';

                }
                if (data.comattr[index].showtype == '031001') {
                    attr = data.comattr[index].select.name;
                }
            }
            if (data.comattr[index].showtype == '031002') {
                attr = attr.substring(0, attr.length - 1);
            }



            let attr_sql = `insert into mmp.tbl_com_attr(attrname,showvalue,ComponentID,showtype) values('${data.comattr[index].attrname}','${attr}',${res_com[0].ComponentID},'${data.comattr[index].showtype}')`;
            let res_attr = await query(attr_sql);
        }
        res.json(1);
    } catch (e) {
        console.log('get data err' + e);
        res.json(0);
    }
})
//查表显示当前构件信息
router.get('/select', async function (req, res) {
    console.log("select")
    console.log(req.query);
    let sql;
    let eval_sql;
    let evaluate;
    let evalfin;
    let result;
    try {
        if (req.query.SuperStructure == '001001') {
            sql = `select ComponentTypeName,ComponentNum,ComponentName,evalvalue from mmp.tbl_bridge_component where ComPonentID=${req.query.ComponentID}`;
            console.log(sql)
            result = await query(sql);
            eval_sql = `select evalitem from tbl_evaluate where MainStructType='${req.query.MainStructType}' and ComponentTypeName='${result[0].ComponentTypeName}'`;
            let res_eval = await query(eval_sql);
            console.log(res_eval)
            /* .........................................................................构件信息及评价项*/
            evaluate = res_eval[0].evalitem.split(',').map(function (item, index) {
                let obj = {};
                obj.id = index + 1;
                obj.name = item;
                if (result[0].evalvalue.match(item)) {
                    obj.select = true;
                } else {
                    obj.select = false;
                }

                return obj;
            })
            evalfin = evaluate.map(function (item) {
                item.name = mapData.evalDataMap.get(item.name);
                return item
            })
            result[0].evalvalue = evalfin;
        }else{
            sql =`select ComponentTypeName,ComponentNum,ComponentName from mmp.tbl_bridge_component where ComPonentID=${req.query.ComponentID}`;
            result = await query(sql);
            
        }
        console.log(sql);
        let comattr_sql = `select id,attrname,showvalue,showtype from mmp.tbl_com_attr where ComPonentID=${req.query.ComponentID}`;

       

        /*......................................................................................查属性表 */

        let attr_sql = `select attrid, attrname,showtype,showvalue from mmp.tbl_componattr where ComponentTypeID in (select ComponentTypeID from mmp.componenttype where ComponentTypeName='${result[0].ComponentTypeName}')`;
        console.log(attr_sql)
        let resattr = await query(attr_sql);
        console.log(resattr)

        let attrarr1 = resattr.map(function (item) {
            item.showvalue = item.showvalue.split(',');
            item.showvalue = item.showvalue.map(function (item1, index) {
                let obj = {};
                if (item.showtype == '031001') {
                    obj.id = index + 1;
                    obj.name = item1;
                    obj.select = false;
                } else if (item.showtype == '031002') {
                    obj.select = false;
                    obj.name = item1;
                } else if (item.showtype == '031004') {
                    obj.name = item1;
                }
                return obj;
            })
            return item;
        })
        console.log(attrarr1);
        /* .........................................................................属性信息*/
        let res_comattr = await query(comattr_sql);
        console.log(res_comattr);
        let attrarr = res_comattr.map(function (item, index) {



            item.showvalue = item.showvalue.split(',');
            item.showvalue = item.showvalue.map(function (item1, i) {
                let obj = {};
                if (item.showtype == '031001') {
                    for (let item2 of attrarr1[index].showvalue) {
                        if (item1.match(item2.name)) {
                            obj.id = item2.id;
                            obj.name = item1;
                            item2.select = true;
                        }
                    }
                } else if (item.showtype == '031002') {
                    obj.name = item1;
                    if (item1) {
                        obj.select = true;
                    } else {
                        obj.select = false;
                    }

                } else if (item.showtype == '031004') {
                    obj.name = item1;
                }

                return obj;
            })

            if (item.showtype == '031001') {
                let data = item.showvalue;
                item.showvalue = attrarr1[index].showvalue;
                item.select = data[0].name;
            }
            if (item.showtype == '031002') {
                for (let index3 of attrarr1[index].showvalue.keys()) {
                    for (let index4 of item.showvalue.keys()) {
                        if (attrarr1[index].showvalue[index3].name == item.showvalue[index4].name) {
                            attrarr1[index].showvalue[index3].select = item.showvalue[index4].select;
                        }
                    }

                }
                item.showvalue = attrarr1[index].showvalue;
            }
            return item;
        })

        let obj = {};
        obj.res = result[0];
        obj.rescom = attrarr;
        console.log(obj);
        res.json(obj);
    } catch (e) {
        console.log('get data err' + e);
    }
})
//构件信息的修改
router.post('/update', async function (req, res) {
    console.log(req.body);
    let data = req.body;
    let eval = '';
    if(data.SuperStructure=='001001'){
        data.evalvalue = data.evalvalue.map(function (item) {
            item.name = mapData.evalMap.get(item.name)
            return item;
        })
        console.log(data.evalvalue);
        for (let item of data.evalvalue) {
            console.log(item);
            if (item.select) {
                eval += item.name;
                eval += ',';
            }
        }
        console.log(eval);
        eval = eval.substring(0, eval.length - 1);
    }
   
    try {
        let sql = `update mmp.tbl_bridge_component set ComponentNum='${data.ComponentNum}', ComponentName='${data.ComponentName}',evalvalue='${eval}' where ComponentID=${data.ComponentID}`;
        let result = await query(sql);

        for (let index of data.comattr.keys()) {
            let attr = '';
            for (let i of data.comattr[index].showvalue) {
                if (data.comattr[index].showtype == '031004') {
                    attr = i.name;
                } else if (data.comattr[index].showtype == '031002' && i.select) {
                    attr += i.name;
                    attr += ',';

                }
                if (data.comattr[index].showtype == '031001') {
                    attr = data.comattr[index].select;
                }
            }
            if (data.comattr[index].showtype == '031002') {
                attr = attr.substring(0, attr.length - 1);
            }


            let attr_sql = `update mmp.tbl_com_attr set attrname='${data.comattr[index].attrname}', showvalue='${attr}',showtype='${data.comattr[index].showtype}' where id=${data.comattr[index].id}`;
            let res_attr = await query(attr_sql);
        }
        res.json(1);
    } catch (e) {
        console.log('get data err' + e);
        res.json(0);
    }
})
//构件信息的删除
router.get('/deleteCom', async function (req, res) {
    let sql = `delete from mmp.tbl_bridge_component where ComponentID=${req.query.ComponentID}`;
    let comattr_sql = `delete from mmp.tbl_com_attr where ComponentID=${req.query.ComponentID}`;
    try {
        let result = await query(sql);
        let res_comattr = await query(comattr_sql);
        Promise.all([result, res_comattr]).then(function (value) {
            console.log(value);
            res.json(1);
        })
    } catch (e) {
        console.log('insert data err' + e);
        res.json(0);
    }
})

module.exports = router;