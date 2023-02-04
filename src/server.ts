import Koa from "koa"
import router from "./router";

const app = new Koa()
const PORT = process.env.PORT || 8000

app
    .use(router.routes())
    .use(router.allowedMethods())
    .listen(PORT)

console.log(`server listening on http://localhost:${PORT}`)