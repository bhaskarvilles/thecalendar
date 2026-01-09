#!/usr/bin/env python3
"""
Script to add footers and increase text sizes in remaining layout functions
"""

import re

def add_footers_and_text_sizes():
    file_path = r'c:\Users\Bhaskar\Documents\GitHub\thecalendar\src\app\months\route.tsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # For renderYearView - replace headerStyle with footerStyle
    content = re.sub(
        r'(const yearGridStyle = \{[^}]+\};\s+)(return new ImageResponse)',
        r'''\1
  const footerStyle = {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: "100%",
    height: `${bottomSection}px`,
    position: "absolute" as const,
    top: `${topSection + middleSection}px`,
    left: 0,
  };

  const footerBoxStyle = {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,
    alignItems: "center" as const,
    padding: "20px 32px",
    background: "rgba(0, 0, 0, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  \2''',
        content
    )
    
    # Remove header section and add footer in renderYearView
    content = re.sub(
        r'(function renderYearView[^{]+\{[^}]+?fontFamily: "system-ui, -apple-system, sans-serif",\s+\}\}\s+>\s+)\{/\* Header in top 30% \*/\}\s+<div style=\{headerStyle\}>[^<]+<div style=\{headerBoxStyle\}>[^<]+<div style=\{\{ display: "flex", fontSize: Math\.max\(width \* 0\.045, 52\), fontWeight: 600, color: theme\.textColor, letterSpacing: 4 \}\}>\s+\{calendar\.year\}\s+</div>\s+<div style=\{\{ display: "flex", fontSize: Math\.max\(width \* 0\.018 \* 1\.3, 22\), fontWeight: 500, color: "#ff0000", letterSpacing: 1 \}\}>\s+\{calendar\.daysLeft\} days left\s+</div>\s+</div>\s+</div>\s+\{/\* Year grid in middle 40% \*/\}',
        r'\1{/* Year grid in middle 60% */}',
        content,
        flags=re.DOTALL
    )
    
    # Add footer before closing div in renderYearView
    content = re.sub(
        r'(\{calendar\.months\.flatMap[^}]+\}\)\}\)\}\s+</div>\s+)(</div>\s+\),\s+\{ width, height \}\s+\);\s+\}\s+function renderWeeksView)',
        r'''\1
        {/* Footer with year, days left, and percentage below year grid */}
        <div style={footerStyle}>
          <div style={footerBoxStyle}>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.045, 52) * 1.1, fontWeight: 600, color: theme.textColor, letterSpacing: 4 }}>
              {calendar.year}
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.018 * 1.3, 22) * 1.1, fontWeight: 500, color: "#ff0000", letterSpacing: 1 }}>
              {calendar.daysLeft} days remaining
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.016, 20) * 1.1, fontWeight: 500, color: theme.textColor, letterSpacing: 1 }}>
              {percentageCompleted}% completed • {percentageRemaining}% remaining
            </div>
          </div>
        </div>
      \2''',
        content
    )
    
    # Similar updates for renderWeeksView
    content = re.sub(
        r'(const weeksListStyle = \{[^}]+\};\s+)(return new ImageResponse)',
        r'''\1
  const footerStyle = {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: "100%",
    height: `${bottomSection}px`,
    position: "absolute" as const,
    top: `${topSection + middleSection}px`,
    left: 0,
  };

  const footerBoxStyle = {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,
    alignItems: "center" as const,
    padding: "20px 32px",
    background: "rgba(0, 0, 0, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  \2''',
        content
    )
    
    # Remove header and add footer in renderWeeksView
    content = re.sub(
        r'(function renderWeeksView[^{]+\{[^}]+?fontFamily: "system-ui, -apple-system, sans-serif",\s+\}\}\s+>\s+)\{/\* Header in top 30% \*/\}\s+<div style=\{headerStyle\}>[^<]+<div style=\{headerBoxStyle\}>[^<]+<div style=\{\{ display: "flex", fontSize: Math\.max\(width \* 0\.045, 52\), fontWeight: 600, color: theme\.textColor, letterSpacing: 4 \}\}>\s+\{calendar\.year\}\s+</div>\s+<div style=\{\{ display: "flex", fontSize: Math\.max\(width \* 0\.018 \* 1\.3, 22\), fontWeight: 500, color: "#ff0000", letterSpacing: 1 \}\}>\s+\{calendar\.daysLeft\} days left\s+</div>\s+</div>\s+</div>\s+\{/\* Weeks in middle 40% \*/\}',
        r'\1{/* Weeks in middle 60% */}',
        content,
        flags=re.DOTALL
    )
    
    # Add footer before closing div in renderWeeksView
    content = re.sub(
        r'(\{calendar\.weeks\.map[^}]+\}\)\}\s+</div>\s+)(</div>\s+\),\s+\{ width, height \}\s+\);\s+\}\s+function renderDaysLeftView)',
        r'''\1
        {/* Footer with year, days left, and percentage below weeks */}
        <div style={footerStyle}>
          <div style={footerBoxStyle}>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.045, 52) * 1.1, fontWeight: 600, color: theme.textColor, letterSpacing: 4 }}>
              {calendar.year}
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.018 * 1.3, 22) * 1.1, fontWeight: 500, color: "#ff0000", letterSpacing: 1 }}>
              {calendar.daysLeft} days remaining
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.016, 20) * 1.1, fontWeight: 500, color: theme.textColor, letterSpacing: 1 }}>
              {percentageCompleted}% completed • {percentageRemaining}% remaining
            </div>
          </div>
        </div>
      \2''',
        content
    )
    
    # Similar updates for renderDaysLeftView
    content = re.sub(
        r'(const daysGridStyle = \{[^}]+\};\s+)(return new ImageResponse)',
        r'''\1
  const footerStyle = {
    display: "flex" as const,
    justifyContent: "center" as const,
    alignItems: "center" as const,
    width: "100%",
    height: `${bottomSection}px`,
    position: "absolute" as const,
    top: `${topSection + middleSection}px`,
    left: 0,
  };

  const footerBoxStyle = {
    display: "flex" as const,
    flexDirection: "column" as const,
    gap: 12,
    alignItems: "center" as const,
    padding: "20px 32px",
    background: "rgba(0, 0, 0, 0.8)",
    borderRadius: "16px",
    border: "1px solid rgba(255, 255, 255, 0.1)",
  };

  \2''',
        content
    )
    
    # Remove header and update renderDaysLeftView
    content = re.sub(
        r'(function renderDaysLeftView[^{]+\{[^}]+?fontFamily: "system-ui, -apple-system, sans-serif",\s+\}\}\s+>\s+)\{/\* Header in top 30% \*/\}\s+<div style=\{headerStyle\}>[^<]+<div style=\{headerBoxStyle\}>[^<]+<div style=\{\{ display: "flex", fontSize: Math\.max\(width \* 0\.08, 64\), fontWeight: 700, color: "#ff0000", letterSpacing: 4 \}\}>\s+\{calendar\.daysLeft\}\s+</div>\s+<div style=\{\{ display: "flex", fontSize: Math\.max\(width \* 0\.025, 28\), fontWeight: 600, color: theme\.textColor, letterSpacing: 2 \}\}>\s+DAYS LEFT IN \{calendar\.year\}\s+</div>\s+</div>\s+</div>\s+\{/\* Remaining days grid in middle 40% \*/\}',
        r'\1{/* Remaining days grid in middle 60% */}',
        content,
        flags=re.DOTALL
    )
    
    # Add footer before closing div in renderDaysLeftView
    content = re.sub(
        r'(\{remainingDays\.map[^}]+\}\)\}\s+</div>\s+)(</div>\s+\),\s+\{ width, height \}\s+\);\s+\}\s*$)',
        r'''\1
        {/* Footer with year, days left, and percentage below days grid */}
        <div style={footerStyle}>
          <div style={footerBoxStyle}>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.045, 52) * 1.1, fontWeight: 600, color: theme.textColor, letterSpacing: 4 }}>
              {calendar.year}
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.018 * 1.3, 22) * 1.1, fontWeight: 500, color: "#ff0000", letterSpacing: 1 }}>
              {calendar.daysLeft} days remaining
            </div>
            <div style={{ display: "flex", fontSize: Math.max(width * 0.016, 20) * 1.1, fontWeight: 500, color: theme.textColor, letterSpacing: 1 }}>
              {percentageCompleted}% completed • {percentageRemaining}% remaining
            </div>
          </div>
        </div>
      \2''',
        content
    )
    
    # Increase text sizes in renderWeeksView
    content = re.sub(
        r'fontSize: weekHeight \* 0\.3,',
        r'fontSize: weekHeight * 0.3 * 1.1, // Increase by 10%',
        content
    )
    
    content = re.sub(
        r'fontSize: weekHeight \* 0\.25,',
        r'fontSize: weekHeight * 0.25 * 1.1, // Increase by 10%',
        content
    )
    
    # Increase text sizes in renderDaysLeftView
    content = re.sub(
        r'fontSize: daySize \* 0\.35,',
        r'fontSize: daySize * 0.35 * 1.1, // Increase by 10%',
        content
    )
    
    content = re.sub(
        r'fontSize: daySize \* 0\.25,',
        r'fontSize: daySize * 0.25 * 1.1, // Increase by 10%',
        content
    )
    
    content = re.sub(
        r'fontSize: daySize \* 0\.2,',
        r'fontSize: daySize * 0.2 * 1.1, // Increase by 10%',
        content
    )
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Added footers to all remaining layouts")
    print("✅ Increased text sizes by 10% in all layouts")
    print("✅ All layouts now have year, days remaining, and percentage completion")

if __name__ == '__main__':
    add_footers_and_text_sizes()
