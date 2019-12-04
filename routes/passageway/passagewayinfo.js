const express = require('express');

const router = express.Router();

const query = require('myMysql');

router.get('/select',async function(req,res){
    console.log(req.url);
    let userid = req.query.userid,
        usertype = req.query.usertype,
        sql,
        resData;
    if(usertype=='1'){
        sql = `select PassagewayID,CuringUnit,PassagewayNum, PassagewayName,PassagewayNum,Length,Width,High,ManageUnit from mmp.tbl_passageway_info where manageid=${userid} order by PassagewayID desc`;
        console.log(sql);
    }else if(usertype=='2'){
        sql = `select PassagewayID,CuringUnit,PassagewayNum, PassagewayName,PassagewayNum,Length,Width,High,ManageUnit from mmp.tbl_passageway_info where curingid=${userid} order by PassagewayID desc`;
    }else if(usertype=='3'){
        sql = `select PassagewayID,CuringUnit,PassagewayNum, PassagewayName,PassagewayNum,Length,Width,High,ManageUnit from mmp.tbl_passageway_info where checkid=${userid} order by PassagewayID desc`;
        console.log(sql);
    }else{
        sql = `select PassagewayID,CuringUnit,PassagewayNum, PassagewayName,PassagewayNum,Length,Width,High,ManageUnit from mmp.tbl_passageway_info order by PassagewayID desc`;
    }
    try{
        resData = await query(sql);
        for(let item of resData) {
          let CuringUnit = item.CuringUnit;
          let branch_sql = `select branch from branch where id=${CuringUnit}`;
          let resBranch = await query(branch_sql);
          let res_branch = resBranch[0].branch;
          item.CuringUnit = res_branch;
        }
    } catch(e){
        console.log(`select err`+e)
    }
    console.log(resData);
    res.json(resData);

});

router.post('/update',async function(req,res){
    console.log(req.body)
   
    let ChannelLongitude = req.body.locationInfo.split(',')[0];

    let ChannelLatitude = req.body.locationInfo.split(',')[1];
    let sql = `update mmp.tbl_passageway_info set 
                    PassagewayName='${req.body.PassagewayName}',
                    PassagewayNum='${req.body.PassagewayNum}',
                    CrossStrucure='${req.body.CrossStrucure}',
                    Area='${req.body.Area}',
                    Town='${req.body.Town}',
                    PassagewayRoad='${req.body.PassagewayRoad}',
                    Length='${req.body.Length}',
                    Width='${req.body.Width}',
                    High='${req.body.High}',
                    NumberRule='${req.body.NumberRule}',
                    ManageUnit='${req.body.ManageUnit}',
                    DesignUnit='${req.body.DesignUnit}',
                    BuildUnit='${req.body.BuildUnit}',
                    SuperviseUnit='${req.body.SuperviseUnit}',
                    ChannelLongitude='${ChannelLongitude}',
                    ChannelLatitude='${ChannelLatitude}'
                where PassagewayID=${req.body.PassagewayID}`;
    let resData;
    try{
        resData = await query(sql);
        res.json('修改成功');
   } catch(e){
       console.log(`select err`+e)
   }
})

 router.get('/delete',async function(req,res){
    console.log(req.query);
    let sql = `delete from mmp.tbl_passageway_info where PassagewayID= '${req.query.PassagewayID}'`;
    try{
        let del = await query(sql);
        console.log(del);
        res.send('删除成功');
    }catch (e) {
        console.log(`select err`+e)
    }

   
});

router.post('/insert',async function(req,res){
    console.log(req.body);
    let branch_sql = `select branch from mmp.branch where id in (select user_branch_id from mmp.admin where id='${req.body.userid}' )`;
    let resBranch = await query(branch_sql);
    let sql = `insert into mmp.tbl_passageway_info(manageid,ManageUnit,PassagewayName,PassagewayNum) values(${req.body.userid},'${resBranch[0].branch}','${req.body.name}','${req.body.num}')`;
    console.log(sql);
    try{
        let resData = await query(sql);
        let sql_select = `select PassagewayID from mmp.tbl_passageway_info order by PassagewayID desc limit 0,1`;
        let res_sel = await query(sql_select);
        console.log(res_sel);
        let sql_struct = `insert into tbl_passageway_mainstructure(PassagewayID) values(${res_sel[0].PassagewayID})`;
        let sql_drain = `insert into tbl_passageway_drainage(PassagewayID) values(${res_sel[0].PassagewayID})`;
        let sql_attach = `insert into tbl_passageway_attachment(PassagewayID) values(${res_sel[0].PassagewayID})`;
        await query(sql_struct);
        await query(sql_drain);
        await query(sql_attach);
        res.json(1); 
    } catch(e){
        console.log(`select err`+e);
        res.json(0);
    }

})


router.post('/selInfo', async function(req,res){
    let sql = `select * from mmp.tbl_passageway_info where PassagewayID = ${req.body.PassagewayID} `;
    try{
        let resInfo = await query(sql);
        for(let item of resInfo) {
            item.locationInfo = item.ChannelLongitude + ',' + item.ChannelLatitude;
        };
         res.json(resInfo);
    }catch (e) {
        console.log(`select err`+e)
    }
   
});


function Struct(typeid, label,id, children,level){
    this.typeid = typeid;
    this.label = label;
    this.id = id;
    this.children = children;
    this.level = level;
    this.expanded = true;
}

router.get('/tree',async function(req,res){
    let treedata = [];
    let onetree = {};

    onetree.PassagewayID = req.query.PassagewayID;
    onetree.label = req.query.PassagewayName;
    onetree.children = [];
    onetree.level=1;
    onetree.expanded=true;
    try{
        let main_sql = `select MainStructID from mmp.tbl_passageway_mainstructure where PassagewayID=${req.query.PassagewayID}`;
        let res_main = await query(main_sql);
        let mainStruct={};
        if(res_main.length==0){
            mainStruct = new Struct(1,'主体构造物','','',2);
            mainStruct.type = '079001';
        }else{
             mainStruct = new Struct(1,'主体构造物',res_main[0].MainStructID,'',2);
             mainStruct.type = '079001';
        }
        onetree.children.push(mainStruct);
        /* ............................................................................................................................. */
        let entrance_sql = `select EntranceID,EntranceName from mmp.tbl_passageway_entrance where PassagewayID=${req.query.PassagewayID}`;
        let res_entrance = await query(entrance_sql);
        let entrances = [];
        for(let item of res_entrance){
            let one_entrance = {};
            one_entrance.entranceid = item.EntranceID;
            one_entrance.level = 3;
            one_entrance.expanded=true;
            one_entrance.label = item.EntranceName;
            one_entrance.type = '079002';
            entrances.push(one_entrance);
        }
        let entrance = new Struct(2,'出入口','',entrances,2);
        onetree.children.push(entrance);
         /* ............................................................................................................................. */
         let roadsurface_sql = `select RoadSurfaceID,RoadSurfaceName from mmp.tbl_passageway_roadsurface where PassagewayID=${req.query.PassagewayID}`;
         let res_roadsurface = await query(roadsurface_sql);

         let surface = [];
         for(let item of res_roadsurface){
             let one_roadsurface = {};
             one_roadsurface.roadsurfaceid = item.RoadSurfaceID;
             one_roadsurface.label = item.RoadSurfaceName;
             one_roadsurface.type = '079003';
             one_roadsurface.level = 3;
             one_roadsurface.expanded=true;
             surface.push(one_roadsurface);
         }
         let roadsurface = new Struct(3,'道面','',surface,2);
         onetree.children.push(roadsurface);
        /* ............................................................................................................................. */
        let drainage_sql = `select DrainageID from mmp.tbl_passageway_drainage where PassagewayID=${req.query.PassagewayID}`;
        let res_drainage = await query(drainage_sql);
        let drainageStruct = {};
        if(res_drainage.length==0){
            drainageStruct = new Struct(4,'排水设施','','',2);
            drainageStruct.type = '079004';
        }else{
            drainageStruct = new Struct(4,'排水设施',res_drainage[0].DrainageID,'',2);
            drainageStruct.type = '079004';
        }

        onetree.children.push(drainageStruct);
        /* ............................................................................................................................. */
        let attachment_sql = `select AttachmentID from mmp.tbl_passageway_attachment where PassagewayID=${req.query.PassagewayID}`;
        let res_attachment = await query(attachment_sql);
        let attachmentStruct = {};
        if(res_attachment.length==0){
            attachmentStruct = new Struct(5,'附属设施','','',2);
            attachmentStruct.type = '079005';
        }else{
            attachmentStruct = new Struct(5,'附属设施',res_attachment[0].AttachmentID,'',2);
            attachmentStruct.type = '079005';
        }

        onetree.children.push(attachmentStruct);
        /* ............................................................................................................................. */
        
        treedata.push(onetree);
    
        res.json(treedata);
    }catch(e){
        console.log(`select data err`+e);
    }
   
})

router.get('/selcom',async function(req,res){
    console.log(req.query)
    let structType;
    if(req.query.typeid=='1'){
        structType='079001'
    }else if(req.query.typeid=='4'){
        structType='079004'
    }else if(req.query.typeid=='5'){
        structType='079005'
    }
    let sqlCom = `select * from mmp.tbl_passageway_component where PassagewayID=${req.query.PassagewayID} and SuperStructure='${structType}' and StructureID=${req.query.id}`;
    try{
        let res_com = await query(sqlCom);
        console.log(res_com);
        res.json(res_com);
    }catch(e){
        res.json(0);
    }
})

module.exports = router;