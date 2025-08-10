export default function formatPostDate(isoDateString) {
  const postDate = new Date(isoDateString);

  const options = {
    timeZone: "Asia/Dhaka",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };

  return postDate.toLocaleString("en-US", options);
}
