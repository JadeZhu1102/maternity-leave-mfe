/**
 * 通知铃铛组件
 * Notification Bell Component
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BellIcon } from '@heroicons/react/24/outline';
import { BellIcon as BellSolidIcon } from '@heroicons/react/24/solid';
import { getUnreadCount, getGroupedNotifications, markAsRead, markAllAsRead } from '../../services/notificationService';
import { NotificationGroup } from '../../types/notification';

export function NotificationBell() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationGroup[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadUnreadCount();
    // 每30秒刷新一次未读数
    const interval = setInterval(loadUnreadCount, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadUnreadCount = async () => {
    try {
      const count = await getUnreadCount();
      setUnreadCount(count);
    } catch (error) {
      console.error('Failed to load unread count:', error);
    }
  };

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const groups = await getGroupedNotifications();
      setNotifications(groups);
    } catch (error) {
      console.error('Failed to load notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      loadNotifications();
    }
    setIsOpen(!isOpen);
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markAsRead(notificationId);
      await loadNotifications();
      await loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      await loadNotifications();
      await loadUnreadCount();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600 bg-red-50';
      case 'high':
        return 'text-orange-600 bg-orange-50';
      case 'medium':
        return 'text-blue-600 bg-blue-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'policy_update':
        return '📋';
      case 'calculation_result':
        return '🧮';
      case 'approval_required':
        return '⚠️';
      case 'approval_status':
        return '✅';
      case 'deadline_reminder':
        return '⏰';
      case 'system_announcement':
        return '📢';
      case 'data_sync':
        return '🔄';
      case 'error_alert':
        return '🚨';
      default:
        return '📌';
    }
  };

  return (
    <div className="relative">
      {/* 通知铃铛按钮 */}
      <button
        onClick={handleToggle}
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        {unreadCount > 0 ? (
          <BellSolidIcon className="h-6 w-6 text-red-600" />
        ) : (
          <BellIcon className="h-6 w-6" />
        )}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* 通知下拉面板 */}
      {isOpen && (
        <>
          {/* 背景遮罩 */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />

          {/* 通知面板 */}
          <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-xl border border-gray-200 z-50 max-h-[600px] overflow-hidden flex flex-col">
            {/* 头部 */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">通知</h3>
              {unreadCount > 0 && (
                <button
                  onClick={handleMarkAllAsRead}
                  className="text-sm text-red-600 hover:text-red-700 font-medium"
                >
                  全部已读
                </button>
              )}
            </div>

            {/* 通知列表 */}
            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
                </div>
              ) : notifications.length === 0 ? (
                <div className="text-center py-12">
                  <BellIcon className="mx-auto h-12 w-12 text-gray-300" />
                  <p className="mt-2 text-sm text-gray-500">暂无通知</p>
                </div>
              ) : (
                notifications.map((group) => (
                  <div key={group.date}>
                    <div className="px-4 py-2 bg-gray-50 text-xs font-semibold text-gray-600">
                      {group.date}
                    </div>
                    {group.notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                          notification.status === 'unread' ? 'bg-blue-50' : ''
                        }`}
                      >
                        <div className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="flex-shrink-0 text-2xl">
                              {getTypeIcon(notification.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2 mb-1">
                                <h4 className="text-sm font-semibold text-gray-900 line-clamp-1">
                                  {notification.title}
                                </h4>
                                {notification.status === 'unread' && (
                                  <span className="flex-shrink-0 w-2 h-2 bg-red-600 rounded-full mt-1"></span>
                                )}
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                                {notification.message}
                              </p>
                              <div className="flex items-center justify-between">
                                <span className="text-xs text-gray-400">
                                  {new Date(notification.createdAt).toLocaleString('zh-CN', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                                {notification.actionUrl && (
                                  <Link
                                    to={notification.actionUrl}
                                    onClick={() => {
                                      handleMarkAsRead(notification.id);
                                      setIsOpen(false);
                                    }}
                                    className="text-xs font-medium text-red-600 hover:text-red-700"
                                  >
                                    {notification.actionText || '查看'}
                                  </Link>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))
              )}
            </div>

            {/* 底部 */}
            <div className="border-t border-gray-200 p-3">
              <Link
                to="/notifications"
                onClick={() => setIsOpen(false)}
                className="block text-center text-sm font-medium text-red-600 hover:text-red-700"
              >
                查看全部通知
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
