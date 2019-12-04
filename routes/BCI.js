const express = require('express');
const router = express.Router();
const query = require('myMysql');

function Structure_BCI(Structure_map) {
    let BCI = 0
    for(let oneStructure of Structure_map.values()){
        for(let oneComponent of oneStructure.values()){
            let MDP = 0;
            let DP_sum = 0;

            for(let oneScore of oneComponent.evaluate_arr){
                DP_sum += oneScore;
            }
            for(let oneScore of oneComponent.evaluate_arr)
            {
                let u = oneScore/DP_sum;
                let k = 3.0*u*u*u - 5.5*u*u + 3.5*u;
                MDP += oneScore * k;
            }
            if(MDP > 100){
                MDP = 100;
            }
            else{
                let max_DP  = Math.max.apply(Math, oneComponent.evaluate_arr);
                MDP = MDP > max_DP? MDP: max_DP;
            }
            BCI += (100 - MDP) * oneComponent.weightval;
        }
    }
    return BCI;
}

router.get('/calc', async function (req,res) {
    let check_id = req.query.check_id;
    let sql = "SELECT tbl_BCI.component_id, \
                    tbl_BCI.disease_id,\
                    tbl_BCI.disease_level,\
                    tbl_BCI.evaluate_id,\
                    tbl_BCI.Score,\
                    tbl_BCI.BridgeLineID,\
                    tbl_BCI.SuperStructure,\
                    tbl_BCI.StructureID,\
                    tbl_BCI.weightval\
                FROM\
                    tbl_BCI\
                WHERE\
                     tbl_BCI.check_id = " + check_id;
    console.log(sql);
    let disease_arr = await  query(sql);
    let disease_map = new Map();
    //构造病害树
    for(let disease of disease_arr){
        if(!disease_map.has(disease.BridgeLineID)){
            let SuperStructrue = new Map();
            disease_map.set(disease.BridgeLineID, SuperStructrue);
        }
        let SuperStructure_map = disease_map.get(disease.BridgeLineID);
        if(!SuperStructure_map.has(disease.SuperStructure)){
            let Structure = new Map();
            SuperStructure_map.set(disease.SuperStructure, Structure);
        }
        let Structure_map = SuperStructure_map.get(disease.SuperStructure);
        if(!Structure_map.has(disease.StructureID)){
            let Component = new Map();
            Structure_map.set(disease.StructureID, Component);
        }
        let Component_map = Structure_map.get(disease.StructureID);
        if(!Component_map.has(disease.component_id)){
            let oneComponent = new Object();
            oneComponent.weightval = disease.weightval;
            oneComponent.evaluate_arr = new Array();
            Component_map.set(disease.component_id, oneComponent);
        }

        let evaluate_arr = Component_map.get(disease.component_id).evaluate_arr;
        evaluate_arr.push(disease.Score);
        console.log(Component_map.get(disease.component_id));
    }
    console.log(disease_map);
    let BCIm = 0;
    let BCIs = 0;
    let BCIx = 0;
    //计算BCI
    for( let [BridgelineID, oneLine] of disease_map)
    {
        //桥面系BCIm
       
        if(oneLine.has('001004')){
            BCIm += Structure_BCI(oneLine.get('001004'));
        }
        console.log("BCIm:" + BCIm)
        //上部结构
       
        if(oneLine.has('001001')){
            BCIs += Structure_BCI(oneLine.get('001001'));
            BCIs = BCIs / oneLine.get('001001').size;
        }
        console.log("BCIs:" + BCIs);
        //下部结构
        
        if(oneLine.has('001002')){
            BCIx += Structure_BCI(oneLine.get('001002'));
        }

        if(oneLine.has('001003') && oneLine.has('001002')){
            BCIx += Structure_BCI(oneLine.get('001003'));
            BCIx = BCIx / (oneLine.get('001003').size + oneLine.get('001002').size)
        }
        console.log("BCIx:" + BCIx);
       
        BCI = BCIm + BCIs + BCIx;    
        console.log(typeof BCI);
    }
    if (0<=BCI && BCI<50) {
        Grade = 'E';
        console.log(Grade)
    }else if (50<=BCI && BCI<66) {
        Grade = 'D';
        console.log(Grade)
    }else if (66<=BCI && BCI<80) {
        Grade = 'C';
    }else if (80<=BCI && BCI<90) {
        Grade = 'B';
    }else if(90<=BCI && BCI<=100) {
        Grade = 'A';
    }
    console.log(BCI)
    
    let select_sql="select * from tbl_bci_score where check_id="+ check_id +"";
    let res_select = await query(select_sql);
    if (res_select.length==0){
        let insert_sql = 'insert into tbl_bci_score (check_id,BCI,BCI_Deck,BCI_top,BCI_Bottom,Grade) values('+check_id+','+BCI+','+BCIm+','+BCIs+','+BCIx+',"'+Grade+'")';
        console.log(insert_sql)
        let res_insert = await query(insert_sql);
    }else{
        let update_sql="update tbl_bci_score set BCI="+ BCI +",BCI_Deck="+ BCIm +",BCI_top="+ BCIs +",BCI_Bottom="+ BCIx+",Grade='"+Grade+"' where check_id="+ check_id +"";
        console.log(update_sql)
        let res_update = await query(update_sql);
    }
    try{
        res.json(1)
    }catch (e) {
        console.log('insert into data err'+ e);
    }

});

module.exports = router;
