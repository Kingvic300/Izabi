import { io, Socket } from 'socket.io-client';
import { BASE_URL } from '@/constants';

let socket: Socket | null = null;

export const getLeaderboardSocket = () => {
    if (!socket) {
        socket = io(BASE_URL, {
            withCredentials: true,
            transports: ['websocket', 'polling'],
        });
    }
    return socket;
};

export const disconnectLeaderboardSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
