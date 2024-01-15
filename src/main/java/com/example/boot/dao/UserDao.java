package com.example.boot.dao;

import com.example.boot.entity.User;

import java.util.List;

public interface UserDao {

    List<User> getAllUsers();

    void saveUser(User user);

    User getUser(long id);

    void updateUser(User user);

    void deleteUser(long id);

}
