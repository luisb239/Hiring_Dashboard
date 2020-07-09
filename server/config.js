require("dotenv").config();

module.exports = (app) => {

    const fileUpload = require('express-fileupload')

    const nodemailer = require("nodemailer")

    const bodyParser = require('body-parser')

    app.use(fileUpload({createParentPath: true}));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}))

    const transporter = nodemailer.createTransport(
        {
            pool: true,
            host: process.env.NODEMAILER_HOST,
            port: process.env.NODEMAILER_PORT,
            secure: false,
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
        "roles": ["admin", "recruiter", "jobOwner", "guest"],
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

            {"resource": "process", "action": "GET"}

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
            ],
            "recruiter": [
                {"role": "guest"}
            ],
            "jobOwner": [
                {"role": "guest"}
            ],
            "admin": [
                {"role": "guest"}
            ]
        }
    }
    return {app, transporter, dbOptions, jsonObj}
}
