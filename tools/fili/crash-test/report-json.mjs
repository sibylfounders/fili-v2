import { executerBatterie } from './battery.mjs'
const r = await executerBatterie()
console.log(JSON.stringify(Object.fromEntries(r.map((x) => [x.id, x.obtenu]))))
