var $=function(index){
    return document.querySelector(index);
}
var $All = function(index) {
    return document.querySelectorAll(index);
};
var All_items=[];//全部todo信息
var my_color;//存储颜色信息
var tem_id=0;
var colors=['rgba(51, 190, 255, 0.3)','rgba(141, 51, 255, 0.3)','rgba(243, 223, 76, 0.3)','rgba(175, 47, 47, 0.3)',
    'rgba(64, 245, 127, 0.3)','rgba(250, 109, 92, 0.3)','rgba(247, 60, 157, 0.3)','rgba(154, 60, 247, 0.3)'];
function getNowFormatDate() {//获取当前时间
    var date = new Date();
    var seperator1 = "-";
    var seperator2 = ":";
    var month = date.getMonth() + 1 < 10 ? "0" + (date.getMonth() + 1) : date.getMonth() + 1;
    var strDate = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
    var currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
        + " " + date.getHours() + seperator2 + date.getMinutes()
        + seperator2 + date.getSeconds();
    return currentdate;
}
function addLongDown(ele , fn){//长按事件
    var time = 0; // 用于计算按下时间
    var flag = false; // 判断按下时间否是大于500毫秒

    ele.addEventListener('touchstart' , function(e){ // 按下计时
        time = new Date().getTime();
    });

    ele.addEventListener('touchend' , function(e){ // 抬起计算
        flag = (new Date().getTime() - time) > 500;
        if(flag){
            fn.call(this , e); // 按下大于500毫秒执行回调函数
        }
    });

    ele.addEventListener('click' , function(e){ // 在同一个target上执行按下和抬起会触发点击事件,屏蔽掉已经绑定的点击事件
        if(flag){
            flag = false; // 重新计算
            // fe.call(this,e);
            e.stopImmediatePropagation(); // 屏蔽this的所有点击事件
        }
    });
}

var updateall = function(){
    //
    var lef_num=0;
    var com_num=0;
    model.flush();

    var todo = $('.todo_list');
    todo.innerHTML = '';
    //选择栏的保留
    console.log(model.data);
    var filters = $All('.filters li a');
    // console.log(filters);
    for(var i=0;i<filters.length;i++){
        // console.log(filters[i].childNodes[0].data)
        // console.log(model.data.filter)
        if(filters[i].childNodes[0].data==model.data.filter){
            console.log(i);
            for(var j=0;j<filters.length;j++){
                // console.log(filters[j])
                filters[j].classList.remove('selected');
                // filters[j].style.borderColor='none';
            }
            filters[i].classList.add('selected');
        }
    }
    //主题颜色处理
    my_color=model.data.color;
    var h1=$('.color');
    var filt=$('.filters li a.selected')
    // console.log(filt)
    h1.style.color=colors[my_color];
    for(var i=0;i<filters.length;i++){
        // console.log(filters[i])
        // console.log(filt)
        filters[i].style.borderColor='transparent';
        filters[i].onmouseover=function(){
            this.style.borderColor=colors[my_color];
        }
        filters[i].onmouseout=function(){
            this.style.borderColor='transparent';
        }
    }
    filt.style.borderColor=colors[my_color];
//数据处理
    All_items.forEach(function(mydata,index) {
        if(mydata.comp){
            com_num++;
        }

        // console.log(mydata);
        if ((model.data.filter == 'All') || (model.data.filter == 'Active' && !mydata.comp) ||
            (model.data.filter == 'Completed' && mydata.comp)) {


            var tem = document.createElement('li');
            if (mydata.comp) {
                tem.classList.add('completed')
            }
            var my_id='tem'+tem_id;
            tem.setAttribute('id',my_id);
            var entry=document.createElement('div');
            entry.setAttribute('class','entry');//作为最外层div

            //点击完成
            var inp=document.createElement('input');
            inp.setAttribute('class','done');
            inp.setAttribute('type','checkbox');
            inp.checked=mydata.comp;
            inp.addEventListener('change',function(){
                mydata.comp=!mydata.comp;
                model.data.items=All_items;
                model.flush();
                updateall()
            });

            //双击编辑
            var mess=document.createElement('label');
            mess.setAttribute('class','todo_mess');
            mess.innerHTML=mydata.mess;
            mess.addEventListener('click',function(){
                // alert(1)
                //置顶
                // console.log(mydata);
                // console.log(index);
                var my_tem=[];
                for(var j=0;j<All_items.length;j++){
                    if(j!=index){
                        my_tem.push(All_items[j]);
                    }
                }
                my_tem.push(mydata);
                // console.log(my_tem)
                All_items=my_tem;
                model.data.items=All_items;
                model.flush();
                updateall();
            })
            addLongDown(mess,function(){
                console.log(8)
                //事件确实触发了，为什么没有进行编辑
                tem.classList.add('editing');
                //创建新的input元素并输入
                //     console.log(this);
                var lab=tem.querySelector('.todo_mess');
                var init_mess=lab.innerHTML;
                var my_edit = document.createElement('input');
                my_edit.setAttribute('type', 'text');
                my_edit.setAttribute('class', 'edit');
                my_edit.setAttribute('value', init_mess);
                // console.log(my_edit)
                var finished = false;
                function finish() {//非正常结束

                    if (finished)
                    // console.log(5)
                        return;
                    finished = true;
                    // console.log(5)
                    tem.removeChild(my_edit);
                    tem.classList.remove('editing');
                    // console.log(5)
                }

                my_edit.addEventListener('blur', function() {
                    finish();
                });//失焦

                my_edit.addEventListener('keyup', function(e) {
                    if (e.keyCode == 27) { // Esc
                        finish();
                    } else if (e.keyCode == 13) {//回车键
                        var lab=tem.querySelector('.todo_mess');

                        lab.innerHTML = this.value;
                        //对全局数据做改变操作
                        mydata.mess=this.value;
                        model.data.items=All_items;
                        model.flush();
                        finish();
                        updateall();
                    }
                });
                tem.appendChild(my_edit);
                my_edit.focus();
                // updateall();
            })

            //点击删除
            var des=document.createElement('button');
            des.setAttribute('class','destroy');
            des.addEventListener('click',function(){
                All_items.splice(index,1);
                model.data.items=All_items;
                model.flush();
                updateall();
            });

            entry.appendChild(inp);
            entry.appendChild(mess);
            entry.appendChild(des);
            tem.appendChild(entry);
            // console.log(todo)
            todo.insertBefore(tem, todo.firstChild);
            // console.log(tem);
            }
            //至此，增加list的dom结构完成

        })
    //剩余栏

    // console.log(time);
    lef_num=All_items.length-com_num;
    // console.log(com_num);
    // console.log(lef_num)
    var count=$('.count');
    if(lef_num==0){
        count.innerHTML='No items left'
    }else if(lef_num==1){
        count.innerHTML= '1 item left'
    }else{
        count.innerHTML=lef_num+' items left'
    }
    model.data.items=All_items;
    //下一步需要调整completeall和clear的可见性
    //游戏栏是否可见
    var time=getNowFormatDate();
    $('.time').innerHTML='Now it is '+time;
    if(lef_num>3){
        $('.fun').style.visibility='visible';
        $('.have_fun').style.visibility='visible';
    }else{
        $('.fun').style.visibility='hidden';
        $('.have_fun').style.visibility='hidden';
    }
    //clearall的可见性
    if(All_items.length==0){
        $('.clear_all').style.visibility='hidden';
    }else if(All_items.length>0){
        $('.clear_all').style.visibility='visible';
    }
    //completeall
    if(All_items.length==0){
        $('.complete_all').style.visibility='hidden';
    }else{
        $('.complete_all').style.visibility='visible'
        if(All_items.length==com_num){
            $('.complete_all').checked=true;
        }else{
            $('.complete_all').checked=false;
        }
    }
    //clear
    if(com_num>0){
        $('.clear').style.visibility='visible';
    }else{
        $('.clear').style.visibility='hidden';
    }
    console.log(model.data)
    // console.log(com_num)
}

window.onload=function(){
    // alert(1)
    // console.log(model.data.color)
    // localStorage.clear();
    // console.log(model.data);
    // document.addEventListener(
    //
    //     'touchmove',
    //     function (event) {
    //         event.preventDefault()
    //     },
    //     {passive: false}
    // )
    // document.getElementById("bg").src="bg.mp3";

    model.init(function() {
        // console.log(model.data)

        model.flush();
        // console.log(model.data.filter)
        All_items = model.data.items;
        my_color=model.data.color;
        var data = model.data;//所有todo信息的数组
        updateall()
//换颜色
        var shakeThreshold = 1000; // 定义一个摇动的阈值
        var lastUpdate = 0; // 记录上一次摇动的时间
        var x, y, z, lastX, lastY, lastZ; // 定义x、y、z记录三个轴的数据以及上一次触发的数据

// 监听传感器运动事件
        var change=$('.color');
        change.addEventListener('click',function(){
            // console.log(model.data)
            // alert(6)
            if(my_color<7){
                my_color++;
            }else if(my_color==7){
                my_color=0;
            }
            // console.log(my_color)
            model.data.color=my_color;
            model.flush();
            updateall();
        });
        if (window.DeviceMotionEvent) {
            // alert(7)
            window.addEventListener('devicemotion', deviceMotionHandler, false);
        } else {
            var change=$('.color');
            change.addEventListener('click',function(){
                // console.log(model.data)
                // alert(6)
                if(my_color<7){
                    my_color++;
                }else if(my_color==7){
                    my_color=0;
                }
                // console.log(my_color)
                model.data.color=my_color;
                model.flush();
                updateall();
            })
        }

// 运动传感器处理
        //若不支持运动事件，则绑定到标题的点击事件
        function deviceMotionHandler(eventData) {
            var acceleration = eventData.accelerationIncludingGravity; // 获取含重力的加速度
            var curTime = new Date().getTime();

            // 100毫秒进行一次位置判断
            if ((curTime - lastUpdate) > 100) {

                var diffTime = curTime - lastUpdate;
                lastUpdate = curTime;

                x = acceleration.x;
                y = acceleration.y;
                z = acceleration.z;

                var speed = Math.abs(x + y + z - lastX - lastY - lastZ) / diffTime * 10000;
                // 前后x, y, z间的差值的绝对值和时间比率超过了预设的阈值，则判断设备进行了摇晃操作
                if (speed > shakeThreshold) {
                    // alert(8);
                    if(my_color<7){
                        my_color++;
                    }else if(my_color==7){
                        my_color=0;
                    }
                    // console.log(my_color)
                    model.data.color=my_color;
                    model.flush();
                    updateall();
                }

                lastX = x;
                lastY = y;
                lastZ = z;
            }
        }

//输入栏
        var addtodo=$('.addtodo');
        addtodo.addEventListener('keyup', function(e) {
            // data.msg=input_todo.value;
            if (e.keyCode == 13) {
                var mes = addtodo.value;
                if (mes == '') {
                    console.warn('Can not input empty message');
                    return;
                }
                All_items.push({
                    mess:mes,
                    comp:false
                })
                model.data.items=All_items;
                model.flush();
                addtodo.value = '';
                updateall();
                // console.log(data)
            }
        });
//选择栏
        var filters = $All('.filters li a');
        // console.log(filters);
        for(var i=0;i<filters.length;i++){
            filters[i].addEventListener('click',function(){
                // console.log(this)
                model.data.filter=this.innerHTML;
                for(var j=0;j<filters.length;j++){
                    // console.log(filters[j])
                    filters[j].classList.remove('selected');
                }
                this.classList.add('selected');
                // console.log(this)
                model.flush();
                updateall();
                // console.log(model.data.filter)
            })
        }
//完成所有
        var com_all=$('.complete_all');
        com_all.addEventListener('click',function(){
            if(com_all.checked){
                com_all.checked=true;
                for(var i=0;i<All_items.length;i++){
                    All_items[i].comp=true;
                }
                model.data.items=All_items;
                model.flush();
            }else if(!com_all.checked){
                com_all.checked=false;
                for(var i=0;i<All_items.length;i++){
                    All_items[i].comp=false;
                }
                model.data.items=All_items;
                model.flush();
            }
            updateall();
        })
//清理已完成
        var clear=$('.clear');
        clear.addEventListener('click',function(){
            var tem=[];
            for(var i=0;i<All_items.length;i++){
                if(All_items[i].comp!=true){
                    tem.push({
                        mess:All_items[i].mess,
                        comp:All_items[i].comp
                    })
                }
            }
            All_items=tem;
            model.data.items=All_items;
            model.flush();
            updateall();
        })
    })
    updateall();
//清理所有
    var clear_all=$('.clear_all');
    clear_all.addEventListener('click',function(){
        // console.log(5)
        All_items=[];
        model.data.items=All_items;
        model.flush();
        updateall();
    })
    var have_fun=$('.have_fun');
    have_fun.addEventListener('click',function(){
        window.location='http://www.dunwan.com/game/game_3178.html';
    })
}