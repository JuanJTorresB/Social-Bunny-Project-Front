import { useForm } from "react-hook-form";
import axios from "axios";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";

const Register = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { darkMode, toggleDarkMode } = useTheme();
    
    const onSubmit = async (data) => {
        const response = await axios.post("http://localhost:8080/auth/register", data)
        console.log(response);
        if (response.status === 200) {
            localStorage.setItem('username', data.username);
            window.location.href = "/";
        }
    };
    return (
            <div className={` ${
                darkMode ? 'bg-white border-pink-600' 
                : 'bg-gray-800 border-pink-900'} grid grid-cols-1 items-center justify-center max-w-md min-h-[80vh] w-full space-y-8 p-8 rounded-lg shadow-md border-t-16 mb-4`}>
                <div className="self-end">
                    <img className="w-25 h-25 mx-auto my-0" src="/ConejitoSocialFavicon.png" alt="ConejitoSocialFavicon"/>
                    <h2 className={`${
                darkMode ? 'text-slate-700' 
                : 'text-white'}
                mt-6 text-center text-3xl font-extrabold`}>
                        Register
                    </h2>
                </div>
                <form className="mt-8 space-y-6 self-start" onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 rounded-md gap-y-5">
                        <div>
                            <label htmlFor="fullName" className="sr-only">Full Name</label>
                            <input
                                id="fullName"
                                {...register("fullName", {
                                    required: {
                                        value: true,
                                        message: "This field is required"
                                    },
                                    maxLength: {
                                        value: 255,
                                        message: "Full name must not exceed 255 characters"
                                    }
                                })}
                                type="text"
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    darkMode ? 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white' 
                                    : 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'
                                } rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Full Name"
                            />
                            {errors.fullName && <span className="text-red-500 text-sm">This field is required</span>}
                        </div>

                        <div>
                            <label htmlFor="username" className="sr-only">Username</label>
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
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    darkMode ? 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white' 
                                    : 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'
                                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Username"
                            />
                            {errors.username && <span className="text-red-500 text-sm">This field is required</span>}
                        </div>

                        <div>
                            <label htmlFor="password" className="sr-only">Password</label>
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
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    darkMode ? 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white' 
                                    : 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'
                                } rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Password"
                            />
                            {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="email" className="sr-only">Email</label>
                            <input
                                id="email"
                                {...register("email", {
                                    required: {
                                        value: true,
                                        message: "This field is required"
                                    },
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email"
                                    },
                                    maxLength: {
                                        value: 255,
                                        message: "Email must not exceed 255 characters"
                                    }
                                })}
                                type="email"
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    darkMode ? 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white' 
                                    : 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'
                                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Email"
                            />
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="mobileNumber" className="sr-only">Mobile Number</label>
                            <input
                                id="mobileNumber"
                                {...register("mobileNumber", {
                                    required: {
                                        value: true,
                                        message: "This field is required"
                                    },
                                    minLength: {
                                        value: 10,
                                        message: "Mobile number must be exactly 10 digits"
                                    },
                                    maxLength: {
                                        value: 10,
                                        message: "Mobile number must be exactly 10 digits"
                                    },
                                    pattern: {
                                        value: /^\d{10}$/,
                                        message: "Mobile number must contain only digits"
                                    }
                                })}
                                type="tel"
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    darkMode ? 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white' 
                                    : 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'
                                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                                placeholder="Mobile Number"
                            />
                            {errors.mobileNumber && <span className="text-red-500 text-sm">This field is required</span>}
                        </div>

                        <div>
                            <label htmlFor="birthDate" className={` ${
                darkMode ? 'text-gray-900' 
                : 'text-white'}`}>Birth Date</label>
                            <input
                                id="birthDate"
                                {...register("birthDate", {
                                    required: {
                                        value: true,
                                        message: "This field is required"
                                    },
                                    validate: {
                                        notFutureDate: (value) => {
                                            const today = new Date();
                                            today.setHours(0, 0, 0, 0);
                                            const selectedDate = new Date(value);
                                            today.setFullYear(today.getFullYear() - 14);
                                            return selectedDate <= today || "You must be at least 14 years old to register";
                                        }
                                    }
                                })}
                                type="date"
                                className={`appearance-none rounded-none relative block w-full px-3 py-2 border ${
                                    darkMode ? 'border-gray-300 placeholder-gray-500 text-gray-900 bg-white' 
                                    : 'border-gray-600 placeholder-gray-400 text-white bg-gray-700'
                                } focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm`}
                            />
                            {errors.birthDate && <span className="text-red-500 text-sm">{errors.birthDate.message}</span>}
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${
                                darkMode ? 'bg-indigo-600 hover:bg-indigo-700' 
                                : 'dark:bg-indigo-500 dark:hover:bg-indigo-600'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}>
                            Register
                        </button>
                    </div>
                </form>
            </div>
    )
}

export default Register;