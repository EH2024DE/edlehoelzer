import test from 'node:test';
import assert from 'node:assert/strict';
import {parse} from '../tools/shop-server/node_modules/parse5/dist/index.js';
import {auditNavigation} from '../scripts/audit-navigation.mjs';
import {renderProductionPage} from '../scripts/build-site.mjs';
import {sitePages,walk,attr} from '../tools/shop-server/site-preview.mjs';

test('every sitemap page is reachable within two links from a homepage',()=>{
  const report=auditNavigation();
  assert.deepEqual(report.unreachable,[]);
  assert.ok(Object.values(report.depths).every(depth=>depth<=2));
});
test('all page menus expose guides and refurbishment as direct choices',()=>{
  for(const route of sitePages.keys()){
    const en=route.startsWith('/en/'),nodes=walk(parse(renderProductionPage(route)));
    const menu=nodes.find(node=>attr(node,'id')==='atelier-menu');assert.ok(menu,route);
    const links=walk(menu).filter(node=>node.tagName==='a').map(node=>attr(node,'href'));
    assert.ok(links.includes(en?'/en/refurbishment/':'/schneidebrett-aufbereiten/'),route);
    assert.ok(links.includes('/sitemap-uebersicht.html'+(en?'#english-topics':'')),route);
  }
});
