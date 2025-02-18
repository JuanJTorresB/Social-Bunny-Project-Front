import { User } from "lucide-react";

const UsersSearch = ({ darkMode, setSearchedUser, usersToDisplay, className }) => {
    return (
        <>
        {(!window.location.pathname.includes("/profile")) ? <button onClick={() => window.location.href = "/profile"} className={`mt-4 flex flex-row items-center gap-x-2 p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 text-white'}`}>
                <span className={`max-sm:sr-only text-base font-medium ${darkMode ? 'text-rose-700' : 'text-white'}`}>
                    Profile
                </span>
                <User strokeWidth={2.5} className={`w-6 h-6 transition-colors duration-200 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
            </button>: <></>}
            {window.location.pathname.includes("/profile/") ? <></> :
            <div className={"flex flex-row items-center w-2/3 mt-4 min-w-[300px] " + className}>
                <input
                    type="text"
                    placeholder="🔍 Search Users"
                    className={`w-full p-4 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-rose-100 text-rose-700 placeholder-rose-500 focus:bg-rose-300 focus:outline-none' : 'bg-gray-700 text-white'}`}
                    onChange={(e) => setSearchedUser(e.target.value)}
                />
            </div>
            }
            {usersToDisplay}
        </>
    );
};

export default UsersSearch; 