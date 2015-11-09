<%@ page language="java" import="java.util.*" pageEncoding="UTF-8"%>
<%@ taglib prefix="shiro"  uri="http://shiro.apache.org/tags" %>
<%@ taglib prefix="t" uri="/thunms"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<t:head   />
<body id="indexLayout" class="easyui-layout"   >
	<div data-options="region:'north'"   style="height:60px;overflow: hidden;" >
		<div>
		<div style="padding-top: 15px;padding-left: 2px;font-size: 42">
		${thunms_platform_name }
		</div>
		<div style="position: absolute; right: 2px; top: 2px;font-size: 14 ">
		${thunms_platform_welcome}
		</div>
		</div>
	</div>
	<div data-options="region:'west',title:'功能导航',split:true,href:'${cxt }/west'"   style="width:178px;overflow: hidden;" ></div>
	<div data-options="region:'center',href:'${cxt }/center'"  style="overflow: hidden;" ></div>
	<div data-options="region:'south',href:'${cxt }/south'"  style="height:20px;overflow: hidden;" ></div>
</body>
<script type="text/javascript">
window.onbeforeunload = function(){return "【当前操作可能会造成操作数据的丢失,请检查？】\n【1.您刚操作的表单是否已经提交？】\n【2.您是否已经真的完成了当前操作？】\n【3.您真的要执行当前操作？】";}
</script>
</html>