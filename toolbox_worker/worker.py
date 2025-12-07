import os
import time
import json
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_SERVICE_KEY")

if not url or not key:
    raise ValueError("Missing SUPABASE_URL or SUPABASE_SERVICE_KEY environment variables")

supabase: Client = create_client(url, key)

print("👷 SolidFrame Toolbox Worker Started...")

def process_job(job):
    print(f"🔄 Processing Job {job['id']} (Tool: {job['tool_id']})")
    
    # Update status to running
    supabase.table("jobs").update({"status": "running", "started_at": "now()"}).eq("id", job["id"]).execute()
    
    try:
        # --- TOOL ROUTER ---
        if job['tool_id'] == 'lead-scraper':
            print("   -> Running Lead Scraper...")
            # Simulate work for now
            time.sleep(5) 
            result = {"leads_found": 12, "file_url": "https://placeholder-url/leads.csv"}
        
        elif job['tool_id'] == 'script-generator':
             print("   -> Running Script Generator...")
             time.sleep(2)
             result = {"script": "Hello, this is a generated script."}
             
        else:
            raise ValueError(f"Unknown tool: {job['tool_id']}")
        
        # --- COMPLETE --
        supabase.table("jobs").update({
            "status": "completed", 
            "completed_at": "now()",
            "result_payload": result
        }).eq("id", job["id"]).execute()
        
        print(f"✅ Job {job['id']} Completed")

    except Exception as e:
        print(f"❌ Job {job['id']} Failed: {e}")
        supabase.table("jobs").update({
            "status": "failed", 
            "result_payload": {"error": str(e)}
        }).eq("id", job["id"]).execute()

def poll_jobs():
    # Poll for 'queued' jobs
    response = supabase.table("jobs").select("*").eq("status", "queued").limit(1).execute()
    jobs = response.data
    
    if jobs:
        for job in jobs:
            process_job(job)
    else:
        # Exponential backoff or just sleep could go here, keeping it simple for now
        pass

if __name__ == "__main__":
    while True:
        poll_jobs()
        time.sleep(2) # Poll every 2 seconds
