import { useTheme } from "../context/ThemeContext";
import { SendHorizontal, Rabbit } from "lucide-react";
import { useForm } from "react-hook-form";
import axios from "axios";

const PostComment = ({ userActual, postId }) => {
    const { darkMode } = useTheme();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();

    const onSubmit = async (data) => {
        const commentData = {
            user: {
                ...userActual,
                accountNonExpired: undefined,
                accountNonLocked: undefined,
                authorities: undefined
            },
            body: data.body
        };
        
        try {
            const response = await axios.post(`http://localhost:1234/api/comment/${postId}/save`, commentData, {
                withCredentials: true
            });
            console.log(response.data);
            window.location.reload();
        } catch (error) {
            console.error("Error al guardar el comentario:", (error.response ? error.response.data : error.message));
        }
    };

    return (
        <form className={`${darkMode ? 'bg-rose-100' : 'bg-gray-700'} rounded-lg p-4 mt-4 flex flex-col items-center justify-center gap-y-2 w-2/3 min-w-[300px] max-w-[672px]`} onSubmit={handleSubmit(onSubmit)}>
            <div className={`flex flex-row items-center justify-center gap-x-2`}>
                {userActual == null ? (
                    <div className={`flex flex-row items-center justify-center gap-x-2`}>
                        <div className={`${darkMode ? 'bg-rose-800' : 'bg-rose-200'} p-2 rounded-full`}>
                            <Rabbit className={`w-6 h-6 ${!darkMode ? 'text-rose-400' : 'text-rose-200'} `} />
                        </div>
                    </div>
                ) : (
                    <img src={`${userActual.profilePhoto}`} alt="" className="w-10 h-10 rounded-full" />
                )}
                <h1 className={`text-base font-medium ${darkMode ? 'text-rose-700' : 'text-white'}`}>@{userActual?.username}</h1>
            </div>
            <div className="flex flex-row items-center justify-center gap-x-2 w-full">
                <textarea
                    {...register("body", {
                        required: {
                            value: true,
                            message: "Comment content is required"
                        },
                        maxLength: {
                            value: 280,
                            message: "Comment content must not exceed 280 characters"
                        },
                        minLength: {
                            value: 1,
                            message: "Comment content must not be empty"
                        }
                    })}
                    className={`resize-none w-full p-6 rounded-lg ${darkMode ? 'bg-white text-rose-700 placeholder-rose-400' : 'bg-gray-600 text-white placeholder-gray-400'}`}
                    placeholder="Write a comment..."
                    rows={4}
                />
            </div>
            <div className={`flex flex-row items-center justify-center gap-x-4`}>
                <button type="submit">
                    <SendHorizontal className={`w-6 h-6 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
                </button>
                {errors.body && <span className="text-red-500 text-sm">{errors.body.message}</span>}
            </div>
        </form>
    );
};

export default PostComment; 