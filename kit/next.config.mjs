/** @type {import('next').NextConfig} */
/* Les crash-tests de page construisent le site dans un dossier à part
   (KIT_DIST=.next-epreuves) : « next dev » et « next build » partagent
   sinon le même .next, et l'un corrompt l'autre pendant qu'on travaille. */
export default { distDir: process.env.KIT_DIST || '.next' }
