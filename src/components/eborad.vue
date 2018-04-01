<template>
   <div class="board">
       <div class="menu" id="sidebar">菜单
           		<div class="sidebar-draw">
			<h2>画笔</h2>
			<ul>
				<li>
					<span></span>
				</li>
				<li>
					<span></span>
				</li>
				<li>
					<span></span>
				</li>
				<li>
					<span></span>
				</li>
				<li>
					<span></span>
				</li>
				<li>
					<span></span>
				</li>			
			</ul>
		</div>
        <div class="sidebar-color">
			<h2>颜色</h2>
			<ul>
				<li></li>
				<li></li>				
				<li></li>
				<li></li>
				<li></li>
				<li></li>
				<li></li>
			</ul>
		</div>
       </div>
       <div class="canvas">
           <canvas ref="myboard"></canvas>
       </div>
       	<ul id="menu">
		<li>
			<span class="glyphicon glyphicon-pencil"> 画笔</span>
		</li>
		<li>
			<span class="glyphicon glyphicon-italic">直线</span>
		</li>
		<li>
			<span></span>
		</li>
		<li>
			<span></span>
		</li>
		<li>
			<span class="glyphicon glyphicon-cog"></span>
		</li>
		<li>
			<span class="glyphicon glyphicon-asterisk"></span>
		</li>
		<li>
			<span class="glyphicon glyphicon-erase"></span>
		</li>
		<li>
			<span class="glyphicon glyphicon-repeat"></span>
		</li>
		<li>
			<span class="glyphicon glyphicon-download"></span>
		</li>		
	</ul>
   </div>  
</template>
<script>
var MYDATA = []
export default {
  data () {
     return {
         W: 0,
         H: 0,
         CTX: null,
        //  MYDATA: [], //存储绘制工具
         COLOR: '#f00056',
         LINE: 5,
         PENS: 0,
         ERAS: 0,
         TIMER:null
     }
  },
  methods: {
     init: function () {
         this._showBoard();
         this._drawPen();
         this.menuOption()
         this._selectColor();
         this._selectLine()
     },
     _showBoard () {
        //  显示画板
         this.$refs.myboard.width = document.querySelector('.canvas').clientWidth;
         this.$refs.myboard.height = document.querySelector('.canvas').clientWidth;;
         this.W = document.querySelector('.canvas').clientWidth;
         this.H = document.querySelector('.canvas').clientWidth;
         this.CTX = this.$refs.myboard.getContext('2d')
         console.log(this.$refs.myboard.getClientRects())
     },
       //  画笔功能
     _drawPen () {
         var that = this;
         this.$refs.myboard.ontouchstart = function (ev) {
            
             var ev = ev || event;
             var sx = ev.changedTouches[0].clientX; //触摸目标在视口中的X坐标
             var sy = ev.changedTouches[0].clientY; //触摸目标在视口中的Y坐标
             var startLocation = that._getlocation(sx,sy)
             this.PENS++;
             // 画笔性能优化 每36ms取一个点
             var onOff = true;

             ev.target.ontouchmove = function(ev) {
                //  console.log(ev)
                 if(!onOff) return;
                 onOff = false;
                 setTimeout(function(){
                     onOff = true
                 },36)
                 var ev = ev||event;
                 var ex = ev.changedTouches[0].clientX
                 var ey = ev.changedTouches[0].clientY
                 var endLocation = that._getlocation(ex,ey)
                 var n = MYDATA.length;
                 console.log(MYDATA,n)
                //  console.log(n =0)
                 MYDATA[n] = new Object()
                 //  为画笔绘制的对象定义属性'point-line'
                 //  该对象存入绘制数据
                 MYDATA[n].attr = 'point-line';
                 MYDATA[n].count = that.PENS;
                 MYDATA[n].sx = startLocation.x;
                 MYDATA[n].sy = startLocation.y;
                 MYDATA[n].ex = endLocation.x;
                 MYDATA[n].ey = endLocation.y;
                 MYDATA[n].w = that.LINE;
                 MYDATA[n].c = that.COLOR

                 
                 //  直接绘制
                 that.CTX.beginPath();
                 that.CTX.moveTo(startLocation.x,startLocation.y);
                 that.CTX.lineTo(endLocation.x,endLocation.y)
                 that.CTX.closePath()
                 that.CTX.strokeStyle = that.COLOR;
                 that.CTX.lineJoin = 'round'
                 that.CTX.lineCap = 'round'
                 that.CTX.lineWidth = that.LINE
                 that.CTX.stroke()
                //  sx = ex;
                //  sy = ey;
                startLocation.x = endLocation.x;
                startLocation.y = endLocation.y
             }
             ev.target.ontouchend = function() {
                 ev.target.ontouchmove = ' '
             }
             return false;
         }
     },
     //  直线绘制
     _drawLine () {
         var that = this;
         this.$refs.myboard.ontouchstart = function(ev){
             var ev = ev || event;
             var sx = ev.changedTouches[0].clientX;
             var sy = ev.changedTouches[0].clientY;
             var startLocation = that._getlocation(sx,sy);
             var n = MYDATA.length;
             ev.target.ontouchmove = function(ev) {
                 var ev = ev||event;
                 var ex = ev.changedTouches[0].clientX;
                 var ey = ev.changedTouches[0].clientY;
                 var endLocation = that._getlocation(ex,ey)

                 MYDATA[n] = new Object();
                 MYDATA[n].attr = 'line';
                 MYDATA[n].sx = startLocation.x
                 MYDATA[n].sy = startLocation.y
                 MYDATA[n].ex = endLocation.x
                 MYDATA[n].ey = endLocation.y
                 MYDATA[n].w = that.LINE
                 MYDATA[n].c = that.COLOR
                 
                 //  直线绘制时，时时渲染
                 that._canvasrender()
             }
             ev.target.ontouchend = function () {
                 ev.target.ontouchmove = ''
             }
             return false;
         }
     },
     //  绘制圆形
     _drawCircle () {
        var that = this;
        this.$refs.myboard.ontouchstart = function (ev) {
            var ev = ev || event
            var sx = ev.changedTouches[0].clientX
            var sy = ev.changedTouches[0].clientY
            var startLocation = that._getlocation(sx,sy)
            var n = MYDATA.length
            
            ev.target.ontouchmove = function (ev) {
                var ev = ev || event;
                var ex = ev.changedTouches[0].clientX
                var ey = ev.changedTouches[0].clientY
                var endLocation = that._getlocation(ex, ey)

                var cx = endLocation.x - startLocation.x
                var cy = endLocation.y - startLocation.y
                
                var R = Math.sqrt(cx * cx + cy * cy)/2
                MYDATA[n] = new Object()
                MYDATA[n].attr = 'circle'
                MYDATA[n].x = cx/2 + startLocation.x
                MYDATA[n].y = cx/2 + startLocation.y
                MYDATA[n].r = R
                MYDATA[n].c = that.COLOR

                that._canvasrender()
            }
            ev.target.ontouchend = function () {
                 ev.target.ontouchmove = ''
             }
             return false;
        } 
     },
     //  绘制矩形
     _drawRect () {
        var that = this;
        this.$refs.myboard.ontouchstart = function (ev) {
            var ev = ev || event
            var sx = ev.changedTouches[0].clientX
            var sy = ev.changedTouches[0].clientY
            var startLocation = that._getlocation(sx,sy)
            var n = MYDATA.length
            
            ev.target.ontouchmove = function (ev) {
                var ev = ev || event;
                var ex = ev.changedTouches[0].clientX
                var ey = ev.changedTouches[0].clientY
                var endLocation = that._getlocation(ex, ey)

                var cx = endLocation.x - startLocation.x
                var cy = endLocation.y - startLocation.y
                
                MYDATA[n] = new Object()
                MYDATA[n].attr = 'rect'
                MYDATA[n].x = startLocation.x
                MYDATA[n].y = startLocation.y
                MYDATA[n].w = cx
                MYDATA[n].h = cy
                MYDATA[n].c = that.COLOR

                that._canvasrender()
            }
            ev.target.ontouchend = function () {
                 ev.target.ontouchmove = ''
             }
             return false;
        }
     },
     //  橡皮擦
     _eraser ()  {
        var that = this;
        this.$refs.myboard.ontouchstart = function (ev) {
            var ev = ev || event
            that.ERAS++
            
            ev.target.ontouchmove = function (ev) {
                var ev = ev || event;
                var ex = ev.changedTouches[0].clientX
                var ey = ev.changedTouches[0].clientY
                var endLocation = that._getlocation(ex, ey)
                var n = MYDATA.length
  
                MYDATA[n] = new Object()
                //  为橡皮擦绘制的方块定义属性 'clear-rect'
                MYDATA[n].attr = 'clear-rect'
                MYDATA[n].count = that.ERAS
                MYDATA[n].x = endLocation.x - 15
                MYDATA[n].y = endLocation.y - 15
                // 为橡皮檫固定宽高
                MYDATA[n].w = 30
                MYDATA[n].h = 30
                MYDATA[n].c = "#fff"
                that.CTX.fillStyle = '#fff'
                that.CTX.beginPath()
                that.CTX.fillRect(endLocation.x - 15, endLocation.y -15 , 30, 30)
                that.CTX.closePath()
                that.CTX.fill()

            }
            ev.target.ontouchend = function () {
                 ev.target.ontouchmove = ''
             }
             return false;
        }
     },
     //  渲染图像
     _canvasrender () {
         // 清空画布
         this.CTX.clearRect(0,0,this.W,this.H)
         var that  = this
         for ( var i = 0; i<MYDATA.length; i++) {
             switch(MYDATA[i].attr) {
                 //  橡皮檫 矩形
                 case 'clear-rect':
                 case 'rect':
                    that.CTX.fillStyle = MYDATA[i].c
                    that.CTX.beginPath()
                    that.CTX.fillRect(MYDATA[i].x, MYDATA[i].y, MYDATA[i].w, MYDATA[i].h);
                    that.CTX.fill();
                    that.CTX.closePath();
                 break;

                 case 'circle':
                    that.CTX.beginPath()
                    that.CTX.arc(MYDATA[i].x, MYDATA[i].y, MYDATA[i].r, 0, 2 * Math.PI, false)
                    that.CTX.closePath()
                    that.CTX.fillStyle = MYDATA[i].c
                    that.CTX.fill()
                 break;

                 //  画笔、直线按下列规则绘制
				 case 'point-line':
                 case 'line':
                    that.CTX.beginPath()
                    that.CTX.moveTo(MYDATA[i].sx,MYDATA[i].sy)
                    that.CTX.lineTo(MYDATA[i].ex,MYDATA[i].ey)
                    that.CTX.closePath()
                    that.CTX.lineJoin = 'round';
                    that.CTX.lineCap = 'round';
					that.CTX.strokeStyle = MYDATA[i].c;
					that.CTX.lineWidth = MYDATA[i].w;
					that.CTX.stroke();
                break;   
             }
         }
     },
     //  选择颜色
     _selectColor () {
        var that = this;
        var bar = document.getElementById('sidebar')
        var barColorLi = document.querySelectorAll('.sidebar-color li')
        var arrColor = ['#f00056','#fff','#faff72','#44cef6','#00bc12','#ffa400','#000'];

        // 取消冒泡
        bar.ontouchstart = function (ev) {
            var ev = ev || event;
            ev.cancelBubble = true;
        }
        for (var i=0; i<barColorLi.length; i++) {
            barColorLi[i].index = i;
            barColorLi[i].style.background = arrColor[i];

            barColorLi[i].onclick = function () {
                console.log("你重新选择了颜色")
                that.COLOR = arrColor[this.index]
                console.log(that.COLOR)
                bar.style.right = '-230px'
            }
        }
     },
     // 选择线条粗细
     _selectLine: function () {
        var that = this;
        var bar = document.getElementById('sidebar')
        var barDrawLi = document.querySelectorAll('.sidebar-draw li')
        var arrLine = [3,6,9,12,15,20]
        bar.ontouchstart = function (ev) {
            var ev = ev || event;
            ev.cancelBubble = true;
        }
        for (var i = 0; i < barDrawLi.length; i++) {
            barDrawLi[i].index = i;
            barDrawLi[i].onclick = function () {
                console.log("你重新选择了画笔宽度")
                that.LINE = arrLine[this.index]
                bar.style.right = '-230px'
            }
        }

     },
     //撤退功能 根据最后一次绘画数据属性来判断 撤退的步数
     toBack: function () {
         var that = this
         var lastData = MYDATA[MYDATA.length-1]
         if (!lastData) {
             console.log(' 撤退无效！你没有绘画！')
             return false
         }
         var attr = lastData.attr

         switch (attr) {
             case 'line':
             case 'circle':
             case 'rect':
               MYDATA.pop()
               break;
            case 'point-line':
            case 'clear-rect':
               var count = MYDATA[MYDATA.length -1].count
               for (var i = MYDATA.length -1; i >= 0; i--) {
                   if (attr == MYDATA[i].attr && count == MYDATA[i].count) {
                       MYDATA.pop()
                   }else {
                       break;
                   }
               }
               break;
         }
         that._canvasrender()
         return true
     },
     //  菜单功能选择
     menuOption: function () {
         var that = this;
         var menu = document.getElementById('menu')
         var item = menu.getElementsByTagName('li')
         var btn = item[8].getElementsByTagName('span')[0];
         var bar = document.getElementById('sidebar')
         var barDraw = bar.querySelector('.sidebar-draw')
         var barColor = bar.querySelector('.sidebar-color')
         var showOff = true
         //  画笔工具
         item[0].onclick = function () {
             console.log('你选择了画笔工具')
             that._drawPen()
         };
        //  直线工具
         item[1].onclick = function () {
             console.log('你选择了直线工具')
             that._drawLine()
         };
        //  圆形工具
        item[2].onclick = function () {
            console.log('你选择了圆形工具')
            that._drawCircle()
        }
        // 矩形工具
        item[3].onclick = function () {
            console.log('你选择了矩形工具')
            that._drawRect()
        }
        // 粗细工具
        item[4].onclick = function () {
            barColor.style.display = 'none'
            barDraw.style.display = 'block'
            bar.style.right = 0;
        }
        // 颜色工具
        item[5].onclick = function () {
            barColor.style.display = 'block';
            barDraw.style.display = 'none'
            bar.style.right = 0;
        }
        //  橡皮檫工具
        item[6].onclick = function () {
            console.log('你选择了橡皮檫')
            that._eraser()
        }
        //  撤退功能
        item[7].onclick = function () {
            if(that.toBack() ) {
                console.log('撤退成功')
            }else {
                console.log('撤退失败')
            }
        }
        // 隐藏与显示工具
        item[8].onclck = function() {
            console.log('隐藏和显示')
        }

     },
     //  获取真实坐标
     _getlocation (x,y) {
           var bbox = this.$refs.myboard.getClientRects()[0];
           console.log(bbox)
            return {  
                x: (x - bbox.left),  
                y: (y - bbox.top) 
            };
     }
  },
  mounted(){
       this.$nextTick(function () {
        // DOM 现在更新了
        // `this` 绑定到当前实例
        this.init()
      })
     
  }
}
</script>

<style scoped>
   .board{
       /* width: 1200px; */
       height:600px;
       display: flex;
       margin: 0 auto;
       border:1px solid darkgray;
       border-radius: 2px;
   }
   .board .menu{
      flex: 0 0 200px;
      background: cadetblue;
   }
   .board .canvas {
       flex: 1;
   }
</style>

