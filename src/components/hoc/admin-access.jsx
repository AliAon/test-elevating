import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const adminAccess = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem("user"));
      } catch (err) {
        user = null;
      }
      if (
        !user ||
        (user.user_type_name !== "admin" &&
          user.user_type_name !== "superadmin")
      ) {
        const target = "/dashboard";
        if (location.pathname !== target) {
          navigate(target, { replace: true });
        }
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }

      setIsLoading(false);
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

  return AuthenticatedComponent;
};

export default adminAccess;
