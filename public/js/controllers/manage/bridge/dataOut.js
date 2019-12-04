app.controller('manageDataOut_controller', ['$scope', '$http', function ($scope, $http) {
    console.log(111)
    /* 根据查询数据类型 加载可选字段 */
    $('#searchOption').change(function () {
        var option = $(this).val();
        var length = $('tbody').find('tr').length;
        for (var k = 1; k < length; k++) {
            $('#option' + k).remove();
        }
        $('#sortable1').html("");
        $('#selected').html("");
        $.ajax({
            url: "/MMP/a/bridgeanalysis/bridgesearch/option",
            type: "post",
            data: { type: option },
            dataType: "json",
            success: function (result) {
                if (result != '') {
                    $('#sortable1').html("");
                    for (var i = 0; i < result.length; i++) {
                        var row = '<li class="list-group-item"><input type="checkbox" value="' + result[i] + '"/> ' + result[i + 1] + '</li>';
                        $('#sortable1').append(row);
                        i++;
                    }
                }

                $.ajax({
                    url: "/MMP/a/bridgeanalysis/bridgesearch/getCondition",
                    type: "post",
                    data: { type: option },
                    dataType: "json",
                    success: function (result) {
                        $('#select0').children('option').remove();
                        for (var j = 0; j < result.length; j += 2) {
                            var row = '<option value="' + result[j] + '">' + result[j + 1] + '</option>';
                            $('#select0').append(row);
                        }
                        selectChange('0');
                    },
                    error: function (result) {
                        top.$.jBox.error("错误td", "系统提示");
                    }
                });
            },
            error: function (result) {
                top.$.jBox.error("错误", "系统提示");
            }
        });
    });

    $("#search").click(function () {
        var conditions = '';
        var name = '';
        $("#selected input").each(function () {
            conditions += $(this).val() + ',';
            name += $(this).parent().text().trim() + ',';

        });
        if (conditions === '') {
            $.jBox.error("请选择需要查询的字段！！", "系统提示");
            return false;
        }
        var option = $('#searchOption').val();
        $("#searchform").attr("action", "/MMP/a/bridgeanalysis/bridgesearch/search?head=" + name + "&column=" + conditions + "&type=" + option).submit();
    })
    $('.well-xs button').click(function () {
        var text = $(this).text();
        if (text.indexOf('全选') != -1) {
            $('#selected').append($('#sortable1').html());
            $('#sortable1').html("");
            $('#selected .list-group-item input').each(function () {
                $(this).attr("name", "names");
            })
        }
        if (text.indexOf('全清') != -1) {
            $('#sortable1').append($('#selected').html());
            $('#selected').html("");
            $('#sortable1 .list-group-item input').each(function () {
                $(this).attr("name", "");
            })
        }
        if (text.indexOf('选择') != -1) {
            if ($("#sortable1 input:checked").length == 0) {
                alert('请先选择查询字段');
            } else {
                var html = "";
                $('#sortable1 input:checked').each(function () {
                    html += '<li class="list-group-item">' + $(this).parent().html() + '</li>';
                    $(this).parent().remove();
                });
                $('#selected').append(html);
            }
        }
        if (text.indexOf('清除') != -1) {
            if ($("#selected input:checked").length == 0) {
                alert('请先选择要删除的字段');
            } else {
                var html = "";
                $('#selected input:checked').each(function () {
                    html += '<li class="list-group-item">' + $(this).parent().html() + '</li>';
                    $(this).parent().remove();
                });
                $('#sortable1').append(html);
            }

        }
    });
    //添加行
    var rowCount = 0;
    function addRow(select) {
        rowCount = $("#table1").find("tr").length - 1;
        $("#trcount").val(rowCount + 1);
        var sqlselected;
        var termed;
        var labeled;
        var newRow = '<tr id="option' + rowCount + '"><td>'
            + '<input type="hidden" name="linkvalue' + rowCount + '" value="' + select + '">'
            + '<select name="select' + rowCount + '" style="width:100%;height:35px;" id="select' + rowCount + '" onchange=selectChange(' + rowCount + ')>'
            + $('#select0').html()
            + '</select>'
            + '<td><select name="term' + rowCount + '" class="form-control" id="term' + rowCount + '"><option value="=">=</option><option value="&gt;=">&gt;=</option><option value=" &lt;="> &lt;=</option></select></td>'
            + '<td id="content' + rowCount + '"><input type="text" class="form-control" name="label' + rowCount + '" id="label' + rowCount + '"></td>'
        newRow += '<td><a href="#" onclick=deleteRow(' + rowCount + ')><span class="glyphicon glyphicon-remove-sign" title="删除"> </span></a></td></tr>';
        $('#table1').append(newRow);
        /*var newRow = '<tr id="option' + rowCount + '"><td>'
         +'<input type="hidden" name="linkvalue' + rowCount + '" value="' + select + '">'
         +'<select name="select'+rowCount+'" style="width:100%;height:35px;" id="select' + rowCount + '" onchange=selectChange('+ rowCount + ')>'
         + '<option value="a.bridgenum">桥梁编号</option><option value="a.bridgename">桥梁名称</option><option value="a.mainstructtype">桥梁结构</option></select>'
         + '<td><select name="term' + rowCount + '" class="form-control" id="term' + rowCount + '"><option value="=">=</option><option value="&gt;=">&gt;=</option><option value=" &lt;="> &lt;=</option></select></td>'
         + '<td id="content' + rowCount + '"><input type="text" class="form-control" name="label' + rowCount + '" id="label' + rowCount + '"></td>'
         newRow += '<td><a href="#" onclick=deleteRow('+ rowCount + ')><span class="glyphicon glyphicon-remove-sign"" title="删除"> </span></a></td></tr>';
         $('#table1').append(newRow);*/
    }
    //删除行
    function deleteRow(index) {
        $("#option" + index).remove();
    }
    //条件选择切换
    function selectChange(index) {
        var select = $('#select' + index).val().split('.');
        var a = $('#' + select[1]).length;
        if (a != 0) {
            $('#' + select[1]).find('select').attr('name', 'label' + index);
            var text = $('#' + select[1]).html();
            $('#tempHtml').html(text);
            $("#content" + index).empty();
            $("#content" + index).append(text);

        } else {
            var textHtml = '<input type="text" class="form-control" name="label' + index + '" id="label' + index + '">';
            $("#content" + index).empty();
            $("#content" + index).append(textHtml);
        }
    }
    /*	//条件选择切换
        function selectChange(index){
            var structtypeHtml = '<select name="label'+index+'" class="form-control" ><option value="035001">梁桥</option><option value="035002">悬臂+挂梁</option>'
                +'<option value="035003">桁架桥</option><option value="035004">钢构桥</option><option value="035005">斜腿钢构桥</option>'
                +'<option value="035006">圬工拱桥(无拱上构造)</option><option value="035007">圬工拱桥（有拱上构造）</option><option value="035008">钢筋混凝土拱桥</option>'
                +'<option value="035009">人行天桥</option><option value="035010">钢桁架桥</option></select>';
            var textHtml = '<input type="text" class="form-control" name="label'+index+'" id="label'+index+'">';
             if($("#select"+index).val() === "a.mainstructtype"){
                 $("#content"+index).empty();
                 $("#content"+index).append(structtypeHtml);
             } else {
                 $("#content"+index).empty();
                 $("#content"+index).append(textHtml);
             }
        }*/
}]);