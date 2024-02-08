package ru.kata.spring.boot_security.demo.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import ru.kata.spring.boot_security.demo.entity.MyList;
import ru.kata.spring.boot_security.demo.entity.Role;
import ru.kata.spring.boot_security.demo.entity.User;
import ru.kata.spring.boot_security.demo.service.RoleService;
import ru.kata.spring.boot_security.demo.service.UserService;

import javax.validation.Valid;
import java.util.List;

@Controller
@RequestMapping("/admin")
public class AdminController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public AdminController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }

    @GetMapping("")
    public String showAllUsers(Model model) {
        MyList myList = new MyList();
        myList.setUserList(userService.getAllUsers());
        myList.setRoleList(roleService.getAllRoles());
        model.addAttribute("myList", myList);
        return "admin";
    }

    @GetMapping("/addUser")
    public String addUser(Model model) {
        User user = new User();
        List<Role> allRoles = roleService.getAllRoles();
        model.addAttribute("user", user);
        model.addAttribute("allRoles", allRoles);
        return "add-user";
    }

    @PostMapping("/saveUser")
    public String saveUser(@Valid @ModelAttribute("user") User user,
                           BindingResult userBindingResult, Model model) {
        if (userBindingResult.hasErrors()) {
            List<Role> allRoles = roleService.getAllRoles();
            model.addAttribute("allRoles", allRoles);
            return "add-user";
        }

        userService.saveUser(user);
        return "redirect:/admin";
    }

    @PatchMapping("/updateUsers")
    public String updateUsers(@Valid @ModelAttribute("myList") MyList myList,
                              BindingResult bindingResult, Model model) {
        if (bindingResult.hasErrors()) {
            myList = new MyList();
            myList.setUserList(userService.getAllUsers());
            myList.setRoleList(roleService.getAllRoles());
            model.addAttribute("myList", myList);
            return "admin";
        }

        userService.updateAll(myList.getUserList());
        return "redirect:/admin";
    }

    @DeleteMapping("/deleteUser")
    public String deleteUser(@RequestParam("id") long id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

}
