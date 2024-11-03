import { render, screen, fireEvent } from "@testing-library/react";
import NavBar from "../NavBar";

describe("NavBar component", () => {
	it("renders NabBar correctly", () => {
		render(<NavBar />);
		expect(screen.getByText("Task Manager")).toBeInTheDocument();
		expect(screen.getByText("Dark Mode")).toBeInTheDocument();
	});

	it("toggles dark mode", () => {
		render(<NavBar />);
		const toggleButton = screen.getByText("Dark Mode");

		// Initial state should be Light Mode
		expect(toggleButton).toBeInTheDocument();
		expect(toggleButton.textContent).toBe("Dark Mode");

		// Simulate toggle to Dark Mode
		fireEvent.click(toggleButton);
		expect(toggleButton.textContent).toBe("Light Mode");
		expect(document.documentElement.classList.contains("dark")).toBe(true);

		// Simulate toggle back to Light Mode
		fireEvent.click(toggleButton);
		expect(toggleButton.textContent).toBe("Dark Mode");
		expect(document.documentElement.classList.contains("dark")).toBe(false);
	});
});
