/**
 * 通知系统类型定义
 * Notification System Type Definitions
 */

export type NotificationType = 
  | 'policy_update'      // 政策更新
  | 'calculation_result' // 计算结果
  | 'approval_required'  // 需要审批
  | 'approval_status'    // 审批状态变更
  | 'deadline_reminder'  // 截止日期提醒
  | 'system_announcement'// 系统公告
  | 'data_sync'          // 数据同步
  | 'error_alert';       // 错误警告

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent';

export type NotificationStatus = 'unread' | 'read' | 'archived';

export interface Notification {
  id: string;
  type: NotificationType;
  priority: NotificationPriority;
  status: NotificationStatus;
  title: string;
  message: string;
  actionUrl?: string;
  actionText?: string;
  metadata?: {
    cityCode?: string;
    cityName?: string;
    policyVersion?: string;
    calculationId?: string;
    userId?: string;
    userName?: string;
    deadline?: string;
    [key: string]: any;
  };
  createdAt: string;
  readAt?: string;
}

export interface NotificationGroup {
  date: string;
  notifications: Notification[];
}
