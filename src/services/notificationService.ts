/**
 * 通知服务 - Mock 数据
 * Notification Service - Mock Data
 */

import { Notification, NotificationGroup } from '../types/notification';

// Mock 通知数据
const mockNotifications: Notification[] = [
  // 政策更新通知
  {
    id: 'notif-001',
    type: 'policy_update',
    priority: 'high',
    status: 'unread',
    title: '上海市产假政策更新',
    message: '上海市2025年产假政策已更新，法定产假从98天延长至128天，请及时查看最新政策详情。',
    actionUrl: '/admin/policies?city=shanghai',
    actionText: '查看详情',
    metadata: {
      cityCode: 'shanghai',
      cityName: '上海市',
      policyVersion: 'v2025.1',
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
  },
  {
    id: 'notif-002',
    type: 'policy_update',
    priority: 'medium',
    status: 'unread',
    title: '北京市多胎假政策调整',
    message: '北京市多胎假政策调整，每多生育一个婴儿增加产假15天，自2025年1月1日起生效。',
    actionUrl: '/admin/policies?city=beijing',
    actionText: '查看政策',
    metadata: {
      cityCode: 'beijing',
      cityName: '北京市',
      policyVersion: 'v2025.1',
    },
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(), // 5小时前
  },

  // 计算结果通知
  {
    id: 'notif-003',
    type: 'calculation_result',
    priority: 'medium',
    status: 'read',
    title: '产假计算完成',
    message: '您为张小美计算的产假结果已生成，共计158天产假，生育津贴预估45,600元。',
    actionUrl: '/history?id=calc-12345',
    actionText: '查看结果',
    metadata: {
      calculationId: 'calc-12345',
      userName: '张小美',
      totalDays: 158,
      estimatedAllowance: 45600,
    },
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1天前
    readAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },

  // 审批需求通知
  {
    id: 'notif-004',
    type: 'approval_required',
    priority: 'urgent',
    status: 'unread',
    title: '待审批：特殊产假申请',
    message: '员工李华申请特殊产假延长，需要您的审批。申请理由：难产+多胎，预计延长30天。',
    actionUrl: '/admin/approvals?id=approval-789',
    actionText: '立即审批',
    metadata: {
      userId: 'user-789',
      userName: '李华',
      requestType: 'special_leave_extension',
      requestedDays: 30,
    },
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30分钟前
  },
  {
    id: 'notif-005',
    type: 'approval_required',
    priority: 'high',
    status: 'unread',
    title: '待审批：政策修改申请',
    message: '管理员王明申请修改广州市产假政策配置，请审核变更内容。',
    actionUrl: '/admin/approvals?id=approval-790',
    actionText: '审核变更',
    metadata: {
      userId: 'admin-456',
      userName: '王明',
      requestType: 'policy_modification',
      cityCode: 'guangzhou',
    },
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2小时前
  },

  // 审批状态通知
  {
    id: 'notif-006',
    type: 'approval_status',
    priority: 'medium',
    status: 'read',
    title: '审批通过：产假申请已批准',
    message: '您提交的产假延长申请已通过审批，新的产假结束日期为2025年8月15日。',
    actionUrl: '/history?id=calc-12346',
    actionText: '查看详情',
    metadata: {
      approvalStatus: 'approved',
      approver: '人事部-张经理',
      newEndDate: '2025-08-15',
    },
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2天前
    readAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // 截止日期提醒
  {
    id: 'notif-007',
    type: 'deadline_reminder',
    priority: 'high',
    status: 'unread',
    title: '提醒：产假即将结束',
    message: '员工赵敏的产假将于3天后（2025年3月20日）结束，请提前做好工作交接准备。',
    actionUrl: '/history?user=user-101',
    actionText: '查看详情',
    metadata: {
      userId: 'user-101',
      userName: '赵敏',
      deadline: '2025-03-20',
      daysRemaining: 3,
    },
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1小时前
  },
  {
    id: 'notif-008',
    type: 'deadline_reminder',
    priority: 'medium',
    status: 'unread',
    title: '提醒：生育津贴申请截止',
    message: '您有5位员工的生育津贴申请即将截止（7天内），请尽快完成申请提交。',
    actionUrl: '/allowance/pending',
    actionText: '查看待办',
    metadata: {
      pendingCount: 5,
      deadline: '2025-03-24',
      daysRemaining: 7,
    },
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6小时前
  },

  // 系统公告
  {
    id: 'notif-009',
    type: 'system_announcement',
    priority: 'low',
    status: 'read',
    title: '系统维护通知',
    message: '系统将于本周六（3月18日）凌晨2:00-4:00进行维护升级，期间服务可能暂时中断，请提前做好安排。',
    actionUrl: '/announcements/maintenance-2025-03',
    actionText: '了解详情',
    metadata: {
      maintenanceDate: '2025-03-18',
      startTime: '02:00',
      endTime: '04:00',
    },
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), // 3天前
    readAt: new Date(Date.now() - 2.5 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'notif-010',
    type: 'system_announcement',
    priority: 'medium',
    status: 'unread',
    title: '新功能上线：政策对比工具',
    message: '我们上线了全新的政策对比功能，支持多城市产假政策并排对比，帮助您快速了解各地差异。',
    actionUrl: '/policy-comparison',
    actionText: '立即体验',
    metadata: {
      featureName: 'policy_comparison',
      version: 'v2.1.0',
    },
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12小时前
  },

  // 数据同步通知
  {
    id: 'notif-011',
    type: 'data_sync',
    priority: 'low',
    status: 'read',
    title: '数据同步完成',
    message: '2025年第一季度全国城市产假政策数据已同步完成，共更新15个城市的政策信息。',
    actionUrl: '/admin/policies',
    actionText: '查看更新',
    metadata: {
      syncDate: '2025-03-15',
      updatedCities: 15,
      totalPolicies: 50,
    },
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), // 4天前
    readAt: new Date(Date.now() - 3.5 * 24 * 60 * 60 * 1000).toISOString(),
  },

  // 错误警告
  {
    id: 'notif-012',
    type: 'error_alert',
    priority: 'urgent',
    status: 'unread',
    title: '警告：政策数据异常',
    message: '检测到深圳市产假政策数据存在异常，部分计算结果可能不准确，请立即检查并修复。',
    actionUrl: '/admin/policies?city=shenzhen&status=error',
    actionText: '立即处理',
    metadata: {
      cityCode: 'shenzhen',
      cityName: '深圳市',
      errorType: 'data_inconsistency',
      affectedCalculations: 3,
    },
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(), // 15分钟前
  },
];

/**
 * 获取所有通知
 */
export const getAllNotifications = async (): Promise<Notification[]> => {
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockNotifications.sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

/**
 * 获取未读通知数量
 */
export const getUnreadCount = async (): Promise<number> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  return mockNotifications.filter(n => n.status === 'unread').length;
};

/**
 * 获取按日期分组的通知
 */
export const getGroupedNotifications = async (): Promise<NotificationGroup[]> => {
  const notifications = await getAllNotifications();
  
  const groups: Record<string, Notification[]> = {};
  
  notifications.forEach(notification => {
    const date = new Date(notification.createdAt);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let dateKey: string;
    if (date.toDateString() === today.toDateString()) {
      dateKey = '今天';
    } else if (date.toDateString() === yesterday.toDateString()) {
      dateKey = '昨天';
    } else if (date > new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)) {
      dateKey = '本周';
    } else if (date > new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)) {
      dateKey = '本月';
    } else {
      dateKey = '更早';
    }
    
    if (!groups[dateKey]) {
      groups[dateKey] = [];
    }
    groups[dateKey].push(notification);
  });
  
  const order = ['今天', '昨天', '本周', '本月', '更早'];
  return order
    .filter(key => groups[key])
    .map(key => ({
      date: key,
      notifications: groups[key],
    }));
};

/**
 * 标记通知为已读
 */
export const markAsRead = async (notificationId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.status = 'read';
    notification.readAt = new Date().toISOString();
  }
};

/**
 * 标记所有通知为已读
 */
export const markAllAsRead = async (): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 300));
  mockNotifications.forEach(notification => {
    if (notification.status === 'unread') {
      notification.status = 'read';
      notification.readAt = new Date().toISOString();
    }
  });
};

/**
 * 删除通知
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const index = mockNotifications.findIndex(n => n.id === notificationId);
  if (index > -1) {
    mockNotifications.splice(index, 1);
  }
};

/**
 * 归档通知
 */
export const archiveNotification = async (notificationId: string): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));
  const notification = mockNotifications.find(n => n.id === notificationId);
  if (notification) {
    notification.status = 'archived';
  }
};
