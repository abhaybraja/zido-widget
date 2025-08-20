const fs = require('fs');
const path = require('path');
const { minify } = require('terser');

const srcPath = path.join(__dirname, '../src/zido-widget.js');
const distPath = path.join(__dirname, '../dist');

// Ensure dist directory exists
if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath);
}

// Read source file
const sourceCode = fs.readFileSync(srcPath, 'utf8');

// Copy unminified version
fs.writeFileSync(path.join(distPath, 'zido-widget.js'), sourceCode);

// Create minified version
minify(sourceCode, {
    compress: {
        drop_console: true,
        drop_debugger: true
    },
    mangle: true,
    format: {
        comments: false
    }
}).then(result => {
    fs.writeFileSync(path.join(distPath, 'zido-widget.min.js'), result.code);
    console.log('✓ Minified version created');
});

// Create ES Module version
const esmCode = sourceCode.replace(
    /\(typeof window !== 'undefined' \? window : this\)/,
    'globalThis'
) + '\nexport default ZidoWidget;';

fs.writeFileSync(path.join(distPath, 'zido-widget.esm.js'), esmCode);

console.log('✓ Build completed successfully');
console.log('Files created:');
console.log('- dist/zido-widget.js');
console.log('- dist/zido-widget.min.js');
console.log('- dist/zido-widget.esm.js');