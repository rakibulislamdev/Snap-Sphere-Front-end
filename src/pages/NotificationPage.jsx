import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import useAxios from "../hooks/useAxios";
import defaultAvatar from "../assets/defaultAvatar.png";
import getTimeDateYear from "../utils/getTimeDateYear";
import getNotificationSection from "../utils/getNotificationSection";
import { toast } from "react-toastify";

export default function NotificationPage() {
  const { api } = useAxios();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState("all");

  const { data: notifications, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get(
        `${import.meta.env.VITE_SERVER_BASE_URL}/notifications`
      );
      console.log("noti", response.data);
      return response.data;
    },
  });

  // Mark as Read Mutation
  const markAsReadMutation = useMutation({
    mutationFn: (notificationId) =>
      api.patch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/notifications/${notificationId}/read`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notification marked as read");
    },
    onError: () => {
      toast.error("Failed to mark notification as read");
    },
  });

  // Mark as Unread Mutation
  const markAsUnreadMutation = useMutation({
    mutationFn: (notificationId) =>
      api.patch(
        `${
          import.meta.env.VITE_SERVER_BASE_URL
        }/notifications/${notificationId}/unread`
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("Notification marked as unread");
    },
    onError: () => {
      toast.error("Failed to mark notification as unread");
    },
  });

  // Clear All Notifications Mutation
  const clearAllNotificationsMutation = useMutation({
    mutationFn: () =>
      api.delete(`${import.meta.env.VITE_SERVER_BASE_URL}/notifications/clear`),
    onSuccess: () => {
      queryClient.invalidateQueries(["notifications"]);
      toast.success("All notifications cleared");
    },
    onError: () => {
      toast.error("Failed to clear notifications");
    },
  });

  // Filter notifications
  const filteredNotifications = notifications?.filter((notification) => {
    if (activeFilter === "all") return true;
    return activeFilter === "unread"
      ? !notification.isRead
      : notification.isRead;
  });

  // Group notifications
  const groupedNotifications = filteredNotifications?.reduce(
    (acc, notification) => {
      const section = getNotificationSection(notification.createdAt);
      if (!section) return acc;
      if (!acc[section]) acc[section] = [];
      acc[section].push(notification);
      return acc;
    },
    {}
  );

  return (
    <div className="notifications-container max-w-2xl mx-auto">
      <header className="sticky top-0 bg-white z-10 border-b">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-semibold">Notifications</h1>
          {notifications?.length > 0 && (
            <button
              onClick={() => clearAllNotificationsMutation.mutate()}
              className="text-sm text-red-500 hover:text-red-700"
            >
              Clear All
            </button>
          )}
        </div>

        <div className="flex justify-start space-x-4 px-4 pb-2">
          {["all", "unread", "read"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`
                capitalize px-3 py-1 rounded-full text-sm 
                ${
                  activeFilter === filter
                    ? "bg-blue-500 text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }
              `}
            >
              {filter}
            </button>
          ))}
        </div>
      </header>

      {isLoading && (
        <div className="text-center py-10 text-gray-500">
          Loading notifications...
        </div>
      )}

      {!isLoading && notifications?.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No notifications found
        </div>
      )}

      {Object.entries(groupedNotifications || {}).map(
        ([section, sectionNotifications]) => (
          <div key={section}>
            <div className="px-4 py-3 bg-gray-50 text-gray-600 font-semibold">
              {section}
            </div>
            {sectionNotifications.map((notification) => (
              <Link
                key={notification._id}
                to={`/posts/${notification?.postId}`}
                className={`
                block 
                ${
                  notification.isRead
                    ? "bg-white hover:bg-gray-50"
                    : "bg-blue-50 hover:bg-blue-100"
                }
              `}
                onClick={() => markAsReadMutation.mutate(notification._id)}
              >
                <div className="flex items-center p-4 border-b">
                  <img
                    src={
                      notification?.fromUser?.avatar
                        ? `${notification.fromUser.avatar}`
                        : defaultAvatar
                    }
                    alt={notification?.fromUser?.name}
                    className="w-12 h-12 rounded-full mr-4 object-cover"
                  />

                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-semibold">
                        {notification?.fromUser?.name}
                      </span>{" "}
                      {notification.type === "like"
                        ? "liked your photo"
                        : "commented on your photo"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {getTimeDateYear(notification.createdAt)}
                    </p>
                  </div>

                  {notification.isRead && (
                    <button
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        markAsUnreadMutation.mutate(notification._id);
                      }}
                      className="text-xs text-blue-600 hover:underline mr-4"
                    >
                      Mark as Unread
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )
      )}
    </div>
  );
}
