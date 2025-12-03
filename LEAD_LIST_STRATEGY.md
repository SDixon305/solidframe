# Step 4: Build the Lead List

**Status:** In Progress
**Goal:** Create a high-quality list of 100 Residential HVAC Owners to target for the Beta Offer.

## 1. Define the Ideal Customer Profile (ICP)
Based on your Offer Definition, we are looking for:
*   **Industry:** Residential HVAC (Heating, Ventilation, Air Conditioning).
*   **Size:** $1M - $5M Annual Revenue.
    *   *Indicators:* 3-10 trucks, professional branding, active Google Ads/LSA, 100+ Google Reviews.
*   **Location:** South Florida (Miami-Dade, Broward, Palm Beach Counties).
*   **The "Tell":**
    *   They run ads (spending money).
    *   They have a "Call Us 24/7" badge but it goes to a generic answering service or voicemail.
    *   They *don't* have a modern chat widget on their site (or it's a dumb bot).

## 2. Strategy Selection
Since we are starting fresh, we will use a **Hybrid Approach**: Automated discovery + Manual qualification. We want *quality* over quantity for the first 5 partners.

### Method A: The "Scrappy" Google Maps Method (Free & High Quality)
*Best for finding the first 50 highly targeted leads.*
1.  Go to Google Maps.
2.  Search: "HVAC near [City Name]" or "AC Repair [City Name]".
3.  **Filter:** Rating 4.0+, 50+ reviews (Ensures they are established).
4.  **The "Voicemail Test" (Optional but Powerful):** Call them at 7 PM. If it goes to voicemail or a bad answering service, they are a **perfect** lead.

### Method B: The "Volume" Method (Tools)
*Best if you want to scale quickly.*
*   **Apollo.io:** Good for finding owner emails/mobiles.
*   **D7 Lead Finder:** Great for scraping local businesses by keyword/city.
*   **Outscraper:** specialized for Google Maps scraping.

## 3. The Data Fields You Need
Don't just get a name. You need intel to close them.
*   **Company Name**
*   **Owner Name** (Crucial - "Hey Mike" vs "Hey there")
*   **Mobile Number** (For SMS outreach - *use with caution/compliance*)
*   **Email Address**
*   **Website URL**
*   **Current Status:** (e.g., "Uses generic answering service", "Goes to voicemail")

## 4. Execution Steps (Your Homework)

### Step 4.1: Pick Your Battleground
Choose **one** major metro area or 2-3 mid-sized cities.
*   *Why?* You can reference local weather/events in your pitch. "Crazy heatwave in Austin this week, huh?"

### Step 4.2: Set Up the Tracking Sheet
I have created a template for you (see `LEAD_LIST_TEMPLATE.csv`).

### Step 4.3: Build the First Batch (Target: 25 Leads)
1.  Open Google Maps.
2.  Search your city.
3.  Open 5-10 tabs of HVAC companies.
4.  **Check their website:**
    *   Do they look professional?
    *   Go to "About Us" -> Find the Owner/Founder's name.
    *   Look for a mobile number or direct email if possible.
5.  **Add to CSV.**

## 5. The Automated Lead Engine (New)
I have built a custom Python scraper for you in `solidframe/scraper/`.

### How to Run It
1.  Open your terminal.
2.  Navigate to the scraper folder: `cd solidframe/scraper`
3.  Run the harvester: `./venv/bin/python3 lead_harvester.py`

### What It Does
1.  **Search:** Uses DuckDuckGo to find HVAC companies in your target city (bypassing some directory blocks).
2.  **Enrich:** Visits each website to extract:
    *   **Phone Numbers** (Regex pattern matching).
    *   **Emails** (Scrapes `mailto:` and text).
    *   **Owner Intel** (Scans "About" pages for keywords like "Owner", "President", "Founder").
3.  **Output:** Saves everything to `LEAD_LIST_AUTOMATED.csv`.

*Note: Automated scraping is a "volume" game. You will still need to manually verify the "Owner Name" column, as AI/Scripts can't always distinguish between "Owner: John" and "Technician: John".*

---
**Next Action:**
1.  Download the `LEAD_LIST_TEMPLATE.csv`.
2.  Pick your target city.
3.  Fill in the first 10 rows manually to get a feel for the data quality.
