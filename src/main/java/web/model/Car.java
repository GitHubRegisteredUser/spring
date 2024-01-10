package web.model;

public class Car {

    private int id;

    private String model;

    private int series;

    public Car(int id, String model, int series) {
        this.id = id;
        this.model = model;
        this.series = series;
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
