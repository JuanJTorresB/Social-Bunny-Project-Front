import React, { useEffect, useState } from 'react';
import { Stomp } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { Heart, MessageCircle, UserPlus, AlertCircle, AtSign, Rabbit } from 'lucide-react';
import axios from 'axios';
import { useTheme } from "../context/ThemeContext";

const NotificationSocket = () => {
    const [notifications, setNotifications] = useState([]);
    const [userActual, setUserActual] = useState(null);
    const { darkMode } = useTheme();
    const [filteredNotifications, setFilteredNotifications] = useState([]);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const [link, setLink] = useState(null);
    const usernameCache = {}; // Caché para almacenar nombres de usuario

    const getUser = async () => {
        const username = localStorage.getItem('username');
        console.log(`[DEBUG] Buscando usuario: ${username}`);

        try {
            const response = await axios.get(`http://localhost:1234/api/user/username/${username}`, {
                withCredentials: true
            });

            console.log("[DEBUG] Usuario obtenido:", response.data);
            setUserActual(response.data);
        } catch (error) {
            console.error("[ERROR] Error al obtener el usuario:", error);
        }
    };

    useEffect(() => {
        console.log("[DEBUG] useEffect getUser ejecutado");
        getUser();
    }, []);

    useEffect(() => {
        console.log("[DEBUG] useEffect WebSocket ejecutado");

        const socket = new SockJS('http://localhost:1234/ws');
        const stompClient = Stomp.over(socket);

        socket.onopen = () => {
            console.log("[DEBUG] Conectado al servidor de notificaciones");
        };

        socket.onclose = () => {
            console.log("[DEBUG] Desconectado del servidor de notificaciones");
        };

        socket.onerror = (error) => {
            console.error("[ERROR] Error en la conexión:", error);
        };

        stompClient.connect({}, (frame) => {
            console.log(`[DEBUG] Conectado a STOMP: ${frame}`);

            stompClient.subscribe('/topic/notifications', (notification) => {
                console.log("[DEBUG] Notificación recibida:", JSON.parse(notification.body));

                const newNotification = {
                    ...JSON.parse(notification.body),
                    id: Date.now() // Asigna un ID único si no tiene uno
                };

                setNotifications((prevNotifications) => [...prevNotifications, newNotification]);
            });
        });

        return () => {
            console.log("[DEBUG] Desconectando STOMP...");
            stompClient.disconnect();
        };
    }, []);

    const handleRemoveNotification = (id) => {
        setNotifications((prevNotifications) =>
            prevNotifications.map((notif) =>
                notif?.id === id ? { ...notif, fadeOut: true } : notif
            )
        );

        setTimeout(() => {
            setNotifications((prevNotifications) =>
                prevNotifications.filter((notif) => notif?.id !== id)
            );
        }, 1000); // Coincide con la duración de la animación
    };

    useEffect(() => {
        const timers = notifications.map((notification) =>
            setTimeout(() => handleRemoveNotification(notification?.id), 2000)
        );

        return () => timers.forEach(clearTimeout);
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
            case 'REACTION': return `${notification.reaction.user?.username} reacted to your post`;
            case 'COMMENT': return `${notification.comment.user?.username} commented on your post`;
            case 'FOLLOW': return `${notification.follower?.follower?.username} followed you`;
            case 'MENTION': return `${notification.post.user?.username} mentioned you in a post`;
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
            // Verifica si el nombre de usuario ya está en caché
            if (usernameCache[userId]) {
                return usernameCache[userId]; // Retorna el nombre de usuario desde el caché
            }

            const response = await axios.get(`http://localhost:1234/api/user/id/${userId}`);
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

    console.log(userActual?.username);

    useEffect(() => {
        const fetchFilteredNotifications = async () => {
            const notificationsWithUsernames = await Promise.all(notifications.map(async (notification) => {
                const username = await renderUsername(notification);
                return { ...notification, username };
            }));

            const filtered = notificationsWithUsernames.filter(notification => {
                const hasUserId = notification.user?.id;
                const isCurrentUser = userActual?.id === notification.user?.id;
                const isNotCurrentUser = notification.username !== userActual?.username;
                return hasUserId && isCurrentUser && isNotCurrentUser;
            });

            setFilteredNotifications(filtered);
        };

        fetchFilteredNotifications();
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

    return (
        <div className='absolute top-20 left-5 z-10 w-[300px] p-4 rounded-lg'>
            <ul className='flex flex-col gap-y-4'>
                {filteredNotifications.map((notification) => (
                    <li
                        key={notification?.id}
                        className={`${!darkMode ? 'bg-gray-700 text-white' : 'bg-rose-200 text-rose-700'} 
                            p-2 rounded-lg text-center flex items-center gap-x-2 shadow-lg 
                            ${notification.fadeOut ? 'fade-out' : ''} transition-all duration-300`}
                        onClick={() => window.location.href = link || '#'}
                    >
                        {profilePhoto ? (
                            <img
                                src={profilePhoto}
                                alt={"fotoUser"}
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
                ))}
            </ul>
        </div>
    );
};

export default NotificationSocket;