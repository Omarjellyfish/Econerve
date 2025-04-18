import { LoginContext } from "../../Context/Login/Login";
import { useContext } from "react";
function NavBar (){
    const { setIsAuthenticated } = useContext(LoginContext);
    function logOut() {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
      }
    return (
        <nav className="nav-bar">
            <div className="left">

            </div>
            <div className="right">
                <button className="log" onClick={logOut}>Log Out</button>
            </div>
        </nav>
    )
}
export {NavBar};