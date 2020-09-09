$(document).ready(function () {
    let startId = 1, endId = 500;
    let t = 2, newEnd = 0;
    //changeable variable values 
    let container = $(".balancer-data-wrapper");
    let searchContainer = $(".balancer-results-wrapper");

    //dynamic scripts 
    //open dropdownlist content container 
    $(".balancer-main-input").click(function () {
        let iconToggler = $(this).siblings(".balancer-icon");
        if (iconToggler.hasClass("fa-caret-down")) {
            $(this).siblings(".balancer-inner-wrapper").slideDown();
            $(this).siblings(".balancer-inner-wrapper").children("header").children(".balancer-searcher").focus();
            iconToggler.removeClass("fa-caret-down").addClass("fa-caret-up");
        } else {
            $(this).siblings(".balancer-inner-wrapper").slideUp();
            iconToggler.addClass("fa-caret-down").removeClass("fa-caret-up");
        }
    });
    //  activate choosed data from balancer requested data 
    $(".data-floater").on("click", ".balancer-item", function () {
        $(this).addClass("active-item").siblings(".balancer-item").removeClass("active-item");
        $(this).parent("div").parent(".balancer-inner-wrapper").siblings(".balancer-main-input").html($(this).data("requestedname") + " - " + $(this).data("barcode"));
        $(this).parent("div").parent(".balancer-inner-wrapper").siblings(".balancer-main-input").data("itemid", $(this).data("requestedid"));
        $(this).parent("div").parent(".balancer-inner-wrapper").slideUp();
        $(this).parent("div").parent(".balancer-inner-wrapper").siblings(".balancer-icon").removeClass("fa-caret-up").addClass("fa-caret-down");
    });
    $(".balancer-inner-wrapper").on("click", ".closeSearch", function () {
        $(this).parent("header").siblings(".balancer-data-wrapper").show();
        $(this).parent("header").siblings(".balancer-results-wrapper").hide();
        $(this).hide();
    });


    //static calls scripts  change only the ajax calls URL APIS
    $.ajax({
        url: "/Item/APIItem?StartId=" + startId + "&EndId=" + endId,
        type: 'Get',
        contentType: 'application/json; charset=utf-8',
        success: function (data) {
            $.each(data, function (i) {
                container.append('<span class="balancer-item" data-barcode="' + data[i].BarCode +'" data-requestedid="' + data[i].Id + '" data-requestedname="' + data[i].Name + '">' + data[i].Name + '-' + data[i].BarCode + '</span>');
                if (i === 500) {
                    return false;
                }
            });
        }
    });
    // scrolling mechansim and fetching data code 
    $(".balancer-data-wrapper").scroll(function () {
        if ($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
            newEnd = 500 * t;
            startId = newEnd - 500 + 1;
            t++;
            $.ajax({
                url: "/Item/APIItem?StartId=" + startId + "&EndId=" + newEnd,
                type: 'Get',
                contentType: 'application/json; charset=utf-8',
                success: function (data) {
                    $.each(data, function (i) {
                        container.append('<span class="balancer-item" data-barcode="' + data[i].BarCode +'" data-requestedid="' + data[i].Id + '" data-requestedname="' + data[i].Name + '">' + data[i].Name + '-' + data[i].BarCode + '</span>');
                        if (i === 500) {
                            return false;
                        }
                    });
                }
            });
        }
    });
    // search script 
    let focusTrigger = 0; 
    $(".balancer-searcher").focus(function () {
        focusTrigger++;
        $(this).parent("header").siblings(".balancer-data-wrapper").hide();
        $(this).parent("header").siblings(".balancer-results-wrapper").show();
        $(this).siblings(".closeSearch").show();
        if (focusTrigger <= 1   ) {
            var values = [],
                keys = Object.keys(localStorage),
                i = keys.length;
            while (i--) {
                values.push(localStorage.getItem(keys[i]));
            }
            for (var i = 0; i <= values.length; i++) {
                var parsedIndex = JSON.parse(values[i]);
                searchContainer.append('<span class="balancer-item" data-barcode="' + parsedIndex.barcode + '" data-requestedid="' + parsedIndex.id + '" data-requestedname="' + parsedIndex.name + '">' + parsedIndex.name + '-' + parsedIndex.barcode + '</span>');
            }
        }
    });
    $(".balancer-searcher").keypress(function (e) {
        if (e.which == 13) {
            if ($(this).val() == "") {
                $(this).parent("header").siblings(".balancer-data-wrapper").show();
                $(this).parent("header").siblings(".balancer-results-wrapper").hide();
                $(this).siblings(".closeSearch").show();
            } else {
                $.ajax({
                    url: "/Item/APIItemSearch?text=" + $(this).val(),
                    type: 'Get',
                    contentType: 'application/json; charset=utf-8',
                    success: function (data) {
                        $.each(data, function (i) {
                            searchContainer.html('<span class="balancer-item localised-item" data-barcode="' + data[i].BarCode + '" data-requestedid="' + data[i].Id + '" data-requestedname="' + data[i].Name + '">' + data[i].Name + '-' + data[i].BarCode + '</span>');
                        });
                    }
                });
            }
        }
    });
    $(".data-floater").on("click", ".localised-item", function () {
        let barcode, name, id;
        barcode = $(this).data("barcode");
        name = $(this).data("requestedname");
        id = $(this).data("requestedid");
        var itemObject = { 'id': id, 'barcode': barcode, 'name': name };
        localStorage.setItem('item-' + id, JSON.stringify(itemObject));
        searchContainer.append('<span class="balancer-item " data-barcode="' + barcode + '" data-requestedid="' + id + '" data-requestedname="' + name + '">' + name + '-' + barcode + '</span>');
        $(this).parent(".balancer-results-wrapper").parent(".balancer-inner-wrapper").slideUp();

    });

});
