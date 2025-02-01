const fs = require('fs');
const path = require('path');

// Helper function to darken a color by 30%
function darkenColor(color, percentage) {
    // Exclude 'transparent' from modification
    if (color === 'transparent') {
        return color;
    }

    const colorType = color.startsWith('rgb') || color.startsWith('rgba') || color.startsWith('hsl') || color.startsWith('hsla') ? 'functional' : 'hex';
    
    if (colorType === 'hex') {
        // Hex color format: #RRGGBB or #RRGGBBAA
        return darkenHexColor(color, percentage);
    } else if (colorType === 'functional') {
        // RGB or HSL format
        return darkenFunctionalColor(color, percentage);
    }

    return color; // Return original color if it's not recognized
}

// Function to darken a hex color
function darkenHexColor(hex, percentage) {
    // Ensure hex is valid
    if (!/^#[0-9a-fA-F]{3}$|^#[0-9a-fA-F]{6}$/.test(hex)) {
        console.warn(`Invalid hex color: ${hex}`);
        return hex; // Return the original color if it's invalid
    }

    // If short hex, expand it
    if (hex.length === 4) {
        hex = `#${hex[1]}${hex[1]}${hex[2]}${hex[2]}${hex[3]}${hex[3]}`;
    }

    let r = parseInt(hex.slice(1, 3), 16);
    let g = parseInt(hex.slice(3, 5), 16);
    let b = parseInt(hex.slice(5, 7), 16);

    r = Math.max(0, Math.min(255, Math.floor(r * (1 - percentage))));
    g = Math.max(0, Math.min(255, Math.floor(g * (1 - percentage))));
    b = Math.max(0, Math.min(255, Math.floor(b * (1 - percentage))));

    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

// Function to darken an RGB or HSL color
function darkenFunctionalColor(color, percentage) {
    if (color.startsWith('rgb')) {
        // rgb or rgba
        const regex = /rgba?\((\d+), (\d+), (\d+)(?:, ([\d.]+))?\)/;
        const match = color.match(regex);
        if (!match) {
            console.warn(`Invalid RGB color: ${color}`);
            return color; // Return the original color if it's invalid
        }

        let [, r, g, b] = match;
        r = Math.max(0, Math.min(255, Math.floor(r * (1 - percentage))));
        g = Math.max(0, Math.min(255, Math.floor(g * (1 - percentage))));
        b = Math.max(0, Math.min(255, Math.floor(b * (1 - percentage))));

        if (match[4]) {
            // If it's rgba, keep the alpha channel
            return `rgba(${r}, ${g}, ${b}, ${match[4]})`;
        }
        return `rgb(${r}, ${g}, ${b})`;
    } else if (color.startsWith('hsl')) {
        // hsl or hsla
        const regex = /hsla?\((\d+), (\d+)%, (\d+)%(\s*,\s*(\d*\.?\d+))?\)/;
        const match = color.match(regex);
        if (!match) {
            console.warn(`Invalid HSL color: ${color}`);
            return color; // Return the original color if it's invalid
        }

        let [, h, s, l, , alpha] = match;

        // Darken by reducing the lightness (l value)
        l = Math.max(0, Math.min(100, l - (percentage * 100)));

        if (alpha) {
            return `hsla(${h}, ${s}%, ${l}%, ${alpha})`;
        }
        return `hsl(${h}, ${s}%, ${l}%)`;
    }

    return color; // Return original color if it's not recognized
}

// Function to process and darken colors in the CSS content
function darkenCSSColors(cssContent, percentage) {
    const colorRegex = /(color|background-color|border-color|outline-color|box-shadow|text-shadow|column-rule-color|caret-color|fill)\s*:\s*(#[0-9a-fA-F]{3,6}|rgba?\([\d\s,]+\)|hsla?\([\d\s,%.]+\)|transparent)/g;

    return cssContent.replace(colorRegex, (match, property, color) => {
        const darkenedColor = darkenColor(color, percentage);
        return `${property}: ${darkenedColor}`;
    });
}

// Function to load, process, and overwrite the CSS file
function loadAndModifyCSS(filePath, percentage) {
    try {
        // Read the CSS file content
        const cssContent = fs.readFileSync(filePath, 'utf8');

        // Darken the colors in the CSS content
        const modifiedCSS = darkenCSSColors(cssContent, percentage);

        // Overwrite the original file with the modified CSS
        fs.writeFileSync(filePath, modifiedCSS, 'utf8');

        console.log('CSS file has been updated with darker colors.');

    } catch (error) {
        console.error('Error loading or updating CSS file:', error);
    }
}

// Example usage: Pass the path to your CSS file
const cssFilePath = path.join(__dirname, 'styles.css'); // Ensure styles.css is in the same directory
const darkenPercentage = 0.3; // Darken colors by 30%
loadAndModifyCSS(cssFilePath, darkenPercentage);
