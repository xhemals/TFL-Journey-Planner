export const HandleAutocomplete = async (query) => {
	if (query.length === 0) {
		var data = null;
	} else {
		const response = await fetch(
			`https://api.postcodes.io/postcodes/${query}/autocomplete?limit=12`
		);
		var data = await response.json();
	}
	return data;
};

export const PostcodeCheck = async (postcode) => {
	postcode = postcode.replace(/\s/g, "");
	if (postcode.length === 0) {
		return null;
	}
	if (postcode.length > 7 || postcode.length < 6) {
		return false;
	} else {
		const response = await fetch(
			`https://api.postcodes.io/postcodes/${postcode}`
		);
		var data = await response.json();
		if (data.result.region === "London") {
			return true;
		} else {
			return false;
		}
	}
};

export const ShowPostcodes = (elements, autoCompleteResults, postcodeQuery) => {
	var x = 0;
	elements.forEach((element) => {
		if (autoCompleteResults === null || autoCompleteResults.result === null) {
			if (postcodeQuery.length < 7) {
				element.classList.add("hidden");
			} else if (x === 0) {
				x++;
			} else {
				element.classList.add("hidden");
			}
		} else {
			var postcode = autoCompleteResults.result[x];
			if (!autoCompleteResults) {
				element.classList.add("hidden");
			} else if (!postcode) {
				element.classList.add("hidden");
			} else {
				element.classList.remove("hidden");
				element.innerHTML = postcode;
				element.classList.add("show");
				x++;
			}
		}
	});
};
