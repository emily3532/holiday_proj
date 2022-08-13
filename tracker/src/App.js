import Header from './components/Header'
import Tasks from './components/Tasks'
import AddTask from './components/AddTask';
import { useState} from 'react'
import './App.css';

const App = () => {
  const [tasks, setTasks] = useState([
    {
        id:1,
        text: 'New Task',
        reminder: true,
    },
    {
        id:2,
        text: 'Cool Beans',
        reminder: false
    }
])

//Toggle Reminder
const toggleReminder = (id) => {
  setTasks(tasks.map((task)=> task.id === id
  ? { ...task, reminder: !task.reminder }: task
    )
  )
}

//Delete Task
const deleteTask = (id) => {
  //console.log('delete', id)
  setTasks(tasks.filter((task) => task.id !== id))
}


  return (
    <div className="container">
      <Header title='Hello'/>
      <AddTask/>
      {tasks.length >0 ? (<Tasks tasks={tasks} onDelete={deleteTask} onToggle={toggleReminder}/>) : ('No Tasks To Show')}
    </div>
  );
}

export default App;
