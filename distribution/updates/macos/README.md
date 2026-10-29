# VENSUKO Launcher macOS updater

The public \`latest.json\` is the independent Tauri updater feed for both \`darwin-aarch64\` and \`darwin-x86_64\`.

Every release must contain a signed \`.app.tar.gz\` asset for each architecture. Signatures must match the public key embedded in the shipped launcher. The corresponding \`.dmg\` files are provided for first-time or manual installation.

Windows has a separate release feed. This file must not be replaced with a Windows-only manifest.
