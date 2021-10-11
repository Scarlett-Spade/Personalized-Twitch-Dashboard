import React from 'react'
import styles from '../../styles/StreamerGrid.module.css'
import Image from 'next/image'

//The streamer data is held in React state, which lives in the main page state property.

//-------------------------------------------------------
//PROP ACTIONS -------------------------------------
//This displays streamers added to the dashboard.---------
const StreamerGrid = ({ channels, setChannels }) => {

  // Create a method for "removeChannelAction"
const removeChannelAction = channelId => async () => {
  console.log('Removing channel with ID: ', channelId)

  const filteredChannels = channels.filter(channel => channel.id !== channelId)

  setChannels(filteredChannels)

  const joinedChannels = filteredChannels.map(channel => channel.display_name.toLowerCase()).join(",")

  //This method will spin off a request to your database that has your new list of streamers. You'll also notice that you need to take all the channel display names and use the .join() method. This will take all the streamer names and create a string separated by commas. Remember, that's how your database expects to receive the data.
  await setDBChannels(joinedChannels)
}

//This updates the list of Twitch channels.
const setDBChannels = async channels => {
  try {
    const path = `https://${window.location.hostname}`

    const response = await fetch(`${path}/api/database`, {
      method: 'POST',
      body: JSON.stringify({
        key: 'CHANNELS',
        value: channels
      })
    })

    if (response.status ===200) {
      console.log(`Set ${channels} in DB.`)
    }
  } catch (error) {
    console.warn(error.message)
  }
}

const renderGridItem = channel => (
<div key={channel.id} className={styles.gridItem}>
   <button onClick={removeChannelAction(channel.id)}>X</button>
   <Image layout className="img" layout="fill" src={channel.thumbnail_url}/>
   <div className={styles.gridItemContent}>
      <p>{channel.display_name}</p>
      {channel.is_live && <p> <span role="img" aria-label="Green Circle">🟢</span> Live Now!</p>}
      {!channel.is_live && <p> <span role="img" aria-label="Black Circle">⚫</span> Offline</p>}
    </div>
  </div>  
)

//Define "setChannels" using useState hook. This will update the state in the home page so this component can re-render once the data changes by passing the React State update method to this component.
const Deleted = (setChannels) =>  {
   const [favoriteChannels , setFavoriteChannels] = useState(setChannels)

   useEffect(() => {
       setFavoriteChannels(channels);
   }, [channels])

   return (
            <button onClick={removeChannelAction(channel.id)}>X</button>
        )

}

const renderNoItems = () => (
  <div className={styles.gridNoItems}>
    <span><img src="https://media.giphy.com/media/Yf7kN6Xdle87K/giphy.gif" alt="John Travolta" height="100" />
    
    <img src="https://media.giphy.com/media/Yf7kN6Xdle87K/giphy.gif" alt="John Travolta" height="100" />

    <img src="https://media.giphy.com/media/Yf7kN6Xdle87K/giphy.gif" alt="John Travolta" height="100" />
    </span>

    <img src="https://media.giphy.com/media/Yf7kN6Xdle87K/giphy.gif" alt="John Travolta" height="100" />

    <img src="https://media.giphy.com/media/Yf7kN6Xdle87K/giphy.gif" alt="John Travolta" height="100" />

    <img src="https://media.giphy.com/media/Yf7kN6Xdle87K/giphy.gif" alt="John Travolta" height="100" />
  </div>
)

  return(
    <div className="StreamerGrid">
      {channels.length > 0  && channels.map(renderGridItem)}
      {channels.length === 0 && renderNoItems()}
    </div>
  )
}



export default StreamerGrid