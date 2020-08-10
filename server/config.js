require("dotenv").config();
const nodemailer = require("nodemailer")
const multer = require('multer')
const validator = require('express-validator')
const bodyParser = require('body-parser')

module.exports = (app) => {

    const upload = multer({storage: multer.memoryStorage()})

    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json());

    const transporter = nodemailer.createTransport(
        {
            pool: true,
            host: process.env.NODEMAILER_HOST,
            port: process.env.NODEMAILER_PORT,
            secure: true,
            auth: {
                user: process.env.NODEMAILER_AUTH_USER,
                pass: process.env.NODEMAILER_AUTH_PASSWORD
            },
            tls: {
                rejectUnauthorized: false
            }
        }
    )
    transporter.verify(function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log("SMTP Server setup was successful.");
        }
    });

    // let message = {
    //     from: 'hiring.dashboard.isel@gmail.com', // listed in rfc822 message header
    //     to: 'A43520@alunos.isel.pt', // listed in rfc822 message header
    //     subject: "Message title",
    //     text: "Plaintext version of the message",
    //     html: "<p>HTML version of the message</p>"
    // }
    //
    // transporter.sendMail(message, (err) => {
    //     console.log("MESSAGE NOT SENT: " + err)
    // })

    const dbOptions = {
        "host": process.env.PGHOST,
        "port": process.env.PGPORT,
        "user": process.env.PGUSER,
        "password": process.env.PGPASSWORD,
        "connectionLimit": 5,
        "database": process.env.PGDATABASE,
        "sgbd": "postgres"
    }

    const jsonObj = {
        "roles": ["admin", "recruiter", "jobOwner", "guest", "teamLeader"],
        // id order not guaranteed
        "permissions": [
            {"resource": "auth", "action": "GET"},
            {"resource": "auth", "action": "POST"},

            {"resource": "requests", "action": "GET"},
            {"resource": "requests", "action": "POST"},
            {"resource": "requests", "action": "PUT"},

            {"resource": "workflows", "action": "GET"},

            {"resource": "phases", "action": "GET"},

            {"resource": "requests-properties", "action": "GET"},

            {"resource": "candidates", "action": "GET"},
            {"resource": "candidates", "action": "POST"},
            {"resource": "candidates", "action": "PUT"},

            {"resource": "process", "action": "GET"},

            {"resource": "statistics", "action": "GET"},

            {"resource": "users", "action": "GET"},
            {"resource": "users", "action": "POST"},

            {"resource": "roles", "action": "GET"},
        ],
        "grants": {
            //TODO -> guest permissions
            "guest": [
                {"resource": "auth", "action": "GET"},
                {"resource": "auth", "action": "POST"},

                {"resource": "requests", "action": "GET"},
                {"resource": "requests", "action": "POST"},
                {"resource": "requests", "action": "PUT"},

                {"resource": "workflows", "action": "GET"},
                {"resource": "phases", "action": "GET"},
                {"resource": "requests-properties", "action": "GET"},
                {"resource": "candidates", "action": "GET"},
                {"resource": "candidates", "action": "POST"},
                {"resource": "candidates", "action": "PUT"},
                {"resource": "process", "action": "GET"},
                {"resource": "statistics", "action": "GET"},
                {"resource": "users", "action": "GET"},
                {"resource": "users", "action": "POST"},
                {"resource": "roles", "action": "GET"},
            ],
            "recruiter": [
                {"role": "teamLeader"}
            ],
            "jobOwner": [
                {"role": "guest"}
            ],
            "admin": [
                {"role": "guest"}
            ],
            "teamLeader": [
                {"role": "guest"}
            ]
        }
    }
    return {app, transporter, dbOptions, jsonObj, upload, validator}
}
