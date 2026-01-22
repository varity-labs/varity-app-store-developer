# Varity App Store - Developer Portal

**Live Site**: https://developer.store.varity.so  
**Purpose**: Developer portal for app submissions, dashboard, and admin controls  
**Target Audience**: Developers submitting apps + Varity admin team

---

## 🎯 Purpose

This portal enables developers to:
- ✅ Submit applications to Varity App Store
- ✅ Manage submitted apps (view status, edit, deactivate)
- ✅ Track approval status
- ✅ (Admin) Approve/reject app submissions

**User Portal** (browse apps):  
👉 https://store.varity.so

---

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Run development server
npm run dev
# Visit http://localhost:3000

# Build for production
npm run build
```

---

## 📋 Features

### Current (MVP)
- ✅ Developer landing page
- ✅ App submission form (Web3Forms + smart contract)
- ✅ Developer dashboard
- ✅ Admin panel
- ✅ Privy authentication (email, Google, GitHub, wallet)

### Planned (Post-MVP)
- 🔲 GitHub Connect auto-fill
- 🔲 App analytics dashboard
- 🔲 Revenue tracking
- 🔲 Custom domains for apps

---

## 🌐 Deployment

### 4everland Configuration

```
Repository: varity-labs/varity-app-store-developer
Root Directory: /
Build Command: (auto-detected Next.js)
Output Directory: out
Domain: developer.store.varity.so
```

### Environment Variables

```bash
NEXT_PUBLIC_CONTRACT_ADDRESS=0x3faa42a8639fcb076160d553e8d6e05add7d97a5
NEXT_PUBLIC_CHAIN_ID=33529
NEXT_PUBLIC_PRIVY_APP_ID=cm6f5z5og0g91t0pbulwvf5o2
NEXT_PUBLIC_THIRDWEB_CLIENT_ID=6e3f891a9c88e09a5d02eb71b7cd2cc9
WEB3FORMS_ACCESS_KEY=322fcdfe-779a-4cab-a76a-11285466709c
```

---

## 🔗 Related

- **User Portal**: https://github.com/varity-labs/varity-app-store
- **Varity SDK**: https://github.com/varity-labs/varity-sdk
- **Smart Contract**: 0x3faa42a8639fcb076160d553e8d6e05add7d97a5 (Varity L3)

---

**Built with ❤️ by the Varity team**
