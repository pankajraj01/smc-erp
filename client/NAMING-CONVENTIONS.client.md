# 🎨 Shree Mega ERP – Frontend (React) Naming Conventions Guide

Use this guide to name your files, folders, variables, and components in the React frontend project.

---

## 🧾 GENERAL RULES

| Type             | Naming Style            | Example                           |
| ---------------- | ----------------------- | --------------------------------- |
| Component Files  | `PascalCase`            | `ProductCard.jsx`, `HomePage.jsx` |
| Functional Hooks | `camelCase`             | `useFetchData.js`                 |
| Utilities        | `kebab-case`            | `date-helper.js`                  |
| Folders          | `kebab-case`            | `product-list/`, `user-profile/`  |
| CSS Modules      | `PascalCase.module.css` | `ProductCard.module.css`          |

---

## 📦 COMPONENT FOLDER STRUCTURE

```
src/
├── components/
│   ├── product-card/
│   │   ├── ProductCard.jsx
│   │   ├── ProductCard.module.css
│
├── hooks/
│   └── useFetchData.js
│
├── utils/
│   └── date-helper.js
```

---

## 🚫 DON’Ts

- ❌ Don't use spaces in names: `Product Card.jsx`
- ❌ Don't mix naming styles: `product_card.jsx`, `Product_card.jsx`
- ❌ Don't use plural folders unless necessary: `components/` is okay, but `products-cards/` is not

---

## ✅ TIPS

- Use `PascalCase` for UI components
- Use `camelCase` for all variables and functions
- Keep reusable logic in `hooks/` and `utils/`

---

### ✅ Follow this for a scalable, clean, and fast React workflow!
