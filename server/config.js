require("dotenv").config();
const nodemailer = require("nodemailer")
const multer = require('multer')
const validator = require('express-validator')

module.exports = () => {

    const upload = multer({storage: multer.memoryStorage()})

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
    /*
    transporter.verify(function (error) {
        if (error) {
            console.log(error);
        } else {
            console.log("SMTP Server setup was successful.");
        }
    });
     */

    const dbOptions = {
        "host": process.env.PGHOST,
        "port": process.env.PGPORT,
        "user": process.env.PGUSER,
        "password": process.env.PGPASSWORD,
        "connectionLimit": 5,
        "database": process.env.PGDATABASE,
        "dbms": "postgres"
    }

    const jsonObj = {
        "roles": ["admin", "recruiter", "jobOwner", "guest", "teamLeader", "Colaborator"],
        "permissions": [
            {"resource": "auth", "action": "GET"},
            {"resource": "auth", "action": "POST"},

            {"resource": "requests", "action": "GET"},
            {"resource": "requests", "action": "POST"},
            {"resource": "requests", "action": "PUT"},
            {"resource": "requests", "action": "PATCH"},
            {"resource": "requests", "action": "DELETE"},

            {"resource": "workflows", "action": "GET"},
            {"resource": "phases", "action": "GET"},
            {"resource": "requests-properties", "action": "GET"},
            {"resource": "users", "action": "GET"},
            {"resource": "roles", "action": "GET"},
            {"resource": "process", "action": "GET"},

            {"resource": "candidates", "action": "GET"},
            {"resource": "candidates", "action": "POST"},
            {"resource": "candidates", "action": "PATCH"},
            {"resource": "candidates", "action": "DELETE"},

            {"resource": "statistics", "action": "GET"},
            {"resource": "statistics", "action": "POST"},

        ],
        "grants": {
            "guest": [
                // login
                {"resource": "auth", "action": "GET"},
            ],
            "recruiter": [
                {"resource": "auth", "action": "GET"},
                {"resource": "auth", "action": "POST"},

                {"resource": "requests", "action": "GET"},
                {"resource": "requests", "action": "PUT"},
                {"resource": "requests", "action": "PATCH"},
                {"resource": "requests", "action": "DELETE"},

                {"resource": "workflows", "action": "GET"},
                {"resource": "phases", "action": "GET"},
                {"resource": "requests-properties", "action": "GET"},
                {"resource": "users", "action": "GET"},
                {"resource": "roles", "action": "GET"},
                {"resource": "process", "action": "GET"},

                {"resource": "candidates", "action": "GET"},
                {"resource": "candidates", "action": "POST"},
                {"resource": "candidates", "action": "PATCH"},
                {"resource": "candidates", "action": "DELETE"},

                {"resource": "statistics", "action": "GET"},
                {"resource": "statistics", "action": "POST"},
            ],
            "jobOwner": [
                {"resource": "auth", "action": "GET"},
                {"resource": "auth", "action": "POST"},

                {"resource": "requests", "action": "GET"},
                {"resource": "requests", "action": "POST"},
                {"resource": "requests", "action": "PUT"},
                {"resource": "requests", "action": "PATCH"},
                {"resource": "requests", "action": "DELETE"},

                {"resource": "workflows", "action": "GET"},
                {"resource": "phases", "action": "GET"},
                {"resource": "requests-properties", "action": "GET"},
                {"resource": "users", "action": "GET"},
                {"resource": "roles", "action": "GET"},
                {"resource": "process", "action": "GET"},

                {"resource": "candidates", "action": "GET"},
                {"resource": "candidates", "action": "PATCH"},
                {"resource": "candidates", "action": "DELETE"},

                {"resource": "statistics", "action": "GET"},
                {"resource": "statistics", "action": "POST"},
            ],
            "admin": [
                {"resource": "auth", "action": "GET"},
                {"resource": "auth", "action": "POST"},

                {"resource": "requests", "action": "GET"},
                {"resource": "requests", "action": "POST"},
                {"resource": "requests", "action": "PUT"},
                {"resource": "requests", "action": "PATCH"},
                {"resource": "requests", "action": "DELETE"},

                {"resource": "workflows", "action": "GET"},
                {"resource": "phases", "action": "GET"},
                {"resource": "requests-properties", "action": "GET"},
                {"resource": "users", "action": "GET"},
                {"resource": "roles", "action": "GET"},
                {"resource": "process", "action": "GET"},

                {"resource": "candidates", "action": "GET"},
                {"resource": "candidates", "action": "POST"},
                {"resource": "candidates", "action": "PATCH"},
                {"resource": "candidates", "action": "DELETE"},

                {"resource": "statistics", "action": "GET"},
                {"resource": "statistics", "action": "POST"},
            ],
            "teamLeader": [
                {"role": "recruiter"}
            ],
            "Colaborator": [
                {"resource": "auth", "action": "GET"},
                {"resource": "auth", "action": "POST"},

                {"resource": "requests", "action": "GET"},

                {"resource": "workflows", "action": "GET"},
                {"resource": "phases", "action": "GET"},
                {"resource": "requests-properties", "action": "GET"},
                {"resource": "users", "action": "GET"},
                {"resource": "roles", "action": "GET"},
                {"resource": "process", "action": "GET"},

                {"resource": "candidates", "action": "GET"},

                {"resource": "statistics", "action": "GET"},
                {"resource": "statistics", "action": "POST"},
            ]
        }
    }
    return {transporter, dbOptions, jsonObj, upload, validator}
}
