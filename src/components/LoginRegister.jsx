import Login from "./Login";
import Register from "./Register";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import ThemeToggleButton from "./ThemeToggleButton";

const LoginRegister = () => {
    const [showLogin, setShowLogin] = useState(true);
    const { darkMode } = useTheme();

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center ${darkMode ? 'bg-rose-300' : 'bg-gray-900'} transition-colors duration-200`}>
            <ThemeToggleButton className="absolute top-4 right-4" />
            <div className="flex flex-row items-center justify-center gap-x-8 mt-4">
                <button 
                    onClick={() => setShowLogin(true)}
                    className={`p-2 pb-0 rounded-t-[50px] w-25 h-30 ${showLogin ? 
                        (darkMode ? 'bg-pink-600' : 'bg-pink-800') : 
                        (darkMode ? 'bg-pink-700 hover:bg-pink-700' : 'bg-pink-900 hover:bg-pink-900')
                    } hover:scale-y-110 origin-bottom transition-all duration-300 flex items-end justify-center`}>
                    <div className={`w-16 h-16 ${darkMode ? 'bg-rose-200' : 'bg-rose-300'} rounded-t-[50px]`}></div>
                </button>
                <button 
                    onClick={() => setShowLogin(false)}
                    className={`p-2 pb-0 rounded-t-[50px] w-25 h-30 ${!showLogin ? 
                        (darkMode ? 'bg-pink-600' : 'bg-pink-800') : 
                        (darkMode ? 'bg-pink-700 hover:bg-pink-700' : 'bg-pink-900 hover:bg-pink-900')
                    } hover:scale-y-110 origin-bottom transition-all duration-300 flex items-end justify-center`}>
                    <div className={`w-16 h-16 ${darkMode ? 'bg-rose-200' : 'bg-rose-300'} rounded-t-[50px]`}></div>
                </button>
            </div>
            {showLogin ? <Login/> : <Register/>}
        </div>
    );
};

export default LoginRegister;