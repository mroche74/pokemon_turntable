"use strict";


$(document).ready(function(){

    var xTimer;
    var j = 1;

    //------- add spinner elements to DOM
    var xE = $('#spinner').html();
    for(var x=0; x<15; x++){
        $('#spinner').append(xE);
    }

    // --- IE does not support CSS3 transformations so check for IE and notify user if found
    var xUA = window.navigator.userAgent;
    var xMSIE = xUA.indexOf("MSIE ");
    if (xMSIE > 0 || window.ActiveXObject || "ActiveXObject" in window){
        $('#status > span').html('This website utilizes styling features that are not supported in older browsers.<br />Please upgrade Internet ' +
            'Explorer to <strong>Edge</strong> or download <strong>Chrome</strong> or <strong>Firefox</strong>.')
        alert('This website utilizes styling features that are not supported in older browsers.  Please upgrade Internet Explorer to Edge or download Chrome or Firefox.');
        return;
    }else{
        $('#carousel').removeClass("hidden");
    }

    //------ show 'Loading data...' in upper right of header while AJAX calls are made
    var xDots = 0;
    var xPTimer = setInterval(function () {
        $('div.header > div:last-child').html('Loading Pokemon Data' + ' .'.repeat(xDots));
        if(xDots == 3){
            xDots = 0;
        }else{
            xDots++;
        }
    }, 750);

    //----- determine how many pokemon the document is expecting and set CSS transformations for each
    var xD = 360/($('.carousel-img').length);
    for(var i=0; i<$('.carousel-img').length; i++){
        $('#spinner .frame:nth-child('+ (i+1) +')').css('transform', 'rotateY('+ -(i*xD) +'deg)');
    }

    //----- make calls to pokemon API and display data
    (function cycleAJAX(){

        $.ajax({
            url: "http://pokeapi.co/api/v2/pokemon/" + j
            ,type: "GET"
            ,dataType: "JSON"
        })

            .fail(function(xResponse){
                alert('An error occurred while attempting to reach the Pokéapi API at: "http://pokeapi.co/api/v2/pokemon/' + j + '".  Check your internet connection and try again');
            })

            .done(function(xJSON){

                var i = j - 1;

                $('.carousel-img:eq(' + i + ')').attr('src', xJSON.sprites.front_default);
                $('.pm-name:eq(' + i + ')').html(xJSON.name);
                $('.pm-species:eq(' + i + ')').html('Species: ' + xJSON.species.name);
                $('.pm-height:eq(' + i + ')').html('Height: ' + xJSON.height);
                $('.pm-weight:eq(' + i + ')').html('Weight: ' + xJSON.weight);
                $.each(xJSON.abilities, function (k, v) {
                    $('.pm-abilities:eq(' + i + ') > ul').append('<li>' + v.ability.name + '</li>');
                });
                $('.frame:eq(' + i + ')').fadeIn(1500, function () {
                    $('.frame:eq(' + i + ')').toggleClass('transit');
                });

                j++;
                if (j <= $('.carousel-img').length) {
                    cycleAJAX();
                }else{
                    $('div.header > div:last-child').fadeOut(1000);
                    clearInterval(xPTimer);
                    xTimer = window.setInterval(function () {
                        xTurner.spin('f');
                    }, 5000);
                    $('div#carousel > img').fadeIn(2000, function () {
                        $('div#carousel > img').toggleClass('transit');
                    });
                }
            });
    })();


    $('div#carousel > img:first-child').click(function(){
        clearInterval(xTimer);
        xTurner.spin();
    });

    $('div#carousel > img:last-child').click(function(){
        clearInterval(xTimer);
        xTurner.spin('f');
    });

    var xTurner = (function turnCarousel(f){
        
        var xSpinner = document.querySelector("#spinner");
        var xAngle = 0;
        var xImgCount = $('.carousel-img').length;
        var xDelta = 360/xImgCount;

        return {
            spin: function (f) {

                if(!f){
                    xAngle += xDelta;
                }else{
                    xAngle -= xDelta;
                }

                //----------------------- Forward and back buttons
                $('#carousel > img').toggleClass('trans').delay(1500).queue(function (next) {
                    $(this).toggleClass('trans');
                    next();
                });

                xSpinner.setAttribute("style", "-webkit-transform: rotateY(" + xAngle + "deg); transform: rotateY(" + xAngle + "deg);");

                $('#spinner > div').addClass('faded');

                if (xAngle > 360 || xAngle < -360) {
                    var i = Math.round((xAngle % 360) / xDelta);
                } else {
                    var i = Math.round(xAngle / xDelta);
                }

                var xF = $('.frame').get(i);
                $(xF).removeClass('faded');
            }
        };
    })();
    
});