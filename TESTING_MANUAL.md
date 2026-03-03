# ES Pulse - Manual Testing Guide

**Version:** 1.0  
**Last Updated:** February 3, 2026  
**Document Owner:** QA Team  
**Test Environment:** https://staging.es-pulse.com

---

## Table of Contents

1. [Overview](#1-overview)
2. [Test Environment Setup](#2-test-environment-setup)
3. [User Roles & Access](#3-user-roles--access)
4. [Test Data Prerequisites](#4-test-data-prerequisites)
5. [Admin Side Testing](#5-admin-side-testing)
6. [Client Side Testing](#6-client-side-testing)
7. [Cross-Functional Testing](#7-cross-functional-testing)
8. [Test Data Cleanup](#8-test-data-cleanup)
9. [Known Issues & Workarounds](#9-known-issues--workarounds)
10. [Sign-Off](#10-sign-off)

---

## 1. Overview

### 1.1 System Purpose
ES Pulse is a dual-sided application for managing elevator/escalator maintenance contracts, equipment, and service operations:
- **Admin Side**: Full system management, onboarding clients, creating contracts, managing equipment, and monitoring operations
- **Client Side**: View dashboards, track equipment performance, monitor KPIs, manage callbacks, and review maintenance schedules

### 1.2 Scope of Testing
This manual covers end-to-end functional testing for:
- User authentication and authorization
- Client and contract management (Admin)
- Equipment and building management
- Service contracts and ES Plus subscriptions
- Maintenance tracking
- Callbacks and response times
- KPI monitoring and penalties
- Capital budget planning
- Reporting and downloads

### 1.3 Testing Approach
- **Manual Testing**: Human testers will execute step-by-step test cases
- **Exploratory Testing**: Encouraged for edge cases
- **Regression Testing**: Verify existing functionality after changes

---

## 2. Test Environment Setup

### 2.1 Environment Details
- **URL**: https://staging.es-pulse.com
- **Supported Browsers**: Chrome (latest), Firefox (latest), Edge (latest), Safari (latest)
- **Supported Devices**: Desktop (primary), Tablet, Mobile (responsive)

### 2.2 Prerequisites
- [ ] Valid test user accounts (see section 3)
- [ ] Access to test environment
- [ ] Browser dev tools enabled (for debugging)
- [ ] Screen recording software (optional, for bug reports)
- [ ] Test data spreadsheet (attached separately)

### 2.3 Tools Needed
- Web browser with dev tools
- Screenshot/screen recording tool
- Bug tracking system access
- Test execution tracking sheet (Excel/Jira)

---

## 3. User Roles & Access

### 3.1 User Types

| Role | Description | Primary Access | Notes |
|------|-------------|----------------|-------|
| **ES Client (Client, Manager)** | ES subscription consumer (mapped roles: `Client`, `Manager`) | View ES Plus subscription data and related reports within client portal | Access constrained to assigned subscriptions and levels |
| **ES Admin (Super Admin, Admin)** | ES subscription administrator (mapped roles: `Super Admin`, `Admin`) | Manage ES client accounts and subscription-level configuration | Elevated ES-specific privileges for subscription management |

### 3.2 Test Credentials Template

```
SUPER ADMIN:
- Email: [To be provided]
- Password: [To be provided]

ADMIN:
- Email: [To be provided]
- Password: [To be provided]

CLIENT:
- Email: [To be provided]
- Password: [To be provided]

MANAGER:
- Email: [To be provided]
- Password: [To be provided]

<!-- Note: ES role groups map to actual user types -->
Note: `ES Client` role group maps to user types: `Client`, `Manager`.
Note: `ES Admin` role group maps to user types: `Super Admin`, `Admin`.
```

**Note**: Request credentials from the System Administrator before testing begins. Ensure each test account includes explicit assignment of ES Subscriptions, Level 1/Level 2 and Building access where applicable so permission tests are accurate.

---

## 4. Test Data Prerequisites

### 4.1 Data Hierarchy
Understanding the data relationships is critical:

```
Client
  └── Buildings
       └── Groups (optional)
            └── Equipment
  └── Service Contracts
       └── Linked Equipment
  └── ES Plus Subscriptions
       └── Level 1 & Level 2 Config
  └── Users (Client Users)
```

### 4.2 Required Master Data

Before testing, ensure the following master data exists:

#### 4.2.1 Brands/Products (Admin)
- **Purpose**: Service provider brands (e.g., KONE, Otis, Schindler)
- **Required Fields**: Brand name, contact details
- **Test Data Needed**: At least 2-3 brands

#### 4.2.2 Equipment Types
- Elevator
- Escalator
- Moving Walk
- Platform
- Dumb Waiter

#### 4.2.3 Contract Types
- Type 1, Type 2, Type 3 (as per business rules)

---

## 5. Admin Side Testing

### 5.1 Authentication & Authorization

#### Test Case ADM-AUTH-001: Super Admin Login
**Objective**: Verify super admin can log in successfully

**Preconditions**: 
- Super admin account exists in the system
- User is logged out

**Test Steps**:
1. Navigate to login page: `https://[BASE_URL]/`
2. Enter valid super admin email
3. Enter valid password
4. Click "Login" button

**Expected Result**:
- Login successful
- Redirected to `/admin/dashboard`
- Super Admin dashboard displays
- Navigation sidebar shows all admin menu items
- Success toast message: "Login successful"

**Post-conditions**: User session is active

**Test Data**:
- Email: `superadmin@test.com` (or as provided)
- Password: `[As provided]`

---

#### Test Case ADM-AUTH-002: Admin Login
**Objective**: Verify admin user can log in successfully

**Preconditions**: 
- Admin account exists
- User is logged out

**Test Steps**:
1. Navigate to login page
2. Enter valid admin email
3. Enter valid password
4. Click "Login" button

**Expected Result**:
- Login successful
- Redirected to `/admin/dashboard`
- Admin dashboard displays
- Navigation sidebar shows admin menu items (excluding super admin features)
- Success toast: "Login successful"

**Test Data**:
- Email: `admin@test.com`
- Password: `[As provided]`

---

#### Test Case ADM-AUTH-003: Invalid Login Attempt
**Objective**: Verify system handles invalid credentials correctly

**Preconditions**: User is logged out

**Test Steps**:
1. Navigate to login page
2. Enter invalid email: `invalid@test.com`
3. Enter invalid password: `wrongpassword`
4. Click "Login" button

**Expected Result**:
- Login fails
- Error toast message: "Login failed" or specific error
- User remains on login page
- No redirect occurs

---

#### Test Case ADM-AUTH-004: Empty Field Validation
**Objective**: Verify required field validation on login

**Test Steps**:
1. Navigate to login page
2. Leave email field empty
3. Leave password field empty
4. Click "Login" button

**Expected Result**:
- Error toast: "Please enter both email and password"
- Form does not submit
- User remains on login page

---

#### Test Case ADM-AUTH-005: Remember Me Functionality
**Objective**: Verify "Remember Me" checkbox persists credentials

**Test Steps**:
1. Navigate to login page
2. Enter valid credentials
3. Check "Remember Me" checkbox
4. Click "Login"
5. After successful login, log out
6. Return to login page

**Expected Result**:
- After logout, email and password fields are pre-filled
- Remember Me checkbox is checked
- User can login without re-entering credentials

---

#### Test Case ADM-AUTH-006: Forgot Password Flow
**Objective**: Verify password reset functionality

**Test Steps**:
1. Navigate to login page
2. Click "Forgot Password" link
3. Enter registered email address
4. Click "Send OTP" button
5. Check email for OTP code
6. Enter valid OTP on verification page
7. Enter new password
8. Confirm new password
9. Submit form

**Expected Result**:
- OTP sent successfully (toast message)
- Email received with OTP code
- OTP verification succeeds
- Password reset successful
- User redirected to login page
- Can login with new password

---

### 5.2 Client Management

#### Test Case ADM-CLIENT-001: View All Clients
**Objective**: Verify admin can view client list

**Preconditions**: 
- Admin is logged in
- At least one client exists in the system

**Test Steps**:
1. From admin dashboard, click "Clients" in sidebar
2. Review the clients list page

**Expected Result**:
- Redirected to `/admin/clients`
- Client list displays in table/card format
- Each client shows: Name, contact info, status
- Search bar is visible
- "Add Client" button is visible
- Pagination controls appear (if > 10 clients)

---

#### Test Case ADM-CLIENT-002: Add New Client (Onboarding)
**Objective**: Verify admin can create a new client through onboarding flow

**Preconditions**: 
- Admin is logged in
- No client with test email exists

**Test Steps**:
1. Navigate to `/admin/clients`
2. Click "Add Client" or "Onboarding Client" button
3. Fill in Client Information:
   - Client Name: `Test Client ABC`
   - Contact Person: `John Smith`
   - Email: `testclient@example.com`
   - Country Code: `+61`
   - Phone: `412345678`
   - Address: `123 Test Street, Sydney NSW 2000`
4. Click "Next" or "Save"

**Expected Result**:
- Form submits successfully
- Success toast: "Client created successfully" or similar
- New client appears in clients list
- Client ID is generated
- Can proceed to add buildings/contracts

**Test Data**:
```json
{
  "client_name": "Test Client ABC",
  "contact_person": "John Smith",
  "email": "testclient@example.com",
  "country_code": "+61",
  "phone": "412345678",
  "address": "123 Test Street, Sydney NSW 2000"
}
```

---

#### Test Case ADM-CLIENT-003: Update Existing Client
**Objective**: Verify admin can update client details

**Preconditions**: 
- Admin is logged in
- Test client "Test Client ABC" exists

**Test Steps**:
1. Navigate to `/admin/clients`
2. Find "Test Client ABC" in the list
3. Click "Edit" or client name to view details
4. Navigate to `/admin/add-update-client` page
5. Update fields:
   - Contact Person: `Jane Doe` (changed)
   - Phone: `498765432` (changed)
6. Click "Save" or "Update"

**Expected Result**:
- Form submits successfully
- Success toast: "Client updated successfully"
- Changes reflected in client list
- Client details page shows updated information

---

#### Test Case ADM-CLIENT-004: Search Clients
**Objective**: Verify client search functionality

**Preconditions**: 
- Admin is logged in
- Multiple clients exist

**Test Steps**:
1. Navigate to `/admin/clients`
2. Enter search term in search bar: `Test Client`
3. Press Enter or click search icon

**Expected Result**:
- Client list filters to show matching results
- "Test Client ABC" appears in results
- Non-matching clients are hidden
- Clear/reset button appears

---

#### Test Case ADM-CLIENT-005: View Client Contracts
**Objective**: Verify admin can view all contracts for a specific client

**Preconditions**: 
- Admin is logged in
- Client with contracts exists

**Test Steps**:
1. Navigate to `/admin/clients`
2. Click on a client name
3. Navigate to "Contracts" tab or click "View Contracts"
4. Review displayed contracts

**Expected Result**:
- Redirected to `/admin/clients-contracts` with client filter
- All contracts for selected client are displayed
- Contract details shown: Contract number, type, dates, price
- Can click contract to view full details

---

### 5.3 Building Management

#### Test Case ADM-BLDG-001: Add Building to Client
**Objective**: Verify admin can add a building under a client

**Preconditions**: 
- Admin is logged in
- Client "Test Client ABC" exists

**Test Steps**:
1. Navigate to `/admin/buildings`
2. Click "Add Building" button
3. Fill in building information:
   - Select Client: `Test Client ABC`
   - Building Name: `Head Office Tower`
   - Address: `456 Business Ave, Sydney NSW 2000`
   - Number of Floors: `25`
   - Building Type: `Commercial`
4. Click "Save" or "Create"

**Expected Result**:
- Form submits successfully
- Success toast: "Building created successfully"
- Building appears in buildings list
- Building ID is generated
- Building is linked to selected client

**Test Data**:
```json
{
  "client_id": "[Test Client ABC ID]",
  "building_name": "Head Office Tower",
  "address": "456 Business Ave, Sydney NSW 2000",
  "number_of_floors": 25,
  "building_type": "Commercial"
}
```

---

#### Test Case ADM-BLDG-002: View All Buildings
**Objective**: Verify admin can view all buildings across clients

**Preconditions**: 
- Admin is logged in
- At least one building exists

**Test Steps**:
1. From admin dashboard, click "Buildings" in sidebar
2. Review buildings list

**Expected Result**:
- Redirected to `/admin/buildings`
- Buildings list displays with: Building name, client name, address, equipment count
- Search and filter options available
- "Add Building" button visible

---

#### Test Case ADM-BLDG-003: Update Building Details
**Objective**: Verify admin can update building information

**Preconditions**: 
- Admin is logged in
- Building "Head Office Tower" exists

**Test Steps**:
1. Navigate to `/admin/buildings`
2. Find "Head Office Tower"
3. Click "Edit" button
4. Update:
   - Number of Floors: `30` (changed from 25)
5. Click "Save"

**Expected Result**:
- Update successful
- Success toast displayed
- Building list reflects updated floor count

---

### 5.4 Equipment Management

#### Test Case ADM-EQUIP-001: Add Equipment to Building
**Objective**: Verify admin can add equipment under a building

**Preconditions**: 
- Admin is logged in
- Building "Head Office Tower" exists
- At least one brand/product exists

**Test Steps**:
1. Navigate to `/admin/equipments` or `/add-equipment`
2. Click "Add Equipment" button
3. Fill in equipment details:
   - Select Client: `Test Client ABC`
   - Select Building: `Head Office Tower`
   - Equipment Type: `Elevator`
   - Equipment ID/Number: `ELV-001`
   - Manufacturer/Brand: `KONE`
   - Model: `MonoSpace 500`
   - Installation Year: `2020`
   - Capacity: `1000 kg`
   - Floors Served: `G, 1-25`
4. Click "Save" or "Create"

**Expected Result**:
- Form submits successfully
- Success toast: "Equipment added successfully"
- Equipment appears in equipment list
- Equipment ID is generated
- Equipment is linked to building and client

**Test Data**:
```json
{
  "client_id": "[Test Client ABC ID]",
  "building_id": "[Head Office Tower ID]",
  "equipment_type": "elevator",
  "equipment_number": "ELV-001",
  "brand": "KONE",
  "model": "MonoSpace 500",
  "installation_year": "2020",
  "capacity": "1000 kg",
  "floors_served": "G, 1-25"
}
```

---

#### Test Case ADM-EQUIP-002: View Equipment Details
**Objective**: Verify admin can view detailed equipment information

**Preconditions**: 
- Admin is logged in
- Equipment "ELV-001" exists

**Test Steps**:
1. Navigate to `/admin/equipments`
2. Find equipment "ELV-001"
3. Click on equipment or "View Details" button

**Expected Result**:
- Redirected to `/admin/equipment-details/:id`
- Equipment details page displays with tabs:
  - Equipment Details
  - Equipment Specification
- All entered information is visible
- Can view linked contracts
- Can view maintenance history
- Can view callback history

---

#### Test Case ADM-EQUIP-003: Add Equipment to Group
**Objective**: Verify admin can create equipment groups

**Preconditions**: 
- Admin is logged in
- Multiple equipment items exist in the same building

**Test Steps**:
1. Navigate to `/admin/add-groups` or `/admin/groups`
2. Click "Add Group" or "Create Group"
3. Fill in group details:
   - Group Name: `North Wing Elevators`
   - Select Client: `Test Client ABC`
   - Select Building: `Head Office Tower`
   - Select Equipment: Select 2-3 elevators
4. Click "Save"

**Expected Result**:
- Group created successfully
- Success toast displayed
- Group appears in groups list
- Selected equipment is now part of the group
- Group can be used for batch operations

**Test Data**:
```json
{
  "group_name": "North Wing Elevators",
  "client_id": "[ID]",
  "building_id": "[ID]",
  "equipment_ids": ["[ID1]", "[ID2]", "[ID3]"]
}
```

---

#### Test Case ADM-EQUIP-004: View Equipment Groups
**Objective**: Verify admin can view and manage equipment groups

**Preconditions**: 
- Admin is logged in
- At least one group exists

**Test Steps**:
1. Navigate to `/admin/groups`
2. Review groups list

**Expected Result**:
- Groups list displays
- Each group shows: Name, building, equipment count
- Can click to view group details
- Can edit or delete groups

---

#### Test Case ADM-EQUIP-005: Update Equipment Information
**Objective**: Verify admin can update equipment details

**Preconditions**: 
- Admin is logged in
- Equipment "ELV-001" exists

**Test Steps**:
1. Navigate to `/admin/equipment-details/:id` for ELV-001
2. Click "Edit" button
3. Update:
   - Model: `MonoSpace 700` (changed)
   - Capacity: `1200 kg` (changed)
4. Click "Save"

**Expected Result**:
- Update successful
- Success toast displayed
- Equipment details page shows updated information
- Changes reflected in equipment list

---

### 5.5 Service Contract Management

#### Test Case ADM-CONTRACT-001: Create Service Contract
**Objective**: Verify admin can create a new service contract

**Preconditions**: 
- Admin is logged in
- Client "Test Client ABC" exists
- At least one building with equipment exists

**Test Steps**:
1. Navigate to `/admin/service-contracts`
2. Click "Add Contract" or "Create Contract" button
3. Navigate to `/admin/services-contracts-list` (if needed)
4. Fill in contract information:

   **Basic Information:**
   - Select Client: `Test Client ABC`
   - Select Buildings: `Head Office Tower`
   - Contract Number: `CTR-2026-001`
   - Contract Name: `Annual Maintenance Contract 2026`
   - Start Date: `01/01/2026`
   - End Date: `31/12/2026`
   - Status: `Active`

   **Service Provider Details:**
   - Service Provider Name: `KONE Australia`
   - Contact Person: `Mike Johnson`
   - Country Code: `+61`
   - Phone: `298765432`
   - Email: `mike.johnson@kone.com`

   **Plan and Pricing:**
   - Contract Type: `Type 1`
   - Contract Price: `120000` (per year)
   - Next Fee Adjustment Date: `01/01/2027`
   - Next Fee Adjustment Rate: `5` (%)

   **Contract KPIs:**
   - Maintenance Visits per Equipment: `12`
   - Annual Safety Test Report: `1`
   - Rate of Breakdown: `5` (%)
   - Minor Response Time: `4` (hours)

   **Equipment KPIs:**
   - Annual Man Trapped Event: `0`
   - Equipment Availability Target: `99.5` (%)

   **Business Hours Response Time:**
   - Entrapment: `1` hour
   - Critical Equipment Stopped: `2` hours
   - Non-Critical Equipment Stopped: `4` hours
   - Operational Intermittent Faults: `8` hours
   - Non-Operational/Aesthetic Faults: Next business day

   **After Hours Response Time:**
   - Entrapment: `2` hours
   - Critical Equipment Stopped: `4` hours
   - Non-Critical Equipment Stopped: Next business day
   - Other categories: As per business hours or next day

5. Upload contract terms PDF (if required)
6. Click "Save" or "Create Contract"

**Expected Result**:
- Contract created successfully
- Success toast: "Service contract created successfully"
- Contract appears in service contracts list
- Contract ID is generated
- Contract is linked to client and selected buildings
- Can view contract details page

**Test Data**: See inline JSON above

---

#### Test Case ADM-CONTRACT-002: View Service Contract Details
**Objective**: Verify admin can view full contract details

**Preconditions**: 
- Admin is logged in
- Contract "CTR-2026-001" exists

**Test Steps**:
1. Navigate to `/admin/services-contracts-list`
2. Find contract "CTR-2026-001"
3. Click on contract or "View Details"

**Expected Result**:
- Redirected to `/admin/services-contracts-details/:id`
- All contract sections display:
  - Basic information
  - Service provider details
  - Plan and pricing
  - Contract KPIs
  - Equipment KPIs
  - Response times
  - Linked buildings
  - Contract terms document (download link)
- "Edit" button visible
- Can navigate between tabs/sections

---

#### Test Case ADM-CONTRACT-003: Update Service Contract
**Objective**: Verify admin can update contract details

**Preconditions**: 
- Admin is logged in
- Contract "CTR-2026-001" exists

**Test Steps**:
1. Navigate to `/admin/services-contracts-details/:id` for CTR-2026-001
2. Click "Edit" or navigate to `/admin/services-contracts-update`
3. Update:
   - Contract Price: `130000` (changed from 120000)
   - Next Fee Adjustment Rate: `6` (changed from 5)
4. Click "Save" or "Update"

**Expected Result**:
- Update successful
- Success toast displayed
- Contract details page shows updated pricing
- Contract list reflects changes

---

#### Test Case ADM-CONTRACT-004: Link Equipment to Contract
**Objective**: Verify equipment can be associated with service contracts

**Preconditions**: 
- Admin is logged in
- Contract exists
- Equipment exists in contract's buildings

**Test Steps**:
1. View contract details
2. Navigate to "Linked Equipment" section or tab
3. Click "Add Equipment" or "Link Equipment"
4. Select equipment: `ELV-001`
5. Click "Save"

**Expected Result**:
- Equipment successfully linked to contract
- Equipment appears in contract's equipment list
- Contract appears in equipment's contract details
- KPIs now track this equipment

---

### 5.6 ES Plus Subscription Management

#### Test Case ADM-ES-001: Create ES Plus Subscription
**Objective**: Verify admin can create ES Plus subscription for a client

**Preconditions**: 
- Admin is logged in
- Client exists

**Test Steps**:
1. Navigate to `/admin/es-pulse-subscriptions` or `/admin/es-contracts-list`
2. Click "Add ES Subscription" button
3. Navigate to `/admin/es-contracts-add`
4. Fill in subscription details:

   **Subscription Info:**
   - Select Client: `Test Client ABC`
   - Subscription Name: `ES Plus Premium 2026`
   - Start Date: `01/01/2026`
   - End Date: `31/12/2026`
   - Subscription Type: `Premium`
   - Monthly Fee: `5000`

   **API Credentials** (for external integration):
   - Brand ID: `KONE-AU`
   - Client ID: `client_123456`
   - Client Secret: `[Generated Secret]`
   - Auth Username: `api_user`
   - Auth Password: `[Secure Password]`
   - Grant Type: `client_credentials`
   - OCP APIM Subscription Key: `[API Key]`
   - Scope: `api.read api.write`

5. Click "Next" to configure levels
6. Configure Level 1 (if applicable)
7. Configure Level 2 (if applicable)
8. Click "Save" or "Create Subscription"

**Expected Result**:
- ES Plus subscription created successfully
- Success toast displayed
- Subscription appears in ES contracts list
- Subscription ID generated
- Can proceed to add ES clients
- API credentials are stored securely

---

#### Test Case ADM-ES-002: Add ES Client User (Client or Manager)
**Objective**: Verify admin can create ES Client user account (mapped to `Client` or `Manager`)

**Preconditions**: 
- Admin is logged in
- ES Plus subscription exists for a client

**Test Steps**:
1. Navigate to `/admin/es-clients`
2. Click "Add User" button
3. Navigate to `/admin/add-es-client/:id`
4. Fill in Client User information:

   **User Information:**
   - First Name: `Sarah`
   - Last Name: `Connor`
   - Email: `sarah.connor@testclient.com`
   - Country Code: `+61`
   - Phone: `412345678`
   - User Type: `Client`

   **Access Management:**
   - Select Client: `Test Client ABC`
   - Select ES Subscription: `ES Plus Premium 2026`
   - Access Level: `Read & Write` or as per requirements

5. Click "Create User" or "Save"

**Expected Result**:
- Client user created successfully
- Success toast: "User created successfully"
- User appears in ES clients 
- User can log in with credentials
- User has access to ES Plus dashboard

---

#### Test Case ADM-ES-003: Add ES Admin User (Super Admin or Admin)
**Objective**: Verify admin can create ES Admin user account (mapped to `Super Admin` or `Admin`)

**Preconditions**: 
- Admin is logged in

**Test Steps**:
1. Navigate to `/admin/es-admin`
2. Click "Add ES Admin" button
3. Navigate to `/admin/add-es-admin/:id`
4. Fill in ES Admin information:

   **User Information:**
   - First Name: `Tom`
   - Last Name: `Wilson`
   - Email: `tom.wilson@admin.com`
   - Country Code: `+61`
   - Phone: `423456789`
   - User Type: `ES Admin`

   **Access Permissions:**
   - Select permissions/roles as needed
   - Can manage ES clients: Yes
   - Can view reports: Yes

5. Click "Create User" or "Save"

**Expected Result**:
- ES Admin user created successfully
- Success toast displayed
- User appears in ES admin list
- User can log in
- User has elevated permissions for ES management

---

#### Test Case ADM-ES-004: View ES Subscription Details
**Objective**: Verify admin can view ES subscription details

**Preconditions**: 
- Admin is logged in
- ES subscription exists

**Test Steps**:
1. Navigate to `/admin/es-contracts-list`
2. Find ES subscription "ES Plus Premium 2026"
3. Click to view details

**Expected Result**:
- Redirected to `/admin/es-contracts-details/:id`
- All subscription details displayed in tabs:
  - Subscription Info
  - Client Info
  - Level Config
  - Level Details
- Linked ES clients visible
- API credentials masked/hidden
- Can edit subscription

---

#### Test Case ADM-ES-005: Configure Level 1 & Level 2
**Objective**: Verify admin can configure hierarchical levels for ES subscriptions

**Preconditions**: 
- Admin is logged in
- ES subscription exists

**Test Steps**:
1. Navigate to ES subscription details
2. Click "Level Config" tab
3. Click "Add Level 1" or navigate to `/admin/level-1`
4. Add Level 1:
   - Level Name: `Region A`
   - Description: `North Region`
5. Click "Save"
6. Click "Add Level 2" under Level 1 or navigate to `/admin/level-2`
7. Add Level 2:
   - Parent Level 1: `Region A`
   - Level Name: `District 1`
   - Description: `CBD District`
8. Click "Save"

**Expected Result**:
- Level 1 created and displayed
- Level 2 created under Level 1
- Hierarchical structure visible
- Levels can be used for organizing equipment/data
- Can edit or delete levels

---

### 5.7 Brand/Product Management

#### Test Case ADM-BRAND-001: Add New Brand
**Objective**: Verify admin can add a service provider brand

**Preconditions**: 
- Admin is logged in

**Test Steps**:
1. Navigate to `/admin/brands`
2. Click "Add Brand" button
3. Navigate to `/admin/brand-details`
4. Fill in brand information:
   - Brand Name: `Schindler`
   - Contact Person: `Peter Smith`
   - Country Code: `+61`
   - Phone: `287654321`
   - Email: `contact@schindler.com.au`
   - Website: `www.schindler.com.au`
5. Upload brand logo (optional)
6. Click "Save"

**Expected Result**:
- Brand created successfully
- Success toast displayed
- Brand appears in brands list
- Brand can be selected when creating contracts/equipment

---

#### Test Case ADM-BRAND-002: View Brand Details
**Objective**: Verify admin can view brand information

**Preconditions**: 
- Admin is logged in
- Brand "Schindler" exists

**Test Steps**:
1. Navigate to `/admin/brands`
2. Find brand "Schindler"
3. Click to view details

**Expected Result**:
- Redirected to `/admin/products-details/:id`
- All brand information displayed
- Associated equipment/contracts listed
- Edit button visible

---

#### Test Case ADM-BRAND-003: Update Brand Details
**Objective**: Verify admin can update brand information

**Preconditions**: 
- Admin is logged in
- Brand "Schindler" exists

**Test Steps**:
1. View brand details for "Schindler"
2. Click "Edit" or navigate to `/admin/edit-product/:id`
3. Update:
   - Contact Person: `Lisa Brown` (changed)
   - Phone: `287654999` (changed)
4. Click "Save"

**Expected Result**:
- Update successful
- Success toast displayed
- Brand details reflect changes

---

### 5.8 Dashboard & Analytics (Admin)

#### Test Case ADM-DASH-001: View Admin Dashboard
**Objective**: Verify admin dashboard displays key metrics

**Preconditions**: 
- Admin is logged in
- System has data (clients, contracts, equipment, callbacks)

**Test Steps**:
1. Navigate to `/admin/dashboard`
2. Review dashboard widgets

**Expected Result**:
- Dashboard loads successfully
- Key metrics displayed:
  - Total Clients
  - Total Contracts (Service + ES Plus)
  - Total Equipment
  - Active Callbacks
  - Response Time Metrics
  - Availability Metrics
  - Recent Activity
- Charts/graphs render correctly
- Data is current
- Can click widgets to drill down

---

#### Test Case ADM-DASH-002: Filter Dashboard by Date Range
**Objective**: Verify admin can filter dashboard data by date

**Preconditions**: 
- Admin is logged in
- Dashboard data exists

**Test Steps**:
1. Navigate to `/admin/dashboard`
2. Locate date filter/selector
3. Select date range: `01/01/2026 to 31/01/2026`
4. Click "Apply" or filter updates automatically

**Expected Result**:
- Dashboard data refreshes
- Metrics update to show data within selected date range
- Charts adjust accordingly
- Date range persists when navigating within dashboard

---

### 5.9 Capital Budget Management (Admin)

#### Test Case ADM-CAP-001: Add Capital Budget for Equipment
**Objective**: Verify admin can add capital budget information for equipment

**Preconditions**: 
- Admin is logged in
- Equipment exists

**Test Steps**:
1. Navigate to `/admin/capital-budget`
2. Select equipment or click "Add Budget"
3. Navigate to `/admin/capital-budget/single-equipment/:id` or details page
4. Fill in budget information:
   - Equipment: `ELV-001`
   - Budget Year: `2026`
   - Planned Budget: `50000`
   - Budget Category: `Modernization` or `Replacement`
   - Priority: `High`
   - Justification: `Equipment is 15 years old, requires upgrade`
   - Target Date: `30/06/2026`
5. Click "Save"

**Expected Result**:
- Budget entry created successfully
- Success toast displayed
- Budget appears in capital budget list
- Can view/edit budget details

---

#### Test Case ADM-CAP-002: View Capital Budget Overview
**Objective**: Verify admin can view capital budget summary

**Preconditions**: 
- Admin is logged in
- Capital budget entries exist

**Test Steps**:
1. Navigate to `/admin/capital-budget`
2. Review budget overview

**Expected Result**:
- Budget list displays with filters by:
  - Equipment type (tabs: All, Escalators, Moving Walk, Platform, Elevators, Dumb Waiters)
  - Client
  - Building
  - Year
- Total budget amounts shown
- Can sort by priority, date, amount
- Can export data

---

#### Test Case ADM-CAP-003: Update Capital Budget Entry
**Objective**: Verify admin can update budget information

**Preconditions**: 
- Admin is logged in
- Budget entry exists for ELV-001

**Test Steps**:
1. View budget details for ELV-001
2. Click "Edit" or navigate to edit page
3. Navigate to `/admin/capital-budget/single-equipment/edit-capital-budget/:id`
4. Update:
   - Planned Budget: `60000` (increased)
   - Priority: `Critical` (changed)
5. Click "Save"

**Expected Result**:
- Update successful
- Success toast displayed
- Budget list reflects updated amount and priority

---

### 5.10 Cost Information Management

#### Test Case ADM-COST-001: Add Cost Information
**Objective**: Verify admin can add cost details for contracts/equipment

**Preconditions**: 
- Admin is logged in
- Contract or equipment exists

**Test Steps**:
1. Navigate to `/admin/cost-info`
2. Click "Add Cost Info"
3. Fill in cost details:
   - Select Contract: `CTR-2026-001`
   - Cost Type: `Maintenance` or `Repair`
   - Amount: `5000`
   - Date: `15/01/2026`
   - Description: `Quarterly maintenance cost`
4. Click "Save"

**Expected Result**:
- Cost entry created
- Success toast displayed
- Cost appears in cost info list
- Total costs updated

---

### 5.11 Logs & Audit Trail

#### Test Case ADM-LOG-001: View System Logs
**Objective**: Verify admin can view system activity logs

**Preconditions**: 
- Admin is logged in (preferably Super Admin)
- System has activity

**Test Steps**:
1. Navigate to `/admin/logs`
2. Review logs page

**Expected Result**:
- Logs page displays with columns:
  - Timestamp
  - User
  - Action (Created, Updated, Deleted, Login, etc.)
  - Entity Type (Client, Contract, Equipment, etc.)
  - Entity ID
  - Details/Changes
- Can filter by:
  - Date range
  - User
  - Action type
  - Entity type
- Can search logs
- Pagination available

---

#### Test Case ADM-LOG-002: Filter Logs by User
**Objective**: Verify log filtering by user

**Preconditions**: 
- Admin is logged in
- Multiple users have performed actions

**Test Steps**:
1. Navigate to `/admin/logs`
2. Select user filter: `admin@test.com`
3. Apply filter

**Expected Result**:
- Logs filtered to show only actions by selected user
- Other users' actions hidden
- Filter can be cleared

---

### 5.12 User Management (Admin)

#### Test Case ADM-USER-001: Create Client User
**Objective**: Verify admin can create user for client organization

**Preconditions**: 
- Admin is logged in
- Client "Test Client ABC" exists

**Test Steps**:
1. Navigate to `/create-users` or admin user management
2. Click "Create User" button
3. Fill in user information:

   **User Information Tab:**
   - First Name: `Robert`
   - Last Name: `Johnson`
   - Email: `robert.johnson@testclient.com`
   - Country Code: `+61`
   - Phone: `434567890`
   - User Type: `Client User` (not admin)

   **Access Management Tab:**
   - Select Client: `Test Client ABC`
   - Select Buildings: Select all or specific buildings
   - Select Contracts: Select accessible contracts
   - Permissions: Read-only or Read-Write

4. Click "Create User"

**Expected Result**:
- User created successfully
- Success toast displayed
- User appears in users list
- Welcome email sent
- User can log in and sees client dashboard
- User access restricted to assigned client/buildings

---

#### Test Case ADM-USER-002: Update User Permissions
**Objective**: Verify admin can modify user access rights

**Preconditions**: 
- Admin is logged in
- User "robert.johnson@testclient.com" exists

**Test Steps**:
1. Navigate to user management
2. Find user "Robert Johnson"
3. Click "Edit" or navigate to `/admin/create-update-user`
4. Navigate to "Access Management" tab
5. Update:
   - Add additional building access
   - Change permissions to Read-Write
6. Click "Save"

**Expected Result**:
- User permissions updated
- Success toast displayed
- User now has access to new buildings
- Changes reflected immediately for user's next login

---

### 5.13 Profile Management (Admin)

#### Test Case ADM-PROFILE-001: View Admin Profile
**Objective**: Verify admin can view their own profile

**Preconditions**: 
- Admin is logged in

**Test Steps**:
1. Click on user avatar/name in header
2. Select "Profile" from dropdown
3. Navigate to `/admin/profile`

**Expected Result**:
- Profile page displays
- Admin information shown:
  - Name
  - Email
  - Phone
  - User type/role
  - Profile picture (if uploaded)
- "Edit Profile" button visible
- "Change Password" option visible

---

#### Test Case ADM-PROFILE-002: Edit Admin Profile
**Objective**: Verify admin can update their profile information

**Preconditions**: 
- Admin is logged in

**Test Steps**:
1. Navigate to `/admin/profile`
2. Click "Edit Profile"
3. Navigate to `/admin/edit-profile`
4. Update:
   - Phone: `298765000` (changed)
5. Upload new profile picture (optional)
6. Click "Save"

**Expected Result**:
- Profile updated successfully
- Success toast displayed
- Profile page shows updated information
- Profile picture updated (if changed)

---

#### Test Case ADM-PROFILE-003: Change Password
**Objective**: Verify admin can change their password

**Preconditions**: 
- Admin is logged in

**Test Steps**:
1. Navigate to `/admin/profile`
2. Click "Change Password"
3. Navigate to `/admin/change-password`
4. Fill in form:
   - Current Password: `[Current password]`
   - New Password: `NewSecurePass123!`
   - Confirm New Password: `NewSecurePass123!`
5. Click "Change Password" or "Save"

**Expected Result**:
- Password changed successfully
- Success toast: "Password updated successfully"
- User can log in with new password
- Old password no longer works

---

## 6. Client Side Testing

### 6.1 Client Authentication

#### Test Case CLI-AUTH-001: Client User Login
**Objective**: Verify client user can log in successfully

**Preconditions**: 
- Client user account exists
- User is logged out

**Test Steps**:
1. Navigate to login page
2. Enter client user email: `robert.johnson@testclient.com`
3. Enter password
4. Click "Login"

**Expected Result**:
- Login successful
- Redirected to `/dashboard` (client dashboard, not admin)
- Client dashboard displays
- Navigation sidebar shows client menu items only
- Success toast: "Login successful"

---

#### Test Case CLI-AUTH-002: ES Client (Client or Manager) User Login
**Objective**: Verify ES Client user (mapped to `Client` or `Manager`) can log in successfully

**Preconditions**: 
-- ES Client account exists (Client or Manager)
- User is logged out

**Test Steps**:
1. Navigate to login page
2. Enter ES client email (Client or Manager): `sarah.connor@testclient.com`
3. Enter password
4. Click "Login"

**Expected Result**:
- Login successful
- Redirected to `/dashboard`
- ES Plus dashboard displays with subscription data
- Navigation shows ES-specific features
- Success toast displayed

---

### 6.2 Dashboard (Client)

#### Test Case CLI-DASH-001: View Client Dashboard
**Objective**: Verify client user sees appropriate dashboard

**Preconditions**: 
- Client user is logged in
- Client has contracts and equipment

**Test Steps**:
1. Navigate to `/dashboard`
2. Review dashboard widgets

**Expected Result**:
- Dashboard loads successfully
- Key metrics displayed:
  - Active Contracts count
  - Total Equipment count
  - Equipment Availability (%)
  - Recent Callbacks
  - Upcoming Maintenance
  - KPI Summary
- Charts display (if applicable):
  - Availability Chart
  - Callbacks Trend
  - Response Times
- Can navigate to detailed views
- Only sees data for assigned client/buildings

---

#### Test Case CLI-DASH-002: View Availability Chart
**Objective**: Verify client can view equipment availability metrics

**Preconditions**: 
- Client user is logged in
- Equipment with availability data exists

**Test Steps**:
1. Navigate to `/dashboard`
2. Locate "Availability Chart" widget/section
3. Review chart

**Expected Result**:
- Availability chart displays
- Shows availability % over time
- Can filter by:
  - Date range
  - Equipment type
  - Building
- Meets target availability % is highlighted
- Below target items flagged

---

### 6.3 Service Contracts (Client)

#### Test Case CLI-CONTRACT-001: View Service Contracts List
**Objective**: Verify client user can view their service contracts

**Preconditions**: 
- Client user is logged in
- Client has at least one service contract

**Test Steps**:
1. Navigate to `/service-contracts`
2. Review contracts list

**Expected Result**:
- Service contracts list displays
- Each contract shows:
  - Contract name/number
  - Contract type
  - Service provider (e.g., "By KONE")
  - Price
  - Start and end dates
  - Days remaining
  - Next fee adjustment date
  - Status
- Only contracts for user's client are visible
- Can click contract to view details

---

#### Test Case CLI-CONTRACT-002: View Service Contract Details
**Objective**: Verify client user can view contract details

**Preconditions**: 
- Client user is logged in
- Service contract exists

**Test Steps**:
1. Navigate to `/service-contracts`
2. Click on contract "CTR-2026-001"
3. Navigate to `/contract-details/:id`

**Expected Result**:
- Contract details page displays
- Information shown:
  - Contract basic info
  - Service provider details
  - Contract KPIs
  - Equipment KPIs
  - Response time commitments
  - Linked buildings
  - Linked equipment list
  - Contract terms document (view/download)
- No edit functionality (read-only for client)

---

#### Test Case CLI-CONTRACT-003: Download Contract Terms
**Objective**: Verify client can download contract terms document

**Preconditions**: 
- Client user is logged in
- Contract with uploaded terms exists

**Test Steps**:
1. Navigate to contract details for CTR-2026-001
2. Locate "Contract Terms" section
3. Click "Download" or document link

**Expected Result**:
- PDF document downloads
- Document opens in browser or file manager
- Document is the correct contract terms

---

### 6.4 Equipment (Client)

#### Test Case CLI-EQUIP-001: View Equipment List
**Objective**: Verify client user can view their equipment

**Preconditions**: 
- Client user is logged in
- Client has equipment

**Test Steps**:
1. Navigate to `/equipments`
2. Review equipment list

**Expected Result**:
- Equipment list displays
- Each equipment shows:
  - Equipment ID/Number
  - Type (Elevator, Escalator, etc.)
  - Building
  - Status (Active, Under Maintenance, etc.)
  - Availability %
  - Recent callback count
- Can filter by:
  - Equipment type
  - Building
  - Status
- Can search by equipment ID
- Only equipment for user's client is visible

---

#### Test Case CLI-EQUIP-002: View Equipment Details
**Objective**: Verify client user can view detailed equipment information

**Preconditions**: 
- Client user is logged in
- Equipment "ELV-001" exists

**Test Steps**:
1. Navigate to `/equipments`
2. Click on equipment "ELV-001"
3. Navigate to `/equipment-details/:id`

**Expected Result**:
- Equipment details page displays with tabs:
  - **Equipment Details**: Basic info, manufacturer, model, installation year, etc.
  - **Equipment Specification**: Technical specifications
  - **Maintenance History**: Past maintenance activities
  - **Callback History**: Past callbacks/issues
  - **Linked Contracts**: Service contracts covering this equipment
- Availability metrics shown
- No edit functionality (read-only)

---

#### Test Case CLI-EQUIP-003: Filter Equipment by Type
**Objective**: Verify equipment filtering functionality

**Preconditions**: 
- Client user is logged in
- Multiple equipment types exist

**Test Steps**:
1. Navigate to `/equipments`
2. Select filter: Equipment Type = `Elevator`
3. Apply filter

**Expected Result**:
- Equipment list filters to show only elevators
- Other types hidden
- Count reflects filtered results
- Can clear filter

---

### 6.5 Buildings & Groups (Client)

#### Test Case CLI-BLDG-001: View Buildings List
**Objective**: Verify client user can view their buildings

**Preconditions**: 
- Client user is logged in
- Client has buildings

**Test Steps**:
1. Navigate to `/buildings`
2. Review buildings list

**Expected Result**:
- Buildings list displays
- Each building shows:
  - Building name
  - Address
  - Total equipment count
  - Active contracts
- Can click building to view details
- Only buildings for user's client are visible

---

#### Test Case CLI-BLDG-002: View Building Details
**Objective**: Verify client user can view building information

**Preconditions**: 
- Client user is logged in
- Building "Head Office Tower" exists

**Test Steps**:
1. Navigate to `/buildings`
2. Click on building "Head Office Tower"
3. Navigate to `/buildings/:buildingId`

**Expected Result**:
- Building details page displays
- Information shown:
  - Building name and address
  - Number of floors
  - Equipment list (all equipment in this building)
  - Groups (if any)
  - Active contracts for this building
- Can navigate to equipment details from this page

---

#### Test Case CLI-GROUP-001: View Equipment Groups
**Objective**: Verify client user can view equipment groups

**Preconditions**: 
- Client user is logged in
- Equipment groups exist

**Test Steps**:
1. Navigate to equipment groups (may be in building details or separate page)
2. Navigate to `/groups/:groupId` (if applicable)
3. Review groups

**Expected Result**:
- Groups list displays
- Each group shows:
  - Group name
  - Building
  - Equipment count
- Can click group to view equipment in group
- Only groups for user's client are visible

---

### 6.6 Maintenance (Client)

#### Test Case CLI-MAINT-001: View Maintenance Overview
**Objective**: Verify client user can view maintenance summary

**Preconditions**: 
- Client user is logged in
- Maintenance data exists

**Test Steps**:
1. Navigate to `/maintenance-overview`
2. Review maintenance dashboard

**Expected Result**:
- Maintenance overview displays
- Sections shown:
  - Upcoming scheduled maintenance
  - Recent completed maintenance
  - Overdue maintenance (if any)
  - Maintenance compliance %
- Can filter by:
  - Date range
  - Equipment
  - Building
  - Maintenance type

---

#### Test Case CLI-MAINT-002: View Planned Maintenance
**Objective**: Verify client can view planned maintenance schedule

**Preconditions**: 
- Client user is logged in
- Planned maintenance exists

**Test Steps**:
1. Navigate to `/maintenance-overview`
2. Click on "Planned Maintenance" or specific equipment
3. Navigate to `/planned-maintenance/:id/:equipment_id`

**Expected Result**:
- Planned maintenance details display
- Information shown:
  - Equipment
  - Scheduled date and time
  - Maintenance type
  - Service provider technician
  - Estimated duration
  - Required downtime
  - Status (Scheduled, In Progress, Completed)
- Can export schedule

---

#### Test Case CLI-MAINT-003: View Equipment Maintenance Details
**Objective**: Verify client can view maintenance history for specific equipment

**Preconditions**: 
- Client user is logged in
- Equipment with maintenance history exists

**Test Steps**:
1. Navigate to equipment details for "ELV-001"
2. Navigate to `/planned-equipment-details/:id`
3. Click "Maintenance History" tab or section

**Expected Result**:
- Maintenance history displays
- Each entry shows:
  - Date
  - Maintenance type
  - Technician
  - Duration
  - Findings/notes
  - Parts replaced (if any)
  - Status (Completed, Cancelled)
- Can filter by date range
- Can export history

---

### 6.7 Callbacks (Client)

#### Test Case CLI-CALL-001: View Callbacks Overview
**Objective**: Verify client user can view callbacks summary

**Preconditions**: 
- Client user is logged in
- Callback data exists

**Test Steps**:
1. Navigate to `/callbacks-overview`
2. Review callbacks dashboard

**Expected Result**:
- Callbacks overview displays
- Key metrics shown:
  - Total callbacks (current period)
  - Open/pending callbacks
  - Resolved callbacks
  - Average response time
  - Callbacks by category (Entrapment, Equipment Stopped, Faults, etc.)
- Charts display:
  - Callbacks over time
  - Callbacks by equipment type
  - Response time trends
- Can filter by date range

---

#### Test Case CLI-CALL-002: View Callbacks List
**Objective**: Verify client can view list of all callbacks

**Preconditions**: 
- Client user is logged in
- Callbacks exist

**Test Steps**:
1. Navigate to `/callbacks-overview` or `/callbacksList`
2. Review callbacks list

**Expected Result**:
- Callbacks list displays in table format
- Each callback shows:
  - Callback ID
  - Equipment
  - Building
  - Date/Time reported
  - Category (Entrapment, Critical, etc.)
  - Priority
  - Status (Open, In Progress, Resolved)
  - Response time
  - Resolution time
- Can filter by:
  - Status
  - Category
  - Equipment
  - Building
  - Date range
- Can sort by date, priority, status
- Can search by callback ID
- Only callbacks for user's client are visible

---

#### Test Case CLI-CALL-003: View Callback Details
**Objective**: Verify client can view detailed callback information

**Preconditions**: 
- Client user is logged in
- Callback exists

**Test Steps**:
1. Navigate to callbacks list
2. Click on a specific callback
3. Navigate to `/callbacks-details/:id`

**Expected Result**:
- Callback details page displays
- Information shown:
  - Callback ID
  - Equipment details
  - Building
  - Date/Time reported
  - Category and priority
  - Description of issue
  - Response time (actual vs. target)
  - Arrival time of technician
  - Resolution time (actual vs. target)
  - Technician name
  - Actions taken
  - Parts used (if any)
  - Root cause (if identified)
  - Status and resolution notes
- Timeline of callback lifecycle
- No edit functionality (read-only)

---

#### Test Case CLI-CALL-005: View Callbacks History by Month
**Objective**: Verify client can view historical callback data

**Preconditions**: 
- Client user is logged in
- Historical callback data exists

**Test Steps**:
1. Navigate to callbacks overview
2. Locate month selector or date filter
3. Select previous month (e.g., January 2026)
4. Review data

**Expected Result**:
- Callbacks data updates to show selected month
- Metrics recalculated for that period
- Charts adjust to show monthly data
- Can navigate between months

---

### 6.8 Response Times (Client)

#### Test Case CLI-RESP-001: View Response Times Overview
**Objective**: Verify client user can view response time metrics

**Preconditions**: 
- Client user is logged in
- Response time data exists

**Test Steps**:
1. Navigate to `/response-times`
2. Review response times dashboard

**Expected Result**:
- Response times overview displays
- Key metrics shown:
  - Average response time (all categories)
  - Response time by category:
    - Entrapment
    - Critical Equipment Stopped
    - Non-Critical Equipment Stopped
    - Intermittent Faults
    - Aesthetic Faults
  - Target vs. actual comparison
  - Percentage meeting SLA
- Color-coded indicators:
  - Green: Within target
  - Yellow: Close to target
  - Red: Exceeded target
- Charts display response time trends

---

#### Test Case CLI-RESP-002: View Response Time by Equipment
**Objective**: Verify client can view response times for specific equipment

**Preconditions**: 
- Client user is logged in
- Equipment with callbacks exists

**Test Steps**:
1. Navigate to `/response-times`
2. Select or click on equipment "ELV-001"
3. Navigate to `/selected-equiment-details` or `/response-time-equipment-details/:id`

**Expected Result**:
- Equipment-specific response time page displays
- Shows:
  - Equipment details
  - All callbacks for this equipment
  - Response times for each callback
  - Average response time
  - Comparison to target
- Can view callback details from this page

---

#### Test Case CLI-RESP-003: View Response Time Callback Details
**Objective**: Verify client can view response time for specific callback

**Preconditions**: 
- Client user is logged in
- Callback with response time data exists

**Test Steps**:
1. Navigate to response times overview
2. Click on a specific callback
3. Navigate to `/response-time-callbacks-overview/:id` or `/response-time-callback-details`

**Expected Result**:
- Callback details with response time breakdown:
  - Time reported
  - Time acknowledged
  - Time technician dispatched
  - Time technician arrived (response time ends here)
  - Time issue resolved (resolution time)
  - Target response time
  - Actual response time
  - Variance (ahead/behind target)
  - Whether SLA was met

---

### 6.9 KPI & Penalty (Client)

#### Test Case CLI-KPI-001: View KPI Penalty Overview
**Objective**: Verify client user can view KPI performance and penalties

**Preconditions**: 
- Client user is logged in
- KPI data exists

**Test Steps**:
1. Navigate to `/kpi-penalty`
2. Review KPI dashboard

**Expected Result**:
- KPI penalty overview displays
- Key metrics shown:
  - Overall KPI compliance %
  - Individual KPI performance:
    - Maintenance visits per equipment (actual vs. target)
    - Annual safety test reports
    - Rate of breakdown (actual vs. target)
    - Minor response time compliance
    - Equipment availability (actual vs. target)
    - Man trapped events
  - Penalties incurred (if applicable):
    - Penalty amount
    - Reason
    - Period
- Color-coded indicators for each KPI
- Can filter by date range, contract

---

#### Test Case CLI-KPI-002: View KPI by Selected Equipment
**Objective**: Verify client can view KPI performance for specific equipment

**Preconditions**: 
- Client user is logged in
- Equipment with KPI data exists

**Test Steps**:
1. Navigate to `/kpi-penalty`
2. Select equipment or click on equipment
3. Navigate to `/kpi-panailty-selected-equipment/:id`

**Expected Result**:
- Equipment-specific KPI page displays
- Shows KPIs for selected equipment:
  - Availability %
  - Maintenance visits
  - Breakdown count
  - Man trapped events (if any)
  - Response time compliance
- Comparison to targets
- Historical trend (if available)

---

#### Test Case CLI-KPI-003: View KPI Penalty Equipment Details
**Objective**: Verify client can view detailed KPI information

**Preconditions**: 
- Client user is logged in
- Equipment with KPI violations/penalties exists

**Test Steps**:
1. Navigate to KPI penalty overview
2. Select equipment with penalty
3. Navigate to `/kpi-penalty-equipment-details/:id`

**Expected Result**:
- Detailed KPI penalty information:
  - Equipment details
  - KPI violated
  - Target value
  - Actual value
  - Variance
  - Penalty amount (if applicable)
  - Period
  - Contributing incidents/callbacks
  - Root cause analysis (if available)

---

### 6.10 Capital Budget (Client)

#### Test Case CLI-CAP-001: View Capital Budget Overview
**Objective**: Verify client user can view capital budget information

**Preconditions**: 
- Client user is logged in
- Capital budget data exists for client

**Test Steps**:
1. Navigate to `/capital-budget`
2. Review capital budget dashboard

**Expected Result**:
- Capital budget overview displays
- Tabs for equipment types: All, Escalators, Moving Walk, Platform, Elevators, Dumb Waiters
- Each equipment entry shows:
  - Equipment ID
  - Building
  - Current age
  - Planned budget year
  - Budget amount
  - Priority
  - Status
- Can filter by:
  - Equipment type (tabs)
  - Building
  - Priority
  - Year
- Summary totals displayed

---

#### Test Case CLI-CAP-002: View Single Equipment Capital Budget
**Objective**: Verify client can view capital budget details for specific equipment

**Preconditions**: 
- Client user is logged in
- Equipment with budget entry exists

**Test Steps**:
1. Navigate to `/capital-budget`
2. Click on equipment "ELV-001"
3. Navigate to `/capital-budget/:id`

**Expected Result**:
- Equipment capital budget details display:
  - Equipment information
  - Budget year
  - Planned budget amount
  - Category (Modernization, Replacement, etc.)
  - Priority
  - Justification/reason
  - Target date
  - Status
  - Approval status (if applicable)
- No edit functionality (read-only for client)

---

#### Test Case CLI-CAP-003: View Capital Budget Distribution Chart
**Objective**: Verify client can view budget distribution visualization

**Preconditions**: 
- Client user is logged in
- Multiple budget entries exist

**Test Steps**:
1. Navigate to `/capital-budget`
2. Locate distribution chart/widget

**Expected Result**:
- Capital budget distribution chart displays
- Shows budget allocation by:
  - Equipment type (pie/bar chart)
  - Priority level
  - Building
  - Year
- Interactive chart (hover for details)
- Can export chart

---

### 6.11 Downloads (Client)

#### Test Case CLI-DOWN-001: View Downloads Page
**Objective**: Verify client user can access downloads/reports

**Preconditions**: 
- Client user is logged in

**Test Steps**:
1. Navigate to `/downloads`
2. Review downloads page

**Expected Result**:
- Downloads page displays
- Available reports/documents listed:
  - Contract documents
  - Maintenance reports
  - Callback reports
  - KPI reports
  - Equipment lists
  - Compliance certificates
  - Safety test reports
- Each item shows:
  - Document name
  - Date generated/uploaded
  - File size
  - File type (PDF, Excel, etc.)
- Download button for each item
- Can search/filter documents

---

#### Test Case CLI-DOWN-002: Download Report
**Objective**: Verify client can download reports successfully

**Preconditions**: 
- Client user is logged in
- Reports available

**Test Steps**:
1. Navigate to `/downloads`
2. Select report: "Monthly Maintenance Report - January 2026"
3. Click "Download" button

**Expected Result**:
- File downloads successfully
- File opens in browser or saves to downloads folder
- File is correct report
- File is not corrupted

---

#### Test Case CLI-DOWN-003: Generate Custom Report
**Objective**: Verify client can generate custom reports (if feature exists)

**Preconditions**: 
- Client user is logged in

**Test Steps**:
1. Navigate to `/downloads`
2. Click "Generate Report" or similar button
3. Select report parameters:
   - Report Type: `Callbacks Report`
   - Date Range: `01/01/2026 to 31/01/2026`
   - Equipment: `All` or specific
   - Format: `PDF` or `Excel`
4. Click "Generate"

**Expected Result**:
- Report generation starts
- Progress indicator shown
- Report generates successfully
- Report available for download
- Report contains correct data

---

### 6.12 Profile Management (Client)

#### Test Case CLI-PROFILE-001: View Client User Profile
**Objective**: Verify client user can view their profile

**Preconditions**: 
- Client user is logged in

**Test Steps**:
1. Click on user avatar/name
2. Select "Profile"
3. Navigate to `/profile`

**Expected Result**:
- Profile page displays
- User information shown:
  - Name
  - Email
  - Phone
  - Client organization
  - User type
- Edit and change password options available

---

#### Test Case CLI-PROFILE-002: Edit Client User Profile
**Objective**: Verify client user can update their profile

**Preconditions**: 
- Client user is logged in

**Test Steps**:
1. Navigate to `/profile`
2. Click "Edit Profile"
3. Navigate to `/edit-profile`
4. Update phone number
5. Click "Save"

**Expected Result**:
- Profile updated successfully
- Success toast displayed
- Updated info shown in profile

---

#### Test Case CLI-PROFILE-003: Change Password (Client)
**Objective**: Verify client user can change password

**Preconditions**: 
- Client user is logged in

**Test Steps**:
1. Navigate to `/profile`
2. Click "Change Password"
3. Navigate to `/change-password`
4. Fill in password change form
5. Submit

**Expected Result**:
- Password changed successfully
- Success toast displayed
- Can log in with new password
- Old password no longer works

---

## 7. Cross-Functional Testing

### 7.1 End-to-End Workflows

#### Test Case E2E-001: Complete Client Onboarding to Equipment View
**Objective**: Test complete workflow from creating client to viewing equipment

**Preconditions**: 
- Admin is logged in
- No existing test data

**Test Steps**:
1. **Create Client** (Admin):
   - Navigate to `/admin/onboarding-client`
   - Create client "E2E Test Corp"
   - Save client
2. **Create Building** (Admin):
   - Add building "E2E Tower" under "E2E Test Corp"
   - Save building
3. **Create Equipment** (Admin):
   - Add elevator "ELV-E2E-001" to "E2E Tower"
   - Save equipment
4. **Create Service Contract** (Admin):
   - Create contract for "E2E Test Corp"
   - Link "E2E Tower" building
   - Link "ELV-E2E-001" equipment
   - Save contract
5. **Create Client User** (Admin):
   - Create user "user@e2etest.com" for "E2E Test Corp"
   - Grant access to "E2E Tower"
   - Save user
6. **Login as Client User**:
   - Logout admin
   - Login as "user@e2etest.com"
7. **Verify Client View**:
   - View dashboard - should see 1 contract, 1 building, 1 equipment
   - View service contracts - should see created contract
   - View equipment - should see "ELV-E2E-001"
   - View equipment details - all info correct

**Expected Result**:
- All steps complete successfully
- Client user sees only their client's data
- Data relationships maintained throughout
- No errors at any step

---

#### Test Case E2E-002: Callback Reporting and Resolution
**Objective**: Test callback workflow from creation to resolution

**Preconditions**: 
- Client with equipment exists
- Service contract with response time SLAs exists

**Test Steps**:
1. **Create Callback** (System/Import):
   - Callback reported for equipment (may be automated from external system)
   - Category: Critical Equipment Stopped
   - Priority: High
2. **View Callback (Client)**:
   - Client user logs in
   - Navigates to callbacks
   - Sees new callback with "Open" status
3. **Technician Dispatch** (System):
   - Technician assigned
   - Status updates to "In Progress"
4. **View Response Time (Client)**:
   - Client navigates to response times
   - Sees callback with response time tracking
5. **Callback Resolution** (System):
   - Technician resolves issue
   - Status updates to "Resolved"
6. **Verify KPI Impact (Client)**:
   - Client views KPIs
   - Response time KPI updated
   - SLA compliance calculated

**Expected Result**:
- Callback lifecycle tracked correctly
- Client sees real-time status updates
- Response time calculated accurately
- KPI metrics updated
- All timestamps recorded

---

#### Test Case E2E-003: Maintenance Schedule to Completion
**Objective**: Test maintenance workflow from scheduling to completion

**Preconditions**: 
- Service contract exists
- Equipment exists

**Test Steps**:
1. **Schedule Maintenance** (System/Admin):
   - Maintenance scheduled for equipment
   - Date and technician assigned
2. **View Upcoming Maintenance (Client)**:
   - Client user logs in
   - Views maintenance overview
   - Sees scheduled maintenance
3. **Maintenance Execution** (System):
   - Maintenance performed on scheduled date
   - Status updates to "Completed"
4. **View Maintenance History (Client)**:
   - Client views equipment details
   - Sees completed maintenance in history
5. **Verify KPI Update (Client)**:
   - Maintenance visit count incremented
   - KPI compliance updated

**Expected Result**:
- Maintenance schedule visible to client
- Status updates reflected in real-time
- History recorded accurately
- KPI metrics updated correctly

---

### 7.2 Data Consistency Testing

#### Test Case DATA-001: Client Deletion Cascade
**Objective**: Verify data relationships maintain integrity on deletion

**Preconditions**: 
- Admin is logged in
- Test client with buildings, equipment, contracts, users exists

**Test Steps**:
1. Attempt to delete client with dependencies
2. Review system behavior

**Expected Result**:
- System prevents deletion OR
- System warns about dependencies OR
- System performs cascade delete with confirmation
- No orphaned data left in database
- Related records handled appropriately

---

#### Test Case DATA-002: Contract Expiry Handling
**Objective**: Verify system handles contract expiration correctly

**Preconditions**: 
- Contract with end date in the past exists

**Test Steps**:
1. Admin views contracts list
2. Client user views contracts

**Expected Result**:
- Expired contracts marked/flagged
- Status shows "Expired" or "Inactive"
- Client can still view historical data
- KPI calculations stop for expired contracts

---

### 7.3 Permission & Access Control Testing

#### Test Case PERM-001: Client Cannot Access Other Client Data
**Objective**: Verify data isolation between clients

**Preconditions**: 
- Two clients exist: "Client A" and "Client B"
- User for Client A is logged in

**Test Steps**:
1. Try to access Client B's data by:
   - Manipulating URLs (change IDs)
   - Searching for Client B's equipment
   - Viewing contracts list

**Expected Result**:
- No Client B data is visible or accessible
- Search returns no results for Client B
- Direct URL access returns error or redirects
- No data leakage

---

#### Test Case PERM-002: Admin Can View All Client Data
**Objective**: Verify admin has cross-client access

**Preconditions**: 
- Admin is logged in
- Multiple clients exist

**Test Steps**:
1. Navigate to clients list
2. View each client's data
3. Switch between clients

**Expected Result**:
- Admin can see all clients
- Admin can view data for any client
- Admin can switch between clients easily
- No access restrictions

---

#### Test Case PERM-003: ES Client (Client or Manager) Limited Access
**Objective**: Verify ES Client user (Client or Manager) has appropriate access

**Preconditions**: 
- ES Client user (Client or Manager) is logged in

**Test Steps**:
1. Navigate through application
2. Try to access non-ES features

**Expected Result**:
- ES Client (Client or Manager) sees ES Plus dashboard
- ES-specific features accessible
- Non-ES features hidden or inaccessible
- Appropriate menu items shown

---

### 7.4 Performance & Load Testing (Manual Observation)

#### Test Case PERF-001: Large Data Set Performance
**Objective**: Observe system performance with large data sets

**Preconditions**: 
- Client with 100+ equipment items exists

**Test Steps**:
1. Navigate to equipment list
2. Apply filters
3. Search equipment
4. Navigate to details
5. View callbacks list (if many callbacks)

**Expected Result**:
- Pages load within acceptable time (< 3 seconds)
- Filtering/searching is responsive
- Pagination works smoothly
- No browser freezing or crashes
- UI remains responsive

---

#### Test Case PERF-002: Dashboard Load Time
**Objective**: Verify dashboard loads efficiently

**Preconditions**: 
- User is logged in
- System has substantial data

**Test Steps**:
1. Navigate to dashboard
2. Observe load time
3. Interact with charts/widgets

**Expected Result**:
- Dashboard loads within 2-3 seconds
- Charts render smoothly
- Widgets are interactive
- No lag or delay

---

### 7.5 Browser Compatibility Testing

#### Test Case COMPAT-001: Chrome Browser Testing
**Objective**: Verify application works in Chrome

**Test Steps**:
1. Open application in latest Chrome browser
2. Execute key workflows:
   - Login
   - View dashboard
   - Navigate pages
   - Submit forms

**Expected Result**:
- All features work correctly
- UI displays properly
- No JavaScript errors
- Responsive design works

**Repeat for Firefox, Edge, Safari**

---

### 7.6 Responsive Design Testing

#### Test Case RESP-001: Mobile View (320px width)
**Objective**: Verify application is usable on mobile

**Test Steps**:
1. Resize browser to 320px width OR use mobile device
2. Login
3. Navigate through application
4. Try key features

**Expected Result**:
- Login page is usable
- Navigation menu adapts (hamburger menu)
- Tables scroll or reformat
- Forms are usable
- Buttons are tappable
- Text is readable

**Repeat for tablet (768px) and desktop (1920px)**

---

## 8. Test Data Cleanup

### 8.1 Cleanup Procedures

After testing, clean up test data to prepare for next test cycle:

#### Manual Cleanup Steps:
1. **Delete Test Users** (Admin):
   - Navigate to user management
   - Delete users created during testing
   - Verify users are removed

2. **Delete Test Contracts** (Admin):
   - Navigate to contracts lists (Service + ES Plus)
   - Delete test contracts
   - Verify deletion

3. **Delete Test Equipment** (Admin):
   - Navigate to equipment list
   - Delete test equipment items
   - Verify deletion

4. **Delete Test Buildings** (Admin):
   - Navigate to buildings list
   - Delete test buildings
   - Verify deletion

5. **Delete Test Clients** (Admin):
   - Navigate to clients list
   - Delete test clients
   - Verify all related data removed

6. **Clear Test Data from Database** (DBA/Backend):
   - Run cleanup scripts (if available)
   - Verify database is clean

#### Automated Cleanup (if available):
- Run cleanup script: `npm run cleanup-test-data` or similar
- Verify script completion
- Check database for remaining test data

---

## 9. Known Issues & Workarounds

### 9.1 Known Issues

| Issue ID | Description | Severity | Workaround | Status |
|----------|-------------|----------|------------|--------|
| ISSUE-001 | (Example) Date picker not working in Safari | Medium | Manually type date in format DD/MM/YYYY | Open |
| ISSUE-002 | (Example) Large file uploads timeout after 5 min | Low | Upload files < 50MB | Open |
| ... | ... | ... | ... | ... |

*Update this section as issues are discovered during testing*

---

## 10. Sign-Off

### 10.1 Test Execution Summary

| Metric | Count |
|--------|-------|
| Total Test Cases | [To be filled] |
| Executed | [To be filled] |
| Passed | [To be filled] |
| Failed | [To be filled] |
| Blocked | [To be filled] |
| Not Executed | [To be filled] |

### 10.2 Test Coverage

| Module | Coverage % | Status |
|--------|-----------|--------|
| Authentication | % | ✅/❌ |
| Admin - Client Management | % | ✅/❌ |
| Admin - Building Management | % | ✅/❌ |
| Admin - Equipment Management | % | ✅/❌ |
| Admin - Contract Management | % | ✅/❌ |
| Admin - ES Plus Management | % | ✅/❌ |
| Admin - Dashboard | % | ✅/❌ |
| Client - Dashboard | % | ✅/❌ |
| Client - Contracts | % | ✅/❌ |
| Client - Equipment | % | ✅/❌ |
| Client - Maintenance | % | ✅/❌ |
| Client - Callbacks | % | ✅/❌ |
| Client - Response Times | % | ✅/❌ |
| Client - KPI & Penalty | % | ✅/❌ |
| Client - Capital Budget | % | ✅/❌ |
| Cross-Functional | % | ✅/❌ |

### 10.3 Risk Assessment

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| (Example) Data loss on production | High | Low | Backup before deployment |
| ... | ... | ... | ... |

### 10.4 Recommendations

1. **Priority Fixes**: List critical bugs that must be fixed before release
2. **Enhancements**: Suggested improvements for better usability
3. **Performance**: Areas needing performance optimization
4. **Documentation**: Additional documentation needed

### 10.5 Sign-Off

| Role | Name | Signature | Date |
|------|------|-----------|------|
| **QA Lead** | | | |
| **Project Manager** | | | |
| **Product Owner** | | | |
| **Development Lead** | | | |

---

## Appendix A: Test Data Templates

### A.1 Client Data Template

```json
{
  "client_name": "Test Client [Unique ID]",
  "contact_person": "Test Contact",
  "email": "testclient[ID]@example.com",
  "country_code": "+61",
  "phone": "412345678",
  "address": "123 Test Street, Sydney NSW 2000"
}
```

### A.2 Building Data Template

```json
{
  "client_id": "[Client ID]",
  "building_name": "Test Building [Unique ID]",
  "address": "456 Test Ave, Sydney NSW 2000",
  "number_of_floors": 25,
  "building_type": "Commercial"
}
```

### A.3 Equipment Data Template

```json
{
  "client_id": "[Client ID]",
  "building_id": "[Building ID]",
  "equipment_type": "elevator",
  "equipment_number": "ELV-TEST-[ID]",
  "brand": "KONE",
  "model": "MonoSpace 500",
  "installation_year": "2020",
  "capacity": "1000 kg",
  "floors_served": "G, 1-25"
}
```

### A.4 Service Contract Data Template

```json
{
  "client_id": "[Client ID]",
  "building_ids": ["[Building ID]"],
  "contract_number": "CTR-TEST-[ID]",
  "contract_name": "Test Contract [ID]",
  "start_date": "2026-01-01",
  "end_date": "2026-12-31",
  "active": "active",
  "service_provider_details": {
    "service_provider_name": "KONE Australia",
    "contact_person_name": "Test Contact",
    "country_code": "+61",
    "phone_no": "298765432",
    "email": "contact@testprovider.com"
  },
  "plan_and_pricing": {
    "contract_type": "Type 1",
    "contract_price": 120000,
    "next_fee_adjustment_date": "2027-01-01",
    "next_fee_adjustment_rate": 5
  },
  "contract_kpis": {
    "maintenance_visit_per_equipment": 12,
    "annual_safety_test_report": 1,
    "rate_of_breakdown": 5,
    "minor_response_time": 4
  },
  "equipment_kpis": {
    "annual_man_trapped_event": 0,
    "equipment_availability_target": 99.5
  },
  "business_hours_response_time": {
    "entrapment": { "hours": 1, "attendance_next_business_day": false },
    "criticalEquipmentStopped": { "hours": 2, "attendance_next_business_day": false },
    "nonCriticalEquipmentStopped": { "hours": 4, "attendance_next_business_day": false },
    "operationalIntermittentFaults": { "hours": 8, "attendance_next_business_day": false },
    "nonOperationalOrAestheticFaults": { "hours": 0, "attendance_next_business_day": true }
  },
  "after_hours_response_time": {
    "entrapment": { "hours": 2, "attendance_next_business_day": false },
    "criticalEquipmentStopped": { "hours": 4, "attendance_next_business_day": false },
    "nonCriticalEquipmentStopped": { "hours": 0, "attendance_next_business_day": true },
    "operationalIntermittentFaults": { "hours": 0, "attendance_next_business_day": true },
    "nonOperationalOrAestheticFaults": { "hours": 0, "attendance_next_business_day": true }
  }
}
```

### A.5 User Data Template

```json
{
  "first_name": "Test",
  "last_name": "User [ID]",
  "email": "testuser[ID]@example.com",
  "country_code": "+61",
  "phone": "412345678",
  "user_type_id": "[User Type ID]",
  "client_id": "[Client ID]"
}
```

---

## Appendix B: Bug Report Template

### Bug Report Format

**Bug ID**: BUG-[DATE]-[Number]  
**Reported By**: [Tester Name]  
**Date**: [Date]  
**Priority**: Critical / High / Medium / Low  
**Severity**: Blocker / Major / Minor / Trivial  

**Summary**: [One-line description]

**Module**: [e.g., Admin - Client Management]

**Preconditions**:
- [Condition 1]
- [Condition 2]

**Steps to Reproduce**:
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Result**:
[What should happen]

**Actual Result**:
[What actually happened]

**Screenshots/Videos**:
[Attach evidence]

**Environment**:
- Browser: [Chrome 120]
- OS: [Windows 11]
- URL: [Specific page URL]

**Console Errors** (if any):
```
[Paste console errors]
```

**Additional Notes**:
[Any other relevant information]

---

## Appendix C: Test Execution Tracking

### Test Execution Log Template

| Test Case ID | Test Case Title | Tester | Execution Date | Status | Comments | Bug IDs |
|--------------|-----------------|--------|----------------|--------|----------|---------|
| ADM-AUTH-001 | Super Admin Login | | | Pass/Fail | | |
| ADM-AUTH-002 | Admin Login | | | Pass/Fail | | |
| ... | ... | ... | ... | ... | ... | ... |

**Legend**:
- ✅ **Pass**: Test executed successfully, expected results achieved
- ❌ **Fail**: Test failed, bug logged
- ⚠️ **Blocked**: Cannot execute due to dependency or bug
- ⏭️ **Skipped**: Not executed in this cycle

---

## Document Revision History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2026-02-03 | QA Team | Initial draft created based on codebase analysis |
| | | | |

---

**END OF DOCUMENT**
