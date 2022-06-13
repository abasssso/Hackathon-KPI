const API = "http://localhost:8000/posts";

let inpName = document.getElementById("name");
let inpSurname = document.getElementById("surname");
let inpContacts = document.getElementById("contacts");
let inpWeek = document.getElementById("week");
let inpMonth = document.getElementById("month");
let btnCreate = document.getElementById("create-user");
// console.log(
//   inpName,
//   inpSurname,
//   inpContacts,
//   inpWeek,
//   inpMonth,
//   btnCreate
// );

btnCreate.addEventListener("click", async function () {
  let newUser = {
    name: inpName.value,
    surname: inpSurname.value,
    contacts: inpContacts.value,
    week: inpWeek.value,
    month: inpMonth.value,
  };

  if (inpName.value.trim() === "") {
    alert("type in the name");
    return;
  }
  if (inpSurname.value.trim() === "") {
    alert("type in the surname");
    return;
  }
  if (inpContacts.value.trim() === "") {
    alert("type in the contacts");
    return;
  }
  if (inpWeek.value.trim() === "") {
    alert("type in the week KPI");
    return;
  }
  if (inpMonth.value.trim() === "") {
    alert("type in the month KPI");
    return;
  }
  console.log(newUser);

  await fetch(API, {
    method: "POST",
    body: JSON.stringify(newUser),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });

  getUsers();
  inpName.value = "";
  inpSurname.value = "";
  inpContacts.value = "";
  inpWeek.value = "";
  inpMonth.value = "";
});
let list = document.getElementById("list");
let inpSearch = document.getElementById("inp-search");
let pagination = document.getElementById("pagination");
let page = 1;
inpSearch.addEventListener("input", function () {
  getUsers();
});

async function getUsers() {
  let response = await fetch(
    `${API}?q=${inpSearch.value}&_page=${inpSearch.value}${page}&_limit=3`
  )
    .then(res => res.json())
    .catch(err => console.log(err));

  let allUsers = await fetch(API)
    .then(res => res.json())
    .catch(err => console.log("Error"));
  let lastPage = Math.ceil(allUsers.length / 2);

  list.innerHTML = "";
  // console.log(response);
  response.forEach(item => {
    let newElem = document.createElement("div");
    newElem.id = item.id;
    newElem.innerHTML = `<span>${item.name}</span>
    <span>${item.surname}</span>
    <span>${item.contacts}</span>
    <span>${item.week}</span>
    <span>${item.month}</span>
    <button class='btn-delete'>Delete</button>
    <button class="btn-edit">Edit</button>`;
    list.append(newElem);
  });
  pagination.innerHTML = `<button ${
    page === 1 ? "disabled" : ""
  } id='btn-prev'>prev</button> <span>${page}</span><button ${
    page === lastPage ? "disabled" : ""
  } id='btn-next'>next</button>`;
}
getUsers();
document.addEventListener("click", async function (e) {
  if (e.target.className === "btn-delete") {
    let id = e.target.parentNode.id;
    await fetch(`${API}/${id}`, {
      method: "DELETE",
    });
    getUsers();
  }
  if (e.target.className === "btn-edit") {
    modalEdit.style.display = "flex";
    let id = e.target.parentNode.id;
    let response = await fetch(`${API}/${id}`)
      .then(res => res.json())
      .catch(err => console.log(err));
    console.log(response);
    inpEditName.value = response.name;
    inpEditSurname.value = response.surname;
    inpEditContacts.value = response.contacts;
    inpEditWeek.value = response.week;
    inpEditMonth.value = response.month;
    inpEditedId.value = response.id;
  }
  if (e.target.id === "btn-next") {
    page++;
    getUsers();
  }

  if (e.target.id === "btn-prev") {
    page--;
    getUsers();
  }
});

// !UPDATE
let modalEdit = document.getElementById("modal-edit");
let modalEditClose = document.getElementById("modal-edit-close");
let inpEditName = document.getElementById("inp-edit-name");
let inpEditSurname = document.getElementById("inp-edit-surname");
let inpEditContacts = document.getElementById("inp-edit-contacts");
let inpEditWeek = document.getElementById("inp-edit-week");
let inpEditMonth = document.getElementById("inp-edit-month");
let btnSaveEdit = document.getElementById("btn-save-edit");
let inpEditedId = document.getElementById("inpEditedId");

modalEditClose.addEventListener("click", function () {
  modalEdit.style.display = "none";
});

btnSaveEdit.addEventListener("click", async function () {
  let editedUser = {
    name: inpEditName.value,
    surname: inpEditSurname.value,
    contacts: inpEditContacts.value,
    week: inpEditWeek.value,
    month: inpEditMonth.value,
  };
  console.log(editedUser, "edited");
  let id = inpEditedId.value;

  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedUser),
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  console.log(editedUser, "editeed");
  modalEdit.style.display = "none";
  getUsers();
  location.reload();
});
