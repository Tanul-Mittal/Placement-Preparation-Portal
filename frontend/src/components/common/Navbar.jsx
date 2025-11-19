import React from "react";
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
    // profile slice se user nikal ke print karte hain
    const user = useSelector((state) => state.profile.user);
    const navigate = useNavigate();
    console.log("Navbar.jsx user:", user);
    
    return (
        <nav className="w-full px-6 py-3 bg-white shadow-sm flex items-center justify-between">
            {/* Left Logo */}
            <div className="flex items-center gap-3">
                {/* <img 
                    src="/logo.png"         
                    alt="logo" 
                    className="h-10 w-10 object-cover"
                /> */}
                <span className="font-semibold text-lg">My App</span>
            </div>

            {/* Right Email + Profile */}
            <div className="flex items-center gap-4">
                <p className="text-sm font-medium">{user?.email}</p>

                <img 
                    src="https://i.pravatar.cc/50"   
                    alt="profile"
                    className="h-10 w-10 rounded-full object-cover border cursor-pointer hover:ring-2 hover:ring-blue-500 transition-all"
                    onClick={() => navigate("/profile")}
                />

                <Link
                    to="/logout"
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
                >
                    Logout
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
