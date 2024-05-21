// import express from "express";
// import { nanoid } from "nanoid";

const express = require("express");
const uniqid = require('generate-unique-id');
const fs = require("fs");
// const { log } = require("console");

const app = express();

app.use(express.json())
// app.use(express.urlencoded({extended: true}))


app.post('/short-url', (req, res) => {
    
    console.log("post request body =====>>>>>>>>>>>>>>", req.body); 
    
    if(Object.keys(req.body).length === 0){
        return res.json({
            message: "data nhi hai"
        })
    }
    
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
        "data": `https://url-shortner-cluz.onrender.com/api/${shorturl}`,
    })
})


app.get("/api/:shorturl", (req, res) => {
    
    const file = fs.readFileSync("urlmap.json", { encoding: "utf-8" });
    const filejson = JSON.parse(file);
    const surl = req.params.shorturl;
    const longurl = filejson[surl];
    console.log(longurl);
    res.redirect(longurl);

})

app.get("/", (req, res)=>{
    res.sendFile(__dirname +'/form.html')
})

app.listen(8000, () => {
    console.log("server up and running");
})