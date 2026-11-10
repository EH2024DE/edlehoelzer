import {parse,parseFragment,serialize} from 'parse5';
import {walk,attr} from './audit-design-system.mjs';

// Reuse the German project galleries so both languages retain the same assets and order.
export function customBoardEnglish({source,form,sections,faqs,etsyUrl}){
  const galleries=walk(parse(source)).filter(n=>(attr(n,'class')||'').split(' ').includes('customProjects__gallery'));
  const descriptions=[
    ['Completed oak XXL cutting board with visible growth rings','Cutting surface and grip recess of the oak board','Oak board lying flat with its stop edge visible'],
    ['Completed Yellow Poplar XXL cutting board with a symmetrical end-grain pattern','Grip recess and surface of the Yellow Poplar board','Stop edge with dark accent lines on the Yellow Poplar board']
  ];
  const gallery=i=>{
    const node=galleries[i];
    node.attrs.find(a=>a.name==='aria-label').value=`Customer project ${i+1}: three views`;
    walk(node).filter(n=>n.tagName==='img').forEach((img,j)=>img.attrs.find(a=>a.name==='alt').value=descriptions[i][j]);
    const fragment=parseFragment('');fragment.childNodes=[node];node.parentNode=fragment;return serialize(fragment);
  };
  return `<main class="englishEditorial customBoardPage">
  <section class="summaryHero" aria-labelledby="page-title"><div class="container">
    <nav class="breadcrumb" aria-label="Breadcrumb"><a href="/en/">Home</a> / Made-to-measure cutting boards</nav>
    <h1 id="page-title">Made-to-measure cutting boards</h1>
    <p class="summaryHero__intro">Your worktop. Your dimensions. We make your solid wood board in our workshop in Staufenberg, from a personal serving board to an XXL work surface with a stop edge.</p>
    <section class="pageSummary" aria-labelledby="summary-title"><h2 id="summary-title">At a glance</h2>
      <p>A board should fit the free working area, not cover the whole kitchen island. Allow room for ingredients, bowls, cleaning and an airy drying place. A large format only makes sense if you can also lift, clean and dry it.</p>
      <dl><div><dt>Your options</dt><dd>Serving boards, matching family boards, substantial work surfaces or a fitted holder. We agree the size, wood and details with you.</dd></div><div><dt>Your budget</dt><dd>Depending on size and specification, custom pieces can start at a few hundred euros. We calculate your board individually.</dd></div><div><dt>Your first step</dt><dd>A rough idea is enough. We discuss feasibility, budget and production time with you personally before making your board.</dd></div></dl>
    </section><div class="summaryActions"><a class="btn btn--emphasis" href="#enquiry">Discuss my idea</a><a class="summaryTextLink" href="#customer-projects">Explore completed customer projects</a></div>
  </div></section>
  <section class="section section--white customProjects" id="customer-projects" aria-labelledby="format-title"><div class="container">
    <p class="eyebrow">Made to our customers' requirements</p><h2 id="format-title">Built for our customers. Inspiration for your idea.</h2>
    <p class="section__lead">These two completed XXL projects show what we can make, not a minimum budget. A smaller cutting board, a simple serving board or a fitted holder can be your individual solution too.</p>
    <div class="customProjects__grid">
      <article>${gallery(0)}<h3>Oak: an XXL work surface with a stop edge</h3><p>This customer project uses oak end grain: 60 × 75 cm, 5 cm thick, with a grip recess and stop edge. All three views show the same board. It is an example of a work surface and edge solution, not a standard format for every kitchen island.</p><a class="btn btn--emphasis" href="#enquiry" data-inquiry-example="Customer project 1: oak XXL with stop edge">Discuss a similar project</a></article>
      <article>${gallery(1)}<h3>Yellow Poplar: an XXL board with its own character</h3><p>This second project uses symmetrically arranged Yellow Poplar end grain: 60 × 75 cm, 5 cm thick, with a grip recess and a stop edge with dark accent lines. For your board, we choose suitable available timber together, based on how you want to use it.</p><a class="btn btn--emphasis" href="#enquiry" data-inquiry-example="Customer project 2: Yellow Poplar XXL with accent lines">Discuss a similar project</a></article>
    </div><p class="customProjects__caption">Three views of each project. Oak and Yellow Poplar are examples, not fixed material choices. We agree the wood, dimensions and details with you personally.</p>
  </div></section>
  <section class="customBudget" aria-labelledby="reference-title"><div class="container"><h2 id="reference-title">What fits your idea and budget?</h2>
    <p>Custom pieces can start at a few hundred euros, depending on size and specification. Wood, thickness, construction and details determine the individual price.</p>
    <p>For orientation: our 75 × 60 cm XXL reference format with a stop edge starts at €1,199 and can reach around €1,600–1,700 depending on specification. This is an upper-range example, not a minimum budget or a quote for the two customer projects above.</p>
    <p>You can also start from the <a href="${etsyUrl}" target="_blank" rel="noopener" data-etsy-link>made-to-measure listing on Etsy</a>. Whichever route you choose, we contact you personally to agree your dimensions, wood, details and intended use before production. That conversation helps us create the best possible board for your kitchen.</p>
    <ol class="customBudget__steps"><li><strong>1. Share your idea</strong><span>Your intended use and rough dimensions are enough.</span></li><li><strong>2. Agree the details</strong><span>We discuss feasibility, wood, price and production time personally.</span></li><li><strong>3. Approve your board</strong><span>We make the agreed design only after your approval.</span></li></ol>
  </div></section>
  ${form}
  <section class="section section--white"><div class="container customBoardGuidance"><h2>Plan your individual board</h2>${sections}${faqs}<p><a href="/en/wood-types-for-cutting-boards/">Explore wood species</a> · <a href="/en/care.html">Care for your board</a></p></div></section>
  </main>`;
}
