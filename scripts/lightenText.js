const fs = require('fs');
const path = require('path');

// Function to lighten a color
function lightenColor(color, percentage) {
    if (color[0] === '#') {
        color = color.slice(1);
    }

    // Ensure it's a valid hex code
    if (!/^([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(color)) {
        return color;
    }

    // Convert hex to RGB
    let r = parseInt(color.substring(0, 2), 16);
    let g = parseInt(color.substring(2, 4), 16);
    let b = parseInt(color.substring(4, 6), 16);

    // Increase brightness
    r = Math.min(255, Math.round(r + (255 - r) * percentage));
    g = Math.min(255, Math.round(g + (255 - g) * percentage));
    b = Math.min(255, Math.round(b + (255 - b) * percentage));

    // Convert back to hex
    return `#${(1 << 24 | r << 16 | g << 8 | b).toString(16).slice(1).toUpperCase()}`;
}

// Function to modify only `color` property inside `.btn` or `.text` classes
function modifyOnlyColorProperty(cssContent, percentage) {
    const ruleRegex = /([^{]+)\s*\{([^}]+)\}/g; // Matches CSS rule blocks

    return cssContent.replace(ruleRegex, (match, selector, properties) => {
        if (/\b(btn|text|badge)\b/.test(selector)) { // Only match selectors with .btn or .text
            const colorRegex = /(\s|^)color\s*:\s*(#[0-9A-Fa-f]{6}|#[0-9A-Fa-f]{3})(;|$)/g;

            // Modify ONLY the 'color' property
            properties = properties.replace(colorRegex, (colorMatch, whitespace, colorValue, semicolon) => {
                const newColor = lightenColor(colorValue, percentage);
                return `${whitespace}color: ${newColor}${semicolon}`;
            });
        }
        return `${selector} {${properties}}`; // Return the modified rule
    });
}


// Function to load, modify, and save CSS
function processCSS(filePath, percentage) {
    try {
        console.log('Reading CSS file:', filePath);
        const cssContent = fs.readFileSync(filePath, 'utf8');
        console.log('Original CSS content loaded.');

        const modifiedCSS = modifyOnlyColorProperty(cssContent, percentage);

        if (modifiedCSS === cssContent) {
            console.log('No changes detected in CSS content.');
        } else {
            const newFilePath = path.join(path.dirname(filePath), 'modified_styles.css');
            console.log('Writing modified content to:', newFilePath);
            fs.writeFileSync(newFilePath, modifiedCSS, 'utf8');
            console.log('CSS modifications saved.');
        }
    } catch (error) {
        console.error('Error modifying CSS:', error);
    }
}

// Run script on styles.css
const cssFilePath = path.join(__dirname, 'styles.css');
processCSS(cssFilePath, 0.75); // Lighten colors by 25%
