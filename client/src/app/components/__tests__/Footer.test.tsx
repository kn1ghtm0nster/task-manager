import React from "react";
import { render, screen } from "@testing-library/react";

import Footer from "../Footer";

describe("Footer Component", () => {
	test("renders Footer with correct text", () => {
		render(<Footer />);
		const footerText = screen.getByText(
			/© 2024 Task Manager. All rights reserved/i
		);
		expect(footerText).toBeInTheDocument();
	});
});
