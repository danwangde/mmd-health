const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const query = require('myMysql');


//管理部门查询公告
router.get('/select_notice', async function (req, res) {
    let data = req.query;
    console.log(data)
    let result;
    let sql = "SELECT case when branch_id="+ data.branch_id +" then 'Receipt' ELSE 'Hair_parts' END AS type, " +
    " case when state='0' then 'Unread' ELSE 'Already_read' END state,"+
    " notice_id,theme,enclosure,content,creation_time " +
    " FROM tbl_notice "+
    " WHERE (F_branch_id="+ data.branch_id +" OR branch_id="+ data.branch_id +") "+
    " AND notice_id NOT IN (SELECT noticeid FROM delete_notice WHERE userid = "+ data.uid +") "+
    " GROUP BY creation_time "+
    " ORDER BY creation_time asc";
    try {
        result = await query(sql);
    } catch (e) {
        console.log(`select err` + e)
    }
    res.send(result);
});


router.get('/select_bran', async function(req, res, next) {
    console.log(req.query);
    let array=[];
    await query('SELECT * from branch ', function(err, rows, fields) {
        if (err) throw err;
        //get all data
        let result = [];//存放起始对象
        let allMenu = rows;//获取sql出的全部json对象
        for(i=0;i<allMenu.length;i++){
            if(allMenu[i].user_id == req.query.user_id){
                result.push(allMenu[i]) ;//根据id号获取根对象
                break;
            }
        }
        // //     //judege result exist or not
        if(result.length==0){
            return res.json('Failed! id is not exist!');
        }else{
            result.children=[];
            result.children=getAllChild(result);//调用
            console.log(result);
            let result1= JSON.parse(JSON.stringify(result).replace(/branch/g,"label"));
            array.push(result1[0]);
            console.log("array")
            console.log(array)
            res.json(array);
        }
        //     //find some item all child
        function findItemChild(item){
            let arrayList=[];
            for(let i in allMenu){
                if(allMenu[i].parent_id == item.id){
                    arrayList.push(allMenu[i]);
                }
            }
            return arrayList;
        }
        //get all child
        function getAllChild(array){
            let childList=findItemChild(array[0]);
            if(childList == null){
                return [];
            }
            else{
                for(let j in childList){
                    childList[j].children=[];
                    childList[j].children=getAllChild([childList[j]]);
                }
                array[0].children=childList;
            }
            return childList;

        }
    });
});

router.get('/delete_notice',async function(req,res){
    let data=req.query;
    console.log(data);
	let sql="insert into delete_notice (userid,noticeid) values("+ data.userid +","+ data.noticeid +")";
	try {
        result = await query(sql);
    }
    catch (e) {
        res.json(0)
    }
    res.json(1);
});
router.get('/delete1_notice',async function(req,res){
    let data=req.query;
    console.log(data);
	let select_sql="SELECT notice_id FROM tbl_notice WHERE creation_time = (" +
		" SELECT creation_time FROM tbl_notice WHERE notice_id="+ data.noticeid +")"
    let result1 = await query(select_sql);
    console.log(result1)
	
		try {
            for (let i=0;i<result1.length;i++){
                let sql="insert into delete_notice (userid,noticeid) values("+ data.userid +","+ result1[i].notice_id +")";
                console.log(sql)
                result = await query(sql);
            }
			res.json(1);
		}
		catch (e) {
			res.json(0)
		}
		
	
});


router.get('/select_branch_notice', async function (req, res) {
    let data = req.query;
    console.log(data)
    let sql = "SELECT notice_id,theme,enclosure,content,creation_time,case when state='0' then '未读' ELSE '已读' END staten" +
        " FROM tbl_notice WHERE branch_id=" + data.branch_id + "" +
        " AND notice_id NOT IN (SELECT noticeid FROM delete_notice WHERE userid = "+ data.uid +") "+
        " ORDER BY FIELD(staten,'未读','已读')";
    try {
        result = await query(sql);
        res.send(result);
    } catch (e) {
        console.log(`select err` + e)
    }
   
});

router.get('/update_notice_state', async function (req, res) {
    let data = req.query;
    let result;
    let sql = "UPDATE tbl_notice SET state='1' WHERE notice_id=" + data.notice_id + "";
    try {
        result = await query(sql);
    }
    catch (e) {
        res.json(0)
    }
    res.json(1);
});


let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // 接收到文件后输出的保存路径（若不存在则需要创建）
        cb(null, path.join(__dirname, '../static/'));
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 时间戳 + 文件原始名，比如 151342376785-123.jpg
        cb(null, Date.now() + "-" + file.originalname);
    }
});
let upload = multer({storage: storage});

router.post('/insert_notice', upload.single('file'), async function (req, res) {
    let data = req.body;
    let file = req.file;
    console.log(data)
    console.log(file)
    if (req.file == undefined) {
        file = "";
    } else {
        file = req.file.filename;
    };

    let arr = [];
    arr = data.branch_arr.split(',');
    console.log(arr);
    console.log(data.F_branch_id);
    if(arr.indexOf(data.F_branch_id) >0) {
        arr.splice(arr.indexOf(data.F_branch_id),1);
    }
    

    console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        insert_sql = "INSERT INTO tbl_notice (theme,content,enclosure,creation_time,branch_id,state,F_branch_id) VALUES('" + data.theme + "','" + data.content + "','" + file + "','" + data.creation_time + "','" + arr[i] + "','0'," + data.F_branch_id + ")";
        console.log(insert_sql)
        result = await query(insert_sql);
    }
    res.json(1);

});


module.exports = router;