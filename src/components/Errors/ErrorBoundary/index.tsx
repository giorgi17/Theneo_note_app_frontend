import { Alert } from 'antd';
const { ErrorBoundary } = Alert;
import { AppErrorBoundaryProps } from './interfaces';

const AppErrorBoundary: React.FC<AppErrorBoundaryProps> = ({ children }) => (
    <ErrorBoundary message="An error occured">{children}</ErrorBoundary>
);

export default AppErrorBoundary;
