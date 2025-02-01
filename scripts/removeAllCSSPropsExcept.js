const fs = require('fs');
const path = require('path');

// Function to remove all CSS properties except for the allowed ones
function removeUnwantedCSSProperties(cssContent) {
    // Define the properties to keep
    const propertiesToKeep = [
        'color', 'background-color', 'border-color', 'outline-color',
        'box-shadow', 'text-shadow', 'column-rule-color', 'caret-color', 'fill'
    ];

    // Regex to match each CSS rule and extract properties
    const ruleRegex = /([^{]+)\s*\{([^}]+)\}/g;
    let result = '';

    let match;
    while ((match = ruleRegex.exec(cssContent)) !== null) {
        const selector = match[1].trim();
        let properties = match[2].trim();

        // Remove properties that are not in the allowed list
        properties = properties.split(';').map(property => {
            const propertyName = property.split(':')[0].trim();
            if (propertiesToKeep.includes(propertyName)) {
                return property; // Keep the property if it's in the allowed list
            }
            return ''; // Remove the property if it's not in the allowed list
        }).filter(Boolean).join(';');

        // Only add the rule if it still has properties after removal
        if (properties.length > 0) {
            result += `${selector} {${properties}}\n`;
        }
    }

    return result;
}

// Function to load the CSS file, remove unwanted properties, and overwrite the original file
function loadAndModifyCSS(filePath) {
    try {
        // Read the CSS file content
        const cssContent = fs.readFileSync(filePath, 'utf8');

        // Remove the unwanted CSS properties
        const modifiedCSS = removeUnwantedCSSProperties(cssContent);

        // Overwrite the original file with the modified CSS
        fs.writeFileSync(filePath, modifiedCSS, 'utf8');

        console.log('CSS file has been updated by removing unwanted properties.');

    } catch (error) {
        console.error('Error loading or updating CSS file:', error);
    }
}

// Example usage: Pass the path to your CSS file
const cssFilePath = path.join(__dirname, 'styles.css'); // Ensure styles.css is in the same directory
loadAndModifyCSS(cssFilePath);
