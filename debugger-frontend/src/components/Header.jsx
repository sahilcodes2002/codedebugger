import React from "react";
import ss from "../images/logo.png";
const Header = () => {
    return(
        <>
        <div className="dashboard-header">
            <div class="logo-wrapper"><div class="logo-image"><img className="rounded-md mt-2" src={ss} alt="Design" /></div><div class="logo-text">OPPORTUNITREE</div></div>
        </div>
        </>
    )
}

export default Header;