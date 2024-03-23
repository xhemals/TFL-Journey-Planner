/**
 * Handles autocomplete functionality for querying postcodes.
 * @param {string} query - The query string for autocomplete.
 * @returns {Promise} - A promise that resolves to the autocomplete data.
 */
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

/**
 * Checks if a given postcode is valid and belongs to the London region.
 * @param {string} postcode - The postcode to check.
 * @returns {Promise} - A promise that resolves to a boolean indicating if the postcode is valid and belongs to London.
 */
export const PostcodeCheck = async (postcode) => {
	postcode = postcode.replace(/\s/g, "");
	if (postcode.length === 0) {
		return null;
	}
	if (postcode.length > 7 || postcode.length < 6) {
		return false;
	} else {
		try {
			const validateResponse = await fetch(
				`https://api.postcodes.io/postcodes/${postcode}/validate`
			);
			const validateData = await validateResponse.json();
			if (!validateData.result) {
				return false;
			}
			const response = await fetch(
				`https://api.postcodes.io/postcodes/${postcode}`
			);
			if (!response.ok) {
				return false;
			} else {
				var data = await response.json();
			}
		} catch (error) {
			return false;
		}
		if (data.result.region === "London") {
			return true;
		}
	}
};

/**
 * Shows or hides the postcodes based on the autocomplete results and query.
 * @param {Array} elements - The array of elements to show or hide.
 * @param {Object} autoCompleteResults - The autocomplete results object.
 * @param {string} postcodeQuery - The query string for postcodes.
 */
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
