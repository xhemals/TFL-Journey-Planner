import TrainSVG from "./trainAnimation";
import { GetDirections } from "./getDirections";
import React, { useState, useEffect } from "react";
import "./css/directions.scss";

export default function DisplayDirections({ to, from }) {
	const [loading, setLoading] = useState(true);
	const [directionData, setDirectionData] = useState(null);

	document.getElementById("transition-group").removeAttribute("class");

	useEffect(() => {
		setTimeout(async () => {
			const data = await GetDirections(to, from);
			setDirectionData(data);
			setLoading(false);
		}, 1000);
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
					<h2>Lines</h2>
					{directionData.journeys.map((journeys, index) => (
						<div key={index} duration={journeys.duration}>
							<p>Duration: {journeys.duration}</p>
							{journeys.legs.map((leg, index) => (
								<div key={index}>
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
					))}
				</>
			)}
		</>
	);
}
