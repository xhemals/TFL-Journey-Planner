import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./css/transitions.css";
import ToFromForm from "./toFromForm";
import GetDirections from "./directions";

export default function App() {
	const [to, setTo] = useState("");
	const [from, setFrom] = useState("");
	const [showDirections, setShowDirections] = useState(false);

	return (
		<>
			<h1>TFL Journey Planner</h1>
			<TransitionGroup className={`${showDirections ? "transition" : ""}`}>
				<CSSTransition
					key={showDirections ? "directions" : "form"}
					timeout={5000}
					classNames="fade"
				>
					{!showDirections ? (
						<ToFromForm
							setTo={setTo}
							setFrom={setFrom}
							setShowDirections={setShowDirections}
						/>
					) : (
						<GetDirections to={to} from={from} />
					)}
				</CSSTransition>
			</TransitionGroup>
		</>
	);
}
