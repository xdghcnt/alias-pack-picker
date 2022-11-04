import express from "express";
import path from "path";

const app = express()
const port = 1337
const __dirname = path.dirname(new URL(import.meta.url).pathname);


app.get('/turik/alias', (req, res) => {
    res.sendFile(path.join(__dirname, '/../client/dist/index.html'));
});

app.use(express.static(path.join(__dirname, '/../client/dist')));

export function startServer() {
    app.listen(port, () => {
        console.log(`server started on ${port}`)
    });
}