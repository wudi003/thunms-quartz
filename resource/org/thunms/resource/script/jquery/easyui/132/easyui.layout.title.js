//在layout的panle全局配置中,增加一个onCollapse处理title
$.extend($.fn.layout.paneldefaults, {
	onCollapse : function () {
		//获取layout容器
		var layout = $(this).parents("div.layout");
		//获取当前region的配置属性
		var opts = $(this).panel("options");
		//获取key
		var expandKey = "expand" + opts.region.substring(0, 1).toUpperCase() + opts.region.substring(1);
		//从layout的缓存对象中取得对应的收缩对象
		var expandPanel = layout.data("layout").panels[expandKey];
		//针对横向和竖向的不同处理方式
		if (opts.region == "west" || opts.region == "east") {
			//竖向的文字打竖,其实就是切割文字加br
			var split = [];
			for (var i = 0; i < opts.title.length; i++) {
				split.push(opts.title.substring(i, i + 1));
			}
			expandPanel.panel("body").addClass("panel-title").css("text-align", "center").html(split.join("＜ｂｒ＞"));
		} else {
			expandPanel.panel("setTitle", opts.title);
		}
	}
});