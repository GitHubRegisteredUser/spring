package web.model;

import java.util.LinkedList;
import java.util.List;

public class Car {

    private int id;

    private String model;

    private int series;

    private static List<Car> cars;

    public Car() {
    }

    public Car(int id, String model, int series) {
        this.id = id;
        this.model = model;
        this.series = series;
    }

    static {
        cars = new LinkedList<>();
        cars.add(new Car(1, "Model1", 1));
        cars.add(new Car(2, "Model2", 2));
        cars.add(new Car(3, "Model3", 3));
        cars.add(new Car(4, "Model4", 4));
        cars.add(new Car(5, "Model5", 5));
    }

    public List<Car> getCars() {
        return cars;
    }

    public void setCars(List<Car> cars) {
        Car.cars = cars;
    }

    @Override
    public String toString() {
        return "Car{" +
                "id=" + id +
                ", model='" + model + '\'' +
                ", series=" + series +
                '}';
    }
}
