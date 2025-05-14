import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProfilePreview.css';
import { getUserIdFromCookie } from '../../helpers/utils';

export default function ProfilePreview({ visible }) {
    const navigate = useNavigate();
    const userId = getUserIdFromCookie();
    const [user, setUser] = React.useState(null);

    React.useEffect(() => {
        if (!visible || !userId) return;
        fetch(`${import.meta.env.VITE_API_URL}/users/${userId}/`)
            .then(res => res.json())
            .then(data => {
                if (data.username) setUser(data);
            })
            .catch(() => { });
    }, [visible, userId]);

    if (!visible || !user) return null;

    return (
        <div className="profile-preview">
            <div className="pp-header">
                <div className="pp-avatar">👤</div>
                <div className="pp-username">{user.username}</div>
            </div>
            <div className="pp-details">
                <p><strong>Name:</strong> {user.full_name}</p>
                <p><strong>Email:</strong> {user.email}</p>
            </div>
            <button
                className="pp-view-profile"
                onClick={() => navigate('/profile')}
            >
                View Profile
            </button>
        </div>
    );
}
