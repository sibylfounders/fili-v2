import { runBattery } from './battery.mjs'
const r = await runBattery()
console.log(JSON.stringify(Object.fromEntries(r.map((x) => [x.id, x.obtained]))))
