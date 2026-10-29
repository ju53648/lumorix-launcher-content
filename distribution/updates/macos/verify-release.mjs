#!/usr/bin/env node
// Public repo: independently validate both macOS release architectures before publishing.
import {readFileSync, existsSync, writeFileSync, unlinkSync} from "node:fs";
import {join} from "node:path";
import {createHash} from "node:crypto";
import {spawnSync} from "node:child_process";

const root="distribution/updates/macos";
const manifest=JSON.parse(readFileSync(join(root,"latest.json"),"utf8"));
const ver=manifest.version;
if(!/^\d+\.\d+\.\d+$/.test(ver)) throw Error("Invalid semver");
if (!manifest.platforms || Object.keys(manifest.platforms).sort().join(",") !== "darwin-aarch64,darwin-x86_64") {
  throw Error("Missing macOS architecture or unexpected updater platform");
}
const pubkey=join(root,"updater.pub");
if(!existsSync(pubkey)) throw Error("Minisign public key missing");
const expectedPublicKey=readFileSync(pubkey,"utf8").trim();
if (!expectedPublicKey.startsWith("untrusted comment: minisign public key:")) throw Error("Invalid pubkey");
for (const [arch,platformKey] of [["arm64","darwin-aarch64"],["x64","darwin-x86_64"]]){
  const platform=manifest.platforms[platformKey];
  if(!platform || typeof platform.signature!=="string" || typeof platform.url!=="string") throw Error("Missing platform "+platformKey);
  const name="VENSUKO.Launcher_"+ver+"_macos-"+arch;
  const dir=join(root,"releases",ver);
  const archive=join(dir,name+".app.tar.gz");
  const dmg=join(dir,name+".dmg");
  const signature=archive+".sig";
  for(const f of [archive,signature,archive+".sha256",dmg,dmg+".sha256"])
    if(!existsSync(f)) throw Error("Release asset missing: "+f);
  for(const asset of [archive,dmg]){
    const hash=createHash("sha256").update(readFileSync(asset)).digest("hex");
    const expected=readFileSync(asset+".sha256","utf8").trim().split(/\s+/)[0].toLowerCase();
    if(hash !== expected)throw Error("SHA256 mismatch: "+asset);
  }
  const encoded=readFileSync(signature,"utf8").trim();
  const signatureBytes=Buffer.from(encoded,"base64");
  const manifestSignatureBytes=Buffer.from(platform.signature,"base64");
  if(!signatureBytes.equals(manifestSignatureBytes)){
    console.error("Signature mismatch diagnostic",arch,{fileBytes:signatureBytes.length,manifestBytes:manifestSignatureBytes.length});
    throw Error("Manifest signature mismatch for "+arch);
  }
  const expectedUrl="https://raw.githubusercontent.com/ju53648/lumorix-launcher-content/main/"+archive.replaceAll("\\","/");
  if (platform.url!==expectedUrl)throw Error("Unexpected updater URL for "+arch);
  const decoded=signature+".decoded";
  writeFileSync(decoded,Buffer.from(encoded,"base64").toString("utf8"));
  try {
    const verified=spawnSync("minisign",["-Vm",archive,"-p",pubkey,"-x",decoded,"-q"],{encoding:"utf8"});
    if(verified.status!==0)throw Error("Cryptographic updater signature invalid for "+arch+": "+verified.stderr);
  } finally {
    unlinkSync(decoded);
  }
  console.error("Verified macOS",arch,"signature, update archive and DMG checksum");
}
console.log("version="+ver);
console.log("tag=vensuko-launcher-v"+ver+"-macos");
console.log("release_notes<<VENSUKO_NOTES_END");
console.log(typeof manifest.notes==="string"?manifest.notes:"VENSUKO Launcher "+ver+" - macOS");
console.log("VENSUKO_NOTES_END");
