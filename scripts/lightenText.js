const fs = require('fs');
const path = require('path');

// Function to lighten color
function lightenColor(color, percentage) {
    // Remove the hash if it exists
    if (color[0] === '#') {
        color = color.slice(1);
    }

    // Check if the color is valid
    if (!/^([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(color)) {
        return color; // Return the original color if it's invalid
    }

    // Convert to RGB
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    // Increase the color values based on the percentage
    r = Math.min(255, Math.round(r + (255 - r) * percentage));
    g = Math.min(255, Math.round(g + (255 - g) * percentage));
    b = Math.min(255, Math.round(b + (255 - b) * percentage));

    // Convert back to hex and return
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`;
}

// Function to modify the colors in the CSS content
function lightenCSSColors(cssContent, percentage) {
    const colorRegex = /(?:color|background-color|border-color|outline-color|box-shadow|text-shadow|column-rule-color|caret-color|fill)\s*:\s*(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3}|rgba?\([^\)]+\))/g;

    return cssContent.replace(colorRegex, (match, colorValue) => {
        if (colorValue[0] === '#') {
            const newColor = lightenColor(colorValue, percentage);
            return match.replace(colorValue, newColor);
        }
        return match; // For non-hex colors, leave them as-is
    });
}

// Function to load the CSS file, modify it, and write to a new file
function loadAndModifyCSS(filePath, percentage) {
    try {
        console.log('Reading CSS file:', filePath);
        // Read the CSS file content
        const cssContent = fs.readFileSync(filePath, 'utf8');

        console.log('Original CSS content loaded.');

        // Lighten the colors in the CSS content
        const modifiedCSS = lightenCSSColors(cssContent, percentage);

        // Check if any changes were made
        if (modifiedCSS === cssContent) {
            console.log('No changes detected in CSS content.');
        } else {
            // Define a new file path (you can adjust this as needed)
            const newFilePath = path.join(path.dirname(filePath), 'modified_styles.css');

            console.log('Changes detected, writing modified content to:', newFilePath);
            // Write the modified CSS content to a new file
            fs.writeFileSync(newFilePath, modifiedCSS, 'utf8');
            console.log('CSS modifications have been written to the new file:', newFilePath);
        }

    } catch (error) {
        console.error('Error loading or modifying CSS file:', error);
    }
}

// Example usage: Pass the path to your CSS file and the percentage for color lightening
const cssFilePath = path.join(__dirname, 'styles.css'); // Make sure styles.css is in the same directory
loadAndModifyCSS(cssFilePath, 0.25); // Increase color brightness by 25%
