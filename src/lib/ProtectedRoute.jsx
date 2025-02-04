import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = () => {
    const user = useSelector((state) => state.auth.user);

    return user ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
