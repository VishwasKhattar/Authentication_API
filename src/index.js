const express = require('express');
const auth = require('./conn');
const app = express();
const jwt = require('jsonwebtoken');
const path = require('path');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcryptjs');


const PORT = 1234;

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const tempPath = path.join(__dirname, "../templates");
const publicPath = path.join(__dirname, "../public");

app.set('view engine', 'hbs');
app.set("views", tempPath);
app.set(express.static(publicPath));


async function hashPass(password) {

    const res = await bcrypt.hash(password, 10);
    return res;

}


async function compare(userPass, hashPass) {

    const res = await bcrypt.compare(userPass, hashPass);
    return res;

}


app.get('/', (req, res) => {
    if (req.cookies.jwt) {
        const check = jwt.verify(req.cookies.jwt, "hellowelcometoauthtutorialdevelopedbyvishwaskhattarasaminiproject")
        res.render("home", { name: check.name });
    }
    else {
        res.render("login");
    }
});

app.get('/login', (req, res) => {
    res.render("login");
});

app.get('/signup', (req, res) => {
    res.render("signup");
});

app.post('/signup', async (req, res) => {
    try {
        const verify = await auth.findOne({ name: req.body.name });

        if (verify) {
            res.send("User already exist");
        }
        else {
            const token = jwt.sign({ name: req.body.name }, "hellowelcometoauthtutorialdevelopedbyvishwaskhattarasaminiproject");

            res.cookie("jwt", token, {
                maxAge: 600000,
                httpOnly: true,
            })

            const data = {
                name: req.body.name,
                password: await hashPass(req.body.password),
                token: token,
            }

            await auth.insertMany([data]);

            res.render("home", { name: req.body.name });
        }
    } 
    catch {
        res.send("Error in signup");
    }
})

app.post('/login', async (req, res) => {
    try {
        const verify = await auth.findOne({ name: req.body.name });
        const passCheck = await compare(req.body.password, verify.password);


        if (verify && passCheck) {
            res.render("home", { name: req.body.name });
            res.cookie("jwt", verify.token, {
                maxAge: 600000,
                httpOnly: true,
            })


        }
        else {
            res.send("Wrong Details");
        }
    } catch (error) {
        res.send("Wrong Details");
    }
})

app.listen(PORT, () => {
    console.log("Server Started");
});