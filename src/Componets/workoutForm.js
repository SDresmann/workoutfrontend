import { useState } from "react"
import { useWorkoutContext } from '../hooks/useWorkoutContext'
import { useAuthContext } from "../hooks/useAuthContext"

const WorkoutForm = () => {
    const {dispatch} = useWorkoutContext()
    const {user} = useAuthContext()


    const [title,setTitle] = useState('')
    const [reps,setReps] = useState('')
    const [load,setLoad] = useState('')
    const [error,setError] = useState(null)
    const [emptyFields, setEmptyFields] = useState([])

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(!user){
            setError('You must be logged in')
            return
        }

        const workout = {title, load, reps}

        const response = await fetch('https://workoutbackend-api.onrender.com/api/workouts', {
            method: 'POST',
            body: JSON.stringify(workout),
            headers:{
                'Content-Type':'application/json',
                'Authorization': `Bearer ${user.token}`
            }
        })
        const json = await response.json()
        if(!response.ok){
            setError(json.error)
            setEmptyFields(json.emptyFields)
        }
        if(response.ok){
            setTitle('') 
            setLoad('') 
            setReps('') 
            setError(null)
            setEmptyFields([])
            dispatch({type: 'CREATE_WORKOUT', payload: json});
        }
    }

    return(
        <form className="create" onSubmit={handleSubmit}>
            <h3>Add workouts</h3>
            <label>Exersize title:</label>
            <input type="text" 
                onChange={(e) => setTitle(e.target.value)}
                value={title}
                className={emptyFields.includes('title') ? 'error' : ''}
            />
            <label>Reps </label>
            <input type="number" 
                onChange={(e) => setReps(e.target.value)}
                value={reps}
                className={emptyFields.includes('reps') ? 'error' : ''}
            />
            <label>load:</label>
            <input type="number" 
                onChange={(e) => setLoad(e.target.value)}
                value={load}
                className={emptyFields.includes('load') ? 'error' : ''}
            />
            <button>Submit</button>
            {error && <div className="error">{error}</div>}
        </form>
    )
}
export default WorkoutForm