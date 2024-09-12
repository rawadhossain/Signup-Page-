import express from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = "hithere1234";

const user = [];

const app = express();
app.use(express.json());

//connect frontend to Backend
// app.get("/", (req, res) => {
//     res.sendFile(__dirname + "/public/index.html");
// });

app.use(express.static("./public"));

app.post("/signup", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    user.push({
        username: username,
        password: password,
    });

    res.json({
        message: "User created successfully",
    });
});

app.post("/signin", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = user.find(
        (user) => user.username === username && user.password === password
    );

    if (user) {
        //generate a token by encoding the data(object) into the jwt
        const token = jwt.sign({ username: user.username }, JWT_SECRET);

        res.header("jwt", token);

        res.json({
            token: token,
        });
    } else {
        res.status(403).send({
            message: "Invalid username or password",
        });
    }
});

//custom middleware for authentication
function auth(req, res, next) {
    const token = req.headers.authorization;

    if (token) {
        jwt.verify(token, JWT_SECRET, (err, decoded) => {
            if (err) {
                res.status(401).send({
                    message: "Unauthorized",
                });
            } else {
                req.user = decoded;
                next();
            }
        });
    } else {
        res.status(401).send({
            message: "Unauthorized",
        });
    }
}

app.get("/me", auth, (req, res) => {
    const user = req.user;

    res.send({
        username: user.username,
        password: user.password,
    });
});

app.listen(5000);
