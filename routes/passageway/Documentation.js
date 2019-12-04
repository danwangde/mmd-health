const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const query = require('myMysql');

//查询（主页面显示）
router.get('/select_file',async function (req,res) {
    let data=req.query;
    let result;
    let select_sql="select A.FileName,A.DocumentPath,A.PassDocumentID,B.PassagewayName,A.DocumentName,A.DocumentType,A.DocumentUnit from tbl_passageway_document as A" +
                   " left join tbl_passageway_info as B" +
                   " on A.PassagewayID=B.PassagewayID" +
                   " where A.PassagewayID="+ data.PassagewayID +""; 
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
    let data=req.query;
    let delete_sql="delete from tbl_passageway_document where PassDocumentID="+ data.PassDocumentID +"";
    try{
        result=await query(delete_sql);
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
    console.log(file)
    let data=req.body;
    let insert_sql="insert into tbl_passageway_document (PassagewayID,DocumentName,DocumentUnit,DocumentType,DocumentPath,FileName)" +
        " values("+ data.PassagewayID +",'"+ data.DocumentName +"','"+ data.DocumentUnit +"','"+ data.DocumentType +"'," +
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

});


module.exports = router;