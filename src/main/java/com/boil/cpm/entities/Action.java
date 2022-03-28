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

    boolean critical;

    public Action() {
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getDurationInHours() {
        return durationInHours;
    }

    public void setDurationInHours(int durationInHours) {
        this.durationInHours = durationInHours;
    }

    public String[] getPredecessors() {
        return predecessors;
    }

    public void setPredecessors(String[] predecessors) {
        this.predecessors = predecessors;
    }

    public Node getEndNode() {
        return endNode;
    }

    public void setEndNode(Node endNode) {
        this.endNode = endNode;
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
