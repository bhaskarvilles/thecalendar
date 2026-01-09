#!/usr/bin/env python3
"""
Script to update all calendar layout functions with:
1. Repositioned year/days info to footer
2. Added percentage completion
3. Increased dot sizes by 12%
4. Increased text sizes by 10%
"""

import re

def update_route_file():
    file_path = r'c:\Users\Bhaskar\Documents\GitHub\thecalendar\src\app\months\route.tsx'
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Fix renderMonthsList - update layout sections
    content = re.sub(
        r'(function renderMonthsList\([^)]+\) \{\s+)// 30-30-40 layout\s+const topSection = height \* 0\.3;\s+const middleSection = height \* 0\.4;\s+const bottomSection = height \* 0\.3;',
        r'\1// 10% top, 60% middle, 30% bottom layout\n  const topSection = height * 0.1;\n  const middleSection = height * 0.6;\n  const bottomSection = height * 0.3;',
        content
    )
    
    # Fix renderMonthsList - update daySize
    content = re.sub(
        r'(const monthHeight = \(middleSection - monthGap \* 11\) / 12;\s+)const daySize = monthHeight / 6;',
        r'\1const daySize = (monthHeight / 6) * 1.12; // Increase by 12%',
        content
    )
    
    # Fix renderMonthsList - add percentage calculation
    content = re.sub(
        r'(const dayGap = density === "compact" \? daySize \* 0\.1 : daySize \* 0\.15;\s+)(// Pre-calculate styles)',
        r'\1\n  // Calculate percentage\n  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);\n  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);\n\n  \2',
        content
    )
    
    # Now update renderYearView, renderWeeksView, and renderDaysLeftView
    # Pattern: Find "// 30-30-40 layout" or similar and update to "// 10% top, 60% middle, 30% bottom layout"
    
    # Update renderYearView
    content = re.sub(
        r'(function renderYearView\([^)]+\) \{\s+)// 30-30-40 layout\s+const topSection = height \* 0\.3;\s+const middleSection = height \* 0\.4;\s+const bottomSection = height \* 0\.3;',
        r'\1// 10% top, 60% middle, 30% bottom layout\n  const topSection = height * 0.1;\n  const middleSection = height * 0.6;\n  const bottomSection = height * 0.3;',
        content
    )
    
    # Update renderWeeksView
    content = re.sub(
        r'(function renderWeeksView\([^)]+\) \{\s+)// 30-30-40 layout\s+const topSection = height \* 0\.3;\s+const middleSection = height \* 0\.4;\s+const bottomSection = height \* 0\.3;',
        r'\1// 10% top, 60% middle, 30% bottom layout\n  const topSection = height * 0.1;\n  const middleSection = height * 0.6;\n  const bottomSection = height * 0.3;',
        content
    )
    
    # Update renderDaysLeftView
    content = re.sub(
        r'(function renderDaysLeftView\([^)]+\) \{\s+)// 30-30-40 layout\s+const topSection = height \* 0\.3;\s+const middleSection = height \* 0\.4;\s+const bottomSection = height \* 0\.3;',
        r'\1// 10% top, 60% middle, 30% bottom layout\n  const topSection = height * 0.1;\n  const middleSection = height * 0.6;\n  const bottomSection = height * 0.3;',
        content
    )
    
    # Update daySize in renderYearView
    content = re.sub(
        r'(function renderYearView[^{]+\{[^}]+?)const daySize = Math\.min\(middleSection / 53, contentWidth / 53\);',
        r'\1const daySize = Math.min(middleSection / 53, contentWidth / 53) * 1.12; // Increase by 12%',
        content,
        flags=re.DOTALL
    )
    
    # Add percentage calculations to renderYearView, renderWeeksView, renderDaysLeftView
    for func_name in ['renderYearView', 'renderWeeksView', 'renderDaysLeftView']:
        # Find the function and add percentage calculation after the layout constants
        pattern = rf'(function {func_name}\([^)]+\) \{{[^}}]+?const bottomSection = height \* 0\.3;\s+)'
        replacement = r'\1\n  // Calculate percentage\n  const percentageCompleted = Math.round((calendar.daysGone / calendar.totalDays) * 100);\n  const percentageRemaining = Math.round((calendar.daysLeft / calendar.totalDays) * 100);\n\n  '
        content = re.sub(pattern, replacement, content, flags=re.DOTALL)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    
    print("✅ Updated layout sections and added percentage calculations")
    print("✅ Increased dot sizes by 12%")
    print("✅ Ready for footer additions")

if __name__ == '__main__':
    update_route_file()
