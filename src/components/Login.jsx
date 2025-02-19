import { useForm } from "react-hook-form";
import axios from "axios";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { darkMode} = useTheme();
    const onSubmit = async (data) => {
        const response = await axios.post("http://localhost:1234/auth/login", data)
        console.log(response);
        if (response.status === 200) {
            localStorage.setItem('username', data.username);
            window.location.href = "/";
        }
    };
    
    return (
            <div className={`grid grid-cols-1 items-center justify-center max-w-md min-h-[80vh] w-full space-y-8 p-8 ${!darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md border-t-16 ${!darkMode ? 'border-pink-900' : 'border-pink-600'} mb-4`}>
                <div className="self-end">
                    <img className="w-25 h-25 mx-auto my-0" src="/ConejitoSocialFavicon.png" alt="ConejitoSocialFavicon"/>
                    <h2 className={`mt-6 text-center text-3xl font-extrabold ${darkMode ? 'text-slate-700' : 'text-white'} `}>
                        Login
                    </h2>
                </div>
                <form className="mt-8 space-y-6 self-start" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 rounded-md gap-y-5">
                        <div>
                            <label htmlFor="username" className="sr-only">
                                username
                            </label>
                            <input
                                id="username"
                                {...register("username", {
                                    required: {
                                        value: true,
                                        message: "This field is required"
                                    },
                                    maxLength: {
                                        value: 255,
                                        message: "Username must not exceed 255 characters"
                                    }
                                })}
                                type="text"
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${darkMode ? 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white' : 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'} rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Username"
                            />
                            {errors.username && <span className="text-red-500 text-sm">{errors.username.message}</span>}
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                password
                            </label>
                            <input
                                id="password"
                                {...register("password", {
                                    required: {
                                        value: true,
                                        message: "This field is required"
                                    },
                                    minLength: {
                                        value: 6,
                                        message: "Password must be at least 6 characters"
                                    },
                                    maxLength: {
                                        value: 255,
                                        message: "Password must not exceed 255 characters"
                                    }
                                })}
                                type="password"
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${darkMode ? 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white' : 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'} rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Password"
                            />
                            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                            Login
                        </button>
                    </div>
                </form>
            </div>
    )
}

export default Login;