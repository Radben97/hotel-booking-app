import { Link } from "react-router";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";
const Header = () => {
    const { isLoggedIn } = useAppContext()
    const styles = "flex bg-white items-center text-blue-600 px-3 font-bold hover:bg-gray-300 hover:text-green-600"
  return (
      <div className="bg-blue-800 py-6">
          <div className="container mx-auto flex justify-between">
              <span className="text-3xl text-white font-bold tracking-tight">
                  <Link to="/">Holidays.com</Link>
              </span>
              <span className="flex space-x-2">
                  {isLoggedIn ? <>
                    <Link to="/my-bookings" className={styles}>My bookings</Link>
                      <Link to="/my-hotels" className={styles}>My hotels</Link>
                      <SignOutButton />
                  </> : (<Link to="/sign-in"className={styles}>Sign In</Link>)}
              </span>
          </div>
    </div>
  )
}

export default Header