package ru.kata.spring.boot_security.demo.entity;

import javax.validation.Valid;
import java.util.ArrayList;
import java.util.List;

public class MyList {

    @Valid
    private List<User> userList = new ArrayList<>();

    @Valid
    private List<Role> roleList = new ArrayList<>();

    public List<User> getUserList() {
        return userList;
    }

    public void setUserList(List<User> userList) {
        this.userList = userList;
    }

    public List<Role> getRoleList() {
        return roleList;
    }

    public void setRoleList(List<Role> roleList) {
        this.roleList = roleList;
    }

}
