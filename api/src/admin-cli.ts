// Panel hesapları (sunucuda, konteynerin içinde çalıştırılır; şifre ekrana yazılmaz):
//   docker exec -it wordvoya-api node src/admin-cli.ts add <kullanıcı> admin|viewer
//   docker exec -it wordvoya-api node src/admin-cli.ts passwd <kullanıcı>
//   docker exec -it wordvoya-api node src/admin-cli.ts role <kullanıcı> admin|viewer
//   docker exec -it wordvoya-api node src/admin-cli.ts remove <kullanıcı>
//   docker exec -it wordvoya-api node src/admin-cli.ts list
import { Store } from './db.ts'
import { AdminStore, PASSWORD_MIN, ROLES, type Role, USERNAME_PATTERN } from './admin.ts'

const [command, username = '', roleArg = ''] = process.argv.slice(2)

function fail(message: string): never {
  console.error(message)
  process.exit(1)
}

/** Şifreyi yankısız okur (TTY yoksa satır olarak). */
function readSecret(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    const stdin = process.stdin
    process.stdout.write(prompt)
    if (!stdin.isTTY) {
      let data = ''
      stdin.setEncoding('utf8')
      stdin.on('data', (c) => { data += c })
      stdin.on('end', () => resolve(data.split(/\r?\n/)[0]))
      return
    }
    let value = ''
    stdin.setRawMode(true)
    stdin.setEncoding('utf8')
    stdin.resume()
    const onData = (chunk: string) => {
      for (const ch of chunk) {
        if (ch === '\r' || ch === '\n') {
          stdin.setRawMode(false)
          stdin.pause()
          stdin.off('data', onData)
          process.stdout.write('\n')
          return resolve(value)
        }
        if (ch === '\u0003') { process.stdout.write('\n'); process.exit(130) }   // Ctrl+C
        if (ch === '\u007f' || ch === '\b') value = value.slice(0, -1)
        else if (ch >= ' ') value += ch
      }
    }
    stdin.on('data', onData)
  })
}

async function newPassword(): Promise<string> {
  const first = await readSecret(`Şifre (en az ${PASSWORD_MIN} karakter): `)
  if (first.length < PASSWORD_MIN) fail(`Şifre en az ${PASSWORD_MIN} karakter olmalı.`)
  if (process.stdin.isTTY) {
    const again = await readSecret('Şifre (tekrar): ')
    if (again !== first) fail('Şifreler aynı değil.')
  }
  return first
}

const parseRole = (r: string): Role => (ROLES as readonly string[]).includes(r) ? r as Role : fail('Rol admin ya da viewer olmalı.')
const checkUser = () => { if (!USERNAME_PATTERN.test(username)) fail('Kullanıcı adı 3-32 karakter: küçük harf, rakam, . _ -') }

const store = new Store(process.env.DB_PATH ?? '/data/wordvoya.db')
const admins = new AdminStore(store)
try {
  switch (command) {
    case 'add': {
      checkUser()
      const role = parseRole(roleArg)
      if (admins.listAdmins().some((a) => a.username === username)) fail('Bu kullanıcı zaten var (şifre için: passwd).')
      await admins.addAdmin(username, await newPassword(), role)
      console.log(`Hesap açıldı: ${username} (${role})`)
      break
    }
    case 'passwd': {
      checkUser()
      if (!admins.listAdmins().some((a) => a.username === username)) fail('Böyle bir kullanıcı yok.')
      await admins.setPassword(username, await newPassword())
      console.log('Şifre değişti; açık oturumlar kapandı.')
      break
    }
    case 'role':
      if (!admins.setRole(username, parseRole(roleArg))) fail('Böyle bir kullanıcı yok.')
      console.log(`Rol: ${username} → ${roleArg}`)
      break
    case 'remove':
      if (!admins.removeAdmin(username)) fail('Böyle bir kullanıcı yok.')
      console.log(`Silindi: ${username}`)
      break
    case 'list':
      for (const a of admins.listAdmins()) console.log(`${a.username}\t${a.role}\t${new Date(a.created_at).toISOString().slice(0, 10)}`)
      break
    default:
      fail('Kullanım: admin-cli.ts add <kullanıcı> admin|viewer | passwd <kullanıcı> | role <kullanıcı> admin|viewer | remove <kullanıcı> | list')
  }
} finally {
  store.close()
}
