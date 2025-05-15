import LeftLogin from "../components/LeftLogin/LeftLogin.tsx";
import RightLogin from "../components/RightLogin/RightLogin.tsx";
import { Flex } from "antd";
function LoginPage(){
    return(
        <Flex>
            <LeftLogin></LeftLogin>
            <RightLogin></RightLogin>
        </Flex>
    )
}

export default LoginPage;