import LeftLogin from "../components/LeftLogin.tsx";
import RightLogin from "../components/RightLogin.tsx";
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