# 产假计算页面
## 需求类
- 去除休假开始日期和预产期的校验
- 去掉高级选项的隐藏，默认展示他们
- 用户选择城市后，获取对应城市的政策数据，展示部分政策数据

## 技术类
- 将员工工资分为两个字段，一个为过去12个月平均工资（目前计算尚未使用，但我记得需要来着），一个是当前工资



# 政策配置页面
## 需求类
- 增加奖励假一列？
- 将“含节假日”更新为“工作日/日历日”和“遇到公共假期顺延/遇到公共假期不顺延” ----> 和excel更像一点
- 建议将按自然日计算的勾选框 换为 日历日/工作日 的下拉框，默认日历日。
- 法定产假以外的假期政策建议第一项让用户选择 ”统一假期政策“或”自定义假期政策“，对应下方展示不同输入框
--- ”统一假期政策“ 让他输入假期天数 （standardLeaveDays/extraInfantLeaveDays）
--- ”自定义假期政策“ 让他输入 假期政策描述（LeaveRule.description） 和 对应假期天数（LeaveRule.leaveDays） 如假期天数为可变值，则 为LeaveRule.minleaveDays & LeaveRule.maxleaveDays

- 强制补足差额 勾选框改为 是（Yes）/否（No）/仅满足以下条件（Only if）
--- 选择 “仅满足以下条件” 时，展示 规则描述框（可添加多条）

## 技术类
- 将最大产假天数提升至和法定产假政策/难产假政策并列
- 新增政策时怎么输入一个数字 就跳到最上面了?
- 津贴政策这里添加‘政府发放金额’ 和 ‘津贴天数规则’（四个勾选框，分别对应法定产假 难产假 多胎假 奖励假）
----- 对应后端代码         
        if (!CollectionUtils.isEmpty(allowancePolicy.getAllowanceDaysRule())) {
            if (allowancePolicy.getAllowanceDaysRule().contains("statutory")) {
                allowanceDays = request.getLeaveDetail().getStatutoryLeaveDays();
            }
            if (allowancePolicy.getAllowanceDaysRule().contains("dystocia")) {
                allowanceDays = allowanceDays + request.getLeaveDetail().getDystociaLeaveDays();
            }
            if (allowancePolicy.getAllowanceDaysRule().contains("moreInfant")) {
                allowanceDays = allowanceDays + request.getLeaveDetail().getMoreInfantLeaveDays();
            }
            if (allowancePolicy.getAllowanceDaysRule().contains("otherExtended")) {
                allowanceDays = allowanceDays + request.getLeaveDetail().getOtherExtendedLeaveDays();
            }
        }


