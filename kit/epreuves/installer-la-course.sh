#!/bin/sh
# =============================================================================
#  Installer la course de nuit — à lancer depuis TON terminal.
#
#  Pourquoi un script et pas une ligne : le rendez-vous de nuit est lancé par
#  macOS, pas par toi. Il n'hérite donc pas de ton terminal, et il ne trouve ni
#  node ni npm — c'est l'erreur « command not found: node ». Ce script résout
#  les chemins depuis TON environnement, une fois, et les écrit dans le
#  rendez-vous. Lancé d'ici, il voit ce que tu vois.
#
#      sh kit/epreuves/installer-la-course.sh
# =============================================================================
set -e

RACINE="$(cd "$(dirname "$0")/../.." && pwd)"
PLIST="$HOME/Library/LaunchAgents/fr.fili.banc-de-nuit.plist"
NODE="$(command -v node || true)"

if [ -z "$NODE" ]; then
  echo ""
  echo "🔴 node est introuvable, même depuis ton terminal."
  echo "   Rien n'a été installé. Lance « which node » : si ça ne répond rien,"
  echo "   node n'est pas installé sur cette machine."
  echo ""
  exit 1
fi

if ! command -v npm >/dev/null 2>&1; then
  echo ""
  echo "🔴 npm est introuvable alors que node existe. Rien n'a été installé."
  echo ""
  exit 1
fi

mkdir -p "$HOME/Library/LaunchAgents"
cat > "$PLIST" <<PLISTFIN
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<!-- Écrit par kit/epreuves/installer-la-course.sh. Ne pas modifier à la main :
     relancer l'installateur. -->
<plist version="1.0">
<dict>
  <key>Label</key>
  <string>fr.fili.banc-de-nuit</string>

  <key>ProgramArguments</key>
  <array>
    <string>$NODE</string>
    <string>$RACINE/kit/epreuves/course-de-nuit.mjs</string>
  </array>

  <key>WorkingDirectory</key>
  <string>$RACINE</string>

  <key>EnvironmentVariables</key>
  <dict>
    <key>PATH</key>
    <string>$PATH</string>
    <key>HOME</key>
    <string>$HOME</string>
  </dict>

  <key>StartCalendarInterval</key>
  <dict>
    <key>Hour</key><integer>3</integer>
    <key>Minute</key><integer>30</integer>
  </dict>

  <key>RunAtLoad</key>
  <false/>

  <key>StandardOutPath</key>
  <string>$RACINE/kit/epreuves/banc-de-nuit.launchd.log</string>
  <key>StandardErrorPath</key>
  <string>$RACINE/kit/epreuves/banc-de-nuit.launchd.log</string>
</dict>
</plist>
PLISTFIN

launchctl unload "$PLIST" >/dev/null 2>&1 || true
launchctl load -w "$PLIST"

echo ""
echo "🟢 Le rendez-vous de nuit est posé — tous les jours à 3 h 30."
echo "   node vu par le rendez-vous : $NODE"
echo "   Le verdict du matin s'écrira dans docs/banc-du-jour.md"
echo ""
echo "   Pour l'essayer maintenant (deux à trois minutes) :"
echo "     launchctl start fr.fili.banc-de-nuit && sleep 5 && tail -f \"$RACINE/kit/epreuves/banc-de-nuit.launchd.log\""
echo ""
echo "   Pour l'arrêter un jour :"
echo "     launchctl unload -w \"$PLIST\""
echo ""
