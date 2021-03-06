document.addEventListener("DOMContentLoaded", function initialiseBasePage(){
    var seasonLinks = document.getElementsByClassName("nav-season");
    
    for(let i = 0; i< seasonLinks.length; i++){
        seasonLinks[i].addEventListener("mouseover", () => showDropdownMenu(seasonLinks[i].dataset.seasonNumber));
        seasonLinks[i].addEventListener("mouseleave", () => hideDropdownMenu(seasonLinks[i].dataset.seasonNumber));
    }

    var seasonMenus = document.getElementsByClassName("season-menu");
    
    for(let i = 0; i< seasonMenus.length; i++){
        seasonMenus[i].addEventListener("mouseover", () => showDropdownMenu(seasonMenus[i].dataset.seasonNumber));
        seasonMenus[i].addEventListener("mouseleave", () => hideDropdownMenu(seasonMenus[i].dataset.seasonNumber));
    }
    
    document.getElementsByClassName("banner-dropdown-container")[0].style.visibility = "hidden";
});

function showDropdownMenu(id){
    console.log("MOUSEOVER", id);

    document.getElementsByClassName("banner-dropdown-container")[0].style.visibility = "visible";

    var dropdowns = document.getElementsByClassName("season-menu");
    for(let i = 0; i< dropdowns.length; i++){
        dropdowns[i].style.visibility = "hidden";
    }

    document.getElementById("dropdown-menu-season-" + id).style.visibility = "visible";
}

function hideDropdownMenu(id){
    console.log("mouseleave", id);

    document.getElementsByClassName("banner-dropdown-container")[0].style.visibility = "hidden";

    var dropdowns = document.getElementsByClassName("season-menu");
    for(let i = 0; i< dropdowns.length; i++){
        dropdowns[i].style.visibility = "hidden";
    }

    document.getElementById("dropdown-menu-season-" + id).style.visibility = "hidden";
}