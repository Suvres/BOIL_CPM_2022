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

    public Node() {

        actionsOut = new ArrayList<>();

    }



    public void addActionsOut(Action action){
        if(actionsOut == null)
            actionsOut = new ArrayList<>();

        actionsOut.add(action);
    }

    @Override
    public String toString() {
        return "id=" + id +
                ", actionsOut=\n" + actionsOut;
    }
}
