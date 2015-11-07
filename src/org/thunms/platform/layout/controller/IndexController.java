package org.thunms.platform.layout.controller;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.thunms.framework.model.TreeNode;
import org.thunms.framework.utils.UtilCalendar;
import org.thunms.framework.utils.UtilSystemProperties;

/**
 * 此处升级为平台级的请求总体控制器
 * @author wanglp
 *
 */
@Controller
public class IndexController  {
	private static final Logger logger = LoggerFactory.getLogger(IndexController.class);
	
	
	/**
	 * 在平台不断扩大时此处用于控制默认路径的跳转
	 * @param request
	 * @param response
	 * @param model
	 * @return
	 */
	@RequestMapping(value="/index")
	public String index(HttpServletRequest request, HttpServletResponse response,Model model) {
		model.addAttribute("thunms_platform_name", UtilSystemProperties.getPropertyValue("thunms.platform.name", "任务调度管理平台"));
		StringBuilder welcome=new StringBuilder();
		welcome.append(UtilCalendar.getWelcome());
		model.addAttribute("thunms_platform_welcome", welcome);
		return "platform/layout/index/index";
		
	}
	@RequestMapping(value="/")
	public String root(HttpServletRequest request, HttpServletResponse response,Model model) {
		logger.debug("解析入口为===>>/");
		return this.index(request, response, model);
	}
	
	
	@RequestMapping(value = "/north")
	public String north(HttpServletRequest request, HttpServletResponse response,Model model) {
		model.addAttribute("thunms_platform_name", UtilSystemProperties.getPropertyValue("thunms.platform.name", "任务调度管理平台"));
		StringBuilder welcome=new StringBuilder();
		welcome.append(UtilCalendar.getWelcome());
		model.addAttribute("thunms_platform_welcome", welcome);
		
		return "north";
	}
	@RequestMapping(value = "/east")
	public String east() {
		return "platform/layout/index/east";
	}
	@RequestMapping(value = "/west")
	public String west(String parentId,HttpServletRequest request, HttpServletResponse response,Model model) {
		return "platform/layout/index/west";
	}

	@RequestMapping(value = "/center")
	public String center() {
		return "platform/layout/index/center";
	}

	@RequestMapping(value = "/south")
	public String south(HttpServletRequest request, HttpServletResponse response,Model model) {
		return "platform/layout/index/south";
	}

	
	
	@RequestMapping(value = "/home")
	public String home(HttpServletRequest request, HttpServletResponse response,Model model) {
		return "platform/layout/index/home";
	}
	
	
	@ResponseBody
	@RequestMapping(value = "/accordion")
	public List<TreeNode> accordion(HttpServletRequest request, HttpServletResponse response,Model model) {
		List<TreeNode> treeNodes=new ArrayList<TreeNode>();
		TreeNode t=new TreeNode();
		t.setId("schedule");
		t.setText("工作任务引擎");
		treeNodes.add(t);
		return treeNodes;
	}
	@ResponseBody
	@RequestMapping(value = "/menu")
	public List<TreeNode> menu(HttpServletRequest request, HttpServletResponse response,Model model) {
		List<TreeNode> treeNodes=new ArrayList<TreeNode>();
		TreeNode t=new TreeNode();
		t.setId("schedule_qrtzTriggers");
		t.setText("任务运行监控");
		Map<String, Object> attributes = new HashMap<String, Object>();
		attributes.put("src", "/schedule/quartz/qrtzTriggers");
		t.setAttributes(attributes);
		treeNodes.add(t);
		
		
		t=new TreeNode();
		t.setId("schedule_qrtzJobs");
		t.setText("平台任务列表");
		attributes = new HashMap<String, Object>();
		attributes.put("src", "/schedule/quartz/qrtzJobs");
		t.setAttributes(attributes);
		treeNodes.add(t);
		
		t=new TreeNode();
		t.setId("dataInitializeScript");
		t.setText("数据初始脚本");
		attributes = new HashMap<String, Object>();
		attributes.put("src", "/change/initialize/dataInitializeScript");
		t.setAttributes(attributes);
		treeNodes.add(t);
		
		
		return treeNodes;
	}
	
}
