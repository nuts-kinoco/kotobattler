const fs = require('fs');

// TSファイルのタイトルを確認
const ts = fs.readFileSync('src/data/starterDeck.ts', 'utf-8');
const start = ts.indexOf('"title": "') + '"title": "'.length;
const end = ts.indexOf('"', start);
const title = ts.slice(start, end);
console.log('TS first title:', title);
console.log('TS title hex:', Buffer.from(title, 'utf-8').toString('hex'));
console.log('Expected "第一印象のブキ" hex:', Buffer.from('第一印象のブキ', 'utf-8').toString('hex'));
console.log('Match:', title === '第一印象のブキ');

// CSVファイルのタイトルも確認
const csv = fs.readFileSync('src/data/starter_cards.csv', 'utf-8');
const csvLines = csv.split('\n');
console.log('\nCSV line 2 (raw):', JSON.stringify(csvLines[1].substring(0, 60)));

// スクリプトを手動実行してみる
console.log('\n--- Running generate script manually ---');
