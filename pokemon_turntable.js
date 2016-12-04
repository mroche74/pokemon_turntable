"use strict";

var xAngle = 0;
var xTimer;
var xDelta; 
var xPM = [];
var j = 1;

$(document).ready(function(){

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

    var xImgCount = $('.carousel-img').length;
    xDelta = 360/xImgCount;
    
    for(var i=0; i<xImgCount; i++){
        $('#spinner .frame:nth-child('+ (i+1) +')').css('transform', 'rotateY('+ -(i*xDelta) +'deg)');
    }
    
    (function cycle(){

        $.ajax({
            url: "http://pokeapi.co/api/v2/pokemon/" + j
            ,type: "GET"
            ,dataType: "JSON"
            ,timeOut: 5000
        })

            .fail(function(xResponse){
                alert('Error: ' + JSON.stringify(xResponse));
            })

            .done(function(xJSON){

                xPM.push(xJSON);

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
                if (j <= 10) {
                    cycle();
                }else{
                    $('#status > span').fadeOut(1000);
                    xTimer = window.setInterval(function () {
                        turnCarousel('f');
                    }, 5000);
                    $('div#carousel > img').fadeIn(2000, function () {
                        $('div#carousel > img').toggleClass('transit');
                    });
                }
            });
    })();


    $('div#carousel > img:first-child').click(function(){
        clearInterval(xTimer);
        turnCarousel();
    });

    $('div#carousel > img:last-child').click(function(){
        clearInterval(xTimer);
        turnCarousel('f');
    });

    function turnCarousel(f){
        
        var xSpinner = document.querySelector("#spinner");

        if(!f){
            xAngle += xDelta;
        }else{
            xAngle -= xDelta;
        }

        //----------------------- Forward and back buttons
        $('#carousel > img').toggleClass('trans').delay(1500).queue(function(next) {
            $(this).toggleClass('trans');
            next();
        });

        xSpinner.setAttribute("style","-webkit-transform: rotateY("+ xAngle +"deg); transform: rotateY("+ xAngle +"deg);");

        $('#spinner > div').addClass('faded');

        if(xAngle > 360 || xAngle < -360){
            var i = Math.round((xAngle%360)/xDelta);
        }else{
            var i = Math.round(xAngle/xDelta);
        }

        var xF = $('.frame').get(i);
        $(xF).removeClass('faded');
    }
    
});