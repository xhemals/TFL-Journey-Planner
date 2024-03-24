/**
 * The main component for the TFL Journey Planner application.
 *
 * @returns {JSX.Element} The rendered JSX element.
 */

import React, { useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import { useSearchParams } from "next/navigation";
import "./css/transitions.css";
import ToFromForm from "./toFromForm";
import ShowDirections from "./directions";
import "./css/index.css";

export default function App() {
	const [to, setTo] = useState("");
	const [from, setFrom] = useState("");
	const [showDirections, setShowDirections] = useState(false);
	const searchParams = useSearchParams();
	const paramFrom = searchParams.get("from");
	const paramTo = searchParams.get("to");

	useEffect(() => {
		if (paramFrom && paramTo) {
			if (paramFrom == paramTo) {
				setShowDirections(false);
			} else {
				setFrom(paramFrom);
				setTo(paramTo);
				setShowDirections(true);
			}
		}
	}, [paramFrom, paramTo]);

	return (
		<>
			<div id="root">
				<h1>TFL Journey Planner</h1>
				{showDirections ? (
					<ShowDirections to={to} from={from} />
				) : (
					<TransitionGroup
						id="transition-group"
						className={`${showDirections ? "transition" : ""}`}
					>
						<CSSTransition
							key={showDirections ? "directions" : "form"}
							timeout={1000}
							classNames="fade"
						>
							{!showDirections ? (
								<ToFromForm
									setTo={setTo}
									setFrom={setFrom}
									setShowDirections={setShowDirections}
								/>
							) : (
								<ShowDirections to={to} from={from} />
							)}
						</CSSTransition>
					</TransitionGroup>
				)}
			</div>
		</>
	);
}
