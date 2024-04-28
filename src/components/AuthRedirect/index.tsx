import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import PathConstants from '../../routes/pathConstants';
import { RootState } from '../../store';

const AuthRedirect = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
    return (props: P): JSX.Element | null => {
        const loggedIn = useSelector((state: RootState) => state.user.loggedIn);

        if (loggedIn) {
            return <Navigate to={PathConstants.HOME} />;
        }

        return <WrappedComponent {...props} />;
    };
};

export default AuthRedirect;
