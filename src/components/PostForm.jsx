import { useTheme } from "../context/ThemeContext";
import { SendHorizontal, ImageUp, Rabbit } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";

const PostForm = ({ UserActual }) => {
    const { darkMode } = useTheme();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();


    const onSubmit = async (data) => {
        console.log(data);
        console.log(UserActual);
        const fechaActual = new Date().toISOString().split('T')[0];
        
        // Construir el objeto user sin las propiedades no deseadas
        const { accountNonExpired, accountNonLocked, authorities, ...user } = UserActual;
        
        data.user = user;
        data.creationDate = fechaActual;
        console.log(data);
        const response = await axios.post("http://localhost:8080/api/post/upload", data, {
            withCredentials: true
        });
        console.log(response.data);
        reset();
    }

    return (
        <form className={`${darkMode ? 'bg-rose-100' : 'bg-gray-700'} rounded-lg p-4 mt-4 flex flex-col items-center justify-center gap-y-2 w-2/3 min-w-[300px] max-w-[672px]`}>
            <div className={`flex flex-row items-center justify-center gap-x-2`}>
                
            {UserActual == null ?
                <div className={`flex flex-row items-center justify-center gap-x-2`}>
                    <div className={`${darkMode ? 'bg-rose-800' : 'bg-rose-200'} p-2 rounded-full`}>
                        <Rabbit className={`w-6 h-6 ${!darkMode ? 'text-rose-400' : 'text-rose-200'} `} />
                    </div>
                </div> :
                <img src={`${UserActual.profilePhoto}`} alt="" className="w-10 h-10 rounded-full"/>
            }
            <h1 className={`text-base font-medium ${darkMode ? 'text-rose-700' : 'text-white'}`}>@{UserActual?.username}</h1>
            </div>
            <div className="flex flex-row items-center justify-center gap-x-2 w-full">
                <textarea
                    {...register("description", {
                        required: {
                            value: true,
                            message: "Post content is required"
                        },
                        maxLength: {
                            value: 280,
                            message: "Post content must not exceed 280 characters"
                        },
                        minLength: {
                            value: 1,
                            message: "Post content must not be empty"
                        }
                    })}
                    className={`resize-none w-full p-6 rounded-lg ${darkMode ? 'bg-white text-rose-700 placeholder-rose-400' : 'bg-gray-600 text-white placeholder-gray-400'}`}
                    placeholder="What's on your mind?"
                    rows={6}
                />
            </div>
            <div className={`flex flex-row items-center justify-center gap-x-4`}>
                <button type="submit" onClick={handleSubmit(onSubmit)}>
                    <SendHorizontal className={`w-6 h-6 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
                </button>
                <ImageUp className={`w-9 h-9 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
                <input
                    type="url"
                    {...register("img", {
                        pattern: {
                            value: /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg))$/i,
                            message: "Please enter a valid URL"
                        }
                    })}
                    className={`w-full p-2 rounded-lg ${darkMode ? 'bg-white text-rose-700 placeholder-rose-400' : 'bg-gray-600 text-white placeholder-gray-400'}`}
                    placeholder="Enter URL (optional)"
                />
                {errors.img && <span className="text-red-500 text-sm">{errors.img.message}</span>}
                {errors.description && <span className="text-red-500 text-sm">{errors.description.message}</span>}
            </div>
        </form>
    );
};

export default PostForm;
