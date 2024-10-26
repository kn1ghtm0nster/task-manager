const Button = ({ children }) => {
  return (
    <button className="bg-indigo-600 hover:bg-indigo-800 text-white font-semibold py-2 px-4 rounded">
      {children}
    </button>
  );
};

export default Button; // Exporting the Button component
