import { useTheme } from "../context/ThemeContext";
import { Rabbit, Heart, MessageCircle, MoreHorizontal, Trash2 } from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Post = ({ post, userActual }) => {
    const { darkMode } = useTheme();
    const [hasReacted, setHasReacted] = useState(false);
    const [reactionActualizaer, setReactionActualizaer] = useState(false);
    const [countReactions, setCountReactions] = useState(0);
    const [userPost, setUserPost] = useState(null);
    const [mentions, setMentions] = useState([]);
    const navigate = useNavigate();
    console.log("================================================");
    console.log("post");
    console.log(post);
    console.log("================================================");

    const getUserById = async () => {
        if (typeof post.user === 'number') {
            const response = await axios.get(`http://localhost:1234/api/user/id/${post.user}`, {
                withCredentials: true
            });
            setUserPost(response.data);
            return response.data;
        }
        setUserPost(post.user);
        return post.user;
    }

    useEffect(() => {
        const fetchReaction = async () => {
            const reaction = await cheackReaction();
            setHasReacted(reaction);
        };
        setCountReactions(post?.countReactions);
        fetchReaction();
        getUserById();
    }, [post.id, userActual?.id, reactionActualizaer]);

    const cheackReaction = async () => {
        const response = await axios.get(`http://localhost:1234/api/reaction/${post.id}/${userActual?.id}`, {
            withCredentials: true
        });
        return response.data;
    }

    const handleReaction = async () => {
        try {
            await axios.post(`http://localhost:1234/api/reaction/${post.id}/${userActual?.id}`, {
                withCredentials: true
            });
            console.log("================================================");
            console.log("reactionActualizaer");
            console.log(reactionActualizaer);
            console.log("================================================");
            setReactionActualizaer(!reactionActualizaer);
            setHasReacted(!hasReacted);
        } catch (error) {
            console.error("Error al reaccionar:", error);
        }
    }

    const checkMention = async (username) => {
        const response = await axios.get(`http://localhost:1234/api/user/usernameExists/${username}`, {
            withCredentials: true
        });
        console.log("================================================");
        console.log("username check");
        console.log(response.data);
        console.log("================================================");
        return response.data;
    }

    const handleDelete = async () => {
        const response = await axios.delete(`http://localhost:1234/api/post/delete/${post.id}`, {
            withCredentials: true
        });
        navigate("/");
        return response.data;
    }

    useEffect(() => {
        const getPost = async () => {
            const response = await axios.get(`http://localhost:1234/api/post/${post.id}`, {
                withCredentials: true
            });
            setCountReactions(response.data.countReactions);
            return response.data;
        }
        getPost();
    }, [post.id, userActual?.id, reactionActualizaer]);

    useEffect(() => {
        const checkAllMentions = async () => {
            const words = post?.description?.split(" ") || [];
            const mentionPromises = words
                .filter(word => word.startsWith("@"))
                .map(word => checkMention(word.slice(1)).then(exists => (exists ? word.slice(1) : null)));
    
            const results = (await Promise.all(mentionPromises)).filter(Boolean);
            setMentions(results);
        };
    
        checkAllMentions();
    }, [post.description]);    
    

    return (
        <article className={`${darkMode ? 'bg-rose-100' : 'bg-gray-700'} rounded-lg p-4 mt-4 flex flex-col gap-y-4 w-2/3 min-w-[300px] max-w-[672px]`}>
            <div className="flex items-center justify-between">
                <div onClick={() => navigate(`/profile/${userPost?.username}`)} className="flex items-center gap-x-2">
                    {userPost?.profilePhoto ? (
                        <img
                            src={userPost.profilePhoto}
                            alt={userPost.username}
                            className="w-10 h-10 rounded-full object-cover"
                        />
                    ) : (
                        <div className={`${darkMode ? 'bg-rose-800' : 'bg-rose-200'} p-2 rounded-full`}>
                            <Rabbit className={`w-6 h-6 ${!darkMode ? 'text-rose-400' : 'text-rose-200'}`} />
                        </div>
                    )}
                    <div>
                        <h2 className={`font-medium ${darkMode ? 'text-rose-700' : 'text-white'}`}>
                            @{userPost?.username || "guest"}
                        </h2>
                        <span className={`text-sm ${darkMode ? 'text-rose-500' : 'text-gray-400'}`}>
                            {new Date(post?.creationDate || Date.now()).toLocaleDateString()}
                        </span>
                    </div>
                </div>
                {!window.location.pathname.includes("/post/") ? <button onClick={() => navigate(`/post/${post?.id}`)} className={`${darkMode ? 'text-rose-700' : 'text-white'} hover:opacity-75`}>
                    <MoreHorizontal className="w-6 h-6" />
                </button> : (userActual?.username == post?.user?.username ? <button onClick={() => handleDelete()} className={`${darkMode ? 'text-rose-700' : 'text-white'} hover:opacity-75`}>
                    <Trash2 className="w-6 h-6" />
                </button> : <></>)}
            </div>

            <p className={`${darkMode ? 'text-rose-700' : 'text-white'} text-base`}>
                {post?.description?.split(" ").map((word, index) => {
                    const username = word.startsWith("@") ? word.slice(1) : null;
                    const isMention = username && mentions.includes(username);
                    const isHashtag = word.startsWith("#");
                    return (
                        <span 
                            onClick={isMention ? () => navigate(`/profile/${username}`) : null} 
                            key={index} 
                            className={isMention ? "text-blue-500 font-bold cursor-pointer" : isHashtag ? "text-amber-500 font-bold cursor-pointer" : ""}
                        >
                            {word}{" "}
                        </span>
                    );
                }) || "Contenido del post"}
            </p>


            {post?.img && (
                <img
                    src={post.img}
                    alt="Post content"
                    className="rounded-lg w-full object-cover max-h-96"
                />
            )}
            <div className={`flex items-center justify-center pt-2 border-t border-opacity-20 border-current ${darkMode ? 'border-rose-700' : 'border-gray-400'}`}>
                <div className="flex items-center gap-x-2 w-1/2 justify-between">
                    <button onClick={() => handleReaction()} className={`flex items-center gap-x-1 ${darkMode ? 'text-rose-700' : 'text-white'} hover:opacity-75`}>
                        <Heart className={`w-5 h-5 ${hasReacted ? `${darkMode ? 'text-amber-500' : 'text-indigo-700'}` : `${darkMode ? 'text-rose-700' : 'text-white'}`}`} />
                        <span>{countReactions || 0}</span>
                    </button>
                    <button className={`flex items-center gap-x-1 ${darkMode ? 'text-rose-700' : 'text-white'} hover:opacity-75`}>
                        <MessageCircle className="w-5 h-5" />
                        <span>{post?.countComments || 0}</span>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default Post; 