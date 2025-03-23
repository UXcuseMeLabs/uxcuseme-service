import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import path from 'path'
import { fileURLToPath } from 'url';
import { readdirSync } from 'fs'
import dotenv from 'dotenv';
dotenv.config(); // Carga las variables de entorno del archivo .env

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = new Hono()



// Ruta base de los servicios
const servicesPath = path.join(__dirname, 'services');
console.log(process.env.ORIGIN)
app.use(cors({
  origin: [process.env.ORIGIN!,'https://id.twitch.tv'],
  credentials: true,
  allowMethods: ['POST', 'GET', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
  
}))
app.use(logger())
app.use(prettyJSON())


// Leer recursivamente la carpeta de servicios
const loadRoutes = async (dir: string) => {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      await loadRoutes(fullPath);
    } else if (entry.isFile() && entry.name.endsWith('.routes.ts')) {
      try {
        const routeModule = await import(fullPath);
        const routeName = path.basename(entry.name, '.routes.ts');
        
        app.route(`/${routeName}`, routeModule.default);
        console.log(`✅ Loaded route: /${routeName}`);
      } catch (err) {
        console.error(`❌ Error loading route ${fullPath}:`, err);
      }
    }
  }
};

// Cargar todas las rutas dinámicamente
await loadRoutes(servicesPath);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

serve({
  fetch: app.fetch,
  port: Number(process.env.PORT) || 4000,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`)
})
