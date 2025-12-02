"""
MongoDB Authentication Setup Script
This script sets up MongoDB with user authentication
"""
import subprocess
import sys
import platform

def check_mongodb_running():
    """Check if MongoDB is running"""
    try:
        result = subprocess.run(
            ["mongosh", "--eval", "db.adminCommand({ping: 1})"],
            capture_output=True,
            timeout=5
        )
        return result.returncode == 0
    except:
        return False

def install_mongodb():
    """Install MongoDB Community Server"""
    system = platform.system()
    
    if system == "Windows":
        print("📦 MongoDB needs to be installed on Windows.")
        print("Please download and install MongoDB Community Edition from:")
        print("https://www.mongodb.com/try/download/community")
        print("\nAfter installation, restart this script.")
        return False
    elif system == "Darwin":  # macOS
        print("🍎 Installing MongoDB via Homebrew...")
        subprocess.run(["brew", "tap", "mongodb/brew"], check=True)
        subprocess.run(["brew", "install", "mongodb-community"], check=True)
        subprocess.run(["brew", "services", "start", "mongodb-community"], check=True)
        return True
    elif system == "Linux":
        print("🐧 MongoDB needs to be installed on Linux.")
        print("Please install MongoDB Community Edition from:")
        print("https://docs.mongodb.com/manual/administration/install-on-linux/")
        return False
    
    return False

def setup_authentication():
    """Set up authentication in MongoDB"""
    print("\n🔐 Setting up MongoDB authentication...\n")
    
    # Create admin user
    admin_setup = """
    use admin
    db.createUser({
        user: "dealflow_admin",
        pwd: "dealflow_secure_password_2025",
        roles: ["root"]
    })
    """
    
    try:
        result = subprocess.run(
            ["mongosh", "--eval", admin_setup],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if "successfully" in result.stdout.lower() or "duplicate" in result.stdout.lower():
            print("✅ Admin user created or already exists")
        else:
            print(f"⚠️  Response: {result.stdout}")
            if result.stderr:
                print(f"Error output: {result.stderr}")
        
    except subprocess.TimeoutExpired:
        print("⚠️  Timeout connecting to MongoDB")
        return False
    except FileNotFoundError:
        print("❌ mongosh not found. Please ensure MongoDB is installed correctly.")
        return False
    except Exception as e:
        print(f"❌ Error setting up admin user: {e}")
        return False
    
    # Create application database and user
    app_setup = """
    use dealflow
    db.createUser({
        user: "dealflow_user",
        pwd: "dealflow_app_password_2025",
        roles: ["readWrite", "dbOwner"]
    })
    """
    
    try:
        result = subprocess.run(
            ["mongosh", "-u", "dealflow_admin", "-p", "dealflow_secure_password_2025", 
             "--eval", app_setup],
            capture_output=True,
            text=True,
            timeout=10
        )
        
        if "successfully" in result.stdout.lower() or "duplicate" in result.stdout.lower():
            print("✅ Application user created or already exists")
        else:
            print(f"⚠️  Response: {result.stdout}")
        
    except Exception as e:
        print(f"⚠️  Note: Could not create app user: {e}")
        print("    This is OK if the admin user setup succeeded")
    
    print("\n📋 Authentication Credentials:")
    print("=" * 50)
    print("Admin User:")
    print("  Username: dealflow_admin")
    print("  Password: dealflow_secure_password_2025")
    print("\nApplication User:")
    print("  Username: dealflow_user")
    print("  Password: dealflow_app_password_2025")
    print("\nConnection String:")
    print("  mongodb://dealflow_admin:dealflow_secure_password_2025@localhost:27017")
    print("=" * 50)
    
    return True

def main():
    print("🚀 MongoDB Authentication Setup\n")
    
    # Check if MongoDB is running
    if not check_mongodb_running():
        print("⚠️  MongoDB is not running.")
        print("Attempting to install and start MongoDB...\n")
        
        if not install_mongodb():
            print("\n❌ Could not install MongoDB automatically.")
            print("Please install MongoDB manually and run this script again.")
            return False
    else:
        print("✅ MongoDB is running\n")
    
    # Setup authentication
    return setup_authentication()

if __name__ == "__main__":
    success = main()
    sys.exit(0 if success else 1)
