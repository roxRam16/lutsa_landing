// Despliegue por SFTP / FTPS / FTP: compila y sube el sitio a tu hosting.
//
//   npm run deploy:pruebas            compila (build:pruebas) y sube dist-pruebas/ a FTP_REMOTE_DIR
//   npm run deploy:pruebas -- --dry-run   solo muestra qué subiría, sin conectarse
//   npm run deploy:pruebas -- --clean     vacía primero la carpeta remota (quita archivos viejos)
//   npm run deploy:pruebas -- --no-build  sube lo que ya está compilado
//
// Las credenciales viven en `.env.ftp` (NO se sube a git; plantilla: .env.ftp.example). Nunca se imprimen.
import { spawnSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { Client } from 'basic-ftp';
import SftpClient from 'ssh2-sftp-client';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const target = args.find((a) => !a.startsWith('--')) ?? 'pruebas';

if (target !== 'pruebas') {
  console.error(`Destino desconocido "${target}". Por ahora solo existe: pruebas (la raíz se agregará cuando se decida).`);
  process.exit(1);
}
const localDir = join(root, 'dist-pruebas');
const buildScript = 'build:pruebas';

// --- .env.ftp (KEY=VALUE, # comentarios) ---
const envFile = join(root, '.env.ftp');
if (!existsSync(envFile)) {
  console.error('Falta .env.ftp. Copia .env.ftp.example a .env.ftp y llena tus datos.');
  process.exit(1);
}
const env = Object.fromEntries(
  readFileSync(envFile, 'utf-8').split(/\r?\n/).map((l) => l.trim()).filter((l) => l && !l.startsWith('#') && l.includes('='))
    .map((l) => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^["']|["']$/g, '')]),
);
const protocol = (env.FTP_PROTOCOL || 'sftp').toLowerCase();
if (!['sftp', 'ftps', 'ftp'].includes(protocol)) { console.error('FTP_PROTOCOL debe ser sftp, ftps o ftp.'); process.exit(1); }
for (const key of ['FTP_HOST', 'FTP_USER', 'FTP_PASSWORD', 'FTP_REMOTE_DIR']) {
  if (!env[key]) { console.error(`Falta ${key} en .env.ftp`); process.exit(1); }
}
const remoteDir = env.FTP_REMOTE_DIR.replace(/\/+$/, '') || '/';
// Seguro: nunca subir (ni vaciar) la raíz del hosting
// "/" solo se acepta con FTP_ALLOW_ROOT=true: es el caso de un usuario SFTP limitado a SU carpeta (la "/" que
// ve ese usuario ya es la carpeta de pruebas). Con un usuario que ve todo el hosting, "/" sería la raíz del sitio.
const atRoot = remoteDir === '/' || remoteDir === '.';
if (atRoot && env.FTP_ALLOW_ROOT !== 'true') {
  console.error('FTP_REMOTE_DIR debe ser una carpeta concreta (p. ej. /prueba). Para usar "/" con un usuario limitado a su carpeta, agrega FTP_ALLOW_ROOT=true.');
  process.exit(1);
}

// --- compilar ---
if (!flag('no-build')) {
  console.log(`> npm run ${buildScript}`);
  const r = spawnSync('npm', ['run', buildScript], { cwd: root, stdio: 'inherit', shell: true });
  if (r.status !== 0) { console.error('La compilación falló; no se sube nada.'); process.exit(r.status ?? 1); }
}
if (!existsSync(join(localDir, 'index.html'))) { console.error(`No hay build en ${localDir}. Quita --no-build.`); process.exit(1); }

const countFiles = (dir) => readdirSync(dir).reduce((n, f) => (statSync(join(dir, f)).isDirectory() ? n + countFiles(join(dir, f)) : n + 1), 0);
const total = countFiles(localDir);
console.log(`Destino (${protocol}): ${env.FTP_USER}@${env.FTP_HOST}:${remoteDir}  ·  ${total} archivos desde ${localDir}${flag('clean') ? '  ·  CON limpieza previa' : ''}`);
if (flag('dry-run')) { console.log('--dry-run: no se conectó ni se subió nada.'); process.exit(0); }

// --- subir ---
const port = Number(env.FTP_PORT || (protocol === 'sftp' ? 22 : 21));

async function uploadSftp() {
  const sftp = new SftpClient();
  try {
    await sftp.connect({ host: env.FTP_HOST, port, username: env.FTP_USER, password: env.FTP_PASSWORD, readyTimeout: 30000 });
    if (!(await sftp.exists(remoteDir))) await sftp.mkdir(remoteDir, true);
    if (flag('clean')) {
      console.log('Limpiando carpeta remota…');
      for (const item of await sftp.list(remoteDir)) {
        const path = remoteDir === '/' ? `/${item.name}` : `${remoteDir}/${item.name}`;
        if (item.type === 'd') await sftp.rmdir(path, true); else await sftp.delete(path);
      }
    }
    sftp.on('upload', (info) => process.stdout.write(`
Subiendo… ${info.destination.slice(-50).padEnd(50)}`));
    await sftp.uploadDir(localDir, remoteDir);
  } finally {
    await sftp.end().catch(() => {});
  }
}

async function uploadFtp() {
  const client = new Client(60000);
  try {
    const secure = protocol === 'ftps';
    await client.access({ host: env.FTP_HOST, port, user: env.FTP_USER, password: env.FTP_PASSWORD, secure, secureOptions: { rejectUnauthorized: env.FTP_VERIFY_CERT !== 'false' } });
    if (!secure) console.warn('Aviso: FTP sin cifrar; la contraseña viaja en texto plano. Usa SFTP o FTPS.');
    await client.ensureDir(remoteDir);
    if (flag('clean')) { console.log('Limpiando carpeta remota…'); await client.clearWorkingDir(); }
    client.trackProgress((info) => { if (info.type === 'upload') process.stdout.write(`
Subiendo… ${info.bytesOverall} bytes`); });
    await client.uploadFromDir(localDir);
  } finally {
    client.close();
  }
}

try {
  await (protocol === 'sftp' ? uploadSftp() : uploadFtp());
  console.log(`\nListo: ${total} archivos subidos a ${remoteDir}.`);
} catch (error) {
  console.error('\nError de despliegue:', error.message);
  process.exitCode = 1;
}
