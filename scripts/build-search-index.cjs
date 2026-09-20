const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const summaries = JSON.parse(fs.readFileSync(path.join(root,'docs/page-summaries.json'),'utf8'));
const decode = s => s.replace(/&amp;/g,'&').replace(/&quot;/g,'"').replace(/&#39;/g,"'");
const pages = summaries.map(row => {
  const html = fs.readFileSync(path.join(root,row.route.slice(1),row.route.endsWith('/')?'index.html':''),'utf8');
  return {url:row.route,title:decode(html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i)[1].replace(/<[^>]+>/g,'')),text:row.items.map(i=>i.text).join(' ')};
});
fs.writeFileSync(path.join(root,'assets/search-pages.json'),JSON.stringify(pages,null,2)+'\n');
console.log(`Search index: ${pages.length} pages`);
