package web.service;

import org.springframework.stereotype.Service;
import web.model.Car;

import java.util.List;

@Service
public class CarServiceImp implements CarService {

    private final Car car = new Car();

    @Override
    public List<Car> listCars(Integer count) {
        return car.getCars().stream().limit(count).toList();
    }
}
