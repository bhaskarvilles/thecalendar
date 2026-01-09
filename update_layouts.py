import re

# Read the file
with open(r'c:\Users\Bhaskar\Documents\GitHub\thecalendar\src\app\months\route.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# For renderMonthsList - update layout sections
content = re.sub(
    r'(function renderMonthsList\([^)]+\) \{[^}]+?)// 30-30-40 layout\s+const topSection = height \* 0\.3;\s+const middleSection = height \* 0\.4;\s+const bottomSection = height \* 0\.3;',
    r'\1// 10% top, 60% middle, 30% bottom layout\n  const topSection = height * 0.1;\n  const middleSection = height * 0.6;\n  const bottomSection = height * 0.3;',
    content,
    flags=re.DOTALL
)

# Update daySize in renderMonthsList
content = re.sub(
    r'(function renderMonthsList[^{]+\{[^}]+?const daySize = )monthHeight / 6;',
    r'\1(monthHeight / 6) * 1.12; // Increase by 12%',
    content,
    flags=re.DOTALL
)

# Add percentage calculation to renderMonthsList
content = re.sub(
    r'(const dayGap = density === "compact" \? daySize \* 0\.1 : daySize \* 0\.15;)\s+(// Pre-calculate styles)',
    r'\1\n\n  // Calculate percentage\n  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);\n  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);\n\n  \2',
    content
)

# Add footer to renderMonthsList before closing
content = re.sub(
    r'(})}\s+</div>\s+</div>\s+\),\s+\{ width, height \}\s+\);\s+\}\s+function renderYearView)',
    r'''\1}}
        </div>

        {/* Footer with year, days left, and percentage below months */}
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
      </div>
    ),
    { width, height }
  );
}

\2''',
    content
)

# Write back
with open(r'c:\Users\Bhaskar\Documents\GitHub\thecalendar\src\app\months\route.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated renderMonthsList successfully!")
