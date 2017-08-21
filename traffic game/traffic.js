$(function(){
    
    var container = $("#container"),
        car = $("#car"),
        car_1 = $("#car_1"),
        car_2 = $("#car_2"),
        car_3 = $("#car_3"),
        line_1 = $("#line_1"),
        line_2 = $("#line_2"),
        line_3 = $("#line_3"),
        score = $("#score"),
        restart_btn = $("#restart"),
        restart_div = $("#restart_div"),
        anim_id,
        game_over,
        score_counter,
        speed,
        line_speed;
    
    restart_btn.focus();
    
    restart_btn.click(function(){
        restart_div.slideUp();
        
        // initialize the position
        line_1.css("top","-150px");
        line_2.css("top","150px");
        line_3.css("top","450px");
        car_1.css({"top":"-100px","left":"70%"});
        car_2.css({"top":"-200px","left":"35%"});
        car_3.css({"top":"-350px","left":"50%"});
        car.css({"top":"475px","left":"45%"});
        score.text("0");
        
        game_over = false;
        score_counter = 1;
        speed = 2;
        line_speed = 5;
        
        // starting the game
        start();
    });
    
    function start(){

        var container_left = parseInt(container.css("left")),
            container_width = parseInt(container.width()),
            container_height = parseInt(container.height()),
            car_width = parseInt(car.width()),
            car_height = parseInt(car.height());
        
        var move_right = false,
            move_left = false,
            move_up = false,
            move_down = false;

        // player car movement    
        // keydown properties
        $(document).on("keydown",function(e){
            if(game_over === false){            
                var key = e.keyCode;
                if(key === 37 && move_left === false){
                    move_left = requestAnimationFrame(left);
                }else if(key === 38 && move_up === false){
                    move_up = requestAnimationFrame(up);
                }else if(key === 39 && move_right === false){
                    move_right = requestAnimationFrame(right);
                }else if(key === 40 && move_down === false){
                    move_down = requestAnimationFrame(down);
                }
            }
        });

        // keyup properties
        $(document).on("keyup",function(e){
            if(game_over === false){
                var key = e.keyCode;
                if(key === 37){
                    cancelAnimationFrame(move_left);
                    move_left = false;
                }else if(key === 38){
                    cancelAnimationFrame(move_up);
                    move_up = false;
                }else if(key === 39){
                    cancelAnimationFrame(move_right);
                    move_right = false;
                }else if(key === 40){
                    cancelAnimationFrame(move_down);
                    move_down = false;                    
                }
            }
        });

        // left movement function
        function left(){
            if(game_over === false && parseInt(car.css("left")) > 5){
                car.css("left",parseInt(car.css("left"))-5);
                move_left = requestAnimationFrame(left);
            }
        }

        // right movement function
        function right(){
            if(game_over === false && parseInt(car.css("left")) < container_width - car_width - 5){
                car.css("left",parseInt(car.css("left"))+5);
                move_right = requestAnimationFrame(right);
            }
        }

        // up movement function
        function up(){
            if(game_over === false && parseInt(car.css("top")) > 6){
                car.css("top",parseInt(car.css("top"))-5);
                move_up = requestAnimationFrame(up);
            }
        }

        // down movement function
        function down(){
            if(game_over === false && parseInt(car.css("top")) < container_height - car_height - 5){
                car.css("top",parseInt(car.css("top"))+5);
                move_down = requestAnimationFrame(down);
            }
        }

        // lines down & blue cars movement - function call
        anim_id = requestAnimationFrame(repeat);

        // repeation of lines down & blue cars down movement
        function repeat(){
            if(game_over === false){

                if(collision(car,car_1) || collision(car,car_2) || collision(car,car_3))
                    gameOver();

                // score display part
                score_counter++;
                if(score_counter % 20 == 0)
                    score.text(parseInt(score.text())+1);

                // speed increment part
                if(score_counter % 500 == 0){
                    speed++;
                    line_speed++;
                }                

                car_down(car_1);
                car_down(car_2);
                car_down(car_3);

                line_down(line_1);
                line_down(line_2);
                line_down(line_3);

                anim_id = requestAnimationFrame(repeat);
            }
        }

        // blue cars down function
        function car_down(car){
            var current_top = parseInt(car.css("top"));
            // blue cars reappear on top of road when they went out of the road (road -> container)
            if(current_top > container_height){
                current_top = -200;
                var car_left = parseInt(Math.random() * (container_width - car_width));
                // increment and decrement car's left value for tyres appearence
                // blue cars goes left most
                if(car_left < 5)
                    car_left = 5;
                // blue cars goes right most
                if(car_left > (container_width - car_width - 5))
                    car_left = (container_width - car_width - 5);

                car.css("left",car_left);
            }            
            car.css("top",current_top+speed);
        }

        // lines down movement
        function line_down(line){
            var line_current_top = parseInt(line.css("top"));
            if(line_current_top > container_height)
                line_current_top = -200;
            line.css("top",line_current_top+line_speed);
        }

        // game over function
        function gameOver(){
            game_over = true;
            cancelAnimationFrame(anim_id);
            cancelAnimationFrame(move_left);
            cancelAnimationFrame(move_right);
            cancelAnimationFrame(move_up);
            cancelAnimationFrame(move_down);
            restart_btn.text("Restart");
            $("#small").text("(Press Enter)");
            restart_div.slideDown();
            restart_btn.focus();
        }

        // collision concept
        function collision(div1,div2){
            var x1 = div1.offset().left,
                y1 = div1.offset().top,
                h1 = div1.outerHeight(true),
                w1 = div1.outerWidth(true),
                b1 = y1 + h1 + 9,
                r1 = x1 + w1 + 10,

                x2 = div2.offset().left,
                y2 = div2.offset().top,
                h2 = div2.outerHeight(true),
                w2 = div2.outerWidth(true),
                b2 = y2 + h2 + 9,
                r2 = x2 + w2 + 10;

            if(b1<y2 || b2<y1 || r1<x2 || r2<x1)
                return false;
            return true;
        }
    
    }
    
});


