import { Spinner } from "@chakra-ui/react";


export default function LoadingIndicator () {

    return (
        <div style={{width:'100vw', height:'100vh', backgroundColor:'white', display:'flex', alignItems:'center', justifyContent:'center'}}>
            <Spinner />
        </div>
    )
}