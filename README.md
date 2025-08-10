# 📸 Photo Booth - React Social Media Platform

**Photo Booth** একটি সম্পূর্ণ ফিচারযুক্ত সোশ্যাল মিডিয়া অ্যাপ্লিকেশন, যা **React.js** দিয়ে তৈরি করা হয়েছে।

## 🔗 Live Site

👉 [Visit Live Site](https://photo-booth-three-omega.vercel.app/)

## All APIs used in this project are pre-built and documented:

👉 [Photo Booth API Documentation](https://documenter.getpostman.com/view/9649334/2sB2x5FsPY)

---

## 📦 Technologies Used

- **React.js** (with Vite)
- **Tailwind CSS**
- **React Router DOM**
- **TanStack Query**
- **JWT Authentication**
- **RESTful APIs**
- **Postman API Documentation**
- **Vercel Deployment**

---

## 🚀 Features Implemented

### 🔐 Authentication

- Login & Register pages fully converted to React.
- JWT-based login system.
- Protected routes based on authentication.
- Authenticated users redirected to Edit Profile after registration.

### 🏠 Home Page

- Posts shown using infinite scroll (10 per page).
- If unauthenticated user scrolls to the end, a custom Login/Register Popup appears.
- Posts include: image, caption, like count, comment count, posted time.
- Long captions are truncated with **Show More/Show Less** toggle.

### ❤️ Post Interactions

- Authenticated users can **like**, **comment**, and **share** posts.
- Clicking Share copies the direct post link to clipboard.
- Like list shows users who reacted (custom UI created).
- Clicking “View all X comments” opens full post details.

### 📝 Post Details

- Full post + all comments view.
- Authenticated users can **add**, **edit**, or **delete** their comments.
- "More from this user" section shows more posts from the same creator.

### 👤 Profile & Edit Profile

- View any user’s public profile with bio, avatar, and posts.
- If current user views their own profile, **Edit Profile** button is shown.
- Edit Profile includes:
  - Avatar upload
  - Website, Bio, Gender update
  - Change Password with **password strength meter** (Red → Orange → Yellow → Green)

### 🔔 Notification Page

- Like & Comment notifications shown in a chronological order.
- Clicking a notification redirects to the related post.

### ➕ Create Post Page

- Authenticated users can upload a new post with image + caption.
- Validation ensures image and caption are required.
- Success/Error feedback dialogs implemented using provided components.

### 📱 Side Navigation

- Common component used across all pages (except login & register).
- Links: Home, Notification, Create, Profile
- Active page highlighted.
