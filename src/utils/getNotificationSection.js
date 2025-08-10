export default function getNotificationSection(dateString) {
  const createdAt = new Date(dateString);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const startOfWeek = new Date(today);
  startOfWeek.setDate(today.getDate() - today.getDay());

  if (createdAt >= today) return "Today";
  if (createdAt >= yesterday) return "Yesterday";
  if (createdAt >= startOfWeek) return "This Week";

  return null;
}
