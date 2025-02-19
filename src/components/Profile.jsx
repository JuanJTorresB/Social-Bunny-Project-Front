import { useTheme } from '../context/ThemeContext'
import { Rabbit, ArrowLeft, LogOut, UserRoundPen } from 'lucide-react'
import UsersSearch from './UsersSearch'
import Post from './Post'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { debounce } from 'lodash'
import ProfileCard from './ProfileCard'
import Modal from 'react-modal'
import { useParams } from 'react-router-dom'
import { useForm } from 'react-hook-form'

// Configura el modal
Modal.setAppElement('#root')

const Profile = ({ User }) => {
    const { darkMode } = useTheme();
    const [postUser, setPostUser] = useState([]);
    const [users, setUsers] = useState([]);
    const [searchedUser, setSearchedUser] = useState("");
    const [usersToDisplay, setUsersToDisplay] = useState([]);

    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);

    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [modalType, setModalType] = useState('followers'); // 'followers' o 'following'

    const [modalUsers, setModalUsers] = useState([]);
    const [userUrl, setUserUrl] = useState(null);
    const { username } = useParams();

    const [secondModalIsOpen, setSecondModalIsOpen] = useState(false); // Estado para el segundo modal

    const { register, handleSubmit, formState: { errors } } = useForm();

    const [biography, setBiography] = useState(userUrl?.biography || "");
    const [profilePhoto, setProfilePhoto] = useState(userUrl?.profilePhoto || "");

    useEffect(() => {
        if (userUrl) {
            setBiography(userUrl.biography || "");
            setProfilePhoto(userUrl.profilePhoto || "");
        }
    }, [userUrl]);    

    useEffect(() => {
        const fetchUser = async () => {
            if (username) {
                console.log("Fetching user by username:", username);
                const userData = await getUserByUsername(username);
                setUserUrl(userData);
                return;
            }
            console.log("User:", User);
            setUserUrl(User);
        };
        fetchUser();
    }, [username, User]);

    useEffect(() => {
        const fetchFollowers = async () => {
            try {
                const response = await axios.get(`http://localhost:1234/api/follower/getFollowers/${userUrl.id}`, {
                    withCredentials: true
                });
                console.log("Seguidores obtenidos:", response.data);
                setFollowers(response.data);
            } catch (error) {
                console.error("Error al obtener los seguidores:", error);
            }
        };
        if (userUrl) {
            console.log("Fetching followers for user:", userUrl);
            fetchFollowers();
        }
    }, [userUrl]);
    
    useEffect(() => {
        const fetchFollowing = async () => {
            try {
                const response = await axios.get(`http://localhost:1234/api/follower/getFollowing/${userUrl.id}`, {
                    withCredentials: true
                });
                console.log("Seguidos obtenidos:", response.data);
                setFollowing(response.data);
            } catch (error) {
                console.error("Error al obtener los seguidos:", error);
            }
        };
        if (userUrl) {
            console.log("Fetching following for user:", userUrl);
            fetchFollowing();
        }
    }, [userUrl]);
    

    const fetchUsers = async (searchTerm) => {
        if (searchTerm !== "") {
            const response = await axios.get("http://localhost:1234/api/user/username/like/" + searchTerm, {
                withCredentials: true
            });
            console.log(response.data);
            setUsers(response.data);
        } else {
            setUsers([]);
        }
    };

    const debouncedFetchUsers = debounce(async (searchTerm) => {
        console.log(searchTerm);
        if (!searchTerm.trim()) {
            setUsers([]);
        }
        await fetchUsers(searchTerm);
    }, 500);

    useEffect(() => {
        debouncedFetchUsers(searchedUser);
    }, [searchedUser]);

    const filterUsers = async () => {
        const filteredUsers = await Promise.all(users.map(async (user) => {
            const isCurrentUser = user.username === localStorage.getItem('username');
            return { user, isCurrentUser};
        }));

        return filteredUsers.filter(({ isCurrentUser }) => !isCurrentUser)
            .map(({ user }) => <ProfileCard User={user} />);
    };

    useEffect(() => {
        if (!searchedUser.trim()) {
            setUsersToDisplay([]);
            return;
        }
    
        if (users.length > 0) {
            filterUsers().then(setUsersToDisplay);
        } else {
            setUsersToDisplay([]);
        }
    }, [users, searchedUser]);    

    useEffect(() => {
        const fetchPostUser = async () => {
            try {
                const response = await axios.get(`http://localhost:1234/api/post/user/${userUrl.id}`, {
                    withCredentials: true
                });
                console.log(response.data);
                setPostUser(response.data.map(post => <Post post={post} userActual={userUrl} />));
            } catch (error) {
                console.error("Error al obtener los posts del usuario:", error);
            }
        };
        if (userUrl) {
            fetchPostUser();
        }
    }, [userUrl]);

    const openModal = (type) => {
        setModalType(type);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
    };

    const openSecondModal = () => {
        setSecondModalIsOpen(true);
    };

    const closeSecondModal = () => {
        setSecondModalIsOpen(false);
    };

    const getUserByUsername = async (username) => {
        const response = await axios.get("http://localhost:1234/api/user/username/" + username, {
            withCredentials: true
        });
        return response.data;
    }

    useEffect(() => {
        const fetchModalUsers = async () => {
            let users = [];
            if (modalType === 'followers') {
                users = await Promise.all(followers.map(async (follower) => {
                    return await getUserByUsername(follower.follower.username);
                }));
            } else {
                users = await Promise.all(following.map(async (following) => {
                    return await getUserByUsername(following.followed.username);
                }));
            }
            setModalUsers(users);
        };

        if (modalIsOpen) {
            fetchModalUsers();
        }
    }, [modalIsOpen, modalType, followers, following]);

    const logOut = () => {
        axios.post("http://localhost:1234/auth/logout", {
            withCredentials: true
        }).then(() => {
            window.location.href = "/";
        });
    }

    const onSubmit = async (data) => {
        const response = await axios.put("http://localhost:1234/api/user/id/" + userUrl.id, data, {
            withCredentials: true
        });
        console.log(response.data);
        closeSecondModal();
        window.location.reload();
    };

    return (
            <div className={`h-screen w-screen ${darkMode ? 'bg-amber-50' : 'bg-gray-900'} overflow-y-scroll overflow-x-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']`}>
                <div className="col-span-12 flex flex-col items-center py-8">
                    <div className="col-span-12 flex justify-between self-start w-full max-w-[672px] mx-auto">
                        <button
                            onClick={() => window.location.href = "/"}
                            className={`flex items-center gap-x-0 p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                        >
                            <ArrowLeft className={`w-6 h-6 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
                        </button>
                        {!username ? <button
                            onClick={logOut}
                            className={`flex items-center gap-x-0 p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                        >
                            <LogOut className={`w-6 h-6 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
                        </button> : <></>}
                    </div>
                    {userUrl?.profilePhoto ? (
                        <img
                            src={userUrl.profilePhoto}
                            alt={userUrl.username}
                            className="w-32 h-32 rounded-full object-cover"
                        />
                    ) : (
                        <div className={`flex items-center justify-center w-32 h-32 rounded-full overflow-hidden ${darkMode ? 'bg-rose-100' : 'bg-gray-700'}`}>
                            <Rabbit className={`w-20 h-20 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
                        </div>
                    )}
                    <h1 className={`text-2xl font-bold mt-4 ${darkMode ? 'text-rose-700' : 'text-white'}`}>
                        @{userUrl?.username ? userUrl?.username : 'gatita123'}
                    </h1>

                    <div className={`mt-6 w-2/3 max-w-2xl p-6 rounded-lg ${darkMode ? 'bg-rose-100' : 'bg-gray-700'}  min-w-[300px]`}>
                        <h2 className={`text-lg font-medium mb-2 ${darkMode ? 'text-rose-700' : 'text-white'}`}>
                            Biography
                        </h2>
                        <p className={`text-base ${darkMode ? 'text-rose-600' : 'text-gray-300'}`}>
                            {userUrl?.biography}
                        </p>

                        <div className="flex gap-x-6 mt-4">
                            <div className="text-center" onClick={() => openModal('followers')}>
                                <span className={`block text-xl font-bold ${darkMode ? 'text-rose-700' : 'text-white'}`}>
                                    {followers.length}
                                </span>
                                <span className={`text-sm ${darkMode ? 'text-rose-600' : 'text-gray-300'}`}>
                                    Followers
                                </span>
                            </div>
                            <div className="text-center" onClick={() => openModal('following')}>
                                <span className={`block text-xl font-bold ${darkMode ? 'text-rose-700' : 'text-white'}`}>
                                    {following.length}
                                </span>
                                <span className={`text-sm ${darkMode ? 'text-rose-600' : 'text-gray-300'}`}>
                                    Following
                                </span>
                            </div>
                            { !username ? <div>
                                <button onClick={openSecondModal} className={`flex items-center gap-x-0 p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                                    <UserRoundPen className={`w-6 h-6 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
                                </button>
                            </div> : <></>}
                        </div>
                    </div>
                <UsersSearch
                    darkMode={darkMode}
                    setSearchedUser={setSearchedUser}
                    usersToDisplay={usersToDisplay}
                    className={"max-w-[672px]"}
                />
                {postUser}
                </div>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    contentLabel="Followers or Following"
                    overlayClassName="fixed flex inset-0 bg-slate-600/60"
                    className={`modal flex flex-col w-96 m-auto align-center justify-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'} rounded-lg p-4`}
                >
                    <button
                            onClick={closeModal}
                            className={`flex self-start w-fit items-center gap-x-0 p-3 rounded-lg transition-colors duration-200 ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}
                        >
                            <ArrowLeft className={`w-6 h-6 ${darkMode ? 'text-rose-700' : 'text-white'}`} />
                        </button>
                    <div className="flex flex-col gap-y-2 justify-center items-center">
                        <h2 className="text-2xl font-bold mb-4">{modalType === 'followers' ? 'Followers' : 'Following'}</h2>
                        {
                            modalUsers.map(user => (
                                <ProfileCard User={user} />
                            ))
                        }
                    </div>
                </Modal>

                <Modal
                    isOpen={secondModalIsOpen}
                    onRequestClose={() => setSecondModalIsOpen(false)} // Cerrar el segundo modal
                    contentLabel="Second Modal"
                    overlayClassName="fixed flex inset-0 bg-slate-600/60"
                    className={`modal flex flex-col w-96 m-auto align-center justify-center ${darkMode ? 'bg-gray-800 text-white' : 'bg-gray-900 text-white'} rounded-lg p-4`}
                >
                    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-y-4">
                        <input
                            type="text"
                            placeholder="biography"
                            defaultValue={biography}
                            onChange={(e) => setBiography(e.target.value)}
                            {...register("biography")}
                            className={`p-2 rounded-lg ${darkMode ? 'bg-white text-rose-700' : 'bg-gray-600 text-white min-w-[300px] h-[100px]'} overflow-wrap-anywhere`}
                        />
                        {errors.biography && <span className="text-red-500 text-sm">{errors.biography.message}</span>}
                        <input
                            type="url"
                            placeholder="URL de la foto de perfil"
                            defaultValue={profilePhoto}
                            onChange={(e) => setProfilePhoto(e.target.value)}
                            {...register("profilePhoto", {
                                pattern: {
                                    value: /^(https?:\/\/(?:www\.)?[\w\-]+(\.[\w\-]+)+(\/[\w\-.,@?^=%&:;+#]*)*\.(png|jpg|jpeg|gif|bmp|svg)(\/[\w\-]*)*(\?.*)?)$/i,
                                    message: "Please enter a valid image URL (png, jpg, jpeg, gif, bmp, svg)."
                                }                                                                
                            })}
                            className={`p-2 rounded-lg ${darkMode ? 'bg-white text-rose-700' : 'bg-gray-600 text-white min-w-[300px] h-[100px]'} overflow-wrap-anywhere`}
                        />
                        {errors.profilePhoto && <span className="text-red-500 text-sm">{errors.profilePhoto.message}</span>}
                        <button type="submit" className={`p-2 rounded-lg ${darkMode ? 'bg-rose-100 hover:bg-rose-300 text-rose-700' : 'bg-gray-700 hover:bg-gray-600 text-white'}`}>
                            Save Changes
                        </button>
                    </form>
                </Modal>
            </div>
    );
};

export default Profile;
