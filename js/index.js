(function(){
	/**
	 * @param {Object} opt
	 * @param {Object} wrap
	 */
	function Slider(opt, wrap) {
		//存储轮播图传过来的数据
		this.wrap = wrap;
		this.list = opt.list || [];
		this.listLength = this.list.length;
		this.width = opt.width || wrap.width();
		this.height = opt.height || wrap.height();
		this.type = opt.type || 'fade';
		this.showChangeBtn = opt.showChangeBtn || opt.showChangeBtn == undefined ? true : opt.showChangeBtn;
		this.showSpotBtn = opt.showSpotBtn || opt.showSpotBtn == undefined ? true : opt.showSpotBtn;
		this.autoTime = opt.autoTime || 4000;
		this.isAuto = opt.isAuto || opt.isAuto == undefined ? true : opt.isAuto;
		//当前显示图片索引
		this.nowIndex = 0;
		this.isAnimate = false;
		this.timer = null;
		this.init = function() {
			//初始化轮播图结构样式行为
			this.createDom();
			this.initStyle();
			this.bindEvent();
		}
	}
	//通过在原型链上编写创建结构的方法,减少空间占用消耗（写在Slider中的话，每次创建对象都会重新创建一个createDom方法)
	Slider.prototype.createDom = function() {
		//类名特殊，防止样式重叠
		var sliderWrapper = $('<div class="my-swiper-wrapper"></div>');
		var sliderContent = $('<ul class="my-swiper-list"></ul>');
		var leftBtn = $('<div class="my-swiper-btn my-swiper-lbtn">&lt;</div>');
		var rightBtn = $('<div class="my-swiper-btn my-swiper-rbtn">&gt;</div>');
		var spotDiv = $('<div class="my-swiper-spots"></div>');
		for (var i = 0; i < this.list.length; i++) {
			$('<li class="my-swiper-item"></li>').append(this.list[i]).appendTo(sliderContent);
			$('<span></span>').appendTo(spotDiv);
		}
		if (this.type == 'animate') {
			$('<li class="my-swiper-item"></li>').append($(this.list[0]).clone()).appendTo(sliderContent);
		}
		sliderWrapper.append(sliderContent)
			.append(leftBtn)
			.append(rightBtn)
			.append(spotDiv)
			.appendTo(this.wrap)
			.addClass('my-swiper-' + this.type);
	}
	//通过在原型链上编写创建样式的方法
	Slider.prototype.initStyle = function() {
		$('.my-swiper-wrapper', this.wrap).css({
			width: this.width,
			height: this.height
		}).find('.my-swiper-item').css({
			width: this.width,
			height: this.height
		});
		if (this.type == 'fade') {
			$('.my-swiper-item', this.wrap).hide().eq(this.nowIndex).show()
		} else if (this.type == 'animate') {
			$('.my-swiper-list', this.wrap).css({
				width: this.width * (this.listLength + 1)
			})
		}
		if(!this.showChangeBtn){
			$('.my-swiper-btn',this.wrap).hide()
		}else{
			$('.my-swiper-btn',this.wrap).show()
		}if(!this.showSpotBtn){
			$('.my-swiper-spots',this.wrap).hide()
		}else{
			$('.my-swiper-spots',this.wrap).show()
		}
		$('.my-swiper-spots > span', this.wrap).eq(this.nowIndex).addClass('active');
	
	}
	//通过在原型链上编写绑定事件的方法
	Slider.prototype.bindEvent = function() {
		var self = this;
		$('.my-swiper-lbtn', this.wrap).click(function() {
			if(self.isAnimate){
				return false;
			}
			self.isAnimate = true;
			if (self.nowIndex == 0) {
				if(self.type == 'animate'){
					$('.my-swiper-list', this.wrap).css({
						left: -self.width * self.listLength
					})
				}
				self.nowIndex = self.listLength - 1;
			} else {
				self.nowIndex--;
			}
			self.change();
		})
		$('.my-swiper-rbtn', this.wrap).click(function() {
			if(self.isAnimate){
				return false;
			}
			self.isAnimate = true;
			if (self.type == 'fade' && self.nowIndex == self.listLength - 1) {
				self.nowIndex = 0;
			}else if(self.type == 'animate' && self.nowIndex == self.listLength){
				$('.my-swiper-list', this.wrap).css({
					left : 0
				})
				self.nowIndex = 1;
			}
			 else {
				self.nowIndex++;
			}
			self.change();
		})
		$('.my-swiper-wrapper',this.wrap).mouseenter(function(){
			clearInterval(self.timer)
		}).mouseleave(function(){
			if(self.isAuto){
				self.autoChange();
			}
		});
		 $('.my-swiper-spots > span',this.wrap).mouseenter(function(){
			 if(self.isAnimate){
			 	return false;
			 }
			 self.isAnimate = true;
			 self.nowIndex = $(this).index();
			 self.change();
		 })
	}
	//索引值改变后样式切换
	Slider.prototype.change = function() {
		var self = this;
		if (this.type == 'fade') {
			$('.my-swiper-item', this.wrap).fadeOut().eq(this.nowIndex).fadeIn(function(){
				self.isAnimate = false;
			});
		} else if (this.type == 'animate') {
			$('.my-swiper-list', this.wrap).animate({
				left: -this.width * this.nowIndex
			},function(){
				self.isAnimate = false;
			})
		}
		$('.my-swiper-spots > span', this.wrap).removeClass('active').eq(this.nowIndex%this.listLength).addClass('active');
	}
	//自动轮播
	Slider.prototype.autoChange = function(){
		var self = this;
		this.timer = setInterval(function(){
			$('.my-swiper-rbtn',self.wrap).click();
		},this.autoTime)
		
	}
	
	$.fn.extend({
		swiper: function(options) {
			var obj = new Slider(options, this);
			//调用完init自动创建出轮播图
			obj.init()
		}
	})
	
})()
