<%@ page language="java" pageEncoding="UTF-8"%>
<%@ taglib prefix="shiro"  uri="http://shiro.apache.org/tags" %>
<script type="text/javascript" charset="UTF-8">
function logout() {
	if(parent){
		parent.window.location.href=thunms.base()+'/logout';
	}else{
		window.location.href=thunms.base()+'/logout';
	}
}
</script>
<div>
<div style="padding-top: 15px;padding-left: 2px;font-size: 42">
${thunms_platform_name }
</div>
<div style="position: absolute; right: 2px; top: 2px;font-size: 14 ">
${thunms_platform_welcome}
</div>
<div style="position: absolute; right: 0px; bottom: 0px; ">
	<shiro:hasRole name="thunms_manager">
	<a href="javascript:void(0);" class="easyui-menubutton" menu="#layout_north_pfMenu" iconCls="icon-ok">更换皮肤</a>
	</shiro:hasRole>
	<a href="javascript:void(0);" class="easyui-menubutton" menu="#layout_north_kzmbMenu" iconCls="icon-edit">控制面板</a> 
	<a href="javascript:void(0);" class="easyui-menubutton" menu="#layout_north_zxMenu" iconCls="icon-back">注销</a>
	<a href="javascript:void(0);" class="easyui-menubutton" menu="#layout_north_zxHelp" iconCls="icon-help">开始</a>
</div>
<shiro:hasRole name="thunms_manager">
<div id="layout_north_pfMenu" style="width: 120px; display: none;">
	<div onclick="thunms.changeTheme('default');">默认(default)</div>
	<div onclick="thunms.changeTheme('black');">黑色(black)</div>
	<div onclick="thunms.changeTheme('bootstrap');">bootstrap</div>
	<div onclick="thunms.changeTheme('gray');">灰色(gray)</div>
	<div onclick="thunms.changeTheme('metro');">metro</div>
	
</div>
</shiro:hasRole>
<div id="layout_north_kzmbMenu" style="width: 100px; display: none;">
	<div onclick="showUserInfo();">个人信息</div>
	<div class="menu-sep"></div>
	<div onclick="editPassword();">修改密码</div>
	<div class="menu-sep"></div>
	<div onclick="userLoginLogs();">登录日志</div>
	<div class="menu-sep"></div>
	<div onclick="changeUserAreaDepartments();">切换部门</div>
	</div>
</div>
<div id="layout_north_zxMenu" style="width: 100px; display: none;">
	<div onclick="lockingSystem();">锁定窗口</div>
	<div class="menu-sep"></div>
	<div onclick="logout();">重新登录</div>
	<div onclick="logout();">退出系统</div>
</div>
<div id="layout_north_zxHelp" style="width: 100px; display: none;">
	<div onclick="systemOnlineService();">在线客服</div>
	<div class="menu-sep"></div>
	<div onclick="systemOnlineQuestion();">问题提交</div>
	<div onclick="systemOnlineConsultation();">业务咨询</div>
	<div class="menu-sep"></div>
	<div onclick="systemOnlineRegister();">系统注册</div>
</div>