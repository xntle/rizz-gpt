import { useRouter } from "next/navigation";
import { UserAuth } from "./auth/page";
import {React, useEffect} from "react";

const withAuth = (Component) => {
  return function AuthenticatedComponent(props) {
    const { user, loading } = UserAuth();
    const router = useRouter();

     useEffect(() => {
       if (!loading && !user) {
         router.replace("/auth");
       }
     }, [loading, user, router]);

    if (loading) {
      return <div>You need to sign up to get started</div>; 
    }

    if (!user) {
      return null; 
    }

    return <Component {...props} />;
  };
};

export default withAuth;
