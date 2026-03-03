/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const withAuth = (WrappedComponent) => {
  return (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          const target = "/";
          if (location.pathname !== target) {
            navigate(target, { replace: true });
          }
          setIsAuthenticated(false);
        } else {
          setIsAuthenticated(true);
        }
      } catch (err) {
        navigate("/", { replace: true });
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    }, [navigate, location.pathname]);

    if (isLoading) {
      return (
        <div className="h-screen flex items-center justify-center">
          <Loader className="animate-spin text-gray-500" />
        </div>
      );
    }

    return isAuthenticated ? <WrappedComponent {...props} /> : null;
  };
};

export default withAuth;
