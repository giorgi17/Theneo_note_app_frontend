import { GlobalToken } from 'antd';
import useToken from 'antd/es/theme/useToken';

export const useDesignTokens = (): GlobalToken => {
    const result = useToken();

    return result[1];
};
