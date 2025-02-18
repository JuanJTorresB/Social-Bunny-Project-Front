import { useTheme } from "../context/ThemeContext";

const ThemeToggleButton = ({ className = "" }) => {
    const { darkMode, toggleDarkMode } = useTheme();

    return (
        <button
            onClick={toggleDarkMode}
            className={`p-2 text-2xl rounded-lg ${darkMode ? 'bg-rose-100 text-gray-800' : 'bg-gray-700 text-white'} transition-colors duration-200 ${className}`}
        >
            {darkMode ? '☀️' : '🌙'}
        </button>
    );
};

export default ThemeToggleButton; 