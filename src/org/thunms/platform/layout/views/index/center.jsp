<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="t" uri="/thunms"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<t:head  />
<body>
<script type="text/javascript" charset="UTF-8">
	var centerTabs;
	var tabsMenu;
	$(function() {
		tabsMenu = $('#tabsMenu').menu({
			onClick : function(item) {
				var curTabTitle = $(this).data('tabTitle');
				var type = $(item.target).attr('type');

				if (type === 'refresh') {
					refreshTab(curTabTitle);
					return;
				}

				if (type === 'close') {
					var t = centerTabs.tabs('getTab', curTabTitle);
					if (t.panel('options').closable) {
						centerTabs.tabs('close', curTabTitle);
					}
					return;
				}
				
				//全屏
				if (type === 'full') {
					var layout = $("#indexLayout");
					var center = layout.layout('panel', 'center');
					center.panel('maximize');
					center.parent().css('z-index', 10);
					return;
				}
				//关闭全屏
				if (type === 'unFull') {
					var layout = $("#indexLayout");
					var center=layout.layout('panel', 'center');
					center.parent().css('z-index', 'inherit');
					center.panel('restore');
					return;
				}


				var allTabs = centerTabs.tabs('tabs');
				var closeTabsTitle = [];

				$.each(allTabs, function() {
					var opt = $(this).panel('options');
					if (opt.closable && opt.title != curTabTitle && type === 'closeOther') {
						closeTabsTitle.push(opt.title);
					} else if (opt.closable && type === 'closeAll') {
						closeTabsTitle.push(opt.title);
					}
				});

				for ( var i = 0; i < closeTabsTitle.length; i++) {
					centerTabs.tabs('close', closeTabsTitle[i]);
				}
			}
		});
		
		centerTabs = $('#centerTabs').tabs({
			border : false,
			fit : true,
			onContextMenu : function(e, title) {
				e.preventDefault();
				tabsMenu.menu('show', {
					left : e.pageX,
					top : e.pageY
				}).data('tabTitle', title);
			}
		});
		setTimeout(function() {
			var src = thunms.base()+'/home';
			centerTabs.tabs('add', {
				title : '首页',
				content : '<iframe src="' + src + '" frameborder="0" style="border:0;width:100%;height:99.4%;"></iframe>',
				closable : false,
				iconCls : '',
				tools : [ {
						iconCls : 'icon-mini-refresh',
						handler : function() {
							refreshTab("首页");
						}
					} ]
			});
			
		}, 0);
		
		
	});
	
	function addTabFun(opts) {
		var options = $.extend({
			title : 'opts.title',
			content : '<iframe src="' + opts.src + '" frameborder="0" style="border:0;width:100%;height:99.4%;"></iframe>',
			closable : true,
			iconCls : opts.iconCls,
			tools : [ {
				iconCls : 'icon-mini-refresh',
				handler : function() {
					refreshTab(opts.title);
				}
			} ]
		}, opts);
		if (centerTabs.tabs('exists', options.title)) {
			centerTabs.tabs('close', options.title);
		}
		centerTabs.tabs('add', options);
	};
	
	function refreshTab(title) {
		var tab = centerTabs.tabs('getTab', title);
		centerTabs.tabs('update', {
			tab : tab,
			options : tab.panel('options')
		});
	}
	
</script>
<div id="centerTabs"></div>

<div id="tabsMenu" style="width: 120px;display:none;">
	<div type="refresh">刷新</div>
	<div class="menu-sep"></div>
	<div type="full">全屏显示</div>
	<div type="unFull">关闭全屏</div>
	<div class="menu-sep"></div>
	<div type="close">关闭</div>
	<div type="closeOther">关闭其他</div>
	<div type="closeAll">关闭所有</div>
	<div class="menu-sep"></div>
</div>
</body>