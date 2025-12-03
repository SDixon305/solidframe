import requests
from bs4 import BeautifulSoup
import pandas as pd
import time
import random
import re
from duckduckgo_search import DDGS
from urllib.parse import urlparse

# --- Configuration ---
TARGET_CITY = "Miami"
TARGET_STATE = "FL"
SEARCH_QUERY = f"residential HVAC companies in {TARGET_CITY} {TARGET_STATE}"
MAX_RESULTS = 20  # Number of search results to process
OUTPUT_FILE = "../LEAD_LIST_AUTOMATED.csv"

# Headers to mimic a real browser
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
}

def get_soup(url):
    """Helper to fetch URL and return BeautifulSoup object."""
    try:
        time.sleep(random.uniform(1, 3))  # Polite delay
        response = requests.get(url, headers=HEADERS, timeout=10)
        if response.status_code == 200:
            return BeautifulSoup(response.text, 'lxml')
        else:
            return None
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def search_companies():
    """Uses DuckDuckGo to find company websites."""
    print(f"Searching for: '{SEARCH_QUERY}'...")
    results = []
    
    with DDGS() as ddgs:
        # Use 'text' search
        ddg_results = list(ddgs.text(SEARCH_QUERY, max_results=MAX_RESULTS))
        
        for r in ddg_results:
            url = r['href']
            title = r['title']
            
            # Skip directories like Yelp, Angi, BBB, etc.
            domain = urlparse(url).netloc
            if any(x in domain for x in ['yelp', 'angi', 'bbb', 'yellowpages', 'thumbtack', 'homeadvisor', 'facebook', 'instagram', 'linkedin']):
                continue
                
            results.append({
                "Company Name": title.split('-')[0].split('|')[0].strip(), # Basic cleanup
                "Website": url,
                "Source": "DuckDuckGo"
            })
            
    return results

def enrich_lead(lead):
    """Visits the company website to find Email, Phone, and Owner Name."""
    website = lead.get("Website")
    print(f"Enriching: {lead['Company Name']} ({website})...")
    
    try:
        soup = get_soup(website)
        if not soup:
            return lead
            
        text_content = soup.get_text()
        
        # 1. Find Phone (Regex for US phone numbers)
        # Matches (123) 456-7890, 123-456-7890, 123.456.7890
        phone_pattern = r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}'
        phones = re.findall(phone_pattern, text_content)
        lead['Phone'] = phones[0] if phones else ""
        
        # 2. Find Emails
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        emails = set(re.findall(email_pattern, text_content))
        valid_emails = [e for e in emails if not any(x in e.lower() for x in ['wix', 'sentry', 'example', 'domain', '.png', '.jpg', 'u00'])]
        lead['Email'] = ", ".join(valid_emails[:2]) if valid_emails else ""
        
        # 3. Find Owner/Team
        # Look for "About" page link
        about_link = None
        for a in soup.find_all('a', href=True):
            if 'about' in a.text.lower() or 'team' in a.text.lower() or 'meet' in a.text.lower():
                # Handle relative URLs
                if a['href'].startswith('http'):
                    about_link = a['href']
                else:
                    # Simple join (could be better)
                    if website.endswith('/'):
                        about_link = website + a['href'].lstrip('/')
                    else:
                        about_link = website + '/' + a['href'].lstrip('/')
                break
        
        if about_link:
            print(f"  Checking About Page: {about_link}")
            about_soup = get_soup(about_link)
            if about_soup:
                text_content += " " + about_soup.get_text()
        
        # Check for Owner keywords
        if "Owner" in text_content or "President" in text_content or "Founder" in text_content:
            lead['Owner Found?'] = "Likely (Check Notes)"
        else:
            lead['Owner Found?'] = "No"

    except Exception as e:
        print(f"  Enrichment failed: {e}")
        
    return lead

def main():
    leads = []
    
    # 1. Try Search (might be blocked in cloud env)
    try:
        leads = search_companies()
    except Exception as e:
        print(f"Search failed (likely network blocking): {e}")
        
    print(f"Found {len(leads)} leads via search.")
    
    # 2. Load Existing Manual List to Enrich
    try:
        input_csv = "../LEAD_LIST_TEMPLATE.csv"
        print(f"Loading existing list from {input_csv}...")
        existing_df = pd.read_csv(input_csv)
        
        for _, row in existing_df.iterrows():
            # Map CSV columns to our dict structure
            website = row.get("Website")
            if website and isinstance(website, str) and website.startswith("http"):
                leads.append({
                    "Company Name": row.get("Company Name"),
                    "Website": website,
                    "Source": "Manual List"
                })
    except Exception as e:
        print(f"Could not load existing CSV: {e}")

    print(f"Total leads to enrich: {len(leads)}")

    # 3. Enrich
    enriched_leads = []
    for lead in leads:
        lead = enrich_lead(lead)
        enriched_leads.append(lead)
        
    # 4. Save
    df = pd.DataFrame(enriched_leads)
    
    cols = ["Company Name", "Website", "Phone", "Email", "Owner Found?", "Source"]
    for c in cols:
        if c not in df.columns:
            df[c] = ""
    df = df[cols]
    
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"Done! Saved {len(df)} leads to {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
