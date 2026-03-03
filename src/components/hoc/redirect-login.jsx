/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const redirectLogin = (WrappedComponent) => {
  const AuthenticatedComponent = (props) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          const target = "/";
          if (location.pathname !== target) {
            navigate(target, { replace: true });
          }
        }
      } catch (err) {
        navigate("/", { replace: true });
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

    return <WrappedComponent {...props} />;
  };

  return AuthenticatedComponent;
};

export default redirectLogin;
