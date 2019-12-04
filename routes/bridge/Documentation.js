const express = require('express');
const router = express.Router();
const Sequelize = require('sequelize');
const sequelize = require('mySequelize');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const query = require('myMysql');

//查询（主页面显示）
router.get('/select_file',async function (req,res) {
    let data=req.query;
    let result;
    let select_sql="select A.FileName,A.DocumentPath,A.BridgeDocumentID,B.bridgename,A.DocumentName,A.DocumentType,A.DocumentUnit from tbl_bridge_document as A" +
                   " left join tbl_bridge_info as B" +
                   " on A.BridgeID=B.BridgeID" +
                   " where A.BridgeID="+ data.BridgeID +"";
    try{
        result=await query(select_sql);
        for (i=0;i<result.length;i++){
            result[i].DocumentPath=result[i].DocumentPath.replace(new RegExp("=","gm"),"\\");
        }

        console.log(result);
    }
    catch(e) {
        console.log(`select err` + e)
    }
    res.send(result);
});

//删除文档
router.get('/delete_file',async function(req,res){
    console.log(req.query);
    let data=req.query;
    let delete_sql="delete from tbl_bridge_document where BridgeDocumentID="+ data.BridgeDocumentID +"";
    try{
        result=await query(delete_sql);
        fs.unlinkSync(`./static/${data.file}`);
    }
    catch(e) {
        res.json(0);
        console.log(`update err` + e)
    }
    res.json(1);
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null,  path.join(__dirname,'../../static/'));
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + file.originalname);
    }
});

let upload = multer({storage:storage});

router.post('/insert_file',upload.single('file'),async function (req,res) {
    let file = req.file;
    console.log(file);
    let data=req.body;
    let path=file.path.toString();
    path=path.replace(new RegExp("\\\\","gm"),"=");
    console.log(path);
    let insert_sql="insert into tbl_bridge_document (BridgeID,DocumentName,DocumentUnit,DocumentType,DocumentPath,FileName)" +
        " values("+ data.BridgeID +",'"+ data.DocumentName +"','"+ data.DocumentUnit +"','"+ data.DocumentType +"'," +
        " '"+ path +"','"+ file.filename +"')";
    console.log(insert_sql);
    try{
        result=await query(insert_sql);
    }
    catch(e) {
        res.json(0);
        console.log(`insert err` + e)
    }
    res.json(1);
    //console.log(file);
    //res.send(file);

});

// router.post('/del',async function (req,res) {
//     console.log(`./public/${req.body.file}`);
//     fs.unlinkSync(`./public/${req.body.file}`);
// });


module.exports = router;
