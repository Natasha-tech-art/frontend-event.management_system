# EventHub — Event Management & Ticketing Platform 

A full-stack event management and ticketing platform built for the Kenyan market, supporting event creation, ticket booking, M-Pesa payments, QR-code check-in, and role-based dashboards for attendees, organizers, staff, and admins.

## A screenshot of the Home Page
![Home page](image.png)

---

## Features

-  JWT authentication with 4 user roles: **attendee**, **organizer**, **staff**, **admin**
-  Full event CRUD (create, edit, cancel, delete) with an admin approval workflow
-  Ticket booking with capacity tracking and QR-code generation
-  M-Pesa STK Push integration (Safaricom Daraja API) for real payments
-  Cloudinary-hosted images for event banners
-  Organizer and admin analytics dashboards (revenue, bookings, monthly trends)
-  Staff check-in flow via QR code scanning
-  Real-time notifications via Django Channels (WebSockets)
-  Fully responsive React frontend styled with Tailwind CSS

---

##  Tech Stack

**Backend**
- Django 6 + Django REST Framework
- PostgreSQL (via `dj-database-url`)
- JWT auth (`djangorestframework-simplejwt`)
- Django Channels (WebSockets, Redis-backed)
- Cloudinary (media storage)
- Safaricom Daraja API (M-Pesa)
- Deployed on **Render**

**Frontend**
- React 19 + Vite
- React Router
- Axios
- Tailwind CSS
- Recharts (analytics charts)
- `qrcode.react` (ticket QR display)
- Deployed on **Vercel**

---


##  Local Setup

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL running locally (or a hosted Postgres URL)

### Backend

```bash
cd event-management-platform
python -m venv venv
source venv/bin/activate       # Windows: venv\Scripts\activate

pip install -r requirements.txt

# Create your .env file (see Environment Variables below)

python manage.py makemigrations
python manage.py migrate
python manage.py runserver
```


### Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## 🚀 Deployment Notes

- **Backend (Render):** auto-deploys from `main`. Build command runs `pip install -r requirements.txt`, `collectstatic`, and `migrate`.
- **Frontend (Vercel):** auto-deploys from `main`. Requires `vercel.json` at the frontend root with a SPA rewrite rule, or refreshing any non-root route (e.g. `/organizer/dashboard`) will 404.
- **Media storage:** all image uploads (event banners, profile photos, ticket QR codes) go through Cloudinary via `CloudinaryField` — Render's disk is ephemeral, so local storage would lose files on every redeploy.

---

##  User Roles & Permissions

| Role | Capabilities |
|---|---|
| **Attendee** | Browse events, book tickets, pay via M-Pesa, view/download tickets |
| **Organizer** | Create and edit events, view own analytics, view bookings for own events |
| **Staff** | Scan/check in attendee QR codes at the door |
| **Admin** | Approve pending events and manage users |

New events are created in `draft` status and require **admin approval** before appearing publicly — organizers can no longer self-publish.

---

### PROJECT CREATED BY:
   Natasha Bolyn
