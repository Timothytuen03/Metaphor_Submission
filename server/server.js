import 'dotenv/config';
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
// import OpenAI from "openai";
import axios from 'axios';
// import Metaphor from 'metaphor-node';
// const metaphor = new Metaphor(process.env.METAPHOR_API_KEY);

const app = express()
// const openai = new OpenAI()
const corsOptions = { origin: `http://localhost:3000`, credentials: true};
console.log(process.env.METAPHOR_API_KEY)
app.use(bodyParser.urlencoded({ extended: false}))
app.use(cors(corsOptions));
app.use(express.json());

let relatedVids;

app.post('/api/generate', async (req, res) => {
    console.log(req.body)
    const useProtein = req.body.noMeat;
    const meats = req.body.meat;
    const proteinPref = req.body.proteinPref;
    const calPref = req.body.caloriePref;
    const carbPref = req.body.carbPref;
    let USER_INPUT;
    let response;
    if(!useProtein) {
        if(meats.length == 1) {
            USER_INPUT = `Suggest a list of dishes that uses ${meats[0]}. Preferences: protein = ${proteinPref}, calories=${calPref}, carbohydrates=${carbPref}`
        } else {
            USER_INPUT = `Suggest a list of dishes that uses ${meats[0]} and ${meats[1]}. Preferences: protein = ${proteinPref}, calories=${calPref}, carbohydrates=${carbPref}`
        }
    } else {
        USER_INPUT = `Suggest a list of dishes that uses no meat. Preferences: protein = ${proteinPref}, calories=${calPref}, carbohydrates=${carbPref}`
    }

    await axios.post('https://api.metaphor.systems/search', {
        query: USER_INPUT,
        numResults: 5,
        useAutoprompt: true,
        type: "neural"
    }, {
        headers: {
            'x-api-key': process.env.METAPHOR_API_KEY,
            'Content-Type': 'application/json'
        }
    }).then(result => {
        response = result.data;
        console.log(result.data.results)
        res.send(result.data.results)
    }).catch(err => {
        console.log("error" + err)
        res.send(err);
    });

    // const SYSTEM_ROLE = 'You are a chef that has experience with cooking for athletes. Only generate one search query.'

    // const response = await openai.chat.completions.create({
    //     model: "gpt-3.5-turbo",
    //     messages: [{"role": "system", "content": SYSTEM_ROLE},
    //         {"role": "user", "content": USER_INPUT}]
    // });
    // search_response = metaphor.search(
    //     query, use_autoprompt=True, start_published_date="2023-06-01"
    // )

})

app.post("/api/videoGen", async (req, res) => {
    const title = req.body.title;
    const url = req.body.url;

    await axios.post('https://api.metaphor.systems/findSimilar', {
        url: url,
        numResults: 5,
        includeDomains: ["tiktok.com", "youtube.com"]
    }, {
        headers: {
            'x-api-key': process.env.METAPHOR_API_KEY,
            'Content-Type': 'application/json'
        }
    }).then(result => {
        relatedVids = result.data.results;
        console.log(result.data.results)
        res.send("success")
    }).catch(err => {
        console.log(err)
        res.send(err);
    })

})

app.get("/api/getRelVid", async (req, res) => {
    res.send(relatedVids);
})

app.listen(4000, (req, res) => {
    console.log("server started on port 4000")
})

// OpenAI Prompt: You are a chef that has experience with cooking for athletes. 
// Suggest a list of dishes that uses Chicken and has High Protein. 
// Only give the names of dishes