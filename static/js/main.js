//替换页脚版权信息
//$("#gfooter").load("/static/etc/footer.ht");
//$("#gfooter").load("/public/footer.ht");
//id跳转
function zw_tj(ele){
    //ele为指定跳转到该位置的DOM节点
    let bridge = ele;
    let root = document.body;
    let height = 0;
    do{
        height += bridge.offsetTop;
        bridge = bridge.offsetParent;
    }while(bridge !== root)
    window.scrollTo(0,height);
    //return height;
}
//返回顶部
function zw_gtop(){
    window.scrollTo(0,0);
}
$(window).scroll(function(){
    var sc=$(window).scrollTop();
    //var rwidth=$(window).width()
    if(sc>1000){
     $(".backtop").css("display","block");
     //$(".backtop").css("left",(rwidth-36)+"px")
    }else{
    $(".backtop").css("display","none");
    }
})