import Koa from "koa"

const app = new Koa()
const PORT = process.env.PORT || 8000

app.use(async ctx => {
    ctx.body = 'Hello World';
});

app.listen(PORT);
console.log(`server listening on http://localhost:${PORT}`)