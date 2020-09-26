$(document).ready(function () {
    let rest = 0, pages = 1, dataLength;
    var take = 10, startId = 1, dynamicStart = 1, btnGroups = 1, trashed = 0 , paggingEnd = 19 , paggingStart = 0 , virtualGrouping = 1  ;
    // binding data length to local variable 
    $.ajax({
        url: "/Apis/FactoryCount",
        type: 'Get',
        async:false,
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            dataLength = data;
            rest = dataLength % take;
            trashed = rest / take
            if (rest !== 0) {
                pages = (dataLength / take) + 1
            } else {
                pages = dataLength / take;
            }
            btnGroups = Math.ceil((pages - trashed) / 5);
            for (let j = 1; j <= pages - trashed; j++) {
                $("#dataloader").append('<tbody class="dataholder-tbody" data-bodyTag="'+ j +'"></tbody>');
                if (j == 1) {
                    $("#pagging-controller").append('<button data-load="1" data-take="' + take + '" data-start="' + startId + '" class="btn page-loader btn-sm btn-primary">' + j + '</button>');
                } else {
                    dynamicStart = (j * 9) + (j - 1) - 8;
                    $("#pagging-controller").append('<button   data-take="' + take + '" data-start="' + dynamicStart + '"   class="btn page-loader btn-sm btn-default">' + j + '</button>');
                }
            }
        }
    });
    // controlling pagging styling enviroment 
    // showing the first 20 pagging buttons and validating length 
    if (pages - rest / take > 5) {
        for (let i = 0; i <= 4; i++) {
            $("#pagging-controller").children(".page-loader").eq(i).show();
            $("#pagging-new-slider").show();
        }
    } else {
        $(".page-loader").show();
    }
    // showing newer data each click with 20 record 
    $("#pagging-new-slider").click(function () {
        virtualGrouping++;
        paggingEnd = virtualGrouping * 5 - 1;
        paggingStart = paggingEnd - 4;
        if (virtualGrouping <= btnGroups) {
            if (virtualGrouping === btnGroups) {
                $("#pagging-new-slider").hide();
            }
            $("#pagging-old-slider").show();
            for (var i = paggingStart, j = paggingStart - 1 ; i <= paggingEnd; i++, j--){
                $("#pagging-controller").children(".page-loader").eq(j).hide();
                $("#pagging-controller").children(".page-loader").eq(i).show();
            }
        }
    });
    //showing the older data each click with previous 20 record 
    $("#pagging-old-slider").click(function () {
        $("#pagging-new-slider").show();
        virtualGrouping--;
        paggingEnd = virtualGrouping * 5 - 1;
        paggingStart = paggingEnd - 4;
        if (virtualGrouping <= btnGroups) {
            if (virtualGrouping  ===  1 ) {
                $("#pagging-old-slider").hide();
            }
            for (var i = paggingStart, j = paggingEnd + 1  ; i <= paggingEnd; i++, j++) {
                $("#pagging-controller").children(".page-loader").eq(i).show();
                $("#pagging-controller").children(".page-loader").eq(j).hide();
            }
        }
    });
    // Initial  call scripts  change only the ajax calls URL APIS
    $.ajax({
        url: "/Apis/ItemFactoryModel?taken=" + take + "&EndId=" + startId,
        type: 'Get',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $.each(data, function (i) {
                $("#dataloader").children("tbody").eq(1).show();
                $("#dataloader").children("tbody").eq(1).append('<tr><td>' + data[i].Id + '</td><td>' + data[i].Name+'</td><td><button class="btn btn-xs btn-danger"><i class="fa fa-times"></i></button></td></tr>');
                if (i === 10) {
                    return false;
                }
            });
        }
    });
    //load page data from api into her tbody wrapper 
    $("#pagging-controller").on('click', '.page-loader', function () {
        var btnStart = $(this).data('start'), btnLoad = $(this).data('load');
        $("#dataloader").children("tbody").eq($(this).index()+1).show().siblings("tbody").hide();
        $(this).addClass("btn-primary").siblings(".page-loader").removeClass("btn-primary");
        if (btnLoad == 0 || btnLoad == undefined) {
            // loading the unloaded data 
            $(this).data('load', 1);
            var thisIndex = $(this).index() ;
            $.ajax({
                url: "/Apis/ItemFactoryModel?taken=" + take + "&EndId=" + btnStart,
                type: 'Get',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    $.each(data, function (i) {
                        $("#dataloader").children("tbody").eq(thisIndex + 1).append('<tr><td>' + data[i].Id + '</td><td>' + data[i].Name + '</td><td><button class="btn btn-xs btn-danger"><i class="fa fa-times"></i></button></td></tr>');
                        $("#dataloader").children("tbody").eq(thisIndex + 1).show();
                        $("#dataloader").children("tbody").eq(thisIndex  + 1).siblings("tbody").hide();
                        if (i === 10) {
                            return false;
                        }
                    });
                }
            });
        } 
    });
    //prevoius traversing controller 
    $("#previous-controller").click(function () {
        var activePageIndex = $("#pagging-controller").children(".btn-primary").index();
        if (activePageIndex > 0   ) {
            var dataLaod = $("#pagging-controller").children(".page-loader").eq(activePageIndex - 1).data("load"),
                startId = $("#pagging-controller").children(".page-loader").eq(activePageIndex - 1).data("start");
            $("#pagging-controller").children(".page-loader").eq(activePageIndex - 1).addClass("btn-primary").siblings(".page-loader").removeClass("btn-primary");
            if (dataLaod == 1) {
                $("#dataloader").children("tbody").eq(activePageIndex -1 ).show();
                $("#dataloader").children("tbody").eq(activePageIndex -1 ).siblings("tbody").hide();
            } else {
                $("#pagging-controller").children(".page-loader").eq(activePageIndex - 1).data("load", 1);
                $.ajax({
                    url: "/Apis/ItemFactoryModel?taken=" + take + "&EndId=" + startId,
                    type: 'Get',
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        $.each(data, function (i) {
                            $("#dataloader").children("tbody").eq(activePageIndex - 1 ).append('<tr><td>' + data[i].Id + '</td><td>' + data[i].Name + '</td><td><button class="btn btn-xs btn-danger"><i class="fa fa-times"></i></button></td></tr>');
                            $("#dataloader").children("tbody").eq(activePageIndex - 1 ).show();
                            $("#dataloader").children("tbody").eq(activePageIndex - 1).siblings("tbody").hide();
                            if (i === 10) {
                                return false;
                            }
                        });
                    }
                });
            }
        }
    });
    //next traversing controller 
    $("#next-controller").click(function () {
        var activePageIndex = $("#pagging-controller").children(".btn-primary").index();
        if (activePageIndex <= $("#pagging-controller").children(".page-loader").length ) {
            var dataLaod = $("#pagging-controller").children(".page-loader").eq(activePageIndex + 1).data("load"),
                startId = $("#pagging-controller").children(".page-loader").eq(activePageIndex + 1).data("start");
            $("#pagging-controller").children(".page-loader").eq(activePageIndex + 1).addClass("btn-primary").siblings(".page-loader").removeClass("btn-primary");
            if (dataLaod == 1) {
                $("#dataloader").children("tbody").eq(activePageIndex + 1).show();
                $("#dataloader").children("tbody").eq(activePageIndex + 1).siblings("tbody").hide();
            } else {
                $("#pagging-controller").children(".page-loader").eq(activePageIndex + 1).data("load", 1);
                $.ajax({
                    url: "/Apis/ItemFactoryModel?taken=" + take + "&EndId=" + startId,
                    type: 'Get',
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        $.each(data, function (i) {
                            $("#dataloader").children("tbody").eq(activePageIndex + 2).append('<tr><td>' + data[i].Id + '</td><td>' + data[i].Name + '</td><td><button class="btn btn-xs btn-danger"><i class="fa fa-times"></i></button></td></tr>');
                            $("#dataloader").children("tbody").eq(activePageIndex + 2).show();
                            $("#dataloader").children("tbody").eq(activePageIndex + 2).siblings("tbody").hide();
                            if (i === 10) {
                                return false;
                            }
                        });
                    }
                });
            }
        }
    });
    //direct page access controller 
    $("#dataloader-access").on('keypress', function (e) {
        if (e.which == 13) {
            if ($(this).val() > Math.ceil(pages - trashed) || $(this).val() <= 0) {
                alert("من فضلك ادخل رقم صفحة صحيح ");
            } else {
                if ($("#pagging-controller").children(".page-loader").eq($(this).val() - 1).hasClass("btn-primary")) {
                    alert("هذه الصفحة مفعلة بالفعل ");
                } else {
                    $("#pagging-controller").children(".page-loader").eq($(this).val() - 1).addClass("btn-primary").siblings(".page-loader").removeClass("btn-primary");
                    if ($("#pagging-controller").children(".page-loader").eq($(this).val() - 1).data("load") == 1) {
                        $("#dataloader").children("tbody").eq($(this).val() ).show().siblings("tbody").hide();
                    } else {
                        $("#pagging-controller").children(".page-loader").eq($(this).val() - 1).data("load", 1);
                        var btnStart = $("#pagging-controller").children(".page-loader").eq($(this).val() - 1).data("start"),
                            thisIndex = $(this).val() ;
                        $.ajax({
                            url: "/Apis/ItemFactoryModel?taken=" + take + "&EndId=" + btnStart,
                            type: 'Get',
                            contentType: 'application/json; charset=utf-8',
                            success: function (data) {
                                $.each(data, function (i) {
                                    $("#dataloader").children("tbody").eq(thisIndex).append('<tr><td>' + data[i].Id + '</td><td>' + data[i].Name + '</td><td><button class="btn btn-xs btn-danger"><i class="fa fa-times"></i></button></td></tr>');
                                    $("#dataloader").children("tbody").eq(thisIndex).show();
                                    $("#dataloader").children("tbody").eq(thisIndex).siblings("tbody").hide();
                                    if (i === 10) {
                                        return false;
                                    }
                                });
                            }
                        });
                    }
                }
            }
        }
    });
    //search in data controller 
    $("#dataloader-search").focusin(function () {
        $(this).siblings(".disableSearch").removeClass("hide");
        $(this).siblings(".activeSearch").addClass("hide");
        $(".dataholder-tbody").hide();
        $(".dataloader-search-tbody").show();
        $(".oprRow").hide();
    });
    $("#dataloader-search").focusout(function () {
        $(this).siblings(".disableSearch").addClass("hide");
        $(this).siblings(".activeSearch").removeClass("hide");
        $("#dataloader").children("tbody").eq($("#pagging-controller").children(".btn-primary").index() + 1).show();
        $(".dataloader-search-tbody").hide();
        $(".oprRow").show();
    });
    $(".searchable-controller").on("click", ".disableSearch", function () {
        $(this).addClass("hide");
        $(this).siblings(".activeSearch").removeClass("hide");
        $("#dataloader").children("tbody").eq($("#pagging-controller").children(".btn-primary").index() + 1).show();
        $(".dataloader-search-tbody").hide();
        $(".oprRow").show();
    });
    $("#dataloader-search").keyup(function () {
            $(".oprRow").hide();
            var searchRequest = $(this).val();
            $.ajax({
                url: "/Apis/ItemFactorySearch?text=" + searchRequest ,
                type: 'Get',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    $(".dataloader-search-tbody").children("tr").remove();
                    $.each(data, function (i) {
                        $(".dataloader-search-tbody").append('<tr><td>' + data[i].Id + '</td><td>' + data[i].Name + '</td></tr>');
                    });
                }
            });

    });

});
