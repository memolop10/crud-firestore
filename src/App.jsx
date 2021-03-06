import React from 'react'
import {firebase} from './firebase'

function App() {

  const [tareas, setTareas] = React.useState([])
  const [tarea, setTarea] = React.useState('')
  const [modoEdicion, setModoEdicion] = React.useState(false)
  const [id, setId] = React.useState ('')
  const [error, setError] =React.useState('')

  React.useEffect(() => {

    const getData = async() => {
      try {
        const db = firebase.firestore();
        const data = await db.collection('tareas').get()
        
        const arrayData = data.docs.map( (doc) => ({
          id:doc.id,
          ...doc.data()
        }))
        setTareas(arrayData);
        console.log(arrayData)


      } catch (error) {
        console.log(error)
      }
    }

    getData();
  },[])

  const agregar = async(e) => {
    e.preventDefault();

    if(!tarea.trim()){
      console.log('esta vacio')
      setError('Escriba algo por favor')
      return
    }

    try {
      const db = firebase.firestore()
      const nuevaTarea = {
        name: tarea,
        fecha: Date.now()
      }

      const data = await db.collection('tareas').add(nuevaTarea);
      setTareas([
        ...tareas,
        {...nuevaTarea,id:data.id}
      ])
      setTarea('')
    } catch (error) {
      console.log(error)
    }

    console.log(tarea)
    setError('')
  }

  const eliminar = async(id) => {
    try {
      const db = firebase.firestore()
      await db.collection('tareas').doc(id).delete()

      const arrayFiltrado = tareas.filter(item => item.id !== id)
      setTareas(arrayFiltrado)
    } catch (error) {
      console.log(error)
    }
  }

  const activarEdicion = item => {
    setModoEdicion(true)
    setTarea(item.name)
    setId(item.id)
  }

  const editar = async(e) => {
      e.preventDefault();
      if (!tarea.trim()) {
        console.log('vacio')
        setError('Escriba algo por favor')
        return
      }
      try {
        const db = firebase.firestore()
        await db.collection('tareas').doc(id).update({
          name:tarea
        })

        const arrayEditado = tareas.map( item => (
          item.id === id ? {id: item.id, fecha: item.fecha, name: tarea} : item
        ))
         setTareas(arrayEditado)
         setModoEdicion(false)
         setTarea('')
         setId('')
         setError('')

      } catch (error) {
        console.log(error);
      }
  }

  return (
    <div className="container">
     <div className="row mt-5">
       <div className="col-md-6">
        <h3>Mis Tareas</h3>
          <ul className="list-group">
            {
              tareas.map(item => (
                <li className="list-group-item mt-2" key={item.id}>
                    {item.name}

                    <button 
                      className="btn btn-danger btn-sm float-right"
                      onClick={ () => eliminar(item.id)}>
                      Eliminar
                    </button>
                    <button className="btn btn-warning btn-sm float-right mr-2"
                      onClick={ () => activarEdicion(item)}>
                      Editar
                    </button>
                </li>
              ))
            }
          </ul>
       </div>
       <div className="col-md-6">
          <h3>
            {
              modoEdicion ? 'Editar' : 'Agregar'
            }
          </h3>
          <form onSubmit={modoEdicion ? editar : agregar}>
             {             
               error ? <span className="text-danger">{error}</span> : ''
             } 
            <input 
              type="text"
              className="form-control mb-2"
              placeholder="Ingrese Tarea"
              onChange={ e => setTarea(e.target.value)}
              value={tarea}/>

              <button 
                className={
                  modoEdicion ? "btn btn-warning btn-block" : "btn btn-dark btn-block"
                } 
                type="submit">
                {
                  modoEdicion ? 'Editar' : 'Agregar'
                }
              </button>
          </form>
       </div>
     </div>
    </div>
  );
}

export default App;
