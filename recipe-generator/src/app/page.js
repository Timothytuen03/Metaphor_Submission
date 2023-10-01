"use client"
import React, { useState } from "react"
import axios from "axios";
import {useRouter} from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();
  const [meatDiet, setDiet] = useState(false);
  const [secondMeat, setSecondMeat] = useState(false);
  const [meats, setMeat] = useState([]);
  const [proteinPref, setProteinPref] = useState("none")
  const [calPref, setCalPref] = useState("none")
  const [carbPref, setCarbPref] = useState("none")
  const [flavor, setFlavor] = useState("")
  const [availIngredients, setAvailIngredients] = useState([])
  const [responses, setResponses] = useState(null)

  function setSecondMeatValue(e) {
    setSecondMeat(!secondMeat)
    e.preventDefault()
  }

  function setFirstMeat(e) {
    let newArr = [...meats]
    newArr[0] = e
    setMeat(newArr)
  }

  function setSecondMeatType(e) {
    let newArr = [...meats]
    newArr[1] = e
    setMeat(newArr)
  }

  const retriveRecipes = () => {
    console.log("retrieve!")
    axios.post('http://localhost:4000/api/generate', {
      noMeat: !meatDiet,
      meat: meats,
      proteinPref: proteinPref,
      caloriePref: calPref,
      carbPref: carbPref
    }).then(res => {
      console.log("result:")
      console.log(res)
      setResponses(res);
    }).catch(err => {
      console.log("failed request");
      console.log(err);
    })
  }

  function relatedVideos(title, url) {
    axios.post('http://localhost:4000/api/videoGen', {
      title: title,
      url: url
    }).then(res => {
      console.log(res)
      router.push('/videos');
      
    }).catch(err => {
      console.log(err)
    })
  }


  return (
    <div className="flex flex-col items-center justify-center mt-[60px]">
      <div className="flex flex-col">
        <div className="flex">
          <label htmlFor="meatDiet">Do you want meat in the dish?</label>
          <input type="checkbox" name="meatDiet" onChange={() => setDiet(!meatDiet)}/>

        </div>
        <div className={meatDiet ? "flex flex-col" : "hidden"}>
          <input type="text" name="meatType" className="border-2 border-solid" onChange={(e) => setFirstMeat(e.target.value)} value={meats[0]}/>
          <button className={secondMeat ? "hidden" : ""} onClick={(e) => setSecondMeatValue(e)} value={meats[1]}>Add 2nd Meat Type</button>
          <label className={secondMeat ? "" : "hidden"} htmlFor="secondMeatType">Second Meat Type</label>
          <input className={secondMeat ? "border-2 border-solid" : "hidden"} type="text" name="secondMeatType" onChange={(e) => setSecondMeatType(e.target.value)}/>
        </div>

        <div className="flex flex-col">
          <p>Choose your preferences</p>
          <div className="flex">
            <label htmlFor="protein" className="mr-5">Protein Amount (High/Low)</label>
            <input type="radio" name="protein" value="high" onChange={() => setProteinPref('high')}/>
            <input type="radio" name="protein" value="none" onChange={() => setProteinPref('none')}/>
            <input type="radio" name="protein" value="low" onChange={() => setProteinPref('low')}/>
          </div>
          <div className="flex">
            <label htmlFor="protein" className="mr-5">Calories Amount (High/Low)</label>
            <input type="radio" name="calorie" value="high" onChange={() => setCalPref('high')}/>
            <input type="radio" name="calorie" value="none" onChange={() => setCalPref('none')}/>
            <input type="radio" name="calorie" value="low" onChange={() => setCalPref('low')}/>
          </div>
          <div className="flex">
            <label htmlFor="protein" className="mr-5">Carbohydrate Amount (High/Low)</label>
            <input type="radio" name="carbs" value="high" onChange={() => setCarbPref('high')}/>
            <input type="radio" name="carbs" value="none" onChange={() => setCarbPref('none')}/>
            <input type="radio" name="carbs" value="low" onChange={() => setCarbPref('low')}/>
          </div>
        </div>
        {/* <label htmlFor="flavor">Flavor (Leave blank if you have no preference)</label> */}
        {/* <input type="text" name="flavor" value={flavor} onChange={(e) => setFlavor(e.target.value)}/> */}
        <button onClick={() => retriveRecipes()} className="border-solid border-2 w-[200px] mb-[120px]">Get Recommendations!</button>
      </div>
      <div>
        {responses !== null ? responses.data.map(rec => 
          <div>
            <a href={rec.url}>{rec.title}</a>
            <button onClick={() => relatedVideos(rec.title, rec.url)} className="ml-5 border-solid border-2"> Get Related Videos </button>
          </div>
        ) : <div></div>}
      </div>
    </div>
  )
}

// Meat or no Meat
// What kind of meat
// Any preference?
  // High/Low Protein?
  // High/Low carbs?
  // High/Low Calories?
// Allergies?
  // Input as a list
// Flavors

// Use API to find tiktok videos related to those recipes!

