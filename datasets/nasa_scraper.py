import requests
from bs4 import BeautifulSoup
import re
import sys

def search_nasa_taskbook(keyword):
    """
    Attempts to submit a search query to the NASA Task Book website 
    and retrieves a summary of the results page.
    
    Prerequisites: pip install requests beautifulsoup4
    """
    
    # --- Configuration ---
    # The endpoint for the search form
    url = "https://taskbook.nasaprs.com/tbp/index.cfm"
    
    # HEURISTIC SEARCH PAYLOAD: Parameters that mimic a browser submitting the Basic Search form.
    # NOTE: These are approximations and may require fine-tuning if the site's form changes.
    search_payload = {
        'action': 'public_query_taskbook_results', # Instructs the server to display search results
        'Program': 'ALL',     # Options: 'HRP', 'SB' (Space Biology), 'PS', or 'ALL'
        'Fiscal_Year': 'FY2024', # Change year as needed (e.g., 'FY2023')
        'Key_Word': keyword,      
        'Project_Title': '',      
        'Investigator_Lastname': '', 
        'status': 'A',            # 'A' for Active, 'C' for Complete, 'ALL' for all tasks
        'submit': 'Search'        # The name of the submit button
    }

    # Headers to mimic a standard web browser to avoid being blocked
    headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Referer': url,
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    print(f"\n--- 🚀 Attempting NASA Task Book search for keyword: '{keyword}' ---")

    try:
        # Submit the POST request to the server
        response = requests.post(url, data=search_payload, headers=headers, timeout=15)
        response.raise_for_status() # Raise an exception for bad status codes (4xx or 5xx)
        
        # Parse the HTML content
        soup = BeautifulSoup(response.content, 'html.parser')
        
        # Check for error/no results message
        no_results_message = soup.find(string=re.compile("No matching tasks found|Search returned 0 records"))
        if no_results_message:
            return f"Search successful, but '{no_results_message.strip()}' for keyword '{keyword}'. Try adjusting the year or keyword."

        # Find the first result link, which contains the unique TASKID
        first_result_link = soup.find('a', href=re.compile(r"index\.cfm\?action=public_query_task&TASKID=\d+"))
        
        if first_result_link:
            title_text = first_result_link.text.strip()
            
            # The URL prefix for the individual task page
            base_url = url.split('/index.cfm')[0]
            task_link = f"{base_url}/{first_result_link.get('href')}"
            
            # Simplified attempt to find the Principal Investigator (PI) text nearby
            pi_info = first_result_link.parent.find_next_sibling(text=re.compile(r"Principal Investigator:"))
            investigator = pi_info.strip().replace('Principal Investigator: ', '') if pi_info else "N/A (Requires detailed parsing)"

            return (
                f"--- ✅ Search Successful for '{keyword}' ---\n"
                f"First Task Title Found: {title_text}\n"
                f"Principal Investigator: {investigator}\n"
                f"Task Link: {task_link}\n\n"
                "To extract all details (abstract, publications, etc.), you would loop through "
                "all task links found in the 'soup' object and scrape each individual page."
            )
        else:
            return (
                "Search successful, but no distinct task results (titles/links) were found. "
                "The site's layout may have changed, or the search returned results in an unexpected format.\n\n"
                "***HTML Snippet for Debugging***\n"
                f"{response.text[:500]}..."
            )

    except requests.exceptions.HTTPError as e:
        return f"Request failed with an HTTP Error: {e.response.status_code}. The server rejected the request. Check your payload."
    except requests.exceptions.RequestException as e:
        return f"An connection error occurred: {e}"
    except Exception as e:
         return f"An unexpected error occurred during execution: {e}"

# ====================================================================================
# --- EXECUTION ---
# ====================================================================================
# *** CHANGE THIS KEYWORD TO YOUR DESIRED RESEARCH AREA ***
search_term = "radiation effects"

# Execute the function and print the result
print(search_nasa_taskbook(search_term))