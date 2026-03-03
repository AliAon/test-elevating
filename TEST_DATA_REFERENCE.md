# Test Data Reference - ES Pulse

## Purpose
This document provides sample test data that can be used during manual testing. All data follows realistic formats and includes variations for different test scenarios.

---

## 1. Client Test Data

### Valid Client Data

```json
{
  "client_name": "Acme Corporation",
  "contact_person": "John Smith",
  "email": "john.smith@acmecorp.com",
  "country_code": "+61",
  "phone": "412345678",
  "address": "Level 15, 123 Market Street, Sydney NSW 2000, Australia"
}
```

```json
{
  "client_name": "Global Properties Ltd",
  "contact_person": "Sarah Johnson",
  "email": "sarah.j@globalproperties.com.au",
  "country_code": "+61",
  "phone": "498765432",
  "address": "Suite 2A, 456 Collins Street, Melbourne VIC 3000, Australia"
}
```

```json
{
  "client_name": "Metro Facilities Management",
  "contact_person": "Michael Chen",
  "email": "m.chen@metrofm.com",
  "country_code": "+61",
  "phone": "423456789",
  "address": "88 George Street, Brisbane QLD 4000, Australia"
}
```

### Invalid Client Data (for negative testing)

```json
{
  "client_name": "",  // Empty name - should fail
  "contact_person": "Test",
  "email": "invalid-email",  // Invalid email format
  "country_code": "+61",
  "phone": "abc123",  // Invalid phone
  "address": ""  // Empty address
}
```

---

## 2. Building Test Data

### Valid Building Data

```json
{
  "client_id": "[Select from dropdown]",
  "building_name": "Sydney Central Tower",
  "address": "200 George Street, Sydney NSW 2000",
  "number_of_floors": 42,
  "building_type": "Commercial"
}
```

```json
{
  "client_id": "[Select from dropdown]",
  "building_name": "Melbourne Office Complex",
  "address": "100 Collins Street, Melbourne VIC 3000",
  "number_of_floors": 28,
  "building_type": "Mixed Use"
}
```

```json
{
  "client_id": "[Select from dropdown]",
  "building_name": "Brisbane CBD Plaza",
  "address": "75 Queen Street, Brisbane QLD 4000",
  "number_of_floors": 35,
  "building_type": "Retail & Office"
}
```

```json
{
  "client_id": "[Select from dropdown]",
  "building_name": "Westfield Shopping Centre",
  "address": "159-175 Church Street, Parramatta NSW 2150",
  "number_of_floors": 6,
  "building_type": "Shopping Centre"
}
```

---

## 3. Equipment Test Data

### Elevator Data

```json
{
  "equipment_type": "elevator",
  "equipment_number": "ELV-001",
  "brand": "KONE",
  "model": "MonoSpace 500",
  "installation_year": "2018",
  "capacity": "1000 kg / 13 persons",
  "floors_served": "B2, B1, G, 1-25",
  "serial_number": "KONE-SYD-2018-001",
  "last_inspection": "2025-12-15"
}
```

```json
{
  "equipment_type": "elevator",
  "equipment_number": "ELV-002",
  "brand": "Otis",
  "model": "Gen2 Premier",
  "installation_year": "2020",
  "capacity": "1600 kg / 21 persons",
  "floors_served": "B1, G, 1-42",
  "serial_number": "OTIS-SYD-2020-045",
  "last_inspection": "2026-01-10"
}
```

```json
{
  "equipment_type": "elevator",
  "equipment_number": "ELV-003",
  "brand": "Schindler",
  "model": "3300 AP",
  "installation_year": "2015",
  "capacity": "630 kg / 8 persons",
  "floors_served": "G, 1-15",
  "serial_number": "SCH-MEL-2015-023",
  "last_inspection": "2025-11-20"
}
```

### Escalator Data

```json
{
  "equipment_type": "escalator",
  "equipment_number": "ESC-001",
  "brand": "KONE",
  "model": "TravelMaster 110",
  "installation_year": "2019",
  "capacity": "9000 persons/hour",
  "floors_served": "G to Level 1",
  "serial_number": "KONE-ESC-2019-102",
  "step_width": "1000 mm",
  "rise_height": "4.5 m",
  "last_inspection": "2025-12-20"
}
```

```json
{
  "equipment_type": "escalator",
  "equipment_number": "ESC-002",
  "brand": "Otis",
  "model": "NCE 1",
  "installation_year": "2021",
  "capacity": "7500 persons/hour",
  "floors_served": "Level 1 to Level 2",
  "serial_number": "OTIS-ESC-2021-055",
  "step_width": "800 mm",
  "rise_height": "3.8 m",
  "last_inspection": "2026-01-05"
}
```

### Moving Walk Data

```json
{
  "equipment_type": "moving walk",
  "equipment_number": "MW-001",
  "brand": "Schindler",
  "model": "9300 AE",
  "installation_year": "2020",
  "capacity": "4500 persons/hour",
  "floors_served": "Level 1 connection",
  "serial_number": "SCH-MW-2020-018",
  "length": "25 m",
  "width": "1200 mm",
  "last_inspection": "2025-12-28"
}
```

### Platform Lift Data

```json
{
  "equipment_type": "platform",
  "equipment_number": "PLT-001",
  "brand": "KONE",
  "model": "Motala 1000",
  "installation_year": "2017",
  "capacity": "300 kg / 1 wheelchair",
  "floors_served": "G to Level 1",
  "serial_number": "KONE-PLT-2017-008",
  "travel_height": "3.5 m",
  "last_inspection": "2025-10-15"
}
```

### Dumb Waiter Data

```json
{
  "equipment_type": "dumb waiter",
  "equipment_number": "DW-001",
  "brand": "Schindler",
  "model": "Service Lift S200",
  "installation_year": "2016",
  "capacity": "200 kg",
  "floors_served": "B1, G, 1-5",
  "serial_number": "SCH-DW-2016-033",
  "car_size": "600mm x 600mm x 800mm",
  "last_inspection": "2025-09-30"
}
```

---

## 4. Service Contract Test Data

### Standard Service Contract

```json
{
  "contract_number": "CTR-2026-001",
  "contract_name": "Annual Maintenance Contract - Sydney Central",
  "client_id": "[Select Client]",
  "building_ids": ["[Select Building]"],
  "start_date": "2026-01-01",
  "end_date": "2026-12-31",
  "active": "active",
  
  "service_provider_details": {
    "service_provider_name": "KONE Australia Pty Ltd",
    "contact_person_name": "David Wilson",
    "country_code": "+61",
    "phone_no": "298765000",
    "email": "david.wilson@kone.com"
  },
  
  "plan_and_pricing": {
    "contract_type": "Type 1 - Full Maintenance",
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
    "entrapment": {
      "hours": 1,
      "attendance_next_business_day": false
    },
    "criticalEquipmentStopped": {
      "hours": 2,
      "attendance_next_business_day": false
    },
    "nonCriticalEquipmentStopped": {
      "hours": 4,
      "attendance_next_business_day": false
    },
    "operationalIntermittentFaults": {
      "hours": 8,
      "attendance_next_business_day": false
    },
    "nonOperationalOrAestheticFaults": {
      "hours": 0,
      "attendance_next_business_day": true
    }
  },
  
  "after_hours_response_time": {
    "entrapment": {
      "hours": 2,
      "attendance_next_business_day": false
    },
    "criticalEquipmentStopped": {
      "hours": 4,
      "attendance_next_business_day": false
    },
    "nonCriticalEquipmentStopped": {
      "hours": 0,
      "attendance_next_business_day": true
    },
    "operationalIntermittentFaults": {
      "hours": 0,
      "attendance_next_business_day": true
    },
    "nonOperationalOrAestheticFaults": {
      "hours": 0,
      "attendance_next_business_day": true
    }
  }
}
```

### Premium Service Contract

```json
{
  "contract_number": "CTR-2026-002",
  "contract_name": "Premium Service Package - Melbourne Complex",
  "client_id": "[Select Client]",
  "building_ids": ["[Select Building]"],
  "start_date": "2026-02-01",
  "end_date": "2028-01-31",
  "active": "active",
  
  "service_provider_details": {
    "service_provider_name": "Otis Elevator Company",
    "contact_person_name": "Jennifer Lee",
    "country_code": "+61",
    "phone_no": "387654321",
    "email": "jennifer.lee@otis.com"
  },
  
  "plan_and_pricing": {
    "contract_type": "Type 2 - Premium with Parts",
    "contract_price": 180000,
    "next_fee_adjustment_date": "2027-02-01",
    "next_fee_adjustment_rate": 4.5
  },
  
  "contract_kpis": {
    "maintenance_visit_per_equipment": 24,
    "annual_safety_test_report": 2,
    "rate_of_breakdown": 2,
    "minor_response_time": 2
  },
  
  "equipment_kpis": {
    "annual_man_trapped_event": 0,
    "equipment_availability_target": 99.8
  }
}
```

---

## 5. ES Plus Subscription Test Data

### ES Plus Subscription

```json
{
  "subscription_name": "ES Plus Premium 2026",
  "client_id": "[Select Client]",
  "start_date": "2026-01-01",
  "end_date": "2026-12-31",
  "subscription_type": "Premium",
  "monthly_fee": 5000,
  
  "service_api_credentials": {
    "brand_id": "KONE-AU-001",
    "client_id": "client_kone_sydney_001",
    "client_secret": "sk_live_51J2K3L4M5N6O7P8Q9R0",
    "auth_username": "api_kone_user",
    "auth_password": "[Secure Password]",
    "grant_type": "client_credentials",
    "ocp_apim_subscription_key": "9c8b7a6d5e4f3g2h1i0j",
    "scope": "api.read api.write api.admin"
  }
}
```

---

## 6. User Test Data

### Admin User

```json
{
  "first_name": "Admin",
  "last_name": "User",
  "email": "admin.user@testcompany.com",
  "country_code": "+61",
  "phone": "412000001",
  "user_type": "admin",
  "password": "AdminPass123!"
}
```

### Super Admin User

```json
{
  "first_name": "Super",
  "last_name": "Admin",
  "email": "superadmin@testcompany.com",
  "country_code": "+61",
  "phone": "412000000",
  "user_type": "superadmin",
  "password": "SuperAdminPass123!"
}
```

### Client User

```json
{
  "first_name": "Robert",
  "last_name": "Johnson",
  "email": "robert.johnson@acmecorp.com",
  "country_code": "+61",
  "phone": "434567890",
  "user_type": "client",
  "client_id": "[Acme Corporation ID]",
  "password": "ClientPass123!"
}
```

```json
{
  "first_name": "Emily",
  "last_name": "Davis",
  "email": "emily.davis@globalproperties.com",
  "country_code": "+61",
  "phone": "445678901",
  "user_type": "client",
  "client_id": "[Global Properties ID]",
  "password": "ClientPass456!"
}
```

### Manager User

```json
{
  "first_name": "Sarah",
  "last_name": "Connor",
  "email": "sarah.connor@acmecorp.com",
  "country_code": "+61",
  "phone": "456789012",
  "user_type": "manger",
  "client_id": "[Acme Corporation ID]",
  "es_subscription_id": "[ES Plus Subscription ID]",
  "password": "ESClientPass123!"
}
```

---

## 7. Equipment Group Test Data

```json
{
  "group_name": "North Wing Elevators",
  "client_id": "[Select Client]",
  "building_id": "[Select Building]",
  "equipment_ids": ["[ELV-001]", "[ELV-002]", "[ELV-003]"],
  "description": "All elevators in the north wing"
}
```

```json
{
  "group_name": "Main Escalators - Ground to Level 2",
  "client_id": "[Select Client]",
  "building_id": "[Select Building]",
  "equipment_ids": ["[ESC-001]", "[ESC-002]"],
  "description": "Primary escalators for customer flow"
}
```

---

## 8. Capital Budget Test Data

```json
{
  "equipment_id": "[ELV-001]",
  "budget_year": 2026,
  "planned_budget": 50000,
  "budget_category": "Modernization",
  "priority": "High",
  "justification": "Equipment is 15 years old and requires control system upgrade to improve reliability and energy efficiency",
  "target_date": "2026-06-30",
  "status": "Planned"
}
```

```json
{
  "equipment_id": "[ESC-001]",
  "budget_year": 2027,
  "planned_budget": 120000,
  "budget_category": "Replacement",
  "priority": "Critical",
  "justification": "Escalator approaching end of life, frequent breakdowns, parts availability issues",
  "target_date": "2027-03-31",
  "status": "Under Review"
}
```

```json
{
  "equipment_id": "[ELV-003]",
  "budget_year": 2026,
  "planned_budget": 15000,
  "budget_category": "Component Replacement",
  "priority": "Medium",
  "justification": "Door operators require replacement, currently causing intermittent faults",
  "target_date": "2026-09-30",
  "status": "Approved"
}
```

---

## 9. Brand/Product Test Data

```json
{
  "brand_name": "KONE Corporation",
  "contact_person": "Michael Brown",
  "country_code": "+61",
  "phone": "287654321",
  "email": "contact@kone.com.au",
  "website": "www.kone.com.au",
  "headquarters": "Sydney, Australia"
}
```

```json
{
  "brand_name": "Otis Elevator Company",
  "contact_person": "Lisa Anderson",
  "country_code": "+61",
  "phone": "398765432",
  "email": "info@otis.com.au",
  "website": "www.otis.com.au",
  "headquarters": "Melbourne, Australia"
}
```

```json
{
  "brand_name": "Schindler Group",
  "contact_person": "Peter Schmidt",
  "country_code": "+61",
  "phone": "276543210",
  "email": "contact@schindler.com.au",
  "website": "www.schindler.com.au",
  "headquarters": "Sydney, Australia"
}
```

---

## 10. Callback/Maintenance Sample Data

### Callback (Entrapment)

```json
{
  "equipment_id": "[ELV-001]",
  "callback_type": "Entrapment",
  "priority": "Critical",
  "reported_date": "2026-01-15 14:30:00",
  "description": "Passenger trapped in elevator between floors 12 and 13",
  "reported_by": "Building Security",
  "status": "Resolved",
  "technician_dispatched": "2026-01-15 14:32:00",
  "technician_arrived": "2026-01-15 15:10:00",
  "resolution_time": "2026-01-15 15:45:00",
  "response_time_minutes": 38,
  "target_response_minutes": 60,
  "sla_met": true,
  "root_cause": "Faulty door sensor",
  "action_taken": "Freed passenger safely, replaced door sensor, tested operation"
}
```

### Callback (Equipment Stopped)

```json
{
  "equipment_id": "[ESC-001]",
  "callback_type": "Critical Equipment Stopped",
  "priority": "High",
  "reported_date": "2026-01-20 09:15:00",
  "description": "Escalator stopped unexpectedly, displaying error code E45",
  "reported_by": "Facility Manager",
  "status": "Resolved",
  "technician_dispatched": "2026-01-20 09:20:00",
  "technician_arrived": "2026-01-20 10:45:00",
  "resolution_time": "2026-01-20 12:30:00",
  "response_time_minutes": 90,
  "target_response_minutes": 120,
  "sla_met": true,
  "root_cause": "Step chain misalignment",
  "action_taken": "Realigned step chain, lubricated drive system, ran full operation test"
}
```

### Planned Maintenance

```json
{
  "equipment_id": "[ELV-002]",
  "maintenance_type": "Quarterly Preventive Maintenance",
  "scheduled_date": "2026-02-15 08:00:00",
  "technician": "John Smith - KONE",
  "estimated_duration": "2 hours",
  "status": "Scheduled",
  "checklist": [
    "Inspect ropes and cables",
    "Test safety devices",
    "Lubricate moving parts",
    "Check door operation",
    "Test emergency systems",
    "Adjust leveling",
    "Clean car and pit"
  ]
}
```

---

## 11. Level Configuration (ES Plus)

### Level 1 Data

```json
{
  "level_name": "Region - New South Wales",
  "description": "All NSW properties",
  "parent_level": null
}
```

```json
{
  "level_name": "Region - Victoria",
  "description": "All VIC properties",
  "parent_level": null
}
```

### Level 2 Data

```json
{
  "level_name": "District - Sydney CBD",
  "description": "Central Business District properties",
  "parent_level": "Region - New South Wales"
}
```

```json
{
  "level_name": "District - Parramatta",
  "description": "Western Sydney properties",
  "parent_level": "Region - New South Wales"
}
```

```json
{
  "level_name": "District - Melbourne CBD",
  "description": "Central Melbourne properties",
  "parent_level": "Region - Victoria"
}
```

---

## 12. Cost Information Test Data

```json
{
  "contract_id": "[CTR-2026-001]",
  "cost_type": "Maintenance",
  "amount": 5000,
  "date": "2026-01-15",
  "description": "Quarterly maintenance for 10 elevators",
  "invoice_number": "INV-2026-0015",
  "paid": true
}
```

```json
{
  "contract_id": "[CTR-2026-001]",
  "cost_type": "Repair",
  "amount": 2500,
  "date": "2026-01-20",
  "description": "Emergency repair - door sensor replacement ELV-001",
  "invoice_number": "INV-2026-0023",
  "paid": false
}
```

---

## 13. Password Examples

### Valid Passwords (for testing password change)

- `SecurePass123!`
- `MyNewP@ssw0rd`
- `Testing2026!`
- `Str0ngP@ssword`

### Invalid Passwords (for negative testing)

- `short` (too short)
- `password` (no uppercase, no numbers, no special chars)
- `PASSWORD123` (no lowercase, no special chars)
- `Password` (no numbers, no special chars)

---

## 14. Search Keywords

Use these keywords to test search functionality:

**Clients**: `Acme`, `Global`, `Properties`, `Metro`, `Corp`

**Buildings**: `Tower`, `Complex`, `Plaza`, `Centre`, `Sydney`, `Melbourne`

**Equipment**: `ELV`, `ESC`, `MW`, `KONE`, `Otis`, `Schindler`, `elevator`, `escalator`

**Contracts**: `CTR`, `Annual`, `Maintenance`, `Premium`, `2026`

---

## 15. Date Formats & Ranges

### Valid Date Formats

- `01/01/2026` (DD/MM/YYYY)
- `2026-01-01` (YYYY-MM-DD)
- `Jan 1, 2026`

### Date Ranges for Testing

**Past Dates**: `01/01/2020` to `31/12/2025`  
**Current Dates**: `01/01/2026` to `28/02/2026`  
**Future Dates**: `01/03/2026` to `31/12/2030`

### Contract Date Ranges

**Active Contract**: Start: `01/01/2026`, End: `31/12/2026`  
**Expired Contract**: Start: `01/01/2020`, End: `31/12/2020`  
**Future Contract**: Start: `01/07/2026`, End: `30/06/2027`

---

## 16. File Upload Test Data

### Valid Files

- **Contract Terms PDF**: Upload any PDF < 10MB
- **Equipment Manual**: Upload PDF or Word doc < 5MB
- **Profile Picture**: Upload JPG/PNG < 2MB

### Invalid Files (for negative testing)

- **Oversized File**: File > 50MB (should reject)
- **Wrong Format**: Upload .exe or .zip (should reject)
- **Corrupted File**: Upload corrupted PDF (should handle gracefully)

---

## 17. Testing Credentials Summary

| User Type | Email | Password | Purpose |
|-----------|-------|----------|---------|
| Super Admin | superadmin@test.com | [Provided by admin] | Create all user types; full system access (clients, buildings, equipment, subscriptions, contracts, capital budget) |
| Admin | admin@test.com | [Provided by admin] | Create Client users and perform administrative functions (clients, buildings, equipment, subscriptions, contracts, capital budget); cannot create Admin or Super Admin users |
| Client | client@test.com | [Provided by admin] | Client-side access to dashboard, contracts, equipment; visibility scoped to assigned ES Subscriptions, Level 1/Level 2 and Buildings |
| Manager | manager@test.com | [Provided by admin] | Client-side manager role with the same visibility as `Client` (scoped by ES Subscriptions, levels, buildings) |

**Note**: Replace these with actual credentials provided by the system administrator.

---

## 18. Expected Response Times (for validation)

### Business Hours

| Category | Target | Pass Threshold | Fail Threshold |
|----------|--------|----------------|----------------|
| Entrapment | 1 hour | ≤ 1 hour | > 1 hour |
| Critical Equipment Stopped | 2 hours | ≤ 2 hours | > 2 hours |
| Non-Critical Stopped | 4 hours | ≤ 4 hours | > 4 hours |
| Intermittent Faults | 8 hours | ≤ 8 hours | > 8 hours |
| Aesthetic Faults | Next day | Next business day | > 1 business day |

### After Hours

| Category | Target | Pass Threshold | Fail Threshold |
|----------|--------|----------------|----------------|
| Entrapment | 2 hours | ≤ 2 hours | > 2 hours |
| Critical Equipment Stopped | 4 hours | ≤ 4 hours | > 4 hours |
| Other | Next day | Next business day | > 1 business day |

---

## 19. KPI Target Values (for validation)

| KPI | Target | Pass Threshold | Fail Threshold |
|-----|--------|----------------|----------------|
| Maintenance Visits per Equipment | 12/year | ≥ 12 | < 12 |
| Annual Safety Test Report | 1/year | = 1 | ≠ 1 |
| Rate of Breakdown | ≤ 5% | ≤ 5% | > 5% |
| Minor Response Time | ≤ 4 hours | ≤ 4 hours | > 4 hours |
| Equipment Availability | ≥ 99.5% | ≥ 99.5% | < 99.5% |
| Man Trapped Events | 0/year | = 0 | > 0 |

---

## 20. Browser & Device Test Matrix

| Browser | Version | Resolution | OS | Status |
|---------|---------|------------|----|----- --|
| Chrome | Latest | 1920x1080 | Windows 11 | ⚪ |
| Firefox | Latest | 1920x1080 | Windows 11 | ⚪ |
| Edge | Latest | 1920x1080 | Windows 11 | ⚪ |
| Safari | Latest | 1920x1080 | macOS | ⚪ |
| Chrome Mobile | Latest | 375x667 | iOS | ⚪ |
| Chrome Mobile | Latest | 360x640 | Android | ⚪ |
| iPad | Safari | 768x1024 | iOS | ⚪ |

---

**END OF TEST DATA REFERENCE**

**Last Updated**: February 3, 2026
