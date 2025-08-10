export default function generateUsernameFromEmail(email) {
  if (!email) {
    return "user_" + Math.floor(Math.random() * 1000);
  }

  const base = email.split("@")[0];
  const cleanBase = base.replace(/[^a-zA-Z0-9]/g, "");
  const randomNum = Math.floor(Math.random() * 1000);

  return `${cleanBase}_${randomNum}`;
}
