import { Inter } from "next/font/google";
import "./css/index.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
	title: "TFL Journey Planner",
	description:
		"Plan your journey across London with the TFL Journey Planner. Get real-time updates, directions, and train timings.",
};

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body className={inter.className}>{children}</body>
		</html>
	);
}
