/**
 * The main component for the TFL Journey Planner application.
 *
 * @returns {JSX.Element} The rendered JSX element.
 */
"use client";

import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import "./css/transitions.css";
import ToFromForm from "./toFromForm";
import ShowDirections from "./directions";
import Head from "next/head";
import "./css/index.css";

export default function App() {
	const [to, setTo] = useState("");
	const [from, setFrom] = useState("");
	const [showDirections, setShowDirections] = useState(false);

	return (
		<>
			<div id="root">
				<h1>TFL Journey Planner</h1>
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
			</div>
		</>
	);
}
