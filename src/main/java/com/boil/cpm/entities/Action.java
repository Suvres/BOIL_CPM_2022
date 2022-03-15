package com.boil.cpm.entities;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class Action {

    private String name;

    private int durationInHours;

    private String[] predecessors;

    private Node endNode;

    public Action() {
    }

    public Action(String name, int durationInHours, String[] predecessors) {
        this.name = name;
        this.durationInHours = durationInHours;
        this.predecessors = predecessors;
    }

    @Override
    public String toString() {
        return "name='" + name + '\'' +
                ", endNode=\n" + endNode;
    }
}
