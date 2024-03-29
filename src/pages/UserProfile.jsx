import EditOwnProfile from "../components/Forms/EditOwnProfile";
import HeaderScrum from "../components/Headers/HeaderScrum";
import Footer from "../components/Footers/Footer";
import AlertsMessage from "../components/somemodals/messagesModal/AlertsMessage";
import { useParams } from "react-router-dom";
import UsersStatistics from "../components/UserStatistics/UsersStatistics";
import userProfileTypeStore from "../stores/userProfileTypeStore";
import { userStore } from "../stores/userStore";

export default function UserProfile() {
   const { username } = useParams();
   const userProfileType = userProfileTypeStore.getState().userProfileType;
   const user = userStore.getState().user;

   return (
      <>
         <HeaderScrum />
         <div id="container-userProfile">
            <div id="userInformation">
               <EditOwnProfile username={username} />
               <UsersStatistics />
            </div>
            {userProfileType === "userCard" && user.role === "productOwner" && (
               <div id="container-btns-userProfile">
                  <button>Permanently delete</button>
                  <button>Delete tasks</button>
               </div>
            )}
         </div>
         <Footer />
         <AlertsMessage />
      </>
   );
}
