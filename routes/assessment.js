const express = require('express');
const router = express.Router();
const query = require('myMysql');

router.get('/select_assess', async function (req,res) {
    let data = req.query;
    let sql = "SELECT distinct(BridgeName) BridgeName,LineName,Inspection_date,Patrol_unit,BCI,BCI_Deck,BCI_Top,BCI_Bottom,Grade FROM tbl_bci_score AS L RIGHT JOIN (\n" +
        " SELECT BridgeName,check_id,LineName,Inspection_date,Patrol_unit FROM  tbl_bridge_line AS P RIGHT JOIN (\n" +
        " SELECT BridgeName,check_id,BridgeLineID,Inspection_date,Patrol_unit FROM tbl_bridge_info AS M RIGHT JOIN (\n" +
        " SELECT check_id,BridgeLineID,BridgeID,Inspection_date,Patrol_unit FROM tbl_BCI AS A LEFT JOIN tbl_Routine_testing AS B \n" +
        " ON A.check_id=B.id) AS N\n" +
        " ON M.BridgeID=N.BridgeID\n" +
        " WHERE manageid="+data.uid +") AS Q\n" +
        " ON P.BridgeLineID=Q.BridgeLineID) AS K\n" +
        " ON L.check_id=K.check_id";
    console.log(sql)
    try {
        let result = await query(sql);
        res.json(result);
    }catch (e){
        console.log("get data err" +e);
    }
});
module.exports = router;
