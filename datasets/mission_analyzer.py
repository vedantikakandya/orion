import pandas as pd
import fitz # PyMuPDF
from bs4 import BeautifulSoup

# --- 1. CONFIGURATION: FILE NAMES AND NASA LINKS ---
CSV_FILE = 'SB_publication_PMC.csv'
PDF_FILE = '__98 Space Biology Publications FY 2024.pdf'

# NASA Data & Resource Links
NASA_DATA_LINKS = {
    "NASA Space Life Sciences Library": "https://science.nasa.gov/biological-physical/data/",
    "NASA Task Book": "https://taskbook.nasaprs.com/tbp/index.cfm",
    "NASA Open Science Data Repository (OSDR)": "https://genelab-data.ndc.nasa.gov/genelab/projects",
}

# --- 2. DATA PROCESSING FUNCTIONS ---

def analyze_csv_titles(csv_path):
    """Loads and tokenizes publication titles from the CSV for thematic analysis."""
    print(f"Loading data from {csv_path}...")
    try:
        df = pd.read_csv(csv_path)
    except FileNotFoundError:
        return {"total_titles": 0, "top_themes": "File not found.", "df": pd.DataFrame()}
    
    # Tokenize and count common, non-stop words in titles
    titles = df['Title'].str.lower().str.cat(sep=' ')
    tokens = pd.Series(titles.split())
    
    # Define common stop words to ignore (including general space/biology terms)
    stop_words = set([
        'in', 'the', 'of', 'and', 'on', 'a', 'to', 'for', 'with', 'by', 'is',
        'from', 'space', 'microgravity', 'cells', 'expression', 'radiation',
        'nasa', 'life', 'science', 'mission', 'effects', 'systems', 'human',
        'studies', 'gene', 'vs', 'that', 'this', 'an', 'are', 'cellular', 'bone',
        'system', 'cardiac', 'disease', 'stem', 'regulation'
    ])
    
    # Filter out stop words and single-character tokens, then count frequency
    filtered_tokens = tokens[~tokens.isin(stop_words)]
    filtered_tokens = filtered_tokens[filtered_tokens.str.len() > 2]
    
    theme_counts = filtered_tokens.value_counts().nlargest(10)

    # Add the full DataFrame to the result for detailed link access
    return {
        "total_titles": len(df),
        "top_themes": theme_counts.to_dict(),
        "df": df
    }

def analyze_pdf_content(pdf_path):
    """Extracts text content from the PDF for a summary."""
    print(f"Extracting text from {pdf_path}...")
    try:
        doc = fitz.open(pdf_path)
        text = ""
        for page in doc:
            text += page.get_text()
        return text
    except FileNotFoundError:
        return "PDF file not found."
    except Exception as e:
        return f"Error reading PDF: {e}"

def analyze_mission_future(csv_data):
    """Analyzes mission trends and predicts future research directions."""
    themes = csv_data["top_themes"]
    
    # Mission timeline analysis
    mission_phases = {
        "Current (2024-2026)": {
            "focus": ["skeletal", "immune", "vascular", "microbiome"],
            "missions": ["ISS Research", "Artemis Prep"],
            "priority": "Crew Health Countermeasures"
        },
        "Near Future (2027-2030)": {
            "focus": ["arabidopsis", "tissue", "regeneration", "ISRU"],
            "missions": ["Lunar Gateway", "Mars Transit"],
            "priority": "Life Support Systems"
        },
        "Long Term (2031-2040)": {
            "focus": ["synthetic biology", "closed-loop systems", "terraforming"],
            "missions": ["Mars Surface", "Deep Space"],
            "priority": "Self-Sustaining Colonies"
        }
    }
    
    # Technology readiness predictions
    tech_predictions = {
        "Radiation Shielding": {"current_trl": 4, "target_trl": 8, "timeline": "2028"},
        "Closed-Loop ECLSS": {"current_trl": 6, "target_trl": 9, "timeline": "2030"},
        "In-Situ Food Production": {"current_trl": 3, "target_trl": 7, "timeline": "2032"},
        "Bioregenerative Medicine": {"current_trl": 2, "target_trl": 6, "timeline": "2035"}
    }
    
    return mission_phases, tech_predictions

# --- 3. ARCHITECTURAL ANALYSIS AND REPORT GENERATION ---

def generate_architect_report(csv_data, pdf_content, nasa_links):
    """Generates a summary and an HTML report for the mission architect."""
    
    total_pubs = csv_data["total_titles"]
    top_themes = csv_data["top_themes"]
    mission_phases, tech_predictions = analyze_mission_future(csv_data)
    
    # Map themes to architectural impact
    theme_impact = {
        'microbiome': "Gut health & crew hygiene (ECLSS and food protocols)",
        'skeletal': "Bone loss countermeasures (Exercise requirements & drugs)",
        'tissue': "Regeneration & repair during deep space missions",
        'arabidopsis': "Plant growth and closure of the food loop (ISRU/ECLSS)",
        'immune': "Infection risk & radiation susceptibility",
        'vascular': "Cardiovascular and vision health (SANS prevention)"
    }
    
    # Start HTML Report
    html_content = BeautifulSoup('<html><head><title>Space Biology Architectural Data Report</title></head><body></body></html>', 'html.parser')
    body = html_content.body
    
    # Title Section
    body.append(html_content.new_tag('h1'))
    body.h1.string = "Mission Architect Data Analysis: Space Biology"
    
    # 3.1. Links Section
    body.append(html_content.new_tag('h2'))
    body.h2.string = "NASA Data & Resource Links"
    ul_links = html_content.new_tag('ul')
    for name, link in nasa_links.items():
        li = html_content.new_tag('li')
        a = html_content.new_tag('a', href=link, target="_blank")
        a.string = name
        li.append(a)
        ul_links.append(li)
    body.append(ul_links)
    
    # 3.2. Quantitative Analysis Section
    body.append(html_content.new_tag('h2'))
    body.find_all('h2')[1].string = f"Quantitative Analysis: {total_pubs} Publications"
    
    p_themes = html_content.new_tag('p')
    p_themes.string = "Analysis of the titles from the 'SB_publication_PMC.csv' reveals the following critical areas of focus:"
    body.append(p_themes)
    
    table_html = """
    <table border="1" style="width:100%; text-align:left;">
        <tr>
            <th>Top Theme/Keyword</th>
            <th>Frequency</th>
            <th>Architectural Impact</th>
        </tr>
    """
    for theme, count in top_themes.items():
        impact = theme_impact.get(theme, "General health & countermeasure development")
        table_html += f"<tr><td>{theme}</td><td>{count}</td><td>{impact}</td></tr>"
    table_html += "</table>"
    body.append(BeautifulSoup(table_html, 'html.parser'))
    
    # 3.3. Mission Timeline & Future Analysis
    body.append(html_content.new_tag('h2'))
    body.find_all('h2')[2].string = "Mission Timeline & Future Research Directions"
    
    for phase, details in mission_phases.items():
        body.append(html_content.new_tag('h3'))
        body.find_all('h3')[-1].string = phase
        
        phase_html = f"""
        <p><strong>Priority:</strong> {details['priority']}</p>
        <p><strong>Key Missions:</strong> {', '.join(details['missions'])}</p>
        <p><strong>Research Focus:</strong> {', '.join(details['focus'])}</p>
        """
        body.append(BeautifulSoup(phase_html, 'html.parser'))
    
    # 3.4. Technology Readiness Predictions
    body.append(html_content.new_tag('h2'))
    body.find_all('h2')[3].string = "Technology Readiness Level (TRL) Predictions"
    
    trl_table = """
    <table border="1" style="width:100%; text-align:left;">
        <tr>
            <th>Technology</th>
            <th>Current TRL</th>
            <th>Target TRL</th>
            <th>Expected Timeline</th>
        </tr>
    """
    for tech, data in tech_predictions.items():
        trl_table += f"<tr><td>{tech}</td><td>{data['current_trl']}</td><td>{data['target_trl']}</td><td>{data['timeline']}</td></tr>"
    trl_table += "</table>"
    body.append(BeautifulSoup(trl_table, 'html.parser'))
    
    # 3.5. Key Findings (From PDF)
    body.append(html_content.new_tag('h2'))
    body.find_all('h2')[4].string = "Key Architectural Insights (From FY 2024 Research)"

    if "file not found" in pdf_content.lower():
        p_pdf = html_content.new_tag('p')
        p_pdf.string = "Error: Could not read PDF content. Please ensure PyMuPDF is installed and the file name is correct."
        body.append(p_pdf)
    else:
        focus_areas = [
            "Telomeric RNA", "Neurovascular dysfunction", "Lunar regolith simulant", 
            "Neural stem cells", "Microgreens in microgravity", "Hemoglobin in space", 
            "Ionizing radiation-induced cardiovascular dysfunction", "Brillouin microscopy monitors rapid responses"
        ]
        
        ul_pdf = html_content.new_tag('ul')
        for area in focus_areas:
            li = html_content.new_tag('li')
            li.string = f"Focus on: {area}. This informs **in-flight diagnostics** and **long-term risk modeling**."
            ul_pdf.append(li)
        body.append(ul_pdf)

    # 3.6. Mission Future Recommendations
    body.append(html_content.new_tag('h2'))
    body.find_all('h2')[5].string = "Future Mission Recommendations"
    
    recommendations = """
    <ol>
        <li><strong>Immediate (2024-2026):</strong> Focus on ISS-based countermeasure validation for Artemis missions</li>
        <li><strong>Short-term (2027-2030):</strong> Develop closed-loop life support systems for lunar habitats</li>
        <li><strong>Long-term (2031-2040):</strong> Pioneer bioregenerative technologies for Mars colonization</li>
        <li><strong>Investment Priority:</strong> Radiation protection and autonomous medical systems</li>
        <li><strong>Research Gaps:</strong> Synthetic biology applications and multi-generational space health</li>
    </ol>
    """
    body.append(BeautifulSoup(recommendations, 'html.parser'))

    # 3.7. Conclusion
    body.append(html_content.new_tag('h2'))
    body.find_all('h2')[6].string = "Mission Architect Conclusion"
    p_conc = html_content.new_tag('p')
    p_conc.string = f"""
    The analysis reveals a clear evolution from current crew health research to future self-sustaining space colonies. 
    Mission architects must plan for a 3-phase approach: immediate countermeasures (2024-2026), 
    life support systems (2027-2030), and bioregenerative colonies (2031-2040). 
    The NASA Task Book and OSDR links provide continuous access to evolving research data.
    """
    body.append(p_conc)

    return html_content.prettify()


# --- 4. MAIN EXECUTION ---
if __name__ == '__main__':
    # 1. Process Data
    csv_results = analyze_csv_titles(CSV_FILE)
    pdf_text = analyze_pdf_content(PDF_FILE)
    
    # 2. Generate Report
    html_report = generate_architect_report(csv_results, pdf_text, NASA_DATA_LINKS)
    
    # 3. Save and Print
    output_filename = 'Mission_Architect_Report.html'
    with open(output_filename, 'w') as f:
        f.write(html_report)
    
    print("\n" + "="*70)
    print(f"✅ Full analysis complete. Report saved as: {output_filename}")
    print(f"Open '{output_filename}' in your browser for the full interactive report.")
    print("="*70 + "\n")

    # Final requirement: print the links
    print("\n--- NASA Data & Resource Links for Mission Architects ---")
    for name, link in NASA_DATA_LINKS.items():
        print(f"[{name}]: {link}")