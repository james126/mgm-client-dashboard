//
// function updateOnLoad(){
//     //Spring security is not updating the URL on forwarding
//     const currentUrl = window.location.href;
//     if (currentUrl.endsWith("/login")){
//         history.pushState("/admin","Mr Grass Master", currentUrl.replaceAll("/login","/admin"));
//     }
// }
//
// function viewNext() {
//     const id = document.getElementById("contact.ts-form").getAttribute("data-id");
//     let data = {
//         "id": id
//     };
//
//     const currentUrl = window.location.href;
//     let url= '';
//
//     if (currentUrl.endsWith("/admin")) {
//         history.pushState("admin","Mr Grass Master", currentUrl.concat("/view-next"));
//         url =  currentUrl.concat("/view-next");
//     } else if (currentUrl.endsWith("/admin/delete")) {
//         history.pushState("admin","Mr Grass Master", currentUrl.replaceAll("/admin/delete","/admin/view-next"));
//         url =  currentUrl.replaceAll("/admin/delete","/admin/view-next");
//     } else if (currentUrl.endsWith("/admin/view-next")) {
//         url = currentUrl;
//     }
//
//    fetch(url, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//             'Content-Type': 'application/json'
//         },
//         body: JSON.stringify(data),
//     })
//         .then(response => response.text())
//         .then(text => updateForm(text))
//        .then(res => {
//            //remove focus
//            setTimeout(() => {
//                document.getElementById("view-next-button").blur();
//            }, 500);
//        })
//         .catch(error => console.error('Error:', error));
// }
//
// function deleteForm() {
//     const id = document.getElementById("contact.ts-form").getAttribute("data-id");
//     let data = {
//         "id": id
//     };
//
//     const currentUrl = window.location.href;
//     let url= '';
//
//     if (currentUrl.endsWith("/admin")) {
//         history.pushState("admin","Mr Grass Master", currentUrl.concat("/delete"));
//         url =  currentUrl.concat("/delete");
//     } else if (currentUrl.endsWith("/admin/view-next")) {
//         history.pushState("admin","Mr Grass Master", currentUrl.replaceAll("/admin/view-next","/admin/delete"));
//         url =  currentUrl.replaceAll("/admin/view-next","/admin/delete");
//     } else if (currentUrl.endsWith("/admin/delete")) {
//         url =  currentUrl;
//     }
//
//     fetch(url, {
//         method: 'POST',
//         credentials: 'include',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//     })
//         .then(response => response.text())
//         .then(text => updateForm(text))
//         .then(res => {
//             //remove focus
//             setTimeout(() => {
//                 document.getElementById("delete-button").blur();
//             }, 500);
//         })
//         .catch(error => console.error('Error:', error));
// }
//
// function updateForm(text) {
//     const json = JSON.parse(text);
//     document.getElementById("first_name").setAttribute("value", json["first_name"] != null ? json["first_name"] : "N/A");
//     document.getElementById("last_name").setAttribute("value", json["last_name"] != null ? json["last_name"] : "N/A");
//     document.getElementById("email").setAttribute("value", json["email"] != null ? json["email"] : "N/A");
//     document.getElementById("phone").setAttribute("value", json["phone"] != null ? json["phone"] : "N/A");
//     document.getElementById("address_line1").setAttribute("value", json["address_line1"] != null ? json["address_line1"] : "N/A");
//     document.getElementById("address_line2").setAttribute("value", json["address_line2"] != null ? json["address_line2"] : "N/A");
//     document.getElementById("message").value = json["message"] != null ? json["message"] : "N/A";
//     document.getElementById("contact.ts-form").setAttribute("data-id", json["id"] > -1 ? json["id"] : "0");
//
//     if (!(json["id"] > -1)){
//         document.getElementById("city-label").innerHTML = "N/A";
//         document.getElementById("country-label").innerHTML = "N/A";
//
//     } else {
//         document.getElementById("city-label").innerHTML = "Auckland";
//         document.getElementById("country-label").innerHTML = "New Zealand";
//     }
// }
