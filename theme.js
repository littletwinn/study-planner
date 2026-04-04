document.addEventListener("DOMContentLoaded", function(){

    const toggle = document.getElementById("modeToggle");
    if(!toggle) return;

    const currentFile = window.location.pathname.split("/").pop();

    toggle.checked = (currentFile === "read.html");

    toggle.addEventListener("change", function(){

        if(this.checked){
            window.location.href = "read.html";
        }else{
            window.location.href = "index.html";
        }

    });

});