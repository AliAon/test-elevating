# ES Pulse - Testing Quick Start Guide

## 🚀 Quick Setup (5 Minutes)

### 1. Get Test Credentials
Request from System Administrator:
- ES Client account (Client or Manager)
- ES Admin account (Super Admin or Admin)

### 2. Access Test Environment
**URL**: https://staging.es-pulse.com

### 3. Prepare Tools
- ✅ Chrome/Firefox/Edge browser (latest)
- ✅ Screenshot tool
- ✅ Bug tracking access
- ✅ Test execution spreadsheet

---

## 📋 Critical Test Paths (Must Test)

### Path 1: Admin Client Onboarding (30 min)
```
Login as Admin → Create Client → Add Building → Add Equipment → Create Contract → Create Client User
```

### Path 2: Client Dashboard View (15 min)
```
Login as Client User → View Dashboard → View Contracts → View Equipment → View Callbacks
```

### Path 3: ES Plus Setup (20 min)
```
Login as Admin → Create ES Subscription → Add ES Client User → Login as ES Client (Client or Manager) → Verify Access
```

### Path 4: Maintenance & KPI Flow (25 min)
```
Login as Client → View Maintenance → View KPIs → View Response Times → Check Penalties
```

---

## 🎯 Test Priority Levels

### P0 - CRITICAL (Must Pass Before Release)
- [ ] Login/Authentication (all user types)
- [ ] Admin: Create Client
- [ ] Admin: Create Building & Equipment
- [ ] Admin: Create Service Contract
- [ ] Client: View Dashboard
- [ ] Client: View Equipment List
- [ ] Data isolation (Client A cannot see Client B data)

### P1 - HIGH (Should Pass)
- [ ] Admin: Update Client/Building/Equipment
- [ ] Admin: Create ES Plus Subscription
- [ ] Admin: User Management
- [ ] Client: View Contract Details
- [ ] Client: View Callbacks
- [ ] Client: View Maintenance
- [ ] Client: View KPIs
- [ ] Response Times tracking

### P2 - MEDIUM (Nice to Have)
- [ ] Capital Budget Management
- [ ] Downloads/Reports
- [ ] Profile Management
- [ ] Search & Filters
- [ ] Logs & Audit Trail

### P3 - LOW (Future)
- [ ] Advanced Reporting
- [ ] Bulk Operations
- [ ] Custom Dashboards

---

## 🔍 Common Test Scenarios

### Scenario 1: Happy Path - Full Client Setup
**Time**: 45 minutes  
**User**: Admin

1. Create client "Happy Path Corp"
2. Add building "HP Tower"
3. Add 3 equipment items (2 elevators, 1 escalator)
4. Create service contract
5. Link equipment to contract
6. Create client user
7. Verify client user can see all data

**Expected**: All steps succeed, data visible to client user

---

### Scenario 2: Negative Testing - Invalid Data
**Time**: 20 minutes  
**User**: Admin

1. Try to create client with existing email → **Should fail**
2. Try to create equipment without building → **Should fail**
3. Try to create contract with past end date → **Should warn**
4. Try to create user with invalid email format → **Should fail**

**Expected**: All validations work, clear error messages

---

### Scenario 3: Permission Testing
**Time**: 15 minutes  
**Users**: Client User A, Client User B

1. Login as Client User A
2. Note Client A's equipment IDs
3. Logout and login as Client User B
4. Try to access Client A's equipment by URL manipulation
5. Search for Client A's equipment

**Expected**: Client B cannot see Client A's data

---

## 🐛 Bug Reporting Quick Template

**Title**: [Module] Brief description

**Steps**:
1. Action 1
2. Action 2
3. What happened (wrong)

**Expected**: What should happen

**Priority**: Critical/High/Medium/Low

**Screenshot**: [Attach]

---

## 📊 Daily Testing Checklist

### Morning Setup
- [ ] Verify test environment is accessible
- [ ] Check test credentials work
- [ ] Review assigned test cases
- [ ] Set up bug tracking

### During Testing
- [ ] Execute test cases sequentially
- [ ] Log bugs immediately with screenshots
- [ ] Mark test status (Pass/Fail/Blocked)
- [ ] Note any workarounds

### End of Day
- [ ] Update test execution tracker
- [ ] Summarize bugs found
- [ ] Report blockers to team
- [ ] Clean up test data (if needed)

---

## 🆘 Troubleshooting

### Issue: Cannot Login
- ✅ Check credentials are correct
- ✅ Clear browser cache/cookies
- ✅ Try incognito/private mode
- ✅ Check environment URL is correct
- ✅ Contact admin for password reset

### Issue: Page Not Loading
- ✅ Check internet connection
- ✅ Clear browser cache
- ✅ Try different browser
- ✅ Check browser console for errors (F12)
- ✅ Report to development team

### Issue: Data Not Appearing
- ✅ Refresh page
- ✅ Check filters are not applied
- ✅ Verify you have permission to view data
- ✅ Check if data exists (ask admin)
- ✅ Log as bug if confirmed

### Issue: Form Won't Submit
- ✅ Check all required fields filled
- ✅ Check for validation errors (red text)
- ✅ Check browser console for JavaScript errors
- ✅ Try different browser
- ✅ Log as bug with console errors

---

## 🎓 User Roles Quick Reference

| Role | Can Do | Cannot Do |
|------|--------|-----------|
| **ES Admin (Super Admin, Admin)** | Manage ES subscriptions and ES client accounts (mapped to `Super Admin`, `Admin`) | Not a full system admin; cannot create Admin or Super Admin users |
| **ES Client (Client, Manager)** | View ES Plus subscription data and reports (mapped to `Client`, `Manager`) | Limited to assigned subscription/levels |

---

## 📁 Test Data Naming Convention

Use consistent naming for easy identification and cleanup:

- **Clients**: `TEST-[YourInitials]-[Purpose]` (e.g., `TEST-JD-ClientOnboarding`)
- **Buildings**: `TEST-BLD-[Description]` (e.g., `TEST-BLD-OfficeTower`)
- **Equipment**: `TEST-EQ-[Type]-[Number]` (e.g., `TEST-EQ-ELV-001`)
- **Contracts**: `TEST-CTR-[Date]` (e.g., `TEST-CTR-20260203`)
- **Users**: `test.[yourname]@example.com` (e.g., `test.john@example.com`)

This makes cleanup easier!

---

## ⚡ Speed Testing Tips

### Test Faster
1. **Use browser bookmarks** for frequently tested pages
2. **Keep credentials in secure note** for quick copy-paste
3. **Use browser autofill** for repetitive form data
4. **Take screenshots as you go** (don't wait until end)
5. **Use multiple browser tabs** for parallel checking

### Test Smarter
1. **Group similar tests** (all login tests together)
2. **Start with smoke tests** (basic functionality)
3. **Focus on P0/P1** tests first
4. **Retest fixed bugs** immediately
5. **Note patterns** in bugs (helps find more)

---

## 📞 Contacts

| Role | Contact | Purpose |
|------|---------|---------|
| QA Lead | [Name/Email] | Test strategy, sign-off |
| Dev Lead | [Name/Email] | Technical questions, bug clarifications |
| Product Owner | [Name/Email] | Requirements, feature clarifications |
| System Admin | [Name/Email] | Test credentials, environment access |

---

## 📅 Testing Schedule Template

### Week 1: Admin Side
- Day 1: Authentication, Client Management
- Day 2: Building & Equipment Management
- Day 3: Contract Management
- Day 4: ES Plus Management
- Day 5: User Management, Dashboards

### Week 2: Client Side
- Day 1: Client Authentication, Dashboard
- Day 2: Contracts, Equipment
- Day 3: Maintenance, Callbacks
- Day 4: Response Times, KPIs
- Day 5: Capital Budget, Downloads

### Week 3: Cross-Functional & Final
- Day 1-2: End-to-End Workflows
- Day 3: Permission & Security Testing
- Day 4: Regression Testing (retest fixed bugs)
- Day 5: Final smoke test, sign-off preparation

---

## ✅ Test Completion Criteria

### Ready to Sign-Off When:
- [ ] All P0 tests passed
- [ ] All P1 tests passed or bugs logged
- [ ] No critical/blocker bugs open
- [ ] Regression testing completed
- [ ] Test execution > 95%
- [ ] All bugs documented with repro steps
- [ ] Test summary report completed
- [ ] Stakeholders reviewed results

---

## 🎉 Testing Best Practices

### DO
✅ Test in order (create data before testing views)  
✅ Document everything (screenshots, steps, errors)  
✅ Test positive AND negative scenarios  
✅ Verify error messages are helpful  
✅ Check data persistence (refresh page, re-login)  
✅ Test on different browsers  
✅ Clean up test data regularly  
✅ Communicate blockers immediately  

### DON'T
❌ Skip test steps or assumptions  
❌ Test without proper test data  
❌ Use production credentials on test environment  
❌ Ignore minor UI issues (they add up)  
❌ Test only the happy path  
❌ Leave bugs unreported  
❌ Test without clearing cache  
❌ Rush through tests  

---

**For detailed test cases, see**: [TESTING_MANUAL.md](TESTING_MANUAL.md)

**Last Updated**: February 3, 2026
