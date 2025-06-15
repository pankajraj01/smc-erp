# Shree Mega Creation – ERP Backend

This is the backend server for the **Shree Mega Creation ERP** system, built using **Node.js**, **Express**, and **MongoDB**.

---

## 🗂️ Project Structure

```
server/
├── src/
│   ├── config/            # App & DB config
│   ├── controllers/       # Request handling logic
│   │   ├── master/
|   |   |   ├── agent.controller.js
|   |   |   ├── item.controller.js
│   │   ├── grey/
|   |   |   ├── grey.order.controller.js
│   │   └── neft/
│   ├── models/            # Mongoose schemas
│   │   ├── master/
|   |   |   ├── agent.model.js
|   |   |   ├── item.model.js
│   │   ├── grey/
│   │   └── neft/
│   ├── routes/            # Express routers
│   │   ├── master/
│   │   ├── grey/
│   │   └── neft/
│   ├── middleware/        # Error handlers, auth, upload
│   ├── services/          # Business logic, reports, cron helpers
│   ├── utils/             # Common reusable helpers (PDF, Excel, Dates)
│   └── app.js             # Main Express app
├── scripts/               # Seeder, cron jobs, backups
├── .env                   # Environment variables
├── package.json
└── README.md
```

---

## 📦 Install Dependencies

```bash
npm install
```

---

## 🚀 Run Server (Dev Mode)

```bash
npm run dev
```

---

## 🛠️ File Naming Conventions

| File Type  | Convention                    | Example              |
| ---------- | ----------------------------- | -------------------- |
| Model      | `name.model.js`               | `item.model.js`      |
| Controller | `name.controller.js`          | `neft.controller.js` |
| Route      | `name.routes.js`              | `item.routes.js`     |
| Middleware | `name.middleware.js`          | `auth.middleware.js` |
| Utility    | `name.helper.js` / `.util.js` | `date.helper.js`     |
| Service    | `name.service.js`             | `neft.service.js`    |

---

## 🧩 Key Features

- Modular and scalable folder structure
- NEFT Manager (incoming payments tracking)
- Grey Order and Receive flow
- Master modules (Item, Agent, Party, Mill, User)
- File upload ready
- Utilities for PDF/Excel generation
- Cron Job & Seeder Support
- Ready for WhatsApp & 3rd party API integration

---

## 📅 Upcoming Features

- Authentication + Role-based Access Control (RBAC)
- WhatsApp and Email Integration
- Admin Panel
- Analytics & Reporting Dashboard

---

## 🙌 Contribution Guidelines

> Please follow structure and naming rules.  
> Keep code modular using **model/controller/service/route** separation for every feature.

---

## 📂 Route Mounting Example (in `app.js`)

```js
app.use("/master/item", itemRoutes);
app.use("/master/agent", agentRoutes);
app.use("/grey/order", greyOrderRoutes);
app.use("/neft", neftRoutes);
```

---

## 🧪 Seeder Example

Add seed scripts inside `/scripts/seed/`

```bash
node scripts/seed/item.seeder.js
```

---

## 🔁 Cron Jobs & Backups

Place automated cron jobs and DB backups in:

```
/scripts/cron/
/scripts/backup/
```

> Example: NEFT daily summary, auto DB export, etc.

---

## 📞 Contact

For team support or onboarding:

```
team@shreemegacreation.com
```

or

```
Pankaj Rajpurohit
```

---

_Built with ❤️ by Shree Mega Creation Tech Team_
