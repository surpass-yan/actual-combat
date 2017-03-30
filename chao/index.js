/**
 * Created by Administrator on 2017/3/30.
 */
(function () {
   //获取操作元素
    var oUls=document.getElementById('oUls');
    var oImgs=oUls.getElementsByTagName('img');//获取到所有要加载的图片
    var winH=utils.win('clientHeight');//获取浏览器窗口一屏的高度
    //回到顶部按钮
    var back=document.getElementById('back');
    var timer;
    //每隔一段时间，获取此时scrollTop,让他递减到0
    back.onclick=function () {
       utils.win('scrollTop',0);
       /* timer=setInterval(function () {
            var sTop=utils.win('scrollTop');
            if(sTop<=0){
                clearInterval(timer);
                utils.win('scrollTop',0);
                return;
            }
            sTop-=100;
            utils.win('scrollTop',sTop);
        },10)*/
    };
    //获取初始数据
    var data;
    function getInitData() {
        //发送ajax请求
        var xhr = new XMLHttpRequest;
        xhr.open('get', 'data.txt?_=' + Math.random(), false);
        xhr.onreadystatechange = function () {
            if (this.readyState === 4 && /^2\d{2}$/.test(this.status)) {
                data = utils.toJson(this.responseText);
                //如果有数据的时候  在进行绑定
               data && data.length?bindData(data):null;
            }
        };
        xhr.send(null);
    }
    getInitData();
    //绑定数据
    function bindData(data) {
        var str='';
        //字符串拼接
        for(var i=0;i<20;i++){
            //0-7之间的随机整数作为索引
            var ind=Math.round(Math.random()*14);
            var cur=data[ind];
            str+='<li><a href='+cur.link+'>';
            //将image要加载的图片路径，先保存到自身的data-real（自定义的）属性上，只有符合加载标准，
            // 在让当前img的src加载这个路径，否则显示默认背景图
            str+='<div><img data-real='+cur.src+'></div>';
            str+='<div>';
            str+='<h3>'+cur.title+'</h3>';
            str+='<p>'+cur.text+'</p>';
            str+='</div>';
            str+='</a></li>';
        }
        oUls.innerHTML+=str;//不是+= 的话就相当于重构了，把之前的覆盖了，要累加
        //在原有的基础上继续拼接累加输出      注意+=
        delayImgs();
    }

    //延迟图片加载
    function delayImgs() {
        for(var i=0;i<oImgs.length;i++){
            //如果当前img的flag为true 说明已经加载过了，就执行continue 进行检测下一个图片
            //防止重复加载，节省用户流量
           if(oImgs[i].flag) continue;
           checkImg(oImgs[i]);
        }
    }
    //检测当前图片是否符合加载标准
    function checkImg(img) {
        var sTop=utils.win('scrollTop');//要滚动的距离
        var imgTop=utils.offset(img).top;//获取图片上边框距离Body的上偏移量
        var imgH=img.offsetHeight*0.5;//获取图片自身高度的一半
        //如果浏览器窗口高度+滚动条滚出去的距离》=图片上偏移+自身高度时，说明图片已经完全出现在窗口中，
        //这时在让图片加载
        if(winH+sTop>=imgTop+imgH){
            var imgSrc=img.getAttribute('data-real');
           // console.log(imgSrc);
            var tempImg=new Image;//实例创建一个临时的Img,检测图片资源的有效性
            //如果加载成功，就会触发自身的onload事件
            console.log(imgSrc);
            tempImg.src=imgSrc;//先把地址给这个东西，让他试试图片地址是否正确，如果路径错误的话就不加载了
            //因为有的时候，路径错误的话，会显示一个缩略图，用户体验不好
            tempImg.onload=function () {
                console.log('加载成功');
                img.src=imgSrc;//路径检测正确了让页面中img加载这个图片地址
                img.flag=true;//定义一个flag，将加载过的图片的flag为true说明已经加载过了
            }
        }
    }
    //监听滚动事件
    window.onscroll=function () {
        delayImgs();//滚动的时候也要检测哪些图片可以加载
        //当滚动条快要滚动到页面底部时 继续发送ajax请求 进行加载
        var sTop=utils.win('scrollTop');
        var wScrollH=utils.win('scrollHeight');//一定要在这获取，因为每次加载完，这个值会变
        //scrollHeight是整个页面的高度，是一屏的高度+滚动条滚动的最大高度
        if(winH+sTop>=wScrollH-500){
            getInitData();//再次发送ajax请求
            console.log(132);
        }
        //控制回到页面顶部按钮，显示和隐藏
        if(sTop>=winH*0.5){
            utils.setCss(back,'display','block');
        }else {
            utils.setCss(back,'display','none');
        }
    }
})();