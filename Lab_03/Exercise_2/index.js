const button = document.getElementById("generate_button");
button.addEventListener("click", generate_password);

function generate_password() {
    const min_length = parseInt(document.getElementById("min_length").value);
    const max_length = parseInt(document.getElementById("max_length").value);
    const has_upper_case = document.getElementById("include_uppercase").checked;
    const has_special_char = document.getElementById("include_special_char").checked;

    const male_litery = "abcdefghijklmnoprstuwxyz";
    const cyfry = "0123456789"; 
    const wielkie_litery = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const znaki_specjalne = "!?@#$%^&*()_+";

    let pula_znakow = male_litery + cyfry;

    if (min_length > max_length){
        document.getElementById("generated_passwd").innerHTML = 
        "Błąd: Maksymalna długość nie może być mniejsza od minimalnej.";
        return;
    }
    
    if (has_upper_case){
        pula_znakow += wielkie_litery;
    }

    if (has_special_char){
        pula_znakow += znaki_specjalne;
    }

    const passwd_length = Math.floor(Math.random()*(max_length-min_length + 1)) + min_length;

    let passwd = "";
    for (let i = 0; i < passwd_length; i++) {
        let inx = Math.floor(Math.random()*pula_znakow.length);
        passwd += pula_znakow[inx];
    }
    
    document.getElementById("generated_passwd").innerHTML = passwd;
}   