import { useEffect } from "react"
import WorkoutDetails from '../Componets/WorkoutDetails'
import { useAuthContext } from "../hooks/useAuthContext"
import WorkoutForm from "../Componets/workoutForm"
import { useWorkoutContext } from "../hooks/useWorkoutContext"

const Home = () => {
   const {workouts, dispatch} = useWorkoutContext() 
   const {user} = useAuthContext()

    useEffect(() => {
        const fetchWorkouts =  async () => {
            const response = await fetch('/api/workouts', {
                headers: {
                    'Authorization': `Bearer ${user.token}`
                }
            })
            const json = await response.json()

            if(response.ok){
              dispatch({type: 'SET_WORKOUTS', payload: json})  
            }
        }

        if(user){
            fetchWorkouts()
        }
    }, [dispatch, user])

    return (
        <div className="home">
            <div className="workout">
                {workouts && workouts.map(workout => (
                    <WorkoutDetails key={workout._id} workout={workout} />
                ))}
            </div>
            <WorkoutForm />
        </div>
    )
}

export default Home