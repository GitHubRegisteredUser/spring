package ru.kata.spring.boot_security.demo.dao;

import org.springframework.stereotype.Repository;
import ru.kata.spring.boot_security.demo.entity.Role;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.List;

@Repository
public class RoleDaoImp implements RoleDao {

    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Role findByName(String name) {
        List<Role> roles = entityManager
                .createQuery("SELECT r FROM Role r where r.name = '" + name + "'", Role.class)
                .getResultList();

        if (roles.isEmpty()) {
            return null;
        }

        return roles.get(0);
    }

    @Override
    public void saveRole(Role role) {
        entityManager.persist(role);
    }

}
