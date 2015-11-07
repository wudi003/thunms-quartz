<%@ page language="java" pageEncoding="UTF-8"%>
<script type="text/javascript" charset="UTF-8">
	var tree;
	var selected=true;
	$(function() {
		$.ajax({
	   type: "POST",
	   url: thunms.base()+"/accordion",
	   cache: false,
	   dataType:'json',
	   success: function(nodes){
			$.each(nodes, function(i, node){
			  add(node)
			});
	   }
	});
		});
	
	function collapseAll() {
		var node = tree.tree('getSelected');
		if (node) {
			tree.tree('collapseAll', node.target);
		} else {
			tree.tree('collapseAll');
		}
	}
	function expandAll() {
		var node = tree.tree('getSelected');
		if (node) {
			tree.tree('expandAll', node.target);
		} else {
			tree.tree('expandAll');
		}
	}
	
	   function add(node){
	   
	   	var content='<ul id="'+node.id+'" class="easyui-tree" style="margin-top: 5px;" data-options="animate : false,lines : !thunms.isLessThanIe8(),onClick : nodeClick,onDblClick : nodeDblClick,url:\''+thunms.base()+'/menu?parentId='+node.id+'\',onLoadError:function(arguments){}"></ul>';
            $('#desktopAccordion').accordion('add',{  
                title:node.text,  
                content:content,
                selected: selected
            }); 
            selected=false; 
        }
        
        function nodeClick(node){
        		if (node.attributes && node.attributes.src && node.attributes.src != '') {
					var href;
					if (/^\//.test(node.attributes.src)) {//*以"/"符号开头的,说明是本项目地址
						href = thunms.base()+node.attributes.src;
					} else {
						href = node.attributes.src;
					}
					addTabFun({
						src : href,
						title : node.text
					});
				} else {
					 if (node.state == 'closed') {
							$(this).tree('expand', node.target);
						} else {
							$(this).tree('collapse', node.target);
						}
					 /**
					parent.thunms.show({
						msg : '您请求的功能暂时无法显示，请您稍后再试！',
						title : '提示'
					});
					 **/
				}
        }
       function nodeDblClick(node){
      		 if (node.state == 'closed') {
					$(this).tree('expand', node.target);
				} else {
					$(this).tree('collapse', node.target);
				}
       }
</script>
<div class="easyui-panel" fit="true" border="false">
	<div id="desktopAccordion" class="easyui-accordion" fit="true" animate="false" border="false">
		
	</div>
</div>