$(async function () {
    await getTableWithUsers();
    await getUserInfo();
    await getNewUserForm();
    await addNewUser();
    await getDefaultModal();
})

async function getTableWithUsers() {
    let table = $('#mainTable tbody');
    table.empty();

    await userFetchService.getAllUsers()
        .then(res => res.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.username}</td>
                            <td>${user.roles.map(role => role.name.replace("ROLE_", "")).join(', ')}</td>     
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit"
                                class="btn text-white" style="background-color: #00AABB"
                                data-toggle="modal" data-target="#defaultModal">
                                Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete"
                                class="btn btn-danger text-white" 
                                data-toggle="modal" data-target="#defaultModal">
                                Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    $("#mainTable").find('button').on('click', (event) => {
        let defaultModal = $('#defaultModal');
        let targetButton = $(event.target);
        let userIdButton = targetButton.attr('data-userid');
        let actionButton = targetButton.attr('data-action');
        defaultModal.attr('data-userid', userIdButton);
        defaultModal.attr('data-action', actionButton);
        defaultModal.modal('show');
    })
}

async function getUserInfo() {
    let table = $('#userTable tbody');
    table.empty();

    await userFetchService.getCurrentUser()
        .then(res => res.json())
        .then(user => {
            let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td>
                            <td>${user.username}</td>
                            <td>${user.roles.map(role => role.name.replace("ROLE_", "")).join(', ')}</td>     
                        </tr>
                )`;
            table.append(tableFilling);
        })
}

async function getNewUserForm() {
    let button = $(`#newUserFormButton`);
    let form = $(`#defaultForm`)
    let select = $('#roles_a');

    await roleFetchService.getAllRoles()
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                let selectFilling = `$(
                <option value="${role.name}">${role.name.replace("ROLE_", "")}</option>
                )`;
                select.append(selectFilling);
            })
        })

    button.on('click', () => {
        if (form.attr("data-hidden") === "true") {
            form.attr('data-hidden', 'false');
            document.getElementById("specialDiv").style.borderStyle = "solid";
            document.getElementById("specialDiv").style.borderWidth = "1px 1px 1px 1px";
            document.getElementById("specialDiv").style.borderColor = "#E0E0E0";
            form.show();
            button.text('Hide');
        } else {
            form.attr('data-hidden', 'true');
            document.getElementById("specialDiv").style.borderStyle = "none";
            form.hide();
            button.text('New user');
        }
    })
}

async function addNewUser() {
    $('#addNewUserButton').click(async () => {
        let newUserForm = $('#defaultForm')
        let firstName = newUserForm.find('#first_name_a').val()
        let lastName = newUserForm.find('#last_name_a').val()
        let age = newUserForm.find('#age_a').val()
        let username = newUserForm.find('#username_a').val()
        let password = newUserForm.find('#password_a').val()
        let roles = newUserForm.find('#roles_a').val()
        let data = {
            firstName: firstName,
            lastName: lastName,
            age: age,
            username: username,
            password: password,
            roles: roles
        }
        const response = await userFetchService.saveUser(data);

        if (response.ok) {
            await getTableWithUsers();
            newUserForm.find('#first_name_a').val('');
            newUserForm.find('#last_name_a').val('');
            newUserForm.find('#age_a').val('');
            newUserForm.find('#username_a').val('');
            newUserForm.find('#password_a').val('');
            newUserForm.find('#roles_a').val('');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show" role="alert" id="addErrorMessage">
                            ${JSON.stringify(body).replace(/[{\[}\]":]|(info)/g, "").replace(/,/g, "<br>")}
                            <button type="button" class="btn btn-close" data-bs-dismiss="alert">
                            </button>
                        </div>`;
            newUserForm.prepend(alert)
        }
    })
}

async function getDefaultModal() {
    $('#defaultModal').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userId = thisModal.attr('data-userId');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userId);
                break;
            case 'delete':
                deleteUser(thisModal, userId);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

async function editUser(modal, id) {
    let preUser = await userFetchService.getUser(id);
    let user = preUser.json();

    modal.find('.modal-title').html('Edit user');
    let closeButton = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    let editButton = `<button class="btn btn-primary" id="editButton">Edit</button>`;
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(editButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="editUser">
                <div class="row">
                    <div class="row">
                        <label for="id_e"
                               class="fw-bold text-center">Id</label>
                        <div class="d-flex justify-content-center">
                            <input type="text"
                                   class="form-control mb-3 w-50 border"
                                   style="background-color: #e0e0e0"
                                   value="${user.id}"
                                   id="id_e"
                                   placeholder="Id"
                                   readonly>
                        </div>
                    </div>
                    <div class="row">
                        <label for="first_name_e"
                               class="fw-bold text-center mt-1">First
                            name</label>
                        <div class="d-flex justify-content-center">
                            <input type="text"
                                   class="form-control mb-3 w-50"
                                   value="${user.firstName}"
                                   id="first_name_e"
                                   placeholder="First name">
                        </div>
                    </div>
                    <div class="row">
                        <label for="last_name_e"
                               class="fw-bold text-center">Last
                            name</label>
                        <div class="d-flex justify-content-center">
                            <input type="text"
                                   class="form-control mb-3 w-50"
                                   value="${user.lastName}"
                                   id="last_name_e"
                                   placeholder="Last name">
                        </div>
                    </div>
                    <div class="row">
                        <label for="age_e"
                               class="fw-bold text-center">Age</label>
                        <div class="d-flex justify-content-center">
                            <input type="number"
                                   class="form-control mb-3 w-50"
                                   value="${user.age}"
                                   id="age_e"
                                   placeholder="Age">
                        </div>
                    </div>
                    <div class="row">
                        <label for="username_e"
                               class="fw-bold text-center">Email</label>
                        <div class="d-flex justify-content-center">
                            <input type="text"
                                   class="form-control mb-3 w-50"
                                   value="${user.username}"
                                   id="username_e"
                                   placeholder="Email">
                        </div>
                    </div>
                    <div class="row">
                        <label for="password_e"
                               class="fw-bold text-center">Password</label>
                        <div class="d-flex justify-content-center">
                            <input type="password"
                                   class="form-control mb-3 w-50"
                                   value="${user.password}"
                                   id="password_e"
                                   placeholder="Password">
                        </div>
                    </div>
                    <div class="row">
                        <label for="roles_e"
                               class="fw-bold text-center">Roles</label>
                        <div class="d-flex justify-content-center">
                            <select class="form-select mb-3 w-50"
                                    style="height: 58px"
                                    id="roles_e"
                                    multiple="multiple">
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    await roleFetchService.getAllRoles()
        .then(res => res.json())
        .then(roles => {
            roles.forEach(role => {
                let eSelectFilling = `$(
                <option value="${role.name}">${role.name.replace("ROLE_", "")}</option>
                )`;
                modal.find($('#roles_e')).append(eSelectFilling);
            })
        })

    $("#editButton").on('click', async () => {
        let id = modal.find("#id_e").val();
        let firstName = modal.find("#first_name_e").val();
        let lastName = modal.find("#last_name_e").val();
        let age = modal.find("#age_e").val();
        let username = modal.find("#username_e").val();
        let password = modal.find("#password_e").val();
        let roles = modal.find("#roles_e").val();
        let data = {
            id: id,
            firstName: firstName,
            lastName: lastName,
            age: age,
            username: username,
            password: password,
            roles: roles
        }
        const response = await userFetchService.updateUser(data, id);

        if (response.ok) {
            await getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show" role="alert" id="editErrorMessage">
                            ${JSON.stringify(body).replace(/[{\[}\]":]|(info)/g, "").replace(/,/g, "<br>")}
                            <button type="button" class="btn btn-close" data-bs-dismiss="alert">
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}

async function deleteUser(modal, id) {
    let preUser = await userFetchService.getUser(id);
    let user = preUser.json();

    modal.find('.modal-title').html('Delete user');
    let closeButton = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`
    let deleteButton = `<button class="btn btn-danger" id="deleteButton">Delete</button>`;
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(deleteButton);

    user.then(user => {
        let bodyForm = `
            <form class="form-group" id="editUser">
                <div class="row">
                    <div class="row">
                        <label for="id_d"
                               class="fw-bold text-center">Id</label>
                        <div class="d-flex justify-content-center">
                            <input type="text"
                                   class="form-control mb-3 w-50"
                                   value="${user.id}"
                                   id="id_d"
                                   placeholder="Id"
                                   disabled>
                        </div>
                    </div>
                    <div class="row">
                        <label for="first_name_d"
                               class="fw-bold text-center mt-1">First
                            name</label>
                        <div class="d-flex justify-content-center">
                            <input type="text"
                                   class="form-control mb-3 w-50"
                                   value="${user.firstName}"
                                   id="first_name_d"
                                   placeholder="First name"
                                   disabled>
                        </div>
                    </div>
                    <div class="row">
                        <label for="last_name_d"
                               class="fw-bold text-center">Last
                            name</label>
                        <div class="d-flex justify-content-center">
                            <input type="text"
                                   class="form-control mb-3 w-50"
                                   value="${user.lastName}"
                                   id="last_name_d"
                                   placeholder="Last Name"
                                   disabled>
                        </div>
                    </div>
                    <div class="row">
                        <label for="age_d"
                               class="fw-bold text-center">Age</label>
                        <div class="d-flex justify-content-center">
                            <input type="number"
                                   class="form-control mb-3 w-50"
                                   value="${user.age}"
                                   id="age_d"
                                   placeholder="Age"
                                   disabled>
                        </div>
                    </div>
                    <div class="row">
                        <label for="username_d"
                               class="fw-bold text-center">Email</label>
                        <div class="d-flex justify-content-center">
                            <input type="text"
                                   class="form-control mb-3 w-50"
                                   value="${user.username}"
                                   id="username_d"
                                   placeholder="Email"
                                   disabled>
                        </div>
                    </div>
                    <div class="row">
                        <label for="roles_d"
                               class="fw-bold text-center">Roles</label>
                        <div class="d-flex justify-content-center">
                            <select class="form-select mb-3 w-50"
                                    style="height: 58px"
                                    id="roles_d"
                                    multiple="multiple"
                                    disabled>
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        `;
        modal.find('.modal-body').append(bodyForm);

        user.roles.forEach(role => {
            let dSelectFilling = `$(
                <option value="${role.name}">${role.name.replace("ROLE_", "")}</option>
                )`;
            modal.find($('#roles_d')).append(dSelectFilling);
        })
    })

    $("#deleteButton").on('click', async () => {
        const response = await userFetchService.deleteUser(id);

        if (response.ok) {
            await getTableWithUsers();
            modal.modal('hide');
        } else {
            let body = await response.json();
            let alert = `<div class="alert alert-danger alert-dismissible fade show" role="alert" id="deleteErrorMessage">
                            ${JSON.stringify(body).replace(/[{\[}\]":]|(info)/g, "").replace(/,/g, "<br>")}
                            <button type="button" class="btn btn-close" data-bs-dismiss="alert">
                            </button>
                        </div>`;
            modal.find('.modal-body').prepend(alert);
        }
    })
}
