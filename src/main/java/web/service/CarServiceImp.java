package web.service;

import org.springframework.stereotype.Service;
import web.model.Car;

import java.util.LinkedList;
import java.util.List;

@Service
public class CarServiceImp implements CarService {

    private final List<Car> cars;

    {
        cars = new LinkedList<>();
        cars.add(new Car(1, "Model1", 1));
        cars.add(new Car(2, "Model2", 2));
        cars.add(new Car(3, "Model3", 3));
        cars.add(new Car(4, "Model4", 4));
        cars.add(new Car(5, "Model5", 5));
    }

    @Override
    public List<Car> listCars(Integer count) {
        return cars.subList(0, count);
    }
}
