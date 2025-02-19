import { useEffect, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import axios from "axios";
import Post from "./Post";
import Comment from "./Comment";
import { SquarePen, ArrowLeft } from "lucide-react";
import PostComment from "./PostComment";
import Modal from "react-modal";
import { useForm } from "react-hook-form";

Modal.setAppElement("#root");

const CompletePost = () => {
    const { darkMode } = useTheme();
    const navigate = useNavigate();
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [userActual, setUserActual] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const getUser = async () => {
        const username = localStorage.getItem('username');
        const response = await axios.get(`http://localhost:1234/api/user/username/${username}`, {
            withCredentials: true
        });
        setUserActual(response.data);
    }

    useEffect(() => {
        const fetchComments = async () => {
            const response = await axios.get(`http://localhost:1234/api/post/${id}/comments`);
            setComments(response.data);
        };
        fetchComments();
    }, [id]);

    useEffect(() => {
        const fetchPost = async () => {
            const response = await axios.get(`http://localhost:1234/api/post/${id}`);
            setPost(response.data);
        };
        fetchPost();
    }, [id]);

    useEffect(() => {
        getUser();
    }, []);

    const editPost = async (data) => {
        try {
            post.user = {
                ...post.user,
                accountNonExpired: undefined,
                accountNonLocked: undefined,
                authorities: undefined
            };
            post.description = data.description;
            post.img = data.img;
            const response = await axios.put(`http://localhost:1234/api/post/update`, post, {
                withCredentials: true
            });
            setPost(response.data);
            window.location.reload();
        } catch (error) {
            console.error("Error al editar el post:", error);
        }
    }   

    const handleEditClick = () => {
        setIsModalOpen(true);
    };

    const EditPostModal = ({ isOpen, onClose, post }) => {
        const { register, handleSubmit, reset } = useForm({
            defaultValues: {
                description: post?.description || "",
                img: post?.img || ""
            }
        });

        const onSubmit = async (data) => {
            await editPost(data);
            reset();
            onClose();
        };

        return (
            <Modal isOpen={isOpen} onRequestClose={onClose} contentLabel="Editar Post" overlayClassName="fixed flex inset-0 bg-slate-600/60"
            className={`modal flex flex-col w-96 m-auto align-center justify-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'} rounded-lg p-4`}>
                <h2>Editar Post</h2>
                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                    <div>
                        <label htmlFor="description">Descripción:</label>
                        <textarea id="description" {...register("description")} className={`p-2 rounded-lg ${darkMode ? 'bg-white text-rose-700' : 'bg-gray-600 text-white min-w-[300px] h-[100px]'} overflow-wrap-anywhere`} />
                    </div>
                    <div>
                        <label htmlFor="img">Imagen URL:</label>
                        <input id="img" type="text" {...register("img")} className={`p-2 rounded-lg ${darkMode ? 'bg-white text-rose-700' : 'bg-gray-600 text-white min-w-[300px] h-[100px]'} overflow-wrap-anywhere`} />
                    </div>
                    <button type="submit" className={`p-2 rounded-lg ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                        Save Changes
                    </button>
                    <button type="button" onClick={onClose} className={`p-2 rounded-lg ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                        Close
                    </button>
                </form>
            </Modal>
        );
    };

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
                    onClick={handleEditClick}
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
            <EditPostModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} post={post} />
        </div>
    );
}

export default CompletePost;