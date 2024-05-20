// import express from "express";
// import { nanoid } from "nanoid";

const express = require("express");
const uniqid = require('generate-unique-id');
const fs = require("fs");
// const { log } = require("console");

const app = express();

// app.use(express.json())
app.use(express.urlencoded())

app.get("/", (req, res)=>{
    res.sendFile(__dirname +'/form.html')
})

app.post('/short-url', (req, res) => {

    console.log(req.body);

    const shorturl = uniqid({
        length: 8,
        useLetters: true,
        useNumbers: true
    })

    try {

        const data = fs.readFileSync('urlmap.json', { encoding: "utf-8" });
        // console.log("test", data.length);
        let urldata

        if (data == '') {
            urldata = {}
        } else {
            urldata = JSON.parse(data);
        }

        urldata[shorturl] = req.body.url

        fs.writeFileSync("urlmap.json", JSON.stringify(urldata));

    } catch (error) {
        console.log(error);
    }

    res.json({
        "status": true,
        "message": "Url Shortner Application",
        "data": `http://localhost:8000/${shorturl}`,
    })
})


app.get("/:shorturl", (req, res) => {

    const file = fs.readFileSync("urlmap.json", { encoding: "utf-8" });
    const filejson = JSON.parse(file);
    const surl = req.params.shorturl;
    const longurl = filejson[surl];
    console.log(longurl);
    res.redirect(longurl);

})

app.listen(8000, () => {
    console.log("server up and running");
})