import test from 'node:test';
import assert from 'node:assert/strict';
import { referenceQuality } from './reference-quality.js';
test('a frontal, well-resolved reference is accepted',()=>{
 assert.equal(referenceQuality([[.2,.3],[.6,.3],[.6,.6],[.2,.6]],1368,1824,29.7,21),null);
});
test('the example kitchen reference is accepted',()=>{
 assert.equal(referenceQuality([[292/1368,1222/1824],[665/1368,1150/1824],[769/1368,1298/1824],[330/1368,1400/1824]],1368,1824,29.7,21),null);
});
test('tiny reference requests a closer photo',()=>{
 assert.equal(referenceQuality([[.2,.3],[.21,.3],[.21,.31],[.2,.31]],1368,1824,29.7,21),'small');
});
test('flattened reference requests a higher viewpoint',()=>{
 assert.equal(referenceQuality([[.2,.3],[.6,.3],[.6,.318],[.2,.318]],1368,1824,29.7,21),'flat');
});
test('crossed reference requests corner correction',()=>{
 assert.ok(referenceQuality([[.2,.3],[.6,.6],[.6,.3],[.2,.6]],1368,1824,29.7,21));
});
