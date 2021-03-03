import React from 'react'
import {firebase} from './firebase'

function App() {

  React.useEffect(() => {

    const getData = async() => {
      try {
        const db = firebase.firestore();
        const data = await db.collection('tareas').get()
        console.log(data.docs)
      } catch (error) {
        console.log(error)
      }
    }

    getData();
  })

  return (
    <div className="container">
     Soy el MEMO
    </div>
  );
}

export default App;
