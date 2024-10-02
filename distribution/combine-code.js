const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

// 1. 루트에 /dist 폴더 생성
if (!fs.existsSync('./dist')) {
    fs.mkdirSync('./dist');
    console.log('Created /dist folder');
}

// 2. app.js와 components 폴더의 js 파일들을 결합하여 app_all.js 생성
let combinedCode = fs.readFileSync('./app.js', 'utf8') + '\n';

const componentsDir = './components';
fs.readdirSync(componentsDir).forEach(file => {
    if (path.extname(file) === '.js') {
        const content = fs.readFileSync(path.join(componentsDir, file), 'utf8');
        combinedCode += content + '\n';
    }
});

// 난독화 적용
console.log('Starting obfuscation process...');
console.log('Combined code length:', combinedCode.length);

const obfuscationResult = JavaScriptObfuscator.obfuscate(combinedCode, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    debugProtection: false,
    debugProtectionInterval: 0,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    log: false,
    renameGlobals: false,
    rotateStringArray: true,
    selfDefending: true,
    shuffleStringArray: true,
    splitStrings: true,
    splitStringsChunkLength: 10,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    unicodeEscapeSequence: false
});

const obfuscatedCode = obfuscationResult.getObfuscatedCode();
console.log('Obfuscation successful');
console.log('Obfuscated code length:', obfuscatedCode.length);
fs.writeFileSync('./dist/app_all.js', obfuscatedCode);
console.log('Created and obfuscated app_all.js');

// 3. 파일들을 /dist 폴더로 이동 및 수정
// index.html 수정 및 이동
let indexHtml = fs.readFileSync('./index.html', 'utf8');
// CSS 경로 수정
indexHtml = indexHtml.replace('href="css/styles.css"', 'href="styles.css"');
// 주석으로 둘러싸인 부분 제거 및 app_all.js 스크립트 추가
indexHtml = indexHtml.replace(
    /<!--배포시제거시작-->[\s\S]*?<!--배포시제거끝-->/,
    '<script src="app_all.js"></script>'
);
fs.writeFileSync('./dist/index.html', indexHtml);
console.log('Modified and moved index.html to /dist');

// styles.css 이동
fs.copyFileSync('./css/styles.css', './dist/styles.css');
console.log('Moved styles.css to /dist');

// imgs 폴더 이동
fs.cpSync('./imgs', './dist/imgs', { recursive: true });
console.log('Moved imgs folder to /dist');

console.log('All operations completed successfully.');