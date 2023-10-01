'use client'
import React, {useState} from 'react'
import axios from 'axios';

function videos() {
    // console.log(data)

    const [videos, setVideos] = useState(null);

    function genVids() {
      axios.get('http://localhost:4000/api/getRelVid').then(res => {
        console.log(res);
        setVideos(res)
      }).catch(err => {
        console.log(err)
      })

    }
    

  return (
    <div>
      
      {/* {videos !== null ? 
    videos.data.map(vid => {
      <div>
        <a href={vid.url}>{vid.title}</a>
        <p>hello</p>
      </div>
    }) : <p>sorry, no results</p>} */}
    
    
    {videos !== null ? videos.data.map(rec => 
          <div>
            <a href={rec.url}>{rec.title}</a>
          </div>
        ) : <div>
          <button onClick={() => genVids()}>Generate videos</button>
          </div>}
    </div>
  )
}

// export async function getStaticProps() {
//   const res = await fetch('http://localhost:4000/api/getRelVid')
//   const data = await res.json()
//   return { props: { data } }
// }

export default videos