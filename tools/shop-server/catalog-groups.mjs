// Owner-curated browsing group; general serving suitability is a different fact.
export const servingListingIds=new Set(['1827805914','4381023266','1818046728','1848021568','4440690649','4389604739','4398179153','4599650982']);
export function catalogGroups(product){
  if(product.category==='care'||product.listingId==='1874454440')return ['care'];
  if(product.listingId==='1838851839')return ['coasters'];
  if(product.category==='accessory')return ['tools'];
  if(product.category!=='board')return [];
  return [...(product.productType!=='servingBoard'||product.useCases?.includes('daily')?['board']:[]),...(servingListingIds.has(product.listingId)?['serving']:[])];
}
