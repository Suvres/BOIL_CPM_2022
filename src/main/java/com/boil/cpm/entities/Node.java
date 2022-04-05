package com.boil.cpm.entities;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;


@Getter
@Setter
public class Node {

    private int id;

    private LocalDateTime start, finish;

    private int timeGapInHours;

    private List<Action> actionsOut;

    boolean critical;

    public Node() {
        actionsOut = new ArrayList<>();
    }

    public Node(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public void addActionsOut(Action action){
        if(actionsOut == null)
            actionsOut = new ArrayList<>();

        actionsOut.add(action);
    }

    @Override
    public String toString() {
        return "id=" + id +
                ", startTime = "+start+
                "\n, endTime = "+finish+
                "\n, timeGap = "+timeGapInHours+
                "\n, actionsOut=\n" + actionsOut;
    }
}
