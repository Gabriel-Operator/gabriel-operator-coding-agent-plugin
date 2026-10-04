const schema = require('../references/chakri-scrap-copy-schema.json');
function validateChakriLandingContent(content) {
  const issues = [];
  const base = 'landingPage.scrapOperations';
  const record = (value, path, keys) => {
    if (!value || typeof value !== 'object' || Array.isArray(value)) { issues.push({path,message:'Provide the complete Chakri content object.'}); return false; }
    for (const key of Object.keys(value)) if (!keys.includes(key)) issues.push({path:`${path}.${key}`,message:'Only registered Chakri copy fields are allowed.'});
    return true;
  };
  const text = (value,path) => { if (typeof value !== 'string' || !value.trim() || value.length > 700) issues.push({path,message:'Provide non-empty copy up to 700 characters.'}); };
  if (!record(content,base,schema.roots)) return issues;
  if (record(content.labels,`${base}.labels`,schema.labels)) for (const key of schema.labels) text(content.labels[key],`${base}.labels.${key}`);
  if (record(content.markets,`${base}.markets`,schema.markets)) for (const code of schema.markets) {
    const market = content.markets[code];
    if (record(market,`${base}.markets.${code}`,schema.marketFields)) for (const key of schema.marketFields) text(market[key],`${base}.markets.${code}.${key}`);
  }
  if (content.global !== undefined && record(content.global,`${base}.global`,schema.marketFields)) for (const key of schema.marketFields) text(content.global[key],`${base}.global.${key}`);
  for (const [key,contract] of Object.entries(schema.arrays)) {
    const values = content[key];
    if (!Array.isArray(values) || values.length !== contract.count) { issues.push({path:`${base}.${key}`,message:`Provide exactly ${contract.count} entries.`}); continue; }
    values.forEach((value,index)=>{const path=`${base}.${key}[${index}]`;if(record(value,path,contract.fields))for(const field of contract.fields)text(value[field],`${path}.${field}`);});
  }
  return issues;
}
module.exports = { validateChakriLandingContent };
