import { Route, Routes } from "react-router-dom";
import Signup from "./components/authentication/Signup";
import Navbar from "./components/common/Navbar";
import { useSelector } from "react-redux";
import VerifyOtp from "./components/authentication/VerifyOtp";
import Login from "./components/authentication/Login";
import ForgotPassword from "./components/authentication/ForgotPassword";
import Footer from "./components/common/Footer";
import UpdatePassword from "./components/authentication/UpdatePassword";
import NotFound from "./components/Error/NotFound"
import HomePage from "./components/Home/HomePage"
import Logout from "./components/authentication/Logout"
import { Toaster } from "react-hot-toast";



function App() {
    const { user, lightMode } = useSelector((state) => state.profile);

    console.log(user,lightMode)

    return (
        <div
            className={`App  min-h-screen flex flex-col ${
                lightMode
                    ? "bg-white text-gray-700"
                    : "bg-gray-800 text-gray-200"
            }`}
        >
            {user && <Navbar />}
            <main className="">
                <Routes>
                    {/* Routes for unauthenticated users */}
                    {!user && (
                        <>
                            <Route path="/signup" element={<Signup />} />
                            <Route path="/verifyotp" element={<VerifyOtp />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/" element={<Login />} />
                            <Route
                                path="/forgotpassword"
                                element={<ForgotPassword />}
                            />
                            <Route
                                path="/update-password/:token"
                                element={<UpdatePassword />}
                            />
                        </>
                    )}

                    {/* Routes for authenticated users */}
                    {user && (
                        <>
                            <Route
                                path="/"
                                element={<HomePage />}
                            />
                        </>
                    )}
                    <Route
                        path="/logout"
                        element={<Logout />}
                    />

                    {/* Fallback route for unknown paths */}
                    <Route path="/*" element={<NotFound />} />
                </Routes>
            </main>
            {user && <Footer />}
            <Toaster position="top-center" />
        </div>
    );
}

export default App;
