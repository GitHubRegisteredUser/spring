package ru.kata.spring.boot_security.demo.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import ru.kata.spring.boot_security.demo.dao.UserRepository;
import ru.kata.spring.boot_security.demo.entity.User;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserServiceImp implements UserService {

    private final UserRepository userRepository;
    private final RoleService roleService;
    private final BCryptPasswordEncoder encoder;

    @Autowired
    public UserServiceImp(UserRepository userRepository, RoleService roleService, BCryptPasswordEncoder encoder) {
        this.userRepository = userRepository;
        this.roleService = roleService;
        this.encoder = encoder;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return userRepository.findByUsername(username);
    }

    @Override
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    @Transactional
    public void saveUser(User user) {
        User existingUser = userRepository.findByUsername(user.getUsername());
        if (existingUser != null) {
            throw new RuntimeException("User with this email already exists");
        }

        user.setRoles(user.getRoles().stream()
                .map(r -> roleService.findByName(r.getName()) == null
                        ? r : roleService.findByName(r.getName()))
                .collect(Collectors.toSet()));
        user.setPassword(encoder.encode(user.getPassword()));

        userRepository.save(user);
    }

    @Override
    public User getUser(long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isEmpty()) {
            throw new RuntimeException("User with id = " + id + " does not exist");
        }

        return user.get();
    }

    @Override
    @Transactional
    public void updateUser(User user) {
        user.setRoles(user.getRoles().stream()
                .map(r -> roleService.findByName(r.getName()) == null
                        ? r : roleService.findByName(r.getName()))
                .collect(Collectors.toSet()));
        user.setPassword(encoder.encode(user.getPassword()));

        userRepository.save(user);
    }

    @Override
    @Transactional
    public void deleteUser(long id) {
        userRepository.deleteById(id);
    }

}
