#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for RGR Green Energy
Tests all REST API endpoints with real-world scenarios
"""

import requests
import json
import sys
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://green-control-center.preview.emergentagent.com"
API_BASE = f"{BASE_URL}/api"
ADMIN_EMAIL = "admin@rgrgreenenergy.com"
ADMIN_PASSWORD = "RgrAdmin@2025"

# Global state
auth_token: Optional[str] = None
test_results = {
    "passed": 0,
    "failed": 0,
    "errors": []
}

def log_test(name: str, passed: bool, details: str = ""):
    """Log test result"""
    status = "✅ PASS" if passed else "❌ FAIL"
    print(f"{status}: {name}")
    if details:
        print(f"  Details: {details}")
    if passed:
        test_results["passed"] += 1
    else:
        test_results["failed"] += 1
        test_results["errors"].append(f"{name}: {details}")
    print()

def test_auth_login_valid():
    """Test POST /api/auth/login with valid credentials"""
    global auth_token
    try:
        response = requests.post(
            f"{API_BASE}/auth/login",
            json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "token" in data and "user" in data:
                auth_token = data["token"]
                user = data["user"]
                if user.get("email") == ADMIN_EMAIL and user.get("role") == "admin":
                    log_test("Auth: Valid login", True, f"Token received, user role: {user.get('role')}")
                    return True
                else:
                    log_test("Auth: Valid login", False, f"User data incorrect: {user}")
            else:
                log_test("Auth: Valid login", False, f"Missing token or user in response: {data}")
        else:
            log_test("Auth: Valid login", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Auth: Valid login", False, f"Exception: {str(e)}")
    return False

def test_auth_login_invalid_password():
    """Test POST /api/auth/login with wrong password"""
    try:
        response = requests.post(
            f"{API_BASE}/auth/login",
            json={"email": ADMIN_EMAIL, "password": "WrongPassword123"},
            timeout=10
        )
        
        if response.status_code == 401:
            data = response.json()
            if "error" in data:
                log_test("Auth: Invalid password rejection", True, f"Correctly rejected with 401")
                return True
            else:
                log_test("Auth: Invalid password rejection", False, "401 but no error field")
        else:
            log_test("Auth: Invalid password rejection", False, f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_test("Auth: Invalid password rejection", False, f"Exception: {str(e)}")
    return False

def test_auth_login_unknown_email():
    """Test POST /api/auth/login with unknown email"""
    try:
        response = requests.post(
            f"{API_BASE}/auth/login",
            json={"email": "unknown@example.com", "password": "SomePassword"},
            timeout=10
        )
        
        if response.status_code == 401:
            log_test("Auth: Unknown email rejection", True, "Correctly rejected with 401")
            return True
        else:
            log_test("Auth: Unknown email rejection", False, f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_test("Auth: Unknown email rejection", False, f"Exception: {str(e)}")
    return False

def test_admin_me_with_token():
    """Test GET /api/admin/me with valid Bearer token"""
    if not auth_token:
        log_test("Admin: GET /me with token", False, "No auth token available")
        return False
    
    try:
        response = requests.get(
            f"{API_BASE}/admin/me",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if "email" in data and "role" in data and "name" in data:
                log_test("Admin: GET /me with token", True, f"User: {data.get('email')}, Role: {data.get('role')}")
                return True
            else:
                log_test("Admin: GET /me with token", False, f"Missing fields in response: {data}")
        else:
            log_test("Admin: GET /me with token", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Admin: GET /me with token", False, f"Exception: {str(e)}")
    return False

def test_admin_me_without_token():
    """Test GET /api/admin/me without token"""
    try:
        response = requests.get(f"{API_BASE}/admin/me", timeout=10)
        
        if response.status_code == 401:
            log_test("Admin: GET /me without token", True, "Correctly rejected with 401")
            return True
        else:
            log_test("Admin: GET /me without token", False, f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_test("Admin: GET /me without token", False, f"Exception: {str(e)}")
    return False

def test_admin_leads_without_token():
    """Test GET /api/admin/leads without token"""
    try:
        response = requests.get(f"{API_BASE}/admin/leads", timeout=10)
        
        if response.status_code == 401:
            log_test("Admin: GET /leads without token", True, "Correctly rejected with 401")
            return True
        else:
            log_test("Admin: GET /leads without token", False, f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_test("Admin: GET /leads without token", False, f"Exception: {str(e)}")
    return False

def test_calculator_residential_ongrid():
    """Test POST /api/calculator/compute - RESIDENTIAL + ON_GRID with subsidy"""
    try:
        payload = {
            "customerType": "RESIDENTIAL",
            "systemType": "ON_GRID",
            "bill": 4500,
            "billFrequency": "MONTHLY"
        }
        response = requests.post(
            f"{API_BASE}/calculator/compute",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = [
                "recommendedKWp", "annualGenerationYear1", "monthlySavings",
                "annualSavings", "lifetimeSavings", "co2MitigatedKgPerYear",
                "treesEquivalent", "estimatedCost", "subsidy", "netInvestment",
                "paybackYears"
            ]
            
            missing = [f for f in required_fields if f not in data]
            if missing:
                log_test("Calculator: RESIDENTIAL ON_GRID", False, f"Missing fields: {missing}")
                return False
            
            # Verify subsidy is present for residential on-grid
            if data.get("subsidy", 0) > 0:
                # Verify reasonable values
                if (data.get("recommendedKWp", 0) > 0 and
                    data.get("annualGenerationYear1", 0) > 0 and
                    data.get("monthlySavings", 0) > 0 and
                    data.get("paybackYears", 0) > 0):
                    log_test("Calculator: RESIDENTIAL ON_GRID", True, 
                            f"kWp: {data.get('recommendedKWp'):.1f}, Subsidy: ₹{data.get('subsidy'):,.0f}, Payback: {data.get('paybackYears'):.1f}yr")
                    return True
                else:
                    log_test("Calculator: RESIDENTIAL ON_GRID", False, f"Invalid values in response: {data}")
            else:
                log_test("Calculator: RESIDENTIAL ON_GRID", False, f"Subsidy should be > 0 for residential on-grid, got: {data.get('subsidy')}")
        else:
            log_test("Calculator: RESIDENTIAL ON_GRID", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Calculator: RESIDENTIAL ON_GRID", False, f"Exception: {str(e)}")
    return False

def test_calculator_residential_offgrid():
    """Test POST /api/calculator/compute - RESIDENTIAL + OFF_GRID (no subsidy)"""
    try:
        payload = {
            "customerType": "RESIDENTIAL",
            "systemType": "OFF_GRID",
            "bill": 4500,
            "billFrequency": "MONTHLY"
        }
        response = requests.post(
            f"{API_BASE}/calculator/compute",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("subsidy", -1) == 0:
                log_test("Calculator: RESIDENTIAL OFF_GRID", True, "Subsidy correctly 0 for off-grid")
                return True
            else:
                log_test("Calculator: RESIDENTIAL OFF_GRID", False, f"Subsidy should be 0 for off-grid, got: {data.get('subsidy')}")
        else:
            log_test("Calculator: RESIDENTIAL OFF_GRID", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Calculator: RESIDENTIAL OFF_GRID", False, f"Exception: {str(e)}")
    return False

def test_calculator_residential_hybrid():
    """Test POST /api/calculator/compute - RESIDENTIAL + HYBRID (no subsidy)"""
    try:
        payload = {
            "customerType": "RESIDENTIAL",
            "systemType": "HYBRID",
            "bill": 4500,
            "billFrequency": "MONTHLY"
        }
        response = requests.post(
            f"{API_BASE}/calculator/compute",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("subsidy", -1) == 0:
                log_test("Calculator: RESIDENTIAL HYBRID", True, "Subsidy correctly 0 for hybrid")
                return True
            else:
                log_test("Calculator: RESIDENTIAL HYBRID", False, f"Subsidy should be 0 for hybrid, got: {data.get('subsidy')}")
        else:
            log_test("Calculator: RESIDENTIAL HYBRID", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Calculator: RESIDENTIAL HYBRID", False, f"Exception: {str(e)}")
    return False

def test_calculator_commercial_ongrid():
    """Test POST /api/calculator/compute - COMMERCIAL + ON_GRID (no subsidy)"""
    try:
        payload = {
            "customerType": "COMMERCIAL",
            "systemType": "ON_GRID",
            "bill": 50000,
            "billFrequency": "MONTHLY"
        }
        response = requests.post(
            f"{API_BASE}/calculator/compute",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("subsidy", -1) == 0:
                log_test("Calculator: COMMERCIAL ON_GRID", True, "Subsidy correctly 0 for commercial")
                return True
            else:
                log_test("Calculator: COMMERCIAL ON_GRID", False, f"Subsidy should be 0 for commercial, got: {data.get('subsidy')}")
        else:
            log_test("Calculator: COMMERCIAL ON_GRID", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Calculator: COMMERCIAL ON_GRID", False, f"Exception: {str(e)}")
    return False

def test_calculator_industrial_ongrid():
    """Test POST /api/calculator/compute - INDUSTRIAL + ON_GRID (no subsidy, large kWp)"""
    try:
        payload = {
            "customerType": "INDUSTRIAL",
            "systemType": "ON_GRID",
            "bill": 100000,
            "billFrequency": "MONTHLY"
        }
        response = requests.post(
            f"{API_BASE}/calculator/compute",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("subsidy", -1) == 0 and data.get("recommendedKWp", 0) > 50:
                log_test("Calculator: INDUSTRIAL ON_GRID", True, 
                        f"Subsidy 0, Large kWp: {data.get('recommendedKWp'):.1f}")
                return True
            else:
                log_test("Calculator: INDUSTRIAL ON_GRID", False, 
                        f"Expected subsidy=0 and large kWp, got subsidy={data.get('subsidy')}, kWp={data.get('recommendedKWp')}")
        else:
            log_test("Calculator: INDUSTRIAL ON_GRID", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Calculator: INDUSTRIAL ON_GRID", False, f"Exception: {str(e)}")
    return False

def test_calculator_agriculture_offgrid():
    """Test POST /api/calculator/compute - AGRICULTURE + OFF_GRID (no subsidy)"""
    try:
        payload = {
            "customerType": "AGRICULTURE",
            "systemType": "OFF_GRID",
            "bill": 3000,
            "billFrequency": "MONTHLY"
        }
        response = requests.post(
            f"{API_BASE}/calculator/compute",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("subsidy", -1) == 0:
                log_test("Calculator: AGRICULTURE OFF_GRID", True, "Subsidy correctly 0")
                return True
            else:
                log_test("Calculator: AGRICULTURE OFF_GRID", False, f"Subsidy should be 0, got: {data.get('subsidy')}")
        else:
            log_test("Calculator: AGRICULTURE OFF_GRID", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Calculator: AGRICULTURE OFF_GRID", False, f"Exception: {str(e)}")
    return False

def test_calculator_quarterly_billing():
    """Test POST /api/calculator/compute - QUARTERLY billing frequency"""
    try:
        payload = {
            "customerType": "RESIDENTIAL",
            "systemType": "ON_GRID",
            "bill": 13500,  # 3 months worth
            "billFrequency": "QUARTERLY"
        }
        response = requests.post(
            f"{API_BASE}/calculator/compute",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            # Should give similar result to monthly 4500
            if 6 <= data.get("recommendedKWp", 0) <= 9:
                log_test("Calculator: QUARTERLY billing", True, 
                        f"kWp: {data.get('recommendedKWp'):.1f} (similar to monthly 4500)")
                return True
            else:
                log_test("Calculator: QUARTERLY billing", False, 
                        f"Expected kWp 6-9, got: {data.get('recommendedKWp')}")
        else:
            log_test("Calculator: QUARTERLY billing", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Calculator: QUARTERLY billing", False, f"Exception: {str(e)}")
    return False

def test_calculator_with_lead_capture():
    """Test POST /api/calculator/compute with contact info (lead capture)"""
    try:
        payload = {
            "customerType": "RESIDENTIAL",
            "systemType": "ON_GRID",
            "bill": 5000,
            "billFrequency": "MONTHLY",
            "name": "Rajesh Kumar",
            "phone": "9876543210",
            "email": "rajesh.kumar@example.com",
            "location": "Siliguri, West Bengal"
        }
        response = requests.post(
            f"{API_BASE}/calculator/compute",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            # Now check if lead was captured
            if auth_token:
                leads_response = requests.get(
                    f"{API_BASE}/admin/leads",
                    headers={"Authorization": f"Bearer {auth_token}"},
                    timeout=10
                )
                if leads_response.status_code == 200:
                    leads = leads_response.json()
                    calculator_leads = [l for l in leads if l.get("source") == "CALCULATOR" and l.get("email") == "rajesh.kumar@example.com"]
                    if calculator_leads:
                        log_test("Calculator: Lead capture", True, f"Lead captured with source=CALCULATOR")
                        return True
                    else:
                        log_test("Calculator: Lead capture", False, "Lead not found in database")
                else:
                    log_test("Calculator: Lead capture", False, f"Could not fetch leads: {leads_response.status_code}")
            else:
                log_test("Calculator: Lead capture", False, "No auth token to verify lead")
        else:
            log_test("Calculator: Lead capture", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Calculator: Lead capture", False, f"Exception: {str(e)}")
    return False

def test_calculator_edge_case_zero_bill():
    """Test POST /api/calculator/compute with bill=0"""
    try:
        payload = {
            "customerType": "RESIDENTIAL",
            "systemType": "ON_GRID",
            "bill": 0,
            "billFrequency": "MONTHLY"
        }
        response = requests.post(
            f"{API_BASE}/calculator/compute",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            # Should not throw, should return non-negative values
            if data.get("recommendedKWp", -1) >= 0:
                log_test("Calculator: Edge case bill=0", True, "Handled gracefully without error")
                return True
            else:
                log_test("Calculator: Edge case bill=0", False, f"Negative values returned: {data}")
        else:
            log_test("Calculator: Edge case bill=0", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Calculator: Edge case bill=0", False, f"Exception: {str(e)}")
    return False

def test_calculator_settings_get():
    """Test GET /api/calculator/settings (public)"""
    try:
        response = requests.get(f"{API_BASE}/calculator/settings", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["tariffs", "subsidy", "performanceRatio"]
            missing = [f for f in required_fields if f not in data]
            if not missing:
                log_test("Calculator Settings: GET public", True, "All required fields present")
                return True
            else:
                log_test("Calculator Settings: GET public", False, f"Missing fields: {missing}")
        else:
            log_test("Calculator Settings: GET public", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Calculator Settings: GET public", False, f"Exception: {str(e)}")
    return False

def test_calculator_settings_update():
    """Test PUT /api/admin/calculator (admin) - update and restore"""
    if not auth_token:
        log_test("Calculator Settings: PUT admin", False, "No auth token available")
        return False
    
    try:
        # First get current settings
        get_response = requests.get(f"{API_BASE}/calculator/settings", timeout=10)
        if get_response.status_code != 200:
            log_test("Calculator Settings: PUT admin", False, "Could not fetch current settings")
            return False
        
        original_settings = get_response.json()
        original_tariff = original_settings.get("tariffs", {}).get("RESIDENTIAL", 0)
        
        # Update tariff
        new_tariff = 8.5
        update_payload = {
            "tariffs": {
                **original_settings.get("tariffs", {}),
                "RESIDENTIAL": new_tariff
            }
        }
        
        put_response = requests.put(
            f"{API_BASE}/admin/calculator",
            json=update_payload,
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if put_response.status_code == 200:
            # Verify change
            verify_response = requests.get(f"{API_BASE}/calculator/settings", timeout=10)
            if verify_response.status_code == 200:
                updated_data = verify_response.json()
                if updated_data.get("tariffs", {}).get("RESIDENTIAL") == new_tariff:
                    # Restore original
                    restore_payload = {
                        "tariffs": {
                            **updated_data.get("tariffs", {}),
                            "RESIDENTIAL": original_tariff
                        }
                    }
                    requests.put(
                        f"{API_BASE}/admin/calculator",
                        json=restore_payload,
                        headers={"Authorization": f"Bearer {auth_token}"},
                        timeout=10
                    )
                    log_test("Calculator Settings: PUT admin", True, 
                            f"Updated tariff to {new_tariff}, verified, and restored to {original_tariff}")
                    return True
                else:
                    log_test("Calculator Settings: PUT admin", False, "Update not reflected in GET")
            else:
                log_test("Calculator Settings: PUT admin", False, "Could not verify update")
        else:
            log_test("Calculator Settings: PUT admin", False, f"Status {put_response.status_code}: {put_response.text}")
    except Exception as e:
        log_test("Calculator Settings: PUT admin", False, f"Exception: {str(e)}")
    return False

def test_calculator_settings_update_without_token():
    """Test PUT /api/admin/calculator without token"""
    try:
        response = requests.put(
            f"{API_BASE}/admin/calculator",
            json={"tariffs": {"RESIDENTIAL": 9.0}},
            timeout=10
        )
        
        if response.status_code == 401:
            log_test("Calculator Settings: PUT without token", True, "Correctly rejected with 401")
            return True
        else:
            log_test("Calculator Settings: PUT without token", False, f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_test("Calculator Settings: PUT without token", False, f"Exception: {str(e)}")
    return False

def test_lead_create_contact():
    """Test POST /api/leads with source=CONTACT"""
    try:
        payload = {
            "name": "Priya Sharma",
            "phone": "9123456789",
            "email": "priya.sharma@example.com",
            "message": "Interested in solar installation for my home",
            "source": "CONTACT"
        }
        response = requests.post(
            f"{API_BASE}/leads",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok") and data.get("id"):
                log_test("Lead: Create CONTACT", True, f"Lead created with ID: {data.get('id')}")
                return True
            else:
                log_test("Lead: Create CONTACT", False, f"Missing ok or id in response: {data}")
        else:
            log_test("Lead: Create CONTACT", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Lead: Create CONTACT", False, f"Exception: {str(e)}")
    return False

def test_lead_create_proposal():
    """Test POST /api/leads with source=PROPOSAL"""
    try:
        payload = {
            "name": "Amit Patel",
            "phone": "9234567890",
            "email": "amit.patel@example.com",
            "message": "Need proposal for 50kW commercial system",
            "source": "PROPOSAL"
        }
        response = requests.post(
            f"{API_BASE}/leads",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok"):
                log_test("Lead: Create PROPOSAL", True, "Lead captured")
                return True
            else:
                log_test("Lead: Create PROPOSAL", False, f"Response: {data}")
        else:
            log_test("Lead: Create PROPOSAL", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Lead: Create PROPOSAL", False, f"Exception: {str(e)}")
    return False

def test_lead_create_call_request():
    """Test POST /api/leads with source=CALL_REQUEST"""
    try:
        payload = {
            "name": "Sunita Reddy",
            "phone": "9345678901",
            "email": "sunita.reddy@example.com",
            "source": "CALL_REQUEST"
        }
        response = requests.post(
            f"{API_BASE}/leads",
            json=payload,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("ok"):
                log_test("Lead: Create CALL_REQUEST", True, "Lead captured")
                return True
            else:
                log_test("Lead: Create CALL_REQUEST", False, f"Response: {data}")
        else:
            log_test("Lead: Create CALL_REQUEST", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Lead: Create CALL_REQUEST", False, f"Exception: {str(e)}")
    return False

def test_lead_list_admin():
    """Test GET /api/admin/leads (admin)"""
    if not auth_token:
        log_test("Lead: List admin", False, "No auth token available")
        return False
    
    try:
        response = requests.get(
            f"{API_BASE}/admin/leads",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test("Lead: List admin", True, f"Retrieved {len(data)} leads")
                return True
            else:
                log_test("Lead: List admin", False, f"Expected array, got: {type(data)}")
        else:
            log_test("Lead: List admin", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Lead: List admin", False, f"Exception: {str(e)}")
    return False

def test_lead_update_status():
    """Test PUT /api/admin/leads/{id} - update status"""
    if not auth_token:
        log_test("Lead: Update status", False, "No auth token available")
        return False
    
    try:
        # First get a lead
        leads_response = requests.get(
            f"{API_BASE}/admin/leads",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if leads_response.status_code != 200:
            log_test("Lead: Update status", False, "Could not fetch leads")
            return False
        
        leads = leads_response.json()
        if not leads:
            log_test("Lead: Update status", False, "No leads available to update")
            return False
        
        lead_id = leads[0]["_id"]
        
        # Update status
        update_response = requests.put(
            f"{API_BASE}/admin/leads/{lead_id}",
            json={"status": "CONTACTED"},
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if update_response.status_code == 200:
            updated_lead = update_response.json()
            if updated_lead.get("status") == "CONTACTED":
                log_test("Lead: Update status", True, f"Status updated to CONTACTED for lead {lead_id}")
                return True
            else:
                log_test("Lead: Update status", False, f"Status not updated: {updated_lead.get('status')}")
        else:
            log_test("Lead: Update status", False, f"Status {update_response.status_code}: {update_response.text}")
    except Exception as e:
        log_test("Lead: Update status", False, f"Exception: {str(e)}")
    return False

def test_lead_update_notes():
    """Test PUT /api/admin/leads/{id} - update notes"""
    if not auth_token:
        log_test("Lead: Update notes", False, "No auth token available")
        return False
    
    try:
        # Get a lead
        leads_response = requests.get(
            f"{API_BASE}/admin/leads",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if leads_response.status_code != 200:
            log_test("Lead: Update notes", False, "Could not fetch leads")
            return False
        
        leads = leads_response.json()
        if not leads:
            log_test("Lead: Update notes", False, "No leads available")
            return False
        
        lead_id = leads[0]["_id"]
        test_note = "Follow up scheduled for next week"
        
        # Update notes
        update_response = requests.put(
            f"{API_BASE}/admin/leads/{lead_id}",
            json={"notes": test_note},
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if update_response.status_code == 200:
            updated_lead = update_response.json()
            if updated_lead.get("notes") == test_note:
                log_test("Lead: Update notes", True, "Notes updated successfully")
                return True
            else:
                log_test("Lead: Update notes", False, f"Notes not updated correctly")
        else:
            log_test("Lead: Update notes", False, f"Status {update_response.status_code}: {update_response.text}")
    except Exception as e:
        log_test("Lead: Update notes", False, f"Exception: {str(e)}")
    return False

def test_cms_projects_list():
    """Test GET /api/projects (public)"""
    try:
        response = requests.get(f"{API_BASE}/projects", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                log_test("CMS: Projects list", True, f"Retrieved {len(data)} projects")
                return True
            else:
                log_test("CMS: Projects list", False, f"Expected non-empty array, got: {data}")
        else:
            log_test("CMS: Projects list", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("CMS: Projects list", False, f"Exception: {str(e)}")
    return False

def test_cms_project_by_slug():
    """Test GET /api/projects/{slug}"""
    try:
        # First get list to find a slug
        list_response = requests.get(f"{API_BASE}/projects", timeout=10)
        if list_response.status_code != 200:
            log_test("CMS: Project by slug", False, "Could not fetch project list")
            return False
        
        projects = list_response.json()
        if not projects:
            log_test("CMS: Project by slug", False, "No projects available")
            return False
        
        slug = projects[0].get("slug")
        if not slug:
            log_test("CMS: Project by slug", False, "Project has no slug")
            return False
        
        # Get by slug
        response = requests.get(f"{API_BASE}/projects/{slug}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("slug") == slug:
                log_test("CMS: Project by slug", True, f"Retrieved project: {slug}")
                return True
            else:
                log_test("CMS: Project by slug", False, f"Slug mismatch")
        else:
            log_test("CMS: Project by slug", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("CMS: Project by slug", False, f"Exception: {str(e)}")
    return False

def test_cms_project_unknown_slug():
    """Test GET /api/projects/{unknown-slug} - should return 404"""
    try:
        response = requests.get(f"{API_BASE}/projects/unknown-nonexistent-slug-12345", timeout=10)
        
        if response.status_code == 404:
            log_test("CMS: Project unknown slug", True, "Correctly returned 404")
            return True
        else:
            log_test("CMS: Project unknown slug", False, f"Expected 404, got {response.status_code}")
    except Exception as e:
        log_test("CMS: Project unknown slug", False, f"Exception: {str(e)}")
    return False

def test_cms_blogs_list():
    """Test GET /api/blogs (public)"""
    try:
        response = requests.get(f"{API_BASE}/blogs", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                log_test("CMS: Blogs list", True, f"Retrieved {len(data)} blogs")
                return True
            else:
                log_test("CMS: Blogs list", False, f"Expected non-empty array")
        else:
            log_test("CMS: Blogs list", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("CMS: Blogs list", False, f"Exception: {str(e)}")
    return False

def test_cms_blog_by_slug():
    """Test GET /api/blogs/{slug}"""
    try:
        # Get list first
        list_response = requests.get(f"{API_BASE}/blogs", timeout=10)
        if list_response.status_code != 200:
            log_test("CMS: Blog by slug", False, "Could not fetch blog list")
            return False
        
        blogs = list_response.json()
        if not blogs:
            log_test("CMS: Blog by slug", False, "No blogs available")
            return False
        
        slug = blogs[0].get("slug")
        
        # Get by slug
        response = requests.get(f"{API_BASE}/blogs/{slug}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if data.get("slug") == slug:
                log_test("CMS: Blog by slug", True, f"Retrieved blog: {slug}")
                return True
            else:
                log_test("CMS: Blog by slug", False, "Slug mismatch")
        else:
            log_test("CMS: Blog by slug", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("CMS: Blog by slug", False, f"Exception: {str(e)}")
    return False

def test_cms_testimonials_list():
    """Test GET /api/testimonials (public)"""
    try:
        response = requests.get(f"{API_BASE}/testimonials", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test("CMS: Testimonials list", True, f"Retrieved {len(data)} testimonials")
                return True
            else:
                log_test("CMS: Testimonials list", False, "Expected array")
        else:
            log_test("CMS: Testimonials list", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("CMS: Testimonials list", False, f"Exception: {str(e)}")
    return False

def test_cms_faqs_list():
    """Test GET /api/faqs (public)"""
    try:
        response = requests.get(f"{API_BASE}/faqs", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test("CMS: FAQs list", True, f"Retrieved {len(data)} FAQs")
                return True
            else:
                log_test("CMS: FAQs list", False, "Expected array")
        else:
            log_test("CMS: FAQs list", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("CMS: FAQs list", False, f"Exception: {str(e)}")
    return False

def test_cms_solutions_list():
    """Test GET /api/solutions (public)"""
    try:
        response = requests.get(f"{API_BASE}/solutions", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test("CMS: Solutions list", True, f"Retrieved {len(data)} solutions")
                return True
            else:
                log_test("CMS: Solutions list", False, "Expected array")
        else:
            log_test("CMS: Solutions list", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("CMS: Solutions list", False, f"Exception: {str(e)}")
    return False

def test_cms_create_project():
    """Test POST /api/admin/projects (admin)"""
    if not auth_token:
        log_test("CMS: Create project", False, "No auth token available")
        return False
    
    try:
        payload = {
            "title": "Test Solar Project",
            "slug": f"test-project-{int(requests.get('http://worldtimeapi.org/api/timezone/Etc/UTC').json()['unixtime'])}",
            "location": "Test City",
            "capacity": "10 kWp",
            "customerType": "RESIDENTIAL",
            "systemType": "ON_GRID",
            "completionYear": 2025,
            "featured": False,
            "description": "Test project description"
        }
        
        response = requests.post(
            f"{API_BASE}/admin/projects",
            json=payload,
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if data.get("_id") and data.get("slug") == payload["slug"]:
                log_test("CMS: Create project", True, f"Project created with ID: {data.get('_id')}")
                return True
            else:
                log_test("CMS: Create project", False, f"Response missing _id or slug: {data}")
        else:
            log_test("CMS: Create project", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("CMS: Create project", False, f"Exception: {str(e)}")
    return False

def test_cms_update_project():
    """Test PUT /api/admin/projects/{id} (admin)"""
    if not auth_token:
        log_test("CMS: Update project", False, "No auth token available")
        return False
    
    try:
        # Get projects
        list_response = requests.get(
            f"{API_BASE}/admin/projects",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if list_response.status_code != 200:
            log_test("CMS: Update project", False, "Could not fetch projects")
            return False
        
        projects = list_response.json()
        if not projects:
            log_test("CMS: Update project", False, "No projects available")
            return False
        
        project_id = projects[0]["_id"]
        
        # Update
        update_response = requests.put(
            f"{API_BASE}/admin/projects/{project_id}",
            json={"featured": True},
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if update_response.status_code == 200:
            updated = update_response.json()
            if updated.get("featured") == True:
                log_test("CMS: Update project", True, f"Project {project_id} updated")
                return True
            else:
                log_test("CMS: Update project", False, "Update not reflected")
        else:
            log_test("CMS: Update project", False, f"Status {update_response.status_code}: {update_response.text}")
    except Exception as e:
        log_test("CMS: Update project", False, f"Exception: {str(e)}")
    return False

def test_cms_delete_project():
    """Test DELETE /api/admin/projects/{id} (admin)"""
    if not auth_token:
        log_test("CMS: Delete project", False, "No auth token available")
        return False
    
    try:
        # Create a test project first
        create_payload = {
            "title": "Project to Delete",
            "slug": f"delete-test-{int(requests.get('http://worldtimeapi.org/api/timezone/Etc/UTC').json()['unixtime'])}",
            "location": "Test",
            "capacity": "5 kWp",
            "customerType": "RESIDENTIAL",
            "completionYear": 2025
        }
        
        create_response = requests.post(
            f"{API_BASE}/admin/projects",
            json=create_payload,
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if create_response.status_code != 200:
            log_test("CMS: Delete project", False, "Could not create test project")
            return False
        
        project_id = create_response.json()["_id"]
        
        # Delete
        delete_response = requests.delete(
            f"{API_BASE}/admin/projects/{project_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if delete_response.status_code == 200:
            data = delete_response.json()
            if data.get("ok"):
                # Verify deletion
                verify_response = requests.get(f"{API_BASE}/projects", timeout=10)
                if verify_response.status_code == 200:
                    projects = verify_response.json()
                    if not any(p.get("_id") == project_id for p in projects):
                        log_test("CMS: Delete project", True, f"Project {project_id} deleted")
                        return True
                    else:
                        log_test("CMS: Delete project", False, "Project still exists after deletion")
                else:
                    log_test("CMS: Delete project", False, "Could not verify deletion")
            else:
                log_test("CMS: Delete project", False, f"Response: {data}")
        else:
            log_test("CMS: Delete project", False, f"Status {delete_response.status_code}: {delete_response.text}")
    except Exception as e:
        log_test("CMS: Delete project", False, f"Exception: {str(e)}")
    return False

def test_cms_crud_without_auth():
    """Test POST /api/admin/projects without auth"""
    try:
        response = requests.post(
            f"{API_BASE}/admin/projects",
            json={"title": "Unauthorized Test"},
            timeout=10
        )
        
        if response.status_code == 401:
            log_test("CMS: CRUD without auth", True, "Correctly rejected with 401")
            return True
        else:
            log_test("CMS: CRUD without auth", False, f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_test("CMS: CRUD without auth", False, f"Exception: {str(e)}")
    return False

def test_website_settings_get():
    """Test GET /api/settings (public)"""
    try:
        response = requests.get(f"{API_BASE}/settings", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["brand", "contact", "nav", "home", "about", "seo", "footer"]
            missing = [f for f in required_fields if f not in data]
            if not missing:
                log_test("Website Settings: GET public", True, "All required fields present")
                return True
            else:
                log_test("Website Settings: GET public", False, f"Missing fields: {missing}")
        else:
            log_test("Website Settings: GET public", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Website Settings: GET public", False, f"Exception: {str(e)}")
    return False

def test_website_settings_update():
    """Test PUT /api/admin/settings (admin) - update and restore"""
    if not auth_token:
        log_test("Website Settings: PUT admin", False, "No auth token available")
        return False
    
    try:
        # Get current settings
        get_response = requests.get(f"{API_BASE}/settings", timeout=10)
        if get_response.status_code != 200:
            log_test("Website Settings: PUT admin", False, "Could not fetch current settings")
            return False
        
        original_settings = get_response.json()
        original_tagline = original_settings.get("brand", {}).get("tagline", "")
        
        # Update tagline
        new_tagline = "Test Tagline - Solar Energy Solutions"
        update_payload = {
            "brand": {
                **original_settings.get("brand", {}),
                "tagline": new_tagline
            }
        }
        
        put_response = requests.put(
            f"{API_BASE}/admin/settings",
            json=update_payload,
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if put_response.status_code == 200:
            # Verify
            verify_response = requests.get(f"{API_BASE}/settings", timeout=10)
            if verify_response.status_code == 200:
                updated_data = verify_response.json()
                if updated_data.get("brand", {}).get("tagline") == new_tagline:
                    # Restore
                    restore_payload = {
                        "brand": {
                            **updated_data.get("brand", {}),
                            "tagline": original_tagline
                        }
                    }
                    requests.put(
                        f"{API_BASE}/admin/settings",
                        json=restore_payload,
                        headers={"Authorization": f"Bearer {auth_token}"},
                        timeout=10
                    )
                    log_test("Website Settings: PUT admin", True, "Updated, verified, and restored tagline")
                    return True
                else:
                    log_test("Website Settings: PUT admin", False, "Update not reflected")
            else:
                log_test("Website Settings: PUT admin", False, "Could not verify update")
        else:
            log_test("Website Settings: PUT admin", False, f"Status {put_response.status_code}: {put_response.text}")
    except Exception as e:
        log_test("Website Settings: PUT admin", False, f"Exception: {str(e)}")
    return False

def test_dashboard_stats():
    """Test GET /api/admin/stats (admin)"""
    if not auth_token:
        log_test("Dashboard: Stats", False, "No auth token available")
        return False
    
    try:
        response = requests.get(
            f"{API_BASE}/admin/stats",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["leads", "projects", "blogs", "testimonials", "todayLeads", "bySource", "byStatus", "recentLeads"]
            missing = [f for f in required_fields if f not in data]
            if not missing:
                log_test("Dashboard: Stats", True, 
                        f"Leads: {data.get('leads')}, Projects: {data.get('projects')}, Today: {data.get('todayLeads')}")
                return True
            else:
                log_test("Dashboard: Stats", False, f"Missing fields: {missing}")
        else:
            log_test("Dashboard: Stats", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Dashboard: Stats", False, f"Exception: {str(e)}")
    return False

def test_sitemap_xml():
    """Test GET /sitemap.xml"""
    try:
        response = requests.get(f"{BASE_URL}/sitemap.xml", timeout=10)
        
        if response.status_code == 200:
            content = response.text
            if "<?xml" in content and "<urlset" in content:
                # Check for key URLs
                required_urls = ["/", "/about", "/solutions", "/projects", "/calculator", "/blog", "/contact"]
                missing = [u for u in required_urls if u not in content]
                if not missing:
                    log_test("SEO: sitemap.xml", True, "Valid XML with all required URLs")
                    return True
                else:
                    log_test("SEO: sitemap.xml", False, f"Missing URLs: {missing}")
            else:
                log_test("SEO: sitemap.xml", False, "Invalid XML format")
        else:
            log_test("SEO: sitemap.xml", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("SEO: sitemap.xml", False, f"Exception: {str(e)}")
    return False

def test_robots_txt():
    """Test GET /robots.txt"""
    try:
        response = requests.get(f"{BASE_URL}/robots.txt", timeout=10)
        
        if response.status_code == 200:
            content = response.text
            if "Disallow: /admin" in content and "Sitemap:" in content:
                log_test("SEO: robots.txt", True, "Valid robots.txt with admin disallow and sitemap")
                return True
            else:
                log_test("SEO: robots.txt", False, f"Missing required directives. Content: {content}")
        else:
            log_test("SEO: robots.txt", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("SEO: robots.txt", False, f"Exception: {str(e)}")
    return False

def test_unknown_endpoint():
    """Test GET /api/unknown-endpoint - should return 404"""
    try:
        response = requests.get(f"{API_BASE}/unknown-endpoint-12345", timeout=10)
        
        if response.status_code == 404:
            log_test("Edge Case: Unknown endpoint", True, "Correctly returned 404")
            return True
        else:
            log_test("Edge Case: Unknown endpoint", False, f"Expected 404, got {response.status_code}")
    except Exception as e:
        log_test("Edge Case: Unknown endpoint", False, f"Exception: {str(e)}")
    return False

def main():
    """Run all tests"""
    print("=" * 80)
    print("RGR GREEN ENERGY - COMPREHENSIVE BACKEND API TEST SUITE")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print(f"API Base: {API_BASE}")
    print("=" * 80)
    print()
    
    # 1. AUTHENTICATION TESTS
    print("=" * 80)
    print("1. AUTHENTICATION TESTS")
    print("=" * 80)
    test_auth_login_valid()
    test_auth_login_invalid_password()
    test_auth_login_unknown_email()
    test_admin_me_with_token()
    test_admin_me_without_token()
    test_admin_leads_without_token()
    
    # 2. SOLAR CALCULATOR ENGINE TESTS
    print("=" * 80)
    print("2. SOLAR CALCULATOR ENGINE TESTS")
    print("=" * 80)
    test_calculator_residential_ongrid()
    test_calculator_residential_offgrid()
    test_calculator_residential_hybrid()
    test_calculator_commercial_ongrid()
    test_calculator_industrial_ongrid()
    test_calculator_agriculture_offgrid()
    test_calculator_quarterly_billing()
    test_calculator_with_lead_capture()
    test_calculator_edge_case_zero_bill()
    
    # 3. CALCULATOR SETTINGS TESTS
    print("=" * 80)
    print("3. CALCULATOR SETTINGS TESTS")
    print("=" * 80)
    test_calculator_settings_get()
    test_calculator_settings_update()
    test_calculator_settings_update_without_token()
    
    # 4. LEAD MANAGEMENT TESTS
    print("=" * 80)
    print("4. LEAD MANAGEMENT (CRM) TESTS")
    print("=" * 80)
    test_lead_create_contact()
    test_lead_create_proposal()
    test_lead_create_call_request()
    test_lead_list_admin()
    test_lead_update_status()
    test_lead_update_notes()
    
    # 5. CMS CRUD TESTS
    print("=" * 80)
    print("5. CMS CRUD TESTS")
    print("=" * 80)
    test_cms_projects_list()
    test_cms_project_by_slug()
    test_cms_project_unknown_slug()
    test_cms_blogs_list()
    test_cms_blog_by_slug()
    test_cms_testimonials_list()
    test_cms_faqs_list()
    test_cms_solutions_list()
    test_cms_create_project()
    test_cms_update_project()
    test_cms_delete_project()
    test_cms_crud_without_auth()
    
    # 6. WEBSITE SETTINGS TESTS
    print("=" * 80)
    print("6. WEBSITE SETTINGS TESTS")
    print("=" * 80)
    test_website_settings_get()
    test_website_settings_update()
    
    # 7. DASHBOARD STATS TESTS
    print("=" * 80)
    print("7. DASHBOARD STATS TESTS")
    print("=" * 80)
    test_dashboard_stats()
    
    # 8. SEO ARTIFACTS TESTS
    print("=" * 80)
    print("8. SEO ARTIFACTS TESTS")
    print("=" * 80)
    test_sitemap_xml()
    test_robots_txt()
    
    # 9. EDGE CASES
    print("=" * 80)
    print("9. EDGE CASE TESTS")
    print("=" * 80)
    test_unknown_endpoint()
    
    # SUMMARY
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    total = test_results["passed"] + test_results["failed"]
    print(f"Total Tests: {total}")
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    print(f"Success Rate: {(test_results['passed']/total*100):.1f}%")
    print("=" * 80)
    
    if test_results["failed"] > 0:
        print("\nFAILED TESTS:")
        for error in test_results["errors"]:
            print(f"  - {error}")
        print()
    
    return 0 if test_results["failed"] == 0 else 1

if __name__ == "__main__":
    sys.exit(main())
