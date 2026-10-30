# VENSUKO DropDash 3.0.1 - Achievement-Synchronisierung

- Alle 102 Erfolge können mit dem angemeldeten VENSUKO-Account synchronisiert werden.
- Neue Erfolge werden nach gewerteten Runden sicher über den Launcher übertragen.
- Server prüft Spielmodus, Grenzen und doppelte Runden-IDs. Zugangstoken bleiben im Launcher.
- Offline-Runden werden accountgebunden gespeichert und bei erneuter Verbindung nachgesendet.
- Fortschritt aus DropDash 3.0.0 wird beim ersten Verbinden einmalig übernommen.
- Alte lokale Importe werden als nicht rückwirkend verifiziert gekennzeichnet.
- Spielstände, Ranglisten, Audio, Grafik und alle fünf Modi bleiben unverändert.

## Compatibility
The new sync requires VENSUKO Launcher 0.16.2 or later.
DropDash remains playable with older launcher versions; local progress is retained until sync becomes available.
Server-side range checks and deduplication prevent common errors but cannot cryptographically prove untampered game telemetry.

Game ID: com.lumorix.dropdash
Version: 3.0.1
Developer: VENSUKO