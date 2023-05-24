// src/App.js
import React from 'react';
import './styles.css';

export default function App() {
	const [ todos, setTodos ] = React.useState([ { id: 1, text: 'Example Task', done: false} ]);
	
	return (
		<div className="centerdiv">
			<h1>Daily Productivity Manager</h1>
			<div className='task'>
			<TodoList setTodos={setTodos} todos={todos} />
			<AddTodo setTodos={setTodos} />
			</div>
			<h1>Completed Task List</h1>
			<CompletedList setTodos={setTodos} todos={todos} />
		</div>
	);
}

function ActiveWork() {
	return ( 
		<div className="timerDisplay">
			00 : 00 : 00 : 000
		</div>
	); 	
}

function TodoList({ todos, setTodos }) {
	function handleToggleTodo(todo) {
		// if a todo's id is equal to the one we clicked on
		// just update that todo's done value to its opposite
		// otherwise do nothing and return it
		const updatedTodos = todos.map(
			(t) =>
				t.id === todo.id
					? {
							...t,
							done: !t.done
						}
					: t
		);
		setTodos(updatedTodos);
	}

	if (!todos.length) {
		return <p>No tasks left!</p>;
	}

	return (
		<ul>
			{todos.filter(todo => !todo.completed).map((todo) => (
				<li
					onDoubleClick={() => handleToggleTodo(todo)}
					style={{
						textDecoration: todo.done ? 'line-through' : ''
					}}
					key={todo.id}
				>
				<div className='column' style={{paddingBottom: 5, paddingTop: 5}}>	
					{todo.text}
				</div>
				<div className='row'> 
					{/* pass todo data down as a prop to DeleteTodo */}
					<DeleteTodo todo={todo} setTodos={setTodos} />
					<StartTodo todo={todo} />
					<TransferTodo todo={todo} setTodos={setTodos} />
				</div>
				<div className='column'> 
					<ActiveWork />
				</div>
				</li>
			))}
		</ul>
	);
}

function TransferTodo({ todo, setTodos }) {
	function handleTransferTodo() {
		const confirmed = window.confirm('Did you fully complete this task?');
		setTodos(todos => todos.map((mapTodo) => (todo === mapTodo ? { ...mapTodo, completed: true } : mapTodo)));
    // This syntax is using a functional callback (function passed to a function to be executed later) inside the setter
    // this tells us that the setter function... typically, we can pass this an object, or a function, which will rec
    // the current value. Then you return the value you want to have in the update. 
    // ...mapTodo is creating a new object, assigning previous properties, as well as a new property completed: true
    // We end up with a new array
  }
  
	return (
		<span
			onClick={handleTransferTodo}
			role="button"
			style={{
				color: 'white',
				fontWeight: 'bold',
				marginLeft: 10,
				cursor: 'pointer',
				backgroundColor: 'green',
				padding: 15, 
				paddingRight: 3,
				paddingLeft: 3,
				borderRadius: 100,
				textDecoration: todo.done ? 'line-through' : ''
			}}
			key={todo.id}
		>
			Finished
		</span>
	);
}

function StartTodo ({ todo }) {
	function  handleStartTodo() {
		let [milliseconds,seconds,minutes,hours] = [0,0,0,0];
		let timerRef = document.querySelector('.timerDisplay');
		let int = null;

			document.getElementById('startTimer').addEventListener('click', ()=>{
				if(int!==null){
					clearInterval(int);
				}
				int = setInterval(displayTimer,10);
			});

			document.getElementById('pauseTimer').addEventListener('click', ()=>{
				clearInterval(int);
			});

			document.getElementById('resetTimer').addEventListener('click', ()=>{
				clearInterval(int);
				[milliseconds,seconds,minutes,hours] = [0,0,0,0];
				timerRef.innerHTML = '00 : 00 : 00 : 000 ';
			});

			function displayTimer(){
				milliseconds+=10;
				if(milliseconds == 1000){
					milliseconds = 0;
					seconds++;
					if(seconds == 60){
						seconds = 0;
						minutes++;
						if(minutes == 60){
							minutes = 0;
							hours++;
						}
					}
				}
				let h = hours < 10 ? "0" + hours : hours;
				let m = minutes < 10 ? "0" + minutes : minutes;
				let s = seconds < 10 ? "0" + seconds : seconds;
				let ms = milliseconds < 10 ? "00" + milliseconds : milliseconds < 100 ? "0" + milliseconds : milliseconds;

				timerRef.innerHTML = ` ${h} : ${m} : ${s} : ${ms}`;
			}
		}
	return (
		<><span
			onClick={handleStartTodo}
			role="button"
			id="startTimer"
			style={{
				color: 'white',
				fontWeight: 'bold',
				marginLeft: 10,
				cursor: 'pointer',
				backgroundColor: 'black',
				padding: 15, 
				paddingRight: 15,
				paddingLeft: 15, 
				borderRadius: 100
			}}
		>
			Start
		</span>
		<span 
			onClick={handleStartTodo}
			role="button"
			id="pauseTimer"
			style={{
				color: 'white',
				fontWeight: 'bold',
				marginLeft: 10,
				cursor: 'pointer',
				backgroundColor: 'black',
				padding: 15, 
				paddingRight: 15,
				paddingLeft: 15,
				borderRadius: 100
		}}
	>
		Pause
	</span>
	<span onClick={handleStartTodo}
			role="button"
			id="resetTimer"
			style={{
				color: 'white',
				fontWeight: 'bold',
				marginLeft: 10,
				cursor: 'pointer',
				backgroundColor: 'black',
				padding: 15, 
				paddingRight: 15,
				paddingLeft: 15,
				borderRadius: 100
		}}>
			Reset 
	</span>
	</>
	);
}

function DeleteTodo({ todo, setTodos }) {
	function handleDeleteTodo() {
		const confirmed = window.confirm('Do you want to delete this?');
		if (confirmed) {
			setTodos((prevTodos) => {
				return prevTodos.filter((t) => t.id !== todo.id);
			});
		}
	}
	return (
		<span
			onClick={handleDeleteTodo}
			role="button"
			style={{
				color: 'white',
				fontWeight: 'bold',
				marginLeft: 10,
				cursor: 'pointer',
				backgroundColor: 'red',
				padding: 15, 
				paddingLeft: 5,
				paddingRight: 5,
				borderRadius: 100
			}}
		>
			Remove
		</span>
	);
}

function AddTodo({ setTodos }) {
	const inputRef = React.useRef();

	function handleAddTodo(event) {
		event.preventDefault();
		const text = event.target.elements.addTodo.value;
		const todo = {
			id: Math.random(),
			text,
			done: false
		};
		setTodos((prevTodos) => {
			return prevTodos.concat(todo);
		});
		inputRef.current.value = '';
	}

	return (
		<form onSubmit={handleAddTodo}>
			<input name="addTodo" placeholder="Add Task Here" ref={inputRef} />
			<button type="submit" className='button'>Submit</button>
		</form>
	);
}

function CompletedList({ todos, setTodos }) {
	function handleComplete(todo) {
		// if a todo's id is equal to the one we clicked on
		// just update that todo's done value to its opposite
		// otherwise do nothing and return it
		const updatedTodos = todos.map(
			(t) =>
				t.id === todo.id
					? {
							...t,
							done: !t.done
						}
					: t
		);
		setTodos(updatedTodos);
	}

	return (
		<ul>
			{todos.filter(todo => todo.completed).map((todo) => (
        // filter(function(todo){return todo.completed});
        // traditional 
        // if you don't use a code block (anything with curly braces that isn't an object) with arrow functions
        // then you are automatically returning the result of whatever you are evaluating 
        // Another call back function 
        // Filter() when called on an array only includes values for which the callback returns true 
        // todos is an array, you get a new array because of filter(), when you call map() you end up with another new array that are
        // defined as completed and returned in the ul
				<li
					onDoubleClick={() => handleToggleTodo(todo)}
					style={{
						textDecoration: todo.done ? 'line-through' : ''
					}}
					key={todo.id}
				>
					{todo.text}
					{/* pass todo data down as a prop to DeleteTodo */}
					<DeleteTodo todo={todo} setTodos={setTodos} />
					<TransferTodo todo={todo} setTodos={setTodos} />
				</li>
			))}
		</ul>
	);

}

