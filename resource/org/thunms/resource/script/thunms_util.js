/**
 * 包含easyui的扩展和常用的方法
 * 
 * @author wanglp
 */
(function ($, undefined) {
	$.util.namespace("$.easyui");

    //  显示类似于 easyui-datagrid 在加载远程数据时显示的 mask 状态层；该函数定义如下重载方式：
    //      function ()
    //      function (options)，其中 options 为一个格式为 { msg, locale, topMost } 的 JSON-Object；
    //  上述参数中：
    //      msg 表示加载显示的消息文本内容，默认为 "正在加载，请稍等..."；
    //      locale 表示加载的区域，可以是一个 jQuery 对象选择器字符串，也可以是一个 jQuery 对象或者 HTML-DOM 对象；默认为字符串 "body"。
    //      topMost 为一个布尔类型参数，默认为 false，表示是否在顶级页面加载此 mask 状态层。
    //  返回值：返回表示弹出的数据加载框和层的 jQuery 对象。
    $.easyui.loading = function (options) {
        var opts = $.extend({ msg: "正在加载，请稍等...", locale: "body", topMost: false }, options || {}),
            jq = opts.topMost ? $.util.$ : $,
            locale = jq(opts.locale),
            array = locale.children().map(function () {
                var zindex = $(this).css("z-index");
                return $.isNumeric(zindex) ? parseInt(zindex) : 0;
            }),
            zindex = $.array.max(array.length ? array : [1]);
        if (!locale.is("body")) {
            locale.addClass("mask-container");
        }
        var mask = jq("<div></div>").addClass("datagrid-mask").css({ display: "block", "z-index": zindex += 100 }).appendTo(locale);
        var msg = jq("<div></div>").addClass("datagrid-mask-msg").css({ display: "block", left: "50%", "z-index": ++zindex }).html(opts.msg).appendTo(locale);
        msg.css("marginLeft", -msg.outerWidth() / 2);
        return mask.add(msg);
    };

    //  关闭由 $.easyui.loading 方法显示的 "正在加载..." 状态层；该函数定义如下重载方式：
    //      function ()
    //      function (locale)
    //      function (locale, topMost)
    //      function (topMost, locale)
    //      function (options)，其中 options 为一个格式为 { locale, topMost } 的 JSON-Object
    $.easyui.loaded = function (locale, topMost) {
        var opts = { locale: "body", topMost: false };
        if (arguments.length == 1) {
            if ($.isPlainObject(arguments[0])) {
                $.extend(opts, arguments[0]);
            } else if ($.util.isBoolean(arguments[0])) {
                opts.topMost = arguments[0];
            } else {
                opts.locale = arguments[0];
            }
        }
        if (arguments.length == 2) {
            if ($.util.isBoolean(arguments[0])) {
                $.extend(opts, { locale: arguments[1], topMost: arguments[0] });
            } else {
                $.extend(opts, { locale: arguments[0], topMost: arguments[1] });
            }
        }
        var jq = opts.topMost ? $.util.$ : $, locale = jq(opts.locale);
        locale.removeClass("mask-container");
        locale.children("div.datagrid-mask-msg,div.datagrid-mask").remove();
    };


    //  备注： $.messager 表示当前页面的 easyui-messager 对象；
    //         $.easyui.messager 表示可控顶级页面的 easyui-messager 对象；


    //  更改 jQuery EasyUI 中部分控件的国际化语言显示。
    $.extend($.fn.panel.defaults, { loadingMessage: defaults.loading });
    $.extend($.fn.window.defaults, { loadingMessage: defaults.loading });
    $.extend($.fn.dialog.defaults, { loadingMessage: defaults.loading });

    //  更改 jeasyui-combo 组件的非空验证提醒消息语言。
    $.extend($.fn.combo.defaults, { missingMessage: $.fn.validatebox.defaults.missingMessage });



    

    //  获取或更改 jQuery EasyUI 部分组件的通用错误提示函数；该方法定义如下重载方式：
    //      function():         获取 jQuery EasyUI 部分组件的通用错误提示函数；
    //      function(callback): 更改 jQuery EasyUI 部分组件的通用错误提示函数；
    //  备注：该方法会设置如下组件的 onLoadError 事件；
    //          easyui-form
    //          easyui-combobox
    //          easyui-combotree
    //          easyui-combogrid
    //          easyui-datagrid
    //          easyui-propertygrid
    //          easyui-tree
    //          easyui-treegrid
    //      同时还会设置 jQuery-ajax 的通用错误事件 error。
    $.easyui.ajaxError = function (callback) {
        if (!arguments.length) { return $.fn.form.defaults.onLoadError; }
        $.fn.form.defaults.onLoadError = callback;
        $.fn.panel.defaults.onLoadError = callback;
        $.fn.combobox.defaults.onLoadError = callback;
        $.fn.combotree.defaults.onLoadError = callback;
        $.fn.combogrid.defaults.onLoadError = callback;
        $.fn.datagrid.defaults.onLoadError = callback;
        $.fn.propertygrid.defaults.onLoadError = callback;
        $.fn.tree.defaults.onLoadError = callback;
        $.fn.treegrid.defaults.onLoadError = callback;
        $.ajaxSetup({ error: callback });
    };

    var onLoadError = function (XMLHttpRequest, textStatus, errorThrown) {
        $.messager.progress("close");
        if ($.easyui.messager != $.messager) { $.easyui.messager.progress("close"); }
        var msg = (XMLHttpRequest && !$.string.isNullOrWhiteSpace(XMLHttpRequest.responseText) ?
                "如果该问题重复出现，请联系您的系统管理员并反馈该故障。<br />" +
                "错误号：" + XMLHttpRequest.status + "(" + XMLHttpRequest.statusText + ")；<hr />" + XMLHttpRequest.responseText :
                "系统出现了一个未指明的错误，如果该问题重复出现，请联系您的系统管理员并反馈该故障。");
        var win = $.easyui.messager.alert("错误提醒", msg, "error"),
            opts = win.window("options"), panel = win.window("panel"), width = panel.outerWidth(), height = panel.outerHeight();
        if (width > 800 || height > 800) { win.window("resize", { width: width > 800 ? 800 : width, height: height > 800 ? 800 : height }); }
        win.window("center");
    };



    //  备份 jquery ajax 方法的默认参数。
    $.easyui.ajaxDefaults = $.extend({}, $.ajaxSettings);

    //  更改 jQuery EasyUI 部分组件的通用错误提示。
    $.easyui.ajaxError(onLoadError);

    //  更改 jQuery.ajax 函数的部分默认属性。
    $.ajaxSetup({
        dataFilter: function (data, type) {
            return String(type).toLowerCase(type) == "json" ? $.string.toJSONString(data) : data;
        }
        //,beforeSend: function (XMLHttpRequest) {
        //    $.easyui.loading({ msg: "正在将请求数据发送至服务器..." });
        //}
        //,complete: function (XMLHttpRequest, textStatus) {
        //    $.easyui.loaded();
        //}
    });
	
});


/**
 * 扩展jQuery,jQuery将表单序列化成一个Object对象.
 * $("#from").serializeObject()
 * 
 */
(function($){
    $.fn.extend({   
        serializeObject:function(){   
            if(this.length>1){   
                return false;   
            }   
            var arr=this.serializeArray();   
            var obj=new Object;   
            $.each(arr,function(k,v){   
                obj[v.name]=v.value;   
            });   
            return obj;   
        }   
    });   
})(jQuery); 

/**
 * author ____′↘夏悸
 * create date 2012-11-5
 * 用法：
   在datagrid的onLoadSuccess事件里面进行调用，可以实现数据加载完成后，自动合并。也可以手动调用该方法。

onLoadSuccess:function(){
      //所有列进行合并操作
      //$(this).datagrid("autoMergeCells");
      //指定列进行合并操作
      $(this).datagrid("autoMergeCells",['itemid','productid']);
    }
 **/
$.extend($.fn.datagrid.methods, {
	autoMergeCells : function (jq, fields) {
		return jq.each(function () {
			var target = $(this);
			if (!fields) {
				fields = target.datagrid("getColumnFields");
			}
			var rows = target.datagrid("getRows");
			var i = 0,
			j = 0,
			temp = {};
			for (i; i < rows.length; i++) {
				var row = rows[i];
				j = 0;
				for (j; j < fields.length; j++) {
					var field = fields[j];
					var tf = temp[field];
					if (!tf) {
						tf = temp[field] = {};
						tf[row[field]] = [i];
					} else {
						var tfv = tf[row[field]];
						if (tfv) {
							tfv.push(i);
						} else {
							tfv = tf[row[field]] = [i];
						}
					}
				}
			}
			$.each(temp, function (field, colunm) {
				$.each(colunm, function () {
					var group = this;
					
					if (group.length > 1) {
						var before,
						after,
						megerIndex = group[0];
						for (var i = 0; i < group.length; i++) {
							before = group[i];
							after = group[i + 1];
							if (after && (after - before) == 1) {
								continue;
							}
							var rowspan = before - megerIndex + 1;
							if (rowspan > 1) {
								target.datagrid('mergeCells', {
									index : megerIndex,
									field : field,
									rowspan : rowspan
								});
							}
							if (after && (after - before) != 1) {
								megerIndex = after;
							}
						}
					}
				});
			});
		});
	}
});

var thunms = $.extend({}, thunms);/* 定义全局对象 */


/**
 * 
 * 取消easyui默认开启的parser
 * 
 * 在页面加载之前，先开启一个进度条
 * 
 * 然后在页面所有easyui组件渲染完毕后，关闭进度条
 * 
 * 
 * 
 * @requires jQuery,EasyUI
 * 
 */
/**
 * 永久的取消这个功能,便于自定义加载状态提示
$.parser.auto = false;
$(function() {
	$.messager.progress({
		text : '页面加载中....',
		interval : 100
	});
	$.parser.parse(window.document);
	window.setTimeout(function() {
		$.messager.progress('close');
		if (self != parent) {
			window.setTimeout(function() {
				try {
					parent.$.messager.progress('close');
				} catch (e) {
				}
			}, 500);
		}
	}, 1);
	$.parser.auto = true;
});
*/
/**
 * 使panel和datagrid在加载时提示
 * 
 * 
 * 
 * @requires jQuery,EasyUI
 * 
 */


/**
 * 
 * 
 * @requires jQuery,EasyUI
 * 
 * 避免验证tip屏幕跑偏
 */
var removeEasyuiTipFunction = function() {
	window.setTimeout(function() {
		$('div.validatebox-tip').remove();
	}, 0);
};
$.fn.panel.defaults.onClose = removeEasyuiTipFunction;
$.fn.window.defaults.onClose = removeEasyuiTipFunction;
$.fn.dialog.defaults.onClose = removeEasyuiTipFunction;


/**
 * 
 * 
 * @requires jQuery,EasyUI
 * 
 * 防止panel/window/dialog组件超出浏览器边界
 * @param left
 * @param top
 */
var easyuiPanelOnMove = function(left, top) {
	//对于暂时不修正益处边界问题
	if(!$.browser.msie){
	var l = left;
	var t = top;
	if (l < 1) {
		l = 1;
	}
	if (t < 1) {
		t = 1;
	}
	var width = parseInt($(this).parent().css('width')) + 14;
	var height = parseInt($(this).parent().css('height')) + 14;
	var right = l + width;
	var buttom = t + height;
	var browserWidth = $(window).width();
	var browserHeight = $(window).height();
	if (right > browserWidth) {
		l = browserWidth - width;
	}
	if (buttom > browserHeight) {
		t = browserHeight - height;
	}
	$(this).parent().css({/* 修正面板位置 */
		left : l,
		top : t
	});
	}
};
$.fn.dialog.defaults.onMove = easyuiPanelOnMove;
$.fn.window.defaults.onMove = easyuiPanelOnMove;
$.fn.panel.defaults.onMove = easyuiPanelOnMove;

/**
 * 
 * 
 * @requires jQuery,EasyUI
 * 
 * panel关闭时回收内存
 */

$.fn.panel.defaults = $.extend({},$.fn.panel.defaults,{onBeforeDestroy:function(){
	var frame=$('iframe', this);
	if(frame.length>0){
		frame[0].contentWindow.document.write('');
		frame[0].contentWindow.close();
		frame.remove();
		if($.browser.msie){
			CollectGarbage();
		}
	}
	}
});
/**
$.fn.panel.defaults.onBeforeDestroy = function() {
	var frame = $('iframe', this);
	try {
		if (frame.length > 0) {
			for ( var i = 0; i < frame.length; i++) {
				frame[i].contentWindow.document.write('');
				frame[i].contentWindow.close();
			}
			frame.remove();
			if ($.browser.msie) {
				CollectGarbage();
			}
		}
	} catch (e) {
	}
};
**/
/**
 * 
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展validatebox，添加验证两次密码功能
 */
$.extend($.fn.validatebox.defaults.rules, {
	eqPassword : {
		validator : function(value, param) {
			return value == $(param[0]).val();
		},
		message : '密码不一致！'
	}
});

/**
 * 
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展datagrid，添加动态增加或删除Editor的方法
 * 
 * 例子如下，第二个参数可以是数组
 * 
 * datagrid.datagrid('removeEditor', 'cpwd');
 * 
 * datagrid.datagrid('addEditor', [ { field : 'ccreatedatetime', editor : { type : 'datetimebox', options : { editable : false } } }, { field : 'cmodifydatetime', editor : { type : 'datetimebox', options : { editable : false } } } ]);
 * 
 */
$.extend($.fn.datagrid.methods, {
	addEditor : function(jq, param) {
		if (param instanceof Array) {
			$.each(param, function(index, item) {
				var e = $(jq).datagrid('getColumnOption', item.field);
				e.editor = item.editor;
			});
		} else {
			var e = $(jq).datagrid('getColumnOption', param.field);
			e.editor = param.editor;
		}
	},
	removeEditor : function(jq, param) {
		if (param instanceof Array) {
			$.each(param, function(index, item) {
				var e = $(jq).datagrid('getColumnOption', item);
				e.editor = {};
			});
		} else {
			var e = $(jq).datagrid('getColumnOption', param);
			e.editor = {};
		}
	}
});

/**
 * 
 * 
 * @requires jQuery,EasyUI
 * 
 * 扩展datagrid的editor
 * 
 * 增加带复选框的下拉树
 * 
 * 增加日期时间组件editor
 * 
 * 增加多选combobox组件
 */
$.extend($.fn.datagrid.defaults.editors, {
	combocheckboxtree : {
		init : function(container, options) {
			var editor = $('<input />').appendTo(container);
			options.multiple = true;
			editor.combotree(options);
			return editor;
		},
		destroy : function(target) {
			$(target).combotree('destroy');
		},
		getValue : function(target) {
			return $(target).combotree('getValues').join(',');
		},
		setValue : function(target, value) {
			$(target).combotree('setValues', thunms.getList(value));
		},
		resize : function(target, width) {
			$(target).combotree('resize', width);
		}
	},
	datetimebox : {
		init : function(container, options) {
			var editor = $('<input />').appendTo(container);
			editor.datetimebox(options);
			return editor;
		},
		destroy : function(target) {
			$(target).datetimebox('destroy');
		},
		getValue : function(target) {
			return $(target).datetimebox('getValue');
		},
		setValue : function(target, value) {
			$(target).datetimebox('setValue', value);
		},
		resize : function(target, width) {
			$(target).datetimebox('resize', width);
		}
	},
	multiplecombobox : {
		init : function(container, options) {
			var editor = $('<input />').appendTo(container);
			options.multiple = true;
			editor.combobox(options);
			return editor;
		},
		destroy : function(target) {
			$(target).combobox('destroy');
		},
		getValue : function(target) {
			return $(target).combobox('getValues').join(',');
		},
		setValue : function(target, value) {
			$(target).combobox('setValues', thunms.getList(value));
		},
		resize : function(target, width) {
			$(target).combobox('resize', width);
		}
	}
});

/**
 * 
 * 
 * @requires jQuery,EasyUI
 * 
 * @param options
 */
thunms.dialog = function(options) {
	var opts = $.extend({
		modal : true,
		closable:false,
        collapsible:true,
        maximizable:true,
        closable:true,
		onClose : function() {
			$(this).dialog('destroy');
		}
	}, options);
	return $('<div/>').dialog(opts);
};

thunms.window = function(options) {
	var opts = $.extend({
		modal : true,
		closable:false,
        collapsible:true,
        maximizable:true,
        closable:true,
		onClose : function() {
			$(this).window('destroy');
		}
	}, options);
	return $('<div/>').window(opts);
};

/**
 * 
 * 
 * @requires jQuery,EasyUI
 * 
 * @param title
 *            标题
 * 
 * @param msg
 *            提示信息
 * 
 * @param fun
 *            回调方法
 */
thunms.confirm = function(title, msg, fn) {
	return $.messager.confirm(title, msg, fn);
};

/**
 * 
 * 
 * @requires jQuery,EasyUI
 */
thunms.show = function(options) {
	return $.messager.show(options);
};

/**
 * 
 * 
 * @requires jQuery,EasyUI
 */
thunms.alert = function(title, msg, icon, fn) {
	return $.messager.alert(title, msg, icon, fn);
};

thunms.progress = function(options) {
	return $.messager.progress(options);
};
thunms.progress.close = function() {
	return $.messager.progress("close");
};
/**
 * 获取iframe的document对象
 * @param {} frame
 * @return {}
 */
thunms.getFrameDocument=function (frame){
 return frame && typeof(frame)=='object' && frame.tagName == 'IFRAME' && frame.contentDocument || frame.contentWindow && frame.contentWindow.document || frame.document;
}

/**
 * 获取iframe的window对象
 * @param {} frame
 * @return {}
 */
thunms.getFrameWindow=function (frame){
    return frame && typeof(frame)=='object' && frame.tagName == 'IFRAME' && frame.contentWindow;
}


/**
 * 弹出全屏界面
 * @param {} themeName
 */
thunms.content=function(url){

        var p = parent.thunms.dialog({
                    title : '信息查看',
                    //href : thunms.base() + '/monitor/logs/test/look',
                    content:'<iframe  src="'+url + '" frameborder="0" style="border:0;width:100%;height:99.2%;"></iframe>',
                    width : 580,
                    height : 480,
                    maximized:true,
                    buttons : [{
                                text : '取消',
                                handler : function() {
                                    parent.thunms.confirm('请确认', '您要取消当前操作吗？', function(r) {
                                                if (r) {
                                                    p.dialog('close');
                                                }
                                            });
                                    
                                }
                            }]
                    
                });
};

/**
 * 
 * 
 * @requires jQuery,EasyUI,jQuery cookie plugin
 * 
 * 更换EasyUI主题的方法
 * 
 * @param themeName
 *            主题名称
 */
thunms.changeTheme = function(themeName) {
	$.ajax({
   type: "POST",
   url: thunms.base()+"/platform/common/properties/changeTheme",
   data: "themeName="+themeName,
   dataType: "json",
   success: function(msg){
   	$.messager.show({msg : msg.msg,title : '提示'});
   	window.location.href = thunms.base()+"/index";
   }
});
	
	
};
/**
 * 获得项目根路径. 用于实现虚拟目录的访问. 在js中使用 thunms.base()方法. 在jsp中使用${cxt}获取.
 * 使用方法：thunms.base();
 */
thunms.base = function() {
	var $easyuiTheme = $('#easyuiTheme');
	var url = $easyuiTheme.attr('cxt');
	return url;
};

thunms.userLogin=function(){
		var userlogin={"areaId":null,"areaName":null,"departmentId":null,"departmentName":null,"lastLoginAddress":null,"lastLoginTime":null,"userId":null,"userloginId":null,"userEmail":null,"userMobile":null,"userName":null};
		$.ajax({
			   url: thunms.base()+'/thunms/platform/getUserLogin',
			   cache: false,
			   async: false,
			   dataType: 'json',
			   success: function(msg){
				   userlogin.areaId= msg.areaId;
				   userlogin.areaName= msg.areaName;
				   userlogin.departmentId= msg.departmentId;
				   userlogin.departmentName= msg.departmentName;
				   userlogin.lastLoginAddress= msg.lastLoginAddress;
				   userlogin.lastLoginTime= msg.lastLoginTime;
				   userlogin.userEmail= msg.userEmail;
				   userlogin.userId= msg.userId;
				   userlogin.userMobile= msg.userMobile;
				   userlogin.userName= msg.userName;
				   userlogin.userloginId= msg.userloginId;
			   }
			});
	return userlogin
}
/**
 * 
 * 
 * 获得项目根路径
 * 
 * 使用方法：thunms.bp();
 * 
 * @returns 项目根路径
 */
thunms.bp = function() {
	var curWwwPath = window.document.location.href;
	var pathName = window.document.location.pathname;
	var pos = curWwwPath.indexOf(pathName);
	var localhostPaht = curWwwPath.substring(0, pos);
	var projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
	return (localhostPaht + projectName);
};

/**
 * 
 * 
 * 使用方法:thunms.pn();
 * 
 * @returns 项目名称(/sshe)
 */
thunms.pn = function() {
	return window.document.location.pathname.substring(0, window.document.location.pathname.indexOf('\/', 1));
};

/**
 * 
 * 
 * 增加formatString功能
 * 
 * 使用方法：thunms.fs('字符串{0}字符串{1}字符串','第一个变量','第二个变量');
 * 
 * @returns 格式化后的字符串
 */
thunms.fs = function(str) {
	for ( var i = 0; i < arguments.length - 1; i++) {
		str = str.replace("{" + i + "}", arguments[i + 1]);
	}
	return str;
};

/**
 * 
 * 
 * 增加命名空间功能
 * 
 * 使用方法：thunms.ns('jQuery.bbb.ccc','jQuery.eee.fff');
 */
thunms.ns = function() {
	var o = {}, d;
	for ( var i = 0; i < arguments.length; i++) {
		d = arguments[i].split(".");
		o = window[d[0]] = window[d[0]] || {};
		for ( var k = 0; k < d.slice(1).length; k++) {
			o = o[d[k + 1]] = o[d[k + 1]] || {};
		}
	}
	return o;
};

/**
 * @author 郭华(夏悸)
 * 
 * 生成UUID
 * 
 * @returns UUID字符串
 */
thunms.random4 = function() {
	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
};
thunms.UUID = function() {
	return (thunms.random4() + thunms.random4() + "-" + thunms.random4() + "-" + thunms.random4() + "-" + thunms.random4() + "-" + thunms.random4() + thunms.random4() + thunms.random4());
};

/**
 * 
 * 
 * 获得URL参数
 * 
 * @returns 对应名称的值
 */
thunms.getUrlParam = function(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
	var r = window.location.search.substr(1).match(reg);
	if (r != null)
		return unescape(r[2]);
	return null;
};

/**
 * 
 * 
 * 接收一个以逗号分割的字符串，返回List，list里每一项都是一个字符串
 * 
 * @returns list
 */
thunms.getList = function(value) {
	if (value != undefined && value != '') {
		var values = [];
		var t = value.split(',');
		for ( var i = 0; i < t.length; i++) {
			values.push('' + t[i]);/* 避免他将ID当成数字 */
		}
		return values;
	} else {
		return [];
	}
};

/**
 * 
 * 
 * @requires jQuery
 * 
 * 判断浏览器是否是IE并且版本小于8
 * 
 * @returns true/false
 */
thunms.isLessThanIe8 = function() {
	return ($.browser.msie && $.browser.version < 8);
};

/**
 * 
 * 
 * @requires jQuery
 * 
 * 将form表单元素的值序列化成对象
 * 
 * @returns object
 */
thunms.serializeObject = function(form) {
	var o = {};
	$.each(form.serializeArray(), function(index) {
		if (o[this['name']]) {
			o[this['name']] = o[this['name']] + "," + this['value'];
		} else {
			o[this['name']] = this['value'];
		}
	});
	return o;
};

/**
 * 
 * 将JSON对象转换成字符串
 * 
 * @param o
 * @returns string
 */
thunms.jsonToString = function(o) {
	var r = [];
	if (typeof o == "string")
		return "\"" + o.replace(/([\'\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
	if (typeof o == "object") {
		if (!o.sort) {
			for ( var i in o)
				r.push(i + ":" + obj2str(o[i]));
			if (!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
				r.push("toString:" + o.toString.toString());
			}
			r = "{" + r.join() + "}";
		} else {
			for ( var i = 0; i < o.length; i++)
				r.push(obj2str(o[i]));
			r = "[" + r.join() + "]";
		}
		return r;
	}
	return o.toString();
};
/**
 * 人员选择
 * @param {} id 传入保存选择人员数据id的集合。
 * @param {} name传入保存选择人员数据name的集合
 */
thunms.thunmsSelectUser=function(singleSelect,obj,callBack){
		var p= parent.thunms.dialog({
		 	href:thunms.base()+'/platform/resource/select/user?singleSelect='+singleSelect,
		 	title:'人员选择',
		    width:800,
		    cache:false,
		    height:$(document.body).height(), 
		    modal:true,
			buttons : [ {
				text : '确定',
				handler : function() {
					if(typeof(callBack)!="undefined"&&callBack!=null){  //判断定义是否存在
						if(jQuery.isFunction(callBack)){//判断定义是否为Function     	
   							 callBack(p);
   						}else{
   							alert("回调方法未定义:"+callBack);   							
   						}
					}else{
					
					var ids = [];
					var names=[];
					var dg=p.find('#selectUserDataGrid');
					var rows = dg.datagrid('getSelections');
					for ( var i = 0; i < rows.length; i++) {
						ids.push(rows[i].id);
						names.push(rows[i].name);
					}
							var idValue=ids.join(',');
							//设计一个回调方法
							if(typeof(selectUserCallBack)!="undefined"){  //判断定义是否存在
								if(jQuery.isFunction(selectUserCallBack)){//判断定义是否为Function     	
   							 	selectUserCallBack($(obj).parent().find(".combo-value").attr("id"),$(obj).parent().find(".combo-value").val(),idValue)
   							 }
							}
							$(obj).parent().find(".combo-value").val(idValue);
							$(obj).parent().find(".combo-text").val(names.join(','));
							p.dialog('close');
							
						
						
					
				}
				}
			},{
				text : '取消',
				handler : function() {
					parent.thunms.confirm("询问","确认取消《人员》选择吗?",function(r){
						if(r){
							p.dialog('close');
						}
						
					});	
				}
			} ]
		});


 }
/**
 * 高级人员选择
 * @param {} singleSelect 是否单选
 * @param {} obj 事件发出对象
 * @param {} callBack 回调方法
 * @param {} roleId 角色ID
 * @param {} departmentId 部门ID
 * @param {} areaId 单位ID
 * @param {} departmentType 部门类型
 * @param {} areaType 单位类型
 * @param {} selectType 选择类型
 */
thunms.thunmsAdvancedSelectUser=function(singleSelect,obj,roleId,departmentId,areaId,departmentType,areaType,selectType,callBack){
		var p= parent.thunms.dialog({
		 	href:thunms.base()+'/platform/resource/select/advancedUser?singleSelect='+singleSelect+'&roleId='+roleId+'&departmentId='+departmentId+'&areaId='+areaId+'&departmentType='+departmentType+'&areaType='+areaType+'&selectType='+selectType,
		 	title:'人员选择',
		    width:800,
		    cache:false,
		    height:$(document.body).height(), 
		    modal:true,
			buttons : [ {
				text : '确定',
				handler : function() {
					if(typeof(callBack)!="undefined"&&callBack!=null){  //判断定义是否存在
						if(jQuery.isFunction(callBack)){//判断定义是否为Function     	
   							 callBack(p);
   						}else{
   							alert("回调方法未定义:"+callBack);   							
   						}
					}else{
					
					var ids = [];
					var names=[];
					var dg=p.find('#selectUserDataGrid');
					var rows = dg.datagrid('getSelections');
					for ( var i = 0; i < rows.length; i++) {
						ids.push(rows[i].id);
						names.push(rows[i].name);
					}
							var idValue=ids.join(',');
							//设计一个回调方法
							if(typeof(selectUserCallBack)!="undefined"){  //判断定义是否存在
								if(jQuery.isFunction(selectUserCallBack)){//判断定义是否为Function     	
   							 	selectUserCallBack($(obj).parent().find(".combo-value").attr("id"),$(obj).parent().find(".combo-value").val(),idValue)
   							 }
							}
							$(obj).parent().find(".combo-value").val(idValue);
							$(obj).parent().find(".combo-text").val(names.join(','));
							p.dialog('close');
							
						
					
				}
				}
			},{
				text : '取消',
				handler : function() {
					parent.thunms.confirm("询问","确认取消《人员》选择吗?",function(r){
						if(r){
							p.dialog('close');
						}
						
					});	
				}
			} ]
		});


 } 
/**
 * 弹出选择数据页面
 * @param {} obj 按钮对象
 * @param {} id  数据集合
 * @param {} name 数据名称集合
 * @param {} url 视图或者数据URL
 * @param {} isView 传过来的是否是视图
 */ 
 
 thunms.thunmsSelectComboGrid=function(singleSelect,obj,url,isView,callBack){
 		//在此拼装URL
 		var urls='/platform/resource/select/comboGrid?singleSelect='+singleSelect+'&dataUrl='+url;
 		if(isView&&isView=='true'){
 			if(url.indexOf("?")!=-1){
 				urls=url+'&singleSelect='+singleSelect;
 			}else{
 				urls=url+'?singleSelect='+singleSelect;
 			}
 			
 		}
		var p= parent.thunms.dialog({
		 	href:thunms.base()+urls,
		 	title:'数据选择',
		    width:800,
		    cache:false,
		    height:$(document.body).height(),   
		    modal:true,
			buttons : [ {
				text : '确定',
				handler : function() {
					if(typeof(callBack)!="undefined"&&callBack!=null){  //判断定义是否存在
						if(jQuery.isFunction(callBack)){//判断定义是否为Function     	
   							 callBack(p);
   						}else{
   							alert("回调方法未定义:"+callBack);   							
   						}
					}else{
						
					var ids = [];
					var names=[];
					var dg=p.find('.easyui-datagrid');
					var rows = dg.datagrid('getSelections');
					if(rows.length==0){
						alert("请选择数据");
						return ;
					}
					for ( var i = 0; i < rows.length; i++) {
						ids.push(rows[i].id);
						names.push(rows[i].name);
					}
					
							//设计一个回调方法
							var idValue=ids.join(',');
							if(typeof(selectComboGridCallBack)!="undefined"){  //判断定义是否存在
							if(jQuery.isFunction(selectComboGridCallBack)){//判断定义是否为Function     	
   							 selectComboGridCallBack($(obj).parent().find(".combo-value").attr("id"),$(obj).parent().find(".combo-value").val(),idValue)
   							 }
							}
							$(obj).parent().find(".combo-value").val(idValue);
							$(obj).parent().find(".combo-text").val(names.join(','));
							p.dialog('close');
							
						
					}
				}
			},{
				text : '取消',
				handler : function() {
					parent.thunms.confirm("询问","确认取消《数据》选择吗?",function(r){
						if(r){
							p.dialog('close');
						}
						
					})	
				}
			} ],
			onLoad : function() {
				//绑定查询时间
				p.find("#thunmsSelectComboGridQuerySearch").click( function () {
					var data=p.find("#thunmsSelectComboGridQueryForm").serializeObject();
					p.find('.easyui-datagrid').datagrid('load',data);
				 });
				 p.find("#thunmsSelectComboGridQueryClear").click( function () {
				 	p.find("#thunmsSelectComboGridQueryForm").form("clear");
					p.find('.easyui-datagrid').datagrid('load',{});
				 });
			}
		});


 }
 
 thunms.thunmsSelectComboTree=function(singleSelect,obj,url,isView,callBack){
 		//在此拼装URL
 		var urls='/platform/resource/select/comboTree?singleSelect='+singleSelect+'&dataUrl='+url;
 		if(isView&&isView=='true'){
 			if(url.indexOf("?")!=-1){
 				urls=url+'&singleSelect='+singleSelect;
 			}else{
 				urls=url+'?singleSelect='+singleSelect;
 			}
 			
 		}
		var p= parent.thunms.dialog({
		 	href:thunms.base()+urls,
		 	title:'数据选择',
		    width:300,
		    cache:false,
		    height:$(document.body).height(),   
		    modal:true,
			buttons : [ {
				text : '确定',
				handler : function() {
					if(typeof(callBack)!="undefined"&&callBack!=null){  //判断定义是否存在
						if(jQuery.isFunction(callBack)){//判断定义是否为Function     	
   							 callBack(p);
   						}else{
   							alert("回调方法未定义:"+callBack);   							
   						}
					}else{
						
					var ids = [];
					var names=[];
					var dg=p.find('.easyui-tree');
					if(singleSelect=='true'){
					var rows = dg.tree('getSelected');
					if(rows){
						ids.push(rows.id);
						names.push(rows.text);	
					}else{
						alert("请选择数据");
						return ;
					}
					}else{
					var rows = dg.tree('getChecked', ['checked','indeterminate']);
					if(rows.length==0){
						alert("请选择数据");
						return ;
					}
					for ( var i = 0; i < rows.length; i++) {
						ids.push(rows[i].id);
						names.push(rows[i].text);
					}
					}
					
							//设计一个回调方法
							var idValue=ids.join(',');
							if(typeof(selectComboTreeCallBack)!="undefined"){  //判断定义是否存在
							if(jQuery.isFunction(selectComboTreeCallBack)){//判断定义是否为Function     	
   							 selectComboTreeCallBack($(obj).parent().find(".combo-value").attr("id"),$(obj).parent().find(".combo-value").val(),idValue)
   							 }
							}
							$(obj).parent().find(".combo-value").val(idValue);
							$(obj).parent().find(".combo-text").val(names.join(','));
							p.dialog('close');
							
						
					}
				}
			},{
				text : '取消',
				handler : function() {
					parent.thunms.confirm("询问","确认取消《数据》选择吗?",function(r){
						if(r){
							p.dialog('close');
						}
						
					})	
				}
			} ]
		});




 }
 
/**
 * 部门选择
 * @param {} singleSelect
 * @param {} obj
 * @param {} url
 * @param {} isView
 * @param {} callBack
 */
 thunms.thunmsSelectDepartment=function(singleSelect,obj,url,isView,callBack){
 		//在此拼装URL
 		var urls='/platform/resource/select/comboTree?singleSelect='+singleSelect+'&dataUrl='+url;
 		if(isView&&isView=='true'){
 			if(url.indexOf("?")!=-1){
 				urls=url+'&singleSelect='+singleSelect;
 			}else{
 				urls=url+'?singleSelect='+singleSelect;
 			}
 			
 		}
		var p= parent.thunms.dialog({
		 	href:thunms.base()+urls,
		 	title:'机构部门选择',
		    width:420,
		    cache:false,
		    height:$(document.body).height(),   
		    modal:true,
			buttons : [ {
				text : '确定',
				handler : function() {
					if(typeof(callBack)!="undefined"&&callBack!=null){  //判断定义是否存在
						if(jQuery.isFunction(callBack)){//判断定义是否为Function     	
   							 callBack(p);
   						}else{
   							alert("回调方法未定义:"+callBack);   							
   						}
					}else{
						
					var ids = [];
					var names=[];
					var dg=p.find('#selectUserDepartment');
					if(singleSelect){
					var rows = dg.tree('getSelected');
					if(rows){
						ids.push(rows.id);
						names.push(rows.text);	
					}else{
						alert("请选择数据");
						return ;
					}
					}else{
					var rows = dg.tree('getChecked', ['checked','indeterminate']);
					if(rows.length==0){
						alert("请选择数据");
						return ;
					}
					for ( var i = 0; i < rows.length; i++) {
						ids.push(rows[i].id);
						names.push(rows[i].text);
					}
					}
							//设计一个回调方法
							var idValue=ids.join(',');
							if(typeof(selectComboTreeCallBack)!="undefined"){  //判断定义是否存在
							if(jQuery.isFunction(selectComboTreeCallBack)){//判断定义是否为Function     	
   							 selectComboTreeCallBack($(obj).parent().find(".combo-value").attr("id"),$(obj).parent().find(".combo-value").val(),idValue)
   							 }
							}
							$(obj).parent().find(".combo-value").val(idValue);
							$(obj).parent().find(".combo-text").val(names.join(','));
							p.dialog('close');
							
						
					}
				}
			},{
				text : '取消',
				handler : function() {
					parent.thunms.confirm("询问","确认取消《数据》选择吗?",function(r){
						if(r){
							p.dialog('close');
						}
						
					})	
				}
			} ]
		});




 } 
/**
 * 弹出的选择框，只选择text不需要隐藏的id值
 * @param {} singleSelect
 * @param {} obj
 * @param {} url
 * @param {} isView
 * @param {} callBack
 */
thunms.thunmsSelectComboTreeValue=function(singleSelect,obj,url,isView,callBack){
 		//在此拼装URL
 		var urls='/platform/resource/select/comboTree?singleSelect='+singleSelect+'&dataUrl='+url;
 		if(isView&&isView=='true'){
 			if(url.indexOf("?")!=-1){
 				urls=url+'&singleSelect='+singleSelect;
 			}else{
 				urls=url+'?singleSelect='+singleSelect;
 			}
 			
 		}
		var p= parent.thunms.dialog({
		 	href:thunms.base()+urls,
		 	title:'数据选择',
		    width:300,
		    cache:false,
		    height:$(document.body).height(),   
		    modal:true,
			buttons : [ {
				text : '确定',
				handler : function() {
					if(typeof(callBack)!="undefined"&&callBack!=null){  //判断定义是否存在
						if(jQuery.isFunction(callBack)){//判断定义是否为Function     	
   							 callBack(p);
   						}else{
   							alert("回调方法未定义:"+callBack);   							
   						}
					}else{
						
					var names=[];
					var dg=p.find('.easyui-tree');
					if(singleSelect){
					var rows = dg.tree('getSelected');
					if(rows){
						names.push(rows.text);	
					}else{
						alert("请选择数据");
						return ;
					}
					}else{
					var rows = dg.tree('getChecked', ['checked','indeterminate']);
					if(rows.length==0){
						alert("请选择数据");
						return ;
					}
					for ( var i = 0; i < rows.length; i++) {
						names.push(rows[i].text);
					}
					}
							$(obj).parent().find(".combo-text").val(names.join(','));
							p.dialog('close');
							
						
					}
				}
			},{
				text : '取消',
				handler : function() {
					parent.thunms.confirm("询问","确认取消《数据》选择吗?",function(r){
						if(r){
							p.dialog('close');
						}
						
					})	
				}
			} ]
		});




 }
thunms.showModalDialog=function(url,vArguments,callBack){
	window.showModalDialog(url,vArguments,"dialogWidth="+$(document.body).width()+";dialogHeight="+$(document.body).height());
}
 
/**
 * @author 郭华(夏悸)
 * 
 * 格式化日期时间
 * 
 * @param format
 * @returns
 */
Date.prototype.format = function(format) {
	if (isNaN(this.getMonth())) {
		return '';
	}
	if (!format) {
		format = "yyyy-MM-dd hh:mm:ss";
	}
	var o = {
		/* month */
		"M+" : this.getMonth() + 1,
		/* day */
		"d+" : this.getDate(),
		/* hour */
		"h+" : this.getHours(),
		/* minute */
		"m+" : this.getMinutes(),
		/* second */
		"s+" : this.getSeconds(),
		/* quarter */
		"q+" : Math.floor((this.getMonth() + 3) / 3),
		/* millisecond */
		"S" : this.getMilliseconds()
	};
	if (/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for ( var k in o) {
		if (new RegExp("(" + k + ")").test(format)) {
			format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
		}
	}
	return format;
};

/**
 * 
 * 
 * @requires jQuery
 * 
 * 改变jQuery的AJAX默认属性和方法
 */
$.ajaxSetup({
	type : 'POST',
	error : function(XMLHttpRequest, textStatus, errorThrown) {
		$.messager.progress('close');
		$.messager.alert('错误', XMLHttpRequest.responseText);
	}
});

/**
 * allows for downloading of grid data (store) directly into excel
 * Method: extracts data of gridPanel store, uses columnModel to construct XML excel document,
 * converts to Base64, then loads everything into a data URL link.
 *将datagrid转换出excel
 * @author Animal <extjs support team>
 *
 */


$.extend($.fn.datagrid.methods,{
    getExcelXml: function(jq, param) {
        var worksheet = this.createWorksheet(jq, param);
		//alert($(jq).datagrid('getColumnFields'));
		var totalWidth = 0;
		var cfs = $(jq).datagrid('getColumnFields');
		for(var i=1; i<cfs.length; i++) {
			totalWidth+= $(jq).datagrid('getColumnOption',cfs[i]).width;
		}
        //var totalWidth = this.getColumnModel().getTotalWidth(includeHidden);
        return '<xml version="1.0" encoding="utf-8">' +
            '<ss:Workbook xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns:o="urn:schemas-microsoft-com:office:office">' +
            '<o:DocumentProperties><o:Title>' + param.title + '</o:Title></o:DocumentProperties>' +
            '<ss:ExcelWorkbook>' +
            '<ss:WindowHeight>' + worksheet.height + '</ss:WindowHeight>' +
            '<ss:WindowWidth>' + worksheet.width + '</ss:WindowWidth>' +
            '<ss:ProtectStructure>False</ss:ProtectStructure>' +
            '<ss:ProtectWindows>False</ss:ProtectWindows>' +
            '</ss:ExcelWorkbook>' +
            '<ss:Styles>' +
            '<ss:Style ss:ID="Default">' +
            '<ss:Alignment ss:Vertical="Top"  />' +
            '<ss:Font ss:FontName="arial" ss:Size="10" />' +
            '<ss:Borders>' +
            '<ss:Border  ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Top" />' +
            '<ss:Border  ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Bottom" />' +
            '<ss:Border  ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Left" />' +
            '<ss:Border ss:Weight="1" ss:LineStyle="Continuous" ss:Position="Right" />' +
            '</ss:Borders>' +
            '<ss:Interior />' +
            '<ss:NumberFormat />' +
            '<ss:Protection />' +
            '</ss:Style>' +
            '<ss:Style ss:ID="title">' +
            '<ss:Borders />' +
            '<ss:Font />' +
            '<ss:Alignment  ss:Vertical="Center" ss:Horizontal="Center" />' +
            '<ss:NumberFormat ss:Format="@" />' +
            '</ss:Style>' +
            '<ss:Style ss:ID="headercell">' +
            '<ss:Font ss:Bold="1" ss:Size="10" />' +
            '<ss:Alignment  ss:Horizontal="Center" />' +
            '<ss:Interior ss:Pattern="Solid"  />' +
            '</ss:Style>' +
            '<ss:Style ss:ID="even">' +
            '<ss:Interior ss:Pattern="Solid"  />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="even" ss:ID="evendate">' +
            '<ss:NumberFormat ss:Format="yyyy-mm-dd" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="even" ss:ID="evenint">' +
            '<ss:NumberFormat ss:Format="0" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="even" ss:ID="evenfloat">' +
            '<ss:NumberFormat ss:Format="0.00" />' +
            '</ss:Style>' +
            '<ss:Style ss:ID="odd">' +
            '<ss:Interior ss:Pattern="Solid"  />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="odd" ss:ID="odddate">' +
            '<ss:NumberFormat ss:Format="yyyy-mm-dd" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="odd" ss:ID="oddint">' +
            '<ss:NumberFormat ss:Format="0" />' +
            '</ss:Style>' +
            '<ss:Style ss:Parent="odd" ss:ID="oddfloat">' +
            '<ss:NumberFormat ss:Format="0.00" />' +
            '</ss:Style>' +
            '</ss:Styles>' +
            worksheet.xml +
            '</ss:Workbook>';
    },

    createWorksheet: function(jq, param) {
        // Calculate cell data types and extra class names which affect formatting
        var cellType = [];
        var cellTypeClass = [];
        //var cm = this.getColumnModel();
        var totalWidthInPixels = 0;
        var colXml = '';
        var headerXml = '';
        var visibleColumnCountReduction = 0;
		var cfs = $(jq).datagrid('getColumnFields');
        var colCount = cfs.length;
        for (var i = 1; i < colCount; i++) {
            if (cfs[i] != '') {
                var w = $(jq).datagrid('getColumnOption',cfs[i]).width;
                totalWidthInPixels += w;
                if (cfs[i] === ""){
                	cellType.push("None");
                	cellTypeClass.push("");
                	++visibleColumnCountReduction;
                }
                else
                {
                    colXml += '<ss:Column ss:AutoFitWidth="1" ss:Width="130" />';
                    headerXml += '<ss:Cell ss:StyleID="headercell">' +
                        '<ss:Data ss:Type="String">' + $(jq).datagrid('getColumnOption',cfs[i]).title + '</ss:Data>' +
                        '<ss:NamedCell ss:Name="Print_Titles" /></ss:Cell>';
					cellType.push("String");
                    cellTypeClass.push("");
                }
            }
        }
        var visibleColumnCount = cellType.length - visibleColumnCountReduction;

        var result = {
            height: 9000,
            width: Math.floor(totalWidthInPixels * 30) + 50
        };
		
		var rows = $(jq).datagrid('getRows');
        // Generate worksheet header details.
        var t = '<ss:Worksheet ss:Name="' + param.title + '">' +
            '<ss:Names>' +
            '<ss:NamedRange ss:Name="Print_Titles" ss:RefersTo="=\'' + param.title + '\'!R1:R2" />' +
            '</ss:Names>' +
            '<ss:Table x:FullRows="1" x:FullColumns="1"' +
            ' ss:ExpandedColumnCount="' + (visibleColumnCount + 2) +
            '" ss:ExpandedRowCount="' + (rows.length + 2) + '">' +
            colXml +
            '<ss:Row ss:AutoFitHeight="1">' +
            headerXml +
            '</ss:Row>';

        // Generate the data rows from the data in the Store
        //for (var i = 0, it = this.store.data.items, l = it.length; i < l; i++) {
        for (var i = 0, it = rows, l = it.length; i < l; i++) {
            t += '<ss:Row>';
            var cellClass = (i & 1) ? 'odd' : 'even';
            r = it[i];
            var k = 0;
            for (var j = 1; j < colCount; j++) {
                //if ((cm.getDataIndex(j) != '')
                if (cfs[j] != '') {
                    //var v = r[cm.getDataIndex(j)];
                    var v = r[cfs[j]];
                    if (cellType[k] !== "None") {
                        t += '<ss:Cell ss:StyleID="' + cellClass + cellTypeClass[k] + '"><ss:Data ss:Type="' + cellType[k] + '">';
                        if (cellType[k] == 'DateTime') {
                            t += v.format('Y-m-d');
                        } else {
                            t += v;
                        }
                        t +='</ss:Data></ss:Cell>';
                    }
                    k++;
                }
            }
            t += '</ss:Row>';
        }

        result.xml = t + '</ss:Table>' +
            '<x:WorksheetOptions>' +
            '<x:PageSetup>' +
            '<x:Layout x:CenterHorizontal="1" x:Orientation="Landscape" />' +
            '<x:Footer x:Data="Page &amp;P of &amp;N" x:Margin="0.5" />' +
            '<x:PageMargins x:Top="0.5" x:Right="0.5" x:Left="0.5" x:Bottom="0.8" />' +
            '</x:PageSetup>' +
            '<x:FitToPage />' +
            '<x:Print>' +
            '<x:PrintErrors>Blank</x:PrintErrors>' +
            '<x:FitWidth>1</x:FitWidth>' +
            '<x:FitHeight>32767</x:FitHeight>' +
            '<x:ValidPrinterInfo />' +
            '<x:VerticalResolution>600</x:VerticalResolution>' +
            '</x:Print>' +
            '<x:Selected />' +
            '<x:DoNotDisplayGridlines />' +
            '<x:ProtectObjects>False</x:ProtectObjects>' +
            '<x:ProtectScenarios>False</x:ProtectScenarios>' +
            '</x:WorksheetOptions>' +
            '</ss:Worksheet>';
			//alert(result.xml);
        return result;
    }
});
/**
 * 加载等待信息.
 * 调用方法$("#id").mask(); $("#id").mask("hide"); $.mask(); $.mask.hide();   
 */
(function($){
    function init(target,options){
        var wrap = $(target);
		if($("div.mask",wrap).length) wrap.mask("hide");
		
        wrap.attr("position",wrap.css("position"));
		wrap.attr("overflow",wrap.css("overflow"));
        wrap.css("position", "relative");
		wrap.css("overflow", "hidden");
        
        var maskCss = {
            position:"absolute",
            left:0,
            top:0,
			cursor: "wait",
            background:"#ccc",
            opacity:options.opacity,
            filter:"alpha(opacity="+options.opacity*100+")",
            display:"none"
        };
        
        var maskMsgCss = {
            position:"absolute",
            width:"auto",
            padding:"10px 20px",
            border:"2px solid #ccc",
            color:"white",
			cursor: "wait",
            display:"none",
            borderRadius:5,
            background:"black",
            opacity:0.6,
            filter:"alpha(opacity=60)"
        };
		var width,height,left,top;
		if(target == 'body'){
			width = Math.max(document.documentElement.clientWidth, document.body.clientWidth);
			height = Math.max(document.documentElement.clientHeight, document.body.clientHeight);
		}else{
			width = wrap.outerWidth() || "100%";
			height = wrap.outerHeight() || "100%";
		}
        $('<div class="mask"></div>').css($.extend({},maskCss,{
            display : 'block',
            width : width,
            height : height,
            zIndex:options.zIndex
        })).appendTo(wrap);

		var maskm= $('<div class="mask-msg"></div>').html(options.maskMsg).appendTo(wrap).css(maskMsgCss);
		
		if(target == 'body'){
			left = (Math.max(document.documentElement.clientWidth,document.body.clientWidth) - $('div.mask-msg', wrap).outerWidth())/ 2;
			if(document.documentElement.clientHeight > document.body.clientHeight){
				top = (Math.max(document.documentElement.clientHeight,document.body.clientHeight)  - $('div.mask-msg', wrap).outerHeight())/ 2;
			}else{
				top = (Math.min(document.documentElement.clientHeight,document.body.clientHeight)  - $('div.mask-msg', wrap).outerHeight())/ 2;
			}
			
		}else{
			left = (wrap.width() - $('div.mask-msg', wrap).outerWidth())/ 2;
			top = (wrap.height() - $('div.mask-msg', wrap).outerHeight())/ 2;
		}
		
        maskm.css({
            display : 'block',
            zIndex:options.zIndex+1,
            left : left,
            top :  top
        });
        
        setTimeout(function(){
            wrap.mask("hide");
        }, options.timeout);
            
        return wrap;
    }
       
    $.fn.mask = function(options){   
        if (typeof options == 'string'){
            return $.fn.mask.methods[options](this);
        }
        options = $.extend({}, $.fn.mask.defaults,options);
        return init(this,options);
    };
    $.mask = function(options){  
        if (typeof options == 'string'){
            return $.fn.mask.methods[options]("body");
        }
        options = $.extend({}, $.fn.mask.defaults,options);
        return init("body",options);
    };
	
	$.mask.hide = function(){
		$("body").mask("hide");
	};
	
    $.fn.mask.methods = {
        hide : function(jq) {
            return jq.each(function() {
                var wrap = $(this);
                $("div.mask",wrap).fadeOut(function(){
                    $(this).remove();
                });
                $("div.mask-msg",wrap).fadeOut(function(){
                    $(this).remove();
                    wrap.css("position",  wrap.attr("position"));
					wrap.css("overflow", wrap.attr("overflow"));
                });
            });
        }
    };
    
    $.fn.mask.defaults = {
        maskMsg:'处理中,请等待...',
        zIndex:100000,
        timeout:900000,
        opacity:0.6
    };
})(jQuery);
/**
 * extremecomponents方法
 * @param {} form
 * @return {}
 */
function getParameterMap(form) {
    var p = document.forms[form].elements;
    var map = new Object();
    for(var x=0; x < p.length; x++) {
        var key = p[x].name;
        var val = p[x].value;
        
        //Check if this field name is unique.
        //If the field name is repeated more than once
        //add it to the current array.
        var curVal = map[key]; 
        if (curVal) { // more than one field so append value to array
        	curVal[curVal.length] = val;
        } else { // add field and value
        	map[key]= [val];
        }
    }
    return map;
}
/**
 * extremecomponents方法
 * @param {} form
 * @param {} action
 * @param {} method
 */
function setFormAction(form, action, method) {
	if (action) {
		document.forms[form].setAttribute('action', action);
	}
	
	if (method) {
		document.forms[form].setAttribute('method', method);
	}
	
	document.forms[form].ec_eti.value='';
}
