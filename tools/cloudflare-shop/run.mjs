import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
import {buildStaging,configPath} from './build.mjs';

const action=process.argv[2];
if(!['dev','check','deploy-staging'].includes(action))throw Error('Only dev, check and deploy-staging are allowed');
buildStaging();
const args=action==='dev'?['dev','--local','--port','8172']:action==='check'?['deploy','--dry-run']:['deploy'];
args.push('--config',configPath,'--env','staging');
const result=spawnSync(process.execPath,[fileURLToPath(new URL('./node_modules/wrangler/bin/wrangler.js',import.meta.url)),...args],{stdio:'inherit',env:{...process.env,WRANGLER_SEND_METRICS:'false'}});
if(result.error)throw result.error;
process.exitCode=result.status??1;
