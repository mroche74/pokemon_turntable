"use strict";

var xAngle = 0;
var xTimer;
var xDelta; 
var xPM = [];
var j = 1;

$(document).ready(function(){

    var xImgCount = $('.carousel-img').length;
    xDelta = 360/xImgCount;
    
    for(var i=0; i<xImgCount; i++){
        $('#spinner .frame:nth-child('+ (i+1) +')').css('transform', 'rotateY('+ -(i*xDelta) +'deg)');
    }
    
    if(iecheck() == 0){
        $('#carousel').removeClass("hidden");
    }else{
        $('#SliderWrapper').removeClass("Hidden");
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

                if(iecheck() == 0 ) {
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
                }else{
                    if(j==1){
                        $('.slide-img').attr('src', xJSON.sprites.front_default);
                        $('.pm-name-ie').html(xJSON.name);
                        $('.pm-species-ie').html('Species: ' + xJSON.species.name);
                        $('.pm-height-ie').html('Height: ' + xJSON.height);
                        $('.pm-weight-ie').html('Weight: ' + xJSON.weight);
                        $.each(xJSON.abilities, function (k, v) {
                            $('.pm-abilities-ie > ul').append('<li>' + v.ability.name + '</li>');
                        });
                        $('.frame-ie').fadeIn(1500, function () {
                            $('.frame-ie').toggleClass('transit');
                        });
                    }
                }

                j++;
                if (j <= 10) {
                    cycle();
                }else{
                    $('#status > span').fadeOut(1000);
                    if(iecheck() == 0) {
                        xTimer = window.setInterval(function () {
                            turnCarousel('f');
                        }, 5000);
                        $('div#carousel > img').fadeIn(2000, function () {
                            $('div#carousel > img').toggleClass('transit');
                        });
                    }
                }

            });

    })();


    function iecheck(){
        var xUA = window.navigator.userAgent;
        var xMSIE = xUA.indexOf("MSIE ");
        if (xMSIE > 0 || window.ActiveXObject || "ActiveXObject" in window){
            return 1;
        }else{
            return 0;
        }
    }

//--------------------------------------------------------
    $('div#carousel > img:first-child').click(function(){
        clearInterval(xTimer);
        turnCarousel();
    });

    $('div#carousel > img:last-child').click(function(){
        clearInterval(xTimer);
        turnCarousel('f');
    });
//--------------------------------------------------------

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



//--------------------------------------------------------

    function slideImgClicked(f){

        if(f){
            xAF++;
        }else{
            xAF--;
        }

        if(xAF<0){
            xAF = xFrames.length-1;
        }
        else if(xAF == xFrames.length){
            xAF = 0;
        }

        if(f){
            $('#slider-image').animate({
                'right':'105%'
            }, 500)
                .queue(function(next){
                    $(this).css('right', '-105%');
                    switchFrameIE();
                    next();
                })
                .queue(function(next){
                    $(this).animate({
                        'right': '0'
                    }, 500);
                    next();
                });
        }else{
            $('#slider-image').animate({
                'right':'-105%'
            }, 500)
                .queue(function(next){
                    $(this).css('right', '105%');
                    switchFrameIE();
                    next();
                })
                .queue(function(next){
                    $(this).animate({
                        'right': '0'
                    }, 500);
                    next();
                });
        }

        function switchFrameIE(){
            $('.slide-img').attr('src', xPM[AF].sprites.front_default);
            $('.pm-name-ie').html(xPM[AF].name);
            $('.pm-species-ie').html('Species: ' + xPM[AF].species.name);
            $('.pm-height-ie').html('Height: ' + xPM[AF].height);
            $('.pm-weight-ie').html('Weight: ' + xPM[AF].weight);
            $.each(xPM[AF].abilities, function (k, v) {
                $('.pm-abilities-ie > ul').append('<li>' + v.ability.name + '</li>');
            });
            $('.frame-ie').fadeIn(1500, function () {
                $('.frame-ie').toggleClass('transit');
            });
        }
    }
    
});