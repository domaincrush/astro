/* Getting the html file elements */
let newuserdata = document.getElementById("userdata");
let users   //Database users in birthdata

async function getUsers() {
    let url = '../database/birthdatas.json';
    try {
        let res = await fetch(url);
        return await res.json();
    } catch (error) {
        console.log(error);
    }
}

async function showOldUserSection(){
    users = await getUsers();
    //Add options for dropdown using safe DOM methods
    let container = document.querySelector('#existingUserList');
    // Clear existing options safely
    container.textContent = '';
    
    for (const [key, value] of Object.entries(users)) {
        let option = document.createElement('option');
        option.textContent = key; // Safe text assignment, no HTML injection possible
        container.appendChild(option);
      }
    //Remove the input option section and display dropdown for old user list
    document.getElementById("c_inputoption").style.display = "none";
    document.getElementById("olduserdata").style.display = "block";
}

function showNewUserSection(){
    document.getElementById("c_inputoption").style.display = "none";
    document.getElementById("newuserdata").style.display = "block";
}







