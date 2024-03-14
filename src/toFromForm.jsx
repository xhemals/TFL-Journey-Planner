/**
 * Represents a form component for selecting "From" and "To" locations.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {function} props.setTo - The function to set the "To" location.
 * @param {function} props.setFrom - The function to set the "From" location.
 * @param {function} props.setShowDirections - The function to set whether to show directions.
 * @returns {JSX.Element} The rendered form component.
 */
import { useState, useRef, useEffect } from "react";
import { set, useForm } from "react-hook-form";
import {
	HandleAutocomplete,
	PostcodeCheck,
	ShowPostcodes,
} from "./getPostcodes";
import "./css/toFromForm.scss";

export default function ToFromForm({ setTo, setFrom, setShowDirections }) {
	const { register, handleSubmit } = useForm();
	const [toValue, setToValue] = useState("");
	const [fromValue, setFromValue] = useState("");
	const [isFromFocused, setIsFromFocused] = useState(false);
	const [isToFocused, setIsToFocused] = useState(false);
	const fromLabelRef = useRef();
	const toLabelRef = useRef();
	const [initialWidth, setInitialWidth] = useState(0);
	const [initialHeight, setInitialHeight] = useState(0);
	const [autoCompleteResults, setAutoCompleteResults] = useState(Object);
	const [resultsReady, setResultsReady] = useState(false);
	const [postcodeQuery, setPostcodeQuery] = useState("");
	const [isFromValid, setIsFromValid] = useState(true);
	const [isToValid, setIsToValid] = useState(true);
	const [showSubmit, setShowSubmit] = useState(false);

	useEffect(() => {
		const fromRect = fromLabelRef.current;
		const toRect = toLabelRef.current;
		setInitialWidth(fromRect.offsetWidth);
		setInitialHeight(fromRect.offsetHeight);
	}, []);

	const handleFocus = (label) => {
		if (label === fromLabelRef) {
			setIsFromFocused(true);
		} else {
			setIsToFocused(true);
		}
	};

	const handleBlur = (label) => {
		if (label === fromLabelRef) {
			setIsFromFocused(false);
			document.getElementById("from-input").blur();
		} else {
			setIsToFocused(false);
			document.getElementById("to-input").blur();
		}
	};

	useEffect(() => {
		if (isFromFocused) {
			document.documentElement.style.setProperty(
				"--label-width",
				`${initialWidth}px`
			);
			document.documentElement.style.setProperty(
				"--label-height",
				`${initialHeight}px`
			);
			document.documentElement.style.setProperty(
				"--label-translationX",
				"25vw"
			);
		} else if (isToFocused) {
			document.documentElement.style.setProperty(
				"--label-width",
				`${initialWidth}px`
			);
			document.documentElement.style.setProperty(
				"--label-height",
				`${initialHeight}px`
			);
			document.documentElement.style.setProperty(
				"--label-translationX",
				"-5vw"
			);
			document.documentElement.style.setProperty("--label-margin", "-1.15%");
		}
	}, [isFromFocused, isToFocused, initialWidth, initialHeight]);

	useEffect(() => {
		const removeNotFullscreenClass = () => {
			const elements = document.getElementsByClassName("not-fullscreen");
			while (elements.length > 0) {
				elements[0].classList.remove("not-fullscreen");
			}
		};
		if (document.readyState === "complete") {
			removeNotFullscreenClass();
		} else {
			window.addEventListener("load", removeNotFullscreenClass);
		}
		return () => {
			window.removeEventListener("load", removeNotFullscreenClass);
		};
	}, []);

	const handleKeyDown = (event, label) => {
		if (event.keyCode === 13) {
			event.preventDefault();
			event.target.blur();
			handleBlur(label);
		}
	};

	const getPostcodes = async (query) => {
		setResultsReady(false);
		console.log(autoCompleteResults);
		if (isFromFocused) {
			setFromValue(query);
		} else if (isToFocused) {
			setToValue(query);
		}
		setPostcodeQuery(query);
		const results = await HandleAutocomplete(query);
		setAutoCompleteResults(results);
		setResultsReady(true);
	};

	const setValues = (event) => {
		const postcode = event.target.innerHTML;
		if (isFromFocused) {
			setFromValue(postcode);
			setTimeout(() => {
				handleBlur(fromLabelRef);
			}, 1);
		} else if (isToFocused) {
			setToValue(postcode);
			setTimeout(() => {
				handleBlur(toLabelRef);
			}, 1);
		}
	};

	const shouldShowSubmit = () => {
		var inLondon = document.getElementsByClassName("in-london");
		setTimeout(() => {
			if (inLondon.length === 2) {
				setShowSubmit(true);
				// document.getElementById("submit-btn").classList.remove("hidden");
			} else {
				setShowSubmit(false);
			}
		}, 1);
	};

	useEffect(() => {
		if (isFromFocused) {
			const elements = document.querySelectorAll('[id^="from-postcode-"]');
			ShowPostcodes(elements, autoCompleteResults, postcodeQuery);
		} else if (isToFocused) {
			const elements = document.querySelectorAll('[id^="to-postcode-"]');
			ShowPostcodes(elements, autoCompleteResults, postcodeQuery);
		}
	}, [autoCompleteResults]);

	useEffect(() => {
		document.getElementById("from-input").classList.remove("not-in-london");
		document.getElementById("from-input").classList.remove("in-london");
		const checkPostcode = async () => {
			const checker = await PostcodeCheck(fromValue);
			if (checker === false) {
				// document.getElementById("from-input").classList.add("not-in-london");
				setIsFromValid(false);
			} else if (checker === true) {
				// document.getElementById("from-input").classList.add("in-london");
				setIsFromValid(true);
			}
			shouldShowSubmit(); // Move shouldShowSubmit function call here
		};
		checkPostcode();
	}, [fromValue]);

	useEffect(() => {
		document.getElementById("to-input").classList.remove("not-in-london");
		document.getElementById("to-input").classList.remove("in-london");
		const checkPostcode = async () => {
			const checker = await PostcodeCheck(toValue);
			if (checker === false) {
				// document.getElementById("to-input").classList.add("not-in-london");
				setIsToValid(false);
			} else if (checker === true) {
				// document.getElementById("to-input").classList.add("in-london");
				setIsToValid(true);
			}
			shouldShowSubmit(); // Move shouldShowSubmit function call here
		};
		checkPostcode();
	}, [toValue]);

	const onSubmit = (data) => {
		setFrom(data.from);
		setTo(data.to);
		setShowDirections(true);
		console.log(data);
	};

	return (
		<form className="to-from-form" onSubmit={handleSubmit(onSubmit)}>
			<div
				className={`label-container ${
					isFromFocused
						? "from-fullscreened"
						: isToFocused
						? "to-fullscreened"
						: ""
				}`}
			>
				<div
					className={`to-from-label ${
						isFromFocused ? "fullscreen" : isToFocused ? "not-fullscreen" : ""
					}`}
				>
					<span
						className={`close ${isFromFocused ? "fullscreen" : "hidden"}`}
						onClick={() => handleBlur(fromLabelRef)}
					>
						close
					</span>
					<label ref={fromLabelRef} className="from">
						<a>From</a>
						<input
							{...register("from")}
							className={`input ${isFromFocused ? "" : "unfocused"} ${
								isFromValid
									? fromValue.length == 0
										? ""
										: "in-london"
									: "not-in-london"
							}`}
							type="text"
							value={fromValue}
							onInput={(event) => {
								const regex = /^[a-zA-Z0-9 ]*$/;
								if (regex.test(event.target.value)) {
									getPostcodes(event.target.value);
								}
							}}
							onFocus={() => {
								isFromFocused
									? null // Add this line
									: handleFocus(fromLabelRef);
							}} // onBlur={() => handleBlur(fromLabelRef)}
							onKeyDown={(event) => handleKeyDown(event, fromLabelRef)}
							spellCheck="false"
							id="from-input"
							maxLength={8}
						/>
						{isFromValid ? null : isFromFocused ? null : (
							<span className="error-message">Not a London postcode</span>
						)}
						{isFromFocused && resultsReady ? (
							<div className="additional-content">
								{autoCompleteResults === null ||
								autoCompleteResults.result === null
									? null
									: autoCompleteResults.result.map((element, key) => {
											return (
												<div
													key={key}
													className="postcodes hidden"
													id={`from-postcode-${key}`}
													onClick={(event) => setValues(event)}
												>
													{element}
												</div>
											);
									  })}
							</div>
						) : null}
					</label>
				</div>
				<div
					className={`to-from-label ${
						isToFocused ? "fullscreen" : isFromFocused ? "not-fullscreen" : ""
					}`}
				>
					<span
						className={`close ${isToFocused ? "fullscreen" : "hidden"}`}
						onClick={() => handleBlur(toLabelRef)}
					>
						close
					</span>
					<label ref={toLabelRef} className="to">
						To
						<input
							{...register("to")}
							className={`input ${isToFocused ? "" : "unfocused"} ${
								isToValid
									? toValue.length == 0
										? ""
										: "in-london"
									: "not-in-london"
							}`}
							type="text"
							value={toValue}
							onInput={(event) => {
								const regex = /^[a-zA-Z0-9 ]*$/;
								if (regex.test(event.target.value)) {
									getPostcodes(event.target.value);
								}
							}}
							onFocus={() => {
								isToFocused
									? null // Add this line
									: handleFocus(toLabelRef);
							}}
							// onBlur={() => handleBlur(toLabelRef)}
							onKeyDown={(event) => handleKeyDown(event, toLabelRef)}
							spellCheck="false"
							id="to-input"
						/>
						{isToValid ? null : isToFocused ? null : (
							<span className="error-message">Not a London postcode</span>
						)}
						{isToFocused && resultsReady ? (
							<div className="additional-content">
								{autoCompleteResults === null ||
								autoCompleteResults.result === null
									? null
									: autoCompleteResults.result.map((element, key) => {
											return (
												<div
													key={key}
													className="postcodes hidden"
													id={`to-postcode-${key}`}
													onClick={(event) => setValues(event)}
												>
													{element}
												</div>
											);
									  })}
							</div>
						) : null}
					</label>
				</div>
			</div>
			<button
				className={`btn ${showSubmit ? "" : "hidden"}`}
				type="submit"
				id="submit-btn"
			>
				Submit
			</button>
		</form>
	);
}
