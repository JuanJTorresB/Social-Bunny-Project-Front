import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Post from "./Post";
import Comment from "./Comment";
import { SquarePen, ArrowLeft } from "lucide-react";
import PostComment from "./PostComment";

const CompletePost = () => {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [userActual, setUserActual] = useState(null);

    const getUser = async () => {
        const username = localStorage.getItem('username');
        const response = await axios.get(`http://localhost:8080/api/user/username/${username}`, {
            withCredentials: true
        });
        setUserActual(response.data);
    }

    useEffect(() => {
        const fetchComments = async () => {
            const response = await axios.get(`http://localhost:8080/api/post/${id}/comments`);
            setComments(response.data);
        };
        fetchComments();
    }, [id]);

    useEffect(() => {
        const fetchPost = async () => {
            const response = await axios.get(`http://localhost:8080/api/post/${id}`);
            setPost(response.data);
        };
        fetchPost();
    }, [id]);

    useEffect(() => {
        getUser();
    }, []);

    return (
        <div className={`flex flex-col items-center justify-center ${darkMode ? 'bg-amber-50' : 'bg-gray-900'} py-4 overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none'] min-h-screen`}>
            <div className="col-span-12 flex justify-between self-start w-2/3 min-w-[300px] max-w-[672px] mx-auto">
                <button
                    onClick={() => window.location.href = "/"}
                    className={`flex items-center gap-x-0 p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                >
                    <ArrowLeft className={`w-6 h-6 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
                </button>
                {userActual?.username == post?.user?.username ? <button
                    className={`flex items-center gap-x-0 p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                >
                    <SquarePen className={`w-6 h-6 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
                </button> : <></>}
            </div>
            {post && <Post post={post} userActual={userActual} />}
            <PostComment postId={id} userActual={userActual} />
            <div className="flex flex-col items-center justify-center w-2/3 gap-y-4 mt-4">
                {comments.map((comment) => (
                    <Comment key={comment?.id} comment={comment} userActual={userActual} />
                ))}
            </div>
        </div>
    );

}

export default CompletePost;