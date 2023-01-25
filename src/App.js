import "./App.css"
import { useState } from "react"
import { useNavigate } from "react-router"

function App() {
	const navigate = useNavigate()
	const [contact, setContact] = useState("")
	const handleSubmit = (e) => {
		e.preventDefault()
		navigate(`/call/${contact}`)
	}
	return (
		<div className="App">
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="contact">Phone Number</label>
					<input
						type="text"
						value={contact}
						id="contact"
						onChange={(e) => setContact(e.target.value)}
					/>
				</div>
				<button type="submit">submit</button>
			</form>
		</div>
	)
}

export default App
