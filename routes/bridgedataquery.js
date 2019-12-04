var express= require('express');

var router = express.Router();

var query = require('myMysql');

router.get('/select',async function (req,res) {
    let msg =[
        {name:'市中区汇总',data1:'0',data2:'0',data3:'0',data4:'0',data5:'0',data6:'0',data7:'0',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'历下区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'0',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'},
        {name:'天桥区汇总',data1:'1',data2:'1',data3:'0',data4:'0',data5:'1',data6:'0',data7:'2',data8:'0',data9:'1',data10:'1',data11:'2'}
    ];
    res.json(msg);
});

module.exports = router;