// Main entry point of your app
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import React, { useEffect, useState } from "react"
import StreamerGrid from '../components/StreamerGrid'

const Home = () => {

//----------------------------------------------------------
//STATE
//This is a React State to save new stream channels.
const [favoriteChannels, setFavoriteChannels] = useState([])
  
  //Pass the onClick function to the component where I have "setChannels" defined.
  const onClick = () => {
    setFavoriteChannels ([...favoriteChannels, {removeChannelAction}]);
  
    return ( <div> {Deleted} </div>
      
  )

};
//-------------------------------------------------------
//PROP ACTIONS: Tells functions which method to call.

//This will get the channels from the API---------
const fetchChannels = async () => {
  try {
    const path = `https://${window.location.hostname}`

    //This will get the keys from the database ----------
    const response = await fetch(`${path}/api/database`, {
      method: 'POST',
      body: JSON.stringify({
        action: 'ADD_CHANNELS',
        key: 'CHANNELS'
      })
    })

    if (response.status === 404) {
      console.log('Channels key could not be found.')
    }

    // If you don't receive a 404 that means some data came back from your API.
    const json = await response.json()

    //Data comes back in a comma separated string like this: "buildspace,shroud,pixelogicdev". You are going to want to put that into an array so you can loop through each item and fetch the latest Twitch data
    if (json.data) {
      const channelNames = json.data.split(',')
      console.log('CHANNEL NAMES: ', channelNames)

      //This gets Twitch data and set in channels state
      const channelData = []

      //This is a for-loop that means: "Go through every channelName in this array and don't move onto the next one until everything in this iteration is complete".
      for await (const channelName of channelNames) {
        console.log("Getting Twitch Data For: ", channelName)

        //Setup your Twitch API endpoint request to go and grab the latest data from Twitch
        const channelResp = await fetch(`${path}/api/twitch`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ data: channelName })
        })

        // Get that channelData and add it to an array. Finally, take that array full of streamer data and set your React State
        const json = await channelResp.json()

        if (json.data) {
          channelData.push(json.data)
          console.log(channelData)
        }
      }

      setFavoriteChannels(channelData)
    }
  } catch (error) {
    console.warn(error.message)
  }
}

//This adds new streamer channels.-----------------------
const addStreamerChannel = async event => {
  //Prevents the page from redirecting.
  event.preventDefault()

  const { value } = event.target.elements.input

  //This prints out the data from streaming channels.
  if (value) {
    console.log('value: ', value)

    //This searches the Twitch api.------------
    const path = `https://${window.location.hostname}`

    const response = await fetch(`${path}/api/twitch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ data: value })
    })

    const json = await response.json()

    console.log("From the server: ", json.data)
    //-------------------------------------------------


  setFavoriteChannels(prevState => [...prevState, json.data])

//Saves the channelName string to the Replit database.
  await setChannel(value)
  
  event.target.elements.input.value =""
  }
}

const setChannel = async channelName => {
  try {
    const currentStreamers = favoriteChannels.map(channel => channel.display_name.toLowerCase())

    const streamerList = [...currentStreamers, channelName].join(",")

    const path = `https://${window.location.hostname}`

    const response = await fetch (`${path}/api/database`, {
      method: 'POST',
      body: JSON.stringify({
        key: 'CHANNELS',
        value: streamerList
      })
    })

    if (response.status === 200) {
      console.log(`Set ${channelName} in DB.`)
    }
  } catch (error) {
    console.warn(error.message)
  }
}

//useEffect ------------------------------------------
// When you pass an empty array as the second parameter of useEffect, that means it will only be ran on the first render of this component - ie: when the app loads! Nice. So at this point you can fetch all the data from your database and display it in your dashboard!
useEffect(() => {
  console.log("LOADING CHANNELS")
  fetchChannels()
}, [])

//----------------------------------------------------------
//RENDER METHODS: Completes the task of prop actions
//This is the input form.-----------------------------------
const renderForm = () => (
  <div className={styles.formContainer}>
    <form onSubmit={addStreamerChannel}>
      <input id="input" placeholder=""    type="text" required />
      <button type="submit" className="add">ADD CHANNEL</button>
    </form>
  </div>
)


  return (
    <div className={styles.container}>
      <Head>
        <title>🎥 TWITCH DASHBOARD</title>
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <div className={styles.inputContainer}>
        {renderForm()}
        <h1>SPADE'S TWITCH DASHBOARD:</h1>
        <StreamerGrid className="StreamerGrid" channels={favoriteChannels} setChannels={setFavoriteChannels} />
      </div>
    </div>
  )
  
}

export default Home 