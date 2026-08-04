#!/usr/bin/env python3
"""
Comprehensive Backend API Test Suite for RGR Green Energy
Tests all REST API endpoints including new production features
"""

import requests
import json
import sys
import time
from io import BytesIO
from PIL import Image
from typing import Dict, Any, Optional

# Configuration
BASE_URL = "https://7b961336-ca5b-434b-b088-91b4d0fc4528.preview.emergentagent.com"
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

def create_test_image():
    """Create a small test PNG image in memory"""
    img = Image.new('RGB', (100, 100), color='green')
    buf = BytesIO()
    img.save(buf, format='PNG')
    buf.seek(0)
    return buf.getvalue()

# ============================================================================
# NEW PRODUCTION FEATURES TESTS
# ============================================================================

def test_media_upload_with_auth():
    """Test POST /api/admin/media/upload with multipart form-data and Bearer token"""
    if not auth_token:
        log_test("Media: Upload with auth", False, "No auth token available")
        return False
    
    try:
        # Create a small test image
        image_bytes = create_test_image()
        
        files = {
            'file': ('test_solar_panel.png', image_bytes, 'image/png')
        }
        
        response = requests.post(
            f"{API_BASE}/admin/media/upload",
            files=files,
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=15
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ["_id", "filename", "originalName", "mimeType", "size", "url", "createdAt"]
            missing = [f for f in required_fields if f not in data]
            
            if missing:
                log_test("Media: Upload with auth", False, f"Missing fields: {missing}")
                return False
            
            # Verify URL starts with /uploads/
            if not data.get("url", "").startswith("/uploads/"):
                log_test("Media: Upload with auth", False, f"URL doesn't start with /uploads/: {data.get('url')}")
                return False
            
            # Verify the uploaded file is accessible
            file_url = f"{BASE_URL}{data['url']}"
            file_response = requests.get(file_url, timeout=10)
            
            if file_response.status_code == 200:
                content_type = file_response.headers.get('content-type', '')
                if 'image' in content_type:
                    log_test("Media: Upload with auth", True, 
                            f"File uploaded: {data['filename']}, size: {data['size']} bytes, accessible at {data['url']}")
                    return True
                else:
                    log_test("Media: Upload with auth", False, f"File not accessible as image, content-type: {content_type}")
            else:
                log_test("Media: Upload with auth", False, f"Uploaded file not accessible: {file_response.status_code}")
        else:
            log_test("Media: Upload with auth", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Media: Upload with auth", False, f"Exception: {str(e)}")
    return False

def test_media_upload_without_auth():
    """Test POST /api/admin/media/upload without Bearer token - should return 401"""
    try:
        image_bytes = create_test_image()
        files = {'file': ('test.png', image_bytes, 'image/png')}
        
        response = requests.post(
            f"{API_BASE}/admin/media/upload",
            files=files,
            timeout=10
        )
        
        if response.status_code == 401:
            log_test("Media: Upload without auth", True, "Correctly rejected with 401")
            return True
        else:
            log_test("Media: Upload without auth", False, f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_test("Media: Upload without auth", False, f"Exception: {str(e)}")
    return False

def test_media_upload_no_file():
    """Test POST /api/admin/media/upload with Bearer but no file field - should return 400"""
    if not auth_token:
        log_test("Media: Upload no file", False, "No auth token available")
        return False
    
    try:
        # Send empty form data
        response = requests.post(
            f"{API_BASE}/admin/media/upload",
            data={},
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 400:
            data = response.json()
            if "error" in data and "No file uploaded" in data["error"]:
                log_test("Media: Upload no file", True, "Correctly rejected with 400 and proper error message")
                return True
            else:
                log_test("Media: Upload no file", False, f"400 but wrong error message: {data}")
        else:
            log_test("Media: Upload no file", False, f"Expected 400, got {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Media: Upload no file", False, f"Exception: {str(e)}")
    return False

def test_media_list():
    """Test GET /api/admin/media - list all uploaded files"""
    if not auth_token:
        log_test("Media: List", False, "No auth token available")
        return False
    
    try:
        response = requests.get(
            f"{API_BASE}/admin/media",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                # Check if our uploaded file appears
                log_test("Media: List", True, f"Retrieved {len(data)} media files")
                return True
            else:
                log_test("Media: List", False, f"Expected array, got: {type(data)}")
        else:
            log_test("Media: List", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Media: List", False, f"Exception: {str(e)}")
    return False

def test_media_delete():
    """Test DELETE /api/admin/media/{id}"""
    if not auth_token:
        log_test("Media: Delete", False, "No auth token available")
        return False
    
    try:
        # First get the media list
        list_response = requests.get(
            f"{API_BASE}/admin/media",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if list_response.status_code != 200:
            log_test("Media: Delete", False, "Could not fetch media list")
            return False
        
        media_list = list_response.json()
        if not media_list:
            log_test("Media: Delete", False, "No media files to delete")
            return False
        
        # Delete the first one
        media_id = media_list[0]["_id"]
        
        delete_response = requests.delete(
            f"{API_BASE}/admin/media/{media_id}",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if delete_response.status_code == 200:
            data = delete_response.json()
            if data.get("ok"):
                # Verify it's gone
                verify_response = requests.get(
                    f"{API_BASE}/admin/media",
                    headers={"Authorization": f"Bearer {auth_token}"},
                    timeout=10
                )
                if verify_response.status_code == 200:
                    updated_list = verify_response.json()
                    if not any(m.get("_id") == media_id for m in updated_list):
                        log_test("Media: Delete", True, f"Media {media_id} deleted successfully")
                        return True
                    else:
                        log_test("Media: Delete", False, "Media still exists after deletion")
                else:
                    log_test("Media: Delete", False, "Could not verify deletion")
            else:
                log_test("Media: Delete", False, f"Response: {data}")
        else:
            log_test("Media: Delete", False, f"Status {delete_response.status_code}: {delete_response.text}")
    except Exception as e:
        log_test("Media: Delete", False, f"Exception: {str(e)}")
    return False

def test_notifications_list():
    """Test GET /api/admin/notifications - should return notification log"""
    if not auth_token:
        log_test("Notifications: List", False, "No auth token available")
        return False
    
    try:
        response = requests.get(
            f"{API_BASE}/admin/notifications",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list):
                log_test("Notifications: List", True, f"Retrieved {len(data)} notification records")
                return True
            else:
                log_test("Notifications: List", False, f"Expected array, got: {type(data)}")
        else:
            log_test("Notifications: List", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Notifications: List", False, f"Exception: {str(e)}")
    return False

def test_notifications_list_without_auth():
    """Test GET /api/admin/notifications without Bearer token - should return 401"""
    try:
        response = requests.get(f"{API_BASE}/admin/notifications", timeout=10)
        
        if response.status_code == 401:
            log_test("Notifications: List without auth", True, "Correctly rejected with 401")
            return True
        else:
            log_test("Notifications: List without auth", False, f"Expected 401, got {response.status_code}")
    except Exception as e:
        log_test("Notifications: List without auth", False, f"Exception: {str(e)}")
    return False

def test_email_notification_on_lead_creation():
    """Test that creating a lead triggers email notification logging"""
    if not auth_token:
        log_test("Email: Notification on lead creation", False, "No auth token available")
        return False
    
    try:
        # Get current notification count
        notif_response = requests.get(
            f"{API_BASE}/admin/notifications",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if notif_response.status_code != 200:
            log_test("Email: Notification on lead creation", False, "Could not fetch notifications")
            return False
        
        initial_count = len(notif_response.json())
        
        # Create a new lead via CONTACT
        lead_payload = {
            "name": "Vikram Singh",
            "phone": "+91 98765 43210",
            "email": "vikram.singh@example.com",
            "message": "Interested in 10kW solar system for my factory",
            "source": "CONTACT"
        }
        
        lead_response = requests.post(
            f"{API_BASE}/leads",
            json=lead_payload,
            timeout=10
        )
        
        if lead_response.status_code != 200:
            log_test("Email: Notification on lead creation", False, f"Lead creation failed: {lead_response.status_code}")
            return False
        
        # Wait a bit for async notification
        time.sleep(1)
        
        # Check notifications again
        notif_response2 = requests.get(
            f"{API_BASE}/admin/notifications",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if notif_response2.status_code == 200:
            notifications = notif_response2.json()
            new_count = len(notifications)
            
            if new_count > initial_count:
                # Check the newest notification
                newest = notifications[0]  # sorted newest first
                
                required_fields = ["subject", "createdAt", "sent", "recipients"]
                missing = [f for f in required_fields if f not in newest]
                
                if missing:
                    log_test("Email: Notification on lead creation", False, f"Missing fields in notification: {missing}")
                    return False
                
                # Verify subject contains "New" and source
                subject = newest.get("subject", "")
                if "New" in subject and "CONTACT" in subject:
                    # Check sent status (should be false because SMTP not configured)
                    if isinstance(newest.get("sent"), bool):
                        log_test("Email: Notification on lead creation", True, 
                                f"Notification logged: subject='{subject}', sent={newest['sent']}, reason={newest.get('reason', 'N/A')}")
                        return True
                    else:
                        log_test("Email: Notification on lead creation", False, f"'sent' field is not boolean: {newest.get('sent')}")
                else:
                    log_test("Email: Notification on lead creation", False, f"Subject doesn't match expected pattern: {subject}")
            else:
                log_test("Email: Notification on lead creation", False, f"Notification count didn't increase: {initial_count} -> {new_count}")
        else:
            log_test("Email: Notification on lead creation", False, "Could not fetch notifications after lead creation")
    except Exception as e:
        log_test("Email: Notification on lead creation", False, f"Exception: {str(e)}")
    return False

def test_email_notification_on_calculator_lead():
    """Test that calculator with contact info triggers notification"""
    if not auth_token:
        log_test("Email: Notification on calculator lead", False, "No auth token available")
        return False
    
    try:
        # Get current notification count
        notif_response = requests.get(
            f"{API_BASE}/admin/notifications",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if notif_response.status_code != 200:
            log_test("Email: Notification on calculator lead", False, "Could not fetch notifications")
            return False
        
        initial_count = len(notif_response.json())
        
        # Use calculator with contact info
        calc_payload = {
            "customerType": "RESIDENTIAL",
            "systemType": "ON_GRID",
            "bill": 4500,
            "billFrequency": "MONTHLY",
            "name": "Meera Patel",
            "phone": "+91 90000 00000",
            "email": "meera.patel@example.com"
        }
        
        calc_response = requests.post(
            f"{API_BASE}/calculator/compute",
            json=calc_payload,
            timeout=10
        )
        
        if calc_response.status_code != 200:
            log_test("Email: Notification on calculator lead", False, f"Calculator failed: {calc_response.status_code}")
            return False
        
        # Wait for async notification
        time.sleep(1)
        
        # Check notifications
        notif_response2 = requests.get(
            f"{API_BASE}/admin/notifications",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if notif_response2.status_code == 200:
            notifications = notif_response2.json()
            new_count = len(notifications)
            
            if new_count > initial_count:
                newest = notifications[0]
                subject = newest.get("subject", "")
                
                if "CALCULATOR" in subject:
                    log_test("Email: Notification on calculator lead", True, 
                            f"Calculator notification logged: '{subject}'")
                    return True
                else:
                    log_test("Email: Notification on calculator lead", False, f"Subject doesn't contain CALCULATOR: {subject}")
            else:
                log_test("Email: Notification on calculator lead", False, "Notification count didn't increase")
        else:
            log_test("Email: Notification on calculator lead", False, "Could not fetch notifications")
    except Exception as e:
        log_test("Email: Notification on calculator lead", False, f"Exception: {str(e)}")
    return False

def test_email_notification_on_job_application():
    """Test that job application triggers notification"""
    if not auth_token:
        log_test("Email: Notification on job application", False, "No auth token available")
        return False
    
    try:
        # Get current notification count
        notif_response = requests.get(
            f"{API_BASE}/admin/notifications",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if notif_response.status_code != 200:
            log_test("Email: Notification on job application", False, "Could not fetch notifications")
            return False
        
        initial_count = len(notif_response.json())
        
        # Submit job application
        job_payload = {
            "name": "Arjun Kumar",
            "phone": "+91 98888 88888",
            "email": "arjun.kumar@example.com",
            "jobTitle": "Solar Installation Engineer"
        }
        
        job_response = requests.post(
            f"{API_BASE}/jobs/apply",
            json=job_payload,
            timeout=10
        )
        
        if job_response.status_code != 200:
            log_test("Email: Notification on job application", False, f"Job application failed: {job_response.status_code}")
            return False
        
        # Wait for async notification
        time.sleep(1)
        
        # Check notifications
        notif_response2 = requests.get(
            f"{API_BASE}/admin/notifications",
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if notif_response2.status_code == 200:
            notifications = notif_response2.json()
            new_count = len(notifications)
            
            if new_count > initial_count:
                newest = notifications[0]
                subject = newest.get("subject", "")
                
                if "CAREER" in subject:
                    log_test("Email: Notification on job application", True, 
                            f"Career notification logged: '{subject}'")
                    return True
                else:
                    log_test("Email: Notification on job application", False, f"Subject doesn't contain CAREER: {subject}")
            else:
                log_test("Email: Notification on job application", False, "Notification count didn't increase")
        else:
            log_test("Email: Notification on job application", False, "Could not fetch notifications")
    except Exception as e:
        log_test("Email: Notification on job application", False, f"Exception: {str(e)}")
    return False

def test_settings_notifications_field():
    """Test GET /api/settings returns notifications field"""
    try:
        response = requests.get(f"{API_BASE}/settings", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if "notifications" in data:
                notif = data["notifications"]
                if "leadEmails" in notif and "subjectPrefix" in notif:
                    log_test("Settings: Notifications field", True, 
                            f"leadEmails='{notif.get('leadEmails', '')}', subjectPrefix='{notif.get('subjectPrefix', '')}'")
                    return True
                else:
                    log_test("Settings: Notifications field", False, f"Missing leadEmails or subjectPrefix in notifications: {notif}")
            else:
                log_test("Settings: Notifications field", False, "notifications field not present in settings")
        else:
            log_test("Settings: Notifications field", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Settings: Notifications field", False, f"Exception: {str(e)}")
    return False

def test_settings_notifications_update():
    """Test PUT /api/admin/settings to update notifications field"""
    if not auth_token:
        log_test("Settings: Update notifications", False, "No auth token available")
        return False
    
    try:
        # Get current settings
        get_response = requests.get(f"{API_BASE}/settings", timeout=10)
        if get_response.status_code != 200:
            log_test("Settings: Update notifications", False, "Could not fetch settings")
            return False
        
        original_settings = get_response.json()
        original_notif = original_settings.get("notifications", {})
        
        # Update notifications
        test_emails = "test1@example.com, test2@example.com"
        test_prefix = "[TEST]"
        
        update_payload = {
            **original_settings,
            "notifications": {
                "leadEmails": test_emails,
                "subjectPrefix": test_prefix
            }
        }
        
        put_response = requests.put(
            f"{API_BASE}/admin/settings",
            json=update_payload,
            headers={"Authorization": f"Bearer {auth_token}"},
            timeout=10
        )
        
        if put_response.status_code == 200:
            # Verify change
            verify_response = requests.get(f"{API_BASE}/settings", timeout=10)
            if verify_response.status_code == 200:
                updated_data = verify_response.json()
                updated_notif = updated_data.get("notifications", {})
                
                if (updated_notif.get("leadEmails") == test_emails and 
                    updated_notif.get("subjectPrefix") == test_prefix):
                    
                    # Restore original
                    restore_payload = {
                        **updated_data,
                        "notifications": original_notif
                    }
                    requests.put(
                        f"{API_BASE}/admin/settings",
                        json=restore_payload,
                        headers={"Authorization": f"Bearer {auth_token}"},
                        timeout=10
                    )
                    
                    log_test("Settings: Update notifications", True, 
                            f"Updated notifications, verified, and restored")
                    return True
                else:
                    log_test("Settings: Update notifications", False, "Update not reflected correctly")
            else:
                log_test("Settings: Update notifications", False, "Could not verify update")
        else:
            log_test("Settings: Update notifications", False, f"Status {put_response.status_code}: {put_response.text}")
    except Exception as e:
        log_test("Settings: Update notifications", False, f"Exception: {str(e)}")
    return False

# ============================================================================
# REGRESSION TESTS (Existing Features)
# ============================================================================

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
                    log_test("Regression: Auth login", True, f"Token received, role: {user.get('role')}")
                    return True
                else:
                    log_test("Regression: Auth login", False, f"User data incorrect: {user}")
            else:
                log_test("Regression: Auth login", False, f"Missing token or user: {data}")
        else:
            log_test("Regression: Auth login", False, f"Status {response.status_code}: {response.text}")
    except Exception as e:
        log_test("Regression: Auth login", False, f"Exception: {str(e)}")
    return False

def test_settings_get():
    """Test GET /api/settings (public)"""
    try:
        response = requests.get(f"{API_BASE}/settings", timeout=10)
        
        if response.status_code == 200:
            log_test("Regression: GET /api/settings", True, "Settings retrieved")
            return True
        else:
            log_test("Regression: GET /api/settings", False, f"Status {response.status_code}")
    except Exception as e:
        log_test("Regression: GET /api/settings", False, f"Exception: {str(e)}")
    return False

def test_calculator_settings_get():
    """Test GET /api/calculator/settings (public)"""
    try:
        response = requests.get(f"{API_BASE}/calculator/settings", timeout=10)
        
        if response.status_code == 200:
            log_test("Regression: GET /api/calculator/settings", True, "Calculator settings retrieved")
            return True
        else:
            log_test("Regression: GET /api/calculator/settings", False, f"Status {response.status_code}")
    except Exception as e:
        log_test("Regression: GET /api/calculator/settings", False, f"Exception: {str(e)}")
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
            if data.get("subsidy", 0) > 0:
                log_test("Regression: Calculator RESIDENTIAL ON_GRID", True, 
                        f"Subsidy: ₹{data.get('subsidy'):,.0f}")
                return True
            else:
                log_test("Regression: Calculator RESIDENTIAL ON_GRID", False, 
                        f"Subsidy should be > 0, got: {data.get('subsidy')}")
        else:
            log_test("Regression: Calculator RESIDENTIAL ON_GRID", False, f"Status {response.status_code}")
    except Exception as e:
        log_test("Regression: Calculator RESIDENTIAL ON_GRID", False, f"Exception: {str(e)}")
    return False

def test_calculator_commercial_ongrid():
    """Test POST /api/calculator/compute - COMMERCIAL + ON_GRID (no subsidy)"""
    try:
        payload = {
            "customerType": "COMMERCIAL",
            "systemType": "ON_GRID",
            "bill": 20000,
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
                log_test("Regression: Calculator COMMERCIAL ON_GRID", True, "Subsidy correctly 0")
                return True
            else:
                log_test("Regression: Calculator COMMERCIAL ON_GRID", False, 
                        f"Subsidy should be 0, got: {data.get('subsidy')}")
        else:
            log_test("Regression: Calculator COMMERCIAL ON_GRID", False, f"Status {response.status_code}")
    except Exception as e:
        log_test("Regression: Calculator COMMERCIAL ON_GRID", False, f"Exception: {str(e)}")
    return False

def test_projects_get():
    """Test GET /api/projects (public)"""
    try:
        response = requests.get(f"{API_BASE}/projects", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                log_test("Regression: GET /api/projects", True, f"Retrieved {len(data)} projects")
                return True
            else:
                log_test("Regression: GET /api/projects", False, "Expected non-empty array")
        else:
            log_test("Regression: GET /api/projects", False, f"Status {response.status_code}")
    except Exception as e:
        log_test("Regression: GET /api/projects", False, f"Exception: {str(e)}")
    return False

def test_blogs_get():
    """Test GET /api/blogs (public)"""
    try:
        response = requests.get(f"{API_BASE}/blogs", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                log_test("Regression: GET /api/blogs", True, f"Retrieved {len(data)} blogs")
                return True
            else:
                log_test("Regression: GET /api/blogs", False, "Expected non-empty array")
        else:
            log_test("Regression: GET /api/blogs", False, f"Status {response.status_code}")
    except Exception as e:
        log_test("Regression: GET /api/blogs", False, f"Exception: {str(e)}")
    return False

def test_admin_leads_get():
    """Test GET /api/admin/leads (admin)"""
    if not auth_token:
        log_test("Regression: GET /api/admin/leads", False, "No auth token")
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
                log_test("Regression: GET /api/admin/leads", True, f"Retrieved {len(data)} leads")
                return True
            else:
                log_test("Regression: GET /api/admin/leads", False, "Expected array")
        else:
            log_test("Regression: GET /api/admin/leads", False, f"Status {response.status_code}")
    except Exception as e:
        log_test("Regression: GET /api/admin/leads", False, f"Exception: {str(e)}")
    return False

# ============================================================================
# MAIN TEST RUNNER
# ============================================================================

def main():
    """Run all tests"""
    print("=" * 80)
    print("RGR GREEN ENERGY - PRODUCTION FEATURES TEST SUITE")
    print("=" * 80)
    print(f"Base URL: {BASE_URL}")
    print(f"API Base: {API_BASE}")
    print("=" * 80)
    print()
    
    # 1. AUTHENTICATION (Required for other tests)
    print("=" * 80)
    print("1. AUTHENTICATION")
    print("=" * 80)
    test_auth_login_valid()
    
    # 2. NEW PRODUCTION FEATURES - MEDIA LIBRARY
    print("=" * 80)
    print("2. MEDIA LIBRARY UPLOAD (NEW FEATURE)")
    print("=" * 80)
    test_media_upload_with_auth()
    test_media_upload_without_auth()
    test_media_upload_no_file()
    test_media_list()
    test_media_delete()
    
    # 3. NEW PRODUCTION FEATURES - EMAIL NOTIFICATIONS
    print("=" * 80)
    print("3. EMAIL NOTIFICATIONS ON LEADS (NEW FEATURE)")
    print("=" * 80)
    test_notifications_list()
    test_notifications_list_without_auth()
    test_email_notification_on_lead_creation()
    test_email_notification_on_calculator_lead()
    test_email_notification_on_job_application()
    
    # 4. NEW PRODUCTION FEATURES - SETTINGS NOTIFICATIONS FIELD
    print("=" * 80)
    print("4. SETTINGS NOTIFICATIONS FIELD (NEW FEATURE)")
    print("=" * 80)
    test_settings_notifications_field()
    test_settings_notifications_update()
    
    # 5. REGRESSION SANITY CHECKS
    print("=" * 80)
    print("5. REGRESSION SANITY CHECKS")
    print("=" * 80)
    test_settings_get()
    test_calculator_settings_get()
    test_calculator_residential_ongrid()
    test_calculator_commercial_ongrid()
    test_projects_get()
    test_blogs_get()
    test_admin_leads_get()
    
    # SUMMARY
    print("=" * 80)
    print("TEST SUMMARY")
    print("=" * 80)
    total = test_results["passed"] + test_results["failed"]
    print(f"Total Tests: {total}")
    print(f"✅ Passed: {test_results['passed']}")
    print(f"❌ Failed: {test_results['failed']}")
    if total > 0:
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
