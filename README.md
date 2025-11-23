# Blog App

A modern, feature-rich frontend-only blogging platform built with React and Redux.  
Create, edit, and manage your blog posts with a beautiful and intuitive user interface.

---

## Features

### User Authentication

- **Demo Login:** Login works only with the demo credentials:
  - Email: `naresh@gmail.com`
  - Password: `kathamandu123`
- **Mock JWT Token:** A fake token is generated and stored in `localStorage`.
- **Registration (Demo Only):**
  - After successful registration, the user is automatically redirected to the Dashboard.

### Blog Management

- **Create Posts:** Write and publish new blog posts with rich text editing.
- **Edit Posts:** Update existing posts with real-time content editing.
- **Delete Posts:** Remove posts from your blog.
- **View Posts:** Browse all published posts in a paginated dashboard.

### Content Editing

- **CKEditor Integration:** Rich text editor with formatting options.

### Search

- **Post Search:** Search blog posts by title and content in real-time.

### UI/UX

- **Dark Mode:** Toggle between light and dark themes.
- **Responsive Design:** Mobile-friendly layout with Tailwind CSS.
- **Toast Notifications:** Real-time feedback with `react-hot-toast` (in login form).
- **Error Handling:** User-friendly error messages.

### Form Validation

- **Yup Schema Validation:** Server-side ready validation schemas.
- **Field-Level Validation:** Real-time validation as users type.

### Public Pages

- **Home (`/`)**: Landing page for unauthenticated users.
- **Login (`/login`)**: User login page with email/password form.
- **Register (`/register`)**: New user registration page.

### Private Pages (Authenticated Only)

- **Dashboard (`/dashboard`)**: Main dashboard showing all blog posts.

### API

- **JSONPlaceholder:** Mock API for development and testing.

---

##  How to Run

### Prerequisites

- Node.js (v14 or higher)
- npm package manager

### Installation Steps

1. **Clone the repository:**

```bash
git clone https://github.com/shahiNaresh11/Blog-app.git
cd blog-app
install dependencies : npm install
run : npm run dev

use credentails
Email: naresh@gmail.com
Password: kathamandu123
```
