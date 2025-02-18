import ThemeToggleButton from "./ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";
import { BellDot, ClockArrowDown, Flame, User, Heart, MessageCircle, UserPlus, AtSign, AlertCircle, Rabbit } from "lucide-react";
import ProfileCard from "./ProfileCard";
import PostForm from "./PostForm";
import Post from "./Post";
import { useEffect, useState } from "react";
import axios from "axios";
import { debounce } from "lodash";
import UsersSearch from "./UsersSearch";
import Modal from 'react-modal';

const MainMenu = () => {
    const { darkMode } = useTheme();
    const [responsePosts, setResponsePosts] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchedUser, setSearchedUser] = useState("");
    const [userActual, setUserActual] = useState(null);
    const [usersToDisplay, setUsersToDisplay] = useState([]);
    const [activeButton, setActiveButton] = useState('timeline');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [usernameCache, setUsernameCache] = useState({});
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [link, setLink] = useState(null);
    const [readyNotifications, setReadyNotifications] = useState([]);
    const [username, setUsername] = useState(null);

    const cheackUserFollower = async (followerUsername) => {
        const user = await getUser();
        console.log(user);
        const userId = user.id;
        const followerId = await getUserIdByUsername(followerUsername);
        const response = await axios.get("http://localhost:8080/api/follower/checkFollower/" + followerId + "/" + userId, {
            withCredentials: true
        });
        console.log("================================================");
        console.log("cheackUserFollower");
        console.log(userId);
        console.log(followerId);
        console.log(response.data); 
        console.log("================================================");
        return response.data;
    }

    const getUserIdByUsername = async (username) => {
        const response = await axios.get("http://localhost:8080/api/user/username/" + username, {
            withCredentials: true
        });
        return response.data.id;
    }

    const getUser = async () => {
        const username = localStorage.getItem('username');
        const response = await axios.get("http://localhost:8080/api/user/username/" + username, {
            withCredentials: true
        });
        console.log("================================================");
        console.log("getUser");
        console.log(response.data);
        console.log("================================================");
        setUserActual(response.data);
        return response.data;
    };

    const fetchUsers = async (searchTerm) => {
        const response = await axios.get("http://localhost:8080/api/user/username/like/" + searchTerm, {
            withCredentials: true
        });
        console.log(response.data);
        setUsers(response.data);
    };

    const debouncedFetchUsers = debounce(async (searchTerm) => {
        if (!searchTerm.trim()) {
            setUsers([]); // Limpiar usuarios si no hay término de búsqueda
            setUsersToDisplay([]); // Limpiar también los usuarios a mostrar
        } else {
            await fetchUsers(searchTerm);
        }
    }, 500);

    useEffect(() => {
        debouncedFetchUsers(searchedUser);
    }, [searchedUser]);

    const filterUsers = async () => {
        const filteredUsers = await Promise.all(users.map(async (user) => {
            const isCurrentUser = user.username === localStorage.getItem('username');
            const isFollower = await cheackUserFollower(user.username);

            console.log(`Usuario: ${user.username}, Es usuario actual: ${isCurrentUser}, No es seguidor: ${isFollower}`);
            console.log("Resultado:");
            console.log((!isCurrentUser && !isFollower) ? "entro" : "no entro");
            console.log("================================================");

            return { user, isCurrentUser, isFollower };
        }));

        return filteredUsers.filter(({ isCurrentUser, isFollower }) => !isCurrentUser && !isFollower)
            .map(({ user }) => <ProfileCard User={user} />);
    };
    const fetchFeedData = async () => {
        try {
            const User = await getUser();
            console.log(User);
            const userId = User.id;
            console.log("User ID:", userId);
            const response = await axios.get("http://localhost:8080/api/post/feed/" + userId, {
                withCredentials: true
            });
            setResponsePosts(response.data);
        } catch (error) {
            console.error("Error al obtener los datos feed:", error);
        }
    };

    const fetchFeedTrending = async () => {
        try {
            const User = await getUser();
            const userId = User.id;
            const response = await axios.get("http://localhost:8080/api/post/feed/" + userId + "/mostRelevant", {
                withCredentials: true
            });
            setResponsePosts(response.data);
        } catch (error) {
            console.error("Error al obtener los datos Trending:", error);
        }
    };

    const fetchNotifications = async () => {
        try {
            const User = await getUser();
            const userId = User.id;
            const response = await axios.get("http://localhost:8080/api/notification/unseen/" + userId, {
                withCredentials: true
            });
            setNotifications(response.data);
        } catch (error) {
            console.error("Error al obtener las notificaciones:", error);
        }
    };

    useEffect(() => {
        fetchFeedData();
        getUser();
    }, []);

    useEffect(() => {
        if (users.length > 0) {
            filterUsers().then(setUsersToDisplay);
        }
    }, [users]);

    const openModal = () => {
        setIsModalOpen(true);
        fetchNotifications();
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };


    useEffect(() => {
        const ReadyNotifications = async () => {
            const notificationsWithUsernames = await Promise.all(notifications.map(async (notification) => {
                const username = await renderUsername(notification);
                return { ...notification, username };
            }));

            setReadyNotifications(notificationsWithUsernames);
        };

        ReadyNotifications();
    }, [notifications, userActual]);

    useEffect(() => {
        const fetchProfilePhoto = async () => {
            const photo = await renderProfilePhoto(notifications[0]);
            setProfilePhoto(photo);
        };

        fetchProfilePhoto();
    }, [notifications]);

    useEffect(() => {
        const fetchLink = async () => {
            const resolvedLink = await renderLink(notifications[0]);
            setLink(resolvedLink);
            console.log("[DEBUG] Enlace resuelto:", resolvedLink);
        };

        fetchLink();
    }, [notifications]);

    const renderIcon = (type) => {
        switch (type) {
            case 'REACTION': return <Heart className={!darkMode ? 'text-indigo-500' : 'text-amber-500'} />;
            case 'COMMENT': return <MessageCircle className={!darkMode ? 'text-indigo-500' : 'text-amber-500'} />;
            case 'FOLLOW': return <UserPlus className={!darkMode ? 'text-indigo-500' : 'text-amber-500'} />;
            case 'MENTION': return <AtSign className={!darkMode ? 'text-indigo-500' : 'text-amber-500'} />;
            default: return <AlertCircle className={!darkMode ? 'text-indigo-500' : 'text-amber-500'} />;
        }
    };

    const renderMessage = (notification) => {
        switch (notification?.type) {
            case 'REACTION': return `${username} reacted to your post`;
            case 'COMMENT': return `${username} commented on your post`;
            case 'FOLLOW': return `${username} followed you`;
            case 'MENTION': return `${username} mentioned you in a post`;
            default: return notification?.type;
        }
    };

    const renderProfilePhoto = async (notification) => {
        switch (notification?.type) {
            case 'REACTION': return notification.reaction.user?.profilePhoto;
            case 'COMMENT': return notification.comment.user?.profilePhoto;
            case 'FOLLOW': return notification.follower?.follower?.profilePhoto;
            case 'MENTION': return notification.post.user?.profilePhoto;
            default: return null;
        }
    };

    const renderLink = async (notification) => {
        switch (notification?.type) {
            case 'REACTION': return `/profile/${notification.reaction.user?.username}`;
            case 'COMMENT': return `/profile/${notification.comment.user?.username}`;
            case 'FOLLOW': return `/profile/${notification.follower?.follower?.username}`;
            case 'MENTION': return `/profile/${notification.post.user?.username}`;
            default: return null;
        }
    };

    const renderUsername = async (notification) => {
        const userId = notification?.type === "REACTION" ? notification.reaction.user :
                       notification?.type === "COMMENT" ? notification.comment.user :
                       notification?.type === "FOLLOW" ? notification.follower?.follower :
                       notification?.type === "MENTION" ? notification.post.user : null;

        if (userId && typeof userId === "number") {
            if (usernameCache[userId]) {
                return usernameCache[userId];
            }

            const response = await axios.get(`http://localhost:8080/api/user/id/${userId}`);
            usernameCache[userId] = response.data.username; // Almacena en caché
            return response.data.username;
        } else {
            switch (notification?.type) {
                case 'REACTION': return notification.reaction.user?.username;
                case 'COMMENT': return notification.comment.user?.username;
                case 'FOLLOW': return notification.follower?.follower?.username;
                case 'MENTION': return notification.post.user?.username;
                default: return null;
            }
        }
    };  

    useEffect(() => {
        const fetchUsername = async () => {
            const username = await renderUsername(notifications[0]);
            setUsername(username);
        };

        fetchUsername();
    }, [notifications]);

    const markNotificationAsSeen = async (notificationId) => {
        try {
            await axios.put(`http://localhost:8080/api/notification/mark/seen/${notificationId}`, {
                withCredentials: true
            });
        } catch (error) {
            console.error("Error al marcar la notificación como vista:", error);
        }
    };

    return (
        <div className={`grid grid-cols-12 h-screen ${darkMode ? 'bg-amber-50' : 'bg-gray-900'}`}>
            <div className={`max-sm:col-span-12 col-span-8 h-full flex flex-col pb-4 items-center overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']`}>
                <nav className="mt-4 mx-4">
                    <ul className="flex flex-row gap-x-2 justify-center">
                        <li>
                            <button 
                                onClick={openModal} 
                                className={`p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 text-white'}`}>
                                <BellDot className={`w-6 h-6 transition-colors duration-200 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => { 
                                    setActiveButton('timeline'); 
                                    fetchFeedData(); 
                                }} 
                                className={`flex flex-row items-center gap-x-2 p-3 rounded-lg transition-colors duration-200
                                ${activeButton === 'timeline' ?
                                    (darkMode ? 'bg-amber-500 text-white' : 'bg-indigo-500 text-white') :
                                    (darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700'
                                    : 'bg-gray-700 text-white')}`}>
                                <span className={`max-sm:sr-only text-base font-medium`}>
                                    Timeline
                                </span>
                                <ClockArrowDown className={`w-6 h-6 transition-colors duration-200`} />
                            </button>
                        </li>
                        <li>
                            <button 
                                onClick={() => { 
                                    setActiveButton('trending'); 
                                    fetchFeedTrending(); 
                                }} 
                                className={`flex flex-row items-center gap-x-2 p-3 rounded-lg transition-colors duration-200
                                ${activeButton === 'trending' ?
                                    (darkMode ? 'bg-amber-500 text-white' : 'bg-indigo-500 text-white') :
                                        (darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 text-white')}`}>
                                            
                                <span className={`max-sm:sr-only text-base font-medium`}>
                                    Trending
                                </span>
                                <Flame className={`w-6 h-6 transition-colors duration-200`} />
                            </button>
                        </li>
                        <li className="sm:hidden">
                            <button onClick={() => window.location.href = "/profile"} className={`flex flex-row items-center gap-x-2 p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 text-white'}`}>
                                <User strokeWidth={2.5} className={`w-6 h-6 transition-colors duration-200 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
                            </button>
                        </li>
                        <li>
                            <ThemeToggleButton className="" />
                        </li>
                    </ul>
                </nav>
                {userActual && <PostForm UserActual={userActual} />}
                {responsePosts.map((post) => (
                    <Post post={post} userActual={userActual} />
                ))}
            </div>
            <div className="pb-4 flex flex-col items-center col-span-4 h-ful max-sm:hidden overflow-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
                <UsersSearch
                    darkMode={darkMode}
                    setSearchedUser={setSearchedUser}
                    usersToDisplay={usersToDisplay}
                />
            </div>

            <Modal
                isOpen={isModalOpen}
                onRequestClose={closeModal}
                contentLabel="Notificaciones"
                overlayClassName="fixed flex inset-0 bg-slate-600/60"
                className={`modal flex flex-col w-96 m-auto align-center justify-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'} rounded-lg p-4`}
            >
                <button onClick={closeModal} className={`flex self-start w-fit items-center gap-x-0 p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                    Cerrar
                </button>
                <h2 className="text-2xl font-bold mb-4">Notificaciones</h2>
                <ul className='flex flex-col gap-y-4'>
                    {readyNotifications.length > 0 ? readyNotifications.map(notification => (
                        <li key={notification.id}
                        className={`p-2 rounded-lg ${darkMode ? 'bg-rose-200' : 'bg-gray-600'} flex flex-row items-center gap-x-2`}
                        onClick={() => {
                            window.location.href = link || '#';
                            markNotificationAsSeen(notification.id);
                        }}>
                            {profilePhoto ? (
                            <img
                                src={profilePhoto}
                                alt={notification.reaction?.user?.username || "fotoUser"}
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className={`${darkMode ? 'bg-rose-800' : 'bg-rose-200'} p-2 rounded-full`}>
                                <Rabbit className={`w-6 h-6 ${!darkMode ? 'text-rose-400' : 'text-rose-200'}`} />
                            </div>
                        )}
                        {renderIcon(notification?.type)}
                        <span>{renderMessage(notification)}</span>
                        </li>
                    )) : <p>No hay notificaciones.</p>}
                </ul>
            </Modal>
        </div>
    );
};

export default MainMenu;
