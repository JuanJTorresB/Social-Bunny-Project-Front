import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Rabbit, Trash2 } from "lucide-react";

const Comment = ({ comment, userActual }) => {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const [userComment, setUserComment] = useState(null);

    const getUserById = async () => {
        if (typeof comment.user == 'number') {
            try {
                const response = await axios.get(`http://localhost:1234/api/user/id/${comment.user}`, {
                    withCredentials: true
                });
                if (response.data) {
                    setUserComment(response.data);
                } else {
                    console.warn("La API no devolvió datos para el usuario con ID:", comment.user);
                }
            } catch (error) {
                console.error("Error al obtener usuario:", error);
            }
        } else {
            setUserComment(comment.user);
        }
    };

    const handleDelete = async (commentId) => {
        try {
            await axios.delete(`http://localhost:1234/api/comment/delete/${commentId}`, {
                withCredentials: true
            });
            window.location.reload();
        } catch (error) {
            console.error("Error al eliminar el comentario:", error);
        }
    }

    useEffect(() => {
        getUserById();
    }, [comment.user]);


    return (
        <div className={`${darkMode ? 'bg-rose-100 hover:bg-rose-300' : 'bg-gray-700'} rounded-lg flex flex-col items-center justify-around gap-y-4 w-full min-w-[300px] transition-all duration-200 max-w-[672px] py-4`}>
            <div onClick={() => navigate(userComment?.username ? `/profile/${userComment.username}` : "/profile/guest")}
                className="flex items-center gap-x-2">
                {userComment && userComment.profilePhoto ? (
                    <img
                        src={userComment.profilePhoto}
                        alt={userComment.username}
                        className="w-10 h-10 rounded-full object-cover cursor-pointer"
                    />
                ) : (
                    <div className={`${darkMode ? 'bg-rose-800' : 'bg-rose-200'} p-2 rounded-full`}>
                        <Rabbit className={`w-6 h-6 ${!darkMode ? 'text-rose-400' : 'text-rose-200'}`} />
                    </div>
                )}

                <div>
                    <h2 className={`font-medium ${darkMode ? 'text-rose-700' : 'text-white'}`}>
                        @{userComment?.username || "guest"}
                    </h2>
                </div>
            </div>
            <p className={`text-sm ${darkMode ? 'text-rose-700 bg-rose-200' : 'text-white bg-gray-600'}   p-4 rounded-lg`}>{comment.body}</p>
            {userActual?.username === userComment?.username ? (
                <button onClick={() => handleDelete(comment.id)} className={`${darkMode ? 'text-rose-700' : 'text-white'} hover:opacity-75`}>
                    <Trash2 className="w-6 h-6" />
                </button>
            ) : null}
        </div>
    );
}

export default Comment;
