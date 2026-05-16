/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, Bell, Check, Trash2 } from "lucide-react";
import Link from "next/link";
import {
  useDeleteNotificationMutation,
  useGetNotificationsQuery,
  useReadNotificationMutation,
} from "@/redux/features/notification/notificationAPI";
import { RoleRedirect } from "@/components/auth/RoleRedirect";

const LEVEL_STYLES = {
  ALERT: {
    card: "bg-red-50 border border-red-100",
    icon: "border-red-200 text-red-500",
    title: "text-red-800",
    message: "text-red-600",
    time: "text-red-400",
  },
  WARNING: {
    card: "bg-amber-50 border border-amber-100",
    icon: "border-amber-200 text-amber-500",
    title: "text-amber-800",
    message: "text-amber-600",
    time: "text-amber-400",
  },
  INFO: {
    card: "bg-white border border-gray-100 hover:bg-gray-50",
    icon: "border-gray-200 text-gray-500",
    title: "text-gray-800",
    message: "text-gray-500",
    time: "text-gray-400",
  },
};

const UNREAD_STYLE = {
  card: "bg-[#677761] border border-[#677761]",
  icon: "border-white/30 text-white bg-white/10",
  title: "text-white",
  message: "text-white/80",
  time: "text-white/60",
};

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

export default function NotificationsPage() {
  const { data: notificationsData, isLoading } = useGetNotificationsQuery({});
  const notifications = notificationsData?.data || [];

  const [readNotification, { isLoading: isReading }] =
    useReadNotificationMutation();
  const [deleteNotification, { isLoading: isDeleting }] =
    useDeleteNotificationMutation();

  const handleRead = async (id: string) => {
    try {
      await readNotification(id).unwrap();
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id).unwrap();
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  return (
    <RoleRedirect allowedRole='ADMIN'>
      <DashboardLayout>
        <Card className='rounded-xl border-none shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] p-8 min-h-150'>
          {/* Header */}
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-3'>
              <Link
                href='/'
                className='p-1 hover:bg-gray-100 rounded-md transition-colors'
              >
                <ArrowLeft className='h-5 w-5 text-gray-800' />
              </Link>
              <h2 className='text-xl font-bold text-gray-900 tracking-tight'>
                Notifications
              </h2>
              {notifications.filter((n: any) => !n.is_read).length > 0 && (
                <span className='inline-flex items-center justify-center h-5 min-w-5 px-1.5 rounded-full bg-[#677761] text-white text-xs font-semibold'>
                  {notifications.filter((n: any) => !n.is_read).length}
                </span>
              )}
            </div>
          </div>

          {/* List */}
          <div className='space-y-3 max-w-4xl'>
            {isLoading ? (
              <div className='flex flex-col gap-3'>
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className='h-20 rounded-lg bg-gray-100 animate-pulse'
                  />
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className='flex flex-col items-center justify-center py-20 text-gray-400'>
                <Bell className='h-10 w-10 mb-3 opacity-30' />
                <p className='text-sm font-medium'>No notifications yet</p>
              </div>
            ) : (
              notifications.map((notification: any, index: number) => {
                const isUnread = !notification.is_read;
                const levelStyle =
                  LEVEL_STYLES[
                    notification.level as keyof typeof LEVEL_STYLES
                  ] ?? LEVEL_STYLES.INFO;
                const style = isUnread ? UNREAD_STYLE : levelStyle;

                return (
                  <React.Fragment key={notification.id}>
                    <div
                      className={`group flex items-start gap-4 p-4 rounded-lg transition-colors ${style.card}`}
                    >
                      {/* Icon */}
                      <div
                        className={`shrink-0 flex h-10 w-10 items-center justify-center rounded-full border ${style.icon}`}
                      >
                        <Bell className='h-4 w-4' />
                      </div>

                      {/* Content */}
                      <div className='flex-1 min-w-0'>
                        <div className='flex items-start justify-between gap-2'>
                          <p
                            className={`text-[15px] font-semibold leading-snug ${style.title}`}
                          >
                            {notification.title}
                          </p>
                          {isUnread && (
                            <span className='shrink-0 mt-1 h-2 w-2 rounded-full bg-white/80' />
                          )}
                        </div>
                        <p
                          className={`text-sm mt-0.5 line-clamp-2 ${style.message}`}
                        >
                          {notification.message}
                        </p>
                        <p className={`text-xs mt-1.5 ${style.time}`}>
                          {formatTime(notification.created_at)}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className='shrink-0 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                        {isUnread && (
                          <button
                            onClick={() => handleRead(notification.id)}
                            disabled={isReading}
                            title='Mark as read'
                            className={`p-1.5 rounded-md transition-colors ${
                              isUnread
                                ? "hover:bg-white/20 text-white"
                                : "hover:bg-gray-100 text-gray-500"
                            }`}
                          >
                            <Check className='h-4 w-4' />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          disabled={isDeleting}
                          title='Delete notification'
                          className={`p-1.5 rounded-md transition-colors ${
                            isUnread
                              ? "hover:bg-white/20 text-white"
                              : "hover:bg-red-50 text-red-400"
                          }`}
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </div>

                    {index < notifications.length - 1 &&
                      !isUnread &&
                      notification.is_read &&
                      notifications[index + 1]?.is_read && (
                        <hr className='border-gray-100' />
                      )}
                  </React.Fragment>
                );
              })
            )}
          </div>
        </Card>
      </DashboardLayout>
    </RoleRedirect>
  );
}
