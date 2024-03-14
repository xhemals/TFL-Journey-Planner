export const GetDirections = async (to, from) => {
	const response = await fetch(
		`https://api.tfl.gov.uk/Journey/JourneyResults/${from}/to/${to}?timeIs=Arriving&journeyPreference=LeastTime&accessibilityPreference=NoRequirements&walkingSpeed=Average&cyclePreference=None&bikeProficiency=Easy`
	);
	const data = await response.json();
	return data;
};
