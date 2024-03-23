import TrainSVG from "./svg/trainAnimation";
import DropdownSVG from "./svg/dropdownSvg";
import { GetDirections } from "./getDirections";
import React, { useState, useEffect } from "react";
import copy from "copy-to-clipboard";
import "./css/directions.scss";

export default function DisplayDirections({ to, from }) {
	const [loading, setLoading] = useState(true);
	const [directionData, setDirectionData] = useState(null);
	const [copied, setCopied] = useState(false);

	const transitionGroup = document.getElementById("transition-group");
	if (transitionGroup) {
		transitionGroup.removeAttribute("class");
		transitionGroup.classList.add("direction-list");
	}

	function convertMinutesToHours(minutes) {
		let hours = Math.floor(minutes / 60);
		let mins = minutes % 60;
		return `${hours} hr ${mins < 10 ? `${mins}` : mins} min`;
	}

	const handleClick = (index) => {
		const svgElement = document.getElementById(`svg-${index}`);
		const directions = document.getElementById(`direction-${index}`);
		const journey = document.getElementById(`journey-div-${index}`);
		svgElement.classList.toggle("active");
		journey.classList.toggle("active");
		directions.classList.toggle("hidden");
		directions.classList.toggle("hidden");
	};

	const copyURL = () => {
		const url = `${
			window.location.origin
		}/tfl-journey-planner?from=${from.toUpperCase()}&to=${to.toUpperCase()}`;
		console.log(url);
		copy(url);
		setCopied(true);
	};

	useEffect(() => {
		setTimeout(() => {
			setCopied(false);
		}, 3000);
	}, [copied]);

	useEffect(() => {
		setTimeout(async () => {
			const data = await GetDirections(to, from);
			setDirectionData(data);
			setLoading(false);
		}, 1000); // Fake loading time to show off animation :)
	}, [to, from]);

	return (
		<>
			{loading ? (
				<div className="loading">
					<TrainSVG />
					Loading...
				</div>
			) : (
				<>
					<h2>
						{from.toUpperCase()} to {to.toUpperCase()}
					</h2>
					{directionData.journeys.map((journeys, index) => (
						<div
							key={`journey-${index}`}
							id={`journey-${index}`}
							className="journey-info"
						>
							<div
								key={index}
								className="journey"
								duration={journeys.duration}
								onClick={() => handleClick(index)}
							>
								<p>{convertMinutesToHours(journeys.duration)}</p>
								<DropdownSVG className={`svg-${index}`} id={`svg-${index}`} />
							</div>
							<div className="direction-wrapper" id={`journey-div-${index}`}>
								<div
									key={`direction-${index}`}
									id={`direction-${index}`}
									className="direction-info hidden"
								>
									{journeys.legs.map((leg, index) => (
										<div className="direction-step" key={index}>
											<p>
												{leg.duration} Minutes: {leg.instruction.summary}
											</p>
											{leg.instruction.steps.map((instruction, index) => (
												<div key={index}>
													<p>
														{instruction.descriptionHeading} down{" "}
														{instruction.description}
													</p>
												</div>
											))}
										</div>
									))}
								</div>
							</div>
						</div>
					))}
					<div className="copy">
						<button id="share" onClick={() => copyURL()}>
							Share <i className="fa-solid fa-share-from-square"></i>
						</button>
						{copied ? <span className="copied">Copied!</span> : null}
					</div>
				</>
			)}
		</>
	);
}
