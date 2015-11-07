package org.thunms.schedule.quartz.service;

import org.quartz.JobExecutionContext;
import org.quartz.JobExecutionException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.thunms.framework.quartz.QuartzJobSupport;
import org.thunms.framework.utils.UtilDateTime;
/**
 * 任务实现demo.
 *说明:  任务实现只需要继承QuartzJobSupport类即可,需要设置方法getJobName、getDescription、getJobClass三个方法.
 *getJobName用于标识任务的名称.
 *getDescription用于描述任务作用.
 *getJobClass属于任务的执行体.通常this.getClass()进行返回.
 * @author wanglp 2015年11月7日 下午4:02:06
 */
@Service
public class DemoQuartzJobBean extends QuartzJobSupport  {
	private static final long serialVersionUID = 2276320239183197916L;
	private static final Logger logger = LoggerFactory.getLogger(DemoQuartzJobBean.class);
	@Override
	public String getJobName() {
		return "helloQuartzJob";
	}

	@Override
	public String getDescription() {
		return "a quartz Job hello world";
	}

	@Override
	public Class<?> getJobClass() {
		return this.getClass();
	}

	@Override
	public void execute(JobExecutionContext context) throws JobExecutionException {
		logger.info("=quartz Job hello world=任务分组:"+context.getJobDetail().getKey().getGroup()+"."+context.getJobDetail().getKey().getName()+"==>"+UtilDateTime.toDateTimeString(UtilDateTime.nowDate()));
	}
	
}
