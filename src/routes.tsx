
import App from "./App";
import {createBrowserRouter} from "react-router-dom";
import {SignIn} from "./features/auth/SignIn/ui/SignIn";
import Chat from "./features/chat/ui/Chat";


const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path:'/',
                element:<SignIn/>
            },
            {
                path:'/chat',
                element:<Chat/>
            }
        ]
    },

],{
    basename: '/greet-api-WhatsApp'
});

export default router;
