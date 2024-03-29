import "./UsersStatistics.css";

export default function UsersStatistics() {
   return (
      <div id="userStatistics-container">
         <div className="banner_register" id="banner-userStatistics">
            <p id="usersStatistics-p">User Stats</p>
         </div>
         <div className="content_register" id="content-userStats">
            <div className="content-userStats-div">
               <div>Number of tasks:</div>
               <div className="content-userStats-span">10</div>
            </div>
            <div className="content-userStats-div">
               <div>Number of To Do tasks:</div>
               <div className="content-userStats-span">0</div>
            </div>
            <div className="content-userStats-div">
               <div>Number of Doing tasks:</div>
               <div className="content-userStats-span">0</div>
            </div>
            <div className="content-userStats-div">
               <div>Number of Done tasks:</div>
               <div className="content-userStats-span">0</div>
            </div>
         </div>
      </div>
   );
}
