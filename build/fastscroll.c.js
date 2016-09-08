!function(window,document,Math){function getTime(){return(new Date).getTime()}function momentum(current,start,time,lowerMargin,wrapperSize,deceleration){var destination,duration,distance=current-start,speed=Math.abs(distance)/time;return deceleration=void 0===deceleration?6e-4:deceleration,destination=current+speed*speed/(2*deceleration)*(distance<0?-1:1),duration=speed/deceleration,destination<lowerMargin?(destination=wrapperSize?lowerMargin-wrapperSize/2.5*(speed/8):lowerMargin,distance=Math.abs(destination-current),duration=distance/speed):destination>0&&(destination=wrapperSize?wrapperSize/2.5*(speed/8):0,distance=Math.abs(current)+destination,duration=distance/speed),{destination:Math.round(destination),duration:duration}}function IScroll(el,options){el.charAt&&"#"==el.charAt(0)&&(el=el.substr(1,el.length-1)),this.wrapper="string"==typeof el?document.getElementById(el):el,this.wrapper.style.overflow="hidden",this.scroller=this.wrapper.children[0],this.scrollerStyle=this.scroller.style,this._events={},this.options={momentum:!0,bounce:!0,deceleration:void 0,bounceTime:600,startX:0,startY:0,scrollX:!1,scrollY:!0,directionLockThreshold:5,onfunction:function(e){e.preventDefault()},onScrollStart:null,onBeforeScrollMove:null,onScrollMove:function(){console.log("ScrollY::",this.y)},onBeforeScrollEnd:null,onScrollEnd:null,useTransition:!0};for(var i in options)this.options[i]=options[i];this.options.bounceEasing=ease.circular,3==this.options.probeType&&(this.options.useTransition=!1),this.x=0,this.y=0,this.directionX=0,this.directionY=0,this.translateZ=" translateZ(0)",this._init(),this.refresh(),this.scrollTo(this.options.startX,this.options.startY)}var rAF=window.requestAnimationFrame||window.webkitRequestAnimationFrame||function(callback){window.setTimeout(callback,1e3/60)},hasTouch="ontouchstart"in window,START_EV=hasTouch?"touchstart":"mousedown",MOVE_EV=hasTouch?"touchmove":"mousemove",END_EV=hasTouch?"touchend":"mouseup",CANCEL_EV=hasTouch?"touchcancel":"mouseup",ease={quadratic:{style:"cubic-bezier(0.25, 0.46, 0.45, 0.94)",fn:function(k){return k*(2-k)}},circular:{style:"cubic-bezier(0.1, 0.57, 0.1, 1)",fn:function(k){return Math.sqrt(1- --k*k)}}};IScroll.prototype={refresh:function(){console.log("refresh");var that=this,wrapperWidth=this.options.wrapperWidth,wrapperHeight=this.options.wrapperHeight,scrollerWidth=this.options.scrollerWidth,scrollerHeight=this.options.scrollerHeight;that.wrapperW=wrapperWidth||that.wrapper.clientWidth||1,that.wrapperH=wrapperHeight||that.wrapper.clientHeight||1,this.wrapperWidth=wrapperWidth||this.wrapper.clientWidth,this.wrapperHeight=wrapperHeight||this.wrapper.clientHeight,that.minScrollY=-that.options.topOffset||0,that.scrollerW=scrollerWidth||Math.round(that.scroller.offsetWidth),that.scrollerH=scrollerHeight||Math.round(that.scroller.offsetHeight+that.minScrollY),that.maxScrollX=that.wrapperW-that.scrollerW,that.maxScrollY=that.wrapperH-that.scrollerH+that.minScrollY,this.hasHorizontalScroll=this.options.scrollX&&this.maxScrollX<0,this.hasVerticalScroll=this.options.scrollY&&this.maxScrollY<0,this.hasHorizontalScroll||(this.maxScrollX=0,this.scrollerWidth=this.wrapperWidth),this.hasVerticalScroll||(this.maxScrollY=0,this.scrollerHeight=this.wrapperHeight),that.endTime=0,that.directionX=0,that.directionY=0,that.options.onRefresh&&that.options.onRefresh.call(that),that._resetPos()},getComputedPosition:function(){var x,y,matrix=window.getComputedStyle(this.scroller,null);return console.log("getComputedPosition------",matrix.webkitTransform),matrix=matrix.webkitTransform.split(")")[0].split(", "),x=+(matrix[12]||matrix[4]),y=+(matrix[13]||matrix[5]),{x:x,y:y}},_init:function(){this._initEvents()},_initEvents:function(){this._bind(START_EV)},_onStart:function(event){console.log("_onStart");for(var that=this,target=event.target;1!=target.nodeType;)target=target.parentNode;"SELECT"!=target.tagName&&"INPUT"!=target.tagName&&"TEXTAREA"!=target.tagName&&event.preventDefault(),this.options.onBeforeScrollStart&&this.options.onBeforeScrollStart.call(this,event),this._execEvent("onBeforeScrollStart"),this.moved=!1;var point=event.touches?event.touches[0]:event;if(this.distX=0,this.distY=0,this.directionLocked=0,this.startTime=getTime(),this._transitionTime(),this.startX=this.x,this.startY=this.y,this.pointX=point.pageX,this.pointY=point.pageY,this.options.useTransition&&this.isInTransition){console.log("--------------in transition............",this.scrollerStyle.webkitTransitionDuration),that.isInTransition=!1;var pos=that.getComputedPosition();that._translate(Math.round(pos.x),Math.round(pos.y)),that.startX=that.x,that.startY=that.y}else!this.options.useTransition&&this.isAnimating&&(this.isAnimating=!1,this._execEvent("scrollEnd"));this.options.onScrollStart&&this.options.onScrollStart.call(this,event),this._execEvent("onScrollStart"),this._bind(MOVE_EV),this._bind(END_EV),this._bind(CANCEL_EV),this._bind("webkitTransitionEnd")},_onMove:function(event){console.log("_onMove");var that=this;event.preventDefault();var point=event.touches?event.touches[0]:event,deltaX=point.pageX-this.pointX,deltaY=point.pageY-this.pointY;that.options.onBeforeScrollMove&&that.options.onBeforeScrollMove.call(that,event),this._execEvent("onBeforeScrollMove");var absDistX,absDistY,newX,newY,timestamp=getTime();this.pointX=point.pageX,this.pointY=point.pageY,this.distX+=deltaX,this.distY+=deltaY,absDistX=Math.abs(this.distX),absDistY=Math.abs(this.distY),absDistX>absDistY+this.options.directionLockThreshold?this.directionLocked="h":absDistY>=absDistX+this.options.directionLockThreshold?this.directionLocked="v":this.directionLocked="n","h"==this.directionLocked?deltaY=0:"v"==this.directionLocked&&(deltaX=0),deltaX=this.hasHorizontalScroll?deltaX:0,deltaY=this.hasVerticalScroll?deltaY:0,newX=this.x+deltaX,newY=this.y+deltaY,timestamp-this.endTime>300&&absDistX<10&&absDistY<10||((newX>0||newX<that.maxScrollX)&&(newX=that.options.bounce?that.x+deltaX/3:newX>=0||that.maxScrollX>=0?0:that.maxScrollX),(newY>this.minScrollY||newY<this.maxScrollY)&&(newY=this.options.bounce?this.y+deltaY/3:newY>=this.minScrollY||this.maxScrollY>=0?this.minScrollY:this.maxScrollY),this.moved=!0,this._translate(newX,newY),this.directionY=deltaY>0?-1:deltaY<0?1:0,timestamp-this.startTime>300&&(this.startTime=timestamp,this.startX=this.x,this.startY=this.y,1==this.options.probeType&&this._execEvent("scroll")),this.options.probeType>1&&this._execEvent("scroll"),this.options.onScrollMove&&this.options.onScrollMove.call(this,event),this._execEvent("onScrollMove"))},_onEnd:function(event){console.log("_onEnd");var that=this;this.isInTransition=0;var newX=Math.round(this.x),newY=Math.round(this.y),distanceX=Math.abs(newX-this.startX),distanceY=Math.abs(newY-this.startY),duration=getTime()-this.startTime;this._unbind(MOVE_EV),this._unbind(END_EV),this._unbind(CANCEL_EV);var easing="";if(that.options.onBeforeScrollEnd&&that.options.onBeforeScrollEnd.call(that,event),this._execEvent("onBeforeScrollEnd"),this.endTime=getTime(),!this._resetPos(this.options.bounceTime)){if(this.scrollTo(newX,newY),!this.moved)return console.log("---------onScrollCancel"),this.options.onScrollCancel&&this.options.onScrollCancel.call(this,event),void this._execEvent("onScrollCancel");if(console.log("flick::",duration,distanceX,distanceY),console.log("======",this.options.momentum,duration),this.options.momentum&&duration<300){var momentumX=this.hasHorizontalScroll?momentum(this.x,this.startX,duration,this.maxScrollX,this.options.bounce?this.wrapperWidth:0,this.options.deceleration):{destination:newX,duration:0},momentumY=this.hasVerticalScroll?momentum(this.y,this.startY,duration,this.maxScrollY,this.options.bounce?this.wrapperHeight:0,this.options.deceleration):{destination:newY,duration:0};newX=momentumX.destination,newY=momentumY.destination,console.log("_onEnd::newY:",newY),console.log(this.y,this.startY,duration,this.maxScrollY,this.options.bounce);var time=Math.max(momentumX.duration,momentumY.duration);this.isInTransition=1}return newX!=this.x||newY!=this.y?((newX>0||newX<this.maxScrollX||newY>0||newY<this.maxScrollY)&&(easing=ease.quadratic),void this.scrollTo(newX,newY,time,easing)):void 0}},scrollTo:function(x,y,time,easing){easing=easing||ease.circular,this.isInTransition=time>0,!time||this.options.useTransition&&easing.style?(this._transitionTimingFunction(easing.style),this._transitionTime(time),this._translate(x,y)):this._animate(x,y,time,easing.fn)},_translate:function(x,y){console.log("_translate::",this.scrollerStyle.webkitTransitionDuration),this.scrollerStyle.webkitTransform="translate("+x+"px,"+y+"px)"+this.translateZ,this.x=x,this.y=y},_transitionTime:function(time){time=time||0,this.scrollerStyle.webkitTransitionDuration=time+"ms"},_transitionTimingFunction:function(easing){this.scrollerStyle.webkitTransitionTimingFunction=easing},_bind:function(type,el,bubble){(el||this.scroller).addEventListener(type,this,!!bubble)},_unbind:function(type,el,bubble){(el||this.scroller).removeEventListener(type,this,!!bubble)},handleEvent:function(event){var that=this;switch(event.type){case START_EV:that._onStart(event);break;case MOVE_EV:that._onMove(event);break;case END_EV:case CANCEL_EV:that._onEnd(event);break;case"webkitTransitionEnd":that._onTransitionEnd(event)}},_onTransitionEnd:function(e){console.log("_onTransitionEnd"),e.target==this.scroller&&this.isInTransition&&(this._transitionTime(),this._resetPos(this.options.bounceTime)||(this.isInTransition=!1,this._unbind("webkitTransitionEnd"),this.options.onScrollEnd&&this.options.onScrollEnd.call(this),this._execEvent("onScrollEnd"),this.options.probeType&&this._execEvent("scroll")))},_resetPos:function(time){console.log("_resetPos");var x=this.x,y=this.y;return time=time||0,!this.hasHorizontalScroll||this.x>0?x=0:this.x<this.maxScrollX&&(x=this.maxScrollX),!this.hasVerticalScroll||this.y>0?y=0:this.y<this.maxScrollY&&(y=this.maxScrollY),(x!=this.x||y!=this.y)&&(console.log("-----3------"),this.scrollTo(x,y,time,this.options.bounceEasing),!0)},on:function(type,fn){this._events[type]||(this._events[type]=[]),this._events[type].push(fn)},_execEvent:function(type){if(console.log("_execEvent:",type),this._events[type]){var i=0,l=this._events[type].length;if(l)for(;i<l;i++)this._events[type][i].apply(this,[].slice.call(arguments,1))}},_animate:function(destX,destY,duration,easingFn){function step(){var newX,newY,easing,now=getTime();return now>=destTime?(that.isAnimating=!1,that._translate(destX,destY),void(that._resetPos(that.options.bounceTime)||that._execEvent("scrollEnd"))):(now=(now-startTime)/duration,easing=easingFn(now),newX=(destX-startX)*easing+startX,newY=(destY-startY)*easing+startY,that._translate(newX,newY),that.isAnimating&&rAF(step),void(3==that.options.probeType&&that._execEvent("scroll")))}var that=this,startX=this.x,startY=this.y,startTime=getTime(),destTime=startTime+duration;this.isAnimating=!0,step()}},window.FastScroll=window.fs=window.FS=window.is=window.IS=IScroll,window.IScroll||(window.IScroll=IScroll)}(window,document,Math);