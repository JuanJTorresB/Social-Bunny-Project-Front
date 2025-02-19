import { useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { Rabbit, UserPlus, UserMinus } from "lucide-react";
import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({User}) => {
    const { darkMode } = useTheme();
    const [userActual, setUserActual] = useState(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        const IsActualUserFollowing = async () => {
            const user = await getUser();
            console.log(user);
            const followerId = User.id;
            const userId = user.id;
        const response = await axios.get("http://localhost:1234/api/follower/checkFollower/" + followerId + "/" + userId, {
            withCredentials: true
        });
        console.log("================================================");
        console.log("cheackUserFollower");
        console.log(userId);
        console.log(followerId);
        console.log(response.data); 
        console.log("================================================");
        setIsFollowing(response.data);
        console.log(isFollowing);
        return response.data;
        }
        IsActualUserFollowing();
    }, [userActual]);


    const getUserIdByUsername = async (username) => {
        const response = await axios.get("http://localhost:1234/api/user/username/" + username, {
            withCredentials: true
        });
        return response.data.id;
    }

    const getUser = async () => {
        if (userActual == null) {
        const username = localStorage.getItem('username');
        const response = await axios.get("http://localhost:1234/api/user/username/" + username, {
            withCredentials: true
            });
            setUserActual(response.data);
        }
        return userActual;
    };

    const followUser = async () => {
        const response = await axios.post("http://localhost:1234/api/follower/save/" + userActual.id + "/" + User.id, {
            withCredentials: true
        });
        setIsFollowing(true);
        console.log(isFollowing);
    }

    const unfollowUser = async () => {
        const response = await axios.delete("http://localhost:1234/api/follower/unfollow/" + userActual.id + "/" + User.id, {
            withCredentials: true
        });
        setIsFollowing(false);
        console.log(isFollowing);
    }

    return (
        <div className={`${darkMode ? 'bg-rose-100 hover:bg-rose-300' : 'bg-gray-700'} rounded-lg px-4 mt-4 flex flex-row items-center justify-around gap-x-6 py-3 w-2/3 min-w-[200px] transition-all duration-200 cursor-pointer max-w-[672px]`}>
            {User == null ? 
                <div className={`${darkMode ? 'bg-rose-800' : 'bg-rose-200'}  p-2 rounded-full`}>
                    <Rabbit className={`w-6 h-6 ${!darkMode ? 'text-rose-400' : 'text-rose-200'} `} />
                </div> :
                <img onClick={() => navigate(`/profile/${User.username}`)} src={`${User.profilePhoto}`} alt="" className="w-10 h-10 rounded-full cursor-pointer"/>
            }
            <h1 className={`font-medium text-base truncate overflow-hidden ${darkMode ? 'text-rose-700' : 'text-white'}`}>@{User.username}</h1>
            {userActual?.username == User.username ? <></> :
            <button onClick={isFollowing ? unfollowUser : followUser} className={`${darkMode ? 'text-rose-700 bg-rose-50' : 'text-white bg-indigo-400'}  p-2 rounded-lg hover:opacity-75`}>
                {isFollowing ? <UserMinus className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
            </button>
            }
        </div>
    )
}

export default ProfileCard;
